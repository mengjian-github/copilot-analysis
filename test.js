const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const source = `const a = require('b')`;

const ast = parser.parse(source);

traverse(ast, {
    VariableDeclaration(path) {
       if (path.node.declarations[0].init.callee.name === 'require') {
           console.log(path.node.declarations[0].init.arguments[0].value)
       }
    }
});