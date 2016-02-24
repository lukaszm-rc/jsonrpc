/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var jsonrpc = require(__dirname + '/../index.js');
var assert = require('assert');
describe('JsonRpc', () => {
	describe('invalid input', () => {
		var messages = [
			'incorrect string',
			{'incorect' : 'string'},
			true,
			'{"version" : "1", "id" : 1, "ns" : "global", "method": "ping", "params" : {}}',
			'{"version" : 1, "id" : 1, "ns" : "global", "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : "1", "ns" : "global", "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "ns" : "global", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "ns" : "global", "method": "ping"}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "ns" : 1, "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "ns" : "global", "method": 1, "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "ns" : "global", "method": "ping", "params" : 1}',
			'{"version" : "' + jsonrpc.version + '", "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "ns" : "global", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "ns" : "global", "method": "ping"}',
			'{"version" : "' + jsonrpc.version + '", "ns" : 1, "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "ns" : "global", "method": 1, "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "ns" : "global", "method": "ping", "params" : 1}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "error" : {"code":"1", "message":"msg"}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "error" : {"code":1, "message":1}}',
			'{"version" : "' + jsonrpc.version + '", "id" : "1", "result" : null, "error" : {"code":1, "message":"msg"}}'
		];
		messages.forEach((message, key) => {
			it('parse (#' + key + ')', () => {
				assert.throws(() => {
					jsonrpc.parse(message);
				});
			});
		});
		messages.forEach((message, key) => {
			it('hasValidSyntax (#' + key + ')', () => {
				assert.equal(jsonrpc.hasValidSyntax(message), false);
			});
		});
	});
	describe('valid input', () => {
		var messages = [
			{
				"version" : jsonrpc.version,
				"id" : 1,
				"result" : null,
				"error" : {
					"code" : 1,
					"message" : "msg"
				}
			},
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "result" : null}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "error" : {"code":1, "message":"msg"}}',
			'{"version" : "' + jsonrpc.version + '", "id" : 1, "ns" : "global", "method": "ping", "params" : {}}',
			'{"version" : "' + jsonrpc.version + '", "ns" : "global", "method": "ping", "params" : {}}'

		];
		messages.forEach((message, key) => {
			it('parse (#' + key + ')', () => {
				assert.doesNotThrow(() => {
					jsonrpc.parse(message);
				});
			});
		});
		messages.forEach((message, key) => {
			it('hasValidSyntax (#' + key + ')', () => {
				if (utls.getType(message) === 'String') {
					message = JSON.parse(message);
				}
				assert.equal(jsonrpc.hasValidSyntax(message), true);
			});
		});
	});
	it('new JsonRpc not allowed',() => {
		assert.throws(() => {
			new jsonrpc();
		})
	});

	it('set/getOptions', () => {
		var o = jsonrpc.getOptions(), no = {autoFireCallbacks : true};
		jsonrpc.setOptions(no);
		assert.deepEqual(jsonrpc.getOptions(), no);
	});
});