/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
/**
 * Global request counter
 * @type {number}
 * @private
 */
var __id = 0;
var JsonRpc = require(__dirname + '/JsonRpc.js')
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 */
class JsonRpcRequest extends JsonRpc {
	/**
	 * @param {Object} message
	 */
	constructor(message) {
		__id++;
		message.id = __id;
		if (message.ns === undefined) {
			message.ns = "global";
		}
		if(!JsonRpc.validateRequest(message)) {
			throw new Error('Message is not valid json rpc request');
		}
		super(message);
	}

	/**
	 * @private
	 * @param version
	 */
	setVersion(version) {
		throw new Error('Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 */
	getError() {
		throw new Error('Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 * @param error
	 */
	setError(error) {
		throw new Error('Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 */
	getErrorCode() {
		throw new Error('Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 * @param code
	 */
	setErrorCode(code) {
		throw new Error('Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 */
	getErrorMessage() {
		throw new Error('Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 * @param code
	 */
	setErrorMessage(code) {
		throw new Error('Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 */
	getResult() {
		throw new Error('Method not available in module "JsonRpcRequest"');
	}

	/**
	 * @private
	 * @param result
	 */
	setResult(result) {
		throw new Error('Method not available in module "JsonRpcRequest"');
	}
}
module.exports = JsonRpcRequest;
