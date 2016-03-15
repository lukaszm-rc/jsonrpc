(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */"use strict";var JsonRpc=require('./src/JsonRpc.js');global.JsonRpc=JsonRpc;console.log('asd');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./src/JsonRpc.js":9}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
module.exports = require('./src/JSONLess.js');

},{"./src/JSONLess.js":4}],4:[function(require,module,exports){
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var __handlers = {};
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
class JSONLess {
	/**
	 * Parse JSON string
	 * @static
	 * @param text
	 * @param reviver
	 */
	static parse(text, reviver) {
		var value = JSON.parse(text, reviver);
		if ([
				'Array',
				'Object'
			].indexOf(utls.getType(value)) !== -1) {
			value = utls.traverse(value, v => [
				'Array',
				'Object'
			].indexOf(utls.getType(v)) !== -1, _revive);
		}
		return value;
	}

	/**
	 * Converts JavaScript value to JSON string
	 * @static
	 * @param value
	 * @param replacer
	 * @param space
	 */
	static stringify(value, replacer, space) {
		if (utls.isCircular(value)) {
			throw new TypeError('Converting circular structure to JSONLess');
		}
		if (utls.getType(value) === 'Array' || typeof value === 'object') {
			value = utls.traverse(value, v => [
				'Array',
				'Object'
			].indexOf(utls.getType(v)) === -1, _replace);
		}
		return JSON.stringify(value, replacer, space)
	}

	/**
	 * Adds type handler
	 * @static
	 * @param {*} cls
	 * @param {Function} replacer
	 * @param {Function} reviver
	 */
	static addHandler(cls, replacer, reviver) {
		__handlers[utls.getType(cls)] = {
			cls : cls,
			replacer : replacer,
			reviver : reviver
		};
	}
}
/**
 *
 * @param {*} value
 * @param {String|Number|undefined} key
 * @param {Array|Object|undefined} origin
 * @returns {*}
 * @private
 */
function _replace(value, key, origin) {
	var type = utls.getType(value);
	if (typeof __handlers[type] === 'object') {
		value = {
			$type : type,
			$value : __handlers[type].replacer(__handlers[type].cls, value)
		};
	}
	return value;
}
/**
 *
 * @param {*} value
 * @param {String|Number|undefined} key
 * @param {Array|Object|undefined} origin
 * @returns {*}
 * @private
 */
function _revive(value, key, origin) {
	if (utls.getType(value) === 'Array') {
		value.forEach((item, key) => {
			if ([
					'Array',
					'Object'
				].indexOf(utls.getType(item)) !== -1) {
				value[key] = utls.traverse(item, v => [
					'Array',
					'Object'
				].indexOf(utls.getType(v)) !== -1, _revive);
			} else {
				value[key] = item;
			}
		});
	} else {
		if (value['$type'] !== undefined && value['$value'] !== undefined) {
			if (typeof __handlers[value['$type']] === 'object') {
				value = __handlers[value['$type']].reviver(__handlers[value['$type']].cls, value['$value']);
			}
		} else {
			Object.getOwnPropertyNames(value).forEach((key) => {
				if ([
						'Array',
						'Object'
					].indexOf(utls.getType(value[key])) !== -1) {
					value[key] = utls.traverse(value[key], v => [
						'Array',
						'Object'
					].indexOf(utls.getType(v)) !== -1, _revive);
				}
			});
		}
	}
	return value;
}
// Date
JSONLess.addHandler(Date, (cls, value) => {
	return value.toJSON();
}, (cls, value) => {
	return new cls(value);
});
module.exports = JSONLess;

},{"utls":7}],5:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":6}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],7:[function(require,module,exports){
"use strict";
module.exports = require('./src/utls.js');

},{"./src/utls.js":8}],8:[function(require,module,exports){
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
/**
 * @type {Object}
 * @private
 */
var __vcopy_handlers = {};
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
class utls {
	/**
	 * Throws error if u try to instantiate utls class
	 * @throws {Error}
	 */
	constructor() {
		throw new Error('Class "utls" cannot be instantiated');
	}

	/**
	 * Returns type of given value or name of function/object.
	 * @param {*} value
	 * @return {String}
	 */
	static getType(value) {
		var type = /\[object ([^\]]*)]/.exec(Object.prototype.toString.call(value))[1];
		switch (type) {
			case 'Number':
				if (value % 1 !== 0) {
					type = 'Float';
				} else {
					type = 'Integer';
				}
				break;
			case 'Function':
				type = value.name.length ? value.name : type;
				break;
			case 'Object':
				type = value.constructor.name.length ? value.constructor.name : type;
				break;
			default:
				break;
		}
		return type;
	}

	/**
	 * Returns number of seconds since 1 January 1970 00:00:00 UTC.
	 * @return {Number}
	 */
	static microtime() {
		return (new Date()).getTime() / 1000;
	}

	/**
	 * Returns a string with the first character of string capitalized, if that character is alphabetic.
	 * @param {String} string
	 * @return {String}
	 */
	static ucFirst(string) {
		return (string || '').charAt(0).toUpperCase() + string.slice(1);
	}

	/**
	 * Returns a string with the first character of string, lowercased if that character is alphabetic.
	 * @param {String} string
	 * @return {String}
	 */
	static lcFirst(string) {
		return (string || '').charAt(0).toLowerCase() + string.slice(1);
	}

	/**
	 * Returns a camel-cased string. Word boundaries are "\b", "-", "_", " "
	 * @param {String} string
	 * @returns {String}
	 */
	static camelCase(string) {
		return (string || '').toLowerCase().replace(/(-|\s|_)./g, function (m) {
			return m.toUpperCase().replace(/-|\s|_/, '');
		});
	}

	/**
	 * Returns a pascal-cased string. Word boundaries are "\b", "-", "_", " "
	 * @param {String} string
	 * @returns {String}
	 */
	static pascalCase(string) {
		return this.ucFirst(this.camelCase(string));
	}

	/**
	 * Checks whether a file or directory exists
	 * @throws {Error}
	 * @return {Boolean}
	 */
	static fileExists(path) {
		if (!require('path').isAbsolute(path)) {
			throw new Error("Path must be absolute!");
		}
		try {
			let fs = require('fs');
			fs.accessSync(fs.realpathSync(path), fs.F_OK);
		} catch (e) {
			return false;
		}
		return true;
	}

	/**
	 * Makes directory
	 * @param {String} path
	 * @param {Options} options
	 * @throws {Error}
	 */
	static mkdir(path, options) {
		options = options || {};
		options.mode = options.mode || 0o775;
		options.parents = options.parents || true;
		let xpath = require('path');
		let fs = require('fs');
		let parts = path.split(xpath.sep);
		if(options.parents) {
			for (let i = 1; i < parts.length; i++) {
				path = parts.slice(0, i).join(xpath.sep) + xpath.sep;
				if (!utls.fileExists(path)) {
					fs.mkdirSync(path, options.mode);
				}
			}
		} else {
			path = parts.splice(0, parts.length - 1).join(xpath.sep) + xpath.sep;
			if (utls.fileExists(path)) {

			}
		}
		return true;
	}

	/**
	 * Copy properties from source to destination object
	 * @param {Object} destination
	 * @param {Object} source
	 * @returns {*}
	 */
	static extend(destination, source) {
		destination = destination || {};
		source = source || {};
		for (var property in source) {
			if (source.hasOwnProperty(property) && source[property] && source[property].constructor && source[property].constructor === Object) {
				if (!(destination[property] && destination[property].constructor && destination[property].constructor === Object)) {
					destination[property] = {};
				}
				utls.extend(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	}

	/**
	 * @param {Promise[]} promises
	 * @param {Promise} initial
	 * @returns {Promise}
	 */
	static promisesWaterfall(promises, initial) {
		if ("Promise" !== utls.getType(initial)) {
			throw new Error("Initial value must be Promise");
		}
		return new Promise((resolve, reject) => {
			var final = promises.reduce((prevTask, current) => {
				return prevTask.then(current).catch(reject);
			}, initial);
			final.then(resolve).catch(reject);
		});
	}

	/**
	 * @param {*} value
	 * @param {Function} match
	 * @param {Function} callback
	 * @param {String|Number} key
	 * @param {*} origin
	 * @returns {*}
	 */
	static traverse(value, match, callback, key, origin) {
		if (match(value)) {
			return callback(value, key, origin);
		} else if (utls.getType(value) == 'Array') {
			let arr = [];
			value.map((val, key, origin) => {
				let res = utls.traverse(val, match, callback, key, origin);
				if (res !== undefined) {
					arr.push(res);
				}
			});
			if (arr.length) {
				return arr;
			}
		} else if (utls.getType(value) == 'Object') {
			var obj = {};
			Object.getOwnPropertyNames(value).forEach((key) => {
				let res = utls.traverse(value[key], match, callback, key, value);
				if (res !== undefined) {
					obj[key] = res;
				}
			});
			if (Object.getOwnPropertyNames(obj).length) {
				return obj;
			}
		}
	}

	/**
	 * Checks objects or arrays are equal
	 *
	 * @param {Array|Object} first
	 * @param {Array|Object} second
	 * @returns {Boolean}
	 */
	static equals(first, second) {
		function arrays(first, second) {
			if (first === second) {
				return true;
			}
			if (first.length !== second.length) {
				return false;
			}
			var length = first.length;
			for (var i = 0; i < length; i++) {
				if (first[i] instanceof Array && second[i] instanceof Array) {
					if (!arrays(first[i], second[i])) {
						return false;
					}
				} else if (first[i] instanceof Object && second[i] instanceof Object) {
					if (!objects(first[i], second[i])) {
						return false;
					}
				} else {
					if (first[i] !== second[i]) {
						return false;
					}
				}
			}
			return true;
		}

		function objects(first, second) {
			if (first === second) {
				return true;
			}
			var firstProps = Object.getOwnPropertyNames(first).sort();
			var firstPropsLength = firstProps.length;
			var secondProps = Object.getOwnPropertyNames(second).sort();
			if (firstPropsLength !== secondProps.length) {
				return false;
			}
			if (!arrays(firstProps, secondProps)) {
				return false;
			}
			for (var i = 0; i < firstPropsLength; i++) {
				var key = firstProps[i];
				if (first[key] instanceof Array && second[key] instanceof Array) {
					if (!arrays(first[key], second[key])) {
						return false;
					}
				} else if (first[key] instanceof Object && second[key] instanceof Object) {
					if (!objects(first[key], second[key])) {
						return false;
					}
				} else {
					if (first[key] !== second[key]) {
						return false;
					}
				}
			}
			return true;
		}

		if (first instanceof Array && second instanceof Array) {
			return arrays(first, second);
		} else if (first instanceof Object && second instanceof Object) {
			return objects(first, second);
		} else {
			return false;
		}
	}

	/**
	 * Makes copy of value (dereferences object values)
	 *
	 * @param {*} value
	 * @returns {*}
	 */
	static vcopy(value) {
		var copy;
		if (typeof value === 'object') {
			var type = utls.getType(value);
			if (type === 'Array') {
				copy = value.map((val) => {
					return utls.vcopy(val);
				});
			} else if (type === 'Object') {
				copy = {};
				Object.getOwnPropertyNames(value).forEach((key) => {
					copy[key] = utls.vcopy(value[key]);
				});
			} else if (typeof __vcopy_handlers[type] === 'object') {
				return __vcopy_handlers[type].handler(__vcopy_handlers[type].cls, value);
			} else {
				copy = value;
			}
		} else {
			copy = value;
		}
		return copy;
	}

	/**
	 *
	 * @param {Array|Object} value
	 * @returns {*}
	 */
	static isCircular(value) {
		var __ref = [];

		function check(value) {
			if (typeof value === 'object') {
				if (__ref.indexOf(value) !== -1) {
					return true;
				}
				__ref.push(value);
				for (var key in value) {
					if (value.hasOwnProperty(key) && check(value[key])) {
						return true;
					}
				}
				__ref.pop();
			}
			return false;
		}

		return check(value);
	}
}
/**
 * Adds type handler
 * @param {*} cls
 * @param {Function} handler
 */
utls.vcopy.addHandler = function vcopy_addHandler(cls, handler) {
	__vcopy_handlers[utls.getType(cls)] = {
		cls : cls,
		handler : handler
	};
};
utls.vcopy.addHandler(Date, (cls, value) => {
	return new cls(value.getTime());
});
module.exports = utls;

},{"fs":2,"path":5}],9:[function(require,module,exports){
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var utls=require('utls');var JSONLess=require('json-less');var __version='1.1.0';var __id=0;var __callbacks={};var __callbacksTimeout=60000;var __options={autoFireCallbacks:true}; /**
 * @abstract
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */var JsonRpc=function(){ /**
	 * @param {Object} message
	 */function JsonRpc(message){_classCallCheck(this,JsonRpc);if(this.constructor===JsonRpc){throw new TypeError('Abstract class "JsonRpc" cannot be instantiated directly.');}if(message.callback!==undefined){var callback=message.callback;delete message.callback;}this.message=message;if(callback){this.setCallback(callback);}if(this.constructor===Response){if(__options.autoFireCallbacks){if(__callbacks[this.getId()]!==undefined){JsonRpc.fireCallback(this);}}}} /**
	 * Sets global options
	 * @param {Object} options
	 */_createClass(JsonRpc,[{key:'getVersion', /**
	 * Gets messeage schema version
	 * @returns {String}
	 */value:function getVersion(){return this.message.version;} /**
	 * Sets messeage schema version
	 * @param {String} version
	 */},{key:'setVersion',value:function setVersion(version){this.message.version=version;return this;} /**
	 * Gets messeage id
	 * @returns {Number}
	 */},{key:'getId',value:function getId(){return this.message.id;} /**
	 * Sets messeage id
	 * @param {Number} id
	 * @returns {JsonRpc}
	 */},{key:'setId',value:function setId(id){this.message.id=parseInt(id,10);return this;} /**
	 * Gets messeage resource for method
	 * @returns {String}
	 */},{key:'getResource',value:function getResource(){return this.message.resource;} /**
	 * Sets messeage resource for method
	 * @param {String} resource
	 * @returns {JsonRpc}
	 */},{key:'setResource',value:function setResource(resource){this.message.resource=resource;return this;} /**
	 * Gets messeage method
	 * @returns {String}
	 */},{key:'getMethod',value:function getMethod(){return this.message.method;} /**
	 * Sets messeage method
	 * @param {String} method
	 * @returns {JsonRpc}
	 */},{key:'setMethod',value:function setMethod(method){this.message.method=method;return this;} /**
	 * Gets messeage callback
	 * @returns {Function|undefined}
	 */},{key:'getCallback',value:function getCallback(){return __callbacks[this.message.id]?__callbacks[this.message.id].cb:undefined;} /**
	 * Sets messeage callback
	 * @param {Function} callback Callback to be fired when got response
	 * @param {Number} tls Time in ms how long keep uncalled callback
	 * @returns {JsonRpc}
	 */},{key:'setCallback',value:function setCallback(callback,tls){tls=tls||__callbacksTimeout;var self=this;var timeout=setTimeout(function(){JsonRpc.removeCallback(self.message.id);},tls);__callbacks[this.message.id]={cb:callback,timeout:timeout}; //console.log(__callbacks);
return this;} /**
	 * Gets messeage parameters for method
	 * @returns {Object}
	 */},{key:'getParams',value:function getParams(){return this.message.params;} /**
	 * Sets messeage parameters for method
	 * @param {Object} params
	 * @returns {JsonRpc}
	 */},{key:'setParams',value:function setParams(params){this.message.params=params;return this;} /**
	 * Gets messeage result
	 * @returns {*}
	 */},{key:'getResult',value:function getResult(){return this.message.result;} /**
	 * Sets messeage result
	 * @param {*} result
	 * @returns {JsonRpc}
	 */},{key:'setResult',value:function setResult(result){this.message.result=result;return this;} /**
	 * Gets messeage Error
	 * @returns {JsonRpcError}
	 */},{key:'getError',value:function getError(){return this.message.error;} /**
	 * Sets messeage
	 * @param {JsonRpcError|Object} error
	 * @returns {JsonRpc}
	 */},{key:'setError',value:function setError(error){if(!(error instanceof JsonRpcError)){error=new JsonRpcError(error);}this.message.error=error;return this;} /**
	 *
	 * @returns {{version: *, id: *, resource: *, method: *, params: *, callback: *}}
	 */},{key:'toJSON',value:function toJSON(){return this.message;} /**
	 *
	 * @returns {String}
	 */},{key:'toString',value:function toString(){return JSONLess.stringify(this.toJSON());}},{key:'isRequest', /**
	 * Determinates is current message is request
	 * @returns {Boolean}
	 */get:function get(){return this instanceof Request;} /**
	 * Determinates is current message is response
	 * @returns {Boolean}
	 */},{key:'isResponse',get:function get(){return this instanceof Response;} /**
	 * Determinates is current message is notification
	 * @returns {Boolean}
	 */},{key:'isNotification',get:function get(){return this instanceof Notification;}}],[{key:'setOptions',value:function setOptions(options){__options=utls.extend(__options,options);} /**
	 * Gets global options
	 * @returns {Object}
	 */},{key:'getOptions',value:function getOptions(){return __options;} /**
	 * Gets message type
	 * @param {Object} message
	 * @returns {string} Posible values: request, response, notification
	 * @throws {Error}
	 */},{key:'getType',value:function getType(message){if(!(message instanceof Object)){throw new Error('Message parameter must be object');}switch(true){case JsonRpc.isValidRequest(message):return 'request';case JsonRpc.isValidResponse(message):return 'response';case JsonRpc.isValidNotification(message):return 'notification';default:break;}} /**
	 * Parse message
	 * @param {Object|String} message
	 * @returns {JsonRpcRequest|JsonRpcResponse|JsonRpcNotification}
	 * @throws {Error}
	 */},{key:'parse',value:function parse(message){if(utls.getType(message)!=='Object'){if(utls.getType(message)==='String'){try{message=JSONLess.parse(message);}catch(e){throw new Error(JsonRpcError.E_PARSE.message,JsonRpcError.E_PARSE.code);}}else {throw new Error('Message must be string or object type');}}switch(JsonRpc.getType(message)){case 'request':return new Request(message);case 'response':return new Response(message);case 'notification':return new Notification(message);default:throw new Error('Unknown message type');}} /**
	 * Checks that message is valid request
	 * @param {Object} message
	 * @returns {Boolean}
	 */},{key:'isValidRequest',value:function isValidRequest(message){if(utls.getType(message)!=='Object'){return false;}if(message.error!==undefined||message.result!==undefined){return false;}return message.version===__version&&utls.getType(message.id)==='Integer'&&message.id>0&&utls.getType(message.resource)==='String'&&message.resource.length&&utls.getType(message.method)==='String'&&message.method.length&&utls.getType(message.params)==='Object';} /**
	 * Checks that message is valid response
	 * @param {Object} message
	 * @returns {Boolean}
	 */},{key:'isValidResponse',value:function isValidResponse(message){if(utls.getType(message)!=='Object'){return false;}if(message.method!==undefined||message.resource!==undefined||message.params!==undefined){return false;}if(message.id!==undefined){if(utls.getType(message.id)!=='Integer'||message.id<=0){return false;}}return message.version===__version&&(message.result!==undefined||utls.getType(message.error)==='Object'&&utls.equals(Object.getOwnPropertyNames(message.error).sort(),['code','message'])&&utls.getType(message.error.code)==='Integer'&&utls.getType(message.error.message)==='String'||utls.getType(message.error)==='JsonRpcError'&&JsonRpcError.isValid(message.error));} /**
	 * Checks that message is valid notification
	 * @param {Object} message
	 * @returns {Boolean}
	 */},{key:'isValidNotification',value:function isValidNotification(message){if(utls.getType(message)!=='Object'){return false;}if(message.error!==undefined||message.result!==undefined||message.id!==undefined){return false;}return message.version===__version&&utls.getType(message.resource)==='String'&&message.resource.length&&utls.getType(message.method)==='String'&&message.method.length&&utls.getType(message.params)==='Object';} /**
	 * Checks that message has correct syntax
	 * @param {Object} message
	 * @returns {Boolean}
	 */},{key:'hasValidSyntax',value:function hasValidSyntax(message){return JsonRpc.isValidRequest(message)||JsonRpc.isValidResponse(message)||JsonRpc.isValidNotification(message);} /**
	 * Returns id for new request
	 * @returns {number}
	 */},{key:'getNextId',value:function getNextId(){return ++__id;} /**
	 * Fires callback for response if any, if callback not found do nothing
	 * @param {JsonRpcResponse} response
	 */},{key:'fireCallback',value:function fireCallback(response){if(response instanceof Response){var callback=__callbacks[response.getId()];if(callback instanceof Object&&callback.cb instanceof Function){callback.cb(response);JsonRpc.removeCallback(response.getId());}}else {throw new Error('Response must be instance of JsonRpcResponse');}} /**
	 * Removes registerd callback if exists
	 * @param {Number} id
	 */},{key:'removeCallback',value:function removeCallback(id){var callback=__callbacks[id];if(callback instanceof Object){clearTimeout(callback.timeout);delete __callbacks[id];}}}]);return JsonRpc;}();module.exports=JsonRpc;var Request=require('./JsonRpcRequest.js');var Response=require('./JsonRpcResponse.js');var Notification=require('./JsonRpcNotification.js');var JsonRpcError=require('./JsonRpcError.js');module.exports.Request=Request;module.exports.Response=Response;module.exports.Notification=Notification;module.exports.JsonRpcError=JsonRpcError;module.exports.version=__version;module.exports.addHandler=JSONLess.addHandler;

},{"./JsonRpcError.js":10,"./JsonRpcNotification.js":11,"./JsonRpcRequest.js":12,"./JsonRpcResponse.js":13,"json-less":3,"utls":7}],10:[function(require,module,exports){
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var utls=require('utls'); /**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */var JsonRpcError=function(){ /**
	 *
	 * @param message
	 * @param code
	 */function JsonRpcError(message,code){_classCallCheck(this,JsonRpcError);if(utls.getType(message)==='String'){this.setMessage(message);}if(utls.getType(code)==='Integer'){this.setCode(code);}} /**
	 *
	 * @returns {Number}
	 */_createClass(JsonRpcError,[{key:'getCode',value:function getCode(){return this.code;} /**
	 *
	 * @returns {String}
	 */},{key:'getMessage',value:function getMessage(){return this.message;} /**
	 *
	 * @param code
	 * @returns {JsonRpcError}
	 */},{key:'setCode',value:function setCode(code){if(utls.getType(code)!=='Integer'){throw new Error('Code must be number');}this.code=code;return this;} /**
	 *
	 * @param message
	 * @returns {JsonRpcError}
	 */},{key:'setMessage',value:function setMessage(message){if(utls.getType(message)!=='String'){throw new Error('Message must be string');}this.message=message;return this;} /**
	 *
	 * @param error
	 * @returns {Boolean}
	 */}],[{key:'isValid',value:function isValid(error){return error instanceof JsonRpcError||utls.getType(error)==='Object'&&utls.equals(Object.getOwnPropertyNames(error).sort(),['code','message'])&&error.code instanceof Number&&error.message instanceof String;}}]);return JsonRpcError;}(); /**
 * Parse error
 * @type {{code: number, message: string}}
 */JsonRpcError.E_PARSE={code:-1,message:'Parse error'}; /**
 * Invalid Request
 * @type {{code: number, message: string}}
 */JsonRpcError.E_INVALID_REQUEST={code:-2,message:'Invalid Request'}; /**
 * Namespace not found
 * @type {{code: number, message: string}}
 */JsonRpcError.E_NAMESPACE_NOT_FOUND={code:-3,message:'Namespace not found'}; /**
 * Method not found
 * @type {{code: number, message: string}}
 */JsonRpcError.E_METHOD_NOT_FOUND={code:-4,message:'Method not found'}; /**
 * Invalid params
 * @type {{code: number, message: string}}
 */JsonRpcError.E_INVALID_PARAMS={code:-5,message:'Invalid params'}; /**
 * Internal error
 * @type {{code: number, message: string}}
 */JsonRpcError.E_INTERNAL={code:-6,message:'Internal error'};module.exports=JsonRpcError;

},{"utls":7}],11:[function(require,module,exports){
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var utls=require('utls');var JsonRpc=require('./JsonRpc.js'); /**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 */var JsonRpcNotification=function(_JsonRpc){_inherits(JsonRpcNotification,_JsonRpc); /**
	 * @param {Object} message
	 */function JsonRpcNotification(message){_classCallCheck(this,JsonRpcNotification);if(message!==undefined){if(utls.getType(message)!=='Object'){throw new Error('Message must be object type');}message.version=message.version||JsonRpc.version;message.resource=message.resource||'__global__';if(!JsonRpc.isValidNotification(message)){throw new Error('Message is not valid json rpc notification');}}else {message={};message.version=JsonRpc.version;message.resource='__global__';}return _possibleConstructorReturn(this,Object.getPrototypeOf(JsonRpcNotification).call(this,message));} /**
	 * @private
	 * @param version
	 */_createClass(JsonRpcNotification,[{key:'setVersion',value:function setVersion(version){throw new Error('Method not available in module "JsonRpcNotification"');} /**
	 * @private
	 */},{key:'getId',value:function getId(){throw new Error('Method not available in module "JsonRpcNotification"');} /**
	 * @private
	 * @param id
	 */},{key:'setId',value:function setId(id){throw new Error('Method not available in module "JsonRpcNotification"');} /**
	 * @private
	 */},{key:'getError',value:function getError(){throw new Error('Method not available in module "JsonRpcNotification"');} /**
	 * @private
	 * @param error
	 */},{key:'setError',value:function setError(error){throw new Error('Method not available in module "JsonRpcNotification"');} /**
	 * @private
	 */},{key:'getResult',value:function getResult(){throw new Error('Method not available in module "JsonRpcNotification"');} /**
	 * @private
	 * @param result
	 */},{key:'setResult',value:function setResult(result){throw new Error('Method not available in module "JsonRpcNotification"');}}]);return JsonRpcNotification;}(JsonRpc);module.exports=JsonRpcNotification;

},{"./JsonRpc.js":9,"utls":7}],12:[function(require,module,exports){
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */"use strict"; /**
 * Global request counter
 * @type {number}
 * @private
 */var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var utls=require('utls');var JsonRpc=require('./JsonRpc.js'); /**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 */var JsonRpcRequest=function(_JsonRpc){_inherits(JsonRpcRequest,_JsonRpc); /**
	 * @param {Object} message
	 */function JsonRpcRequest(message){_classCallCheck(this,JsonRpcRequest);if(message!==undefined){if(utls.getType(message)!=='Object'){throw new Error('Message must be object type');}message.version=message.version||JsonRpc.version;message.id=message.id||JsonRpc.getNextId();message.resource=message.resource||'__global__';message.params=message.params||{};if(!JsonRpc.isValidRequest(message)){throw new Error('Message is not valid json rpc request');}}else {message={};message.version=JsonRpc.version;message.id=JsonRpc.getNextId();message.resource='__global__';message.params=message.params||{};}return _possibleConstructorReturn(this,Object.getPrototypeOf(JsonRpcRequest).call(this,message));} /**
	 * @private
	 * @param version
	 */_createClass(JsonRpcRequest,[{key:'setVersion',value:function setVersion(version){throw new Error('Method not available in module "JsonRpcRequest"');} /**
	 * @private
	 */},{key:'getError',value:function getError(){throw new Error('Method not available in module "JsonRpcRequest"');} /**
	 * @private
	 * @param error
	 */},{key:'setError',value:function setError(error){throw new Error('Method not available in module "JsonRpcRequest"');} /**
	 * @private
	 */},{key:'getResult',value:function getResult(){throw new Error('Method not available in module "JsonRpcRequest"');} /**
	 * @private
	 * @param result
	 */},{key:'setResult',value:function setResult(result){throw new Error('Method not available in module "JsonRpcRequest"');}}]);return JsonRpcRequest;}(JsonRpc);module.exports=JsonRpcRequest;

},{"./JsonRpc.js":9,"utls":7}],13:[function(require,module,exports){
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */"use strict";var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var utls=require('utls');var JsonRpc=require('./JsonRpc.js'); /**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 */var JsonRpcResponse=function(_JsonRpc){_inherits(JsonRpcResponse,_JsonRpc); /**
	 * @param {Object} message
	 */function JsonRpcResponse(message){_classCallCheck(this,JsonRpcResponse);if(message!==undefined){if(utls.getType(message)!=='Object'){throw new Error('Message must be object type');}message.version=message.version||JsonRpc.version;if(!JsonRpc.isValidResponse(message)){throw new Error('Message is not valid json rpc response');}}else {message={};message.version=JsonRpc.version;}return _possibleConstructorReturn(this,Object.getPrototypeOf(JsonRpcResponse).call(this,message));} /**
	 * @private
	 * @param version
	 */_createClass(JsonRpcResponse,[{key:'setVersion',value:function setVersion(version){throw new Error('Method not available in module "JsonRpcResponse"');} /**
	 * @private
	 * @returns {*}
	 */},{key:'getResource',value:function getResource(){throw new Error('Method not available in module "JsonRpcResponse"');} /**
	 * @private
	 * @param resource
	 * @returns {JsonRpc}
	 */},{key:'setResource',value:function setResource(resource){throw new Error('Method not available in module "JsonRpcResponse"');} /**
	 * @private
	 * @returns {*}
	 */},{key:'getMethod',value:function getMethod(){throw new Error('Method not available in module "JsonRpcResponse"');} /**
	 * @private
	 * @param method
	 * @returns {JsonRpc}
	 */},{key:'setMethod',value:function setMethod(method){throw new Error('Method not available in module "JsonRpcResponse"');} /**
	 * @private
	 * @returns {*}
	 */},{key:'getCallback',value:function getCallback(){throw new Error('Method not available in module "JsonRpcResponse"');} /**
	 * @private
	 * @param {Function} callback
	 * @param {Number} tls
	 * @returns {JsonRpc}
	 */},{key:'setCallback',value:function setCallback(callback,tls){throw new Error('Method not available in module "JsonRpcResponse"');} /**
	 * @private
	 * @returns {*}
	 */},{key:'getParams',value:function getParams(){throw new Error('Method not available in module "JsonRpcResponse"');} /**
	 * @private
	 * @param params
	 * @returns {JsonRpc}
	 */},{key:'setParams',value:function setParams(params){throw new Error('Method not available in module "JsonRpcResponse"');}}]);return JsonRpcResponse;}(JsonRpc);module.exports=JsonRpcResponse;

},{"./JsonRpc.js":9,"utls":7}]},{},[1])


//# sourceMappingURL=JsonRpc.js.map
