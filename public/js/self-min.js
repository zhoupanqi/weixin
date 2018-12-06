

var YM = {
	qq: 254406344
};

function PxLoader(v) {
	v = v || {};
	if(v.statusInterval == null) {
		v.statusInterval = 5252729
	}
	if(v.loggingDelay == null) {
		v.loggingDelay = 20 * 1252729
	}
	if(v.noProgressTimeout == null) {
		v.noProgressTimeout = Infinity
	}
	var s = [],
		x = [],
		m, w = +new Date;
	var p = {
		QUEUED: 0,
		WAITING: 1,
		LOADED: 2,
		ERROR: 3,
		TIMEOUT: 4
	};
	var o = function(a) {
		if(a == null) {
			return []
		}
		if(Array.isArray(a)) {
			return a
		}
		return [a]
	};
	this.add = function(a) {
		a.tags = new PxLoaderTags(a.tags);
		if(a.priority == null) {
			a.priority = Infinity
		}
		s.push({
			resource: a,
			status: p.QUEUED
		})
	};
	this.addProgressListener = function(b, a) {
		x.push({
			callback: b,
			tags: new PxLoaderTags(a)
		})
	};
	this.addCompletionListener = function(b, a) {
		x.push({
			tags: new PxLoaderTags(a),
			callback: function(c) {
				if(c.completedCount === c.totalCount) {
					b()
				}
			}
		})
	};
	var q = function(a) {
		a = o(a);
		var b = function(d) {
			var c = d.resource,
				e = Infinity;
			for(var f = 0; f < c.tags.length; f++) {
				for(var g = 0; g < Math.min(a.length, e); g++) {
					if(c.tags[f] == a[g] && g < e) {
						e = g;
						if(e === 0) {
							break
						}
					}
					if(e === 0) {
						break
					}
				}
			}
			return e
		};
		return function(e, f) {
			var c = b(e),
				d = b(f);
			if(c < d) {
				return -1
			}
			if(c > d) {
				return 1
			}
			if(e.priority < f.priority) {
				return -1
			}
			if(e.priority > f.priority) {
				return 1
			}
			return 0
		}
	};
	this.start = function(e) {
		m = +new Date;
		var d = q(e);
		s.sort(d);
		for(var c = 0, a = s.length; c < a; c++) {
			var b = s[c];
			b.status = p.WAITING;
			b.resource.start(this)
		}
		setTimeout(u, 100)
	};
	var u = function() {
		var d = false,
			c = (+new Date) - w,
			g = (c >= v.noProgressTimeout),
			f = (c >= v.loggingDelay);
		for(var e = 0, a = s.length; e < a; e++) {
			var b = s[e];
			if(b.status !== p.WAITING) {
				continue
			}
			if(b.resource.checkStatus) {
				b.resource.checkStatus()
			}
			if(b.status === p.WAITING) {
				if(g) {
					b.resource.onTimeout()
				} else {
					d = true
				}
			}
		}
		if(f && d) {
			t()
		}
		if(d) {
			setTimeout(u, v.statusInterval)
		}
	};
	this.isBusy = function() {
		for(var b = 0, a = s.length; b < a; b++) {
			if(s[b].status === p.QUEUED || s[b].status === p.WAITING) {
				return true
			}
		}
		return false
	};
	var n = function(d, g) {
		var h = null;
		for(var c = 0, i = s.length; c < i; c++) {
			if(s[c].resource === d) {
				h = s[c];
				break
			}
		}
		if(h == null || h.status !== p.WAITING) {
			return
		}
		h.status = g;
		w = +new Date;
		var f = d.tags.length;
		for(var c = 0, a = x.length; c < a; c++) {
			var e = x[c],
				b;
			if(e.tags.length === 0) {
				b = true
			} else {
				b = d.tags.contains(e.tags)
			}
			if(b) {
				r(h, e)
			}
		}
	};
	this.onLoad = function(a) {
		n(a, p.LOADED)
	};
	this.onError = function(a) {
		n(a, p.ERROR)
	};
	this.onTimeout = function(a) {
		n(a, p.TIMEOUT)
	};
	var r = function(h, b) {
		var e = 0,
			c = 0;
		for(var f = 0, a = s.length; f < a; f++) {
			var d = s[f],
				g = false;
			if(b.tags.length === 0) {
				g = true
			} else {
				g = d.resource.tags.contains(b.tags)
			}
			if(g) {
				c++;
				if(d.status === p.LOADED || d.status === p.ERROR || d.status === p.TIMEOUT) {
					e++
				}
			}
		}
		b.callback({
			resource: h.resource,
			loaded: (h.status === p.LOADED),
			error: (h.status === p.ERROR),
			timeout: (h.status === p.TIMEOUT),
			completedCount: e,
			totalCount: c
		})
	};
	var t = this.log = function(d) {
		if(!window.console) {
			return
		}
		var e = Math.round((+new Date - m) / 1000);
		window.console.log("PxLoader elapsed: " + e + " sec");
		for(var f = 0, a = s.length; f < a; f++) {
			var b = s[f];
			if(!d && b.status !== p.WAITING) {
				continue
			}
			var c = "PxLoader: #" + f + " " + b.resource.getName();
			switch(b.status) {
				case p.QUEUED:
					c += " (Not Started)";
					break;
				case p.WAITING:
					c += " (Waiting)";
					break;
				case p.LOADED:
					c += " (Loaded)";
					break;
				case p.ERROR:
					c += " (Error)";
					break;
				case p.TIMEOUT:
					c += " (Timeout)";
					break
			}
			if(b.resource.tags.length > 0) {
				c += " Tags: [" + b.resource.tags.join(",") + "]"
			}
			window.console.log(c)
		}
	}
}

function PxLoaderTags(e) {
	this.array = [];
	this.object = {};
	this.value = null;
	this.length = 0;
	if(e !== null && e !== undefined) {
		if(Array.isArray(e)) {
			this.array = e
		} else {
			if(typeof e === "object") {
				for(var f in e) {
					this.array.push(f)
				}
			} else {
				this.array.push(e);
				this.value = e
			}
		}
		this.length = this.array.length;
		for(var d = 0; d < this.length; d++) {
			this.object[this.array[d]] = true
		}
	}
	this.contains = function(b) {
		if(this.length === 0 || b.length === 0) {
			return false
		} else {
			if(this.length === 1 && this.value !== null) {
				if(b.length === 1) {
					return this.value === b.value
				} else {
					return b.object.hasOwnProperty(this.value)
				}
			} else {
				if(b.length < this.length) {
					return b.contains(this)
				} else {
					for(var a in this.object) {
						if(b.object[a]) {
							return true
						}
					}
					return false
				}
			}
		}
	}
}
if(!Array.isArray) {
	Array.isArray = function(b) {
		return Object.prototype.toString.call(b) == "[object Array]"
	}
}

function PxLoaderImage(r, j, m) {
	var k = this,
		l = null;
	this.img = new Image();
	this.tags = j;
	this.priority = m;
	var q = function() {
		if(k.img.readyState == "complete") {
			p();
			l.onLoad(k)
		}
	};
	var n = function() {
		p();
		l.onLoad(k)
	};
	var o = function() {
		p();
		l.onError(k)
	};
	var p = function() {
		k.unbind("load", n);
		k.unbind("readystatechange", q);
		k.unbind("error", o)
	};
	this.start = function(a) {
		l = a;
		k.bind("load", n);
		k.bind("readystatechange", q);
		k.bind("error", o);
		k.img.src = r
	};
	this.checkStatus = function() {
		if(k.img.complete) {
			p();
			l.onLoad(k)
		}
	};
	this.onTimeout = function() {
		p();
		if(k.img.complete) {
			l.onLoad(k)
		} else {
			l.onTimeout(k)
		}
	};
	this.getName = function() {
		return r
	};
	this.bind = function(b, a) {
		if(k.img.addEventListener) {
			k.img.addEventListener(b, a, false)
		} else {
			if(k.img.attachEvent) {
				k.img.attachEvent("on" + b, a)
			}
		}
	};
	this.unbind = function(b, a) {
		if(k.img.removeEventListener) {
			k.img.removeEventListener(b, a, false)
		} else {
			if(k.img.detachEvent) {
				k.img.detachEvent("on" + b, a)
			}
		}
	}
}
PxLoader.prototype.addImage = function(h, e, g) {
	var f = new PxLoaderImage(h, e, g);
	this.add(f);
	return f.img
};

