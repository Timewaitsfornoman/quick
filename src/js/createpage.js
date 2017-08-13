/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-28 16:54:30
 * @version $Id$
 */

var ajax = require('../../unit/common/js/getApi');
var docookie = require('../../unit/common/js/cookie');
var popup = require('../../unit/libs/lib-popup/1.0.0/popup');

var pageid = 0;
var global = null;
var $J_wapper = $('.J_wapper');
var $J_template = $('.J_template');

var $tamplateWapper = $('.tamplate-wapper');
var $J_templateheader = $('.J_templateheader');
var $J_templatebody = $('.J_templatebody');
var $J_templatefooter = $('.J_templatefooter');

var $J_addheader = $('.J_addheader');
var $J_tempbanner = $('#J_tempbanner');

var $J_addboady = $('.J_addboady');
var $J_newcreatebody = $('.J_newcreatebody');

var $J_addfooter = $('.J_addfooter');
var $J_newcreatefooter = $('.J_newcreatefooter');

var page_id = docookie.getCookie('page_id');
var page_name = docookie.getCookie('page_name');
var page_address = docookie.getCookie('page_address');

var page = {

    init: function() {
        var $this = global = this;
        this.initStatus();
        this.addEvent();
    },

    initStatus: function() {
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

    api: {

        sendApi: function(url, date, callBack) {

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

        getHeaderlists: function() {

            var url = 'getTempList';

            var data = {
                type: 'header'
            };

            var ajaxBack = function(rsp) {
                rsp.width = rsp.template.length * 385 + 10;
                var html = $J_tempbanner.html();
                var template = Handlebars.compile(html);
                var html = template(rsp);
                $J_templateheader.html(html).removeClass('hide');
                global.delayEvent.createHeader();
                global.delayEvent.closeCreateDialog();
            };

            this.sendApi(url, data, ajaxBack);
        },

        getBodylists: function() {

            var url = 'getTempList';


            var data = {
                type: 'body'
            };

            var ajaxBack = function(rsp) {
                rsp.width = rsp.template.length * 385 + 10;
                var html = $J_tempbanner.html();
                var template = Handlebars.compile(html);
                var html = template(rsp);
                $J_templatebody.html(html).removeClass('hide');
                global.delayEvent.createBody();
                global.delayEvent.closeCreateDialog();
            };

            this.sendApi(url, data, ajaxBack);
        },

        getFooterlists: function() {

            var url = 'getTempList';

            var data = {
                type: 'footer'
            };

            var ajaxBack = function(rsp) {
                rsp.width = rsp.template.length * 385 + 10;
                var html = $J_tempbanner.html();
                var template = Handlebars.compile(html);
                var banner_html = template(rsp);
                $J_templatefooter.html(banner_html).removeClass('hide');
                global.delayEvent.createFooter();
                global.delayEvent.closeCreateDialog();
            };

            this.sendApi(url, data, ajaxBack);
        },

        insertHeaderdata: function(data, tpldata) {

            var url = 'updatePages';

            var $J_newcreateheader = $('.J_newcreateheader');

            var ajaxBack = function(rsp) {

                $J_newcreateheader.addClass('hide');
                $J_templateheader.addClass('hide');

                var $header = $('.header');
                var $headerstyle = $('#headerstyle');

                !!$header && $header.remove();
                !!$headerstyle && $headerstyle.remove();

                popup.note('创建成功!', 1500);
                var template = Handlebars.compile(tpldata.html);
                var banner_html = template(JSON.parse(data.header_template_js));
                $J_wapper.prepend(banner_html);
                $('head').append('<style id="headerstyle">' + tpldata.css + '</style>');

                $header = $('.header');
                var update = '<a class="J_updateheader update-content" href="javascript:;">编辑头部</a>';
                $header.prepend(update);

                $('.J_updateheader').off('click').on('click', function(event) {
                    event.preventDefault();
                    $J_templateheader.removeClass('hide');
                });
            };

            this.sendApi(url, data, ajaxBack);
        },

        insertBodydata: function(data, tpldata) {

            var url = 'updatePages';

            var ajaxBack = function(rsp) {

                $('.J_newcreatebody').addClass('hide');
                $J_templatebody.addClass('hide');
                var $body = $('.content-body');
                var $bodystyle = $('#bodystyle');

                !!$body && $body.remove();
                !!$bodystyle && $bodystyle.remove();

                var template = Handlebars.compile(tpldata.html);
                var html = template(JSON.parse(data.body_template_js));
                $J_wapper.find('.J_newcreateheader').after(html);

                $('head').append('<style style id="bodystyle">' + tpldata.css + '</style>');

                var $body = $('.content-body');

                var update = '<a class="J_updatebody update-content" href="javascript:;">编辑主体</a>';

                $body.prepend(update);

                $('.J_updatebody').off('click').on('click', function(event) {
                    event.preventDefault();
                    $J_templatebody.removeClass('hide');
                });

                popup.note('创建成功!', 1500);
            };

            this.sendApi(url, data, ajaxBack);
        },

        getFooterDate: function(tpl,index) {

            var $this = this;

            var getFooterForm = function(index){
                
                var $J_templatefooter = $('.J_templatefooter');
                var blankfooter = null;

                if(index == 1){
                    blankfooter = $('#J_blankfooter').html();
                }else{
                    blankfooter = $('#J_blankfootertwo').html();
                }

                $J_templatefooter.html(blankfooter).removeClass('hide');

                var $J_savefooter = $('.J_savefooter');

                $J_savefooter.off('click').on('click', function(){

                    var footerTitle = $('.J_footerTitle').val();

                    if(index == 1){

                        var data = {
                            'title': footerTitle
                        };

                    }else{
                    
                        var logoaddress = $('.J_logoaddress').val();
                        var subtitlefooter = $('.J_subtitlefooter').val();
                        var paragraphfooter = $('.J_paragraphfooter').val();
                        var id = $('.J_altlasid').val();

                        var data = {
                            'img_link': logoaddress,
                            'titewords': footerTitle,
                            'subtitilewords': subtitlefooter,
                            'footerword': paragraphfooter,
                            'id': id
                        };
                    }

                    var result = global.formValidation(data);

                    if(result === true){
                        $this.insertFooterdata(tpl,data,index);
                    }
                });
            };

            switch(index) {
                case 0:
                    $this.insertFooterdata(tpl,{},index);
                    break;
                case 1:
                    getFooterForm(1);
                    break;
                case 2:
                    getFooterForm(2);
                    break;
                default:
                    console.log('运行在外太空');

            }
        },

        insertFooterdata: function(tpl,datas,index) {

            var url = 'updatePages';

            var ajaxBack = function(rsp) {

                var $J_newcreatefooter = $('.J_newcreatefooter');
                $J_newcreatefooter.addClass('hide');

                var $J_footer = $('.J_footer');
                var $footerstyle = $('#footerstyle');

                !!$J_footer && $J_footer.remove();
                !!$footerstyle && $footerstyle.remove();

                var template = Handlebars.compile(tpl.html);
                var html = template(JSON.parse(data.footer_template_js));

                $J_wapper.find('.J_newcreatefooter').after(html);
                $J_templatefooter.addClass('hide');
                
                $('head').append('<style id="footerstyle">' + tpl.css + '</style>');

                var $J_footer = $('.J_footer');

                var update = '<a class="J_updatefooter update-content" href="javascript:;">编辑尾部</a>';
                $J_footer.prepend(update);

                $('.J_updatefooter').off('click').on('click', function(event) {
                    event.preventDefault();
                    $J_templatefooter.removeClass('hide');
                });

                popup.note('创建成功!', 1500);
            };

            var footer = {'footer': datas};

            var data = {
                'id': page_id,
                'footer_template_id': tpl.id,
                'footer_template_js': JSON.stringify(footer)
            };

            this.sendApi(url, data, ajaxBack);
        },

        createPage: function(data, h5html) {

            var url = 'updatePages';

            var ajaxBack = function(rsp) {
                $J_wapper.html(h5html);
                popup.note('创建成功!', 1500);
                window.open(window.location.host + '/html/app/activities/' + page_address + '.html', '_blank');
            };

            this.sendApi(url, data, ajaxBack);
        }
    },

    delayEvent: {

        createHeader: function() {
            var $this = this;
            $('.J_tempitem').off('click').on('click', function() {
                $J_templateheader.addClass('hide');
                var index = $(this).index();
                var html = $(this).data('html');
                var css = $(this).data('css');
                var js = $(this).data('js');
                var id = $(this).data('id');

                var data = {
                    'id': id,
                    'html': html,
                    'js': js,
                    'css': css
                };

                var screateHeader = '';


                switch (index) {
                    case 0:
                        screateHeader = $('#J_blanktempheader').html();
                        break;
                    case 1:
                        screateHeader = $('#J_blanktempheadertwo').html();
                        break;
                    case 2:
                        screateHeader = $('#J_blanktempheaderthree').html();
                        break;
                    case 3:
                        screateHeader = $('#J_blanktempheaderfour').html();
                        break;
                }

                $J_templateheader.html(screateHeader).removeClass('hide');
                $this.closeCreateDialog();
                $this.insertHeaderTempleDate(data, index);
            });
        },

        createBody: function() {
            var $this = this;
            $('.J_tempitem').off('click').on('click', function() {
                $J_templatebody.addClass('hide');
                var html = $(this).data('html');
                var css = $(this).data('css');
                var js = $(this).data('js');
                var id = $(this).data('id');
                var index = $(this).index();

                var data = {
                    'id': id,
                    'html': html,
                    'js': js,
                    'css': css
                };

                var paragraph = '';
                var htmlitemli = '';
                var screateHeader = '';

                switch (index) {
                    case 0:
                        screateHeader = $('#J_blanktempbody').html();
                        htmlitemli = $('#J_blanktembodyitemaltlas').html();
                        break;
                    case 1:
                        screateHeader = $('#J_blanktempbodytwo').html();
                        htmlitemli = $('#J_blanktembodyitemaltlastwo').html();
                        break;
                    case 2:
                        screateHeader = $('#J_blanktempbodythree').html();
                        htmlitemli = $('#J_blanktembodyitemaltlasthree').html();
                        paragraph = $('#J_blanktembodyitempargraffthree').html();
                        break;
                }

                $J_templatebody.html(screateHeader).removeClass('hide');
                $this.createAdditem(index);
                $this.createatlaslists(htmlitemli, paragraph, index);
                $this.getbodyformData(data, index);
                $this.closeCreateDialog();
            });
        },

        createFooter: function() {
            var $this = this;
            $('.J_tempitem').off('click').on('click', function() {
                $J_templatefooter.addClass('hide');
                var html = $(this).data('html');
                var css = $(this).data('css');
                var js = $(this).data('js');
                var id = $(this).data('id');
                var index = $(this).index();

                var data = {
                    'id': id,
                    'html': html,
                    'js': js,
                    'css': css
                };
                
                $this.closeCreateDialog();
                global.api.getFooterDate(data,index);
                $this.closeCreateDialog();
            });
        },

        insertHeaderTempleDate: function(tpldata, index) {

            $('#J_submitbanner').on('click', function(event) {

                event.preventDefault();

                var banner_img = $('#J_picbanner').val();
                var headertitle = $('#J_headertitle').val();

                var data = {
                    'id': tpldata.id,
                    'banner_img': banner_img,
                    'title': headertitle
                };

                switch (index) {

                    case 0:
                        data.sub_titile = $('#J_headsubtitle').val();
                        data.paragraph = $('#J_paragraph').val();
                        data.paragraphtwo = $('#J_paragraphtwo').val();
                        break;
                    case 1:
                        data.header_paragraph = $('#J_headsubtitle').val();
                        data.center_paragraph = $('#J_paragraph').val();
                        data.footer_paragraph = $('#J_paragraphtwo').val();
                        break;
                    case 2:
                        data.paragraph = $('#J_headsubtitle').val();
                        break;
                    case 3:
                        data.subtitle = $('#J_headsubtitle').val();
                        data.paragraph = $('#J_paragraph').val();
                        break;
                }

                var result = global.formValidation(data);

                data = {
                    'id': page_id,
                    'header_template_id': tpldata.id,
                    'header_template_js': JSON.stringify(data)
                };

                result === true && global.api.insertHeaderdata(data, tpldata);
            });

        },

        insertBodyTempleDate: function(body, tpl) {

            var result = global.formValidation(body);

            data = {
                'id': page_id,
                'body_template_id': tpl.id,
                'body_template_js': JSON.stringify(body)
            };

            result === true && global.api.insertBodydata(data, tpl);
        },

        createAdditem: function(index) {
            var $this = this;
            var $J_bodyform = $('#J_bodyform');
            var $J_createLists = $('.J_createLists');
            var $J_addnewitem = $('.J_addnewitem');

            var htmlitem = '';
            var htmlitemli = '';
            var paragraph = '';
            switch (index) {
                case 0:
                    htmlitem = $('#J_blanktembodyitem').html();
                    htmlitemli = $('#J_blanktembodyitemaltlas').html();
                    break;
                case 1:
                    htmlitem = $('#J_blanktembodyitemtwo').html();
                    htmlitemli = $('#J_blanktembodyitemaltlastwo').html();
                    break;
                case 2:
                    htmlitem = $('#J_blanktembodyitemthree').html();
                    htmlitemli = $('#J_blanktembodyitemaltlasthree').html();
                    paragraph = $('#J_blanktembodyitempargraffthree').html();
                    break;
            }

            $J_addnewitem.off('click').on('click', function() {
                $J_bodyform.append(htmlitem);
                $this.createatlaslists(htmlitemli, paragraph, index);

                $('.J_closebodyitems').off('click').on('click', function() {
                    $(this).parent().remove();
                });
            });
        },

        createatlaslists: function(htmlitem, paragraph, index) {

            var index = 0;

            $('.J_addaltlas').off('click').on('click', function() {
                $(this).parent().siblings('.J_waperaltlasId').before(htmlitem);
                $('.J_closealtlaslists').off('click').on('click', function() {
                    $(this).parent().remove();
                });
            });

            if (!!paragraph) {

                $('.J_addaltlas').off('click').on('click', function() {
                    index = $(this).parent().siblings('.J_altlasLists').length;
                    $(this).parent().siblings('.J_altlasLists').eq(index - 1).after(htmlitem);
                    $('.J_closealtlaslists').off('click').on('click', function() {
                        $(this).parent().remove();
                    });
                });

                $('.J_addaltlasparagraph').off('click').on('click', function() {
                    $(this).parent().siblings('.J_addpic').before(paragraph);
                    $('.J_closealtlaslists').off('click').on('click', function() {
                        $(this).parent().remove();
                    });
                });
            }
        },

        getbodyformData: function(tpl, index) {
            var $this = this;
            var $J_bodyform = $('#J_bodyform');
            var array = [],
                data = {};
            var lists = [],
                list_item = {},
                imagearray = [],
                intruduce = {},
                paragraphs =[];

            $('.J_submitbodydata').on('click', function(event) {

                event.preventDefault();
                array = [];

                $J_bodyform.children('ul').each(function() {

                    data = {};

                    if(index != 3) { 
                        data.id = $(this).find('.J_altlasId').val();
                        data.title = $(this).find('.J_mianTitile').val();
                        if (index == 2) {
                            data.subtitle = $(this).find('.J_subTitile').val();
                        }
                        data.describe = $(this).find('.J_describe').val();
                        lists = [];

                        $(this).find('.altlas-lists').each(function() {
                            imagearray = [];
                            intruduce = {};
                            list_item = {};
                            $(this).find('.J_img_alink').each(function() {
                                imagearray.push($(this).val());
                            });

                            if (index == 0) {
                                intruduce.title = $(this).find('.J_headertitle').val();
                            }

                            intruduce.information = $(this).find('.J_paragraph').val();
                            list_item.imagearray = imagearray;
                            list_item.intruduce = intruduce;
                            lists.push(list_item);
                        });

                        data.list = lists;
                        array.push(data);

                    }else{

                        imagearray = [];
                        paragraphs = [];

                        data.title = $(this).find('.J_mianTitile').val();

                        $(this).find('.J_img_alink').each(function() {
                            imagearray.push($(this).val());
                        });

                        $(this).find('.J_paragraph').each(function() {
                            paragraphs.push($(this).val());
                        });

                        data.imagearray = imagearray;
                        data.paragraphs = paragraphs;
                        array.push(data);
                    }
                });

                var body = {
                    body: array
                };

                $this.insertBodyTempleDate(body, tpl);
            });
        },

        closeCreateDialog: function() {
            $('.J_colbtn').off('click').on('click', function() {
                $tamplateWapper.addClass('hide');
            });
        }
    },

    formValidation: function(data) {

        var result = true,
            banner_img = data.banner_img,
            title = data.title,
            headsubbanner = data.headsubbanner,
            paragraph = data.paragraph,
            paragraphtwo = data.paragraphtwo,
            img_link = data.img_link,
            titewords = data.titewords,
            subtitilewords = data.subtitilewords,
            footerword = data.footerword,
            id = data.id;

        if (banner_img != undefined && banner_img.length === 0) {
            result = {
                'errorType': 'banner_img',
                'errorText': 'banner地址不能为空'
            };
        } else if (title != undefined && title.length === 0) {
            result = {
                'errorType': 'title',
                'errorText': '请填写标题'
            };
        } else if (headsubbanner != undefined && headsubbanner.length === 0) {
            result = {
                'errorType': 'headsubbanner',
                'errorText': '请填写副标题'
            };
        } else if (paragraph != undefined && paragraph.length === 0) {
            result = {
                'errorType': 'paragraph',
                'errorText': '请填写段落文案'
            };
        } else if (paragraphtwo != undefined && paragraphtwo.length === 0) {
            result = {
                'errorType': 'paragraphtwo',
                'errorText': '请填写段落文案二'
            };
        }else if (img_link != undefined && img_link.length === 0) {
            result = {
                'errorType': 'img_link',
                'errorText': 'logo地址不能为空'
            };
        }else if (titewords != undefined && titewords.length === 0) {
            result = {
                'errorType': 'titewords',
                'errorText': '标题不能为空'
            };
        }else if (subtitilewords != undefined && subtitilewords.length === 0) {
            result = {
                'errorType': 'subtitilewords',
                'errorText': '小副标题不能为空'
            };
        }else if (footerword != undefined && footerword.length === 0) {
            result = {
                'errorType': 'footerword',
                'errorText': '段落不能为空'
            };
        }else if (id != undefined && id.length === 0) {
            result = {
                'errorType': 'id',
                'errorText': 'id不能为空'
            };
        }

        if (result !== true) {
            popup.note(result.errorText, 1500);
        };

        return result;
    },

    addEvent: function() {

        var $this = this;

        $J_addheader.on('click', function() {
            $this.api.getHeaderlists();
        });

        $J_addboady.on('click', function() {
            $this.api.getBodylists();
        });

        $J_addfooter.on('click', function() {
            $this.api.getFooterlists();
        });

        $('#J_submitDate').on('click', function() {

            var poplayout = '<section class="J_popview pop-view"><div class="J_viewwapper wapper-view"><ul class="J_imgview img-view"></ul></div></section><script type="text/javascript" src="../../../assets/libs/zepto.min.js"></script><script type="text/javascript" src="../../../assets/js/app/activities/' + page_address + '.js"></script></body></html>';

            var headerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="description" content="图加是动态图集的社交平台,提供强大的图片搜索与图片直播功能"><meta name="keywords" content="图片搜索与图片直播"><meta content="yes" name="apple-mobile-web-app-capable"><meta content="telephone=no" name="format-detection"><meta content="email=no" name="format-detection"><meta content="black" name="apple-mobile-web-app-status-bar-style"><link rel="shortcut icon" type="image/x-icon" href="http://event.tujiaapp.com//images/favicon.ico" media="screen"><script type="text/javascript">! function(a) {function b() {a.rem = f.getBoundingClientRect().width / 16, f.style.fontSize = a.rem + "px"} var c, d = a.navigator.appVersion.match(/iphone/gi) ? a.devicePixelRatio : 1,e = 1 / d, f = document.documentElement,g = document.createElement("meta"); if (a.dpr = d, a.addEventListener("resize", function() {clearTimeout(c), c = setTimeout(b, 300)}, !1), a.addEventListener("pageshow", function(a) {a.persisted && (clearTimeout(c), c = setTimeout(b, 300))}, !1), f.setAttribute("data-dpr", d), g.setAttribute("name", "viewport"), g.setAttribute("content", "initial-scale=" + e + ", maximum-scale=" + e + ", minimum-scale=" + e + ", user-scalable=no"), f.firstElementChild) f.firstElementChild.appendChild(g);else {var h = document.createElement("div");h.appendChild(g), document.write(h.innerHTML)}b()}(window);</script><meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no"><title>' + page_name + '</title><link rel="stylesheet" href="../../../assets/css/app/activities/' + page_address + '.css" media="all"></head><body>';

            var $J_wapper = $('.J_wapper');

            $('.J_newcreateheader').remove();
            $('.J_newcreatebody').remove();
            $('.J_newcreatefooter').remove();

            var globalstyle = $('#globalstyle').html();
            var headerstyle = $('#headerstyle').html();
            var bodystyle = $('#bodystyle').html();
            var footerstyle = $('#footerstyle').html();

            var bodyhtml = $J_wapper.html();

            $J_wapper.children('.header').children('.J_updateheader').remove();
            $J_wapper.children('.J_content').children('.J_updatebody').remove();
            $J_wapper.children('.J_footer').children('.J_updatefooter').remove();

            var data = {};
            data.id = page_id;
            data.page_name = page_name;
            data.page_address = page_address;
            data.css = globalstyle + headerstyle + bodystyle + footerstyle;
            data.html = headerHtml + $J_wapper.html() + poplayout;
            $this.api.createPage(data, bodyhtml);
        });
    }
};

page.init();