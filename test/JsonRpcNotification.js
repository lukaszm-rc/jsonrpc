/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var jsonrpc = require(__dirname + '/../index.js');
var assert = require('assert');
describe('JsonRpcNotification', () => {
	it('invalid message type', () => {
		assert.throws(() => {
			new jsonrpc.Notification('');
		});
	});
	it('not valid syntax', () => {
		assert.throws(() => {
			new jsonrpc.Notification({});
		});
	});
	it('is', () => {
		assert.equal((new jsonrpc.Notification()).isNotification, true);
		assert.equal((new jsonrpc.Notification()).isRequest, false);
		assert.equal((new jsonrpc.Notification()).isResponse, false);
	});
	it('defaults', () => {
		var not = new jsonrpc.Notification();
		assert.equal(not.getVersion(), jsonrpc.version);
		assert.equal(not.getResource(), '__global__');
		assert.deepStrictEqual(not.getParams(), {});
	});
	describe('restricted methods', () => {
		var obj = new jsonrpc.Notification();
		var methods = 'id,result,error'.split(',');
		it('setVersion', ()=> {
			assert.throws(() => {
				obj.setVersion("0.0.0");
			});
		});
		methods.forEach((method, key) => {
			it('get' + utls.ucFirst(method), ()=> {
				assert.throws(() => {
					obj['get' + utls.ucFirst(method)]();
				});
			});
			it('set' + utls.ucFirst(method), ()=> {
				assert.throws(() => {
					obj['set' + utls.ucFirst(method)]();
				});
			});
		});
	});
	describe('manual creation', () => {
		it('constructor params', () => {
			assert.deepEqual((new jsonrpc.Notification({
				resource : "someResource",
				method : "someMethod",
				params : {some : "params"}
			})).toJSON(), {
				version : jsonrpc.version,
				resource : "someResource",
				method : "someMethod",
				params : {"some" : "params"}
			});
		});
		it('methods', () => {
			var not = new jsonrpc.Notification();
			not.setResource("someResource");
			not.setMethod("someMethod");
			not.setParams({some : "params"});
			assert.equal(not.getResource(), "someResource");
			assert.equal(not.getMethod(), "someMethod");
			assert.deepStrictEqual(not.getParams(), {some : "params"});
		});
	});
});