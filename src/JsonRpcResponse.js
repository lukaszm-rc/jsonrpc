/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var JsonRpc = require('./JsonRpc.js');
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 * @augments JsonRpc
 */
class JsonRpcResponse extends JsonRpc {
	/**
	 * @param {Object} message
	 */
	constructor(message) {
		if (message !== undefined) {
			if (utls.getType(message) !== 'Object') {
				throw new Error('Message must be object type');
			}
			message.version = message.version || JsonRpc.version;
			if (!JsonRpc.isValidResponse(message)) {
				throw new Error('Message is not valid json rpc response');
			}
		} else {
			message = {};
			message.version = JsonRpc.version;
		}
		super(message);
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
	getResource() {
		throw new Error('Method not available in module "JsonRpcResponse"');
	}

	/**
	 * @private
	 * @param resource
	 * @returns {JsonRpc}
	 */
	setResource(resource) {
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
	 * @param {Function} callback
	 * @param {Number} tls
	 * @returns {JsonRpc}
	 */
	setCallback(callback, tls) {
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
