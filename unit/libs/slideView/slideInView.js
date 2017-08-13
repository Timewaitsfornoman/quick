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
					// 	var photo = this.photos[index];
					// 	if (photo && photo.videodata && photo.videodata.videourl) {
					// 		var btnHtml = '<button class="btn-video" data-hook="global-video" data-playvideo="' + photo.videodata.videourl + '">\u64ad\u653e\u89c6\u9891</button>';
					// 		li.append(btnHtml)
					// 	}
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