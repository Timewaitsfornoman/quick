(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ajax = require('../../unit/common/js/getApi');
var slider = require('../../unit/libs/lib-slider/2.0.0/slider');

var page = 1;
var loading = false;

var index = {

    init: function() {
        this.sendApi.mainApi();
        this.addEvent();
    },

    readerBanner: function(data) {

        var itemList = data.itemList;
        var len = itemList.length;
        var item = {};
        var banner = '<div id="J_slider-outer" class="slider-outer"><ul id="J_slider-wrap" class="slider-wrap">';

        for (var i = 0; i < len; i++) {
            item = itemList[i];
            banner += '<li>' +
                '<a href="http://event.tujiaapp.com/custom-link.html?id=' + item.key + '" target="_blank">' +
                '<img class="lazyimg" src="' + item.imagePath + '" alt="' + item.label + '"/>' +
                '</a>' +
                '</li>';
        }

        banner += '</ul></div><div id="J_slider-status" class="slider-status"></div>';

        $('#J_slider').html(banner);

        this.initSlide();
    },

    initSlide: function() {

        var sliderPic = new slider({
            container: '#J_slider',
            wrap: '#J_slider-outer',
            panel: '#J_slider-wrap',
            trigger: '#J_slider-status',
            fullScreen: true,
            sizeRadio: 312 / 750,
            play: true,
            loop: true
        });
    },

    sendApi: {

        mainApi: function(data) {

            ajax.callAPI({
                type: 'post',
                url: '/api/main',
                data: {},
                dataType: 'json',
                success: function(rsp) {

                    var featureScopes = rsp.featureScopes;

                    if (featureScopes) {
                        index.readerBanner(featureScopes[0]);
                        index.renderMain(featureScopes);
                    } else {

                    }
                    loading = false;
                },
                error: function(error) {
                    loading = false;
                }
            });
        }
    },
    renderItem: function(index, data) {

        var itemlist = data.itemList;
        var len = itemlist.length;
        var item = {};
        var html = '';
        for (var i = 0; i < len; i++) {
            item = itemlist[i];
            html += '<li class="tu-item">' +
                '<a href="http://event.tujiaapp.com/custom-link.html?id=' + item.key + '" target="_blank">' +
                '<div class="waper-img" style="background-image: url(' + item.imagePath + '")>' +
                '</div></a>' +
                '<div>' +
                '<h1 class="tu-title">' + item.label + '</h1>';

            html += item.description && '<p class="tu-describe">' + item.description + '</p>' || '';

            html += '<p class="user-about">' +
                '<span class="user-info">' +
                '<img src="' + item.owner.avatar + '" alt="' + item.owner.name + '"/>' + (item.owner.name || '') + '</span>' +
                '<span class="page-view">' +
                '<i class="pageview-icon"></i>' + (item.sequence || '') +
                '</span>' +
                '</p>' +
                '</div>' +
                '</li>';
        }

        switch (index) {
            case 1:
                $('#J-tuicun').html(html);
                break;
            case 2:
                $('#J-yule').html(html);
                break;
            case 3:
                $('#J-shishang').html(html);
                break;
            case 4:
                $('#J-lvyou').html(html);
                break;
            case 5:
                $('#J-shenghuo').html(html);
                break;
        }
    },

    renderMain: function(data) {
        var len = data.length;
        for (var i = 1; i < len; i++) {
            this.renderItem(i, data[i]);
        }
    },

    addEvent: function() {

        $('#J_navheader').on('click', 'li', function() {

            var $this = $(this);
            var index = $this.index();

            $this.addClass('nav-current').siblings().removeClass('nav-current');
            switch (index) {

                case 0:
                    $('#J-tuicun').removeClass('hide').siblings().addClass('hide');
                    break;
                case 1:
                    $('#J-yule').removeClass('hide').siblings().addClass('hide');;
                    break;
                case 2:
                    $('#J-shishang').removeClass('hide').siblings().addClass('hide');
                    break;
                case 3:
                    $('#J-lvyou').removeClass('hide').siblings().addClass('hide');
                    break;
                case 4:
                    $('#J-shenghuo').removeClass('hide').siblings().addClass('hide');
                    break;
            }
        });

        var hide = true;
        var $J_sharebox = $('#J_sharebox');

        $('#J_shareButton').on('click', function(event) {

            var $this = $(this);
            $J_sharebox.css(
                'display', 'block'
            );

            $('#J_sharecont').css({
                'display': 'block',
            });

            $('#J_shareMask').css({
                'display': 'block'
            });

            setTimeout(function(){
                $('#J_sharecont').css({
                    'transform': 'translate3d(0, 0, 0)'
                });

                $('#J_shareMask').css({
                    'opacity': 1
                });
            },0);

            hide = false;
        });

        $J_sharebox.on('click', '.J_closeShare', function(event) {

            var $this = $(this);
            $('#J_sharecont').css({
                'transform': 'translate3d(0px, 100%, 0px)'
            });

            $('#J_shareMask').css({
                'opacity': 0
            });

            hide = true;
        });

        $('#J_shareMask').on('transitionend', function() {

            if (hide) {
                $J_sharebox.css('display', 'none');
            }

        });
    }
};

index.init();
},{"../../unit/common/js/getApi":2,"../../unit/libs/lib-slider/2.0.0/slider":4}],2:[function(require,module,exports){
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

},{"../../libs/lib-popup/1.0.0/popup":3}],3:[function(require,module,exports){

var defaultConfig = {

    content: '',

    size: 'auto',

    mask: true,

    position: 'center',

    radius: 8,

    closeTime: 0,

    actionConfig: [],

    mainStyle: {
        'display': 'inline-block',
        'max-width': '65%',
        'border-radius': '0.2rem',
        'background': '#fff'
    }
};

function popup(content, config) {

    var cf = $.extend(true, {}, defaultConfig, config);

    cf.content = content || cf.content;

    // 初始化html
    var $mask = $('<div class="popup-mask"></div>'),
        $main = $('<div class="popup-main"></div>'),
        $content = $('<div class="popup-content"></div>');

    // 构建初步的样式
    $mask.css({
        'position': 'fixed',
        'left': 0,
        'top': 0,
        'right': 0,
        'bottom': 0,
        'width': '100%',
        'height': '100%',
        'background': 'rgba( 0, 0, 0,.6)',
        'z-index': 999
    });

    $main.css(cf.mainStyle);
    $mask.append($main);
    $main.append($content);

    // config.mask
    if (cf.mask === false) {
        $mask.css({
            'background': 'rgba(0,0,0,0)'
        });
    }

    // config.content
    $content.html(cf.content);

    // config.size
    if (typeof cf.size === 'object') {
        $main.css({
            'width': cf.size.width,
            'height': cf.size.height
        });
    }

    // config.action

    var acflength = cf.actionConfig.length;
    if (acflength > 0) {
        var $action = $('<div></div>').addClass('popup-action'),
            $actionBtn = $('<a></a>').addClass('popup-action-btn'),
            defaultAction = {
                text: '',
                callback: function() {}
            };
        $action.css({
            'padding': '.75rem 0',
            'text-align': 'center'
        });

        $main.append($action);

        if (acflength >= 3) {
            $actionBtn.css({
                'width': 100 / cf.actionConfig.length + '%',
                'text-align': 'center',
                'font-size': '0.875rem',
                'color': '#0d81ff',
                'display': 'inline-block',
                'text-decoration': 'none',
                'border-top': '1px #eee solid',
                'padding': '0.625rem 0'
            });
        }

        cf.actionConfig.reverse();
        for (var k = acflength; k--;) {

            var $t = $actionBtn.clone(),
                acf = $.extend({}, defaultAction, cf.actionConfig[k]);

            $t.css({
                'display': 'inline-block',
                'height': '1.5rem',
                'text-align': 'center',
                'font-size': '0.7rem',
                'line-height': '1.5rem',
                'text-decoration': 'none',
                'border-radius': '.15rem',
                'box-sizing': 'border-box'
            });

            if (acflength === 1) {
                $t.css({
                    'width': '78%',
                    'color': '#fff',
                    'background-color': '#ff4965',
                });
            } else if (acflength === 2) {
                if (k === 1) {
                    $t.css({
                        'width': '3.25rem',
                        'color': '#ff4965',
                        'border': '1px #ff4965 solid',
                        'margin-right': '0.6rem'
                    });
                } else {
                    $t.css({
                        'width': '3.25rem',
                        'color': '#fff',
                        'background-color': '#ff4965',
                    });
                }
            }

            $t
                .html(acf.text)
                .on('click', {
                    acf: acf
                }, function(ev) {
                    ev.data.acf.callback();
                });
            if (k < cf.actionConfig.length - 1 && cf.actionConfig.length >= 3) {
                $t.css({
                    'box-sizing': 'border-box',
                    'border-right': '1px #eee solid'
                });
            }
            $action.append($t);
        }

    }

    // 插入popbox
    $('body').append($mask);

    // 定位
    if (cf.position === 'center') {
        $main.css({
            'position': 'absolute',
            'top': '50%',
            'left': '50%',
            'margin-left': -$main.width() / 2,
            'margin-top': -$main.height() / 2
        });
    } else if (cf.position === 'top') {
        $main.css({
            'position': 'absolute',
            'top': '5%',
            'left': '50%',
            'margin-left': -$main.width() / 2
        });
    } else if (cf.position === 'bottom') {
        $main.css({
            'position': 'absolute',
            'top': '95%',
            'left': '50%',
            'margin-left': -$main.width() / 2,
            'margin-top': -$main.height()
        });
    }

    // config.closeTime
    if (cf.closeTime !== 0) {
        setTimeout(function() {
            method.fadeOut(function() {
                method.remove();
            });
        }, cf.closeTime);
    }

    var method = {

        $mask: $mask,

        $main: $main,

        $contnet: $content,

        show: function() {
            this.$mask.show();
            return this;
        },

        hide: function() {
            this.$mask.hide();
            return this;
        },

        fadeOut: function(callback) {
            var self = this;
            var fadeOut = function(a, b) {
                a -= b;
                self.$mask.css('opacity', a / 200);
                setTimeout(function() {
                    fadeOut(a, b);
                }, b);
                if (a === 0) {
                    callback();
                }
            };
            fadeOut(200, 20);
        },

        remove: function() {
            this.$mask.remove();
            return this;
        }

    };

    return method;
};

popup.loading = function(config) {

    config = $.extend(true, {}, {
        mainStyle: {
            'background': 'rgba(0,0,0,.5)',
            'padding': '.375rem .5rem'
        }
    }, config);

    return popup('<style>.sk-fading-circle{width:1.5rem;height:1.5rem;position:relative}.sk-fading-circle .sk-circle{width:100%;height:100%;position:absolute;left:0;top:0}.sk-fading-circle .sk-circle:before{content:"";display:block;margin:0 auto;width:15%;height:15%;background-color:#fff;border-radius:100%;-webkit-animation:sk-circleFadeDelay 1.2s infinite ease-in-out both;animation:sk-circleFadeDelay 1.2s infinite ease-in-out both}.sk-fading-circle .sk-circle2{-webkit-transform:rotate(30deg);-ms-transform:rotate(30deg);transform:rotate(30deg)}.sk-fading-circle .sk-circle3{-webkit-transform:rotate(60deg);-ms-transform:rotate(60deg);transform:rotate(60deg)}.sk-fading-circle .sk-circle4{-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.sk-fading-circle .sk-circle5{-webkit-transform:rotate(120deg);-ms-transform:rotate(120deg);transform:rotate(120deg)}.sk-fading-circle .sk-circle6{-webkit-transform:rotate(150deg);-ms-transform:rotate(150deg);transform:rotate(150deg)}.sk-fading-circle .sk-circle7{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}.sk-fading-circle .sk-circle8{-webkit-transform:rotate(210deg);-ms-transform:rotate(210deg);transform:rotate(210deg)}.sk-fading-circle .sk-circle9{-webkit-transform:rotate(240deg);-ms-transform:rotate(240deg);transform:rotate(240deg)}.sk-fading-circle .sk-circle10{-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}.sk-fading-circle .sk-circle11{-webkit-transform:rotate(300deg);-ms-transform:rotate(300deg);transform:rotate(300deg)}.sk-fading-circle .sk-circle12{-webkit-transform:rotate(330deg);-ms-transform:rotate(330deg);transform:rotate(330deg)}.sk-fading-circle .sk-circle2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.sk-fading-circle .sk-circle3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.sk-fading-circle .sk-circle4:before{-webkit-animation-delay:-.9s;animation-delay:-.9s}.sk-fading-circle .sk-circle5:before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.sk-fading-circle .sk-circle6:before{-webkit-animation-delay:-.7s;animation-delay:-.7s}.sk-fading-circle .sk-circle7:before{-webkit-animation-delay:-.6s;animation-delay:-.6s}.sk-fading-circle .sk-circle8:before{-webkit-animation-delay:-.5s;animation-delay:-.5s}.sk-fading-circle .sk-circle9:before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.sk-fading-circle .sk-circle10:before{-webkit-animation-delay:-.3s;animation-delay:-.3s}.sk-fading-circle .sk-circle11:before{-webkit-animation-delay:-.2s;animation-delay:-.2s}.sk-fading-circle .sk-circle12:before{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes sk-circleFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}@keyframes sk-circleFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}</style><div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div>', config);
};

popup.note = function(text, config) {

    var defaultCfg = {
        mainStyle: {
            'background': 'rgba(0,0,0,.5)',
            'padding': '.375rem .5rem'
        },
        closeTime: 1000
    };

    if (typeof config === 'number') {
        config = $.extend(true, {}, defaultCfg, {
            closeTime: config
        });
    } else {
        config = $.extend(true, {}, defaultCfg, config);
    }

    return popup('<div style="color:#fff;font-size:0.8rem;margin:0">' + text + '</div>', config);
};

popup.confirm = function(text, confirmCallback, cancelCallback, config) {

    config = $.extend(true, {}, {
        mainStyle: {
            width: '65%'
        },
        mask: true,
        actionConfig: [{
            text: '取消',
            callback: function() {
                re.remove();
                cancelCallback && cancelCallback.apply(re);
            }
        }, {
            text: '确认',
            callback: function() {
                re.remove();
                confirmCallback && confirmCallback.apply(re);
            }
        }]
    }, config);

    var re = popup('<div style="padding:1rem;text-align:center;font-size:0.75rem;">' + text + '</div>', config);

    return re;
};

popup.alert = function(text, config, callback) {

    config = $.extend(true, {}, {

        mainStyle: {
            width: '65%'
        },
        mask: true,
        actionConfig: [{
            text: '好的',
            callback: function() {
                re.remove();
                callback && callback();
            }
        }]
    }, config);

    var re = popup('<div style="padding:1rem;text-align:center;font-size: 0.75rem;">' + text + '</div>', config);

    return re;
};

module.exports = popup;
},{}],4:[function(require,module,exports){
/**
 * @desc    slide组件（支持translate3d）
 * @author  王玉林 <veryued@gmail.com>
 * @date    2014-08-05
 * @update  李怡志 于2015-09-25 修改,添加triggerIndex
 * @update  余彰显 于2015-10-20 完善需求体验
 */

var hasTransform = function() { // 判断浏览器是否支持transform（仅webkit）
        var ret = ('WebkitTransform' in document.documentElement.style) ? true : false;
        return ret;
    },
    has3d = function() { // 判断浏览器是否支持3d效果（仅webkit）
        var style,
            ret = false,
            div = document.createElement('div'),
            style = ['&#173;', '<style id="smodernizr">', '@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', '</style>'].join(''),
            mStyle = document.documentElement.style;
        div.id = 'modernizr';
        div.innerHTML += style;
        document.body.appendChild(div);
        if ('WebkitPerspective' in mStyle && 'webkitPerspective' in mStyle) {
            ret = (div.offsetLeft === 9 && div.offsetHeight === 3);
        }
        div.parentNode.removeChild(div);
        return ret;
    },
    
    gv1 = has3d ? 'translate3d(' : 'translate(',
    gv2 = has3d ? ',0)' : ')';

var touchSlider = function(container, options) {
    if (!container) return null;
    if (options) options.container = container; //container会覆盖options内的container
    else options = typeof container == 'string' ? {
        'container': container
    } : container;
    $.extend(this, {
        container: ".slider", //大容器，包含面板元素、触发元素、上下页等
        wrap: null, //滑动显示区域，默认为container的第一个子元素。（该元素固定宽高overflow为hidden，否则无法滑动）
        panel: null, //面板元素，默认为wrap的第一个子元素
        trigger: null, //触发元素，也可理解为状态元素
        triggerIndex: null, //触发索引形式的状态元素
        activeTriggerCls: 'sel', //触发元素内子元素的激活样式
        hasTrigger: false, //是否需要触发事件，例tab页签就需要click触发
        steps: 0, //步长，每次滑动的距离
        left: 0, //panel初始的x坐标
        visible: 1, //每次滑动几个panels，默认1
        margin: 0, //面板元素内子元素间的间距
        curIndex: 0, //初始化在哪个panels上，默认0为第一个
        duration: 300, //动画持续时间
        //easing : 'ease-out', //动画公式
        loop: false, //动画循环
        play: false, //动画自动播放
        interval: 5000, //播放间隔时间，play为true时才有效
        useTransform: has3d ? true : false, //以translate方式动画，安卓现在也支持了
        lazy: '.lazyimg', //图片延时加载属性
        lazyIndex: 1, //默认加载到第几屏
        callback: null, //动画结束后触发
        fullScreen: 0, //全屏支持 如果开启全屏 css中设置的宽度将失效
        sizeRadio: 100 / 320, //只有开启fullScreen 此项配置才生效 图片比例 高／宽
        prev: null, //上一页
        next: null, //下一页
        activePnCls: 'none' //prev和next在头尾时的样
    }, options);

    this.findEl() && this.resetToFullScreen() && this.init() && this.increaseEvent();
};

$.extend(touchSlider.prototype, {
    findEl: function() {
        var container = this.container = $(this.container);
        if (!container.length) {
            return null;
        }

        this.wrap = this.wrap && container.find(this.wrap) || container.children().first();
        if (!this.wrap.length) {
            return null;
        }

        this.panel = this.panel && container.find(this.panel) || this.wrap.children().first();
        if (!this.panel.length) {
            return null;
        }

        this.panels = this.panel.children();
        if (!this.panels.length) { //对于没有图片的元素，直接隐藏
            this.container.hide();
            return null;
        }

        this.trigger = this.trigger && container.find(this.trigger);
        this.prev = this.prev && container.find(this.prev);
        this.next = this.next && container.find(this.next);

        this.triggerIndex = this.triggerIndex && container.find(this.triggerIndex);

        return this;
    },

    resetToFullScreen: function() {

        if (this.fullScreen) {
            $(this.container).css('display', 'none');
            $(this.panel).children('li').css('width', document.body.clientWidth);
            $(this.panel).css('width', document.body.clientWidth * $(this.panel).children('li').length);
            $(this.wrap).css('width', '100%');
            //根据图片比例缩放
            $(this.wrap).css('height', document.body.clientWidth * this.sizeRadio);
            $(this.container).css('height', document.body.clientWidth * this.sizeRadio);
            $(this.container).css('display', 'block');
        }

        return this;

    },

    init: function() {
        var wrap = this.wrap,
            panel = this.panel,
            panels = this.panels,
            trigger = this.trigger,
            triggerIndex = this.triggerIndex,
            triggerContent = '',
            len = this.len = panels.length, //子元素的个数
            margin = this.margin,
            allWidth = 0, //滑动容器的宽度
            status = this.visible, //每次切换多少个panels
            useTransform = this.useTransform = hasTransform ? this.useTransform : false; //不支持直接false

        this.steps = this.steps || wrap.width(); //滑动步长，默认wrap的宽度
        panels.each(function(n, item) {
            allWidth += item.offsetWidth;
        });

        if (margin && typeof margin == 'number') {
            allWidth += (len - 1) * margin; //总宽度增加
            this.steps += margin; //步长增加margin
        }

        if (status > 1) {
            this.loop = false;
        } //如果一页显示的子元素超出1个，或设置了步长，则不支持循环；若自动播放，则只支持一次

        //初始位置为了计算卡片内偏移
        var initLeft = this.left;
        initLeft -= this.curIndex * this.steps;
        this.setCoord(panel, initLeft);
        if (useTransform) {
            if (has3d) {
                wrap.css({
                    '-webkit-transform': 'translateZ(0)'
                }); //防止ios6下滑动会有顿感
            }
            panel.css({
                '-webkit-backface-visibility': 'hidden'
            });
            //panels.css({'-webkit-transform':gv1+'0,0'+gv2});
        }

        var pages = this._pages = Math.ceil(len / status); //总页数
        if (triggerIndex) {
            triggerContent = (this.curIndex + 1) + '/' + pages;
            triggerIndex.html(triggerContent);
        }
        //初始坐标参数
        this._minpage = 0; //最小页
        this._maxpage = this._pages - 1; //最大页

        this.loadImg();
        this.updateArrow();

        if (pages <= 1) { //如果没超出一页，则不需要滑动
            this.getImg(panels[0]); //存在一页的则显示第一页
            return null;
        }
        if (this._oldLoop) { //之前已经复制过的删除
            var oldpanels = panel.children();
            oldpanels.eq(oldpanels.length - 2).remove();
            oldpanels.eq(oldpanels.length - 1).remove();
        }
        if (this.loop) { //复制首尾以便循环
            panel.append(panels[0].cloneNode(true));
            var lastp = panels[len - 1].cloneNode(true);
            panel.append(lastp);
            this.getImg(lastp);
            lastp.style.cssText += 'position:relative;left:' + (-this.steps * (len + 2)) + 'px;';
            allWidth += panels[0].offsetWidth;
            allWidth += panels[len - 1].offsetWidth;
        }
        panel.css('width', allWidth);
        if (trigger && trigger.length) { //如果触发容器存在，触发容器无子元素则添加子元素
            var temp = '',
                childstu = trigger.children();
            if (!childstu.length) {
                for (var i = 0; i < pages; i++) {
                    temp += '<span' + (i == this.curIndex ? " class=" + this.activeTriggerCls + "" : "") + '></span>';
                }
                trigger.html(temp);
            }
            this.triggers = trigger.children();
            this.triggerSel = this.triggers[this.curIndex]; //当前状态元素
        } else {
            this.hasTrigger = false;
        }
        this.slideTo(this.curIndex);

        return this;
    },
    increaseEvent: function() {
        var that = this,
            _panel = that.wrap[0], //外层容器
            prev = that.prev,
            next = that.next,
            triggers = that.triggers;
        //triggers = that.trigg
        if (_panel.addEventListener) {
            _panel.addEventListener('touchstart', that, false);
            _panel.addEventListener('touchmove', that, false);
            _panel.addEventListener('touchend', that, false);
            _panel.addEventListener('webkitTransitionEnd', that, false);
            _panel.addEventListener('msTransitionEnd', that, false);
            _panel.addEventListener('oTransitionEnd', that, false);
            _panel.addEventListener('transitionend', that, false);
        }
        if (that.play) {
            that.begin();
        }
        if (prev && prev.length) {
            prev.on('click', function(e) {
                that.backward.call(that, e)
            });
        }
        if (next && next.length) {
            next.on('click', function(e) {
                that.forward.call(that, e)
            });
        }
        if (that.hasTrigger && triggers) {
            triggers.each(function(n, item) {
                $(item).on('click', function() {
                    that.slideTo(n);
                });
            });
        }
    },
    handleEvent: function(e) {
        switch (e.type) {
            case 'touchstart':
                this.start(e);
                break;
            case 'touchmove':
                this.move(e);
                break;
            case 'touchend':
            case 'touchcancel':
                this.end(e);
                break;
            case 'webkitTransitionEnd':
            case 'msTransitionEnd':
            case 'oTransitionEnd':
            case 'transitionend':
                this.transitionEnd(e);
                break;
        }
    },
    loadImg: function(n) { //判断加载哪屏图片
        n = n || 0;
        //不考虑循环时候复制的元素
        if (n < this._minpage) n = this._maxpage;
        else if (n > this._maxpage) n = this._minpage;

        var status = this.visible,
            lazyIndex = this.lazyIndex - 1,
            maxIndex = lazyIndex + n;
        if (maxIndex > this._maxpage) return;
        maxIndex += 1; //补上,for里判断没有=
        var start = (n && (lazyIndex + n) || n) * status,
            end = maxIndex * status,
            panels = this.panels;
        end = Math.min(panels.length, end);
        for (var i = start; i < end; i++) {
            this.getImg(panels[i]);
        }
    },
    getImg: function(obj) { //加载图片
        if (!obj) return;
        obj = $(obj);
        if (obj.attr('l')) {
            return;
        } //已加载
        var that = this,
            lazy = that.lazy,
            cls = 'img' + lazy;
        lazy = lazy.replace(/^\.|#/g, '');
        obj.find(cls).each(function(n, item) {
            var nobj = $(item);
            src = nobj.attr('dataimg');
            if (src) {
                nobj.attr('src', src).removeAttr('dataimg').removeClass(lazy);
            }
        });
        obj.attr('l', '1');
    },
    start: function(e) { //触摸开始
        var et = e.touches[0];
        //if(this._isScroll){return;}  //滑动未停止，则返回
        this._movestart = undefined;
        this._disX = 0;
        this._coord = {
            x: et.pageX,
            y: et.pageY
        };
    },
    move: function(e) {
        if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
        var et = e.touches[0],
            disX = this._disX = et.pageX - this._coord.x,
            initLeft = this.left,
            tmleft;
        if (typeof this._movestart == 'undefined') { //第一次执行touchmove
            this._movestart = !!(this._movestart || Math.abs(disX) < Math.abs(et.pageY - this._coord.y));
        }
        if (!this._movestart) { //不是上下
            e.preventDefault();
            this.stop();
            if (!this.loop) { //不循环
                disX = disX / ((!this.curIndex && disX > 0 || this.curIndex == this._maxpage && disX < 0) ? (Math.abs(disX) / this.steps + 1) : 1); //增加阻力
            }
            tmleft = initLeft - this.curIndex * this.steps + disX;
            this.setCoord(this.panel, tmleft);
            this._disX = disX;
            //this._left = tmleft;
        }
    },
    end: function(e) {
        if (!this._movestart) { //如果执行了move
            var distance = this._disX;
            if (distance < -10) {
                e.preventDefault();
                this.forward();
            } else if (distance > 10) {
                e.preventDefault();
                this.backward();
            }
            distance = null;
        }
    },
    backward: function(e) {
        if (e && e.preventDefault) {
            e.preventDefault()
        }
        var cur = this.curIndex,
            minp = this._minpage;
        cur -= 1;
        if (cur < minp) {
            if (!this.loop) {
                cur = minp;
            } else {
                cur = minp - 1;
            }
        }
        this.slideTo(cur);
        this.callback && this.callback(Math.max(cur, minp), -1);
    },
    forward: function(e) {
        if (e && e.preventDefault) {
            e.preventDefault()
        }
        var cur = this.curIndex,
            maxp = this._maxpage;
        cur += 1;
        if (cur > maxp) {
            if (!this.loop) {
                cur = maxp;
            } else {
                cur = maxp + 1;
            }
        }
        this.slideTo(cur);
        this.callback && this.callback(Math.min(cur, maxp), 1);
    },
    setCoord: function(obj, x) {
        this.useTransform && obj.css("-webkit-transform", gv1 + x + 'px,0' + gv2) || obj.css("left", x);
    },
    slideTo: function(cur, duration) {
        cur = cur || 0;
        this.curIndex = cur; //保存当前屏数
        var panel = this.panel,
            style = panel[0].style,
            scrollx = this.left - cur * this.steps;
        style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = (duration || this.duration) + 'ms';
        this.setCoord(panel, scrollx);
        this.loadImg(cur);
    },
    transitionEnd: function() {
        var panel = this.panel,
            style = panel[0].style,
            loop = this.loop,
            cur = this.curIndex;
        if (loop) { //把curIndex和坐标重置
            if (cur > this._maxpage) {
                this.curIndex = 0;
            } else if (cur < this._minpage) {
                this.curIndex = this._maxpage;
            }
            this.setCoord(panel, this.left - this.curIndex * this.steps);
        }
        if (!loop && cur == this._maxpage) { //不循环的，只播放一次
            this.stop();
            this.play = false;
        } else {
            this.begin();
        }
        this.update();
        this.updateArrow();
        style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = 0;
        //this._isScroll = false;
    },
    update: function() {
        var triggers = this.triggers,
            cls = this.activeTriggerCls,
            curIndex = this.curIndex,
            triggerIndex = this.triggerIndex,
            pages = this._pages;
        if (triggers && triggers[curIndex]) {
            this.triggerSel && (this.triggerSel.className = '');
            triggers[curIndex].className = cls;
            this.triggerSel = triggers[curIndex];
        }
        //增加个改变数字的
        if (triggerIndex) {
            triggerIndex.html((curIndex + 1) + '/' + pages);
        }
    },
    updateArrow: function() { //左右箭头状态
        var prev = this.prev,
            next = this.next;
        if (!prev || !prev.length || !next || !next.length) return;
        if (this.loop) return; //循环不需要隐藏
        var cur = this.curIndex,
            cls = this.activePnCls;
        cur <= 0 && prev.addClass(cls) || prev.removeClass(cls);
        cur >= this._maxpage && next.addClass(cls) || next.removeClass(cls);
    },
    begin: function() {
        var that = this;
        if (that.play && !that._playTimer) { //自动播放
            that.stop();
            that._playTimer = setInterval(function() {
                that.forward();
            }, that.interval);
        }
    },
    stop: function() {
        var that = this;
        if (that.play && that._playTimer) {
            clearInterval(that._playTimer);
            that._playTimer = null;
        }
    },
    destroy: function() {
        var that = this,
            _panel = that.wrap[0],
            prev = that.prev,
            next = that.next,
            triggers = that.triggers;
        if (_panel.removeEventListener) {
            _panel.removeEventListener('touchstart', that, false);
            _panel.removeEventListener('touchmove', that, false);
            _panel.removeEventListener('touchend', that, false);
            _panel.removeEventListener('webkitTransitionEnd', that, false);
            _panel.removeEventListener('msTransitionEnd', that, false);
            _panel.removeEventListener('oTransitionEnd', that, false);
            _panel.removeEventListener('transitionend', that, false);
        }
        if (prev && prev.length) prev.off('click');
        if (next && next.length) next.off('click');
        if (that.hasTrigger && triggers) {
            triggers.each(function(n, item) {
                $(item).off('click');
            });
        }
    },
    attachTo: function(obj, options) {
        obj = $(obj);
        return obj.each(function(n, item) {
            if (!item.getAttribute('l')) {
                item.setAttribute('l', true);
                touchSlider.cache.push(new touchSlider(item, options));
            }
        });
    }
});

touchSlider.cache = [];

touchSlider.destroy = function() {
    var cache = touchSlider.cache,
        len = cache.length;
    if (len < 1) {
        return;
    }
    for (var i = 0; i < len; i++) {
        cache[i].destroy();
    }
    touchSlider.cache = [];
};

module.exports = touchSlider;

},{}]},{},[1]);
