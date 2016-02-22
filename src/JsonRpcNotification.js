/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var JsonRpc = require(__dirname + '/JsonRpc.js')
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 * @extends JsonRpc
 */
class JsonRpcNotification extends JsonRpc {
	constructor(message) {
		if (message.ns === undefined) {
			message.ns = "global";
		}
		if (!JsonRpc.validateNotification(message)) {
			throw new Error('Message is not valid json rpc notification');
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
	getErrorCode() {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 * @param code
	 */
	setErrorCode(code) {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 */
	getErrorMessage() {
		throw new Error('Method not available in module "JsonRpcNotification"');
	}

	/**
	 * @private
	 * @param code
	 */
	setErrorMessage(code) {
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