"use strict";

function _classCallCheck(t, e) {
	if(!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var _createClass = function() {
		function t(t, e) {
			for(var r = 0; r < e.length; r++) {
				var i = e[r];
				i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
			}
		}
		return function(e, r, i) {
			return r && t(e.prototype, r), i && t(e, i), e
		}
	}(),
	imageLoad = function() {
		return function() {
			function t(e) {
				_classCallCheck(this, t), e = e || {}, this.callBack = {}, this.progress = e.progress ? e.progress.bind(this) : function() {}, this.timeOut = e.timeOut || 15, this.timeOutCB = e.timeOutCB ? e.timeOutCB.bind(this) : function() {}, this.reset(), this.imgNode = [], this.loadTag()
			}
			return _createClass(t, [{
				key: "load",
				value: function(t) {
					var e = this,
						r = this;
					return new Promise(function(i, n) {
						e.isArrayFn(t) || n(new Error("It's not allow params")), t.length || n(new Error("It's not null")), r.reset(t.length), r.imgList = t, t.forEach(function(t) {
							var n = new Image,
								s = r._timeOut(t);
							n.src = t, n.onload = r.onload.bind(e, t, s, i), n.onerror = r.onerror.bind(e, t, s, i)
						})
					})
				}
			}, {
				key: "loadTag",
				value: function() {
					for(var t = this, e = document.getElementsByTagName("img"), r = 0, i = e.length; r < i; r++) ! function(r, i) {
						if(e[r].attributes["p-src"]) {
							var n = new Image,
								s = e[r].attributes["p-src"].value,
								a = t._timeOut(s);
							n.src = s, n.onload = function() {
								clearTimeout(a), e[r].src = s
							}
						}
					}(r)
				}
			}, {
				key: "_timeOut",
				value: function(t) {
					var e = this,
						r = setTimeout(function() {
							e.timeOutCB({
								name: t,
								msg: "load timer"
							}), clearTimeout(r)
						}, 1e3 * e.timeOut);
					return r
				}
			}, {
				key: "onload",
				value: function(t, e, r) {
					clearTimeout(e), this.success.data.push(t), this.progress(++this.flag, this.count), this.complate(r)
				}
			}, {
				key: "onerror",
				value: function(t, e, r) {
					clearTimeout(e), this.err.data.push(t), this.progress(++this.flag, this.count), this.complate(r)
				}
			}, {
				key: "complate",
				value: function(t) {
					this.flag >= this.count && t(this.success)
				}
			}, {
				key: "reset",
				value: function(t) {
					this.imgList = [], this.flag = 0, this.count = t, this.success = {
						code: 0,
						msg: "success",
						data: []
					}, this.err = {
						code: -1,
						msg: "load error",
						data: []
					}
				}
			}, {
				key: "isArrayFn",
				value: function(t) {
					return "function" == typeof Array.isArray ? Array.isArray(t) : "[object Array]" === Object.prototype.toString.call(t)
				}
			}]), t
		}()
	}();