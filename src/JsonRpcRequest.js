/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
/**
 * Global request counter
 * @type {number}
 * @private
 */
var utls = require('utls');
var JsonRpc = require('./JsonRpc.js')
/**
 * @typedef {JsonRpcRequest} JsonRpcRequest
 * @class
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 * @augments JsonRpc
 */
class JsonRpcRequest extends JsonRpc {
	/**
	 * @param {Object} message
	 */
	constructor(message) {
		if (message !== undefined) {
			if (utls.getType(message) !== 'Object') {
				throw new Error('Message must be object type');
			}
			message.version = message.version || JsonRpc.version;
			message.id = message.id || JsonRpc.getNextId();
			message.resource = message.resource || '__global__';
			message.params = message.params || {};
			if (!JsonRpc.isValidRequest(message)) {
				throw new Error('Message is not valid json rpc request');
			}
		} else {
			message = {};
			message.version = JsonRpc.version;
			message.id = JsonRpc.getNextId();
			message.resource = '__global__';
			message.params = message.params || {};
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
