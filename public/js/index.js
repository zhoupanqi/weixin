
function imgLoadFnss() {

	if(window.L1) return;
	window.L1 = 1;
	var canvas = $('#canvas')[0];

	//alert(canvas.toDataURL('image/jpeg'))

	//$('.succimg').attr('src' , canvas.toDataURL('image/jpeg'))

	//					$('.s9-1').addClass('scale');
	//					if(Wheight < 1000) {
	//						$('.s9-iconbox').css('transform', 'scale(.9)')
	//					} else {
	//						$('.s9-btn').css('bottom', (Wheight - 1000) / -4)
	//					}

	var canvas2 = $('<canvas width="750" height="1206"></canvas>')[0];

	var ctx2 = canvas2.getContext('2d');

	ctx2.drawImage(canvas, 0, 0);
	//					ctx2.drawImage($('.qrcode')[0], 528, 1290);

	$('.yaz').append('<img src="' + canvas2.toDataURL('image/jpeg') + '" class="opacity0">');

	//					$('.zhuquan9').hide().css('left', 0);
	//					swipeUpFn();
	//					$('.ajaxloading').hide();

};

function getPixelRatio(context) {
	var backingStore = context.backingStorePixelRatio ||
		context.webkitBackingStorePixelRatio ||
		context.mozBackingStorePixelRatio ||
		context.msBackingStorePixelRatio ||
		context.oBackingStorePixelRatio ||
		context.backingStorePixelRatio || 1;
	return(window.devicePixelRatio || 1) / backingStore;
}
$(function() {
	var Wheight = $(window).height() / $(window).width() * 750;
	$('#viewbox').attr('view-height', $(window).height() / $(window).width() * 750)
	var plane = document.querySelector('#plane');
	var ticket = document.querySelector('#ticket');
	var button_gz = document.querySelector('#button_gz');
	var title = document.querySelector('#title');
	var but = document.querySelector('#but');
	var s4 = document.querySelector('#s4');
	css(plane, "scale", 20);
	css(plane, "translateX", -1000);
	css(ticket, "opacity", 0);
	css(ticket, "scale", 100);
	css(button_gz, "translateX", 235);
	css(title, "scale", 50);
	css(title, "opacity", 0);
	css(but, "opacity", 0);
	var bgm=document.getElementById('bgm');
	var imgList = [
		'img/01.png',
		'img/02.png',
		'img/03.png',
		'img/04.png',
		'img/05.png',
		'img/06.png',
		'img/07.png',
		'img/address.png',
		'img/btn_cp.png',
		'img/button_gz.png',
		'img/button.png',
		'img/confirm.png',
		'img/earth.png',
		'img/gifbg.gif',
		'img/img2.png',
		'img/phon.png',
		'img/plane.png',
		'img/planss.png',
		'img/popup.png',
		'img/ticket.png',
		'img/title.png',
		'img/title2.png',
		'img/xj.png',
		'img/xuanz.png'
	]
	var p = new imageLoad({
		progress: function(i, count) {
			var percentt = Math.floor((i / count) * 100);
			//			console.log(percentt);
			//			console.log(i,count)
			$('.loading_number').html(parseInt(percentt) + '%');
			if(i == count) {
				//				console.log('a');
				setTimeout(function(){
					$('.load').fadeOut(function() {
						init();
					});
				},1000)
				bgm.play();
				document.addEventListener("WeixinJSBridgeReady", function() {
					bgm.play();
				}, false);
				//				bgm.play();
				//				document.addEventListener("WeixinJSBridgeReady", function() {
				//					bgm.play();
				//				}, false);
			}
		},
		timeOut: 5,
		timeOutCB: function(res) {
			console.log('timeout=', res);
		}
	})
	p.load(imgList)
		.then(function(res) {
			//		console.log(res);
		})
		.catch(function(err) {
			//		console.log(err);
		})

	function init() {
		MTween({
			el: plane,
			target: {
				scale: 100,
				translateX: 0
			},
			time: 3000,
			type: 'linear',
			callBack: function() {
				css(ticket, "opacity", 100);
				MTween({
					el: ticket,
					target: {
						translateY: 110,
						scale: 450
					},
					time: 2000,
					type: 'linear',
					callBack: function() {

					}
				});
				setTimeout(function() {
					MTween({
						el: plane,
						target: {
							translateX: 800,
							translateY: 180
						},
						time: 2000,
						type: 'linear',
						callBack: function() {
							button_gzFn();
						}
					})
				}, 1000)
			}
		})
	}

	function button_gzFn() { //规则
		MTween({
			el: button_gz,
			target: {
				translateX: 0
			},
			time: 700,
			type: 'bounceOut',
			callBack: function() {
				css(title, "opacity", 100);
				MTween({
					el: title,
					target: {
						scale: 100
					},
					time: 500,
					type: 'bounceOut',
					callBack: function() {
						butFn();
					}
				});
				ruleFn();
			}
		});
	}

	function butFn() { //取票
		MTween({
			el: but,
			target: {
				opacity: 100
			},
			time: 500,
			type: 'linear',
			callBack: function() {
				qbtn_Fn();
			}
		});
	}

	function ruleFn() { //点击规则
		button_gz.addEventListener('click', function() {
			$('.popupbox').fadeIn(function() {
				$('.close').click(function() {
					$('.popupbox').fadeOut();
				})
			});
		})
	};

	function qbtn_Fn() {
		but.addEventListener('click', function() {
			$('.plane01').hide();
			$('.plane02').fadeIn();
		});
	}
	var clipArea = new bjj.PhotoClip("#clipArea", { //拍照照
		size: [372, 372],
		outputSize: [372, 372],
		file: "#file",
		//					view: "#view",
		ok: "#clipBtn",
		loadStart: function() {
			console.log("照片读取中");
		},
		loadComplete: function() {
			console.log("照片读取完成");
			$('#clipArea').show();
			$('#clipBtn').show();
			//						$('.xz').show();
		},
		clipFinish: function(dataURL) {
			$('.imgfile').attr('src', dataURL);
			$('#clipArea').fadeOut();
			$('#clipBtn').fadeOut();
			//						$('.xz').hide();
			console.log(dataURL);
		}
	});
	var currentShowCity = 0;
	$("#province").change(function() {
		$("#province option").each(function(i, o) {
			if(o.selected) {
				$(".city").hide();
				$(".city").eq(i).show();
				currentShowCity = i;
			}
		});
	});
	var continent = '',
		country = '';
	$('.btn').click(function() {
		var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if($("#province").val() == '' || $("#province").val() == '选择洲') {
			new Toast('请选择洲...').show();
			return;
		} else if(!myreg.test($('#phone').val())) {
			new Toast('请输入手机或手机号不正确...').show();
			return;
		}
		$(".city").each(function(i, o) {
			if(i == currentShowCity) {
				country = $(".city").eq(i).val();
			}
		});
		var textimg = $('.imgfile').attr('src');
		$('.imgbj').attr('src', textimg);
		continent = $("#province").val();
		switch(continent) {
			case '亚洲':
				$('.succimg').attr('src', 'img/01.png');
				break;
			case '欧洲':
				$('.succimg').attr('src', 'img/02.png');
				break;
			case '北美洲':
				$('.succimg').attr('src', 'img/03.png');
				break;
			case '南美洲':
				$('.succimg').attr('src', 'img/04.png');
				break;
			case '非洲':
				$('.succimg').attr('src', 'img/05.png');
				break;
			case '大洋洲':
				$('.succimg').attr('src', 'img/06.png');
				break;
			case '南极洲':
				$('.succimg').attr('src', 'img/07.png');
				break;
			default:
				break;
		}
		$('.plane_photobox').hide();
		$('.speakbox').fadeIn();
	})
	$('#txtare_id').focus(function() {
		if($(this).val() == '我希望...') {
			$(this).val('');
		}
	});
	$('#txtare_id').blur(function() {
		if($(this).val() == '') {
			$(this).val('我希望...');
		}
	});
	
	$('.btn_cp').click(function() {
		if($('#txtare_id').val() == '我希望...' || $('#txtare_id').val() == '') {
			new Toast('请输入我的希望...').show();
			return;
		}
		$('.plane02,.speakbox').hide();
		$('.speak').html($('#txtare_id').val());
		$('.country').html(country);
		$('.plane03').fadeIn(function() {
			MTween({
				el: s4,
				target: {
					opacity:100
				},
				time: 700,
				type: 'linear',
				callBack: function() {

				}
			});
			var shareContent = document.getElementById('s4'); // 需要绘制的部分的 (原生）dom 对象 ，注意容器的宽度不要使用百分比，使用固定宽度，避免缩放问题
			var width = shareContent.offsetWidth; // 获取(原生）dom 宽度
			var height = shareContent.offsetHeight+500; // 获取(原生）dom 高
			var offsetTop = shareContent.offsetTop; //元素距离顶部的偏移量

			var canvas = document.createElement('canvas'); //创建canvas 对象
			var context = canvas.getContext('2d');
			var scaleBy = getPixelRatio(context); //获取像素密度的方法 (也可以采用自定义缩放比例)
			canvas.width = width * scaleBy; //这里 由于绘制的dom 为固定宽度，居中，所以没有偏移
			canvas.height = (height + offsetTop) * scaleBy; // 注意高度问题，由于顶部有个距离所以要加上顶部的距离，解决图像高度偏移问题
			context.scale(scaleBy, scaleBy);
			var opts = {
				allowTaint: true, //允许加载跨域的图片
				tainttest: true, //检测每张图片都已经加载完成
				scale: scaleBy, // 添加的scale 参数
				canvas: canvas, //自定义 canvas
				logging: true, //日志开关，发布的时候记得改成false
				width: width, //dom 原始宽度
				height: height //dom 原始高度
			};
			html2canvas(shareContent, opts).then(function(canvas) {
				var urls = canvas.toDataURL("image/jpeg"); //base64数据
				$('#s4').append('<img src="' + urls + '" class="opacity0">');
			});
		})
	});
	$('.button_up').click(function(){
		$('.plane03').hide()
		$('.plane02,.plane_photobox').fadeIn();
		$('#s4').find('.opacity0').remove();
//		css(s4, "opacity", 0);
	})
})
//提示语句
var Toast = function(message) {
	this.top = ($(window).height() / 2);
	//	this.left = message.left;
	this.time = 3000;
	this.init(message);
}
Toast.prototype = {
	init: function(message) {
		$('#toastMessage').remove();
		var txt = '<span id="toastMessage">' + message + '</span>';
		$('body').append(txt);
		var bottom = this.top == null ? '20px' : '50%';
		var left = (($(window).width() - $('#toastMessage').width()) / 2) - 12;
		$('#toastMessage').css({
			'position': 'fixed',
			'left': left,
			'bottom': bottom,
			'z-index': '80',
			'background-color': '#000',
			'color': 'white',
			'font-size': '14px',
			'padding': '5px 12px',
			'border-radius': '4px',
			'-moz-border-radius': '4px',
			'-webkit-border-radius': '4px'
		});
		$('#toastMessage').hide();
	},
	show: function() {
		$('#toastMessage').fadeIn(this.time / 2);
		$('#toastMessage').fadeOut(this.time / 2);
	}
};