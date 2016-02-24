/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var JsonRpc = require(__dirname + '/JsonRpc.js')
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 */
class JsonRpcNotification extends JsonRpc {
	/**
	 * @param {Object} message
	 */
	constructor(message) {
		if (message !== undefined) {
			if (utls.getType(message) !== 'Object') {
				throw new Error('Message must be object type');
			}
			message.version = message.version || JsonRpc.version;
			message.ns = message.ns || 'global';
			if (!JsonRpc.isValidNotification(message)) {
				throw new Error('Message is not valid json rpc notification');
			}
		} else {
			message = {};
			message.version = JsonRpc.version;
			message.ns = 'global';
		}
		super(message);
	}

	/**
	 * @private
	 * @param version
	 */
	setVersion(version) {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 */
	getId() {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 * @param id
	 */
	setId(id) {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 */
	getError() {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 * @param error
	 */
	setError(error) {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 */
	getResult() {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 * @param result
	 */
	setResult(result) {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}
}
module.exports = JsonRpcNotification;