(function(t, e) {
	if(typeof define === "function" && define.amd) {
		define(["jquery"], e)
	} else if(typeof exports === "object") {
		module.exports = e(require("jquery"))
	} else {
		e(t.jQuery)
	}
})(this, function(t) {
	t.transit = {
		version: "0.9.12",
		propertyMap: {
			marginLeft: "margin",
			marginRight: "margin",
			marginBottom: "margin",
			marginTop: "margin",
			paddingLeft: "padding",
			paddingRight: "padding",
			paddingBottom: "padding",
			paddingTop: "padding"
		},
		enabled: true,
		useTransitionEnd: false
	};
	var e = document.createElement("div");
	var n = {};

	function i(t) {
		if(t in e.style) return t;
		var n = ["Moz", "Webkit", "O", "ms"];
		var i = t.charAt(0).toUpperCase() + t.substr(1);
		for(var r = 0; r < n.length; ++r) {
			var s = n[r] + i;
			if(s in e.style) {
				return s
			}
		}
	}

	function r() {
		e.style[n.transform] = "";
		e.style[n.transform] = "rotateY(90deg)";
		return e.style[n.transform] !== ""
	}
	var s = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
	n.transition = i("transition");
	n.transitionDelay = i("transitionDelay");
	n.transform = i("transform");
	n.transformOrigin = i("transformOrigin");
	n.filter = i("Filter");
	n.transform3d = r();
	var a = {
		transition: "transitionend",
		MozTransition: "transitionend",
		OTransition: "oTransitionEnd",
		WebkitTransition: "webkitTransitionEnd",
		msTransition: "MSTransitionEnd"
	};
	var o = n.transitionEnd = a[n.transition] || null;
	for(var u in n) {
		if(n.hasOwnProperty(u) && typeof t.support[u] === "undefined") {
			t.support[u] = n[u]
		}
	}
	e = null;
	t.cssEase = {
		_default: "easeOutSine",
		"in": "ease-in",
		out: "ease-out",
		"in-out": "ease-in-out",
		linear: "cubic-bezier(1,1,1,1)",
		easeInCubic: "cubic-bezier(.550,.055,.675,.190)",
		easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
		easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
		easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
		easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
		easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
		easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
		easeOutExpo: "cubic-bezier(.19,1,.22,1)",
		easeInOutExpo: "cubic-bezier(1,0,0,1)",
		easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
		easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
		easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
		easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
		easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
		easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
		easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
		easeOutQuint: "cubic-bezier(.23,1,.32,1)",
		easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
		easeInSine: "cubic-bezier(.47,0,.745,.715)",
		easeOutSine: "cubic-bezier(.39,.575,.565,1)",
		easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
		easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
		easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
		easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
	};
	t.cssHooks["transit:transform"] = {
		get: function(e) {
			return t(e).data("transform") || new f
		},
		set: function(e, i) {
			var r = i;
			if(!(r instanceof f)) {
				r = new f(r)
			}
			if(n.transform === "WebkitTransform" && !s) {
				e.style[n.transform] = r.toString(true)
			} else {
				e.style[n.transform] = r.toString()
			}
			t(e).data("transform", r)
		}
	};
	t.cssHooks.transform = {
		set: t.cssHooks["transit:transform"].set
	};
	t.cssHooks.filter = {
		get: function(t) {
			return t.style[n.filter]
		},
		set: function(t, e) {
			t.style[n.filter] = e
		}
	};
	if(t.fn.jquery < "1.8") {
		t.cssHooks.transformOrigin = {
			get: function(t) {
				return t.style[n.transformOrigin]
			},
			set: function(t, e) {
				t.style[n.transformOrigin] = e
			}
		};
		t.cssHooks.transition = {
			get: function(t) {
				return t.style[n.transition]
			},
			set: function(t, e) {
				t.style[n.transition] = e
			}
		}
	}
	p("scale");
	p("scaleX");
	p("scaleY");
	p("translate");
	p("rotate");
	p("rotateX");
	p("rotateY");
	p("rotate3d");
	p("perspective");
	p("skewX");
	p("skewY");
	p("x", true);
	p("y", true);

	function f(t) {
		if(typeof t === "string") {
			this.parse(t)
		}
		return this
	}
	f.prototype = {
		setFromString: function(t, e) {
			var n = typeof e === "string" ? e.split(",") : e.constructor === Array ? e : [e];
			n.unshift(t);
			f.prototype.set.apply(this, n)
		},
		set: function(t) {
			var e = Array.prototype.slice.apply(arguments, [1]);
			if(this.setter[t]) {
				this.setter[t].apply(this, e)
			} else {
				this[t] = e.join(",")
			}
		},
		get: function(t) {
			if(this.getter[t]) {
				return this.getter[t].apply(this)
			} else {
				return this[t] || 0
			}
		},
		setter: {
			rotate: function(t) {
				this.rotate = b(t, "deg")
			},
			rotateX: function(t) {
				this.rotateX = b(t, "deg")
			},
			rotateY: function(t) {
				this.rotateY = b(t, "deg")
			},
			scale: function(t, e) {
				if(e === undefined) {
					e = t
				}
				this.scale = t + "," + e
			},
			skewX: function(t) {
				this.skewX = b(t, "deg")
			},
			skewY: function(t) {
				this.skewY = b(t, "deg")
			},
			perspective: function(t) {
				this.perspective = b(t, "px")
			},
			x: function(t) {
				this.set("translate", t, null)
			},
			y: function(t) {
				this.set("translate", null, t)
			},
			translate: function(t, e) {
				if(this._translateX === undefined) {
					this._translateX = 0
				}
				if(this._translateY === undefined) {
					this._translateY = 0
				}
				if(t !== null && t !== undefined) {
					this._translateX = b(t, "px")
				}
				if(e !== null && e !== undefined) {
					this._translateY = b(e, "px")
				}
				this.translate = this._translateX + "," + this._translateY
			}
		},
		getter: {
			x: function() {
				return this._translateX || 0
			},
			y: function() {
				return this._translateY || 0
			},
			scale: function() {
				var t = (this.scale || "1,1").split(",");
				if(t[0]) {
					t[0] = parseFloat(t[0])
				}
				if(t[1]) {
					t[1] = parseFloat(t[1])
				}
				return t[0] === t[1] ? t[0] : t
			},
			rotate3d: function() {
				var t = (this.rotate3d || "0,0,0,0deg").split(",");
				for(var e = 0; e <= 3; ++e) {
					if(t[e]) {
						t[e] = parseFloat(t[e])
					}
				}
				if(t[3]) {
					t[3] = b(t[3], "deg")
				}
				return t
			}
		},
		parse: function(t) {
			var e = this;
			t.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(t, n, i) {
				e.setFromString(n, i)
			})
		},
		toString: function(t) {
			var e = [];
			for(var i in this) {
				if(this.hasOwnProperty(i)) {
					if(!n.transform3d && (i === "rotateX" || i === "rotateY" || i === "perspective" || i === "transformOrigin")) {
						continue
					}
					if(i[0] !== "_") {
						if(t && i === "scale") {
							e.push(i + "3d(" + this[i] + ",1)")
						} else if(t && i === "translate") {
							e.push(i + "3d(" + this[i] + ",0)")
						} else {
							e.push(i + "(" + this[i] + ")")
						}
					}
				}
			}
			return e.join(" ")
		}
	};

	function c(t, e, n) {
		if(e === true) {
			t.queue(n)
		} else if(e) {
			t.queue(e, n)
		} else {
			t.each(function() {
				n.call(this)
			})
		}
	}

	function l(e) {
		var i = [];
		t.each(e, function(e) {
			e = t.camelCase(e);
			e = t.transit.propertyMap[e] || t.cssProps[e] || e;
			e = h(e);
			if(n[e]) e = h(n[e]);
			if(t.inArray(e, i) === -1) {
				i.push(e)
			}
		});
		return i
	}

	function d(e, n, i, r) {
		var s = l(e);
		if(t.cssEase[i]) {
			i = t.cssEase[i]
		}
		var a = "" + y(n) + " " + i;
		if(parseInt(r, 10) > 0) {
			a += " " + y(r)
		}
		var o = [];
		t.each(s, function(t, e) {
			o.push(e + " " + a)
		});
		return o.join(", ")
	}
	t.fn.transition = t.fn.transit = function(e, i, r, s) {
		var a = this;
		var u = 0;
		var f = true;
		var l = t.extend(true, {}, e);
		if(typeof i === "function") {
			s = i;
			i = undefined
		}
		if(typeof i === "object") {
			r = i.easing;
			u = i.delay || 0;
			f = typeof i.queue === "undefined" ? true : i.queue;
			s = i.complete;
			i = i.duration
		}
		if(typeof r === "function") {
			s = r;
			r = undefined
		}
		if(typeof l.easing !== "undefined") {
			r = l.easing;
			delete l.easing
		}
		if(typeof l.duration !== "undefined") {
			i = l.duration;
			delete l.duration
		}
		if(typeof l.complete !== "undefined") {
			s = l.complete;
			delete l.complete
		}
		if(typeof l.queue !== "undefined") {
			f = l.queue;
			delete l.queue
		}
		if(typeof l.delay !== "undefined") {
			u = l.delay;
			delete l.delay
		}
		if(typeof i === "undefined") {
			i = t.fx.speeds._default
		}
		if(typeof r === "undefined") {
			r = t.cssEase._default
		}
		i = y(i);
		var p = d(l, i, r, u);
		var h = t.transit.enabled && n.transition;
		var b = h ? parseInt(i, 10) + parseInt(u, 10) : 0;
		if(b === 0) {
			var g = function(t) {
				a.css(l);
				if(s) {
					s.apply(a)
				}
				if(t) {
					t()
				}
			};
			c(a, f, g);
			return a
		}
		var m = {};
		var v = function(e) {
			var i = false;
			var r = function() {
				if(i) {
					a.unbind(o, r)
				}
				if(b > 0) {
					a.each(function() {
						this.style[n.transition] = m[this] || null
					})
				}
				if(typeof s === "function") {
					s.apply(a)
				}
				if(typeof e === "function") {
					e()
				}
			};
			if(b > 0 && o && t.transit.useTransitionEnd) {
				i = true;
				a.bind(o, r)
			} else {
				window.setTimeout(r, b)
			}
			a.each(function() {
				if(b > 0) {
					this.style[n.transition] = p
				}
				t(this).css(l)
			})
		};
		var z = function(t) {
			this.offsetWidth;
			v(t)
		};
		c(a, f, z);
		return this
	};

	function p(e, i) {
		if(!i) {
			t.cssNumber[e] = true
		}
		t.transit.propertyMap[e] = n.transform;
		t.cssHooks[e] = {
			get: function(n) {
				var i = t(n).css("transit:transform");
				return i.get(e)
			},
			set: function(n, i) {
				var r = t(n).css("transit:transform");
				r.setFromString(e, i);
				t(n).css({
					"transit:transform": r
				})
			}
		}
	}

	function h(t) {
		return t.replace(/([A-Z])/g, function(t) {
			return "-" + t.toLowerCase()
		})
	}

	function b(t, e) {
		if(typeof t === "string" && !t.match(/^[\-0-9\.]+$/)) {
			return t
		} else {
			return "" + t + e
		}
	}

	function y(e) {
		var n = e;
		if(typeof n === "string" && !n.match(/^[\-0-9\.]+/)) {
			n = t.fx.speeds[n] || t.fx.speeds._default
		}
		return b(n, "ms")
	}
	t.transit.getTransitionValue = d;
	return t
});

window.requestAnimationFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

/*var tracker = new gravitySensor ();
									tracker.listenShake ( function () {
										
											tracker.stopListenShake ();
									} , 200);	*/
function gravitySensor(calibration, tick) {
	var
		d = calibration ? null : 0,
		a = {
			x: null,
			y: null,
			z: null,
			alpha: null,
			beta: null,
			gamma: null
		},
		b = {
			x: d,
			y: d,
			z: d,
			alpha: d,
			beta: d,
			gamma: d
		},
		t = null,
		SHAKE_THRESHOLD = 800,
		lastUpdate = 0,
		x, y, z, last_x, last_y, last_z,

		_ = this;

	this.tick = tick || 100;
	this.allowListenShake = !0;

	this.xz = function(c) {
		if(b.x != null && b.alpha != null) return !1;
		for(i in b) {
			if(b[i] === null && c[i] != undefined) {
				b[i] = c[i];
			}
		}
	}

	this.startTracking = function(f) {

		window.addEventListener('devicemotion', _.handelMozOrientation, false);

		t = setInterval(function() {
			f.call(_, a);
		}, _.tick);
	}
	this.stopTracking = function() {
		clearInterval(t);
		window.removeEventListener('devicemotion', _.handelMozOrientation, false);

		if(calibration) {
			b.x = d;
			b.y = d;
			b.z = d;
			b.alpha = d;
			b.beta = d;
			b.gamma = d;
		}
	}

	this.handelMozOrientation = function(c) {
		_.xz(c);
		a.x = c.x - b.x;
		a.y = c.y - b.y;
		a.z = c.z - b.z;
	}

	this.handelDevicemotion = function(c) {
		_.xz(c.accelerationIncludingGravity);
		a.x = c.accelerationIncludingGravity.x - b.x;
		a.y = c.accelerationIncludingGravity.y - b.y;
		a.z = c.accelerationIncludingGravity.z - b.z;
	}

	this.handelDeviceorientation = function(c) {
		_.xz(c);
		a.alpha = c.alpha - b.alpha;
		a.beta = c.beta - b.beta;
		a.gamma = c.gamma - b.gamma;
	}

	this.checkSupport = function() {
		return('ondeviceorientation' in window || 'ondevicemotion' in window || 'onMozOrientation' in window);
	}

	this.stopListenShake = function() {
		_.allowListenShake = !1;
	}
	this.startListenShake = function() {
		_.allowListenShake = !0;
	}

	this.listenShake = function(f, s) {

		var lmd = s || 50;

		if(window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', function(eventData) {

				if(!_.allowListenShake) return !1;
				var acceleration = eventData.accelerationIncludingGravity;
				var curTime = Date.now();
				if((curTime - lastUpdate) > lmd) {
					var diffTime = (curTime - lastUpdate);
					lastUpdate = curTime;
					x = acceleration.x;
					y = acceleration.y;
					z = acceleration.z;
					var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

					if(speed > SHAKE_THRESHOLD) {
						f && f.call(_);
					}
					last_x = x;
					last_y = y;
					last_z = z;
				}

			}, false);

		}

	}
};

