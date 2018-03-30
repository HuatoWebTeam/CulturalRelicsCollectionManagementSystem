
import jQuery from 'jquery';
/*eslint-disable */      //  有些插件写的可能比较早没有代码检查，这里可以禁用一下，避免报错。
(function($){
	$.easing["jswing"] = $.easing["swing"];

	$.extend($.easing, {
		def: "easeOutQuad",
		swing: function(x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return $.easing[$.easing.def](x, t, b, c, d);
		},
		easeInQuad: function(x, t, b, c, d) {
		return c * (t /= d) * t + b;
		},
		easeOutQuad: function(x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
		},
		easeInOutQuad: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * (--t * (t - 2) - 1) + b;
		},
		easeInCubic: function(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
		},
		easeOutCubic: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
		},
		easeInOutCubic: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
		},
		easeInQuart: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
		},
		easeOutQuart: function(x, t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		easeInOutQuart: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},
		easeInQuint: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
		},
		easeOutQuint: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		easeInOutQuint: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		easeInSine: function(x, t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		easeOutSine: function(x, t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		easeInOutSine: function(x, t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		},
		easeInExpo: function(x, t, b, c, d) {
		return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		},
		easeOutExpo: function(x, t, b, c, d) {
		return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		easeInOutExpo: function(x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function(x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		},
		easeOutCirc: function(x, t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		},
		easeInOutCirc: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		},
		easeInElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * 0.3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return (
			-(
			a *
			Math.pow(2, 10 * (t -= 1)) *
			Math.sin((t * d - s) * (2 * Math.PI) / p)
			) + b
		);
		},
		easeOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * 0.3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return (
			a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) +
			c +
			b
		);
		},
		easeInOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d / 2) == 2) return b + c;
		if (!p) p = d * (0.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1)
			return (
			-0.5 *
				(a *
				Math.pow(2, 10 * (t -= 1)) *
				Math.sin((t * d - s) * (2 * Math.PI) / p)) +
			b
			);
		return (
			a *
			Math.pow(2, -10 * (t -= 1)) *
			Math.sin((t * d - s) * (2 * Math.PI) / p) *
			0.5 +
			c +
			b
		);
		},
		easeInBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		easeOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		easeInOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1)
			return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
		},
		easeInBounce: function(x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
		},
		easeOutBounce: function(x, t, b, c, d) {
		if ((t /= d) < 1 / 2.75) {
			return c * (7.5625 * t * t) + b;
		} else if (t < 2 / 2.75) {
			return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
		} else if (t < 2.5 / 2.75) {
			return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
		} else {
			return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
		}
		},
		easeInOutBounce: function(x, t, b, c, d) {
		if (t < d / 2)
			return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
		return (
			jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
		);
		}
	});
	$.fn.scroller = function(options) {
		var D = {
			element: 'a',
			direction: 'horizontal',
			container: {
				name: 'inside',
				easing: 'easeOutBack',
				duration: 800
			},
			options: {
				margin: -20,
				zoom: 1.5,
				easing: ['easeOutBack', 'easeOutBounce'],
				duration: [300, 500]
			},
			onclick: function(a, img){},
			onmouseover: function(a, img){},
			onmouseout: function(a, img){}
		} // default settings
		
		var S = $.extend(true, D, options); 
		
		return this.each(function(){
			var M = $(this),
				IN = M.find('.'+S.container.name),
				E = M.find(S.element),
				I, DIR, MW, MH, C, 
				P = {
					init: function(){
						this._globals.init();
						this._container.init();
						this._position.init();
						this.events.init();
					},
					_globals: {
						init: function(){
							D = {
								w: M.width(),
								h: M.height()
							},
							I = {
								w: E.width(),
								h: E.height()
							},
							DIR = S.direction,
							MW = I.w+S.options.margin,
							MH = I.h+S.options.margin;
						}
					},
					_container: {
						init: function(){
							this.dimensions();
							this.center();
						},
						dimensions: function(){
							var css = {}
							if (DIR == 'horizontal'){
								css.width = E.length*MW;
							} else if (DIR == 'vertical') {
								css.height = E.length*MH;
							}
							IN.css(css);
							C = {
								w: IN.width(),
								h: IN.height()
							}
						},
						center: function(){
							var css = {}, l = E.length;
							if (DIR == 'horizontal'){
								css.left = -(l*MW)/l*2-MW/2;
							} else if (DIR == 'vertical') {
								css.top = -(l*MH)/l*2;
							}
							IN.css(css);
						}
					},
					_position: {
						init: function(){
							this.set();
						},
						set: function(){
							E.each(function(i){
								var t = $(this),
									img = t.find('img'),
									src = img.attr('src');
								if (DIR == 'horizontal'){
									var x = MW*i,
										css = {
											left: parseInt(x),
											top: 0
										}
								} else if (DIR == 'vertical'){
									var y = MH*i,
										css = {
											left: 0,
											top: parseInt(y)
										}
								}
								css.background = 'url('+src+') no-repeat center';
								img.hide();
								t.css(css);
							});
						}
					},
					_helper: {
						zoomin: function(){
							var zoom = S.options.zoom,
								easing = S.options.easing[0],
								duration = S.options.duration[0],
								animation = {
									width: I.w*zoom,
									height: I.h*zoom,
									marginLeft:(I.w-I.w*zoom)/2,
									marginTop:(I.h-I.h*zoom)/2
								},
								css = {
									zIndex: 10
								}
							return {
								animation: animation,
								easing: easing,
								css: css,
								duration: duration
							}
						},
						zoomout: function(){
							var easing = S.options.easing[1],
								duration = S.options.duration[1],
								animation = {
									width: I.w,
									height: I.h,
									marginLeft: 0,
									marginTop: 0
								},
								css = {
									zIndex: 1
								}
							return {
								animation: animation,
								easing: easing,
								css: css,
								duration: duration
							}
						},
						animate: function(t, o){
							t.css(o.css).stop(true, true).animate(o.animation, o.duration, o.easing);
						}
					},
					events: {
						init: function(){
							this.hover();
							this.click();
						},
						hover: function(){
							E.bind('mouseover mouseleave', function(e){
								var t = $(this), img = t.find('img');
									if (e.type == 'mouseover'){
										var h = P._helper.zoomin();
										S.onmouseover.call(this, t, img);
									} else {
										var h = P._helper.zoomout();
										S.onmouseout.call(this, t, img);
									}
								if (!t.hasClass('active')) {
									P._helper.animate(t, h);
								}
							});	
						},
						click: function(){
							E.click(function(){
								var t = $(this), img = t.find('img'), container = S.container,
									position = t.position(), y = position.top, x = position.left,
									animate = {};
								if (DIR == 'horizontal'){
									animate.left = -x+D.w/2-MW/2;
								} else if (DIR == 'vertical') {
									animate.top = -y+D.h/2-MH/2;
								}
								if (!t.hasClass('active')){
									var zoomin = P._helper.zoomin(),
										zoomout = P._helper.zoomout();
									
									P._helper.animate(E, zoomout);
									P._helper.animate(t, zoomin);
									
									E.removeClass('active');
									t.addClass('active');
								}
								IN.animate(animate, container.duration, container.easing);
								S.onclick.call(this, t, img);
								return false;
							});
						}
					}
				}
			P.init();
		});
	};
}(jQuery));
/*eslint-enable */
export default jQuery;