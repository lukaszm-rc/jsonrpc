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
	constructor(message) {
		JsonRpc.isValidResponse(message);
		super();
	}
	/**
	 * @private
	 * @param version
	 */
	setVersion(version) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}
	/**
	 *
	 * @returns {*}
	 */
	getNS() {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 *
	 * @param ns
	 * @returns {JsonRpc}
	 */
	setNS(ns) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 *
	 * @returns {*}
	 */
	getMethod() {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 *
	 * @param method
	 * @returns {JsonRpc}
	 */
	setMethod(method) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 *
	 * @returns {*}
	 */
	getCallback() {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 *
	 * @param callback
	 * @returns {JsonRpc}
	 */
	setCallback(callback) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 *
	 * @returns {*}
	 */
	getParams() {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 *
	 * @param params
	 * @returns {JsonRpc}
	 */
	setParams(params) {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

}
module.exports = JsonRpcResponse;