function SPScale(obj, w, h) {

	//if(!Zhu._Android){

	var videoScale = $(window).height() / 640 - (h / w - 1);

	if($(window).height() > h) {
		$(obj).attr('style', '-webkit-transform: scale(' + videoScale + ');transform: scale(' + videoScale + ');');

		$(obj).css({
			margin: 'auto',
			left: 0,
			bottom: 0,
			right: 0,
			top: 0,
			position: 'absolute'
		})

	}

};

var Zhu = {
	_elementStyle: document.createElement('div').style,
	_UC: RegExp("Android").test(navigator.userAgent) && RegExp("UC").test(navigator.userAgent) ? true : false,
	_weixin: RegExp("MicroMessenger").test(navigator.userAgent) ? true : false,
	_iPhone: RegExp("iPhone").test(navigator.userAgent) || RegExp("iPod").test(navigator.userAgent) || RegExp("iPad").test(navigator.userAgent) ? true : false,
	_Android: RegExp("Android").test(navigator.userAgent) ? true : false,
	_IsPC: function() {
		var userAgentInfo = navigator.userAgent;
		var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
		var flag = true;
		for(var v = 0; v < Agents.length; v++) {
			if(userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	},
	_isOwnEmpty: function(obj) {
		for(var name in obj) {
			if(obj.hasOwnProperty(name)) {
				return false;
			}
		}
		return true;
	},

	// 判断浏览器内核类型
	_vendor: function() {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for(; i < l; i++) {
			transform = vendors[i] + 'ransform';
			if(transform in document.createElement('div').style) return vendors[i].substr(0, vendors[i].length - 1);
		}
		return false;
	},
	// 判断浏览器来适配css属性值
	_prefixStyle: function(style) {
		if(this._vendor() === false) return false;
		if(this._vendor() === '') return style;
		return this._vendor() + style.charAt(0).toUpperCase() + style.substr(1);
	},

	_translateZ: function() {
		if(Zhu._hasPerspective) {
			return ' translateZ(0)';
		} else {
			return '';
		}
	}

}

$.fn.FadeIn = function() {
	if(!document.selection) this.fadeIn();
	if(document.selection) this.show();
	return this;

};
$.fn.FadeOut = function() {
	if(!document.selection) this.fadeOut();
	if(document.selection) this.hide();
	return this;
};

$.fn.cssEnd = function(fn) {
	var EventAnimateEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	this.one(EventAnimateEnd, fn);
	return this;
};

$.fn.cssHide = function(CLASS, fn) {
	//$(this).css('zIndex', 2)
	var _this = this;
	$(_this).addClass(CLASS).cssEnd(function() {
		$(_this).hide().removeClass(CLASS);
		if(fn) fn();
	})
};
$.fn.cssShow = function(CLASS, fn) {
	//$(this).css('zIndex', 1)
	var _this = this;
	setTimeout(function() {

		$(_this).show();
		$(_this).addClass(CLASS).cssEnd(function() {
			$(_this).removeClass(CLASS);
			if(fn) fn();
		})
	}, 10);
	return this;
};

function GetRandomNum(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	return(Min + Math.round(Rand * Range));
};

$.fn.to = function(options, time, fn) {
	var _this = this;
	var settings = {
		delay: 0
	};
	if(options) {
		$.extend(settings, options)
	};
	setTimeout(function() {
		_this.transition(settings, (time || 1) * 1000, function() {
			if(fn) fn();
		});
	}, settings.delay * 1000)
	return this

};
$.fn.from = function(options, time, fn) {
	var _this = this;
	var settings = {
		delay: 0
	};
	if(options) {
		$.extend(settings, options)
	};

	var PremierStyle = {};
	for(var j in settings) {
		if(j in Zhu._elementStyle || Zhu._prefixStyle(j) in Zhu._elementStyle) {
			//j = j in Zhu._elementStyle ? j : Zhu._prefixStyle(j);
			PremierStyle[j] = _this.css(j);
		}
	};

	if(options.easing) PremierStyle.easing = options.easing;

	_this.css(settings);
	//console.log(PremierStyle)
	setTimeout(function() {
		_this.transition(PremierStyle, (time || 1) * 1000, function() {
			if(fn) fn();
		});
	}, settings.delay * 1000)
	return this
};

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = location.search.substr(1).match(reg);
	if(r != null) return unescape(decodeURI(r[2]));
	return null;
};

function isArray(obj) {
	return Object.prototype.toString.call(obj).toLowerCase() == "[object array]";
};

function spriteCanvasimgLoader(opt) {
	var loaded = 0,
		loadPath = opt.img,
		onloading = opt.onloading,
		callback = opt.callback,
		fnBeOnce = true,
		data = {},
		errorCunt = 0,
		jdScl = 0,
		isPreload = opt.preload == undefined ? false : opt.preload;
	str = '';
	if(!isArray(loadPath))
		loadPath = [loadPath];

	var len = loadPath.length;
	if(!len) {
		callback && callback();
		return;
	}

	if(len > 1　) {
		//去下重 在去掉无效的图片地址
		var re = [],
			test = {};
		for(var i = 0; i < len; i++) {
			if(isJson(loadPath[i])) {
				if(!test[loadPath[i].id]) {
					re.push(loadPath[i]);
					test[loadPath[i].id] = 1;
				}
			} else {
				if(!test[loadPath[i]]) {
					re.push(loadPath[i]);
					test[loadPath[i]] = 1;
				}
			}
		}
		loadPath = re;
		test = null;
	}

	len = loadPath.length;

	//乱序加载用到的变量 。。
	var sorts = [],
		cacheImgs = {};
	var res = '@$$_';
	var ssss = {};

	for(var i = 0; i < len; i++) {
		if(isJson(loadPath[i])) {
			if(loadPath[i].groupid != undefined) {
				sorts.push(loadPath[i].groupid + res + loadPath[i].id);
				if(data[loadPath[i].groupid] == undefined)
					data[loadPath[i].groupid] = {};
			}
		}
	}

	var len2 = sorts.length;

	function doLoad(isjson, img, issucc, errorsrc, k) {

		if(isjson) {

			var gid = loadPath[!isPreload ? k : loaded + errorCunt].groupid;

			if(gid != undefined) {

				if(!isPreload) {
					cacheImgs[gid + res + loadPath[k].id] = img;

				} else {
					data[gid][loadPath[loaded + errorCunt].id] = img;
				}

			} else {
				data[loadPath[isPreload ? loaded + errorCunt : k].id] = img;
			}
		}

		if(!issucc) {
			errorCunt += 1;
			str += '\n';
			str += errorsrc;
		} else {
			loaded += 1;
		}

		jdScl = (loaded + errorCunt) / len * 100;
		onloading && onloading(jdScl);
		fnBeOnce && isPreload && handelLoad(L.tool.isJson(loadPath[loaded + errorCunt]) ? loadPath[loaded + errorCunt].url || loadPath[loaded + errorCunt].src : loadPath[loaded + errorCunt], isJson(loadPath[loaded + errorCunt]));

		if(loaded + errorCunt == loadPath.length) {
			if(fnBeOnce) {
				fnBeOnce = false;

				//乱序加载需要把返回的数据排下序。。。

				if(!isPreload) {

					if(len2) {

						for(var i = 0; i < len2; i++) {
							var ids = sorts[i].split(res);
							data[ids[0]][ids[1]] = cacheImgs[sorts[i]];
						}
					}
				}

				callback && callback(data);
				errorCunt && console.log(errorCunt + '张图片加载失败' + str);
				sorts = cacheImgs = null;

			}
		}
	}

	function handelLoad(src, isjson, k) {

		//console.log(isjson)
		if(!src) return;

		var img = new Image();
		img.onreadystatechange = function() {
			if("complete" == img.readyState) {
				doLoad(isjson, this, true, null, k);
				img.onload = img.onerror = img.onreadystatechange = null;
				if(!isjson)
					img = null;

			}
		}

		img.onload = function() {
			doLoad(isjson, this, true, null, k);
			img.onload = img.onerror = img.onreadystatechange = null;
			if(!isjson)
				img = null;
		}

		img.onerror = function() {

			if(isjson) {
				var c = document.createElement('canvas');
				c.width = 640;
				c.height = 1040;
				c.getContext('2d').fillStyle = '#000';
				c.getContext('2d').fillRect(0, 0, 640, 1040);
				doLoad(isjson, c, false, this.src, k);
			} else {
				doLoad(isjson, this, false, this.src);
			}

			img.onload = img.onerror = img.onreadystatechange = img = null;
		}
		img.src = src;
	};

	isPreload && handelLoad(isJson(loadPath[0]) ? loadPath[0].url || loadPath[0].src : loadPath[0], isJson(loadPath[0]));

	if(!isPreload) {
		for(var i = 0; i < len; i++) {
			(function(k) {
				var da = loadPath[k];

				handelLoad(isJson(da) ? da.url || da.src : da, isJson(da), k);

			})(i);
		}
	}
};

function isJson(obj) {
	return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]"
};

