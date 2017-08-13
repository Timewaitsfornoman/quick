/**
 * @desc    图加数据接口全局方法
 * @author  lzc(黑莓)
 */
var popup = require('../../libs/lib-popup/1.0.0/popup');

var getApi = {};

var loadingDialog = null;

$.extend(getApi, {

    callAPI: function(config,othorconfig) {
        var defaultConfig = {
            url: "",
            baseUrl: '',
            type: "GET",
            method: "",
            cache: true,
            dataType: "json",
            jsonpCallback: "",
            data: {},
            success: function() {
                console.warn("你没有定义success回调函数");
            },
            error: function() {
                console.error("网络故障，请稍后再试");
            },
            complete: function() {

            }
        };

        config = $.extend(defaultConfig, config);

        if (!config.url) {
            config.url = config.baseUrl + config.method;
        }

        return $.ajax({
            type: config.type,
            url: config.url,
            data: config.data,
            dataType: config.dataType,
            jsonpCallback: config.jsonpCallback,
            cache: config.cache,
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function() {
                if (othorconfig && !othorconfig.showloading) {
                    loadingDialog = popup.loading({
                        mask: true
                    });
                }

            },
            success: function(resp) {
                config.success(resp);
            },
            error: config.error,
            complete: function() {
                if (othorconfig && !othorconfig.showloading) {
                    loadingDialog.remove();
                }
                
                config.complete();
            }
        });
    }
});

module.exports = getApi;
