(function(win) {

    var isWebkit = "-webkit-transform" in document.documentElement.style;
    var transform = isWebkit ? "-webkit-transform" : "transform";

    var ImageView = {
        photos: null,
        index: 0,
        el: null,
        lastTitle: "",
        img: null,
        config: null,
        lastContainerScroll: 0,
        zoom: 1,
        advancedSupport: true,
        shouldHack: false,
        lastTapDate: 0,
        init: function(target, photos, index, config) {
            var self = this;
            index = +index || 0;
            this.config = $.extend({
                size: 1,
                fade: true
            }, config);
            this.lastContainerScroll = window.pageYOffset;
            if ($.os.iphone || $.os.android && parseFloat($.os.version) >= 4) {
                this.advancedSupport = true
            }
            if ($.os.iphone) {
                this.shouldHack = true
            }
            if ($.os.android && $.browser.xiaomi && parseFloat($.os.version) >= 4) {
                this.shouldHack = true
            }
            if ($.browser.ie) {
                $("#slideView").css({
                    "-ms-touch-action": "none"
                })
            }
            this.updateAll(photos, index, {
                count: this.config.count,
                idx_space: this.config.idx_space,
                ignoreRender: true
            });

            setTimeout(function() {
                self.clearStatus();
                self.render(true);
                self.bind();
                self.changeIndex(self.index, true);
            }, 0);
        },
        clearStatus: function() {
            this.width = Math.max(window.innerWidth, document.body.clientWidth);
            this.height = window.innerHeight;
            this.zoom = 1;
            this.zoomXY = [0, 0]
        },
        render: function(first) {
            this.el = $("#slideView");
            this.el.html(this.tmpl({
                photos: this.photos,
                index: this.index,
                width: this.width,
                height: this.height
            }));
            if ($.os.android && $.browser.wechat) {
                $("#slideView .pv-inner").css("backfaceVisibility", "visible")
            }
            if (first) {
                this.el.css({
                        "opacity": 1,
                        "height": this.height + 2 + "px",
                        "top": this.lastContainerScroll - 1 + "px"
                    }).show()
                    .animate({
                        "opacity": 1
                    }, 300);
                this.lastTitle = document.title;
                document.title = ""
            }
        },
        tmpl: function(data) {
            var __p = [],
                _p = function(s) {
                    __p.push(s)
                };

            with(data || {}) {
                __p.push('<ul class="pv-inner" style="line-height:');
                _p(height);
                __p.push('px;">');

                for (var i = 0; i < photos.length; i++) {
                    __p.push('<li class="pv-img" style="width:');
                    _p(width);
                    __p.push("px;height:");
                    _p(height);
                    __p.push('px;position:relative"></li>')
                }
                __p.push('</ul>');
                __p.push('<p class="ui-loading" id="J_loading"><i class="icon-load"></i></p>');
                __p.push('<p class="footer-bar"><span class="counts value" id="J_index">');
                _p(index + 1);
                __p.push("/");
                _p(photos.length);
                __p.push('</span>');
                __p.push('<a id="J_downloadbox" href="" class="down-loaditem" download><img src="images/download.png" alt="下载"/></a>');
                __p.push('</p>');
            }
            return __p.join("")
        },
        topFix: function() {
            if (!ImageView.el) {
                return
            }
            ImageView.el.css("top", window.scrollY + "px")
        },
        bind: function() {
            var self = this;
            var resizeTimer;
            this.unbind();
            $(window).on("scroll", this.topFix);
            this.el.on("touchstart touchmove touchend touchcancel", function(e) {
                self.handleEvent(e)
            });
            $(window).on("resize", function(e) {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                    self.el.css({
                        "height": window.innerHeight + 2 + "px",
                        "top": self.lastContainerScroll - 1 + "px"
                    })
                }, 600)
            });
            this.el.on("singleTap", function(e) {
                e.preventDefault();
                var now = new Date;
                if (now - this.lastTapDate < 500) {
                    return
                }
                this.lastTapDate = now;
                self.onSingleTap(e)
            }).on("doubleTap", function(e) {
                e.preventDefault();
                self.onDoubleTap(e);
            });

            this.el.on("click", function(e) {
                self.close();
            });
            "onorientationchange" in window ? window.addEventListener("orientationchange", this, false) : window.addEventListener("resize", this, false)
        },
        unbind: function() {
            this.el.off();
            $(window).off("scroll", this.topFix);
            "onorientationchange" in window ? window.removeEventListener("orientationchange", this, false) : window.removeEventListener("resize", this, false)
        },
        handleEvent: function(e) {
            switch (e.type) {
                case "touchstart":
                    this.onTouchStart(e);
                    break;
                case "touchmove":
                    e.preventDefault();
                    this.onTouchMove(e);
                    break;
                case "touchcancel":
                    ;
                case "touchend":
                    this.onTouchEnd(e);
                    break;
                case "orientationchange":
                    ;
                case "resize":
                    this.resize(e);
                    break
            }
        },
        onSingleTap: function(e) {
            var target = $(e.target);
            if (target.hasClass("zoom")) {
                if (!target.hasClass("disabled")) {
                    this.onDoubleTap();
                }
            } else {
                if (target.hasClass("like")) {
                    this.doLike(this.index, target.hasClass("click"))
                } else {
                    if (target.hasClass("coms")) {} else {
                        if (target.hasClass("J_more")) {
                            this.jumpToDetail(this.index)
                        }
                    }
                }
            }
            var pa = target.parents(".photo-meta");
            var isBtnVideo = target.hasClass("btn-video");
            if (!pa.size() && !isBtnVideo) {
                this.close(e)
            }
        },
        onClick: function(e) {
            var target = $(e.target);
            if (target.hasClass("coms")) {
                this.jumpToComment(this.index)
            }
        },
        getDist: function(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 2)
        },
        doubleZoomOrg: 1,
        doubleDistOrg: 1,
        isDoubleZoom: false,
        onTouchStart: function(e) {
            if (this.advancedSupport && e.touches && e.touches.length >= 2) {
                var img = this.getImg();
                $(img).css({
                    "transitionDuration": "0ms"
                });
                this.isDoubleZoom = true;
                this.doubleZoomOrg = this.zoom;
                this.doubleDistOrg = this.getDist(e.touches[0].pageX, e.touches[0].pageY, e.touches[1].pageX, e.touches[1].pageY);
                return
            }
            e = e.touches ? e.touches[0] : e;
            this.isDoubleZoom = false;
            this.start = [e.pageX, e.pageY];
            this.org = [e.pageX, e.pageY];
            this.orgTime = Date.now();
            this.hasMoved = false;
            if (this.zoom != 1) {
                this.zoomXY = this.zoomXY || [0, 0];
                this.orgZoomXY = [this.zoomXY[0], this.zoomXY[1]];
                var img = this.getImg();
                if (img) {
                    $(img).css({
                        "transitionDuration": "0ms"
                    })
                }
                this.drag = true
            } else {
                if (this.photos.length == 1) {
                    return
                }
                this.el.find(".pv-inner").css("transitionDuration", "0ms");
                this.transX = -this.index * this.width;
                this.slide = true
            }
        },
        onTouchMove: function(e) {
            if (this.advancedSupport && e.touches && e.touches.length >= 2) {
                var newDist = this.getDist(e.touches[0].pageX, e.touches[0].pageY, e.touches[1].pageX, e.touches[1].pageY);
                this.zoom = newDist * this.doubleZoomOrg / this.doubleDistOrg;
                var img = this.getImg();
                $(img).css({
                    "transitionDuration": "0ms"
                });
                if (this.zoom < 1) {
                    this.zoom = 1;
                    this.zoomXY = [0, 0];
                    $(img).css({
                        "transitionDuration": "200ms"
                    })
                } else {
                    if (this.zoom > this.getScale(img) * 2) {
                        this.zoom = this.getScale(img) * 2
                    }
                }
                if (isWebkit) {
                    $(img).css({
                        "-webkit-transform": "scale(" + this.zoom + ") translate(" + this.zoomXY[0] + "px," + this.zoomXY[1] + "px)"
                    });
                } else {
                    $(img).css({
                        "transform": "scale(" + this.zoom + ") translate(" + this.zoomXY[0] + "px," + this.zoomXY[1] + "px)"
                    });
                }

                return
            }
            if (this.isDoubleZoom) {
                return
            }
            e = e.touches ? e.touches[0] : e;
            if (!this.hasMoved && (Math.abs(e.pageX - this.org[0]) > 5 || Math.abs(e.pageY - this.org[1]) > 5)) {
                this.hasMoved = true
            }
            if (this.zoom != 1) {
                var deltaX = (e.pageX - this.start[0]) / this.zoom;
                var deltaY = (e.pageY - this.start[1]) / this.zoom;
                this.start = [e.pageX, e.pageY];
                var img = this.getImg();
                var newWidth = img.clientWidth * this.zoom,
                    newHeight = img.clientHeight * this.zoom;
                var borderX = (newWidth - this.width) / 2 / this.zoom,
                    borderY = (newHeight - this.height) / 2 / this.zoom;
                if (borderX >= 0) {
                    if (this.zoomXY[0] < -borderX || this.zoomXY[0] > borderX) {
                        deltaX /= 3
                    }
                }
                if (borderY > 0) {
                    if (this.zoomXY[1] < -borderY || this.zoomXY[1] > borderY) {
                        deltaY /= 3
                    }
                }
                this.zoomXY[0] += deltaX;
                this.zoomXY[1] += deltaY;
                if (this.photos.length == 1 && newWidth < this.width) {
                    this.zoomXY[0] = 0
                } else {
                    if (newHeight < this.height) {
                        this.zoomXY[1] = 0
                    }
                }

                if (isWebkit) {
                    $(img).css({
                        "-webkit-transform": "scale(" + this.zoom + ") translate(" + this.zoomXY[0] + "px," + this.zoomXY[1] + "px)"
                    });
                } else {
                    $(img).css({
                        "transform": "scale(" + this.zoom + ") translate(" + this.zoomXY[0] + "px," + this.zoomXY[1] + "px)"
                    });
                }

            } else {
                if (!this.slide) {
                    return
                }
                var deltaX = e.pageX - this.start[0];
                if (this.transX > 0 || this.transX < -this.width * (this.photos.length - 1)) {
                    deltaX /= 4
                }
                this.transX = -this.index * this.width + deltaX;
                this.el.find(".pv-inner").css(transform, "translateX(" + this.transX + "px)");
            }
        },
        onTouchEnd: function(e) {
            if (this.isDoubleZoom) {
                this.zoomIconFix(this.getImg());
                return
            }
            if (!this.hasMoved) {
                return
            }
            if (this.zoom != 1) {
                if (!this.drag) {
                    return
                }
                var img = this.getImg();
                var newWidth = img.clientWidth * this.zoom,
                    newHeight = img.clientHeight * this.zoom;
                var borderX = (newWidth - this.width) / 2 / this.zoom,
                    borderY = (newHeight - this.height) / 2 / this.zoom;
                var len = this.photos.length;
                if (len > 1 && borderX >= 0) {
                    var updateDelta = 0;
                    var switchDelta = this.width / 6;
                    if (this.zoomXY[0] < -borderX - switchDelta / this.zoom && this.index < len - 1) {
                        updateDelta = 1
                    } else {
                        if (this.zoomXY[0] > borderX + switchDelta / this.zoom && this.index > 0) {
                            updateDelta = -1
                        }
                    }
                    if (updateDelta != 0) {
                        this.scaleDown(img);
                        this.changeIndex(this.index + updateDelta);
                        return
                    }
                }
                var delta = Date.now() - this.orgTime;
                if (delta < 300) {
                    if (delta <= 10) {
                        delta = 10
                    }
                    var deltaDis = Math.pow(180 / delta, 2);
                    this.zoomXY[0] += (this.zoomXY[0] - this.orgZoomXY[0]) * deltaDis;
                    this.zoomXY[1] += (this.zoomXY[1] - this.orgZoomXY[1]) * deltaDis;
                    $(img).css({
                        "transition": "400ms cubic-bezier(0.08,0.65,0.79,1)"
                    })
                } else {
                    $(img).css({
                        "transition": "200ms linear"
                    })
                }
                if (borderX >= 0) {
                    if (this.zoomXY[0] < -borderX) {
                        this.zoomXY[0] = -borderX
                    } else {
                        if (this.zoomXY[0] > borderX) {
                            this.zoomXY[0] = borderX
                        }
                    }
                }
                if (borderY > 0) {
                    if (this.zoomXY[1] < -borderY) {
                        this.zoomXY[1] = -borderY
                    } else {
                        if (this.zoomXY[1] > borderY) {
                            this.zoomXY[1] = borderY
                        }
                    }
                }
                if (this.isLongPic(img) && Math.abs(this.zoomXY[0]) < 10) {

                    if (isWebkit) {
                        $(img).css({
                            "-webkit-transform": "scale(" + this.zoom + ") translate(0px," + this.zoomXY[1] + "px)"
                        });
                    } else {
                        $(img).css({
                            "transform": "scale(" + this.zoom + ") translate(0px," + this.zoomXY[1] + "px)"
                        });
                    }

                    return
                } else {

                    if (isWebkit) {
                        $(img).css({
                            "-webkit-transform": "scale(" + this.zoom + ") translate(" + this.zoomXY[0] + "px," + this.zoomXY[1] + "px)"
                        })
                    } else {
                        $(img).css({
                            "transform": "scale(" + this.zoom + ") translate(" + this.zoomXY[0] + "px," + this.zoomXY[1] + "px)"
                        })
                    }
                }
                this.drag = false
            } else {
                if (!this.slide) {
                    return
                }
                var deltaX = this.transX - -this.index * this.width;
                var updateDelta = 0;
                if (deltaX > 50) {
                    updateDelta = -1
                } else {
                    if (deltaX < -50) {
                        updateDelta = 1
                    }
                }
                this.changeIndex(this.index + updateDelta);
                this.slide = false;
            }
        },
        getImg: function(index) {
            var img = this.el.find("li").eq(index || this.index).find("img");
            if (img.size() == 1) {
                return img[0]
            } else {
                return null
            }
        },
        getScale: function(img) {
            if (this.isLongPic(img)) {
                return this.width / img.clientWidth
            } else {
                var h = img.naturalHeight,
                    w = img.naturalWidth;
                var hScale = h / img.clientHeight,
                    wScale = w / img.clientWidth;
                if (hScale > wScale) {
                    return wScale
                } else {
                    return hScale
                }
            }
        },
        onDoubleTap: function(e) {
            var now = new Date;
            if (now - this.lastTapDate < 500) {
                return
            }
            this.lastTapDate = now;
            var img = this.getImg();
            if (!img) {
                return
            }
            if (this.zoom != 1) {
                this.scaleDown(img)
            } else {
                this.scaleUp(img)
            }
            this.afterZoom(img)
        },
        scaleUp: function(img) {
            var scale = this.getScale(img);
            if (scale > 1) {

                if (isWebkit) {

                    $(img).css({
                        "-webkit-transform": "scale(" + scale + ")",
                        "-webkit-transition": "200ms"
                    });

                } else {

                    $(img).css({
                        "transform": "scale(" + scale + ")",
                        "transition": "200ms"
                    });
                }
            }
            this.zoom = scale;
            this.afterZoom(img)
        },
        scaleDown: function(img) {
            this.zoom = 1;
            this.zoomXY = [0, 0];
            this.doubleDistOrg = 1;
            this.doubleZoomOrg = 1;

            if (isWebkit) {

                $(img).css({
                    "-webkit-transform": "scale(1)",
                    "-webkit-transition": "200ms"
                });

            } else {

                $(img).css({
                    "transform": "scale(1)",
                    "transition": "200ms"
                });
            }

            this.afterZoom(img)
        },
        afterZoom: function(img) {
            if (this.zoom > 1 && this.isLongPic(img)) {
                var newHeight = img.clientHeight * this.zoom;
                var borderY = (newHeight - this.height) / 2 / this.zoom;
                if (borderY > 0) {
                    this.zoomXY[1] = borderY;

                    if (isWebkit) {

                        $(img).css({
                            "-webkit-transform": "scale(" + this.zoom + ") translate(0px," + borderY + "px)"
                        })

                    } else {

                        $(img).css({
                            "transform": "scale(" + this.zoom + ") translate(0px," + borderY + "px)"
                        })
                    }
                }
            }
            this.zoomIconFix(img)
        },
        isLongPic: function(img) {
            return img.clientHeight / img.clientWidth >= 3.5
        },
        zoomIconFix: function(img) {
            var icon = this.el.find(".zoom");
            var zoom = this.zoom;
            if (!icon.size()) {
                return
            }
            var cls = "zoom";
            if (zoom == 1) {
                cls += " in"
            } else {
                cls += " out"
            }
            if (img.naturalWidth <= this.width && img.naturalHeight <= this.height) {
                cls += " disabled"
            }
            icon.attr("class", cls)
        },
        resizeTimer: null,
        resize: function(e) {
            clearTimeout(this.resizeTimer);
            var self = this;
            this.resizeTimer = setTimeout(function() {
                document.body.style.minHeight = window.innerHeight + 1 + "px";
                if (self.zoom != 1) {
                    self.scaleDown(self.getImg())
                }
                self.clearStatus();
                self.render();
                self.el.height(self.height).css("top", window.scrollY + "px");
                self.changeIndex(self.index, true)
            }, 600)
        },
        changeIndex: function(index, force) {
            if (this.indexChangeLock) {
                return
            }
            if (index < 0) {
                index = 0
            } else {
                if (index >= this.photos.length) {
                    index = this.photos.length - 1
                }
            }
            var changed = this.index != index;
            this.index = index;
            var inner = this.el.find(".pv-inner");
            var cssObj = {};

            if (transform == 'transform') {
                inner.css({
                    transitionDuration: force ? "0" : "200" + "ms",
                    'transform': "translateX(-" + index * this.width + "px)"
                });

            } else {
                inner.css({
                    transitionDuration: force ? "0" : "200" + "ms",
                    '-webkit-transform': "translateX(-" + index * this.width + "px)"
                });
            }

            var li = inner.find("li").eq(index);
            var imgs = li.find("img");
            var self = this;
            if (!imgs.size()) {
                this.el.find("#J_loading").show();
                if (typeof this.photos[index] != "undefined") {
                    var img = new Image;
                    img.onload = function() {
                        if (self.el == null) {
                            return
                        }
                        img.onload = null;
                        img.setAttribute("data-lazy", "");
                        self.el.find("#J_loading").hide();
                        $(img).css({
                            transform: ""
                        });
                        img.style.opacity = "";
                        if ($.browser.ie) {
                            img.removeAttribute("height");
                            img.removeAttribute("width");
                            $(img).on("drag", function(e) {
                                e.preventDefault()
                            });
                            $(img).attr("unselcetable", "on")
                        }
                        self.zoomIconFix(img);
                        if (self.isLongPic(img)) {
                            setTimeout(function() {
                                self.scaleUp(img)
                            }, 0)
                        }
                    };
                    img.ontimeout = function() {
                        li.html('<i style="color:white;">\u56fe\u7247\u52a0\u8f7d\u8d85\u65f6\uff0c\u8bf7\u91cd\u8bd5</i>');
                        self.el.find("#J_loading").hide()
                    };
                    img.onerror = function() {
                        li.html('<i style="color:white;">\u56fe\u7247\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5</i>');
                        self.el.find("#J_loading").hide()
                    };
                    if (self.shouldHack) {
                        $(img).css({
                            "backfaceVisibility": "hidden"
                        })
                    }
                    img.style.opacity = "0";
                    img.src = this.getImgUrl(index);
                    li.html("").append(img);
                    // if (this.photos && this.photos[index]) {
                    //  var photo = this.photos[index];
                    //  if (photo && photo.videodata && photo.videodata.videourl) {
                    //      var btnHtml = '<button class="btn-video" data-hook="global-video" data-playvideo="' + photo.videodata.videourl + '">\u64ad\u653e\u89c6\u9891</button>';
                    //      li.append(btnHtml)
                    //  }
                    // }

                    if (this.config.onRequestMore && this.index > 0 && typeof this.photos[index - 1] == "undefined") {
                        this.config.onRequestMore(this.photos[index], -1, index)
                    } else {
                        if (this.config.onRequestMore && this.index < this.photos.length - 1 && typeof this.photos[this.index + 1] == "undefined") {
                            this.config.onRequestMore(this.photos[index], 1, index)
                        }
                    }
                    this.preload(index - 1);
                    this.preload(index + 1)
                } else {
                    this.indexChangeLock = true
                }
            } else {
                this.zoomIconFix(imgs[0])
            }
            if (changed || force) {
                this.el.find("#J_index").html(index + 1 + "/" + this.photos.length);
                this.el.find("#J_downloadbox").attr("href", this.getImgUrl(index).split('?')[0] + "?attname=");
                this.el.find("#J_downloadbox").off().on('click', function(e) {
                    e.stopPropagation();
                })
                this.config.onIndexChange && this.config.onIndexChange(img, this.photos, index);
            }
            setTimeout(function() {
                self.memoryClear()
            }, 0)
        },
        memoryClear: function() {
            var li = this.el.find(".pv-img");
            var i = this.index - 10;
            while (i >= 0) {
                if (li.eq(i).html() == "") {
                    break
                }
                li.eq(i).html("");
                i--
            }
            i = this.index + 10;
            while (i < li.size()) {
                if (li.eq(i).html() == "") {
                    break
                }
                li.eq(i).html("");
                i++
            }
        },
        getImgUrl: function(index, useOrg) {

            if (index < 0 || index >= this.photos.length || !this.photos[index]) {
                return ""
            }
            var rs = "";
            rs = this.photos[index];
            return rs;
        },
        preload: function(index) {
            if (index < 0 || index >= this.photos.length || !this.getImg(index)) {
                return
            }
            var url = this.getImgUrl(index);
            if (url) {
                var img = new Image;
                img.src = url
            }
        },
        update: function(photos, index) {
            photos = this.picFormat(photos);
            if (index < this.photos.length) {
                var len = photos.length;
                for (var i = index; i < index + len; i++) {
                    this.photos[i] = photos[i - index]
                }
                if (this.indexChangeLock) {
                    this.indexChangeLock = false;
                    this.changeIndex(this.index)
                }
            }
        },
        updateAll: function(photos, index, config) {
            photos = this.picFormat(photos);
            if (config.count) {
                this.photos = new Array(config.count);
                var len = photos.length,
                    start = config.idx_space || 0;
                for (var i = start; i < start + len; i++) {
                    this.photos[i] = photos[i - start]
                }
                this.index = start + index
            } else {
                this.photos = photos || [];
                this.index = index || 0
            }
            if (!config.ignoreRender) {
                this.render();
                this.changeIndex(this.index, true)
            }
        },
        destroy: function() {
            if (this.el) {
                var self = this;
                this.unbind();
                this.el.css({
                    "opacity": 0
                });
                this.el.animate({
                    "opacity": 0
                }, 300, "linear", function() {
                    if (self.el) {
                        self.el.html("").hide();
                        self.el = null
                    }
                });
                this.config.onClose && this.config.onClose(this.img, this.photos, this.index);
            }
        },
        close: function() {
            var self = this;
            clearTimeout(this.oprShowCountdown);
            if (!this.config.ignoreHash) {
                var hash = location.hash;
                if (hash.indexOf("slideView") >= 0) {
                    window.history.back()
                } else {
                    self.destroy()
                }
            } else {
                this.destroy()
            }
        },
        getParams: function(index) {
            if (!this.photos[index].name) {
                return this.config.params || {}
            } else {
                if (this.photos[index]) {
                    return this.photos[index].params || {}
                } else {
                    return {}
                }
            }
        },
        setParams: function(index, attr, val) {
            index = index || this.index;
            if (this.config.params && !this.photos[index].name) {
                this.config.params[attr] = val
            } else {
                this.photos[index].params = this.photos[index].params || {};
                this.photos[index].params[attr] = val
            }
        },
        oprShowCountdown: null,
        updateParams: function(index, params) {
            this.photos[index].params = $.extend(this.photos[index].params, params);
        },

        picFormat: function(arr) {
            for (var img in arr) {
                if (!arr.hasOwnProperty(img)) {
                    continue
                }
                img = arr[img];
                if (!img) {
                    continue
                }
                img.params = img.params || {};
                var params = {};
                if (img.name) {
                    params.isLiked = !!(img.ismylike || img.mylike);
                    params.comment = img.commentcount || img.cmtnum || img.cmt_cnt || 0;
                    params.like = img.likenum || img.like_cnt || 0;
                    params.desc = img.desc || "";
                    if (img.like) {
                        params.like = img.like.count || 0;
                        params.isLiked = !!img.like.ilike
                    }
                    if (img.comment) {
                        params.comment = img.comment.count
                    }
                    img.params = $.extend(params, img.params);
                    if (img.params.isLiked && img.params.like == 0) {
                        img.params.like = 1
                    }
                }
            }
            return arr
        }
    };
    
    win.ImageView = ImageView;
})(window);
/*! lazysizes - v3.0.0-rc1 */
!function(a,b){var c=b(a,a.document);a.lazySizes=c,"object"==typeof module&&module.exports&&(module.exports=c)}(window,function(a,b){"use strict";if(b.getElementsByClassName){var c,d=b.documentElement,e=a.Date,f=a.HTMLPictureElement,g="addEventListener",h="getAttribute",i=a[g],j=a.setTimeout,k=a.requestAnimationFrame||j,l=a.requestIdleCallback,m=/^picture$/i,n=["load","error","lazyincluded","_lazyloaded"],o={},p=Array.prototype.forEach,q=function(a,b){return o[b]||(o[b]=new RegExp("(\\s|^)"+b+"(\\s|$)")),o[b].test(a[h]("class")||"")&&o[b]},r=function(a,b){q(a,b)||a.setAttribute("class",(a[h]("class")||"").trim()+" "+b)},s=function(a,b){var c;(c=q(a,b))&&a.setAttribute("class",(a[h]("class")||"").replace(c," "))},t=function(a,b,c){var d=c?g:"removeEventListener";c&&t(a,b),n.forEach(function(c){a[d](c,b)})},u=function(a,c,d,e,f){var g=b.createEvent("CustomEvent");return g.initCustomEvent(c,!e,!f,d||{}),a.dispatchEvent(g),g},v=function(b,d){var e;!f&&(e=a.picturefill||c.pf)?e({reevaluate:!0,elements:[b]}):d&&d.src&&(b.src=d.src)},w=function(a,b){return(getComputedStyle(a,null)||{})[b]},x=function(a,b,d){for(d=d||a.offsetWidth;d<c.minSize&&b&&!a._lazysizesWidth;)d=b.offsetWidth,b=b.parentNode;return d},y=function(){var a,c,d=[],e=function(){var b;for(a=!0,c=!1;d.length;)b=d.shift(),b[0].apply(b[1],b[2]);a=!1},f=function(f){a?f.apply(this,arguments):(d.push([f,this,arguments]),c||(c=!0,(b.hidden?j:k)(e)))};return f._lsFlush=e,f}(),z=function(a,b){return b?function(){y(a)}:function(){var b=this,c=arguments;y(function(){a.apply(b,c)})}},A=function(a){var b,c=0,d=125,f=666,g=f,h=function(){b=!1,c=e.now(),a()},i=l?function(){l(h,{timeout:g}),g!==f&&(g=f)}:z(function(){j(h)},!0);return function(a){var f;(a=a===!0)&&(g=44),b||(b=!0,f=d-(e.now()-c),0>f&&(f=0),a||9>f&&l?i():j(i,f))}},B=function(a){var b,c,d=99,f=function(){b=null,a()},g=function(){var a=e.now()-c;d>a?j(g,d-a):(l||f)(f)};return function(){c=e.now(),b||(b=j(g,d))}},C=function(){var f,k,l,n,o,x,C,E,F,G,H,I,J,K,L,M=/^img$/i,N=/^iframe$/i,O="onscroll"in a&&!/glebot/.test(navigator.userAgent),P=0,Q=0,R=0,S=-1,T=function(a){R--,a&&a.target&&t(a.target,T),(!a||0>R||!a.target)&&(R=0)},U=function(a,c){var e,f=a,g="hidden"==w(b.body,"visibility")||"hidden"!=w(a,"visibility");for(F-=c,I+=c,G-=c,H+=c;g&&(f=f.offsetParent)&&f!=b.body&&f!=d;)g=(w(f,"opacity")||1)>0,g&&"visible"!=w(f,"overflow")&&(e=f.getBoundingClientRect(),g=H>e.left&&G<e.right&&I>e.top-1&&F<e.bottom+1);return g},V=function(){var a,e,g,i,j,m,n,p,q;if((o=c.loadMode)&&8>R&&(a=f.length)){e=0,S++,null==K&&("expand"in c||(c.expand=d.clientHeight>500&&d.clientWidth>500?500:370),J=c.expand,K=J*c.expFactor),K>Q&&1>R&&S>2&&o>2&&!b.hidden?(Q=K,S=0):Q=o>1&&S>1&&6>R?J:P;for(;a>e;e++)if(f[e]&&!f[e]._lazyRace)if(O)if((p=f[e][h]("data-expand"))&&(m=1*p)||(m=Q),q!==m&&(C=innerWidth+m*L,E=innerHeight+m,n=-1*m,q=m),g=f[e].getBoundingClientRect(),(I=g.bottom)>=n&&(F=g.top)<=E&&(H=g.right)>=n*L&&(G=g.left)<=C&&(I||H||G||F)&&(l&&3>R&&!p&&(3>o||4>S)||U(f[e],m))){if(ba(f[e]),j=!0,R>9)break}else!j&&l&&!i&&4>R&&4>S&&o>2&&(k[0]||c.preloadAfterLoad)&&(k[0]||!p&&(I||H||G||F||"auto"!=f[e][h](c.sizesAttr)))&&(i=k[0]||f[e]);else ba(f[e]);i&&!j&&ba(i)}},W=A(V),X=function(a){r(a.target,c.loadedClass),s(a.target,c.loadingClass),t(a.target,Z)},Y=z(X),Z=function(a){Y({target:a.target})},$=function(a,b){try{a.contentWindow.location.replace(b)}catch(c){a.src=b}},_=function(a){var b,d,e=a[h](c.srcsetAttr);(b=c.customMedia[a[h]("data-media")||a[h]("media")])&&a.setAttribute("media",b),e&&a.setAttribute("srcset",e),b&&(d=a.parentNode,d.insertBefore(a.cloneNode(),a),d.removeChild(a))},aa=z(function(a,b,d,e,f){var g,i,k,l,o,q;(o=u(a,"lazybeforeunveil",b)).defaultPrevented||(e&&(d?r(a,c.autosizesClass):a.setAttribute("sizes",e)),i=a[h](c.srcsetAttr),g=a[h](c.srcAttr),f&&(k=a.parentNode,l=k&&m.test(k.nodeName||"")),q=b.firesLoad||"src"in a&&(i||g||l),o={target:a},q&&(t(a,T,!0),clearTimeout(n),n=j(T,2500),r(a,c.loadingClass),t(a,Z,!0)),l&&p.call(k.getElementsByTagName("source"),_),i?a.setAttribute("srcset",i):g&&!l&&(N.test(a.nodeName)?$(a,g):a.src=g),(i||l)&&v(a,{src:g})),y(function(){a._lazyRace&&delete a._lazyRace,s(a,c.lazyClass),(!q||a.complete)&&(q?T(o):R--,X(o))})}),ba=function(a){var b,d=M.test(a.nodeName),e=d&&(a[h](c.sizesAttr)||a[h]("sizes")),f="auto"==e;(!f&&l||!d||!a.src&&!a.srcset||a.complete||q(a,c.errorClass))&&(b=u(a,"lazyunveilread").detail,f&&D.updateElem(a,!0,a.offsetWidth),a._lazyRace=!0,R++,aa(a,b,f,e,d))},ca=function(){if(!l){if(e.now()-x<999)return void j(ca,999);var a=B(function(){c.loadMode=3,W()});l=!0,c.loadMode=3,W(),i("scroll",function(){3==c.loadMode&&(c.loadMode=2),a()},!0)}};return{_:function(){x=e.now(),f=b.getElementsByClassName(c.lazyClass),k=b.getElementsByClassName(c.lazyClass+" "+c.preloadClass),L=c.hFac,i("scroll",W,!0),i("resize",W,!0),a.MutationObserver?new MutationObserver(W).observe(d,{childList:!0,subtree:!0,attributes:!0}):(d[g]("DOMNodeInserted",W,!0),d[g]("DOMAttrModified",W,!0),setInterval(W,999)),i("hashchange",W,!0),["focus","mouseover","click","load","transitionend","animationend","webkitAnimationEnd"].forEach(function(a){b[g](a,W,!0)}),/d$|^c/.test(b.readyState)?ca():(i("load",ca),b[g]("DOMContentLoaded",W),j(ca,2e4)),f.length?(V(),y._lsFlush()):W()},checkElems:W,unveil:ba}}(),D=function(){var a,d=z(function(a,b,c,d){var e,f,g;if(a._lazysizesWidth=d,d+="px",a.setAttribute("sizes",d),m.test(b.nodeName||""))for(e=b.getElementsByTagName("source"),f=0,g=e.length;g>f;f++)e[f].setAttribute("sizes",d);c.detail.dataAttr||v(a,c.detail)}),e=function(a,b,c){var e,f=a.parentNode;f&&(c=x(a,f,c),e=u(a,"lazybeforesizes",{width:c,dataAttr:!!b}),e.defaultPrevented||(c=e.detail.width,c&&c!==a._lazysizesWidth&&d(a,f,e,c)))},f=function(){var b,c=a.length;if(c)for(b=0;c>b;b++)e(a[b])},g=B(f);return{_:function(){a=b.getElementsByClassName(c.autosizesClass),i("resize",g)},checkElems:g,updateElem:e}}(),E=function(){E.i||(E.i=!0,D._(),C._())};return function(){var b,d={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.5,hFac:.8,loadMode:2};c=a.lazySizesConfig||a.lazysizesConfig||{};for(b in d)b in c||(c[b]=d[b]);a.lazySizesConfig=c,j(function(){c.init&&E()})}(),{cfg:c,autoSizer:D,loader:C,init:E,uP:v,aC:r,rC:s,hC:q,fire:u,gW:x,rAF:y}}});
(function() {

    //全局变量
    var listdata = {};
    var tuwenlist = '';
    var twscopeid = '';
    var scopename = '';
    var likedUsers = [];
    var dataComments = [];
    var statsLikeCount = 0;
    var indexlikecoment = 0;

    //dom结构
    var $window = $(window);
    var $J_body = $('#J_body');
    var $J_view = $('#J_view');
    var $J_bg = $('#J_bg');
    var $J_header = $('#J_header');
    var $J_bottom = $('#J_bottom');
    var $J_view = $('#J_view');
    var $J_dialog = $('#J_dialog');
    var $J_footer = $('#J_footer');
    var $J_waper = $('#J_waper');
    var $J_download = $('#J_download');
    var $J_pointComment = $('#J_pointComment');
    var $J_contentheader = $('#J_contentheader');
    var $J_navone = $('.J_navone');
    var $J_click = $('#J_click');
    var $J_navtwo = $('.J_navtwo');
    var $J_comlist = $('#J_comlist');
    var $J_likeusers = $('#J_likeusers');
    var $J_altlas = $('#J_altlas');
    var $J_altTitle = $('#J_altTitle');
    var $J_tuwenList = $('#J_tuwenList');
    var $J_notwaltlas = $('#J_notwaltlas');
    var $J_findmore = $('#J_findmore');
    var $J_content = $('#J_content');
    var $J_dialog = $('#J_dialog');
    var $J_dllink = $('#J_dllink');
    var $slideView = $('#slideView');
    var $J_statsed = $('.J_statsed');
    var $J_Twlist = $('#J_Twlist');
    var $J_complaint = $('.J_complaint');
    var $J_dllinkmore = $('#J_dllinkmore');
    var $J_downloadbtn = $('#J_downloadbtn');
    var $J_shareTitle = null;
    var $J_background = $('#J_background');
    var $J_headerwapper = $('#J_headerwapper');
    var $J_downloadmore = $('#J_downloadmore');
    var $J_footerword = $('#J_footerword');
    var $J_getmoreAltlas = $('#J_getmoreAltlas');
    var $J_downloadBarCloseBtn = $('#J_downloadBarCloseBtn');

    //环境
    var runtimeEnvironment = {
        isAndroid: navigator.userAgent.indexOf('Android ') > -1,
        isInTujia: window.navigator.userAgent.toLowerCase().indexOf('tujia') > -1 || window.location.href.indexOf('fromapp=true') > -1,
        isInWeixi: navigator.userAgent.toLowerCase().match(/micromessenger/i) == "micromessenger"
    };


    var bugger = function(msg) {
        var $J_debbuger = $('#J_debbuger');

        if ($J_debbuger.length) {
            $J_debbuger.html(msg);
        } else {
            $(body).append('<div id="J_debbuger" style="position: fixed; top:0; left:0; z-index:99999999; lett;width:100%; min-width:100%;word-break: break-all;min-height:200px;text-align: left;background-color:#f00; color:#FFF; font-size:14px;">' + msg + '</div>');
        }
    };

    //工具函数
    var unit = {
        getId: function() {

            var search = location.search.length > 0 ? location.search.substring(1) : '',
                args = {},
                items = search.split("&"),
                len = items.length,
                name = null,
                value = null,
                item = '';
            for (var i = 0; i < len; i++) {
                item = items[i].split("=");
                name = decodeURIComponent(item[0]);
                value = decodeURIComponent(item[1]);
                if (name == 'id') {
                    return value;
                }
            }

            return false;
        },
        isSupportwebp: (function() {
            try {
                return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0);
            } catch (err) {
                return false;
            }

        })(),

        timePast: function(time) {
            var past = +new Date - parseInt(time);
            var day = parseInt(past / 1000 / 60 / 60 / 24);
            var hour = parseInt(past / 1000 / 60 / 60);
            var minutus = parseInt(past / 1000 / 60);

            // console.info('day=', parseInt(past / 1000 / 60 / 60 / 24));

            if (day >= 1) {
                return day + '天前';
            } else if (hour >= 1) {
                return hour + '小时前';
            } else if (minutus >= 1) {
                return minutus + '分钟前';
            } else {
                return '刚刚';
            }
        },

        setTitle: function(title) {
            document.title = title;
            //如果是IOS端微信,无法直接修改title,需要下面这一段神代码.
            if (runtimeEnvironment.isAndroid || runtimeEnvironment.isInTujia) {
                return;
            }

            var $body = $('body');
            var $iframe = $('<iframe src="../../images/tujia_app_icon.png" style="display:none;"></iframe>');
            $iframe.on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo($body);
        },

        isHigIOS6: (function() {
            var userAgent = window.navigator.userAgent;
            var ios = userAgent.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/);
            return ios && ios[2] && (parseInt(ios[2].replace(/_/g, '.'), 10) >= 6);
        })(),

        getTime: function(creationTime) {

            var date = new Date(creationTime || +new Date());

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            month = month > 9 ? month : '0' + month;
            day = day > 9 ? day : '0' + day;
            return year + '-' + month + '-' + day;
        },

        supportWebp: function() {
            var normal = '-mobile';
            var webp = '-mobilewebp';
            var prev_img = '-mobile';
            try {
                prev_img = this.isSupportwebp ? webp : normal;
            } catch (e) {
                prev_img = '-mobile';
            }

            return prev_img;
        },

        sendApi: function(type, url, data, callback, errorback) {
            $.ajax({
                type: type,
                url: url,
                data: data,
                dataType: 'json',
                success: function(rsp) {

                    if (typeof rsp === 'string') {
                        try {
                            rsp = JSON.parse(rsp);
                        } catch (e) {
                            console.log('erro');
                        }
                    }

                    if (!!rsp) {
                        callback(rsp);
                    } else {
                        console.log(rsp);
                    }
                },
                error: function() {
                    errorback();
                    console.log('服务器出错')
                }
            });
        }
    };

    //用到的链接
    var url_links = {
        normalsuf: '/format/jpg/interlace/1|imageMogr2/auto-orient/strip/quality/60',
        nomorlImg: 'http://shangjia.tujiamedia.com/o_1b6tb8cjjb3b1m249j2vnf1l7jn.png',
        webpsuf: '/format/jpg/interlace/1|imageMogr2/auto-orient/strip/quality/60/format/webp',
        webError: window.location.protocol + '//' + window.location.host + '/refash.html',
        url_notfind: window.location.protocol + '//' + window.location.host + '/twnotfond.html'
    };

    url_links.suffix = unit.isSupportwebp ? url_links.webpsuf : url_links.normalsuf;

    //主类
    var index = {

        init: function() {
            this.getModle();
        },
        getModle: function() {

            var $this = this;
            var id = unit.getId();

            if (!id) {
                $J_notwaltlas.removeClass('hide');
                unit.setTitle('图文未找到');
            }

            twscopeid = id;

            var url = '/graphicDetails';

            var data = {
                'id': id
            };

            var callback = function(data) {

                if (data.status) {
                    listdata = data;
                    $this.renderHtml(data);
                    $J_waper.removeClass('hide');
                    $this.addEvent();
                } else {
                    $J_notwaltlas.removeClass('hide');
                    unit.setTitle('图文未找到');
                }
            };

            var errorback = function() {
                window.location.href = url_links.webError + '?url=' + encodeURIComponent(window.location.href);
            };

            unit.sendApi('post', url, data, callback, errorback);
        },
        //图文列表
        getTuwenlist: function(ownerId, scopeId) {

            if (runtimeEnvironment.isInTujia) {
                return;
            }

            var $this = this;

            if (tuwenlist) {
                $this.renderTuwenList(tuwenlist, scopeId, ownerId);
                return;
            }

            var url = '/getSuperAltlas';
            var data = {
                'userid': ownerId,
                'isbackjsion': true
            }

            var callback = function(data) {
                tuwenlist = data.data;
                $this.renderTuwenList(tuwenlist, scopeId, ownerId);
            };

            var errorback = function() {
                $J_findmore.html('网络异常，稍后重试!').removeClass('hide');
                $J_altTitle.removeClass('hide');
            };

            unit.sendApi('post', url, data, callback, errorback);
        },
        renderTuwenList: function(data, scopeId, ownerId) {
            var tuwenList = '',
                renderDate_length = 0,
                length = data && (data.length > 4 ? 4 : data.length),
                item = {},
                renderDate = [];

            if (length > 0) {
                for (var j = 0; j < length; j++) {
                    if (Number(data[j].id) != Number(scopeId) && (renderDate.length < 3)) {
                        renderDate.push(data[j]);
                    }

                }

                renderDate_length = renderDate.length;
            }

            for (var i = 0; i < renderDate_length; i++) {

                item = renderDate[i];
                item.description = item.description || '';
                tuwenList += '<li class="list-item">' +
                    '<a class="link-details" href="http://event.tujiaapp.com/custom-link.html?id=' + item.id + '" target="_blank">' +
                    '<img class="tuwen-img" src="' + item.coverImage + '?imageView2/1/w/210/h/160" alt="' + item.caption + '}}"/>' +
                    '<section class="tuwen-details">' +
                    '<h2 class="tuwen-name line-clamp">' + item.caption + '</h2>' +
                    '<p class="tuwen-describer text-overflow-hidden">' + item.description + '</p>' +
                    '<p class="tuwen-stats">' +
                    '<span class="tupian-viewCount">' + item.stats.viewCount + '</span>' +
                    '</p>' +
                    '</section>' +
                    '</a>' +
                    '</li>';
            }

            renderDate_length > 0 ? $J_tuwenList.html(tuwenList).removeClass('hide') : $J_findmore.removeClass('hide');
            $J_altTitle.removeClass('hide');
            $J_altlas.removeClass('hide');
            $J_getmoreAltlas.find('a').attr('href', 'http://event.tujiaapp.com/usercentertpl?userid=' + ownerId);
            $J_getmoreAltlas.removeClass('hide');

        },

        getContent: function(data, itemClass, templateid) {

            // var supportWebp = unit.supportWebp();

            var prefix = '';
            var imgindex = 0;

            var getItemHtml = function(item, index) {

                var text = item.text;
                var description = '';
                var urlDescription = '';
                var urlDescriptionstyle = '';
                var img_url = item.retina && item.retina.url && item.retina.url.split('?')[0];

                if (text) {

                    var style = '';
                    var font = text.font;

                    var fontsize = '';
                    var weightstyle = 'font-weight:normal;';
                    var colorstyle = 'color:#333';
                    var urlDespadding = ';padding-top: 0;'
                    var textdescrip = text.text;

                    if (font) {
                        fontsize = font.size == 2 ? 'bigfont' : '';
                        weightstyle = font.weight == 'bold' ? 'font-weight:bold;' : 'font-weight:normal;';
                        colorstyle = font.color ? ('color:' + font.color) : 'color:#333';
                    }

                    style = weightstyle + colorstyle + ';text-align:' + (text.textAlignment || 'left');

                    urlDescriptionstyle = style;

                    textdescrip = textdescrip ? textdescrip.replace(/\n/g, '</br>') : '';
                    // textdescrip = textdescrip ? textdescrip.replace(/^\s*/, '&nbsp&nbsp') : '';

                    if (textdescrip) {
                        style += ';padding-bottom: 1.19467rem ;border-radius: 0 0 .256rem .256rem';
                    } else {
                        text.url && (urlDescriptionstyle += ';padding-bottom: .64rem;border-radius: 0 0 .256rem .256rem');
                    }

                    if (!img_url && Number(templateid) == 134) {

                        if (textdescrip && !text.url) {
                            style += ';border-radius: .256rem;';
                        }

                        if (!textdescrip && text.url) {
                            urlDescriptionstyle += ';border-radius: .256rem;';
                        }
                    }

                    description = textdescrip ? '<div class="description tw-wordscontent ' + fontsize + '" style="' + style + '">' + textdescrip + '</div>' : '';
                    urlDescription = text.url ? ('<a class="urlDescription tw-links ' + fontsize + '" href="' + text.url + '" style="' + urlDescriptionstyle + '"><i></i>' + (text.urlDescription || '网页链接') + '</a>') : '';
                }

                var imgHtml = '',
                    url_img = '',
                    id = Number(item.id);

                if (img_url) {
                    var style_img = '';
                    var width = item.retina && item.retina.width;
                    var height = item.retina && item.retina.height;

                    if (!!Number(width) && !!Number(height) && typeof Number(width) == 'number' && typeof Number(height) == 'number') {

                        if (templateid == 134) {
                            height = (710 * height / width) / 46.875;
                            width = '15.146666666666667';
                        } else {
                            height = (730 * height / width) / 46.875;
                            width = '15.573333333333334';
                        }

                        style_img = 'width:' + width + 'rem;' + 'height:' + height + 'rem;';

                        prefix = '?imageView2/2/w/750/h/' + Math.round(750 * height / width) + url_links.suffix;
                    }

                    if (img_url.indexOf('.gif') > -1) {
                        url_img = img_url;
                    } else {
                        url_img = img_url + prefix;
                    }


                    if (!description && !urlDescription) {
                        style_img += ';border-radius: .256rem;';
                        if (Number(templateid) == 130) {
                            style_img += 'margin-bottom: .42667rem;';
                        }
                    }

                    if (imgindex == 0) {
                        imgHtml = '<img data-index="' + imgindex++ + '" class="J_wximg wximg tw-piccontent" src="' + url_img + '" style="' + style_img + '" alt="图片丢失了"/>';
                    } else {
                        imgHtml = '<img data-index="' + imgindex++ + '" class="J_wximg wximg tw-piccontent lazyload" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXu7evYDnYhAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==" data-src="' + url_img + '" style="' + style_img + '" alt="图片丢失了"/>';
                    }
                };

                var itemHtml = '<li class="tuwen-item">' + imgHtml + urlDescription + description + '</li>';
                return itemHtml;
            };

            var html = '',
                item = {},
                len = data && data.length;

            for (var i = 0; i < len; i++) {
                item = data[i];
                html += getItemHtml(item, i);
            }

            return html;
        },

        renderHtml: function(data, appid) {

            var $this = this;
            var scope = data && data.scope;
            var datalist = data && data.data;
            var id = appid || scope && scope.template && scope.template.id || 130;

            scopename = scope.caption;
            // !!data.scope.template?data.scope.template.id = id:data.scope.template={'id':id};
            var renderOthersHtml = function(classNmae, img_url, id) {
                $J_shareTitle = $('#J_shareTitle');
                unit.setTitle(scope.caption);
                runtimeEnvironment.isInTujia&&(classNmae += ' intujia');
                $J_body.removeClass().addClass(classNmae);

                if (img_url) {
                    if(Number(id) == 136){
                        $J_bg.css('background-image', 'url(' + img_url + ')');
                        $J_background.removeClass('hide');
                    }else{
                        $J_background.addClass('hide');
                        $J_shareTitle.css('background-image', 'url(' + img_url + ')');
                    }
                }else{
                    $J_background.addClass('hide');
                }
            };

            var renderHeaderHtml = function(headerHtml, topdown) {

                if (!runtimeEnvironment.isInTujia) {
                    var show = window.localStorage.hideBslinkBarTime;
                    if (show && Number(show) > +new Date()) {
                        $J_downloadbtn.addClass('hide');
                        topdown && $J_headerwapper.removeClass(topdown);

                    } else {
                        $J_downloadbtn.removeClass('hide');
                        if(topdown){
                            $J_headerwapper.addClass(topdown)
                        }
                    }
                }

                $J_headerwapper.html(headerHtml);
            };

            var renderMainHtml = function(contenthtml) {
                $J_Twlist.html(contenthtml);
                $J_footer.removeClass('hide');
                $J_pointComment.removeClass('hide');
                $J_waper.removeClass('hide');
            };

            //渲染尾部
            //参数一 是否显示预览和点赞栏目
            //参数二 预览和点赞的内容
            //参数三 预览和点赞栏目左边距
            //参数四 设置预览和点赞栏目字体的颜色
            //参数五 设置预览和点赞栏目，黑底图标
            //参数六 设置预览和点赞栏目，白底图标
            //参数七 设置预览和点赞栏目，文字样色
            var renderfooterHtml = function(data, id) {

                if (runtimeEnvironment.isInTujia) {
                    $J_footerword.html('喜欢就点赞或分享吧');
                    // if (Number(id) == 134) {
                    //  $J_footer.css('border-radius', '0 0 .256rem .256rem');
                    // }
                } else {

                    $J_view.css({
                        'padding-left': data[2],
                        'padding-right': data[2]
                    });

                    $J_view.removeClass('hide');
                    $J_dllink.removeClass('hide');
                    $J_download.removeClass('hide');
                }
            };

            var renderComments = function(data, id) {
                var recentComments = data && data.stats && data.stats.recentComments;
                var recentComments_length = (recentComments && recentComments.length) || 0;
                statsLikeCount = data && data.stats && data.stats.heartCount;

                likedUsers = data && data.likedUsers || [];
                var likedUsers_length = (likedUsers && likedUsers.length) || 0;

                $J_navtwo.text('点赞 ' + statsLikeCount).data('number', statsLikeCount);

                var renderCommentslist = function(comments) {

                    var replaytime = 0;
                    var userinfor = '';
                    var itemcomment = '';
                    var commentsitem = {};
                    var length = (comments && comments.length) || 0;

                    !runtimeEnvironment.isInTujia && (length > 3) && (length = 3);

                    if (length <= 0) {
                        itemcomment = '<li class="J_commentempty comment-item-empty">暂无评论!</li>';
                    } else {

                        for (var i = 0; i < length; i++) {

                            commentsitem = comments[i];
                            if (!commentsitem) {
                                continue;
                            }
                            userinfor = commentsitem && (JSON.stringify(commentsitem));
                            replaytime = unit.timePast(commentsitem.commentTime || 0);
                            itemcomment += "<li class='J_commentItem comment-item' data-id='" + (commentsitem.user && commentsitem.user.id) + "' data-user='" + userinfor + "'>" +
                                "<img data-id='" + (commentsitem.user && commentsitem.user.id) + "' class='header-icom' src='" + ((commentsitem.user && commentsitem.user.avatar) || url_links.nomorlImg) + "' alt='头像' onerror=\"this.src='" + url_links.nomorlImg + "'\"/>" +
                                "<div class='comment-person'>" +
                                "<h1 class='comment-name'>" + (commentsitem && commentsitem.user && commentsitem.user.name || "游客") + "</h1>" +
                                "<p class='comment-time'>" + replaytime + "</p>" +
                                "</div>";

                            if (commentsitem.replyToUser) {
                                itemcomment += "<section class='comment-content'><span style='color:#ff634c;'>" + (commentsitem.user && commentsitem.user.name || "游客") + "</span>回复了<span style='color:#ff634c;'>" + (commentsitem.replyToUser && commentsitem.replyToUser.name || "游客") + "</span>:" + (commentsitem.text || "") + "</section></li>";
                            } else {
                                itemcomment += "<section class='comment-content'>" + (commentsitem.text || "") + "</section></li>";
                            }
                        }
                    }

                    $J_comlist.html(itemcomment);
                };

                if (recentComments_length < 3) {
                    $J_navone.text('评论 ' + recentComments_length);
                    dataComments = recentComments || [];
                    renderCommentslist(dataComments);
                    $J_dllinkmore.html('有沙发，快来评论吧');
                    !runtimeEnvironment.isInTujia && $J_downloadmore.removeClass('hide');
                } else {

                    var url = '/getComments';

                    var body = {
                        'id': data.id,
                        'page': 0
                    };

                    var callback = function(resdata) {
                        var length = resdata && resdata.data && resdata.data.length || 0;
                        $J_navone.text('评论 ' + length);
                        dataComments = resdata.data || [];
                        renderCommentslist(dataComments);
                        !runtimeEnvironment.isInTujia && $J_downloadmore.removeClass('hide');
                    };

                    var errorback = function() {};

                    unit.sendApi('post', url, body, callback, errorback);
                }

                var renderUsersliked = function() {

                    var likedUsersHtml = '';

                    if (likedUsers_length <= 0) {
                        likedUsersHtml = '<li class="J_commentempty comment-item-empty">暂无点赞</li>';
                    } else {
                        if (!runtimeEnvironment.isInTujia) {
                            likedUsers_length = (likedUsers_length >= 3) ? 3 : likedUsers_length;
                        }
                        var likedUsersitem = {};
                        for (var j = 0; j < likedUsers_length; j++) {
                            likedUsersitem = likedUsers[j];
                            likedUsersHtml += '<li class="comment-item" data-id="' + (likedUsersitem.id) + '">' +
                                '<img data-id="' + (likedUsersitem.id) + '" class="J_likedUsersicom  header-icom" src="' + (likedUsersitem.avatar || url_links.nomorlImg) + '" alt="头像" onerror="this.src=\'' + url_links.nomorlImg + '\'"/>' +
                                '<p class="username-likeusers">' + (likedUsersitem.name || '游客') + '</p>' +
                                '</li>';
                        }
                    }

                    $J_likeusers.html(likedUsersHtml);
                };

                renderUsersliked();
            };

            var bgdClass = 'standard-background';

            //头部参数
            var topdown = '';
            var headerHtml = '';
            var viewCount = (scope.stats && scope.stats.viewCount) || 1;
            var time = unit.getTime(scope.creationTime);
            var name = scope.owner ? scope.owner.name : '路人';

            //主体参数
            var itemClass = [];

            //尾部参数
            // var countHtml = '';
            var footerHtml = [];
            var showCount = false;
            var stats = scope.stats;

            var avatar = !!scope.owner.avatar ? scope.owner.avatar : url_links.nomorlImg;

            if (!!stats) {
                showCount = (stats.viewCount <= 0) ? false : true;
                var heartCount = showCount ? ('<span>阅读 ' + stats.viewCount + '</span>') : '';
            }

            var coverImage = scope.coverImage;

            switch (Number(id)) {
                case 130:

                    bgdClass = 'standard-background';

                    //头部参数
                    topdown = ' top-down ';
                    coverImage = '';

                    headerHtml = '<div class="standard">' +
                        '<h1  class="J_shareTitle scope-title">' + scope.caption + '</h1>' +
                        '<p class="tag">' +
                        '<span class="tag-time">' + time + '</span>' +
                        '<a class="J_userName tag-name" href="http://event.tujiaapp.com/usercentertpl?userid=' + scope.owner.id + '" id="' + scope.owner.id + '" target="_blank">' + name + '</a>' +
                        '<span>阅读 <i class="viewCount">' + viewCount + '</i></span>' +
                        '</p>' +
                        '</div>';

                    //主体参数
                    itemClass.push('standard-item');

                    //尾部参数
                    footerHtml = [showCount, heartCount, '.64rem'];

                    break;
                case 133:
                    bgdClass = 'wapper-background fashion-background';

                    //头部参数
                    topdown = '';

                    coverImage += '?imageMogr2/auto-orient/strip/interlace';

                    headerHtml = '<header id="J_header" class="tw-header">' +
                        '<h1 id="J_shareTitle" class="tw_title">' + scope.caption + '</h1>' +
                        '<section class="tw-desinfor">' +
                        '<a class="J_userName go-centerlink" href="http://event.tujiaapp.com/usercentertpl?userid=' + scope.owner.id + '" id="' + scope.owner.id + '" target="_blank"><img class="user-icon" src="' + avatar + '" onerror="this.src=\'' + url_links.nomorlImg + '\'" alt="头像"></a>' +
                        '<a class="J_userName gobyusername-centerlink" href="http://event.tujiaapp.com/usercentertpl?userid=' + scope.owner.id + '" id="' + scope.owner.id + '" target="_blank"><h2 class="user-name">' + name + '</h2></a>' +
                        '<p class="time-view"><span>' + time + '</span><span class="dotted">,</span><span>' + viewCount + '浏览量</span></p>' +
                        '</section>' +
                        '</header>';

                    //主体参数
                    itemClass.push('fashion-item');

                    //尾部参数
                    footerHtml = [showCount, heartCount, '.64rem'];

                    break;
                case 134:
                    bgdClass = 'wapper-background nature-background';

                    //头部参数
                    topdown = '';
    
                    coverImage += '?imageMogr2/auto-orient/strip/interlace';
                    headerHtml = '<header id="J_header" class="tw-header">' +
                        '<h1 id="J_shareTitle" class="tw_title">' + scope.caption + '</h1>' +
                        '<section class="tw-desinfor">' +
                        '<a class="J_userName go-centerlink" href="http://event.tujiaapp.com/usercentertpl?userid=' + scope.owner.id + '" id="' + scope.owner.id + '" target="_blank"><img class="user-icon" src="' + avatar + '" onerror="this.src=\'' + url_links.nomorlImg + '\'" alt="头像"></a>' +
                        '<a class="J_userName gobyusername-centerlink" href="http://event.tujiaapp.com/usercentertpl?userid=' + scope.owner.id + '" id="' + scope.owner.id + '" target="_blank"><h2 class="user-name">' + name + '</h2></a>' +
                        '<p class="time-view"><span>' + time + '</span><span class="dotted">,</span><span>' + viewCount + '浏览量</span></p>' +
                        '</section>' +
                        '</header>';

                    //主体参数
                    itemClass = ['nature-item', 'nature-img'];

                    //尾部参数
                    footerHtml = [showCount, heartCount, '1.152rem'];
                    break;
                case 135:
                    bgdClass = 'wapper-background professionalism-item';

                    coverImage += '?imageMogr2/auto-orient/strip/interlace';

                    //头部参数
                    topdown = '';
                    headerHtml = '<header id="J_header" class="tw-header">' +
                        '<h1 id="J_shareTitle" class="tw_title">' + scope.caption + '</h1>' +
                        '<section class="tw-desinfor">' +
                        '<a class="J_userName go-centerlink" href="http://event.tujiaapp.com/usercentertpl?userid=' + scope.owner.id + '" id="' + scope.owner.id + '" target="_blank"><img class="user-icon" src="' + avatar + '" onerror="this.src=\'' + url_links.nomorlImg + '\'" alt="头像"></a>' +
                        '<a class="J_userName gobyusername-centerlink" href="http://event.tujiaapp.com/usercentertpl?userid=' + scope.owner.id + '" id="' + scope.owner.id + '" target="_blank"><h2 class="user-name">' + name + '</h2></a>' +
                        '<p class="time-view"><span>' + time + '</span><span class="dotted">,</span><span>' + viewCount + '浏览量</span></p>' +
                        '</section>' +
                        '</header>';
                    //主体参数
                    itemClass.push('professionalism-item');

                    //尾部参数
                    footerHtml = [showCount, heartCount, '.64rem'];
                    break;
                case 136:

                    bgdClass = 'haziest-background';
                    //头部参数
                    topdown = ' top-down ';

                    var bgthml = '<div class="haziestabg"></div>';

                    if (!(coverImage.indexOf('imageMogr2/auto-orient/blur/20x20') > -1)) {
                        coverImage = coverImage + '?imageMogr2/auto-orient/blur/20x20';
                    }

                    headerHtml = '<div class="haziest">' +
                        '<div class="tag">' +
                        '<span>' + time + '</span>' +
                        '<a class="J_userName tag-name" href="http://event.tujiaapp.com/usercentertpl?userid=' + scope.owner.id + '" id="' + scope.owner.id + '" target="_blank">' + name + '</a>' +
                        '<span>阅读 <i class="viewCount">' + viewCount + '</i></span>' +
                        '</div>' +
                        '<div class="user-icon">' +
                        '<a class="J_userName" href="http://event.tujiaapp.com/usercentertpl?userid=' + scope.owner.id + '" id="' + scope.owner.id + '" target="_blank"><img src="' + avatar + '" onerror="this.src=\'' + url_links.nomorlImg + '\'"/></a>' +
                        '</div>' +
                        '<h1 class="J_shareTitle scope-title">' + scope.caption + '</h1>' +
                        '<div class="user-name">' + name + '</div>' +
                        '</div>';

                    //主体参数
                    itemClass.push('haziest-item');

                    //尾部参数
                    footerHtml = [showCount, heartCount, '.64rem'];
                    break;
                default:
            }

            renderHeaderHtml(headerHtml, topdown);
            renderOthersHtml(bgdClass, coverImage, id);
            var mainHtml = $this.getContent(datalist, itemClass, id);
            renderMainHtml(mainHtml);
            renderfooterHtml(footerHtml, id);
            renderComments(scope, id);
            $this.getTuwenlist(data.scope.owner.id, data.scope.id);
            // $this.openOrDownLoad();
            $this.gotoUserCenter(scope.owner.id);
            var coverBanner = scope.coverBanner || scope.coverImage || datalist[0] && datalist[0].retina && datalist[0].retina.url;
            $this.shareWx(scope.caption, coverBanner);
        },

        gotoUserCenter: function(id) {
            var $this = this;

            if (!runtimeEnvironment.isInTujia) {
                return;
            }

            $('.J_userName').off('touchstart').on('touchstart', function(event) {
                event.preventDefault();
                id = $(this).data('id') || id;
                runtimeEnvironment.isAndroid ? scope.goUserPage(id) : window.webkit.messageHandlers.getUserID.postMessage(id);
            });
        },
        shareWx: function(share_title, shrare_imgUrl) {

            var $this = this;

            var localId = [];

            var $J_wximg = $('.J_wximg');
            var suf = '?imageMogr2/auto-orient/strip/quality/60';
            var sufwebp = '?imageMogr2/auto-orient/strip/quality/60/format/webp';

            $J_wximg.each(function() {
                var $this = $(this);
                var url_src = $this.attr('data-src') && $this.attr('data-src').split('?')[0] || $this.attr('src') && $this.attr('src').split('?')[0];
                !(url_src.indexOf('.gif') > -1)&&(url_src = unit.isSupportwebp ? url_src + sufwebp : url_src + suf);

                localId.push(url_src);
            });

            var images = {
                localId: localId
            };

            if (runtimeEnvironment.isInWeixi) {

                setTimeout(function() {
                    var wxShare = function() {
                        shrare_imgUrl = shrare_imgUrl ? shrare_imgUrl.split('?')[0] + '?imageView2/1/w/120/h/120' : '';
                        wx.ready(function() {

                            share_title = share_title || '';
                            shrare_imgUrl = shrare_imgUrl || 'http://event.tujiaapp.com/images/tujia_app_icon.png';

                            var share_link = window.location.href;
                            var share_desc = '娱乐图片我最快';

                            wx.onMenuShareTimeline({
                                title: share_title,
                                link: share_link,
                                imgUrl: shrare_imgUrl,
                                trigger: function(res) {
                                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                                    console.log('用户点击分享到朋友圈');
                                },
                                success: function(res) {
                                    console.log('已分享');
                                },
                                cancel: function(res) {
                                    console.log('已取消');
                                },
                                fail: function(res) {}
                            });

                            wx.onMenuShareAppMessage({
                                title: share_title, // 分享标题
                                desc: share_desc, // data.username + '获得2016里约奥运会' + gold + '冠军', // 分享描述
                                link: share_link, // 分享链接
                                imgUrl: shrare_imgUrl, // 分享图标
                                type: 'link', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                    console.log('分享成功');
                                },
                                cancel: function() {
                                    // 用户取消分享后执行的回调函数
                                    console.log('分享成功')
                                }
                            });

                            wx.onMenuShareQQ({
                                title: share_title, // 分享标题
                                desc: share_desc, // 分享描述
                                link: share_link, // 分享链接
                                imgUrl: shrare_imgUrl, // 分享图标
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                },
                                cancel: function() {
                                    // 用户取消分享后执行的回调函数
                                }
                            });

                            wx.onMenuShareQZone({
                                title: share_title, // 分享标题
                                desc: share_desc, // 分享描述
                                link: share_link, // 分享链接
                                imgUrl: shrare_imgUrl, // 分享图标
                                success: function() {
                                    // 用户确认分享后执行的回调函数
                                },
                                cancel: function() {
                                    // 用户取消分享后执行的回调函数
                                }
                            });

                            $J_Twlist.on('click', '.J_wximg', function(indexs) {

                                var index = parseInt($(this).attr('data-index')) || 0;

                                try {
                                    wx.previewImage({
                                        current: images.localId[index],
                                        urls: images.localId
                                    });
                                } catch (e) {
                                    console.log('error');
                                }
                            });
                        });

                        wx.error(function(res) {
                            console.log('erroe');
                        });
                    };

                    var url = '/wxshare';

                    var data = {
                        'url': window.location.href
                    };

                    var callback = function(data) {
                        wx.config({
                            debug: false,
                            appId: data.appId,
                            timestamp: data.timestamp,
                            nonceStr: data.nonceStr,
                            signature: data.signature,
                            jsApiList: [
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareQZone',
                                'previewImage'
                            ]
                        });

                        wxShare();
                    };

                    var errorback = function() {

                    };

                    unit.sendApi('post', url, data, callback, errorback);
                }, 1200);
            } else {

                $J_Twlist.on('click', '.J_wximg', function(indexs, whitch) {
                    var index = parseInt($(this).attr('data-index')) || 0;
                    ImageView.init(null, images.localId, index, {});
                })
            }
        },
        addEvent: function() {

            var $this = this;

            $J_contentheader.off().on('click', '.J_navitem', function() {

                var item = $(this);

                if (parseInt(item.index()) == 0) {
                    $J_comlist.removeClass('hide');
                    $J_likeusers.addClass('hide');
                    (dataComments.length <= 3) && ($J_dllinkmore.html('有沙发，快来评论吧')) || ($J_dllinkmore.html('打开图加,查看更多评论'));
                } else {
                    $J_comlist.addClass('hide');
                    $J_likeusers.removeClass('hide');
                    (dataComments.length <= 3) && ($J_dllinkmore.html('有沙发，快来点赞吧')) || ($J_dllinkmore.html('打开图加,查看更多点赞'));
                }

                item.addClass('current-nav').siblings('.J_navitem').removeClass('current-nav');
            });

            if (runtimeEnvironment.isInTujia) {

                $J_comlist.off().on('click', '.J_commentItem', function(e) {

                    var id = 0;
                    var user = {};

                    if (e.target.tagName.toLocaleLowerCase() === 'img') {
                        id = $(this).data('id');
                        runtimeEnvironment.isAndroid ? scope.goUserPage(id) : window.webkit.messageHandlers.getUserID.postMessage(id);
                    } else {
                        user = $(this).data('user');
                        delete user.commentTime;
                        user = runtimeEnvironment.isAndroid && (JSON.stringify(user)) || user;
                        runtimeEnvironment.isAndroid ? scope.getCommentDic(user) : window.webkit.messageHandlers.getCommentDic.postMessage(user);
                        indexlikecoment = $(this);
                    }
                });

                $J_likeusers.on('click', '.J_likedUsersicom', function(e) {
                    var id = $(this).data('id');
                    runtimeEnvironment.isAndroid ? scope.goUserPage(id) : window.webkit.messageHandlers.getUserID.postMessage(id);
                });

            } else {

                $J_complaint.off().on('click', function() {

                    var url = '/addwarn';

                    var data = {
                        'scopeid': twscopeid,
                        'scopename': scopename
                    }

                    var callback = function(data) {
                        if (data.status === 'success') {
                            $J_dialog.find('h1').text('举报成功!');
                        } else {
                            $J_dialog.find('h1').text('网络异常，稍后再试!');
                        }
                    };

                    var errorback = function() {
                        $J_dialog.find('h1').text('网络异常，稍后再试!');
                    };

                    $J_dialog.removeClass('hide').find('h1').text('举报中...');

                    unit.sendApi('post', url, data, callback, errorback);
                });
            }

            $J_click.on('click', function(e) {
                $J_dialog.addClass('hide');
            });


            var type = runtimeEnvironment.isAndroid ? 'scroll' : 'touchmove';
            var nav = document.querySelector('#J_contentheader');
            var navOffsetY = nav.offsetTop;

            unit.isHigIOS6 && nav.classList.add('sticky');

            var scoll = false;

            if (!runtimeEnvironment.isInTujia) {

                var beforeScrollTop = -1;
                var afterScrollTop = 0;
                var show = window.localStorage.hideBslinkBarTime;

                if (show && Number(show) > +new Date()) {
                    scoll = true;
                } else {

                    scoll = false;
                    $J_downloadBarCloseBtn.on('click', function() {
                        window.localStorage.hideBslinkBarTime = +new Date() + 7 * 60 * 60 * 1000;
                        $J_downloadbtn.remove();
                        $J_headerwapper.removeClass('top-down');
                    });

                    $J_dialog[0].addEventListener('touchmove', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }, true);
                }
            }

            var onScroll = function(event) {

                if (!unit.isHigIOS6) {
                    if (window.scrollY >= navOffsetY) {
                        nav.classList.add('fixed');
                    } else {
                        nav.classList.remove('fixed');
                    }
                }

                if (!runtimeEnvironment.isInTujia && !scoll) {

                    afterScrollTop = document.body.scrollTop;
                    derection = afterScrollTop - beforeScrollTop;
                    beforeScrollTop = afterScrollTop;

                    //向下滑
                    if (derection < 0 || afterScrollTop < 60) {
                        $J_downloadbtn.removeClass('hide');
                        //向上滑
                    } else if (derection > 0) {
                        $J_downloadbtn.addClass('hide');
                    }
                }
            };

            document.addEventListener(type, onScroll, true);
        }
    };

    index.init();

    Array.prototype.del = function(dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        this.splice(dx, 1);
    }

    window.changeTemplateType = function(id) {
        index.renderHtml(listdata, id);
    };

    window.insertConment = function(data) {

        var length = dataComments.length;

        (length == 0) && $J_comlist.children('.J_commentempty').addClass('hide');

        for (var i = 0; i < length; i++) {

            if (dataComments[i] && (dataComments[i].id == data.id) && (dataComments[i].text == data.text)) {
                return;
            }
        }

        var userinfor = data && (JSON.stringify(data));

        var itemcomment = "<li class='J_commentItem comment-item' data-user='" + userinfor + "'>" +
            "<img data-id='" + (data.user && data.user.id) + "' class='header-icom' src='" + (data.user && data.user.avatar || url_links.nomorlImg) + "' alt='头像' onerror=\"this.src='" + url_links.nomorlImg + "'\"/>" +
            "<div class='comment-person'>" +
            "<h1 class='comment-name'>" + (data.user && data.user.name || "游客") + "</h1>" +
            "<p class='comment-time'>" + '刚刚' + "</p>" +
            "</div>";

        if (data.replyToUser) {
            itemcomment += "<section class='comment-content'><span style='color:#ff634c;'>" + (data.user && data.user.name || "游客") + "</span>回复了<span style='color:#ff634c;'>" + (data.replyToUser && data.replyToUser.name || "游客") + "</span>:" + (data && data.text || "") + "</section></li>";
        } else {
            itemcomment += "<section class='comment-content'>" + (data && data.text || "") + "</section></li>";
        }

        dataComments.unshift(data);
        $J_navone.text('评论 ' + (dataComments.length || 0));
        $J_comlist.prepend(itemcomment);
        $J_navone.click();
    };

    window.DeleteConment = function(data) {

        var length = dataComments.length;
        (length == 1) && $J_comlist.children('.J_commentempty').removeClass('hide');

        for (var i = 0; i < length; i++) {

            if (dataComments[i].id == data.id) {
                dataComments.del(i);
                indexlikecoment && indexlikecoment.remove();
                $J_navone.text('评论 ' + dataComments.length);
                $J_navone.click();
                return;
            }
        }
    };

    window.likeUser = function(data) {

        var length = likedUsers && likedUsers.length;

        (length == 0) && $J_likeusers.children('.J_commentempty').addClass('hide');

        for (var i = 0; i < length; i++) {
            if (likedUsers[i].id == data.id) {
                return;
            }
        }

        likedUsers.unshift(data);

        var likedUsersHtml = '<li class="comment-item">' +
            '<img data-id="' + (data.id) + '" class="J_likedUsersicom  header-icom" src="' + (data.avatar || url_links.nomorlImg) + '" alt="头像" onerror="this.src=\'' + url_links.nomorlImg + '\'"/>' +
            '<p class="username-likeusers">' + (data.name || '游客') + '</p>' +
            '</li>';
        $J_navtwo.text('点赞 ' + ++statsLikeCount);
        $J_likeusers.prepend(likedUsersHtml);
        $J_navtwo.click();
    };

    window.canselikeUser = function(data) {

        var index = 0;
        var length = likedUsers && likedUsers.length;
        (length == 1) && $J_likeusers.children('.J_commentempty').removeClass('hide');

        for (var i = 0; i < length; i++) {
            if (likedUsers[i].id == data.id) {
                index = i;
                likedUsers.del(i);
                $J_likeusers.children('li').eq(index).remove();
                --statsLikeCount;
                statsLikeCount = (statsLikeCount < 0) ? (statsLikeCount = 0) : statsLikeCount;
                $J_navtwo.text('点赞 ' + statsLikeCount);
                $J_navtwo.click();
                break;
            }
        }
    };

    window.scollerConments = function() {
        var top = $J_pointComment.offset().top;
        var winheight = $(window).height();
        if (top >= winheight) {
            $(window).scrollTop(top);
        }
    };
 
})();