function spriteCanvas(id, fps, loop, width, height) {
	if(id == undefined) return;
	this.width = width;
	this.height = height;
	this.now = 0;
	this.clock = null;
	this.ctx;
	this.img = {};

	this.loop = loop == undefined ? true : loop;
	this.cacheLoop = this.loop;
	this.yoyo;
	this.cunt = 1;
	this.max;
	this.from = null;
	this.to = null;
	this.id = id;
	this.type = 'canvas';
	this.startTime = 0;
	this.lastTime = 0;
	this.fps = fps || 20;
	this.timeout = 1000 / this.fps;
	this.interval = this.timeout;
	this.stoped = false;
	this.useRAF = true;

}
spriteCanvas.prototype = {
	initDraw: function(ctx, imgs, loadingCallback, yoyo) {
		var _ = this;

		_.yoyo = yoyo;
		if(_.width == undefined)
			_.width = ctx.width;
		if(_.height == undefined)
			_.height = ctx.height;

		_.ctx = ctx.getContext('2d');

		if(isJson(imgs)) {
			if(!imgs[_.now]) {
				var c = 0;
				for(var i in imgs) {
					//console.log(i)
					_.img[c] = imgs[i];
					c++;
				}
				c = null;
			} else {
				_.img = imgs;
			}

			var keys = Object.keys(imgs);
			_.max = keys.length;
			keys = null;

			loadingCallback && loadingCallback.apply(_, [{
				jd: 100,
				readyState: 'complete'
			}, _.img]);
		} else {

			_.max = imgs.length;
			var k = [];
			for(var i = 0, j = imgs.length; i < j; i++) {
				k.push({
					id: i,
					url: imgs[i]
				});
			}

			spriteCanvasimgLoader({
				img: k,
				onloading: function(p) {
					loadingCallback && loadingCallback.apply(_, [{
						jd: p,
						readyState: 'notReady'
					}, null]);
				},
				callback: function(result) {
					_.img = result;

					_.complete = true;

					loadingCallback && loadingCallback.apply(_, [{
						jd: 100,
						readyState: 'complete'
					}, _.img]);
					k = null;
				}
			});
		}
	},
	handleTimeout: function(json) {
		var _ = this;
		clearTimeout(_.clock);
		_.clock = setTimeout(function() {

			_.tick(json);
			_.handleTimeout(json);

		}, _.interval);

	},

	handleRAF: function(json) {

		var _ = this;
		(function d() {

			_.startTime = Date.now(); //_.getTime ();

			//alert( _.startTime + '--'+ _.lastTime)
			if(_.startTime - _.lastTime < _.timeout) {

				return _.clock = requestAnimationFrame(d);
			}

			_.tick(json);

			_.clock = requestAnimationFrame(d);
			_.lastTime = _.startTime;
		})();
	},
	tick: function(json) {

		if(this.stoped) return;

		if(this.to != null) {
			if(this.now == this.to + 1) {
				this.now = this.from;
			}
		}
		json[this.now] && this.drawImg(json[this.now]);
		this.onDraw && this.onDraw.call(this, this.now);

		if(!json[this.now]) {
			if(this.loop) {
				if(this.yoyo) {
					this.cunt *= -1;
				} else {
					this.now = 0;
				}
			} else {
				if(this.yoyo) {
					this.now -= 1;
					this.cunt = -1;
					if(this.now == -1) {
						this.now = 0;
						this.stop();
						this.onEnd && this.onEnd.call(this, this.now);
					}

				} else {
					this.stop();
					this.onEnd && this.onEnd.call(this, this.now);
				}
			}
		}
		this.now += this.cunt;
	},

	draw: function(json) {
		this.stoped = false;
		this.img = json;

		if(this.useRAF)
			this.handleRAF(json);

		else
			this.handleTimeout(json);

		//var now = window.performance && (performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow);

		//	alert(now&&now.call(performance)) 

	},
	getTime: function() {
		return new Date().getTime() - this.startTime;
	},

	stop: function(index) {

		var _ = this;
		_.stoped = true;

		if(_.useRAF) {
			cancelAnimationFrame(_.clock);
		} else {
			clearTimeout(_.clock);
		}
		if(index != undefined) {
			if(!isNaN(index) && index < _.max && index > -1) {
				_.now = index;
				_.drawImg(_.img[index]);
			}
		}

	},
	setFPS: function(fps) {
		if(isNaN(fps)) return;
		this.fps = Math.max(1, Math.min(100, fps));
		this.interval = this.timeout = 1000 / this.fps;
	},
	setInterval: function(interval) {
		if(isNaN(interval)) return;
		this.interval = interval * 1;
	},
	clear: function(index) {
		this.stop();
		this.ctx && this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	},
	loopFromTo: function(v1, v2) {
		var _ = this;
		this.from = Math.max(0, v1);
		this.to = Math.max(0, Math.min(this.max, v2));
		_.start(_.from);

	},
	stopAndYoyoback: function(index) {
		if(index != undefined) {
			if(!isNaN(index) && index < this.max && index > -1) {
				this.now = index;
			}
		}
		this.stop(index);
		this.cunt = -1;
		this.loop = false;

		this.draw(this.img);

	},
	start: function(index) {

		this.cunt = 1;
		this.loop = this.cacheLoop;
		//	
		//this.now = index != undefined ? index : this.now;
		if(index != undefined) {
			if(!isNaN(index) && index < this.max && index > -1) {
				this.now = index;
			}
		}

		this.draw(this.img);
	},
	play: function(index) {
		var self = this;

		if(self.complete) {

			this.start(index);
		} else {

			clearInterval(self.timer22)
			self.timer22 = setInterval(function() {

				if(self.complete != undefined) {

					this.play(index);
					clearInterval(self.timer22)
				}

			}, 100)
		}

	},
	drawImg: function(img) {

		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.drawImage(img, 0, 0, this.width, this.height);
		//d && d ( this.now );

		this.update();
	},
	update: function(a) {

		if(a) a()
	},
	context: function() {
		return this.ctx;
	}
};

function createAnimation(lib, img, loop, canvas, animation, src) {
	function flashCanvas(libs, img, ctj, loop) {

		var Animation = function(canvas, animation, loadsrc) {
			p.initialize.apply(this, arguments);
		};

		var p = Animation.prototype;
		var s = Animation;

		p.initialize = function(canvas, animation, loadsrc) {
			var self = this;

			self.canvas = canvas;
			self.exportRoot = null;
			self.stage = null;
			self.fps = libs.properties.fps || 25;
			self.animationFn = animation;
			self.loadsrc = loadsrc || libs.properties.manifest;
			self.loop = typeof loop == 'undefined' ? true : loop;
			self.from = null;
			self.to = null;
			self.lastFrame = 0;
			self.once = true;
			self.timer = null;

			ctj.Ticker.useRAF = true;
			ctj.Ticker.setFPS(self.fps);
			self._tickListen = ctj.proxy(self._tickFunc, this);
		};

		p.prohandleFileLoad = function(evt) {
			if(evt.item.type == "image") {
				img[evt.item.id] = evt.result;
			}
		};

		p.setFPS = function(fps) {
			self.fps = fps;
			ctj.Ticker.setFPS(fps);
		};
		p._tickFunc = function(evt) {
			var self = this;

			self.listenTick && self.listenTick.call(self, self.exportRoot.currentFrame);

			self.stage.update(evt);

			if(self.to != null) {
				if(self.exportRoot.currentFrame == self.to) {
					self.play(self.from);
				}
			}

			if(self.loop) {
				if(self.exportRoot.currentFrame < self.lastFrame) {

					self.onEnd && self.onEnd();
					self.once && self.onceEnd && self.onceEnd();
					self.once = false;

				}
				self.lastFrame = self.exportRoot.currentFrame;
			}

		};

		p.loopFromTo = function(v1, v2) {
			this.from = v1;
			this.to = v2;
			this.play(this.from);
		};

		p.setLoop = function(loop) {
			this.exportRoot.loop = loop;
		};

		p.play = function(position) {

			var self = this;
			ctj.Ticker.addEventListener("tick", self._tickListen);
			typeof position != 'undefined' && self.exportRoot.gotoAndPlay(position);

		};

		p.cplay = function(position) {
			var self = this;
			clearInterval(self.Timer)
			self.stop(position)
			setTimeout(function() {
				self.play(position);
			}, 1000 / self.fps * 2)

		};

		p.playto = function(position) {

			var self = this;

			clearInterval(self.Timer)
			self.Timer = setInterval(function() {

				console.log(self.exportRoot.currentFrame == position)
				if(self.exportRoot.currentFrame == position) {
					clearInterval(self.Timer)
					setTimeout(function() {
						self.play(position);
					}, 1000 / self.fps)

				} else {
					self.stop(--self.exportRoot.currentFrame)
					self.play();
				}

			}, 1000 / self.fps)

		};

		p.stop = function(position) {
			var self = this;
			position && self.exportRoot.gotoAndStop(Math.max(0, position));
			//ctj.Ticker.removeEventListener("tick", self._tickListen);
			position && self.listenTick && self.listenTick.call(self, position);
			clearTimeout(self.timer);
			self.timer = setTimeout(function() {
				ctj.Ticker.removeEventListener("tick", self._tickListen);
			}, self.fps + 50);

		};

		p.handleComplete = function(evt) {
			var self = this;

			self.exportRoot = new libs[self.animationFn]("independent", 0, self.loop);

			self.stage = new ctj.Stage(self.canvas);
			self.stage.addChild(this.exportRoot);
			self.stage.update();

			setTimeout(function() {

				self.onComplete && self.onComplete();

				if(!self.loop) {
					self.exportRoot.timeline._tweens[0].call(function() {
						ctj.Ticker.removeEventListener("tick", self._tickListen);
						self.onEnd && self.onEnd();
						self.once && self.onceEnd && self.onceEnd();
						self.once = false;
					});

				}
			}, 10);

		};

		p.preload = function(data) {
			var self = this;
			if(!self.loadsrc.length && !data) {
				self.onLoading && self.onLoading(1);
				self.handleComplete.call(self);
				return;
			}

			if(data) {

				for(var i in data) {
					img[i] = data[i];
				}

				self.onLoading && self.onLoading(1);

				self.handleComplete.call(self);

			} else {

				self.loader = new ctj.LoadQueue(false);
				//ctj.Sound.alternateExtensions = ["mp3"];
				//self.loader.installPlugin(ctj.Sound);
				self.loader.addEventListener("fileload", ctj.proxy(self.prohandleFileLoad, self));
				self.loader.addEventListener("progress", function(evt) {

					self.onLoading && self.onLoading(evt.progress);

				});

				self.loader.addEventListener("complete", ctj.proxy(self.handleComplete, self));
				self.loader.loadManifest(self.loadsrc);
			}

		};

		return Animation;
	}

	var a = flashCanvas(lib, img, createjs, loop);
	return new a(canvas, animation, src);
};

function LoadFn(arr, fn, fn2, size, time) {

	function _LoadFn(arr, fn, fn2) {
		var loader = new PxLoader();
		for(var i = 0; i < arr.length; i++) {
			loader.addImage(arr[i]);
		};

		loader.addProgressListener(function(e) {
			var percent = Math.round(e.completedCount / e.totalCount * 100);
			if(fn2) fn2(percent)
		});

		loader.addCompletionListener(function() {
			if(fn) fn();
		});
		loader.start();
	}

	if(size) {
		function array_chunk(input, size, preserve_keys) {
			// *     example 1: array_chunk(['Kevin', 'van', 'Zonneveld'], 2);
			// *     returns 1: [['Kevin', 'van'], ['Zonneveld']]
			// *     example 2: array_chunk(['Kevin', 'van', 'Zonneveld'], 2, true);
			// *     returns 2: [{0:'Kevin', 1:'van'}, {2: 'Zonneveld'}]
			// *     example 3: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2);
			// *     returns 3: [['Kevin', 'van'], ['Zonneveld']]
			// *     example 4: array_chunk({1:'Kevin', 2:'van', 3:'Zonneveld'}, 2, true);
			// *     returns 4: [{1: 'Kevin', 2: 'van'}, {3: 'Zonneveld'}]
			var x, p = '',
				i = 0,
				c = -1,
				l = input.length || 0,
				n = [];

			if(size < 1) {
				return null;
			}

			if(Object.prototype.toString.call(input) === '[object Array]') {
				if(preserve_keys) {
					while(i < l) {
						(x = i % size) ? n[c][i] = input[i]: n[++c] = {}, n[c][i] = input[i];
						i++;
					}
				} else {
					while(i < l) {
						(x = i % size) ? n[c][x] = input[i]: n[++c] = [input[i]];
						i++;
					}
				}
			} else {
				if(preserve_keys) {
					for(p in input) {
						if(input.hasOwnProperty(p)) {
							(x = i % size) ? n[c][p] = input[p]: n[++c] = {}, n[c][p] = input[p];
							i++;
						}
					}
				} else {
					for(p in input) {
						if(input.hasOwnProperty(p)) {
							(x = i % size) ? n[c][x] = input[p]: n[++c] = [input[p]];
							i++;
						}
					}
				}
			}
			return n;
		}

		var newarr = array_chunk(arr, Math.ceil(arr.length / size));
		var Length = newarr.length;
		var allsize = arr.length;

		function __LoadFn(j) {

			_LoadFn(newarr[j], function() {

				if(j == (Length - 1)) {
					fn();
				} else {

					if(time) {
						setTimeout(function() {
							__LoadFn(++j)
						}, time)
					} else {
						__LoadFn(++j)
					}

				}

			}, function(p) {

				if(fn2) fn2(Math.min(100, Math.ceil(p / Length + j * 100 / Length)))
			}, time)
		}

		__LoadFn(0)

	} else {
		_LoadFn(arr, fn, fn2, null, time)
	}

};

