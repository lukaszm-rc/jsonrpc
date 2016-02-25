/**
 * @author Michał Żaloudik <michal.zaloudik@redcart.pl>
 */
"use strict";
var utls = require('utls');
var jsonrpc = require(__dirname + '/../index.js');
var assert = require('assert');
describe('JsonRpcResponse', () => {
	it('invalid message type', () => {
		assert.throws(() => {
			new jsonrpc.Response('');
		});
	});
	it('not valid syntax', () => {
		assert.throws(() => {
			new jsonrpc.Response({});
		});
	});
	describe('restricted methods', () => {
		var obj = new jsonrpc.Response();
		var methods = 'NS,method,params,callback'.split(',');
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
			assert.deepEqual((new jsonrpc.Response({
				id : 1,
				result : {some : 'result'}
			})).toJSON(), {
				id : 1,
				version : jsonrpc.version,
				result : {some : 'result'}
			});
		});
		it('methods', () => {
			var not = new jsonrpc.Response();
			not.setId(1);
			not.setResult({some : 'result'});
			assert.deepEqual(not.toJSON(), {
				id : 1,
				version : jsonrpc.version,
				result : {some : 'result'}
			});
		});
	});
});