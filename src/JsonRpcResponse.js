/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var JsonRpc = require(__dirname + '/JsonRpc.js')
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 */
class JsonRpcResponse extends JsonRpc {
	constructor(message, options) {
		JsonRpc.isValidResponse(message);
		super();
		this.message = message || {};
		this.options = options || {};

	}
	/**
	 * @private
	 * @param version
	 */
	setVersion(version) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}
	/**
	 * @private
	 * @returns {*}
	 */
	getNS() {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @param ns
	 * @returns {JsonRpc}
	 */
	setNS(ns) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @returns {*}
	 */
	getMethod() {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @param method
	 * @returns {JsonRpc}
	 */
	setMethod(method) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @returns {*}
	 */
	getCallback() {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @param callback
	 * @returns {JsonRpc}
	 */
	setCallback(callback) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @returns {*}
	 */
	getParams() {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @param params
	 * @returns {JsonRpc}
	 */
	setParams(params) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

}
module.exports = JsonRpcResponse;