YM.YZ = {
	isIe678: function() {
		return eval('"v"=="\v"') || -1 != L.ua.indexOf("ie 6") || -1 != L.ua.indexOf("ie 7") || -1 != L.ua.indexOf("ie 8")
	},
	isChinese: function(a) {
		return /^[\u4E00-\u9FA3]{1,}$/.test(a)
	},
	isIDCard: function(a) {
		return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(a)
	},
	isMobile: function(a) {
		return !/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test($.trim(a))
	},
	isEmail: function(a) {
		return !/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/.test($.trim(a))
	}
}

YM.StepBj = function(obj, width, time) {

	var vw = width;
	var index = 0;
	var timer = null;

	StepBj.play = function(position) {
		timer = setInterval(function() {
			obj[0].style['backgroundPosition'] = vw * -index + 'px 0'
			index++
		}, time)
	};

	StepBj.stop = function(position) {
		clearInterval(timer)
	};

	return StepBj;
};

YM.AppScale = function() {
	var defaultWidth = window.innerWidth;
	var defaultHeight = window.innerHeight;
	var bl = defaultWidth / 640;
	var h = defaultHeight / defaultWidth * 640
	var bl2 = defaultHeight / h
	//alert(h / bl2 / (1 / ( 1 - bl)) / 2)
	$('body').height(h)
	//$('body').css('transform' , 'scale(' + bl + ') translate(' + (( defaultWidth / 2 ) / -bl / (1 / ( 1 - bl))) + 'px,' + ( - h / bl2 / (1 / ( 1 - bl)) / 2) + 'px)');	
	$('body').css('transform', 'scale(' + bl + ') translate(' + (-640 / bl / (1 / (1 - bl2)) / 2) + 'px,' + (-h / bl2 / (1 / (1 - bl)) / 2) + 'px)');
};

function SPScale(obj, w, h) {

	//if(!Zhu._Android){

	var videoScale = $(window).height() / 640 - (h / w - 1);

	if($(window).height() > h) {
		$(obj).attr('style', '-webkit-transform: scale(' + videoScale + ');transform: scale(' + videoScale + ');');

		$(obj).css({
			margin: 'auto',
			left: 0,
			bottom: 0,
			right: 0,
			top: 0,
			position: 'absolute'
		})

	}

	//}

}

function ALERT(txt) {

	if(!window.ALERTHTML) {
		window.ALERTHTML = true;
		$('#viewbox').append('<div class="weui_dialog_alert">' +
			'<div class="weui_mask"></div>' +
			'<div class="weui_dialog">' +
			'<div class="weui_dialog_hd"><strong class="weui_dialog_title"></strong></div>' +
			'<div class="weui_dialog_ft">' +
			'<a class="weui_btn_dialog primary" href="javascript:;">确定</a>' +
			'</div></div></div>');

		$('.weui_btn_dialog').click(function() {
			$('.weui_dialog_alert').fadeOut();
		});
	};

	$('.weui_dialog_title').html(txt);
	$('.weui_dialog_alert').fadeIn();

}

function bugtxt(html) {

	if(!$('#bugtxt').size()) {
		$('body').append('<div id="bugtxt" style="color: #000;font-size: 14px; position: absolute; z-index: 999;left: 0;top: 0; word-wrap: break-word;background-color: #fff;width: 100%;"></div>')
	}

	$('#bugtxt').html(html)

}

/*
.weui_btn_dialog.primary { color:rgb(255,154,158) !important}
*/

