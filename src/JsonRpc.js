/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var version = require(__dirname + '/../package.json').version;
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
		return this.version;
	}

	/**
	 *
	 * @param version
	 */
	setVersion(version) {
		this.version = version;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getId() {
		return this.id;
	}

	/**
	 *
	 * @param id
	 * @returns {JsonRpc}
	 */
	setId(id) {
		this.id = id;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getNS() {
		return this.ns;
	}

	/**
	 *
	 * @param ns
	 * @returns {JsonRpc}
	 */
	setNS(ns) {
		this.ns = ns;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getMethod() {
		return this.method;
	}

	/**
	 *
	 * @param method
	 * @returns {JsonRpc}
	 */
	setMethod(method) {
		this.method = method;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getCallback() {
		return this.callback;
	}

	/**
	 *
	 * @param callback
	 * @returns {JsonRpc}
	 */
	setCallback(callback) {
		this.callback = callback;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getParams() {
		return this.params;
	}

	/**
	 *
	 * @param params
	 * @returns {JsonRpc}
	 */
	setParams(params) {
		this.params = params;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getResult() {
		return this.result;
	}

	/**
	 *
	 * @param result
	 * @returns {JsonRpc}
	 */
	setResult(result) {
		this.result = result;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getError() {
		return this.error;
	}

	/**
	 *
	 * @param error
	 * @returns {JsonRpc}
	 */
	setError(error) {
		this.error = error;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getErrorCode() {
		return this.error.code;
	}

	/**
	 *
	 * @param code
	 * @returns {JsonRpc}
	 */
	setErrorCode(code) {
		this.error.code = code;
		return this;
	}

	/**
	 *
	 * @returns {*}
	 */
	getErrorMessage() {
		return this.error.message;
	}

	/**
	 *
	 * @param message
	 * @returns {JsonRpc}
	 */
	setErrorMessage(message) {
		this.error.message = message;
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
		return {
			version : this.getVersion(),
			id : this.getId(),
			ns : this.getNS(),
			method : this.getMethod(),
			params : this.getParams(),
			callback : this.getCallback()
		};
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
modele.exports.Request = require(__dirname + '/JsonRpcRequest.js');
modele.exports.Response = require(__dirname + '/JsonRpcResponse.js');
modele.exports.Notification = require(__dirname + '/JsonRpcNotification.js');
modele.exports.Error = require(__dirname + '/JsonRpcError.js');