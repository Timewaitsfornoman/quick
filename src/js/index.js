/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-22 16:34:56
 * @version $Id$
 */

var ajax = require('../../unit/common/js/getApi');
var docookie = require('../../unit/common/js/cookie');
var popup = require('../../unit/libs/lib-popup/1.0.0/popup');

var $J_createpage = $('#J_createpage');

var user_id = docookie.getCookie('user_id');

var index = {

    init: function() {
        this.initStatus();
        this.addEvent();
    },

    initStatus: function(){
        var $J_users = $('.J_users');
        var $J_userstatus = $('#J_userstatus');
        var user_name = docookie.getCookie('user_name');
        $J_users.text(user_name).addClass('show-opacity');
        $J_userstatus.text(user_name);

        $('#J_exist').on('click', function() {
            event.preventDefault();
            window.location.href = '/';
        });
    },

    sendApi: function(url,date,callBack) {

        ajax.callAPI({
            type: 'post',
            url: url,
            data: date,
            dataType: 'json',
            success: function(rsp) {
                if (typeof rsp === 'string') {
                    try {
                        rsp = JSON.parse(rsp);
                    } catch (e) {
                        popup.note('网络异常，稍后重试!', 1500);
                    }
                };

                if (rsp.success === true) {
                    callBack(rsp);
                } else {
                    popup.note(rsp.msg || '网络异常，稍后再试！', 1500);
                }
            },
            error: function() {
                popup.note('网络异常，稍后重试', 1500);
            }
        });
    },

    formValidation: function(data) {

        var result = true,
            page_name = data.page_name,
            page_address = data.page_address;

        if (page_name != undefined && page_name.length === 0) {

            result = {
                'errorType': 'page_name',
                'errorText': '页面中文名称不能为空'
            };
        } else if (page_address != undefined && page_address.length === 0) {

            result = {
                'errorType': 'page_address',
                'errorText': '页面字母名称不能为空'
            };
        };

        if (result !== true) {
            popup.note(result.errorText, 1500);
        };

        return result;
    },

    addEvent: function() {

        var $this = this;
        var $J_edit = $('.J_edit');
        var $J_delete = $('.J_delete');
        // var $J_preview = $('.J_preview');
        var $J_popout = $('.J_popout');

        $J_createpage.on('click', function() {

            event.preventDefault();
            $J_popout.removeClass('hide');
        });

        $('#J_cansecreatePage').on('click', function() {

            event.preventDefault();
            $J_popout.addClass('hide');
        });

        $('#J_createinitPage').on('click', function() {

            event.preventDefault();
            
            var url = '/addPages';

            var page_name = $('#J_pagename').val();
            var page_address = $('#J_pageaddress').val();

            var create_date = new Date();

            var date = {
                'page_name': page_name,
                'page_address': page_address,
                'user_id': user_id,
                'create_date': create_date.getFullYear() + '-' + (create_date.getMonth() + 1)  + '-' + create_date.getDate()
            };

            var ajaxcallback = function(rsp){
                popup.note(rsp.msg, 1500);
                $J_popout.addClass('hide');
                docookie.setCookie('page_id',rsp.id);
                docookie.setCookie('page_name',page_name);
                docookie.setCookie('page_address',page_address);
                window.location.href = '/createpage';
            };

            var result = $this.formValidation(date);

            result === true && $this.sendApi(url,date,ajaxcallback);
        });

        $J_edit.on('click', function() {

            event.preventDefault();
            
            var url = '/editpage';
            var _this = $(this);
            var id = _this.data('id');

            var ajaxcallback = function(rsp){
                popup.note(rsp.msg, 1500);
            };

            var data = {
                id:id
            };

            $_this.sendApi(url,date,ajaxcallback);
        });

        $J_delete.on('click', function() {

            event.preventDefault();
            var _this = $(this);
            var id = _this.data('id');
            var parent_li = _this.parent().parent();
            var $J_deletepoplayer = $('.J_deletepoplayer');


            $J_deletepoplayer.removeClass('hide');

            $('.J_deletepages').on('click',function(){

                var url = '/deletePage';

                var ajaxcallback = function(rsp){
                    parent_li.remove();
                    popup.note(rsp.msg, 1500);
                    $J_deletepoplayer.addClass('hide');

                };

                var data = {
                    id:id
                };

                $this.sendApi(url,data,ajaxcallback);
            });

            $('.J_cansepages').on('click',function(){
                $J_deletepoplayer.addClass('hide');
            });
        });

        // $J_preview.on('click', function() {
        //     event.preventDefault();
        //     var page_address = _this.data('page_address');
        //     window.open(page_address,'_blank');
        // });
    }
};

index.init();