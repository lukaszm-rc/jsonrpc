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
				ns : "someNS",
				method : "someMethod",
				params : {some : "params"}
			})).toJSON(), {
				"version" : jsonrpc.version,
				"ns" : "someNS",
				"method" : "someMethod",
				"params" : {"some" : "params"}
			});
		});
		it('methods', () => {
			var not = new jsonrpc.Notification();
			not.setNS("someNS");
			not.setMethod("someMethod");
			not.setParams({some : "params"});
			assert.deepEqual(not.toJSON(), {
				"version" : jsonrpc.version,
				"ns" : "someNS",
				"method" : "someMethod",
				"params" : {"some" : "params"}
			});
		});
	});
});