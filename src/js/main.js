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
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        $('#J_shareMenu').on('click', function(event) {

            var $this = $(this);
            
            $J_sharebox.css(
                'display', 'block'
            );

            setTimeout(function(){
                requestAnimationFrame(function(){

                    $('#J_sharecont').css({
                        'transform': 'translate3d(0, 0, 0)'
                    });

                    $('#J_shareMask').css({
                        'opacity': 1
                    });
                });
            },0)

            hide = false;
        });

        $J_sharebox.on('click', '.J_closeShare', function(event) {

            var $this = $(this);
            requestAnimationFrame(function(){
                $('#J_sharecont').css({
                    'transform': 'translate3d(0px, 100%, 0px)'
                });

                $('#J_shareMask').css({
                    'opacity': 0
                });
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