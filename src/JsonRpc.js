/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var version = require(__dirname + '/../package.json').version;
var __id = 0;
var __callbacks = {};
var __callbacksTimeout = 60000;
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
		this.message = {};
		this.setVersion(version);
	}

	/**
	 * @param {Object} message
	 * @returns {string}
	 */
	static getType(message) {
		return 'request';
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
		return this.message.error.code;
	}

	/**
	 *
	 * @param code
	 * @returns {JsonRpc}
	 */
	setErrorCode(code) {
		this.message.error.code = code;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getErrorMessage() {
		return this.message.error.message;
	}

	/**
	 *
	 * @param message
	 * @returns {JsonRpc}
	 */
	setErrorMessage(message) {
		this.message.error.message = message;
		return this;
	}

	/**
	 *
	 * @returns {Boolean}
	 */
	get isRequest() {
		return true;
	}

	/**
	 *
	 * @returns {Boolean}
	 */
	get isResponse() {
		return true;
	}

	/**
	 *
	 * @returns {Boolean}
	 */
	get isNotification() {
		return true;
	}

	/**
	 *
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static isValidRequest(message) {
		return true;
	}

	/**
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static isValidResponse(message) {
		return true;
	}

	/**
	 * @param {Object} message
	 * @returns {Boolean}
	 */
	static isValidNotification(message) {
		return true;
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

	/**
	 *
	 * @returns {number}
	 */
	static getNextId() {
		return __id++;
	}

	/**
	 *
	 * @param {JsonRpcResponse} response
	 */
	static fireCallback(response) {
		var callback = __callbacks[response.id];
		if (callback instanceof Object) {
			if (callback.cb instanceof Function) {
				callback.cb(response);
				JsonRpc.removeCallback(response.id);
			}
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
}
module.exports = JsonRpc;
module.exports.Request = require(__dirname + '/JsonRpcRequest.js');
module.exports.Response = require(__dirname + '/JsonRpcResponse.js');
module.exports.Notification = require(__dirname + '/JsonRpcNotification.js');
module.exports.Error = require(__dirname + '/JsonRpcError.js');
module.exports.version = version;
