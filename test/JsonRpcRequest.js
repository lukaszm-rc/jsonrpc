/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var jsonrpc = require(__dirname + '/../index.js');
var assert = require('assert');
describe('JsonRpcRequest', () => {
	it('invalid message type', () => {
		assert.throws(() => {
			new jsonrpc.Request('');
		});
	});
	it('not valid syntax', () => {
		assert.throws(() => {
			new jsonrpc.Request({});
		});
	});
	describe('restricted methods', () => {
		var obj = new jsonrpc.Request();
		var methods = 'result,error'.split(',');
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
		it('constructor params', (done) => {
			assert.deepEqual((new jsonrpc.Request({
				id : 1,
				ns : "someNS",
				method : "someMethod",
				params : {some : "params"},
				callback : (res) => {
					assert.ok(res instanceof jsonrpc.Response);
					assert.equal(res.getId(), 1);
					done();
				}
			})).toJSON(), {
				id : 1,
				"version" : jsonrpc.version,
				"ns" : "someNS",
				"method" : "someMethod",
				"params" : {"some" : "params"}
			});
			setImmediate(() => {
				new jsonrpc.Response({id:1, result:""});
			});
		});
		it('methods', (done) => {
			var not = new jsonrpc.Request();
			not.setId(2);
			not.setNS("someNS");
			not.setMethod("someMethod");
			not.setParams({some : "params"});
			not.setCallback((res) => {
				assert.ok(res instanceof jsonrpc.Response);
				assert.equal(res.getId(), 2);
				done();
			});
			assert.deepEqual(not.toJSON(), {
				id : 2,
				"version" : jsonrpc.version,
				"ns" : "someNS",
				"method" : "someMethod",
				"params" : {"some" : "params"}
			});
			setImmediate(() => {
				new jsonrpc.Response({id:2, result:""});
			});
		});
	});
});
