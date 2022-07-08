Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee.caller);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: function(){
    return __stack[1].getLineNumber();
  }
});

Object.defineProperty(global, '__file', {
  get: function(){
	let last = __stack[1].getFileName().lastIndexOf('/');
    return __stack[1].getFileName().slice(last);
  }
});

class debug {

	constructor() {
	}

    static log(...info) {
		console.error(__file,__line,'>>',...info);
    }

    static out(...info) {
		console.error('>>',...info);
    }

    static log2(...info) {
		console.error(__filename,__line,'>>',info);
    }
}

module.exports = debug;

//debug.log('hello world!','111',222);
//debug.log2('hello world!','111',222);
