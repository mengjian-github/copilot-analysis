var Module = void 0 !== Module ? Module : {};
var TreeSitter = function () {
  var initPromise;
  var document = "object" == typeof window ? {
    currentScript: window.document.currentScript
  } : null;
  class Parser {
    constructor() {
      this.initialize();
    }
    initialize() {
      throw new Error("cannot construct a Parser before calling `init()`");
    }
    static init(moduleOptions) {
      return initPromise || (Module = Object.assign({}, Module, moduleOptions), initPromise = new Promise(resolveInitPromise => {
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (e, t) => {
          throw t;
        };
        var ENVIRONMENT_IS_WEB = "object" == typeof window;
        var ENVIRONMENT_IS_WORKER = "function" == typeof importScripts;
        var ENVIRONMENT_IS_NODE = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node;
        var scriptDirectory = "";
        var read_;
        var readAsync;
        var readBinary;
        var setWindowTitle;
        function locateFile(e) {
          return Module.locateFile ? Module.locateFile(e, scriptDirectory) : scriptDirectory + e;
        }
        function logExceptionOnExit(e) {
          if (e instanceof ExitStatus) {
            err("exiting due to exception: " + e);
          }
        }
        if (ENVIRONMENT_IS_NODE) {
          var fs = __webpack_require__(57147);
          var nodePath = __webpack_require__(71017);
          scriptDirectory = ENVIRONMENT_IS_WORKER ? nodePath.dirname(scriptDirectory) + "/" : __dirname + "/";
          read_ = (e, t) => (e = isFileURI(e) ? new URL(e) : nodePath.normalize(e), fs.readFileSync(e, t ? void 0 : "utf8"));
          readBinary = e => {
            var t = read_(e, !0);
            if (t.buffer) {
              t = new Uint8Array(t);
            }
            return t;
          };
          readAsync = (e, t, n) => {
            e = isFileURI(e) ? new URL(e) : nodePath.normalize(e);
            fs.readFile(e, function (e, r) {
              if (e) {
                n(e);
              } else {
                t(r.buffer);
              }
            });
          };
          if (process.argv.length > 1) {
            thisProgram = process.argv[1].replace(/\\/g, "/");
          }
          arguments_ = process.argv.slice(2);
          module.exports = Module;
          quit_ = (e, t) => {
            if (keepRuntimeAlive()) throw process.exitCode = e, t;
            logExceptionOnExit(t);
            process.exit(e);
          };
          Module.inspect = function () {
            return "[Emscripten Module object]";
          };
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else {
            if (void 0 !== document && document.currentScript) {
              scriptDirectory = document.currentScript.src;
            }
          }
          scriptDirectory = 0 !== scriptDirectory.indexOf("blob:") ? scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "";
          read_ = e => {
            var t = new XMLHttpRequest();
            t.open("GET", e, !1);
            t.send(null);
            return t.responseText;
          };
          if (ENVIRONMENT_IS_WORKER) {
            readBinary = e => {
              var t = new XMLHttpRequest();
              t.open("GET", e, !1);
              t.responseType = "arraybuffer";
              t.send(null);
              return new Uint8Array(t.response);
            };
          }
          readAsync = (e, t, n) => {
            var r = new XMLHttpRequest();
            r.open("GET", e, !0);
            r.responseType = "arraybuffer";
            r.onload = () => {
              if (200 == r.status || 0 == r.status && r.response) {
                t(r.response);
              } else {
                n();
              }
            };
            r.onerror = n;
            r.send(null);
          };
          setWindowTitle = e => document.title = e;
        }
        var out = Module.print || console.log.bind(console);
        var err = Module.printErr || console.warn.bind(console);
        Object.assign(Module, moduleOverrides);
        moduleOverrides = null;
        if (Module.arguments) {
          arguments_ = Module.arguments;
        }
        if (Module.thisProgram) {
          thisProgram = Module.thisProgram;
        }
        if (Module.quit) {
          quit_ = Module.quit;
        }
        var STACK_ALIGN = 16;
        var dynamicLibraries = Module.dynamicLibraries || [];
        var wasmBinary;
        if (Module.wasmBinary) {
          wasmBinary = Module.wasmBinary;
        }
        var noExitRuntime = Module.noExitRuntime || !0;
        var wasmMemory;
        if ("object" != typeof WebAssembly) {
          abort("no native wasm support detected");
        }
        var ABORT = !1;
        var EXITSTATUS;
        var UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
        var buffer;
        var HEAP8;
        var HEAPU8;
        var HEAP16;
        var HEAPU16;
        var HEAP32;
        var HEAPU32;
        var HEAPF32;
        var HEAPF64;
        function UTF8ArrayToString(e, t, n) {
          for (r = t + n, i = t, void 0; e[i] && !(i >= r);) {
            var r;
            var i;
            ++i;
          }
          if (i - t > 16 && e.buffer && UTF8Decoder) return UTF8Decoder.decode(e.subarray(t, i));
          for (var o = ""; t < i;) {
            var s = e[t++];
            if (128 & s) {
              var a = 63 & e[t++];
              if (192 != (224 & s)) {
                var c = 63 & e[t++];
                if ((s = 224 == (240 & s) ? (15 & s) << 12 | a << 6 | c : (7 & s) << 18 | a << 12 | c << 6 | 63 & e[t++]) < 65536) o += String.fromCharCode(s);else {
                  var l = s - 65536;
                  o += String.fromCharCode(55296 | l >> 10, 56320 | 1023 & l);
                }
              } else o += String.fromCharCode((31 & s) << 6 | a);
            } else o += String.fromCharCode(s);
          }
          return o;
        }
        function UTF8ToString(e, t) {
          return e ? UTF8ArrayToString(HEAPU8, e, t) : "";
        }
        function stringToUTF8Array(e, t, n, r) {
          if (!(r > 0)) return 0;
          for (i = n, o = n + r - 1, s = 0, void 0; s < e.length; ++s) {
            var i;
            var o;
            var s;
            var a = e.charCodeAt(s);
            if (a >= 55296 && a <= 57343) {
              a = 65536 + ((1023 & a) << 10) | 1023 & e.charCodeAt(++s);
            }
            if (a <= 127) {
              if (n >= o) break;
              t[n++] = a;
            } else if (a <= 2047) {
              if (n + 1 >= o) break;
              t[n++] = 192 | a >> 6, t[n++] = 128 | 63 & a;
            } else if (a <= 65535) {
              if (n + 2 >= o) break;
              t[n++] = 224 | a >> 12, t[n++] = 128 | a >> 6 & 63, t[n++] = 128 | 63 & a;
            } else {
              if (n + 3 >= o) break;
              t[n++] = 240 | a >> 18, t[n++] = 128 | a >> 12 & 63, t[n++] = 128 | a >> 6 & 63, t[n++] = 128 | 63 & a;
            }
          }
          t[n] = 0;
          return n - i;
        }
        function stringToUTF8(e, t, n) {
          return stringToUTF8Array(e, HEAPU8, t, n);
        }
        function lengthBytesUTF8(e) {
          for (t = 0, n = 0, void 0; n < e.length; ++n) {
            var t;
            var n;
            var r = e.charCodeAt(n);
            if (r <= 127) {
              t++;
            } else {
              if (r <= 2047) {
                t += 2;
              } else {
                if (r >= 55296 && r <= 57343) {
                  t += 4;
                  ++n;
                } else {
                  t += 3;
                }
              }
            }
          }
          return t;
        }
        function updateGlobalBufferAndViews(e) {
          buffer = e;
          Module.HEAP8 = HEAP8 = new Int8Array(e);
          Module.HEAP16 = HEAP16 = new Int16Array(e);
          Module.HEAP32 = HEAP32 = new Int32Array(e);
          Module.HEAPU8 = HEAPU8 = new Uint8Array(e);
          Module.HEAPU16 = HEAPU16 = new Uint16Array(e);
          Module.HEAPU32 = HEAPU32 = new Uint32Array(e);
          Module.HEAPF32 = HEAPF32 = new Float32Array(e);
          Module.HEAPF64 = HEAPF64 = new Float64Array(e);
        }
        var INITIAL_MEMORY = Module.INITIAL_MEMORY || 33554432;
        wasmMemory = Module.wasmMemory ? Module.wasmMemory : new WebAssembly.Memory({
          initial: INITIAL_MEMORY / 65536,
          maximum: 32768
        });
        if (wasmMemory) {
          buffer = wasmMemory.buffer;
        }
        INITIAL_MEMORY = buffer.byteLength;
        updateGlobalBufferAndViews(buffer);
        var wasmTable = new WebAssembly.Table({
          initial: 20,
          element: "anyfunc"
        });
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATPOSTRUN__ = [];
        var __RELOC_FUNCS__ = [];
        var runtimeInitialized = !1;
        function keepRuntimeAlive() {
          return noExitRuntime;
        }
        function preRun() {
          if (Module.preRun) for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) addOnPreRun(Module.preRun.shift());
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          runtimeInitialized = !0;
          callRuntimeCallbacks(__RELOC_FUNCS__);
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          if (Module.postRun) for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) addOnPostRun(Module.postRun.shift());
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(e) {
          __ATPRERUN__.unshift(e);
        }
        function addOnInit(e) {
          __ATINIT__.unshift(e);
        }
        function addOnPostRun(e) {
          __ATPOSTRUN__.unshift(e);
        }
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function addRunDependency(e) {
          runDependencies++;
          if (Module.monitorRunDependencies) {
            Module.monitorRunDependencies(runDependencies);
          }
        }
        function removeRunDependency(e) {
          runDependencies--;
          if (Module.monitorRunDependencies) {
            Module.monitorRunDependencies(runDependencies);
          }
          if (0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled)) {
            var t = dependenciesFulfilled;
            dependenciesFulfilled = null, t();
          }
        }
        function abort(e) {
          throw Module.onAbort && Module.onAbort(e), err(e = "Aborted(" + e + ")"), ABORT = !0, EXITSTATUS = 1, e += ". Build with -sASSERTIONS for more info.", new WebAssembly.RuntimeError(e);
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var wasmBinaryFile;
        var tempDouble;
        var tempI64;
        function isDataURI(e) {
          return e.startsWith(dataURIPrefix);
        }
        function isFileURI(e) {
          return e.startsWith("file://");
        }
        function getBinary(e) {
          try {
            if (e == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
            if (readBinary) return readBinary(e);
            throw "both async and sync fetching of the wasm failed";
          } catch (e) {
            abort(e);
          }
        }
        function getBinaryPromise() {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
            if ("function" == typeof fetch && !isFileURI(wasmBinaryFile)) return fetch(wasmBinaryFile, {
              credentials: "same-origin"
            }).then(function (e) {
              if (!e.ok) throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
              return e.arrayBuffer();
            }).catch(function () {
              return getBinary(wasmBinaryFile);
            });
            if (readAsync) return new Promise(function (e, t) {
              readAsync(wasmBinaryFile, function (t) {
                e(new Uint8Array(t));
              }, t);
            });
          }
          return Promise.resolve().then(function () {
            return getBinary(wasmBinaryFile);
          });
        }
        function createWasm() {
          var e = {
            env: asmLibraryArg,
            wasi_snapshot_preview1: asmLibraryArg,
            "GOT.mem": new Proxy(asmLibraryArg, GOTHandler),
            "GOT.func": new Proxy(asmLibraryArg, GOTHandler)
          };
          function t(e, t) {
            var n = e.exports;
            n = relocateExports(n, 1024);
            var r = getDylinkMetadata(t);
            if (r.neededDynlibs) {
              dynamicLibraries = r.neededDynlibs.concat(dynamicLibraries);
            }
            mergeLibSymbols(n, "main");
            Module.asm = n;
            addOnInit(Module.asm.__wasm_call_ctors);
            __RELOC_FUNCS__.push(Module.asm.__wasm_apply_data_relocs);
            removeRunDependency("wasm-instantiate");
          }
          function n(e) {
            t(e.instance, e.module);
          }
          function r(t) {
            return getBinaryPromise().then(function (t) {
              return WebAssembly.instantiate(t, e);
            }).then(function (e) {
              return e;
            }).then(t, function (e) {
              err("failed to asynchronously prepare wasm: " + e);
              abort(e);
            });
          }
          addRunDependency("wasm-instantiate");
          if (Module.instantiateWasm) try {
            return Module.instantiateWasm(e, t);
          } catch (e) {
            return err("Module.instantiateWasm callback failed with error: " + e), !1;
          }
          if (wasmBinary || "function" != typeof WebAssembly.instantiateStreaming || isDataURI(wasmBinaryFile) || isFileURI(wasmBinaryFile) || ENVIRONMENT_IS_NODE || "function" != typeof fetch) {
            r(n);
          } else {
            fetch(wasmBinaryFile, {
              credentials: "same-origin"
            }).then(function (t) {
              return WebAssembly.instantiateStreaming(t, e).then(n, function (e) {
                err("wasm streaming compile failed: " + e);
                err("falling back to ArrayBuffer instantiation");
                return r(n);
              });
            });
          }
          return {};
        }
        wasmBinaryFile = "tree-sitter.wasm";
        if (isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        var ASM_CONSTS = {};
        function ExitStatus(e) {
          this.name = "ExitStatus";
          this.message = "Program terminated with exit(" + e + ")";
          this.status = e;
        }
        var GOT = {};
        var CurrentModuleWeakSymbols = new Set([]);
        var GOTHandler = {
          get: function (e, t) {
            var n = GOT[t];
            if (n) {
              n = GOT[t] = new WebAssembly.Global({
                value: "i32",
                mutable: !0
              });
            }
            if (CurrentModuleWeakSymbols.has(t)) {
              n.required = !0;
            }
            return n;
          }
        };
        function callRuntimeCallbacks(e) {
          for (; e.length > 0;) e.shift()(Module);
        }
        function getDylinkMetadata(e) {
          var t = 0;
          var n = 0;
          function r() {
            for (n = 0, r = 1, void 0;;) {
              var n;
              var r;
              var i = e[t++];
              n += (127 & i) * r;
              r *= 128;
              if (!(128 & i)) break;
            }
            return n;
          }
          function i() {
            var n = r();
            return UTF8ArrayToString(e, (t += n) - n, n);
          }
          function o(e, t) {
            if (e) throw new Error(t);
          }
          var s = "dylink.0";
          if (e instanceof WebAssembly.Module) {
            var a = WebAssembly.Module.customSections(e, s);
            if (0 === a.length) {
              s = "dylink";
              a = WebAssembly.Module.customSections(e, s);
            }
            o(0 === a.length, "need dylink section");
            n = (e = new Uint8Array(a[0])).length;
          } else {
            o(!(1836278016 == new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0]), "need to see wasm magic number");
            o(0 !== e[8], "need the dylink section to be first");
            t = 9;
            var c = r();
            n = t + c;
            s = i();
          }
          var l = {
            neededDynlibs: [],
            tlsExports: new Set(),
            weakImports: new Set()
          };
          if ("dylink" == s) {
            l.memorySize = r();
            l.memoryAlign = r();
            l.tableSize = r();
            l.tableAlign = r();
            for (u = r(), p = 0, void 0; p < u; ++p) {
              var u;
              var p;
              var d = i();
              l.neededDynlibs.push(d);
            }
          } else for (o("dylink.0" !== s); t < n;) {
            var h = e[t++];
            var f = r();
            if (1 === h) {
              l.memorySize = r();
              l.memoryAlign = r();
              l.tableSize = r();
              l.tableAlign = r();
            } else if (2 === h) for (u = r(), p = 0; p < u; ++p) {
              d = i();
              l.neededDynlibs.push(d);
            } else if (3 === h) for (var m = r(); m--;) {
              var g = i();
              if (256 & r()) {
                l.tlsExports.add(g);
              }
            } else if (4 === h) for (m = r(); m--;) {
              i();
              g = i();
              if (1 == (3 & r())) {
                l.weakImports.add(g);
              }
            } else t += f;
          }
          return l;
        }
        function getValue(e, t = "i8") {
          switch (t.endsWith("*") && (t = "*"), t) {
            case "i1":
            case "i8":
              return HEAP8[e >> 0];
            case "i16":
              return HEAP16[e >> 1];
            case "i32":
            case "i64":
              return HEAP32[e >> 2];
            case "float":
              return HEAPF32[e >> 2];
            case "double":
              return HEAPF64[e >> 3];
            case "*":
              return HEAPU32[e >> 2];
            default:
              abort("invalid type for getValue: " + t);
          }
          return null;
        }
        function asmjsMangle(e) {
          return 0 == e.indexOf("dynCall_") || ["stackAlloc", "stackSave", "stackRestore", "getTempRet0", "setTempRet0"].includes(e) ? e : "_" + e;
        }
        function mergeLibSymbols(e, t) {
          for (var n in e) if (e.hasOwnProperty(n)) {
            if (asmLibraryArg.hasOwnProperty(n)) {
              asmLibraryArg[n] = e[n];
            }
            var r = asmjsMangle(n);
            if (Module.hasOwnProperty(r)) {
              Module[r] = e[n];
            }
            if ("__main_argc_argv" == n) {
              Module._main = e[n];
            }
          }
        }
        var LDSO = {
          loadedLibsByName: {},
          loadedLibsByHandle: {}
        };
        function dynCallLegacy(e, t, n) {
          var r = Module["dynCall_" + e];
          return n && n.length ? r.apply(null, [t].concat(n)) : r.call(null, t);
        }
        var wasmTableMirror = [];
        function getWasmTableEntry(e) {
          var t = wasmTableMirror[e];
          if (t) {
            if (e >= wasmTableMirror.length) {
              wasmTableMirror.length = e + 1;
            }
            wasmTableMirror[e] = t = wasmTable.get(e);
          }
          return t;
        }
        function dynCall(e, t, n) {
          return e.includes("j") ? dynCallLegacy(e, t, n) : getWasmTableEntry(t).apply(null, n);
        }
        function createInvokeFunction(e) {
          return function () {
            var t = stackSave();
            try {
              return dynCall(e, arguments[0], Array.prototype.slice.call(arguments, 1));
            } catch (e) {
              stackRestore(t);
              if (e !== e + 0) throw e;
              _setThrew(1, 0);
            }
          };
        }
        var ___heap_base = 78144;
        function zeroMemory(e, t) {
          HEAPU8.fill(0, e, e + t);
          return e;
        }
        function getMemory(e) {
          if (runtimeInitialized) return zeroMemory(_malloc(e), e);
          var t = ___heap_base;
          var n = t + e + 15 & -16;
          ___heap_base = n;
          GOT.__heap_base.value = n;
          return t;
        }
        function isInternalSym(e) {
          return ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm"].includes(e);
        }
        function uleb128Encode(e, t) {
          if (e < 128) {
            t.push(e);
          } else {
            t.push(e % 128 | 128, e >> 7);
          }
        }
        function sigToWasmTypes(e) {
          for (t = {
            i: "i32",
            j: "i32",
            f: "f32",
            d: "f64",
            p: "i32"
          }, n = {
            parameters: [],
            results: "v" == e[0] ? [] : [t[e[0]]]
          }, r = 1, void 0; r < e.length; ++r) {
            var t;
            var n;
            var r;
            n.parameters.push(t[e[r]]);
            if ("j" === e[r]) {
              n.parameters.push("i32");
            }
          }
          return n;
        }
        function generateFuncType(e, t) {
          var n = e.slice(0, 1);
          var r = e.slice(1);
          var i = {
            i: 127,
            p: 127,
            j: 126,
            f: 125,
            d: 124
          };
          t.push(96);
          uleb128Encode(r.length, t);
          for (var o = 0; o < r.length; ++o) t.push(i[r[o]]);
          if ("v" == n) {
            t.push(0);
          } else {
            t.push(1, i[n]);
          }
        }
        function convertJsFunctionToWasm(e, t) {
          if ("function" == typeof WebAssembly.Function) return new WebAssembly.Function(sigToWasmTypes(t), e);
          var n = [1];
          generateFuncType(t, n);
          var r = [0, 97, 115, 109, 1, 0, 0, 0, 1];
          uleb128Encode(n.length, r);
          r.push.apply(r, n);
          r.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
          var i = new WebAssembly.Module(new Uint8Array(r));
          return new WebAssembly.Instance(i, {
            e: {
              f: e
            }
          }).exports.f;
        }
        function updateTableMap(e, t) {
          if (functionsInTableMap) for (var n = e; n < e + t; n++) {
            var r = getWasmTableEntry(n);
            if (r) {
              functionsInTableMap.set(r, n);
            }
          }
        }
        var functionsInTableMap = void 0;
        var freeTableIndexes = [];
        function getEmptyTableSlot() {
          if (freeTableIndexes.length) return freeTableIndexes.pop();
          try {
            wasmTable.grow(1);
          } catch (e) {
            if (!(e instanceof RangeError)) throw e;
            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
          }
          return wasmTable.length - 1;
        }
        function setWasmTableEntry(e, t) {
          wasmTable.set(e, t);
          wasmTableMirror[e] = wasmTable.get(e);
        }
        function addFunction(e, t) {
          if (functionsInTableMap) {
            functionsInTableMap = new WeakMap();
            updateTableMap(0, wasmTable.length);
          }
          if (functionsInTableMap.has(e)) return functionsInTableMap.get(e);
          var n = getEmptyTableSlot();
          try {
            setWasmTableEntry(n, e);
          } catch (r) {
            if (!(r instanceof TypeError)) throw r;
            setWasmTableEntry(n, convertJsFunctionToWasm(e, t));
          }
          functionsInTableMap.set(e, n);
          return n;
        }
        function updateGOT(e, t) {
          for (var n in e) if (!isInternalSym(n)) {
            var r = e[n];
            if (n.startsWith("orig$")) {
              n = n.split("$")[1];
              t = !0;
            }
            if (GOT[n]) {
              GOT[n] = new WebAssembly.Global({
                value: "i32",
                mutable: !0
              });
            }
            if (t || 0 == GOT[n].value) {
              if ("function" == typeof r) {
                GOT[n].value = addFunction(r);
              } else {
                if ("number" == typeof r) {
                  GOT[n].value = r;
                } else {
                  err("unhandled export type for `" + n + "`: " + typeof r);
                }
              }
            }
          }
        }
        function relocateExports(e, t, n) {
          var r = {};
          for (var i in e) {
            var o = e[i];
            if ("object" == typeof o) {
              o = o.value;
            }
            if ("number" == typeof o) {
              o += t;
            }
            r[i] = o;
          }
          updateGOT(r, n);
          return r;
        }
        function resolveGlobalSymbol(e, t) {
          var n;
          if (t) {
            n = asmLibraryArg["orig$" + e];
          }
          if (n) {
            if ((n = asmLibraryArg[e]) && n.stub) {
              n = void 0;
            }
          }
          if (n) {
            n = Module[asmjsMangle(e)];
          }
          if (!n && e.startsWith("invoke_")) {
            n = createInvokeFunction(e.split("_")[1]);
          }
          return n;
        }
        function alignMemory(e, t) {
          return Math.ceil(e / t) * t;
        }
        function loadWebAssemblyModule(binary, flags, handle) {
          var metadata = getDylinkMetadata(binary);
          function loadModule() {
            var firstLoad = !handle || !HEAP8[handle + 12 >> 0];
            if (firstLoad) {
              var memAlign = Math.pow(2, metadata.memoryAlign);
              memAlign = Math.max(memAlign, STACK_ALIGN);
              var memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0;
              var tableBase = metadata.tableSize ? wasmTable.length : 0;
              if (handle) {
                HEAP8[handle + 12 >> 0] = 1;
                HEAPU32[handle + 16 >> 2] = memoryBase;
                HEAP32[handle + 20 >> 2] = metadata.memorySize;
                HEAPU32[handle + 24 >> 2] = tableBase;
                HEAP32[handle + 28 >> 2] = metadata.tableSize;
              }
            } else {
              memoryBase = HEAPU32[handle + 16 >> 2];
              tableBase = HEAPU32[handle + 24 >> 2];
            }
            var tableGrowthNeeded = tableBase + metadata.tableSize - wasmTable.length;
            var moduleExports;
            function resolveSymbol(e) {
              var t = resolveGlobalSymbol(e, !1);
              if (t) {
                t = moduleExports[e];
              }
              return t;
            }
            if (tableGrowthNeeded > 0) {
              wasmTable.grow(tableGrowthNeeded);
            }
            var proxyHandler = {
              get: function (e, t) {
                switch (t) {
                  case "__memory_base":
                    return memoryBase;
                  case "__table_base":
                    return tableBase;
                }
                return t in asmLibraryArg ? asmLibraryArg[t] : (t in e || (e[t] = function () {
                  if (n) {
                    n = resolveSymbol(t);
                  }
                  return n.apply(null, arguments);
                }), e[t]);
                var n;
              }
            };
            var proxy = new Proxy({}, proxyHandler);
            var info = {
              "GOT.mem": new Proxy({}, GOTHandler),
              "GOT.func": new Proxy({}, GOTHandler),
              env: proxy,
              wasi_snapshot_preview1: proxy
            };
            function postInstantiation(instance) {
              function addEmAsm(addr, body) {
                for (args = [], arity = 0, void 0; arity < 16 && -1 != body.indexOf("$" + arity); arity++) {
                  var args;
                  var arity;
                  args.push("$" + arity);
                }
                args = args.join(",");
                var func = "(" + args + " ) => { " + body + "};";
                ASM_CONSTS[start] = eval(func);
              }
              updateTableMap(tableBase, metadata.tableSize);
              moduleExports = relocateExports(instance.exports, memoryBase);
              if (flags.allowUndefined) {
                reportUndefinedSymbols();
              }
              if ("__start_em_asm" in moduleExports) for (var start = moduleExports.__start_em_asm, stop = moduleExports.__stop_em_asm; start < stop;) {
                var jsString = UTF8ToString(start);
                addEmAsm(start, jsString), start = HEAPU8.indexOf(0, start) + 1;
              }
              var applyRelocs = moduleExports.__wasm_apply_data_relocs;
              if (applyRelocs) {
                if (runtimeInitialized) {
                  applyRelocs();
                } else {
                  __RELOC_FUNCS__.push(applyRelocs);
                }
              }
              var init = moduleExports.__wasm_call_ctors;
              if (init) {
                if (runtimeInitialized) {
                  init();
                } else {
                  __ATINIT__.push(init);
                }
              }
              return moduleExports;
            }
            if (flags.loadAsync) {
              if (binary instanceof WebAssembly.Module) {
                var instance = new WebAssembly.Instance(binary, info);
                return Promise.resolve(postInstantiation(instance));
              }
              return WebAssembly.instantiate(binary, info).then(function (e) {
                return postInstantiation(e.instance);
              });
            }
            var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary);
            var instance = new WebAssembly.Instance(module, info);
            return postInstantiation(instance);
          }
          CurrentModuleWeakSymbols = metadata.weakImports;
          return flags.loadAsync ? metadata.neededDynlibs.reduce(function (e, t) {
            return e.then(function () {
              return loadDynamicLibrary(t, flags);
            });
          }, Promise.resolve()).then(function () {
            return loadModule();
          }) : (metadata.neededDynlibs.forEach(function (e) {
            loadDynamicLibrary(e, flags);
          }), loadModule());
        }
        function loadDynamicLibrary(e, t, n) {
          t = t || {
            global: !0,
            nodelete: !0
          };
          var r = LDSO.loadedLibsByName[e];
          if (r) {
            if (t.global && !r.global) {
              r.global = !0;
              if ("loading" !== r.module) {
                mergeLibSymbols(r.module, e);
              }
            }
            if (t.nodelete && r.refcount !== 1 / 0) {
              r.refcount = 1 / 0;
            }
            r.refcount++;
            if (n) {
              LDSO.loadedLibsByHandle[n] = r;
            }
            return !t.loadAsync || Promise.resolve(!0);
          }
          function i(e) {
            if (t.fs && t.fs.findObject(e)) {
              var n = t.fs.readFile(e, {
                encoding: "binary"
              });
              if (n instanceof Uint8Array) {
                n = new Uint8Array(n);
              }
              return t.loadAsync ? Promise.resolve(n) : n;
            }
            e = locateFile(e);
            if (t.loadAsync) return new Promise(function (t, n) {
              readAsync(e, e => t(new Uint8Array(e)), n);
            });
            if (!readBinary) throw new Error(e + ": file not found, and synchronous loading of external files is not available");
            return readBinary(e);
          }
          function o() {
            if ("undefined" != typeof preloadedWasm && preloadedWasm[e]) {
              var r = preloadedWasm[e];
              return t.loadAsync ? Promise.resolve(r) : r;
            }
            return t.loadAsync ? i(e).then(function (e) {
              return loadWebAssemblyModule(e, t, n);
            }) : loadWebAssemblyModule(i(e), t, n);
          }
          function s(t) {
            if (r.global) {
              mergeLibSymbols(t, e);
            }
            r.module = t;
          }
          r = {
            refcount: t.nodelete ? 1 / 0 : 1,
            name: e,
            module: "loading",
            global: t.global
          };
          LDSO.loadedLibsByName[e] = r;
          if (n) {
            LDSO.loadedLibsByHandle[n] = r;
          }
          return t.loadAsync ? o().then(function (e) {
            s(e);
            return !0;
          }) : (s(o()), !0);
        }
        function reportUndefinedSymbols() {
          for (var e in GOT) if (0 == GOT[e].value) {
            var t = resolveGlobalSymbol(e, !0);
            if (!t && !GOT[e].required) continue;
            if ("function" == typeof t) GOT[e].value = addFunction(t, t.sig);else {
              if ("number" != typeof t) throw new Error("bad export type for `" + e + "`: " + typeof t);
              GOT[e].value = t;
            }
          }
        }
        function preloadDylibs() {
          if (dynamicLibraries.length) {
            addRunDependency("preloadDylibs");
            dynamicLibraries.reduce(function (e, t) {
              return e.then(function () {
                return loadDynamicLibrary(t, {
                  loadAsync: !0,
                  global: !0,
                  nodelete: !0,
                  allowUndefined: !0
                });
              });
            }, Promise.resolve()).then(function () {
              reportUndefinedSymbols();
              removeRunDependency("preloadDylibs");
            });
          } else {
            reportUndefinedSymbols();
          }
        }
        function setValue(e, t, n = "i8") {
          switch (n.endsWith("*") && (n = "*"), n) {
            case "i1":
            case "i8":
              HEAP8[e >> 0] = t;
              break;
            case "i16":
              HEAP16[e >> 1] = t;
              break;
            case "i32":
              HEAP32[e >> 2] = t;
              break;
            case "i64":
              tempI64 = [t >>> 0, (tempDouble = t, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
              HEAP32[e >> 2] = tempI64[0];
              HEAP32[e + 4 >> 2] = tempI64[1];
              break;
            case "float":
              HEAPF32[e >> 2] = t;
              break;
            case "double":
              HEAPF64[e >> 3] = t;
              break;
            case "*":
              HEAPU32[e >> 2] = t;
              break;
            default:
              abort("invalid type for setValue: " + n);
          }
        }
        var ___memory_base = new WebAssembly.Global({
          value: "i32",
          mutable: !1
        }, 1024);
        var ___stack_pointer = new WebAssembly.Global({
          value: "i32",
          mutable: !0
        }, 78144);
        var ___table_base = new WebAssembly.Global({
          value: "i32",
          mutable: !1
        }, 1);
        var nowIsMonotonic = !0;
        var _emscripten_get_now;
        function __emscripten_get_now_is_monotonic() {
          return nowIsMonotonic;
        }
        function _abort() {
          abort("");
        }
        function _emscripten_date_now() {
          return Date.now();
        }
        function _emscripten_memcpy_big(e, t, n) {
          HEAPU8.copyWithin(e, t, t + n);
        }
        function getHeapMax() {
          return 2147483648;
        }
        function emscripten_realloc_buffer(e) {
          try {
            wasmMemory.grow(e - buffer.byteLength + 65535 >>> 16);
            updateGlobalBufferAndViews(wasmMemory.buffer);
            return 1;
          } catch (e) {}
        }
        function _emscripten_resize_heap(e) {
          var t = HEAPU8.length;
          e >>>= 0;
          var n;
          var r = getHeapMax();
          if (e > r) return !1;
          for (var i = 1; i <= 4; i *= 2) {
            var o = t * (1 + .2 / i);
            o = Math.min(o, e + 100663296);
            if (emscripten_realloc_buffer(Math.min(r, (n = Math.max(e, o)) + (65536 - n % 65536) % 65536))) return !0;
          }
          return !1;
        }
        __emscripten_get_now_is_monotonic.sig = "i";
        Module._abort = _abort;
        _abort.sig = "v";
        _emscripten_date_now.sig = "d";
        _emscripten_get_now = ENVIRONMENT_IS_NODE ? () => {
          var e = process.hrtime();
          return 1e3 * e[0] + e[1] / 1e6;
        } : () => performance.now();
        _emscripten_get_now.sig = "d";
        _emscripten_memcpy_big.sig = "vppp";
        _emscripten_resize_heap.sig = "ip";
        var SYSCALLS = {
          DEFAULT_POLLMASK: 5,
          calculateAt: function (e, t, n) {
            if (PATH.isAbs(t)) return t;
            var r;
            r = -100 === e ? FS.cwd() : SYSCALLS.getStreamFromFD(e).path;
            if (0 == t.length) {
              if (!n) throw new FS.ErrnoError(44);
              return r;
            }
            return PATH.join2(r, t);
          },
          doStat: function (e, t, n) {
            try {
              var r = e(t);
            } catch (e) {
              if (e && e.node && PATH.normalize(t) !== PATH.normalize(FS.getPath(e.node))) return -54;
              throw e;
            }
            HEAP32[n >> 2] = r.dev;
            HEAP32[n + 8 >> 2] = r.ino;
            HEAP32[n + 12 >> 2] = r.mode;
            HEAPU32[n + 16 >> 2] = r.nlink;
            HEAP32[n + 20 >> 2] = r.uid;
            HEAP32[n + 24 >> 2] = r.gid;
            HEAP32[n + 28 >> 2] = r.rdev;
            tempI64 = [r.size >>> 0, (tempDouble = r.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
            HEAP32[n + 40 >> 2] = tempI64[0];
            HEAP32[n + 44 >> 2] = tempI64[1];
            HEAP32[n + 48 >> 2] = 4096;
            HEAP32[n + 52 >> 2] = r.blocks;
            var i = r.atime.getTime();
            var o = r.mtime.getTime();
            var s = r.ctime.getTime();
            tempI64 = [Math.floor(i / 1e3) >>> 0, (tempDouble = Math.floor(i / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
            HEAP32[n + 56 >> 2] = tempI64[0];
            HEAP32[n + 60 >> 2] = tempI64[1];
            HEAPU32[n + 64 >> 2] = i % 1e3 * 1e3;
            tempI64 = [Math.floor(o / 1e3) >>> 0, (tempDouble = Math.floor(o / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
            HEAP32[n + 72 >> 2] = tempI64[0];
            HEAP32[n + 76 >> 2] = tempI64[1];
            HEAPU32[n + 80 >> 2] = o % 1e3 * 1e3;
            tempI64 = [Math.floor(s / 1e3) >>> 0, (tempDouble = Math.floor(s / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
            HEAP32[n + 88 >> 2] = tempI64[0];
            HEAP32[n + 92 >> 2] = tempI64[1];
            HEAPU32[n + 96 >> 2] = s % 1e3 * 1e3;
            tempI64 = [r.ino >>> 0, (tempDouble = r.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
            HEAP32[n + 104 >> 2] = tempI64[0];
            HEAP32[n + 108 >> 2] = tempI64[1];
            return 0;
          },
          doMsync: function (e, t, n, r, i) {
            if (!FS.isFile(t.node.mode)) throw new FS.ErrnoError(43);
            if (2 & r) return 0;
            var o = HEAPU8.slice(e, e + n);
            FS.msync(t, o, i, n, r);
          },
          varargs: void 0,
          get: function () {
            SYSCALLS.varargs += 4;
            return HEAP32[SYSCALLS.varargs - 4 >> 2];
          },
          getStr: function (e) {
            return UTF8ToString(e);
          },
          getStreamFromFD: function (e) {
            var t = FS.getStream(e);
            if (!t) throw new FS.ErrnoError(8);
            return t;
          }
        };
        function _proc_exit(e) {
          EXITSTATUS = e;
          if (keepRuntimeAlive()) {
            if (Module.onExit) {
              Module.onExit(e);
            }
            ABORT = !0;
          }
          quit_(e, new ExitStatus(e));
        }
        function exitJS(e, t) {
          EXITSTATUS = e;
          _proc_exit(e);
        }
        _proc_exit.sig = "vi";
        var _exit = exitJS;
        function _fd_close(e) {
          try {
            var t = SYSCALLS.getStreamFromFD(e);
            FS.close(t);
            return 0;
          } catch (e) {
            if ("undefined" == typeof FS || !(e instanceof FS.ErrnoError)) throw e;
            return e.errno;
          }
        }
        function convertI32PairToI53Checked(e, t) {
          return t + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + 4294967296 * t : NaN;
        }
        function _fd_seek(e, t, n, r, i) {
          try {
            var o = convertI32PairToI53Checked(t, n);
            if (isNaN(o)) return 61;
            var s = SYSCALLS.getStreamFromFD(e);
            FS.llseek(s, o, r);
            tempI64 = [s.position >>> 0, (tempDouble = s.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math.min(+Math.floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
            HEAP32[i >> 2] = tempI64[0];
            HEAP32[i + 4 >> 2] = tempI64[1];
            if (s.getdents && 0 === o && 0 === r) {
              s.getdents = null;
            }
            return 0;
          } catch (e) {
            if ("undefined" == typeof FS || !(e instanceof FS.ErrnoError)) throw e;
            return e.errno;
          }
        }
        function doWritev(e, t, n, r) {
          for (i = 0, o = 0, void 0; o < n; o++) {
            var i;
            var o;
            var s = HEAPU32[t >> 2];
            var a = HEAPU32[t + 4 >> 2];
            t += 8;
            var c = FS.write(e, HEAP8, s, a, r);
            if (c < 0) return -1;
            i += c;
            if (void 0 !== r) {
              r += c;
            }
          }
          return i;
        }
        function _fd_write(e, t, n, r) {
          try {
            var i = doWritev(SYSCALLS.getStreamFromFD(e), t, n);
            HEAPU32[r >> 2] = i;
            return 0;
          } catch (e) {
            if ("undefined" == typeof FS || !(e instanceof FS.ErrnoError)) throw e;
            return e.errno;
          }
        }
        function _tree_sitter_log_callback(e, t) {
          if (currentLogCallback) {
            const n = UTF8ToString(t);
            currentLogCallback(n, 0 !== e);
          }
        }
        function _tree_sitter_parse_callback(e, t, n, r, i) {
          var o = currentParseCallback(t, {
            row: n,
            column: r
          });
          if ("string" == typeof o) {
            setValue(i, o.length, "i32");
            stringToUTF16(o, e, 10240);
          } else {
            setValue(i, 0, "i32");
          }
        }
        function handleException(e) {
          if (e instanceof ExitStatus || "unwind" == e) return EXITSTATUS;
          quit_(1, e);
        }
        function allocateUTF8OnStack(e) {
          var t = lengthBytesUTF8(e) + 1;
          var n = stackAlloc(t);
          stringToUTF8Array(e, HEAP8, n, t);
          return n;
        }
        function stringToUTF16(e, t, n) {
          if (void 0 === n) {
            n = 2147483647;
          }
          if (n < 2) return 0;
          for (r = t, i = (n -= 2) < 2 * e.length ? n / 2 : e.length, o = 0, void 0; o < i; ++o) {
            var r;
            var i;
            var o;
            var s = e.charCodeAt(o);
            HEAP16[t >> 1] = s;
            t += 2;
          }
          HEAP16[t >> 1] = 0;
          return t - r;
        }
        function AsciiToString(e) {
          for (var t = "";;) {
            var n = HEAPU8[e++ >> 0];
            if (!n) return t;
            t += String.fromCharCode(n);
          }
        }
        _exit.sig = "vi";
        _fd_close.sig = "ii";
        _fd_seek.sig = "iijip";
        _fd_write.sig = "iippp";
        var asmLibraryArg = {
          __heap_base: ___heap_base,
          __indirect_function_table: wasmTable,
          __memory_base: ___memory_base,
          __stack_pointer: ___stack_pointer,
          __table_base: ___table_base,
          _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
          abort: _abort,
          emscripten_get_now: _emscripten_get_now,
          emscripten_memcpy_big: _emscripten_memcpy_big,
          emscripten_resize_heap: _emscripten_resize_heap,
          exit: _exit,
          fd_close: _fd_close,
          fd_seek: _fd_seek,
          fd_write: _fd_write,
          memory: wasmMemory,
          tree_sitter_log_callback: _tree_sitter_log_callback,
          tree_sitter_parse_callback: _tree_sitter_parse_callback
        };
        var asm = createWasm();
        var ___wasm_call_ctors = Module.___wasm_call_ctors = function () {
          return (___wasm_call_ctors = Module.___wasm_call_ctors = Module.asm.__wasm_call_ctors).apply(null, arguments);
        };
        var ___wasm_apply_data_relocs = Module.___wasm_apply_data_relocs = function () {
          return (___wasm_apply_data_relocs = Module.___wasm_apply_data_relocs = Module.asm.__wasm_apply_data_relocs).apply(null, arguments);
        };
        var _malloc = Module._malloc = function () {
          return (_malloc = Module._malloc = Module.asm.malloc).apply(null, arguments);
        };
        var _calloc = Module._calloc = function () {
          return (_calloc = Module._calloc = Module.asm.calloc).apply(null, arguments);
        };
        var _realloc = Module._realloc = function () {
          return (_realloc = Module._realloc = Module.asm.realloc).apply(null, arguments);
        };
        var _free = Module._free = function () {
          return (_free = Module._free = Module.asm.free).apply(null, arguments);
        };
        var _ts_language_symbol_count = Module._ts_language_symbol_count = function () {
          return (_ts_language_symbol_count = Module._ts_language_symbol_count = Module.asm.ts_language_symbol_count).apply(null, arguments);
        };
        var _ts_language_version = Module._ts_language_version = function () {
          return (_ts_language_version = Module._ts_language_version = Module.asm.ts_language_version).apply(null, arguments);
        };
        var _ts_language_field_count = Module._ts_language_field_count = function () {
          return (_ts_language_field_count = Module._ts_language_field_count = Module.asm.ts_language_field_count).apply(null, arguments);
        };
        var _ts_language_symbol_name = Module._ts_language_symbol_name = function () {
          return (_ts_language_symbol_name = Module._ts_language_symbol_name = Module.asm.ts_language_symbol_name).apply(null, arguments);
        };
        var _ts_language_symbol_for_name = Module._ts_language_symbol_for_name = function () {
          return (_ts_language_symbol_for_name = Module._ts_language_symbol_for_name = Module.asm.ts_language_symbol_for_name).apply(null, arguments);
        };
        var _ts_language_symbol_type = Module._ts_language_symbol_type = function () {
          return (_ts_language_symbol_type = Module._ts_language_symbol_type = Module.asm.ts_language_symbol_type).apply(null, arguments);
        };
        var _ts_language_field_name_for_id = Module._ts_language_field_name_for_id = function () {
          return (_ts_language_field_name_for_id = Module._ts_language_field_name_for_id = Module.asm.ts_language_field_name_for_id).apply(null, arguments);
        };
        var _memset = Module._memset = function () {
          return (_memset = Module._memset = Module.asm.memset).apply(null, arguments);
        };
        var _memcpy = Module._memcpy = function () {
          return (_memcpy = Module._memcpy = Module.asm.memcpy).apply(null, arguments);
        };
        var _ts_parser_delete = Module._ts_parser_delete = function () {
          return (_ts_parser_delete = Module._ts_parser_delete = Module.asm.ts_parser_delete).apply(null, arguments);
        };
        var _ts_parser_reset = Module._ts_parser_reset = function () {
          return (_ts_parser_reset = Module._ts_parser_reset = Module.asm.ts_parser_reset).apply(null, arguments);
        };
        var _ts_parser_set_language = Module._ts_parser_set_language = function () {
          return (_ts_parser_set_language = Module._ts_parser_set_language = Module.asm.ts_parser_set_language).apply(null, arguments);
        };
        var _ts_parser_timeout_micros = Module._ts_parser_timeout_micros = function () {
          return (_ts_parser_timeout_micros = Module._ts_parser_timeout_micros = Module.asm.ts_parser_timeout_micros).apply(null, arguments);
        };
        var _ts_parser_set_timeout_micros = Module._ts_parser_set_timeout_micros = function () {
          return (_ts_parser_set_timeout_micros = Module._ts_parser_set_timeout_micros = Module.asm.ts_parser_set_timeout_micros).apply(null, arguments);
        };
        var _memmove = Module._memmove = function () {
          return (_memmove = Module._memmove = Module.asm.memmove).apply(null, arguments);
        };
        var _memcmp = Module._memcmp = function () {
          return (_memcmp = Module._memcmp = Module.asm.memcmp).apply(null, arguments);
        };
        var _ts_query_new = Module._ts_query_new = function () {
          return (_ts_query_new = Module._ts_query_new = Module.asm.ts_query_new).apply(null, arguments);
        };
        var _ts_query_delete = Module._ts_query_delete = function () {
          return (_ts_query_delete = Module._ts_query_delete = Module.asm.ts_query_delete).apply(null, arguments);
        };
        var _iswspace = Module._iswspace = function () {
          return (_iswspace = Module._iswspace = Module.asm.iswspace).apply(null, arguments);
        };
        var _iswalnum = Module._iswalnum = function () {
          return (_iswalnum = Module._iswalnum = Module.asm.iswalnum).apply(null, arguments);
        };
        var _ts_query_pattern_count = Module._ts_query_pattern_count = function () {
          return (_ts_query_pattern_count = Module._ts_query_pattern_count = Module.asm.ts_query_pattern_count).apply(null, arguments);
        };
        var _ts_query_capture_count = Module._ts_query_capture_count = function () {
          return (_ts_query_capture_count = Module._ts_query_capture_count = Module.asm.ts_query_capture_count).apply(null, arguments);
        };
        var _ts_query_string_count = Module._ts_query_string_count = function () {
          return (_ts_query_string_count = Module._ts_query_string_count = Module.asm.ts_query_string_count).apply(null, arguments);
        };
        var _ts_query_capture_name_for_id = Module._ts_query_capture_name_for_id = function () {
          return (_ts_query_capture_name_for_id = Module._ts_query_capture_name_for_id = Module.asm.ts_query_capture_name_for_id).apply(null, arguments);
        };
        var _ts_query_string_value_for_id = Module._ts_query_string_value_for_id = function () {
          return (_ts_query_string_value_for_id = Module._ts_query_string_value_for_id = Module.asm.ts_query_string_value_for_id).apply(null, arguments);
        };
        var _ts_query_predicates_for_pattern = Module._ts_query_predicates_for_pattern = function () {
          return (_ts_query_predicates_for_pattern = Module._ts_query_predicates_for_pattern = Module.asm.ts_query_predicates_for_pattern).apply(null, arguments);
        };
        var _ts_tree_copy = Module._ts_tree_copy = function () {
          return (_ts_tree_copy = Module._ts_tree_copy = Module.asm.ts_tree_copy).apply(null, arguments);
        };
        var _ts_tree_delete = Module._ts_tree_delete = function () {
          return (_ts_tree_delete = Module._ts_tree_delete = Module.asm.ts_tree_delete).apply(null, arguments);
        };
        var _ts_init = Module._ts_init = function () {
          return (_ts_init = Module._ts_init = Module.asm.ts_init).apply(null, arguments);
        };
        var _ts_parser_new_wasm = Module._ts_parser_new_wasm = function () {
          return (_ts_parser_new_wasm = Module._ts_parser_new_wasm = Module.asm.ts_parser_new_wasm).apply(null, arguments);
        };
        var _ts_parser_enable_logger_wasm = Module._ts_parser_enable_logger_wasm = function () {
          return (_ts_parser_enable_logger_wasm = Module._ts_parser_enable_logger_wasm = Module.asm.ts_parser_enable_logger_wasm).apply(null, arguments);
        };
        var _ts_parser_parse_wasm = Module._ts_parser_parse_wasm = function () {
          return (_ts_parser_parse_wasm = Module._ts_parser_parse_wasm = Module.asm.ts_parser_parse_wasm).apply(null, arguments);
        };
        var _ts_language_type_is_named_wasm = Module._ts_language_type_is_named_wasm = function () {
          return (_ts_language_type_is_named_wasm = Module._ts_language_type_is_named_wasm = Module.asm.ts_language_type_is_named_wasm).apply(null, arguments);
        };
        var _ts_language_type_is_visible_wasm = Module._ts_language_type_is_visible_wasm = function () {
          return (_ts_language_type_is_visible_wasm = Module._ts_language_type_is_visible_wasm = Module.asm.ts_language_type_is_visible_wasm).apply(null, arguments);
        };
        var _ts_tree_root_node_wasm = Module._ts_tree_root_node_wasm = function () {
          return (_ts_tree_root_node_wasm = Module._ts_tree_root_node_wasm = Module.asm.ts_tree_root_node_wasm).apply(null, arguments);
        };
        var _ts_tree_edit_wasm = Module._ts_tree_edit_wasm = function () {
          return (_ts_tree_edit_wasm = Module._ts_tree_edit_wasm = Module.asm.ts_tree_edit_wasm).apply(null, arguments);
        };
        var _ts_tree_get_changed_ranges_wasm = Module._ts_tree_get_changed_ranges_wasm = function () {
          return (_ts_tree_get_changed_ranges_wasm = Module._ts_tree_get_changed_ranges_wasm = Module.asm.ts_tree_get_changed_ranges_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_new_wasm = Module._ts_tree_cursor_new_wasm = function () {
          return (_ts_tree_cursor_new_wasm = Module._ts_tree_cursor_new_wasm = Module.asm.ts_tree_cursor_new_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_delete_wasm = Module._ts_tree_cursor_delete_wasm = function () {
          return (_ts_tree_cursor_delete_wasm = Module._ts_tree_cursor_delete_wasm = Module.asm.ts_tree_cursor_delete_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_reset_wasm = Module._ts_tree_cursor_reset_wasm = function () {
          return (_ts_tree_cursor_reset_wasm = Module._ts_tree_cursor_reset_wasm = Module.asm.ts_tree_cursor_reset_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_goto_first_child_wasm = Module._ts_tree_cursor_goto_first_child_wasm = function () {
          return (_ts_tree_cursor_goto_first_child_wasm = Module._ts_tree_cursor_goto_first_child_wasm = Module.asm.ts_tree_cursor_goto_first_child_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_goto_next_sibling_wasm = Module._ts_tree_cursor_goto_next_sibling_wasm = function () {
          return (_ts_tree_cursor_goto_next_sibling_wasm = Module._ts_tree_cursor_goto_next_sibling_wasm = Module.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_goto_parent_wasm = Module._ts_tree_cursor_goto_parent_wasm = function () {
          return (_ts_tree_cursor_goto_parent_wasm = Module._ts_tree_cursor_goto_parent_wasm = Module.asm.ts_tree_cursor_goto_parent_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_current_node_type_id_wasm = Module._ts_tree_cursor_current_node_type_id_wasm = function () {
          return (_ts_tree_cursor_current_node_type_id_wasm = Module._ts_tree_cursor_current_node_type_id_wasm = Module.asm.ts_tree_cursor_current_node_type_id_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_current_node_is_named_wasm = Module._ts_tree_cursor_current_node_is_named_wasm = function () {
          return (_ts_tree_cursor_current_node_is_named_wasm = Module._ts_tree_cursor_current_node_is_named_wasm = Module.asm.ts_tree_cursor_current_node_is_named_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_current_node_is_missing_wasm = Module._ts_tree_cursor_current_node_is_missing_wasm = function () {
          return (_ts_tree_cursor_current_node_is_missing_wasm = Module._ts_tree_cursor_current_node_is_missing_wasm = Module.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_current_node_id_wasm = Module._ts_tree_cursor_current_node_id_wasm = function () {
          return (_ts_tree_cursor_current_node_id_wasm = Module._ts_tree_cursor_current_node_id_wasm = Module.asm.ts_tree_cursor_current_node_id_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_start_position_wasm = Module._ts_tree_cursor_start_position_wasm = function () {
          return (_ts_tree_cursor_start_position_wasm = Module._ts_tree_cursor_start_position_wasm = Module.asm.ts_tree_cursor_start_position_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_end_position_wasm = Module._ts_tree_cursor_end_position_wasm = function () {
          return (_ts_tree_cursor_end_position_wasm = Module._ts_tree_cursor_end_position_wasm = Module.asm.ts_tree_cursor_end_position_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_start_index_wasm = Module._ts_tree_cursor_start_index_wasm = function () {
          return (_ts_tree_cursor_start_index_wasm = Module._ts_tree_cursor_start_index_wasm = Module.asm.ts_tree_cursor_start_index_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_end_index_wasm = Module._ts_tree_cursor_end_index_wasm = function () {
          return (_ts_tree_cursor_end_index_wasm = Module._ts_tree_cursor_end_index_wasm = Module.asm.ts_tree_cursor_end_index_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_current_field_id_wasm = Module._ts_tree_cursor_current_field_id_wasm = function () {
          return (_ts_tree_cursor_current_field_id_wasm = Module._ts_tree_cursor_current_field_id_wasm = Module.asm.ts_tree_cursor_current_field_id_wasm).apply(null, arguments);
        };
        var _ts_tree_cursor_current_node_wasm = Module._ts_tree_cursor_current_node_wasm = function () {
          return (_ts_tree_cursor_current_node_wasm = Module._ts_tree_cursor_current_node_wasm = Module.asm.ts_tree_cursor_current_node_wasm).apply(null, arguments);
        };
        var _ts_node_symbol_wasm = Module._ts_node_symbol_wasm = function () {
          return (_ts_node_symbol_wasm = Module._ts_node_symbol_wasm = Module.asm.ts_node_symbol_wasm).apply(null, arguments);
        };
        var _ts_node_child_count_wasm = Module._ts_node_child_count_wasm = function () {
          return (_ts_node_child_count_wasm = Module._ts_node_child_count_wasm = Module.asm.ts_node_child_count_wasm).apply(null, arguments);
        };
        var _ts_node_named_child_count_wasm = Module._ts_node_named_child_count_wasm = function () {
          return (_ts_node_named_child_count_wasm = Module._ts_node_named_child_count_wasm = Module.asm.ts_node_named_child_count_wasm).apply(null, arguments);
        };
        var _ts_node_child_wasm = Module._ts_node_child_wasm = function () {
          return (_ts_node_child_wasm = Module._ts_node_child_wasm = Module.asm.ts_node_child_wasm).apply(null, arguments);
        };
        var _ts_node_named_child_wasm = Module._ts_node_named_child_wasm = function () {
          return (_ts_node_named_child_wasm = Module._ts_node_named_child_wasm = Module.asm.ts_node_named_child_wasm).apply(null, arguments);
        };
        var _ts_node_child_by_field_id_wasm = Module._ts_node_child_by_field_id_wasm = function () {
          return (_ts_node_child_by_field_id_wasm = Module._ts_node_child_by_field_id_wasm = Module.asm.ts_node_child_by_field_id_wasm).apply(null, arguments);
        };
        var _ts_node_next_sibling_wasm = Module._ts_node_next_sibling_wasm = function () {
          return (_ts_node_next_sibling_wasm = Module._ts_node_next_sibling_wasm = Module.asm.ts_node_next_sibling_wasm).apply(null, arguments);
        };
        var _ts_node_prev_sibling_wasm = Module._ts_node_prev_sibling_wasm = function () {
          return (_ts_node_prev_sibling_wasm = Module._ts_node_prev_sibling_wasm = Module.asm.ts_node_prev_sibling_wasm).apply(null, arguments);
        };
        var _ts_node_next_named_sibling_wasm = Module._ts_node_next_named_sibling_wasm = function () {
          return (_ts_node_next_named_sibling_wasm = Module._ts_node_next_named_sibling_wasm = Module.asm.ts_node_next_named_sibling_wasm).apply(null, arguments);
        };
        var _ts_node_prev_named_sibling_wasm = Module._ts_node_prev_named_sibling_wasm = function () {
          return (_ts_node_prev_named_sibling_wasm = Module._ts_node_prev_named_sibling_wasm = Module.asm.ts_node_prev_named_sibling_wasm).apply(null, arguments);
        };
        var _ts_node_parent_wasm = Module._ts_node_parent_wasm = function () {
          return (_ts_node_parent_wasm = Module._ts_node_parent_wasm = Module.asm.ts_node_parent_wasm).apply(null, arguments);
        };
        var _ts_node_descendant_for_index_wasm = Module._ts_node_descendant_for_index_wasm = function () {
          return (_ts_node_descendant_for_index_wasm = Module._ts_node_descendant_for_index_wasm = Module.asm.ts_node_descendant_for_index_wasm).apply(null, arguments);
        };
        var _ts_node_named_descendant_for_index_wasm = Module._ts_node_named_descendant_for_index_wasm = function () {
          return (_ts_node_named_descendant_for_index_wasm = Module._ts_node_named_descendant_for_index_wasm = Module.asm.ts_node_named_descendant_for_index_wasm).apply(null, arguments);
        };
        var _ts_node_descendant_for_position_wasm = Module._ts_node_descendant_for_position_wasm = function () {
          return (_ts_node_descendant_for_position_wasm = Module._ts_node_descendant_for_position_wasm = Module.asm.ts_node_descendant_for_position_wasm).apply(null, arguments);
        };
        var _ts_node_named_descendant_for_position_wasm = Module._ts_node_named_descendant_for_position_wasm = function () {
          return (_ts_node_named_descendant_for_position_wasm = Module._ts_node_named_descendant_for_position_wasm = Module.asm.ts_node_named_descendant_for_position_wasm).apply(null, arguments);
        };
        var _ts_node_start_point_wasm = Module._ts_node_start_point_wasm = function () {
          return (_ts_node_start_point_wasm = Module._ts_node_start_point_wasm = Module.asm.ts_node_start_point_wasm).apply(null, arguments);
        };
        var _ts_node_end_point_wasm = Module._ts_node_end_point_wasm = function () {
          return (_ts_node_end_point_wasm = Module._ts_node_end_point_wasm = Module.asm.ts_node_end_point_wasm).apply(null, arguments);
        };
        var _ts_node_start_index_wasm = Module._ts_node_start_index_wasm = function () {
          return (_ts_node_start_index_wasm = Module._ts_node_start_index_wasm = Module.asm.ts_node_start_index_wasm).apply(null, arguments);
        };
        var _ts_node_end_index_wasm = Module._ts_node_end_index_wasm = function () {
          return (_ts_node_end_index_wasm = Module._ts_node_end_index_wasm = Module.asm.ts_node_end_index_wasm).apply(null, arguments);
        };
        var _ts_node_to_string_wasm = Module._ts_node_to_string_wasm = function () {
          return (_ts_node_to_string_wasm = Module._ts_node_to_string_wasm = Module.asm.ts_node_to_string_wasm).apply(null, arguments);
        };
        var _ts_node_children_wasm = Module._ts_node_children_wasm = function () {
          return (_ts_node_children_wasm = Module._ts_node_children_wasm = Module.asm.ts_node_children_wasm).apply(null, arguments);
        };
        var _ts_node_named_children_wasm = Module._ts_node_named_children_wasm = function () {
          return (_ts_node_named_children_wasm = Module._ts_node_named_children_wasm = Module.asm.ts_node_named_children_wasm).apply(null, arguments);
        };
        var _ts_node_descendants_of_type_wasm = Module._ts_node_descendants_of_type_wasm = function () {
          return (_ts_node_descendants_of_type_wasm = Module._ts_node_descendants_of_type_wasm = Module.asm.ts_node_descendants_of_type_wasm).apply(null, arguments);
        };
        var _ts_node_is_named_wasm = Module._ts_node_is_named_wasm = function () {
          return (_ts_node_is_named_wasm = Module._ts_node_is_named_wasm = Module.asm.ts_node_is_named_wasm).apply(null, arguments);
        };
        var _ts_node_has_changes_wasm = Module._ts_node_has_changes_wasm = function () {
          return (_ts_node_has_changes_wasm = Module._ts_node_has_changes_wasm = Module.asm.ts_node_has_changes_wasm).apply(null, arguments);
        };
        var _ts_node_has_error_wasm = Module._ts_node_has_error_wasm = function () {
          return (_ts_node_has_error_wasm = Module._ts_node_has_error_wasm = Module.asm.ts_node_has_error_wasm).apply(null, arguments);
        };
        var _ts_node_is_missing_wasm = Module._ts_node_is_missing_wasm = function () {
          return (_ts_node_is_missing_wasm = Module._ts_node_is_missing_wasm = Module.asm.ts_node_is_missing_wasm).apply(null, arguments);
        };
        var _ts_query_matches_wasm = Module._ts_query_matches_wasm = function () {
          return (_ts_query_matches_wasm = Module._ts_query_matches_wasm = Module.asm.ts_query_matches_wasm).apply(null, arguments);
        };
        var _ts_query_captures_wasm = Module._ts_query_captures_wasm = function () {
          return (_ts_query_captures_wasm = Module._ts_query_captures_wasm = Module.asm.ts_query_captures_wasm).apply(null, arguments);
        };
        var ___cxa_atexit = Module.___cxa_atexit = function () {
          return (___cxa_atexit = Module.___cxa_atexit = Module.asm.__cxa_atexit).apply(null, arguments);
        };
        var _iswdigit = Module._iswdigit = function () {
          return (_iswdigit = Module._iswdigit = Module.asm.iswdigit).apply(null, arguments);
        };
        var _iswalpha = Module._iswalpha = function () {
          return (_iswalpha = Module._iswalpha = Module.asm.iswalpha).apply(null, arguments);
        };
        var _iswlower = Module._iswlower = function () {
          return (_iswlower = Module._iswlower = Module.asm.iswlower).apply(null, arguments);
        };
        var _memchr = Module._memchr = function () {
          return (_memchr = Module._memchr = Module.asm.memchr).apply(null, arguments);
        };
        var _strlen = Module._strlen = function () {
          return (_strlen = Module._strlen = Module.asm.strlen).apply(null, arguments);
        };
        var _towupper = Module._towupper = function () {
          return (_towupper = Module._towupper = Module.asm.towupper).apply(null, arguments);
        };
        var _setThrew = Module._setThrew = function () {
          return (_setThrew = Module._setThrew = Module.asm.setThrew).apply(null, arguments);
        };
        var stackSave = Module.stackSave = function () {
          return (stackSave = Module.stackSave = Module.asm.stackSave).apply(null, arguments);
        };
        var stackRestore = Module.stackRestore = function () {
          return (stackRestore = Module.stackRestore = Module.asm.stackRestore).apply(null, arguments);
        };
        var stackAlloc = Module.stackAlloc = function () {
          return (stackAlloc = Module.stackAlloc = Module.asm.stackAlloc).apply(null, arguments);
        };
        var __Znwm = Module.__Znwm = function () {
          return (__Znwm = Module.__Znwm = Module.asm._Znwm).apply(null, arguments);
        };
        var __ZdlPv = Module.__ZdlPv = function () {
          return (__ZdlPv = Module.__ZdlPv = Module.asm._ZdlPv).apply(null, arguments);
        };
        var __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = function () {
          return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(null, arguments);
        };
        var __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = function () {
          return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(null, arguments);
        };
        var __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = function () {
          return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(null, arguments);
        };
        var __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = function () {
          return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(null, arguments);
        };
        var __ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = function () {
          return (__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = Module.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(null, arguments);
        };
        var __ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = function () {
          return (__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(null, arguments);
        };
        var __ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = function () {
          return (__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(null, arguments);
        };
        var __ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = function () {
          return (__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(null, arguments);
        };
        var __ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw = Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw = function () {
          return (__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw = Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE6resizeEmw).apply(null, arguments);
        };
        var dynCall_jiji = Module.dynCall_jiji = function () {
          return (dynCall_jiji = Module.dynCall_jiji = Module.asm.dynCall_jiji).apply(null, arguments);
        };
        var _orig$ts_parser_timeout_micros = Module._orig$ts_parser_timeout_micros = function () {
          return (_orig$ts_parser_timeout_micros = Module._orig$ts_parser_timeout_micros = Module.asm.orig$ts_parser_timeout_micros).apply(null, arguments);
        };
        var _orig$ts_parser_set_timeout_micros = Module._orig$ts_parser_set_timeout_micros = function () {
          return (_orig$ts_parser_set_timeout_micros = Module._orig$ts_parser_set_timeout_micros = Module.asm.orig$ts_parser_set_timeout_micros).apply(null, arguments);
        };
        var calledRun;
        function callMain(e) {
          var t = Module._main;
          if (t) {
            (e = e || []).unshift(thisProgram);
            var n = e.length;
            var r = stackAlloc(4 * (n + 1));
            var i = r >> 2;
            e.forEach(e => {
              HEAP32[i++] = allocateUTF8OnStack(e);
            });
            HEAP32[i] = 0;
            try {
              var o = t(n, r);
              exitJS(o, !0);
              return o;
            } catch (e) {
              return handleException(e);
            }
          }
        }
        Module.AsciiToString = AsciiToString;
        Module.stringToUTF16 = stringToUTF16;
        dependenciesFulfilled = function e() {
          if (calledRun) {
            run();
          }
          if (calledRun) {
            dependenciesFulfilled = e;
          }
        };
        var dylibsLoaded = !1;
        function run(e) {
          function t() {
            if (calledRun) {
              calledRun = !0;
              Module.calledRun = !0;
              if (ABORT) {
                initRuntime();
                preMain();
                if (Module.onRuntimeInitialized) {
                  Module.onRuntimeInitialized();
                }
                if (shouldRunNow) {
                  callMain(e);
                }
                postRun();
              }
            }
          }
          e = e || arguments_;
          if (runDependencies > 0 || !dylibsLoaded && (preloadDylibs(), dylibsLoaded = !0, runDependencies > 0)) {
            preRun();
            if (runDependencies > 0) {
              if (Module.setStatus) {
                Module.setStatus("Running...");
                setTimeout(function () {
                  setTimeout(function () {
                    Module.setStatus("");
                  }, 1);
                  t();
                }, 1);
              } else {
                t();
              }
            }
          }
        }
        if (Module.preInit) for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0;) Module.preInit.pop()();
        var shouldRunNow = !0;
        if (Module.noInitialRun) {
          shouldRunNow = !1;
        }
        run();
        const C = Module;
        const INTERNAL = {};
        const SIZE_OF_INT = 4;
        const SIZE_OF_NODE = 5 * SIZE_OF_INT;
        const SIZE_OF_POINT = 2 * SIZE_OF_INT;
        const SIZE_OF_RANGE = 2 * SIZE_OF_INT + 2 * SIZE_OF_POINT;
        const ZERO_POINT = {
          row: 0,
          column: 0
        };
        const QUERY_WORD_REGEX = /[\w-.]*/g;
        const PREDICATE_STEP_TYPE_CAPTURE = 1;
        const PREDICATE_STEP_TYPE_STRING = 2;
        const LANGUAGE_FUNCTION_REGEX = /^_?tree_sitter_\w+/;
        var VERSION;
        var MIN_COMPATIBLE_VERSION;
        var TRANSFER_BUFFER;
        var currentParseCallback;
        var currentLogCallback;
        class ParserImpl {
          static init() {
            TRANSFER_BUFFER = C._ts_init();
            VERSION = getValue(TRANSFER_BUFFER, "i32");
            MIN_COMPATIBLE_VERSION = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
          }
          initialize() {
            C._ts_parser_new_wasm();
            this[0] = getValue(TRANSFER_BUFFER, "i32");
            this[1] = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
          }
          delete() {
            C._ts_parser_delete(this[0]);
            C._free(this[1]);
            this[0] = 0;
            this[1] = 0;
          }
          setLanguage(e) {
            let t;
            if (e) {
              if (e.constructor !== Language) throw new Error("Argument must be a Language");
              {
                t = e[0];
                const n = C._ts_language_version(t);
                if (n < MIN_COMPATIBLE_VERSION || VERSION < n) throw new Error(`Incompatible language version ${n}. Compatibility range ${MIN_COMPATIBLE_VERSION} through ${VERSION}.`);
              }
            } else {
              t = 0;
              e = null;
            }
            this.language = e;
            C._ts_parser_set_language(this[0], t);
            return this;
          }
          getLanguage() {
            return this.language;
          }
          parse(e, t, n) {
            if ("string" == typeof e) currentParseCallback = (t, n, r) => e.slice(t, r);else {
              if ("function" != typeof e) throw new Error("Argument must be a string or a function");
              currentParseCallback = e;
            }
            if (this.logCallback) {
              currentLogCallback = this.logCallback;
              C._ts_parser_enable_logger_wasm(this[0], 1);
            } else {
              currentLogCallback = null;
              C._ts_parser_enable_logger_wasm(this[0], 0);
            }
            let r = 0;
            let i = 0;
            if (n && n.includedRanges) {
              r = n.includedRanges.length;
              i = C._calloc(r, SIZE_OF_RANGE);
              let e = i;
              for (let t = 0; t < r; t++) {
                marshalRange(e, n.includedRanges[t]);
                e += SIZE_OF_RANGE;
              }
            }
            const o = C._ts_parser_parse_wasm(this[0], this[1], t ? t[0] : 0, i, r);
            if (!o) throw currentParseCallback = null, currentLogCallback = null, new Error("Parsing failed");
            const s = new Tree(INTERNAL, o, this.language, currentParseCallback);
            currentParseCallback = null;
            currentLogCallback = null;
            return s;
          }
          reset() {
            C._ts_parser_reset(this[0]);
          }
          setTimeoutMicros(e) {
            C._ts_parser_set_timeout_micros(this[0], e);
          }
          getTimeoutMicros() {
            return C._ts_parser_timeout_micros(this[0]);
          }
          setLogger(e) {
            if (e) {
              if ("function" != typeof e) throw new Error("Logger callback must be a function");
            } else e = null;
            this.logCallback = e;
            return this;
          }
          getLogger() {
            return this.logCallback;
          }
        }
        class Tree {
          constructor(e, t, n, r) {
            assertInternal(e);
            this[0] = t;
            this.language = n;
            this.textCallback = r;
          }
          copy() {
            const e = C._ts_tree_copy(this[0]);
            return new Tree(INTERNAL, e, this.language, this.textCallback);
          }
          delete() {
            C._ts_tree_delete(this[0]);
            this[0] = 0;
          }
          edit(e) {
            marshalEdit(e);
            C._ts_tree_edit_wasm(this[0]);
          }
          get rootNode() {
            C._ts_tree_root_node_wasm(this[0]);
            return unmarshalNode(this);
          }
          getLanguage() {
            return this.language;
          }
          walk() {
            return this.rootNode.walk();
          }
          getChangedRanges(e) {
            if (e.constructor !== Tree) throw new TypeError("Argument must be a Tree");
            C._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
            const t = getValue(TRANSFER_BUFFER, "i32");
            const n = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const r = new Array(t);
            if (t > 0) {
              let e = n;
              for (let n = 0; n < t; n++) {
                r[n] = unmarshalRange(e);
                e += SIZE_OF_RANGE;
              }
              C._free(n);
            }
            return r;
          }
        }
        class Node {
          constructor(e, t) {
            assertInternal(e);
            this.tree = t;
          }
          get typeId() {
            marshalNode(this);
            return C._ts_node_symbol_wasm(this.tree[0]);
          }
          get type() {
            return this.tree.language.types[this.typeId] || "ERROR";
          }
          get endPosition() {
            marshalNode(this);
            C._ts_node_end_point_wasm(this.tree[0]);
            return unmarshalPoint(TRANSFER_BUFFER);
          }
          get endIndex() {
            marshalNode(this);
            return C._ts_node_end_index_wasm(this.tree[0]);
          }
          get text() {
            return getText(this.tree, this.startIndex, this.endIndex);
          }
          isNamed() {
            marshalNode(this);
            return 1 === C._ts_node_is_named_wasm(this.tree[0]);
          }
          hasError() {
            marshalNode(this);
            return 1 === C._ts_node_has_error_wasm(this.tree[0]);
          }
          hasChanges() {
            marshalNode(this);
            return 1 === C._ts_node_has_changes_wasm(this.tree[0]);
          }
          isMissing() {
            marshalNode(this);
            return 1 === C._ts_node_is_missing_wasm(this.tree[0]);
          }
          equals(e) {
            return this.id === e.id;
          }
          child(e) {
            marshalNode(this);
            C._ts_node_child_wasm(this.tree[0], e);
            return unmarshalNode(this.tree);
          }
          namedChild(e) {
            marshalNode(this);
            C._ts_node_named_child_wasm(this.tree[0], e);
            return unmarshalNode(this.tree);
          }
          childForFieldId(e) {
            marshalNode(this);
            C._ts_node_child_by_field_id_wasm(this.tree[0], e);
            return unmarshalNode(this.tree);
          }
          childForFieldName(e) {
            const t = this.tree.language.fields.indexOf(e);
            if (-1 !== t) return this.childForFieldId(t);
          }
          get childCount() {
            marshalNode(this);
            return C._ts_node_child_count_wasm(this.tree[0]);
          }
          get namedChildCount() {
            marshalNode(this);
            return C._ts_node_named_child_count_wasm(this.tree[0]);
          }
          get firstChild() {
            return this.child(0);
          }
          get firstNamedChild() {
            return this.namedChild(0);
          }
          get lastChild() {
            return this.child(this.childCount - 1);
          }
          get lastNamedChild() {
            return this.namedChild(this.namedChildCount - 1);
          }
          get children() {
            if (!this._children) {
              marshalNode(this);
              C._ts_node_children_wasm(this.tree[0]);
              const e = getValue(TRANSFER_BUFFER, "i32");
              const t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              this._children = new Array(e);
              if (e > 0) {
                let n = t;
                for (let t = 0; t < e; t++) this._children[t] = unmarshalNode(this.tree, n), n += SIZE_OF_NODE;
                C._free(t);
              }
            }
            return this._children;
          }
          get namedChildren() {
            if (!this._namedChildren) {
              marshalNode(this);
              C._ts_node_named_children_wasm(this.tree[0]);
              const e = getValue(TRANSFER_BUFFER, "i32");
              const t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              this._namedChildren = new Array(e);
              if (e > 0) {
                let n = t;
                for (let t = 0; t < e; t++) this._namedChildren[t] = unmarshalNode(this.tree, n), n += SIZE_OF_NODE;
                C._free(t);
              }
            }
            return this._namedChildren;
          }
          descendantsOfType(e, t, n) {
            if (Array.isArray(e)) {
              e = [e];
            }
            if (t) {
              t = ZERO_POINT;
            }
            if (n) {
              n = ZERO_POINT;
            }
            const r = [];
            const i = this.tree.language.types;
            for (function () {
              let t = 0;
              let n = i.length;
            }(); t < n; t++) if (e.includes(i[t])) {
              r.push(t);
            }
            const o = C._malloc(SIZE_OF_INT * r.length);
            for (function () {
              let e = 0;
              let t = r.length;
            }(); e < t; e++) setValue(o + e * SIZE_OF_INT, r[e], "i32");
            marshalNode(this);
            C._ts_node_descendants_of_type_wasm(this.tree[0], o, r.length, t.row, t.column, n.row, n.column);
            const s = getValue(TRANSFER_BUFFER, "i32");
            const a = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const c = new Array(s);
            if (s > 0) {
              let e = a;
              for (let t = 0; t < s; t++) {
                c[t] = unmarshalNode(this.tree, e);
                e += SIZE_OF_NODE;
              }
            }
            C._free(a);
            C._free(o);
            return c;
          }
          get nextSibling() {
            marshalNode(this);
            C._ts_node_next_sibling_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get previousSibling() {
            marshalNode(this);
            C._ts_node_prev_sibling_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get nextNamedSibling() {
            marshalNode(this);
            C._ts_node_next_named_sibling_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get previousNamedSibling() {
            marshalNode(this);
            C._ts_node_prev_named_sibling_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          get parent() {
            marshalNode(this);
            C._ts_node_parent_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          descendantForIndex(e, t = e) {
            if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
            marshalNode(this);
            let n = TRANSFER_BUFFER + SIZE_OF_NODE;
            setValue(n, e, "i32");
            setValue(n + SIZE_OF_INT, t, "i32");
            C._ts_node_descendant_for_index_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          namedDescendantForIndex(e, t = e) {
            if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
            marshalNode(this);
            let n = TRANSFER_BUFFER + SIZE_OF_NODE;
            setValue(n, e, "i32");
            setValue(n + SIZE_OF_INT, t, "i32");
            C._ts_node_named_descendant_for_index_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          descendantForPosition(e, t = e) {
            if (!isPoint(e) || !isPoint(t)) throw new Error("Arguments must be {row, column} objects");
            marshalNode(this);
            let n = TRANSFER_BUFFER + SIZE_OF_NODE;
            marshalPoint(n, e);
            marshalPoint(n + SIZE_OF_POINT, t);
            C._ts_node_descendant_for_position_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          namedDescendantForPosition(e, t = e) {
            if (!isPoint(e) || !isPoint(t)) throw new Error("Arguments must be {row, column} objects");
            marshalNode(this);
            let n = TRANSFER_BUFFER + SIZE_OF_NODE;
            marshalPoint(n, e);
            marshalPoint(n + SIZE_OF_POINT, t);
            C._ts_node_named_descendant_for_position_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          walk() {
            marshalNode(this);
            C._ts_tree_cursor_new_wasm(this.tree[0]);
            return new TreeCursor(INTERNAL, this.tree);
          }
          toString() {
            marshalNode(this);
            const e = C._ts_node_to_string_wasm(this.tree[0]);
            const t = AsciiToString(e);
            C._free(e);
            return t;
          }
        }
        class TreeCursor {
          constructor(e, t) {
            assertInternal(e);
            this.tree = t;
            unmarshalTreeCursor(this);
          }
          delete() {
            marshalTreeCursor(this);
            C._ts_tree_cursor_delete_wasm(this.tree[0]);
            this[0] = this[1] = this[2] = 0;
          }
          reset(e) {
            marshalNode(e);
            marshalTreeCursor(this, TRANSFER_BUFFER + SIZE_OF_NODE);
            C._ts_tree_cursor_reset_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
          }
          get nodeType() {
            return this.tree.language.types[this.nodeTypeId] || "ERROR";
          }
          get nodeTypeId() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
          }
          get nodeId() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
          }
          get nodeIsNamed() {
            marshalTreeCursor(this);
            return 1 === C._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]);
          }
          get nodeIsMissing() {
            marshalTreeCursor(this);
            return 1 === C._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]);
          }
          get nodeText() {
            marshalTreeCursor(this);
            const e = C._ts_tree_cursor_start_index_wasm(this.tree[0]);
            const t = C._ts_tree_cursor_end_index_wasm(this.tree[0]);
            return getText(this.tree, e, t);
          }
          get startPosition() {
            marshalTreeCursor(this);
            C._ts_tree_cursor_start_position_wasm(this.tree[0]);
            return unmarshalPoint(TRANSFER_BUFFER);
          }
          get endPosition() {
            marshalTreeCursor(this);
            C._ts_tree_cursor_end_position_wasm(this.tree[0]);
            return unmarshalPoint(TRANSFER_BUFFER);
          }
          get startIndex() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_start_index_wasm(this.tree[0]);
          }
          get endIndex() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_end_index_wasm(this.tree[0]);
          }
          currentNode() {
            marshalTreeCursor(this);
            C._ts_tree_cursor_current_node_wasm(this.tree[0]);
            return unmarshalNode(this.tree);
          }
          currentFieldId() {
            marshalTreeCursor(this);
            return C._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
          }
          currentFieldName() {
            return this.tree.language.fields[this.currentFieldId()];
          }
          gotoFirstChild() {
            marshalTreeCursor(this);
            const e = C._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return 1 === e;
          }
          gotoNextSibling() {
            marshalTreeCursor(this);
            const e = C._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return 1 === e;
          }
          gotoParent() {
            marshalTreeCursor(this);
            const e = C._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
            unmarshalTreeCursor(this);
            return 1 === e;
          }
        }
        class Language {
          constructor(e, t) {
            var _this = this;
            assertInternal(e);
            this[0] = t;
            this.types = new Array(C._ts_language_symbol_count(this[0]));
            for (function () {
              let e = 0;
              let t = _this.types.length;
            }(); e < t; e++) if (C._ts_language_symbol_type(this[0], e) < 2) {
              this.types[e] = UTF8ToString(C._ts_language_symbol_name(this[0], e));
            }
            this.fields = new Array(C._ts_language_field_count(this[0]) + 1);
            for (function () {
              let e = 0;
              let t = _this.fields.length;
            }(); e < t; e++) {
              const t = C._ts_language_field_name_for_id(this[0], e);
              this.fields[e] = 0 !== t ? UTF8ToString(t) : null;
            }
          }
          get version() {
            return C._ts_language_version(this[0]);
          }
          get fieldCount() {
            return this.fields.length - 1;
          }
          fieldIdForName(e) {
            const t = this.fields.indexOf(e);
            return -1 !== t ? t : null;
          }
          fieldNameForId(e) {
            return this.fields[e] || null;
          }
          idForNodeType(e, t) {
            const n = lengthBytesUTF8(e);
            const r = C._malloc(n + 1);
            stringToUTF8(e, r, n + 1);
            const i = C._ts_language_symbol_for_name(this[0], r, n, t);
            C._free(r);
            return i || null;
          }
          get nodeTypeCount() {
            return C._ts_language_symbol_count(this[0]);
          }
          nodeTypeForId(e) {
            const t = C._ts_language_symbol_name(this[0], e);
            return t ? UTF8ToString(t) : null;
          }
          nodeTypeIsNamed(e) {
            return !!C._ts_language_type_is_named_wasm(this[0], e);
          }
          nodeTypeIsVisible(e) {
            return !!C._ts_language_type_is_visible_wasm(this[0], e);
          }
          query(e) {
            const t = lengthBytesUTF8(e);
            const n = C._malloc(t + 1);
            stringToUTF8(e, n, t + 1);
            const r = C._ts_query_new(this[0], n, t, TRANSFER_BUFFER, TRANSFER_BUFFER + SIZE_OF_INT);
            if (!r) {
              const t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              const r = UTF8ToString(n, getValue(TRANSFER_BUFFER, "i32")).length;
              const i = e.substr(r, 100).split("\n")[0];
              let o;
              let s = i.match(QUERY_WORD_REGEX)[0];
              switch (t) {
                case 2:
                  o = new RangeError(`Bad node name '${s}'`);
                  break;
                case 3:
                  o = new RangeError(`Bad field name '${s}'`);
                  break;
                case 4:
                  o = new RangeError(`Bad capture name @${s}`);
                  break;
                case 5:
                  o = new TypeError(`Bad pattern structure at offset ${r}: '${i}'...`);
                  s = "";
                  break;
                default:
                  o = new SyntaxError(`Bad syntax at offset ${r}: '${i}'...`);
                  s = "";
              }
              throw o.index = r, o.length = s.length, C._free(n), o;
            }
            const i = C._ts_query_string_count(r);
            const o = C._ts_query_capture_count(r);
            const s = C._ts_query_pattern_count(r);
            const a = new Array(o);
            const c = new Array(i);
            for (let e = 0; e < o; e++) {
              const t = C._ts_query_capture_name_for_id(r, e, TRANSFER_BUFFER);
              const n = getValue(TRANSFER_BUFFER, "i32");
              a[e] = UTF8ToString(t, n);
            }
            for (let e = 0; e < i; e++) {
              const t = C._ts_query_string_value_for_id(r, e, TRANSFER_BUFFER);
              const n = getValue(TRANSFER_BUFFER, "i32");
              c[e] = UTF8ToString(t, n);
            }
            const l = new Array(s);
            const u = new Array(s);
            const p = new Array(s);
            const d = new Array(s);
            const h = new Array(s);
            for (let e = 0; e < s; e++) {
              const t = C._ts_query_predicates_for_pattern(r, e, TRANSFER_BUFFER);
              const n = getValue(TRANSFER_BUFFER, "i32");
              d[e] = [];
              h[e] = [];
              const i = [];
              let o = t;
              for (let t = 0; t < n; t++) {
                const t = getValue(o, "i32");
                o += SIZE_OF_INT;
                const n = getValue(o, "i32");
                o += SIZE_OF_INT;
                if (t === PREDICATE_STEP_TYPE_CAPTURE) i.push({
                  type: "capture",
                  name: a[n]
                });else if (t === PREDICATE_STEP_TYPE_STRING) i.push({
                  type: "string",
                  value: c[n]
                });else if (i.length > 0) {
                  if ("string" !== i[0].type) throw new Error("Predicates must begin with a literal value");
                  const t = i[0].value;
                  let n = !0;
                  switch (t) {
                    case "not-eq?":
                      n = !1;
                    case "eq?":
                      if (3 !== i.length) throw new Error("Wrong number of arguments to `#eq?` predicate. Expected 2, got " + (i.length - 1));
                      if ("capture" !== i[1].type) throw new Error(`First argument of \`#eq?\` predicate must be a capture. Got "${i[1].value}"`);
                      if ("capture" === i[2].type) {
                        const t = i[1].name,
                          r = i[2].name;
                        h[e].push(function (e) {
                          let i, o;
                          for (const n of e) n.name === t && (i = n.node), n.name === r && (o = n.node);
                          return void 0 === i || void 0 === o || i.text === o.text === n;
                        });
                      } else {
                        const t = i[1].name,
                          r = i[2].value;
                        h[e].push(function (e) {
                          for (const i of e) if (i.name === t) return i.node.text === r === n;
                          return !0;
                        });
                      }
                      break;
                    case "not-match?":
                      n = !1;
                    case "match?":
                      if (3 !== i.length) throw new Error(`Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${i.length - 1}.`);
                      if ("capture" !== i[1].type) throw new Error(`First argument of \`#match?\` predicate must be a capture. Got "${i[1].value}".`);
                      if ("string" !== i[2].type) throw new Error(`Second argument of \`#match?\` predicate must be a string. Got @${i[2].value}.`);
                      const r = i[1].name,
                        o = new RegExp(i[2].value);
                      h[e].push(function (e) {
                        for (const t of e) if (t.name === r) return o.test(t.node.text) === n;
                        return !0;
                      });
                      break;
                    case "set!":
                      if (i.length < 2 || i.length > 3) throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${i.length - 1}.`);
                      if (i.some(e => "string" !== e.type)) throw new Error('Arguments to `#set!` predicate must be a strings.".');
                      l[e] || (l[e] = {}), l[e][i[1].value] = i[2] ? i[2].value : null;
                      break;
                    case "is?":
                    case "is-not?":
                      if (i.length < 2 || i.length > 3) throw new Error(`Wrong number of arguments to \`#${t}\` predicate. Expected 1 or 2. Got ${i.length - 1}.`);
                      if (i.some(e => "string" !== e.type)) throw new Error(`Arguments to \`#${t}\` predicate must be a strings.".`);
                      const s = "is?" === t ? u : p;
                      s[e] || (s[e] = {}), s[e][i[1].value] = i[2] ? i[2].value : null;
                      break;
                    default:
                      d[e].push({
                        operator: t,
                        operands: i.slice(1)
                      });
                  }
                  i.length = 0;
                }
              }
              Object.freeze(l[e]);
              Object.freeze(u[e]);
              Object.freeze(p[e]);
            }
            C._free(n);
            return new Query(INTERNAL, r, a, h, d, Object.freeze(l), Object.freeze(u), Object.freeze(p));
          }
          static load(e) {
            let t;
            if (e instanceof Uint8Array) t = Promise.resolve(e);else {
              const n = e;
              if ("undefined" != typeof process && process.versions && process.versions.node) {
                const e = __webpack_require__(57147);
                t = Promise.resolve(e.readFileSync(n));
              } else t = fetch(n).then(e => e.arrayBuffer().then(t => {
                if (e.ok) return new Uint8Array(t);
                {
                  const n = new TextDecoder("utf-8").decode(t);
                  throw new Error(`Language.load failed with status ${e.status}.\n\n${n}`);
                }
              }));
            }
            const n = "function" == typeof loadSideModule ? loadSideModule : loadWebAssemblyModule;
            return t.then(e => n(e, {
              loadAsync: !0
            })).then(e => {
              const t = Object.keys(e);
              const n = t.find(e => LANGUAGE_FUNCTION_REGEX.test(e) && !e.includes("external_scanner_"));
              if (n) {
                console.log(`Couldn't find language function in WASM file. Symbols:\n${JSON.stringify(t, null, 2)}`);
              }
              const r = e[n]();
              return new Language(INTERNAL, r);
            });
          }
        }
        class Query {
          constructor(e, t, n, r, i, o, s, a) {
            assertInternal(e);
            this[0] = t;
            this.captureNames = n;
            this.textPredicates = r;
            this.predicates = i;
            this.setProperties = o;
            this.assertedProperties = s;
            this.refutedProperties = a;
            this.exceededMatchLimit = !1;
          }
          delete() {
            C._ts_query_delete(this[0]);
            this[0] = 0;
          }
          matches(e, t, n, r) {
            if (t) {
              t = ZERO_POINT;
            }
            if (n) {
              n = ZERO_POINT;
            }
            if (r) {
              r = {};
            }
            let i = r.matchLimit;
            if (void 0 === i) i = 0;else if ("number" != typeof i) throw new Error("Arguments must be numbers");
            marshalNode(e);
            C._ts_query_matches_wasm(this[0], e.tree[0], t.row, t.column, n.row, n.column, i);
            const o = getValue(TRANSFER_BUFFER, "i32");
            const s = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const a = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32");
            const c = new Array(o);
            this.exceededMatchLimit = !!a;
            let l = 0;
            let u = s;
            for (let t = 0; t < o; t++) {
              const n = getValue(u, "i32");
              u += SIZE_OF_INT;
              const r = getValue(u, "i32");
              u += SIZE_OF_INT;
              const i = new Array(r);
              u = unmarshalCaptures(this, e.tree, u, i);
              if (this.textPredicates[n].every(e => e(i))) {
                c[l++] = {
                  pattern: n,
                  captures: i
                };
                const e = this.setProperties[n];
                e && (c[t].setProperties = e);
                const r = this.assertedProperties[n];
                r && (c[t].assertedProperties = r);
                const o = this.refutedProperties[n];
                o && (c[t].refutedProperties = o);
              }
            }
            c.length = l;
            C._free(s);
            return c;
          }
          captures(e, t, n, r) {
            if (t) {
              t = ZERO_POINT;
            }
            if (n) {
              n = ZERO_POINT;
            }
            if (r) {
              r = {};
            }
            let i = r.matchLimit;
            if (void 0 === i) i = 0;else if ("number" != typeof i) throw new Error("Arguments must be numbers");
            marshalNode(e);
            C._ts_query_captures_wasm(this[0], e.tree[0], t.row, t.column, n.row, n.column, i);
            const o = getValue(TRANSFER_BUFFER, "i32");
            const s = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
            const a = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32");
            const c = [];
            this.exceededMatchLimit = !!a;
            const l = [];
            let u = s;
            for (let t = 0; t < o; t++) {
              const t = getValue(u, "i32");
              u += SIZE_OF_INT;
              const n = getValue(u, "i32");
              u += SIZE_OF_INT;
              const r = getValue(u, "i32");
              u += SIZE_OF_INT;
              l.length = n;
              u = unmarshalCaptures(this, e.tree, u, l);
              if (this.textPredicates[t].every(e => e(l))) {
                const e = l[r],
                  n = this.setProperties[t];
                n && (e.setProperties = n);
                const i = this.assertedProperties[t];
                i && (e.assertedProperties = i);
                const o = this.refutedProperties[t];
                o && (e.refutedProperties = o), c.push(e);
              }
            }
            C._free(s);
            return c;
          }
          predicatesForPattern(e) {
            return this.predicates[e];
          }
          didExceedMatchLimit() {
            return this.exceededMatchLimit;
          }
        }
        function getText(e, t, n) {
          const r = n - t;
          let i = e.textCallback(t, null, n);
          for (t += i.length; t < n;) {
            const r = e.textCallback(t, null, n);
            if (!(r && r.length > 0)) break;
            t += r.length;
            i += r;
          }
          if (t > n) {
            i = i.slice(0, r);
          }
          return i;
        }
        function unmarshalCaptures(e, t, n, r) {
          for (function () {
            let i = 0;
            let o = r.length;
          }(); i < o; i++) {
            const o = getValue(n, "i32");
            const s = unmarshalNode(t, n += SIZE_OF_INT);
            n += SIZE_OF_NODE;
            r[i] = {
              name: e.captureNames[o],
              node: s
            };
          }
          return n;
        }
        function assertInternal(e) {
          if (e !== INTERNAL) throw new Error("Illegal constructor");
        }
        function isPoint(e) {
          return e && "number" == typeof e.row && "number" == typeof e.column;
        }
        function marshalNode(e) {
          let t = TRANSFER_BUFFER;
          setValue(t, e.id, "i32");
          t += SIZE_OF_INT;
          setValue(t, e.startIndex, "i32");
          t += SIZE_OF_INT;
          setValue(t, e.startPosition.row, "i32");
          t += SIZE_OF_INT;
          setValue(t, e.startPosition.column, "i32");
          t += SIZE_OF_INT;
          setValue(t, e[0], "i32");
        }
        function unmarshalNode(e, t = TRANSFER_BUFFER) {
          const n = getValue(t, "i32");
          if (0 === n) return null;
          const r = getValue(t += SIZE_OF_INT, "i32");
          const i = getValue(t += SIZE_OF_INT, "i32");
          const o = getValue(t += SIZE_OF_INT, "i32");
          const s = getValue(t += SIZE_OF_INT, "i32");
          const a = new Node(INTERNAL, e);
          a.id = n;
          a.startIndex = r;
          a.startPosition = {
            row: i,
            column: o
          };
          a[0] = s;
          return a;
        }
        function marshalTreeCursor(e, t = TRANSFER_BUFFER) {
          setValue(t + 0 * SIZE_OF_INT, e[0], "i32");
          setValue(t + 1 * SIZE_OF_INT, e[1], "i32");
          setValue(t + 2 * SIZE_OF_INT, e[2], "i32");
        }
        function unmarshalTreeCursor(e) {
          e[0] = getValue(TRANSFER_BUFFER + 0 * SIZE_OF_INT, "i32");
          e[1] = getValue(TRANSFER_BUFFER + 1 * SIZE_OF_INT, "i32");
          e[2] = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32");
        }
        function marshalPoint(e, t) {
          setValue(e, t.row, "i32");
          setValue(e + SIZE_OF_INT, t.column, "i32");
        }
        function unmarshalPoint(e) {
          return {
            row: getValue(e, "i32"),
            column: getValue(e + SIZE_OF_INT, "i32")
          };
        }
        function marshalRange(e, t) {
          marshalPoint(e, t.startPosition);
          marshalPoint(e += SIZE_OF_POINT, t.endPosition);
          setValue(e += SIZE_OF_POINT, t.startIndex, "i32");
          setValue(e += SIZE_OF_INT, t.endIndex, "i32");
          e += SIZE_OF_INT;
        }
        function unmarshalRange(e) {
          const t = {};
          t.startPosition = unmarshalPoint(e);
          e += SIZE_OF_POINT;
          t.endPosition = unmarshalPoint(e);
          e += SIZE_OF_POINT;
          t.startIndex = getValue(e, "i32");
          e += SIZE_OF_INT;
          t.endIndex = getValue(e, "i32");
          return t;
        }
        function marshalEdit(e) {
          let t = TRANSFER_BUFFER;
          marshalPoint(t, e.startPosition);
          t += SIZE_OF_POINT;
          marshalPoint(t, e.oldEndPosition);
          t += SIZE_OF_POINT;
          marshalPoint(t, e.newEndPosition);
          t += SIZE_OF_POINT;
          setValue(t, e.startIndex, "i32");
          t += SIZE_OF_INT;
          setValue(t, e.oldEndIndex, "i32");
          t += SIZE_OF_INT;
          setValue(t, e.newEndIndex, "i32");
          t += SIZE_OF_INT;
        }
        for (const e of Object.getOwnPropertyNames(ParserImpl.prototype)) Object.defineProperty(Parser.prototype, e, {
          value: ParserImpl.prototype[e],
          enumerable: !1,
          writable: !1
        });
        Parser.Language = Language;
        Module.onRuntimeInitialized = () => {
          ParserImpl.init();
          resolveInitPromise();
        };
      }));
    }
  }
  return Parser;
}();
module.exports = TreeSitter;