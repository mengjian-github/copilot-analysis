const fs = require("fs");
const parser = require("@babel/parser");
const types = require("@babel/types");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

const NameMap = require('./name-map');

const source = fs.readFileSync(
  "./vendor/github.copilot-1.88.132/dist/extension.js",
  "utf8"
);

const ast = parser.parse(source);

function clearfyParams(moduleId, moduleSource) {
  if (moduleSource.trim().startsWith("function")) {
    // change `function(e, t, n) {` to `(e, t, n) => {`
    moduleSource = moduleSource.replace("function", "");
    moduleSource = moduleSource.replace(")", ") =>");
  }

  const moduleAst = parser.parse(moduleSource);
  let flag = false;

  traverse(moduleAst, {
    ArrowFunctionExpression(path) {
      if (flag) return;
      const params = path.node.params;
      params.forEach((param) => {
        if (param.name === "e" || param.name === "t" || param.name === "n") {
          path.scope.rename(
            param.name,
            {
              e: "module",
              t: "exports",
              n: "require",
            }[param.name]
          );
        }
      });
      flag = true;
    },
  });
  return moduleAst;
}

function prettier(ast) {
  const moduleTransformer = {
    // e.g., `(0, r.getConfig)(e, r.ConfigKey.DebugOverrideProxyUrl);`
    // gets transformed to r.getConfig(e, r.ConfigKey.DebugOverrideProxyUrl);
    CallExpression(path) {
      if (path.node.callee.type != "SequenceExpression") {
        return;
      }
      if (
        path.node.callee.expressions.length == 2 &&
        path.node.callee.expressions[0].type == "NumericLiteral"
      ) {
        path.node.callee = path.node.callee.expressions[1];
      }
    },
    ExpressionStatement(path) {
      if (path.node.expression.type == "SequenceExpression") {
        const exprs = path.node.expression.expressions;
        let exprStmts = exprs.map((e) => {
          return types.expressionStatement(e);
        });
        path.replaceWithMultiple(exprStmts);
        return;
      }
      if (path.node.expression.type == "AssignmentExpression") {
        // handle cases like: `a = (expr1, expr2, expr3)`
        // convert to: `expr1; expr2; a = expr3;`
        if (path.node.expression.right.type == "SequenceExpression") {
          const exprs = path.node.expression.right.expressions;
          let exprStmts = exprs.map((e) => {
            return types.expressionStatement(e);
          });
          let lastExpr = exprStmts.pop();
          path.node.expression.right = lastExpr.expression;
          exprStmts.push(path.node);
          path.replaceWithMultiple(exprStmts);
          return;
        }

        // handle cases like: `exports.GoodExplainableName = a;` where `a` is a function or a class
        // rename `a` to `GoodExplainableName` everywhere in the module
        if (
          path.node.expression.left.type == "MemberExpression" &&
          path.node.expression.left.object.type == "Identifier" &&
          path.node.expression.left.object.name == "exports" &&
          path.node.expression.left.property.type == "Identifier" &&
          path.node.expression.left.property.name != "default" &&
          path.node.expression.right.type == "Identifier" &&
          path.node.expression.right.name.length == 1
        ) {
          path.scope.rename(
            path.node.expression.right.name,
            path.node.expression.left.property.name
          );
          return;
        }
      }
      if (path.node.expression.type == "ConditionalExpression") {
        // handle cases like: `<test> ? c : d;`
        // convert to: `if (<test>) { c; } else { d; }`
        const test = path.node.expression.test;
        const consequent = path.node.expression.consequent;
        const alternate = path.node.expression.alternate;

        const ifStmt = types.ifStatement(
          test,
          types.blockStatement([types.expressionStatement(consequent)]),
          types.blockStatement([types.expressionStatement(alternate)])
        );
        path.replaceWith(ifStmt);
        return;
      }
      if (path.node.expression.type == "LogicalExpression") {
        // handle cases like: `a && b;`
        // convert to: `if (a) { b; }`
        const test = path.node.expression.left;
        const consequent = path.node.expression.right;

        const ifStmt = types.ifStatement(
          test,
          types.blockStatement([types.expressionStatement(consequent)]),
          null
        );
        path.replaceWith(ifStmt);
        return;
      }
    },
    IfStatement(path) {
      if (!path.node.test || path.node.test.type != "SequenceExpression") {
        return;
      }
      const exprs = path.node.test.expressions;
      let exprStmts = exprs.map((e) => {
        return types.expressionStatement(e);
      });
      let lastExpr = exprStmts.pop();
      path.node.test = lastExpr.expression;
      exprStmts.push(path.node);
      path.replaceWithMultiple(exprStmts);
    },
    ReturnStatement(path) {
      if (
        !path.node.argument ||
        path.node.argument.type != "SequenceExpression"
      ) {
        return;
      }
      const exprs = path.node.argument.expressions;
      let exprStmts = exprs.map((e) => {
        return types.expressionStatement(e);
      });
      let lastExpr = exprStmts.pop();
      let returnStmt = types.returnStatement(lastExpr.expression);
      exprStmts.push(returnStmt);
      path.replaceWithMultiple(exprStmts);
    },
    VariableDeclaration(path) {
      // change `const a = 1, b = 2;` to `const a = 1; const b = 2;`
      if (path.node.declarations.length > 1) {
        let newDecls = path.node.declarations.map((d) => {
          return types.variableDeclaration(path.node.kind, [d]);
        });
        path.replaceWithMultiple(newDecls);
      }
    },
  };
  traverse(ast, moduleTransformer);
  return ast;
}

function transformRequire(ast) {
  const moduleTransformer = {
    VariableDeclaration(path) {
        if (path.node.declarations[0].init && path.node.declarations[0].init.type === "CallExpression") {
            if (path.node.declarations[0].init.callee.name === "require") {
                const moduleId = path.node.declarations[0].init.arguments[0].value;
                if (NameMap[moduleId]) {
                    const { name, path: modulePath} = NameMap[moduleId];

                    path.node.declarations[0].init.arguments[0].value = '"'+modulePath+'"';
                    path.scope.rename(path.node.declarations[0].id.name, name);
                }
              }
        }
      
    },
  };
  traverse(ast, moduleTransformer);
  return ast;
}

function parseModules() {
  traverse(ast, {
    enter(path) {
      if (
        path.node.type === "VariableDeclarator" &&
        path.node.id.name === "__webpack_modules__"
      ) {
        const modules = path.node.init.properties;
        for (const module of modules) {
          const moduleId = module.key.value;
          const moduleAst = module.value;
          const moduleSource = generate(moduleAst).code;

          try {
            const ast = transformRequire(prettier(clearfyParams(moduleId, moduleSource)));

            const mainBody = ast.program.body[0].expression.body.body;
            const moduleCode = generate(types.Program(mainBody)).code;
            fs.writeFileSync(
              "./prettier/modules/" + moduleId + ".js",
              moduleCode,
              "utf8"
            );
          } catch (e) {
            console.log(e);
          }
        }
      }
    },
  });
}

parseModules();