! function(aj) {
	var ai, ah, ag, af, ae, ad, ac, ab, aa, Z, Y, X, W, V, U, S, Q, O, M, K, J, I, H, G, F, T, R;
	void 0 === Number.EPSILON && (Number.EPSILON = Math.pow(2, -52)), void 0 === Number.isInteger && (Number.isInteger = function(b) {
		return "number" == typeof b && isFinite(b) && Math.floor(b) === b
	}), void 0 === Math.sign && (Math.sign = function(b) {
		return 0 > b ? -1 : b > 0 ? 1 : +b
	}), void 0 === Function.prototype.name && Object.defineProperty(Function.prototype, "name", {
		get: function() {
			return this.toString().match(/^\s*function\s*([^\(\s]*)/)[1]
		}
	}), void 0 === Object.assign && ! function() {
		Object.assign = function(g) {
			var f, j, i, h;
			if(void 0 === g || null === g) {
				throw new TypeError("Cannot convert undefined or null to object")
			}
			for(f = Object(g), j = 1; j < arguments.length; j++) {
				if(i = arguments[j], void 0 !== i && null !== i) {
					for(h in i) {
						Object.prototype.hasOwnProperty.call(i, h) && (f[h] = i[h])
					}
				}
			}
			return f
		}
	}(), ai = function(d, c) {
		if(!(d instanceof c)) {
			throw new TypeError("Cannot call a class as a function")
		}
	}, ah = function() {
		function b(f, e) {
			var h, g;
			for(h = 0; h < e.length; h++) {
				g = e[h], g.enumerable = g.enumerable || !1, g.configurable = !0, "value" in g && (g.writable = !0), Object.defineProperty(f, g.key, g)
			}
		}
		return function(a, f, e) {
			return f && b(a.prototype, f), e && b(a, e), a
		}
	}(), ag = function P(h, g, l) {
		var k, j, i;
		return null === h && (h = Function.prototype), k = Object.getOwnPropertyDescriptor(h, g), void 0 === k ? (j = Object.getPrototypeOf(h), null === j ? void 0 : P(j, g, l)) : "value" in k ? k.value : (i = k.get, void 0 === i ? void 0 : i.call(l))
	}, af = function(d, c) {
		if("function" != typeof c && null !== c) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof c)
		}
		d.prototype = Object.create(c && c.prototype, {
			constructor: {
				value: d,
				enumerable: !1,
				writable: !0,
				configurable: !0
			}
		}), c && (Object.setPrototypeOf ? Object.setPrototypeOf(d, c) : d.__proto__ = c)
	}, ae = function(d, c) {
		if(!d) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
		}
		return !c || "object" != typeof c && "function" != typeof c ? d : c
	}, ad = function N() {
		var d, b = this;
		ai(this, N), d = document.createDocumentFragment(), ["addEventListener", "dispatchEvent", "removeEventListener"].forEach(function(a) {
			return b[a] = function() {
				return d[a].apply(d, arguments)
			}
		})
	}, ac = function() {
		function b(m, l, k, j, i, a) {
			ai(this, b), this.setValues(m, l, k, j, i, a)
		}
		return ah(b, [{
			key: "setValues",
			value: function(h, g, l, k, j, i) {
				return this.a = null == h ? 1 : h, this.b = g || 0, this.c = l || 0, this.d = null == k ? 1 : k, this.tx = j || 0, this.ty = i || 0, this
			}
		}, {
			key: "append",
			value: function(t, s, r, q, p, o) {
				var n = this.a,
					m = this.b,
					l = this.c,
					k = this.d;
				return(1 != t || 0 != s || 0 != r || 1 != q) && (this.a = n * t + l * s, this.b = m * t + k * s, this.c = n * r + l * q, this.d = m * r + k * q), this.tx = n * p + l * o + this.tx, this.ty = m * p + k * o + this.ty, this
			}
		}, {
			key: "prepend",
			value: function(r, q, p, o, n, m) {
				var l = this.a,
					k = this.c,
					j = this.tx;
				return this.a = r * l + p * this.b, this.b = q * l + o * this.b, this.c = r * k + p * this.d, this.d = q * k + o * this.d, this.tx = r * j + p * this.ty + n, this.ty = q * j + o * this.ty + m, this
			}
		}, {
			key: "appendMatrix",
			value: function(c) {
				return this.append(c.a, c.b, c.c, c.d, c.tx, c.ty)
			}
		}, {
			key: "prependMatrix",
			value: function(c) {
				return this.prepend(c.a, c.b, c.c, c.d, c.tx, c.ty)
			}
		}, {
			key: "appendTransform",
			value: function(x, w, v, u, t, s, r, q, p) {
				if(t % 360) {
					var o = t * b.DEG_TO_RAD,
						n = Math.cos(o),
						a = Math.sin(o)
				} else {
					n = 1, a = 0
				}
				return s || r ? (s *= b.DEG_TO_RAD, r *= b.DEG_TO_RAD, this.append(Math.cos(r), Math.sin(r), -Math.sin(s), Math.cos(s), x, w), this.append(n * v, a * v, -a * u, n * u, 0, 0)) : this.append(n * v, a * v, -a * u, n * u, x, w), (q || p) && (this.tx -= q * this.a + p * this.c, this.ty -= q * this.b + p * this.d), this
			}
		}, {
			key: "prependTransform",
			value: function(x, w, v, u, t, s, r, q, p) {
				if(t % 360) {
					var o = t * b.DEG_TO_RAD,
						n = Math.cos(o),
						a = Math.sin(o)
				} else {
					n = 1, a = 0
				}
				return(q || p) && (this.tx -= q, this.ty -= p), s || r ? (s *= b.DEG_TO_RAD, r *= b.DEG_TO_RAD, this.prepend(n * v, a * v, -a * u, n * u, 0, 0), this.prepend(Math.cos(r), Math.sin(r), -Math.sin(s), Math.cos(s), x, w)) : this.prepend(n * v, a * v, -a * u, n * u, x, w), this
			}
		}, {
			key: "rotate",
			value: function(a) {
				a *= b.DEG_TO_RAD;
				var j = Math.cos(a),
					i = Math.sin(a),
					h = this.a,
					g = this.b;
				return this.a = h * j + this.c * i, this.b = g * j + this.d * i, this.c = -h * i + this.c * j, this.d = -g * i + this.d * j, this
			}
		}, {
			key: "skew",
			value: function(a, d) {
				return a *= b.DEG_TO_RAD, d *= b.DEG_TO_RAD, this.append(Math.cos(d), Math.sin(d), -Math.sin(a), Math.cos(a), 0, 0), this
			}
		}, {
			key: "scale",
			value: function(d, c) {
				return this.a *= d, this.b *= d, this.c *= c, this.d *= c, this
			}
		}, {
			key: "translate",
			value: function(d, c) {
				return this.tx += this.a * d + this.c * c, this.ty += this.b * d + this.d * c, this
			}
		}, {
			key: "identity",
			value: function() {
				return this.a = this.d = 1, this.b = this.c = this.tx = this.ty = 0, this
			}
		}, {
			key: "invert",
			value: function() {
				var h = this.a,
					g = this.b,
					l = this.c,
					k = this.d,
					j = this.tx,
					i = h * k - g * l;
				return this.a = k / i, this.b = -g / i, this.c = -l / i, this.d = h / i, this.tx = (l * this.ty - k * j) / i, this.ty = -(h * this.ty - g * j) / i, this
			}
		}, {
			key: "isIdentity",
			value: function() {
				return 0 === this.tx && 0 === this.ty && 1 === this.a && 0 === this.b && 0 === this.c && 1 === this.d
			}
		}, {
			key: "equals",
			value: function(c) {
				return this.tx === c.tx && this.ty === c.ty && this.a === c.a && this.b === c.b && this.c === c.c && this.d === c.d
			}
		}, {
			key: "transformPoint",
			value: function(e, d, f) {
				return f = f || {}, f.x = e * this.a + d * this.c + this.tx, f.y = e * this.b + d * this.d + this.ty, f
			}
		}, {
			key: "decompose",
			value: function(a) {
				null == a && (a = {}), a.x = this.tx, a.y = this.ty, a.scaleX = Math.sqrt(this.a * this.a + this.b * this.b), a.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
				var h = Math.atan2(-this.c, this.d),
					g = Math.atan2(this.b, this.a),
					f = Math.abs(1 - h / g);
				return 0.00001 > f ? (a.rotation = g / b.DEG_TO_RAD, this.a < 0 && this.d >= 0 && (a.rotation += a.rotation <= 0 ? 180 : -180), a.skewX = a.skewY = 0) : (a.skewX = h / b.DEG_TO_RAD, a.skewY = g / b.DEG_TO_RAD), a
			}
		}, {
			key: "copy",
			value: function(c) {
				return this.setValues(c.a, c.b, c.c, c.d, c.tx, c.ty)
			}
		}, {
			key: "clone",
			value: function() {
				return new b(this.a, this.b, this.c, this.d, this.tx, this.ty)
			}
		}, {
			key: "toString",
			value: function() {
				return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]"
			}
		}]), b
	}(), ac.DEG_TO_RAD = Math.PI / 180, ac.identity = null, ab = function() {
		function b(k, j, i, h, a) {
			ai(this, b), this.setValues(k, j, i, h, a)
		}
		return ah(b, [{
			key: "setValues",
			value: function(g, f, j, i, h) {
				return this.visible = null == g ? !0 : !!g, this.alpha = null == f ? 1 : f, this.matrix = h || this.matrix && this.matrix.identity() || new ac, this
			}
		}, {
			key: "append",
			value: function(g, f, j, i, h) {
				return this.alpha *= f, this.visible = this.visible && g, h && this.matrix.appendMatrix(h), this
			}
		}, {
			key: "prepend",
			value: function(g, f, j, i, h) {
				return this.alpha *= f, this.shadow = this.shadow || j, this.compositeOperation = this.compositeOperation || i, this.visible = this.visible && g, h && this.matrix.prependMatrix(h), this
			}
		}, {
			key: "identity",
			value: function() {
				return this.visible = !0, this.alpha = 1, this.shadow = this.compositeOperation = null, this.matrix.identity(), this
			}
		}, {
			key: "clone",
			value: function() {
				return new b(this.alpha, null, null, this.visible, this.matrix.clone())
			}
		}]), b
	}(), aa = function(f, e) {
		var h = 10000,
			g = "matrix3d(" + (0 | e.a * h) / h + "," + (0 | e.b * h) / h + ",0,0," + (0 | e.c * h) / h + "," + (0 | e.d * h) / h + ",0,0,0,0,1,0," + (0 | e.tx + 0.5) + "," + (0 | e.ty + 0.5) + ",0,1)";
		f.transform = f.WebkitTransform = f.OTransform = f.msTransform = g
	}, Z = function(b) {
		function c(d) {
			ai(this, c);
			var e = ae(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this));
			return e.id = ++c.UIN, e._matrix = new ac, e.transformMatrix = null, e._skewX = 0, e._skewY = 0, e._regX = 0, e._regY = 0, e._rotation = 0, e._scaleY = e._scaleX = 1, e._alpha = 1, e._x = 0, e._y = 0, e._visible = !0, e.target = d, e._depth = 0, e.mask = null, e.width = 0, e.height = 0, e._props = new ab, e
		}
		return af(c, b), ah(c, [{
			key: "isVisible",
			value: function() {
				return this._alpha > 0 && this.visible
			}
		}, {
			key: "updateContext",
			value: function() {
				var e = this,
					d = (e.mask, e._props.matrix);
				this.getMatrix(d)
			}
		}, {
			key: "setTransform",
			value: function(r, q, p, o, n, m, l, k, j) {
				return this.x = r || 0, this.y = q || 0, this.scaleX = null == p ? 1 : p, this.scaleY = null == o ? 1 : o, this.rotation = n || 0, this.skewX = m || 0, this.skewY = l || 0, this.regX = k || 0, this.regY = j || 0, this
			}
		}, {
			key: "getMatrix",
			value: function(e) {
				var d = this,
					f = e && e.identity() || new ac;
				return d.transformMatrix ? f.copy(d.transformMatrix) : f.appendTransform(d.x, d.y, d.scaleX, d.scaleY, d.rotation, d.skewX, d.skewY, d.regX, d.regY)
			}
		}, {
			key: "getConcatenatedDisplayProps",
			value: function(e) {
				e = e ? e.identity() : new ab;
				var d = this,
					f = d.getMatrix(e.matrix);
				do {
					e.prepend(d.visible, d.alpha, d.shadow, d.compositeOperation), d != this && f.prependMatrix(d.getMatrix(d._props.matrix))
				} while (d = d.parent);
				return e
			}
		}, {
			key: "draw",
			value: function() {
				if(this.target) {
					var d = new ac;
					this._matrix = d.appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY), aa(this.target.style, this.matrix), this.alpha = this.alpha, this.visible = this.visible, this.depth = this.depth
				}
			}
		}, {
			key: "mask",
			set: function(d) {
				this.mask && this.mask.parent && (this.mask.parent.removeChild(this.mask), this.target.style.webkitMaskImage = this.target.style.maskImage = "", this.mask = null), this._mask = d, this.mask && this.mask.target && this.target && (this.target.style.webkitMaskImage = this.target.style.maskImage = "url('" + this.mask.target.toDataURL() + "');")
			},
			get: function() {
				return this._mask
			}
		}, {
			key: "depth",
			set: function(d) {
				this._depth = 100 * d, this.target && (this.target.style.zIndex = this.depth)
			},
			get: function() {
				return this._depth / 100
			}
		}, {
			key: "parent",
			set: function(d) {
				this._parent = d, d ? d.target.appendChild(this.target) : this.target && this.target.parentNode && this.target.parentNode.removeChild(this.target), this.draw()
			},
			get: function() {
				return this._parent
			}
		}, {
			key: "alpha",
			set: function(d) {
				this._alpha = d, this.target && (this.target.style.opacity = this.visible ? d : 0)
			},
			get: function() {
				return this._alpha
			}
		}, {
			key: "visible",
			set: function(d) {
				this._visible = d, this.alpha = this.alpha
			},
			get: function() {
				return this._visible
			}
		}, {
			key: "target",
			set: function(e) {
				var d;
				this._target = e, "string" == typeof e ? (d = new Image, d.src = e, this._target = d) : e && e instanceof HTMLImageElement && e.src && -1 != e.src.indexOf("blob:") && (d = new Image, d.src = e.src, d.id = "t_" + Math.floor(100 * Math.random()), this._target = d), this._target && (this._target.style.position = "absolute", this._target.style.transformOrigin = this._target.style.WebkitTransformOrigin = this._target.style.msTransformOrigin = this._target.style.MozTransformOrigin = this._target.style.OTransformOrigin = "0% 0%")
			},
			get: function() {
				return this._target
			}
		}, {
			key: "width",
			set: function() {
				this._width = 0
			},
			get: function() {
				return this._width
			}
		}, {
			key: "height",
			set: function(d) {
				this._height = d
			},
			get: function() {
				return this._height
			}
		}, {
			key: "matrix",
			get: function() {
				return this._matrix
			}
		}, {
			key: "x",
			set: function(d) {
				this._x = d
			},
			get: function() {
				return this._x
			}
		}, {
			key: "y",
			set: function(d) {
				this._y = d
			},
			get: function() {
				return this._y
			}
		}, {
			key: "rotation",
			set: function(d) {
				this._rotation = d
			},
			get: function() {
				return this._rotation
			}
		}, {
			key: "scaleX",
			set: function(d) {
				this._scaleX = d
			},
			get: function() {
				return this._scaleX
			}
		}, {
			key: "scaleY",
			set: function(d) {
				this._scaleY = d
			},
			get: function() {
				return this._scaleY
			}
		}, {
			key: "skewX",
			set: function(d) {
				this._skewX = d
			},
			get: function() {
				return this._skewX
			}
		}, {
			key: "skewY",
			set: function(d) {
				this._skewY = d
			},
			get: function() {
				return this._skewY
			}
		}, {
			key: "regX",
			set: function(d) {
				this._regX = d
			},
			get: function() {
				return this._regX
			}
		}, {
			key: "regY",
			set: function(d) {
				this._regY = d
			},
			get: function() {
				return this._regY
			}
		}]), c
	}(ad), Z.UIN = 0, Y = function(b) {
		function c(d) {
			ai(this, c);
			var e = ae(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this, d ? d : document.createElement("div")));
			return e.children = [], e
		}
		return af(c, b), ah(c, [{
			key: "getNumChildren",
			value: function() {
				return this.children.length
			}
		}, {
			key: "addChild",
			value: function(e) {
				var d, f;
				if(null == e) {
					return e
				}
				if(d = arguments.length, d > 1) {
					for(f = 0; d > f; f++) {
						arguments[f].depth = ++c._DEPTH, this.addChild(arguments[f])
					}
					return arguments[d - 1]
				}
				return e.parent && e.parent.removeChild(e), e.parent = this, this.children.push(e), e
			}
		}, {
			key: "addChildAt",
			value: function(g, f) {
				var h, j = arguments.length,
					i = arguments[j - 1];
				if(0 > i || i > this.children.length) {
					return arguments[j - 2]
				}
				if(j > 2) {
					for(h = 0; j - 1 > h; h++) {
						this.addChildAt(arguments[h], i + h)
					}
					return arguments[j - 2]
				}
				return g.parent && g.parent.removeChild(g), g.parent = this, this.children.splice(f, 0, g), this.children[f].depth = ++c._DEPTH, g
			}
		}, {
			key: "removeChildAt",
			value: function(h) {
				var l, k, j, i, g = arguments.length;
				if(g > 1) {
					for(l = [], k = 0; g > k; k++) {
						l[k] = arguments[k]
					}
					for(l.sort(function(e, d) {
							return d - e
						}), j = !0, k = 0; g > k; k++) {
						j = j && this.removeChildAt(l[k])
					}
					return j
				}
				return 0 > h || h > this.children.length - 1 ? !1 : (i = this.children[h], i && (i.parent = null), this.children.splice(h, 1), !0)
			}
		}, {
			key: "removeChild",
			value: function(f) {
				var h, g, e = arguments.length;
				if(e > 1) {
					for(h = !0, g = 0; e > g; g++) {
						h = h && this.removeChild(arguments[g])
					}
					return h
				}
				for(g = 0; g < this.children.length; g++) {
					if(this.children[g] == f) {
						return this.removeChildAt(g)
					}
				}
			}
		}, {
			key: "removeAllChildren",
			value: function() {
				for(var d = this.children; d.length;) {
					this.removeChildAt(0)
				}
			}
		}, {
			key: "getChildAt",
			value: function(d) {
				return this.children[d]
			}
		}, {
			key: "draw",
			value: function() {
				var f, d, h, g;
				for(ag(c.prototype.__proto__ || Object.getPrototypeOf(c.prototype), "draw", this).call(this), f = this.children.slice(), d = 0, h = f.length; h > d; d++) {
					g = f[d], g.isVisible() && (g.updateContext(), g.draw(), g.depth = ++c._DEPTH, g.mask && void 0 === g.mask.parent && this.addChild(g.mask))
				}
				return !0
			}
		}, {
			key: "getStage",
			value: function() {
				for(var d = this.parent; d;) {
					if(d instanceof X) {
						return d
					}
					d = d.parent
				}
			}
		}, {
			key: "numChildren",
			get: function() {
				return this.getNumChildren()
			}
		}]), c
	}(Z), Y._DEPTH = 0, X = function(b) {
		function c(d) {
			ai(this, c);
			var e = ae(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this, d ? d : document.createElement("div")));
			return e._depth = 1, e
		}
		return af(c, b), ah(c, [{
			key: "_tick",
			value: function() {
				Y._DEPTH = 0, this.draw()
			}
		}]), c
	}(Y), W = function(b) {
		function c(d) {
			ai(this, c);
			var e = ae(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this, document.createElement("div")));
			return e.initialize = c, e.spriteSheet = d, e
		}
		return af(c, b), ah(c, [{
			key: "gotoAndStop",
			value: function(e) {
				var d;
				this._currentFrame = e, this._initialized || (this._initialized = !0, d = this.spriteSheet, this.initialize(), this.spriteSheet = d), this.spriteSheet && (d = this.spriteSheet.getFrame(0 | this._currentFrame), this.target && (this.target.style.background = "url('" + d.image + "') " + -d.frame.x + "px " + -d.frame.y + "px", this.target.style.width = d.frame.width + "px", this.target.style.height = d.frame.height + "px", this.width = d.frame.width, this.height = d.frame.height))
			}
		}, {
			key: "spriteSheet",
			set: function(d) {
				this._spriteSheet = d
			},
			get: function() {
				return this._spriteSheet
			}
		}]), c
	}(Z), V = function L() {
		var b = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
			h = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
			g = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
			f = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
		ai(this, L), this.x = b, this.y = h, this.width = g, this.height = f
	}, U = function() {
		function b(a) {
			ai(this, b), this.data = a
		}
		return ah(b, [{
			key: "_parseData",
			value: function(f) {
				var e, h, g;
				for(this.frames = [], e = 0; e < f.images.length; e++) {
					h = f.images[e], "string" != typeof h && (h = h.src), f.images[e] = h
				}
				for(e = 0; e < f.frames.length; e++) {
					g = f.frames[e], this._addframe(f.images, g)
				}
			}
		}, {
			key: "_addframe",
			value: function(f, e) {
				var h = f[e[4] || 0],
					g = {
						image: h,
						frame: new V(e[0], e[1], e[2], e[3])
					};
				this.frames.push(g)
			}
		}, {
			key: "getFrame",
			value: function(c) {
				return this.frames[c] || null
			}
		}, {
			key: "data",
			set: function(c) {
				this._data = c, this.data && this._parseData(this.data)
			},
			get: function() {
				return this._data
			}
		}]), b
	}(), window.createjs = window.createjs || {}, S = createjs.Tween || {}, window.createjs = window.createjs || {}, Q = createjs.Ease || {}, window.createjs = window.createjs || {}, O = createjs.Timeline || {}, M = function(b) {
		function c(d) {
			ai(this, c);
			var e = ae(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this, d));
			return e.initialize = c, e
		}
		return af(c, b), ah(c, [{
			key: "draw",
			value: function() {
				ag(c.prototype.__proto__ || Object.getPrototypeOf(c.prototype), "draw", this).call(this)
			}
		}]), c
	}(Z), K = function() {
		function b() {
			ai(this, b)
		}
		return ah(b, null, [{
			key: "install",
			value: function() {
				S.installPlugin(b, ["startPosition"])
			}
		}, {
			key: "init",
			value: function(e, d, f) {
				return f
			}
		}, {
			key: "step",
			value: function() {}
		}, {
			key: "tween",
			value: function(h, g, l, k, j, i) {
				return h.target instanceof J ? 1 == i ? j[g] : k[g] : l
			}
		}]), b
	}(), K.priority = 100, J = function(b) {
		function c(f, k, j, i) {
			ai(this, c);
			var g = ae(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this));
			return !c.inited && c.init(), g.mode = f || c.INDEPENDENT, g.startPosition = k || 0, g.loop = j, g.currentFrame = 0, g.timeline = new O(null, i, {
				paused: !0,
				position: k,
				useTicks: !0
			}), g.paused = !1, g.actionsEnabled = !0, g.autoReset = !0, g.frameBounds = g.frameBounds || null, g.framerate = null, g._framerate = null, g._synchOffset = 0, g._prevPos = -1, g._prevPosition = 0, g._t = 0, g._managed = {}, g
		}
		return af(c, b), ah(c, [{
			key: "getLabels",
			value: function() {
				return this.timeline.getLabels()
			}
		}, {
			key: "getCurrentLabel",
			value: function() {
				return this.timeline.getCurrentLabel()
			}
		}, {
			key: "getDuration",
			value: function() {
				return this.timeline.duration
			}
		}, {
			key: "renderWebGL",
			value: function(d) {
				ag(c.prototype.__proto__ || Object.getPrototypeOf(c.prototype), "renderWebGL", this).call(this, d)
			}
		}, {
			key: "renderCanvas",
			value: function(d) {
				ag(c.prototype.__proto__ || Object.getPrototypeOf(c.prototype), "renderCanvas", this).call(this, d)
			}
		}, {
			key: "play",
			value: function() {
				this.paused = !1
			}
		}, {
			key: "stop",
			value: function() {
				this.paused = !0
			}
		}, {
			key: "gotoAndPlay",
			value: function(d) {
				this.paused = !1, this._goto(d)
			}
		}, {
			key: "gotoAndStop",
			value: function(d) {
				this.paused = !0, this._goto(d)
			}
		}, {
			key: "advance",
			value: function(h) {
				var l, k, j, i, g = c.INDEPENDENT;
				if(this.mode == g) {
					for(l = this, k = l.framerate;
						(l = l.parent) && null == k;) {
						l.mode == g && (k = l._framerate)
					}
					for(this._framerate = k, j = null != k && -1 != k && null != h ? h / (1000 / k) + this._t : 1, i = 0 | j, this._t = j - i; !this.paused && i--;) {
						this._prevPosition = this._prevPos < 0 ? 0 : this._prevPosition + 1
					}
				}
			}
		}, {
			key: "draw",
			value: function() {
				this.advance(createjs.Ticker.getMeasuredFPS()), this._updateTimeline(), ag(c.prototype.__proto__ || Object.getPrototypeOf(c.prototype), "draw", this).call(this)
			}
		}, {
			key: "_goto",
			value: function(e) {
				var d = this.timeline.resolve(e);
				null != d && (-1 == this._prevPos && (this._prevPos = 0 / 0), this._prevPosition = d, this._t = 0, this._updateTimeline())
			}
		}, {
			key: "_reset",
			value: function() {
				this._updateTimeline(), this._prevPos = -1, this._t = this.currentFrame = 0, this.paused = !1
			}
		}, {
			key: "_updateTimeline",
			value: function() {
				var x, w, v, u, t, s, r, q, p, k, g, z = this.timeline,
					y = this.mode != c.INDEPENDENT;
				if(z.loop = null == this.loop ? !0 : this.loop, x = y ? this.startPosition + (this.mode == c.SINGLE_FRAME ? 0 : this._synchOffset) : this._prevPos < 0 ? 0 : this._prevPosition, w = y || !this.actionsEnabled ? S.NONE : null, this.currentFrame = z._calcPosition(x), z.setPosition(x, w), this._prevPosition = z._prevPosition, this._prevPos != z._prevPos) {
					this.currentFrame = this._prevPos = z._prevPos;
					for(v in this._managed) {
						this._managed[v] = 1
					}
					for(u = z._tweens, t = 0, s = u.length; s > t; t++) {
						r = u[t], q = r._target, q == this || r.passive || (p = r._stepPosition, q instanceof Z ? this._addManagedChild(q, p) : this._setState(q.state, p))
					}
					for(k = this.children, t = k.length - 1; t >= 0; t--) {
						g = k[t].id, 1 == this._managed[g] && (this.removeChildAt(t), delete this._managed[g])
					}
				}
			}
		}, {
			key: "_setState",
			value: function(i, h) {
				var n, m, l, k, j;
				if(i) {
					for(n = i.length - 1; n >= 0; n--) {
						m = i[n], l = m.t, k = m.p;
						for(j in k) {
							l[j] = k[j]
						}
						this._addManagedChild(l, h)
					}
				}
			}
		}, {
			key: "_addManagedChild",
			value: function(e, d) {
				e._off || (this.addChildAt(e, 0), e instanceof c && (e._synchOffset = d, e.mode == c.INDEPENDENT && e.autoReset && !this._managed[e.id] && e._reset()), this._managed[e.id] = 2)
			}
		}, {
			key: "currentFrame",
			set: function(d) {
				this._currentFrame = d
			},
			get: function() {
				return this._currentFrame
			}
		}, {
			key: "labels",
			get: function() {
				return this.getLabels()
			}
		}, {
			key: "currentLabel",
			get: function() {
				return this.getCurrentLabel()
			}
		}, {
			key: "totalFrames",
			get: function() {
				return this.getDuration()
			}
		}, {
			key: "duration",
			get: function() {
				return this.getDuration()
			}
		}], [{
			key: "init",
			value: function() {
				c.inited || (K.install(), c.inited = !0)
			}
		}]), c
	}(Y), J.prototype.initialize = J, J.INDEPENDENT = "independent", J.SINGLE_FRAME = "single", J.SYNCHED = "synched", J.inited = !1, I = Object.freeze({
		Stage: X,
		DisplayProps: ab,
		Sprite: W,
		SpriteSheet: U,
		Tween: S,
		Ease: Q,
		Timeline: O,
		Bitmap: M,
		Rectangle: V,
		Container: Y,
		MovieClip: J,
		DisplayObject: Z
	}), H = function() {
		function b() {
			var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
				a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
			ai(this, b), this.setSize(e, a)
		}
		return ah(b, [{
			key: "setSize",
			value: function(d, c) {
				this._width = d, this._height = c
			}
		}, {
			key: "_exactFit",
			value: function(d, c) {
				return {
					x: 0,
					y: 0,
					width: this.width,
					height: this.height,
					scaleX: d / this.width,
					scaleY: c / this.height,
					rotation: 0
				}
			}
		}, {
			key: "_noBorder",
			value: function(f, e) {
				var h = this.height / this.width,
					g = 1;
				return g = e / f > h ? e / this.height : f / this.width, {
					x: 0,
					y: 0,
					width: this.width * g,
					height: this.height * g,
					scaleX: g,
					scaleY: g,
					rotation: 0
				}
			}
		}, {
			key: "_noScale",
			value: function() {
				return {
					x: 0,
					y: 0,
					width: this.width,
					height: this.height,
					scaleX: 1,
					scaleY: 1,
					rotation: 0
				}
			}
		}, {
			key: "_showAll",
			value: function(f, e) {
				var h = this.height / this.width,
					g = 1;
				return g = e / f > h ? f / this.width : e / this.height, {
					x: 0,
					y: 0,
					width: this.width * g,
					height: this.height * g,
					scaleX: g,
					scaleY: g,
					rotation: 0
				}
			}
		}, {
			key: "_exactWidth",
			value: function(d) {
				var c = 1;
				return c = d / this.width, {
					x: 0,
					y: 0,
					width: this.width * c,
					height: this.height * c,
					scaleX: c,
					scaleY: c,
					rotation: 0
				}
			}
		}, {
			key: "_exactHeight",
			value: function(e, d) {
				var f = 1;
				return f = d / this.height, {
					x: 0,
					y: 0,
					width: this.width * f,
					height: this.height * f,
					scaleX: f,
					scaleY: f,
					rotation: 0
				}
			}
		}, {
			key: "update",
			value: function(z, y, x) {
				var v, u, t, s, r, q, p, o, n, w = "h" == this.type.toLocaleLowerCase();
				switch(w ? 0 != x ? (v = z, u = y) : (v = y, u = z) : 0 == x ? (v = z, u = y) : (v = y, u = z), s = !1, this.scaleMode.toLowerCase()) {
					case "exactfit":
						t = this._exactFit(v, u);
						break;
					case "noborder":
						s = !0, t = this._noBorder(v, u);
						break;
					case "noscale":
						s = !0, t = this._noScale(v, u);
						break;
					case "showall":
						s = !0, t = this._showAll(v, u);
						break;
					case "width":
						s = !0, t = this._exactWidth(v, u);
						break;
					case "height":
						s = !0, t = this._exactHeight(v, u);
						break;
					default:
						t = {
							x: 0,
							y: 0,
							width: v,
							height: u,
							scaleX: 1,
							scaleY: 1,
							rotation: x
						}
				}
				if(w) {
					switch(x) {
						case -90:
						case 90:
							t.rotation = 0;
							break;
						default:
							t.rotation = -90
					}
				} else {
					t.rotation = x
				}
				if(r = -90 != t.rotation && (!w || 0 != t.rotation), q = 1 * (v - t.width), p = 1 * (u - t.height), s) {
					switch(this.align.toLowerCase()) {
						case "l":
							t.x = r && 0 != t.rotation ? q : 0, t.y = (u - t.height) / 2;
							break;
						case "t":
							t.x = (v - t.width) / 2, t.y = r ? 0 : w ? 0 != t.rotation ? p : 0 : p;
							break;
						case "r":
							t.x = r ? v - t.width - (0 == t.rotation ? 0 : q) : v - t.width, t.y = (u - t.height) / 2;
							break;
						case "b":
							t.x = (v - t.width) / 2, t.y = r ? u - t.height : w ? 0 != t.rotation ? 0 : p : 0;
							break;
						case "lt":
						case "tl":
							t.x = r && 0 != t.rotation ? q : 0, t.y = r ? 0 : w ? 0 != t.rotation ? p : 0 : p;
							break;
						case "tr":
						case "rt":
							t.x = r ? v - t.width - (0 == t.rotation ? 0 : q) : v - t.width, t.y = r ? 0 : w ? 0 != t.rotation ? p : 0 : p;
							break;
						case "bl":
						case "lb":
							t.x = r && 0 != t.rotation ? q : 0, t.y = r ? u - t.height : w ? 0 != t.rotation ? 0 : p : 0;
							break;
						case "br":
						case "rb":
							t.x = r ? v - t.width - (0 == t.rotation ? 0 : q) : v - t.width, t.y = r ? u - t.height : w ? 0 != t.rotation ? 0 : p : 0;
							break;
						default:
							t.x = (v - t.width) / 2, t.y = (u - t.height) / 2
					}
				}
				return 0 != t.rotation && (o = t.x, n = t.y, -90 == t.rotation ? (t.x = t.scaleY * this.height + n, t.y = o) : (t.y = t.scaleX * this.width + o, t.x = n)), t
			}
		}, {
			key: "type",
			set: function(c) {
				this._type = c
			},
			get: function() {
				return this._type
			}
		}, {
			key: "align",
			set: function(c) {
				this._align = c
			},
			get: function() {
				return this._align
			}
		}, {
			key: "scaleMode",
			set: function(c) {
				this._scaleMode = c
			},
			get: function() {
				return this._scaleMode
			}
		}, {
			key: "width",
			set: function(c) {
				this._width = c
			},
			get: function() {
				return this._width
			}
		}, {
			key: "height",
			set: function(c) {
				this._height = c
			},
			get: function() {
				return this._height
			}
		}]), b
	}(), H.EXACT_FIT = "exactfit", H.NO_BORDER = "noborder", H.NO_SCALE = "noscale", H.SHOW_ALL = "showall", H.WIDTH = "width", H.HEIGHT = "height", G = {
		width: 400,
		height: 400,
		scale: "exactfit",
		rotation: "auto",
		align: "",
		mode: "v"
	}, F = function(f, e) {
		var h = 10000,
			g = "matrix3d(" + (0 | e.a * h) / h + "," + (0 | e.b * h) / h + ",0,0," + (0 | e.c * h) / h + "," + (0 | e.d * h) / h + ",0,0,0,0,1,0," + (0 | e.tx + 0.5) + "," + (0 | e.ty + 0.5) + ",0,1)";
		f.transform = f.WebkitTransform = f.OTransform = f.msTransform = g
	}, T = function() {
		function b(a) {
			ai(this, b), this.matrix = new ac, this._stage = new H(G.width, G.height), this.target = a
		}
		return ah(b, [{
			key: "update",
			value: function(g, f, j) {
				if("v" == this.options.rotation.toLocaleLowerCase() && (this.target.style.display = 0 != j ? "none" : "block"), "h" == this.options.rotation.toLocaleLowerCase() && (this.target.style.display = 0 == j ? "none" : "block"), "auto" == this.options.rotation.toLocaleLowerCase() && (this.target.style.display = "block"), "block" == this.target.style.display) {
					var i = this._stage.update(g, f, j),
						h = new ac;
					h.rotate(-i.rotation), h.tx = i.x, h.ty = i.y, h.scale(i.scaleX, i.scaleY), this.matrix = h, F(this.target.style, this.matrix)
				}
			}
		}, {
			key: "options",
			set: function(c) {
				this._options = c, this.target && (this.target.setAttribute("view-width", c.width), this.target.setAttribute("view-height", c.height), this.target.setAttribute("view-scale", c.scale), this.target.setAttribute("view-rotation", c.rotation), this.target.setAttribute("view-align", c.align), this.target.setAttribute("view-mode", c.mode)), this._stage.width = this.options.width, this._stage.height = this.options.height, this._stage.align = this.options.align, this._stage.scaleMode = this.options.scale, this._stage.type = c.mode
			},
			get: function() {
				return this._options
			}
		}, {
			key: "matrix",
			set: function(c) {
				this._matrix = c
			},
			get: function() {
				return this._matrix
			}
		}, {
			key: "parent",
			set: function(c) {
				this._parent = c
			},
			get: function() {
				return this._parent
			}
		}, {
			key: "target",
			set: function(e) {
				var d, f;
				if(this._target = e, e) {
					e.style.position = "absolute", e.style.transformOrigin = e.style.WebkitTransformOrigin = e.style.msTransformOrigin = e.style.MozTransformOrigin = e.style.OTransformOrigin = "0% 0%", d = {
						width: Number(e.getAttribute("view-width")),
						height: Number(e.getAttribute("view-height")),
						scale: e.getAttribute("view-scale"),
						rotation: e.getAttribute("view-rotation"),
						align: e.getAttribute("view-align"),
						mode: e.getAttribute("view-mode")
					};
					for(f in d) {
						d[f] || (d[f] = G[f])
					}
					e.style.width = d.width + "px", e.style.height = d.height + "px", e.style.overflow = "hidden", this.options = d
				}
			},
			get: function() {
				return this._target
			}
		}]), b
	}(), R = function(b) {
		function c() {
			ai(this, c);
			var d = ae(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this));
			return d.init(), d
		}
		return af(c, b), ah(c, [{
			key: "init",
			value: function() {
				this._list = [], this._orientation = window.orientation || 0, addEventListener("DOMContentLoaded", this._onContentLoaded.bind(this)), addEventListener("orientationchange", this._onOrientation.bind(this)), addEventListener("resize", this._onResize.bind(this))
			}
		}, {
			key: "_onOrientation",
			value: function() {
				void 0 !== window.orientation && (this._orientation = window.orientation), this.createTime()
			}
		}, {
			key: "_onResize",
			value: function() {
				void 0 === window.orientation && (this._orientation = window.innerWidth < window.innerHeight ? 0 : 90, this._onOrientation()), this.createTime()
			}
		}, {
			key: "_onContentLoaded",
			value: function() {
				addEventListener("DOMNodeInserted", this._onInserted.bind(this)), addEventListener("DOMNodeRemoved", this._onRemoved.bind(this)), this._onInserted({
					target: document.body
				})
			}
		}, {
			key: "_onRemoved",
			value: function(d) {
				this._removeItem(d.target)
			}
		}, {
			key: "_onInserted",
			value: function(d) {
				this._checkNodes(d.target)
			}
		}, {
			key: "_checkNodes",
			value: function(h) {
				var l, k, i, g = h.childNodes;
				if(h.getAttribute && (l = h.getAttribute("view-mode"), l && !this._checkItem(h) && this._checkParent(h))) {
					try {
						k = new T(h)
					} catch(j) {}
					this._addItem(k)
				}
				for(i = 0; i < g.length; i++) {
					k = h.childNodes[i], this._checkNodes(k)
				}
			}
		}, {
			key: "_checkParent",
			value: function(e) {
				var d = e.parentNode;
				return d && d != document ? d.getAttribute("view-mode") ? !1 : this._checkParent(d) : !0
			}
		}, {
			key: "_addItem",
			value: function(d) {
				this._removeItem(d), this._list.push(d), void 0 === window.orientation && (this._orientation = window.innerWidth < window.innerHeight ? 0 : 90), this.createTime()
			}
		}, {
			key: "_checkItem",
			value: function(e) {
				for(var d = 0; d < this._list.length; d++) {
					if(this._list[d].target == e) {
						return !0
					}
				}
				return !1
			}
		}, {
			key: "_removeItem",
			value: function(e) {
				for(var d = 0; d < this._list.length; d++) {
					if(this._list[d].target == e) {
						return void this._list.slice(d, 1)
					}
				}
			}
		}, {
			key: "_update",
			value: function() {
				var f, e, h, g;
				for(f = window.innerWidth, e = window.innerHeight, h = 0; h < this._list.length; h++) {
					g = this._list[h], g.update(f, e, this._orientation)
				}
			}
		}, {
			key: "createTime",
			value: function() {
				var d, e = this;
				clearTimeout(this._tid), d = 0, this._tid = setInterval(function() {
					e._update(), d++, d > 10 && clearTimeout(e._tid)
				}, 100), this._update()
			}
		}, {
			key: "orientation",
			get: function() {
				return this._orientation
			}
		}], [{
			key: "getInstance",
			value: function() {
				return c._instance ? c._instance : c._instance = new c
			}
		}]), c
	}(ad), R._instance = null, R.getInstance(), aj.clip = I, aj.DomLayout = R
}(this.MMD = this.MMD || {});