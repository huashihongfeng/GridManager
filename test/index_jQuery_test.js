/**
 * Created by baukh on 18/1/11.
 * index.js 中兼容jQuery 部分测试
 */

import testData from '../src/data/testData';
import {jTool} from "../src/js/Base";

describe('index.js jQuery', () => {
	let table = null;
	let $table = null;
	let div = null;
	let $div = null;
	let arg = null;
	beforeEach(function(){
        window.$ = window.jQuery = require('../node_modules/jquery/dist/jquery.min');
        require('../src/js/index');
		// 存储console, 用于在测方式完成后原还console对象
		console._info = console.info;
		console._warn = console.warn;
		console._error = console.error;
		console._log = console.log;
		console.info = jasmine.createSpy("info");
		console.warn = jasmine.createSpy("warn");
		console.error = jasmine.createSpy("error");
		console.log = jasmine.createSpy("log");

		table = document.createElement('table');
		div = document.createElement('div');
		$table = jQuery(table);
		$div = jQuery(div);
        arg = {
            ajax_data: testData,
            gridManagerName: 'test-jquery-index',
            columnData: [
                {
                    key: 'name',
                    width: '100px',
                    text: '名称'
                },{
                    key: 'info',
                    text: '使用说明'
                },{
                    key: 'url',
                    text: 'url'
                },{
                    key: 'createDate',
                    text: '创建时间'
                },{
                    key: 'lastDate',
                    text: '最后修改时间'
                },{
                    key: 'action',
                    text: '操作',
                    template: function(action, rowObject){
                        return '<span class="plugin-action edit-action" learnLink-id="'+rowObject.id+'">编辑</span>'
                            +'<span class="plugin-action del-action" learnLink-id="'+rowObject.id+'">删除</span>';
                    }
                }
            ]
        };
		document.body.appendChild(table);
		document.body.appendChild(div);
	});

	afterEach(function(){
		// 还原console
		console.info = console._info;
		console.warn = console._warn;
		console.error = console._error;
		console.log = console._log;

        jTool(window).unbind(`resize.${arg.gridManagerName}`);
		document.body.innerHTML = '';
		table = null;
		div = null;
		$table = null;
		$div = null;
		arg = null;
        window.$ = window.jQuery = null;
	});

	it('验证jQuery.fn 是否挂载成功', function(){
		expect(jQuery.fn.GridManager).toBeDefined();
		expect(jQuery.fn.GM).toBeDefined();
		expect(jQuery.fn.GridManager).toBe(jQuery.fn.GM);

		expect($.fn.GridManager).toBeDefined();
		expect($.fn.GM).toBeDefined();
		expect($.fn.GridManager).toBe($.fn.GM);
	});
	it('GM() 与 GridManager()', function(){
		expect(table.GM === table.GridManager).toBe(true);
	});

	it('非 table 的Element', function(){
		expect($div.GM()).toBeUndefined();
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '不支持对非table标签实例化');
	});

	it('GM() 参数为空', function(){
        expect($table.GM()).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '方法调用错误，缺失必要参数:[columnData、(ajax_data || ajax_url)]');
	});

	it('未传递方法名参数', function(){
		expect($table.GM(arg)).toBeDefined();
	});

	it('未存在回调函数', function(){
		expect($table.GM('init', arg)).toBeDefined();
	});

	it('完整参数', function(){
		let callback = jasmine.createSpy('callback');
		expect($table.GM('init', arg, callback)).toBeDefined();
		expect(callback).toHaveBeenCalled();
		callback = null;

		// 错误的方法名
        expect($table.GM('errorFnName', {'name': 'cc'})).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '方法调用错误，请确定方法名[errorFnName]是否正确');
	});

    it('非init方法, 且当前并未实例化', function(){
        expect(table.GM('get', {'name': 'cc'})).toBeUndefined();
        expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '方法调用错误，请确定表格已实例化');
    });
});

