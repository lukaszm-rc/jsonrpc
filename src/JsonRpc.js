/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var __version = '1.0.0';
var __id = 0;
var __callbacks = {};
var __callbacksTimeout = 60000;
var __options = {autoFireCallbacks : true};
/**
 * @abstract
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
class JsonRpc {
	/**
	 * @param {Object} message
	 */
	constructor(message) {
		if (this.constructor === JsonRpc) {
			throw new TypeError('Abstract class "JsonRpc" cannot be instantiated directly.');
		}
		this.message = message || {version : __version};
	}

	/**
	 * @param {Object} options
	 */
	static setOptions(options) {
		__options = utls.extend(__options, options);
	}

	/**
	 * @param {Object} message
	 * @returns {string}
	 */
	static getType(message) {
		if (!(message instanceof Object)) {
			throw new Error('Message parameter must be object');
		}
		switch (true) {
			case JsonRpc.isValidRequest(message):
				return 'request';
				break;
			case JsonRpc.isValidResponse(message):
				return 'response';
				break;
			case JsonRpc.isValidNotification(message):
				return 'notification';
				break;
			default:
				throw new Error('Unknown message type');
				break;
		}
	}

	/**
	 * @param {Object|String} message
	 */
	static parse(message) {
		if (!(message instanceof Object)) {
			if (utls.getType(message) === 'String') {
				message = JSON.parse(message);
			} else {
				throw new Error('Message must be string or object type');
			}
		}
		switch (JsonRpc.getType(message)) {
			case 'request':
				return new Request(message);
				break;
			case 'response':
				return new Response(message);
				break;
			case 'notification':
				return new Notification(message);
				break;
			default:
				break;
		}
	}

	/**
	 *
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static isValidRequest(message) {
		if (utls.getType(message) !== 'Object') {
			return false;
		}
		if (message.error !== undefined || message.result !== undefined) {
			return false;
		}
		return message.version === __version && utls.getType(message.id) === 'Integer' && message.id > 0 && utls.getType(message.ns) === 'String' && message.ns.length && utls.getType(message.method) === 'String' && message.method.length && utls.getType(message.params) === 'Object';
	}

	/**
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static isValidResponse(message) {
		if (utls.getType(message) !== 'Object') {
			return false;
		}
		if (message.method !== undefined || message.ns !== undefined || message.params !== undefined) {
			return false;
		}
		return message.version === __version && utls.getType(message.id) === 'Integer' && message.id > 0 && (message.result !== undefined || ((utls.getType(message.error) === 'Object' && utls.equals(Object.getOwnPropertyNames(message.error).sort(), [
				'code',
				'message'
			]) && utls.getType(message.error.code) === 'Integer' && utls.getType(message.error.message) === 'String') || (utls.getType(message.error) === 'JsonRpcError' && JsonRpcError.isValid(message.error))));
	}

	/**
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static isValidNotification(message) {
		if (utls.getType(message) !== 'Object') {
			return false;
		}
		if (message.error !== undefined || message.result !== undefined || message.id !== undefined) {
			return false;
		}
		return message.version === __version && utls.getType(message.ns) === 'String' && message.ns.length && utls.getType(message.method) === 'String' && message.method.length && utls.getType(message.params) === 'Object';
	}

	/**
	 *
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static hasValidSyntax(message) {
		return JsonRpc.isValidRequest(message) || JsonRpc.isValidResponse(message) || JsonRpc.isValidNotification(message);
	}

	/**
	 *
	 * @returns {number}
	 */
	static getNextId() {
		return ++__id;
	}

	/**
	 *
	 * @param {JsonRpcResponse} response
	 */
	static fireCallback(response) {
		var callback = __callbacks[response.id];
		if (callback instanceof Response) {
			if (callback.cb instanceof Function) {
				callback.cb(response);
				JsonRpc.removeCallback(response.getId());
			}
		} else {
			throw new Error('Response must be instance of JsonRpcResponse');
		}
	}

	/**
	 *
	 * @param id
	 */
	static removeCallback(id) {
		var callback = __callbacks[id];
		if (callback instanceof Object) {
			clearTimeout(callback.timeout);
			delete __callbacks[id];
		}
	}

	/**
	 *
	 * @returns {Boolean}
	 */
	get isRequest() {
		return this instanceof Request;
	}

	/**
	 *
	 * @returns {Boolean}
	 */
	get isResponse() {
		return this instanceof Response;
	}

	/**
	 *
	 * @returns {Boolean}
	 */
	get isNotification() {
		return this instanceof Notification;
	}

	/**
	 *
	 * @returns {*}
	 */
	getVersion() {
		return this.message.version;
	}

	/**
	 *
	 * @param version
	 */
	setVersion(version) {
		this.message.version = version;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getId() {
		return this.message.id;
	}

	/**
	 *
	 * @param id
	 * @returns {JsonRpc}
	 */
	setId(id) {
		this.message.id = id;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getNS() {
		return this.message.ns;
	}

	/**
	 *
	 * @param ns
	 * @returns {JsonRpc}
	 */
	setNS(ns) {
		this.message.ns = ns;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getMethod() {
		return this.message.method;
	}

	/**
	 *
	 * @param method
	 * @returns {JsonRpc}
	 */
	setMethod(method) {
		this.message.method = method;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getCallback() {
		return __callbacks[this.message.id];
	}

	/**
	 *
	 * @param callback
	 * @returns {JsonRpc}
	 */
	setCallback(callback, tls) {
		tls = tls || __callbacksTimeout;
		var self = this;
		var timeout = setTimeout(() => {
			JsonRpc.removeCallback(self.message.id)
		}, tls);
		__callbacks[this.message.id] = {
			cb : callback,
			timeout : timeout
		};
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getParams() {
		return this.message.params;
	}

	/**
	 *
	 * @param params
	 * @returns {JsonRpc}
	 */
	setParams(params) {
		this.message.params = params;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getResult() {
		return this.message.result;
	}

	/**
	 *
	 * @param result
	 * @returns {JsonRpc}
	 */
	setResult(result) {
		this.message.result = result;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getError() {
		return this.message.error;
	}

	/**
	 *
	 * @param error
	 * @returns {JsonRpc}
	 */
	setError(error) {
		this.message.error = error;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getErrorCode() {
		this.message.error = this.message.error || {};
		return this.message.error.code;
	}

	/**
	 *
	 * @param code
	 * @returns {JsonRpc}
	 */
	setErrorCode(code) {
		this.message.error = this.message.error || {};
		this.message.error.code = code;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getErrorMessage() {
		this.message.error = this.message.error || {};
		return this.message.error.message;
	}

	/**
	 *
	 * @param message
	 * @returns {JsonRpc}
	 */
	setErrorMessage(message) {
		this.message.error = this.message.error || {};
		this.message.error.message = message;
		return this;
	}

	/**
	 *
	 * @returns {{version: *, id: *, ns: *, method: *, params: *, callback: *}}
	 */
	toJSON() {
		return this.message;
	}

	/**
	 *
	 * @returns {String}
	 */
	toString() {
		return JSON.stringify(this.toJSON());
	}
}
module.exports = JsonRpc;
var Request = require(__dirname + '/JsonRpcRequest.js');
var Response = require(__dirname + '/JsonRpcResponse.js');
var Notification = require(__dirname + '/JsonRpcNotification.js');
var JsonRpcError = require(__dirname + '/JsonRpcError.js');
module.exports.Request = Request;
module.exports.Response = Response;
module.exports.Notification = Notification;
module.exports.JsonRpcError = JsonRpcError;
module.exports.version = __version;
