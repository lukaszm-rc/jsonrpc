/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
class JsonRpcError {
	/**
	 *
	 * @param message
	 * @param code
	 */
	constructor(message, code) {
		if (message instanceof String) {
			this.setMessage(message);
		}
		if (code instanceof Number) {
			this.setCode(code);
		}
	}

	/**
	 *
	 * @returns {*}
	 */
	getCode() {
		return this.code;
	}

	/**
	 *
	 * @returns {*|string}
	 */
	getMessage() {
		return this.message;
	}

	/**
	 *
	 * @param code
	 * @returns {JsonRpcError}
	 */
	setCode(code) {
		if (!(code instanceof Number)) {
			throw new Error('Code must be number');
		}
		this.code = code;
		return this;
	}

	/**
	 *
	 * @param message
	 * @returns {JsonRpcError}
	 */
	setMessage(message) {
		if (!(message instanceof String)) {
			throw new Error('Message must be string');
		}
		this.message = message;
		return this;
	}

	/**
	 *
	 * @param error
	 * @returns {boolean|Boolean}
	 */
	static isValid(error) {
		return error instanceof JsonRpcError || (utls.getType(error) === 'Object' && utls.equals(Object.getOwnPropertyNames(error).sort(), [
				'code',
				'message'
			]) && error.code instanceof Number && error.message instanceof String);
	}
}
/**
 *
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_PARSE = {
	code : -1,
	message : 'Parse error'
};
/**
 *
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_INVALID_REQUEST = {
	code : -2,
	message : 'Invalid Request'
};
/**
 *
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_NAMESPACE_NOT_FOUND = {
	code : -3,
	message : 'Namespace not found'
};
/**
 *
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_METHOD_NOT_FOUND = {
	code : -4,
	message : 'Method not found'
};
/**
 *
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_INVALID_PARAMS = {
	code : -5,
	message : 'Invalid params'
};
/**
 *
 * @type {{code: number, message: string}}
 */
JsonRpcError.E_INTERNAL = {
	code : -6,
	message : 'Internal error'
};

module.exports = JsonRpcError;