setTimeout(function() {
    var userAgent = window.navigator.userAgent;
    var ua = userAgent.toLowerCase();
    var isAndroid = userAgent.match(/Android|Linux/);
    var isIOS = userAgent.match(/(iPhone|iPod|ios)/i);
    var isInMessage = ua.match(/micromessenger/i) == 'micromessenger';
    var id = function() {
        var reg = new RegExp("(^|&)id=([^&]*)(&|$)");
        var arr = window.location.search.substr(1).match(reg);
        if (arr) {
            return decodeURI(arr[2]);
        } else {
            return null;
        }
    }();

    document.getElementById('J_openApp').addEventListener('click', function() {

        if (isInMessage) {
            var img = isAndroid ? '../images/msg_tip_android.png' : '../images/msg_tip_ios.png';
            document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', '<div id="msg" style="background:#f3f6fc url(\' ' + img + ' \')  no-repeat center top;background-size:100%;position:fixed;left:0;right:0;top:0;bottom:0;z-index:9999;"></div>');
            document.getElementById('msg').addEventListener('click', function() {
                this.remove();
            });

        } else if (isAndroid) {

            window.location.href = 'myapp://tujiaapp.com/main?scope_type=MIXED&scope_id=' + id;
            setTimeout(function() {
                window.location.href = 'http://download.tujiaapp.com';
            }, 1000);
            setTimeout(function() {
                window.open('black:target', '_self');
            }, 2000);

        } else if (isIOS) {


            window.location.href = 'tujiaappopen://tujiaapp.com/main?scope_type=MIXED&scope_id=' + id;
            setTimeout(function() {
                window.location.href = 'itms-apps://download.tujiaapp.com';
            }, 3000);

            setTimeout(function() {
                window.location.reload(true);
            }, 4000);
        }
    });
},2000);