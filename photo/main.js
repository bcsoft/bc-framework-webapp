bc.namespace("bc.photo.handler");
bc.photo.handler = {
	/** 初始化 */
	init: function () {
		// 浏览器支持检测
		if (!window.FileReader) {
			alert("你的浏览器不支持window.FileReader接口，无法处理！");
			return;
		}
		// 浏览器兼容性处理
		window.URL = window.URL || window.webkitURL || window.mozURL
			|| window.msURL;
		navigator.getUserMedia = navigator.getUserMedia
			|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia
			|| navigator.msGetUserMedia;

		var $form = this;

		// 默认值
		var defaultImage = {};
		$form.data("image", defaultImage);

		var $displayContainer = $form.find(".container");
		var $imgDisplayer = $displayContainer.children("img");
		var $imgProxy = $form.find("img.proxy");
		var $canvasProxy = $form.find("canvas.proxy");
		$imgProxy.attr("src", $imgDisplayer.attr("src"));

		var $indicator = $form.find(".indicator");
		// 取消按钮
		$indicator.find("a").click(function (e) {
			$indicator.css("border", "0");
			$indicator.data("ignore", false);
			$indicator.hide();
			$imgDisplayer.show();
			return false;
		});

		// 修改图片名称
		$form.find("input[name='name']").change(function () {
			var image = $form.data("image");
			image.name = this.value;
		});

		// 窗口大小变动后重新处理显示区的缩放
		$form.on("dialogresize", function (e, ui) {
			bc.photo.handler.resize.call($form, $displayContainer, $imgDisplayer, $imgProxy);
		});
		$form.trigger("dialogresize");

		// 支持文件拖动的处理:dragover和drop是必须的
		$(document).on({
			dragstart: function (e) {
				$indicator.data("ignore", true);
				console.log("document.dragstart");
			},
			dragenter: function (e) {
				e.originalEvent.dataTransfer.dropEffect = 'move';
				console.log("document.dragenter");
				if (!$displayContainer.data("ignore")) {
					// 显示拖放到这里的指示
					$indicator.css("border", "4px dashed #666");
					$indicator.show();
					$imgDisplayer.hide();
				}
			},
			dragover: function (e) {
				e.stopPropagation();
				e.preventDefault();//取消默认浏览器拖拽效果
				//console.log("document.dragover");
			},
			drop: function (e) {
				e.stopPropagation();
				e.preventDefault();//取消默认浏览器拖拽效果
				console.log("document.drop");
				if ($(e.target).is(".container,.container *")
					&& e.originalEvent.dataTransfer.files
					&& e.originalEvent.dataTransfer.files.length) {
					console.log("document.drop.ok");
					var file = e.originalEvent.dataTransfer.files[0];
					bc.photo.handler.showImage.call($form, $imgProxy, file);
				}
				$indicator.css("border", "0");
				$indicator.data("ignore", false);

				$indicator.hide();
				$imgDisplayer.show();
			}
		});

		// 根据图片的实际大小调整显示区，保证图片整张显示
		$imgProxy.on("load", function (e) {
			$imgDisplayer.attr("src", $imgProxy.attr("src"));
			bc.photo.handler.resize.call($form, $displayContainer, $imgDisplayer, $imgProxy);
			console.log(this.width + "x" + this.height);

			// 显示图片信息
			bc.photo.handler.showInfo.call($form);
		});

		// 底部工具条容器
		var $tb = $form.closest(".ui-dialog").find(".ui-dialog-buttonpane");
		// 打开图片事件
		$tb.find("#openImageBtn>span.ui-button-text").html('<div'
			+ ' style="position:relative;width:100%;height:100%;white-space:nowrap;">打开图片'
			+ '<input type="file" class="uploadFile" name="uploadFile" title="打开图片" multiple="true"'
			+ ' style="position:absolute;left:0;top:0;width:100%;height:100%;filter:alpha(opacity=10);opacity:0;cursor:pointer;"/>'
			+ '</div>');
		$tb.find(":file.uploadFile").change(function (e) {
			// 判断是否选中文件：如果曾经选中过文件，再打开对话框选择"取消"按钮，change事件也会执行
			if (!this.files || this.files.length == 0) {
				console.log("no file selected");
				return false;
			}

			// 判断文件类型：只支持png、jpg格式
			for (var i = 0; i < this.files.length; i++) {
				//console.log(this.files[i]);
				var index = this.files[i].name.lastIndexOf(".");
				var type = "";
				if (index != -1) {
					type = this.files[i].name.substr(index + 1);
				}
				type = type.toLowerCase();
				if (type != "png" && type != "jpg") {
					alert("只能打开 png 或 jpg 格式的图片！");
					return false;
				}
			}

			// 显示图片：TODO 多选的处理
			var file = this.files[0];
			bc.photo.handler.showImage.call($form, $imgProxy, file);
		});
		// 裁剪控件的创建与销毁
		var $statusBar = $form.find(".statusBar");
		$form.find("button.crop").click(function () {
			this.disabled = true;
			$form.find("button.destroy")[0].disabled = false;
			$imgDisplayer.Jcrop({
				bgOpacity: 0.6,                     // 遮罩的透明度
				bgColor: 'rgba(0,0,0,0)',           // 背景色
				//aspectRatio: 1/1,                 // 宽高比
				//minSize: [10,10],                   // 最小尺寸
				onSelect: function (c) {        // 选择完毕事件
					console.log("onSelect");
					$statusBar.html("x1=" + c.x + "<br>y1=" + c.y + "<br>x2=" + c.x2 + "<br>y2=" + c.y2 + "<br>w=" + c.w + "<br>h=" + c.h);
					$form.data("cropData", c);
				},
				onChange: function (c) {        // 选择区正在移动事件
					console.log("onChange");
					// 显示图片信息
					bc.photo.handler.showInfo.call($form);

					$statusBar.html("x1=" + c.x + "<br>y1=" + c.y + "<br>x2=" + c.x2 + "<br>y2=" + c.y2 + "<br>w=" + c.w + "<br>h=" + c.h);
				},
				onRelease: function () {// 选择区被释放事件
					console.log("onRelease");
					$form.removeData("cropData");
				}
			}, function () {
				$form.data("jcrop", this);
			});
		});
		$form.find("button.destroy").click(function () {
			// 用户选中的区域数据，没有选中时为null
			var c = $form.data("cropData");
			console.log(c);

			// 释放资源
			var jcrop = $form.data("jcrop");
			jcrop && jcrop.release();
			jcrop && jcrop.destroy();
			$form.removeData("jcrop");

			// 裁剪图片
			if (c) {
				var canvas = $canvasProxy[0];
				var ctx = canvas.getContext('2d');

				// 计算缩放比例
				var rw = $imgProxy[0].width;
				var vw = $imgDisplayer.width();
				var scale = rw / vw;
				console.log("rw=" + rw + ",vw=" + vw);
				console.log("scaleW=" + scale);
				//console.log("scaleH=" + ($imgProxy[0].height / $imgDisplayer.height()));
				var sx = c.x * scale;
				var sy = c.y * scale;
				var sw = c.w * scale;
				var sh = c.h * scale;

				// 获取裁剪区的数据并显示
				canvas.width = sw;
				canvas.height = sh;
				ctx.clearRect(0, 0, sw, sh);//清除画布上的指定区域
				ctx.drawImage($imgProxy[0], sx, sy, sw, sh, 0, 0, sw, sh);
				var data = canvas.toDataURL("image/png");
				$imgProxy.attr("src", data);
				var image = $form.data("image");
				image.data = data;
				bc.photo.handler.resize.call($form, $displayContainer, $imgDisplayer, $imgProxy);
			}

			// 恢复控件状态
			$form.find("button.crop")[0].disabled = false;
			this.disabled = true;
		});
	},
	/** 显示指定的图片 */
	showInfo: function () {
		var $form = this;
		var image = $form.data("image");
		var cropData = $form.data("cropData");
		var $info = $form.find(".info");
		var imgProxy = $form.find("img.proxy")[0];
		var info = image.type + " " + imgProxy.width + "x" + imgProxy.height;
		if (cropData) {
			info += " > " + cropData.w + "x" + cropData.h;
		}
		$info.html(info);
	},
	/** 显示指定的图片 */
	showImage: function ($imgProxy, file) {
		var $form = this;

		// 文件类型
		var image = $form.data("image");
		image.type = file.name.substr(file.name.lastIndexOf(".") + 1).toLowerCase();   // 文件类型：扩展名
		var $type = $form.find("input[name='type']");
		if($type.val() == ""){
			$type.val(image.type);
		}

		// 文件名称
		var fileName = file.name.substring(0, file.name.lastIndexOf(".")); // 文件名称：不含扩展名
		var $name = $form.find("input[name='name']");
		var name = $name.val();
		if (!name || $.trim(name).length == 0) {
			image.name = fileName;
			$name.val(fileName).attr("title", fileName);// 更改名称
		} else {
			image.name = name;// 不更改名称：因为用户指定或已修改过
		}

		// 读取文件并显示
		var reader = new window.FileReader();
		reader.onload = function (e) {
			//console.log(e.target.result);
			// 将图片数据加载到图片代理控件
			$imgProxy.attr("src", e.target.result);
			image.data = e.target.result;
		};
		reader.readAsDataURL(file);
	},

	/** 重新处理显示区的缩放 */
	resize: function ($displayContainer, $imgDisplayer, $imgProxy) {
		//console.log("todo:resize");
		var iw = $imgProxy[0].width;
		var ih = $imgProxy[0].height;
		var iwh = iw / ih;// 图片的实际宽高比
		var cw = $displayContainer[0].clientWidth;
		var ch = $displayContainer[0].clientHeight;
		var cwh = cw / ch;// 显示区的宽高比
		//console.log(iw + "/" + ih + "=" + iwh + ", " + cw + "/" + ch + "=" + cwh);
		var sw, sh, padding = 20;
		if (iwh < cwh) {//  限定高度，宽度自由缩放
			$imgDisplayer.css({
				width: "auto",
				height: ch - padding + "px"
			});
		} else {// 限定宽度，高度自由缩放
			$imgDisplayer.css({
				width: cw - padding + "px",
				height: "auto"
			});
		}
	},

	/** 完成 */
	ok: function () {
		var $form = $(this);
		var image = $form.data("image");
		//image.path = "201310/201310290940430660.jpg";
		$.ajax({
			method: "post",
			dataType: "json",
			url: bc.root + "/bc/photo/upload",
			data: image,
			success: function (json) {
				console.log(json);
				if (json.success) {
					$form.data("data", json);
					$form.dialog("close");
				} else {
					bc.msg.info(json.msg);
				}
			},
			error: function (e) {
				alert("上传图片异常！");
			}
		});
	},

	/** 拍照 */
	captureCamera: function () {
		var $form = $(this);
		var $video = $form.find("video");
		$video.show();

		// 如果摄像头已连接，返回不处理
		if ($video.data("connected"))
			return false;

		// 绑定video的事件
		$video.on({
			loadeddata: function (e) {
				var video = $video[0];
				console.log('video.loadeddata:' + video.videoWidth + 'x' + video.videoHeight);
			},
			// 双击截图
			dblclick: function (e) {
				console.log("dblclick");
				bc.photo.handler.snapshot.call($form, $video);
			}
		});

		// 摄像头连接配置
		var constraints = {
			audio: false,
			video: {
				mandatory: {
					minWidth: "800",
					minHeight: "600"
				}
			}
		};

		// 摄像头连接成功的回调函数:
		function successCallback(stream) {
			console.log("camera connected successful");
			// 记录已连接成功
			$video.data("connected", true);

			var video = $video[0];
			// Firefox 使用mozSrcObject的属性，而Opera和Chrome使用src属性。
			// Chrome 使用createObjectURL的方法，而Firefox和Opera直接发送视频流。
			if (video.mozSrcObject !== undefined) {
				video.mozSrcObject = stream;
			} else {
				video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
			}
		}

		// 摄像头连接失败的回调函数
		function errorCallback(e) {
			console.log(e);
			if (e.name = "PERMISSION_DENIED") {
				bc.msg.info('摄像头已被禁止访问！如果使用Chrome浏览器，请到"设置/显示高级设置.../隐私设置/内容设置.../媒体/管理例外情况..."中更改。');
			} else {
				bc.msg.info("无法连接摄像头：" + e.name);
				//alert('getUserMedia() not supported in your browser.');
			}
			$video.hide();
		}

		// 连接摄像头
		var camera = navigator.getUserMedia(constraints, successCallback, errorCallback);
	},
	snapshot: function ($video) {
		var $form = $(this);
		var video = $video[0];
		var canvas = $form.find("canvas")[0];
		var ctx = canvas.getContext('2d');

		// 注：不是设置style.width|height属性，而是设置setAttribute('width|height')
		// 如果不设置会导致裁剪
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		//drawImage函数有三种函数原型：
		//drawImage(image, dx, dy)
		//drawImage(image, dx, dy, dw, dh)
		//drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
		//第一个参数image可以用HTMLImageElement，HTMLCanvasElement或者HTMLVideoElement作为参数。
		//dx和dy是image在canvas中定位的坐标值；dw和dh是image在canvas中即将绘制区域（相对dx和dy坐标的偏移量）的宽度和高度值；
		//sx和sy是image所要绘制的起始位置，sw和sh是image所要绘制区域（相对image的sx和sy坐标的偏移量）的宽度和高度值。
		ctx.drawImage(video, 0, 0);// 1：1全图显示
		//ctx.drawImage(video, 0, 0, width * scale.value, height * scale.value);// 全图按比例缩放到指定区域显示
		//ctx.drawImage(video, 0, 0,400,300,0,0, width * scale.value, height * scale.value);// 显示选中的区域全图显示
		//ctx.drawImage(video, 400, 300,400,300,100,100, 400,300);// 显示选中的区域1:1显示

		// 显示截图
		var image = $form.data("image");
		image.type = "png";
		image.name = "video";
		image.data = canvas.toDataURL("image/png");
		$form.find("img.proxy")[0].src = image.data;

		// 隐藏video控件
		$video.hide();
	},

	/** 下载 */
	download: function () {
		console.log("download");
		var $form = $(this);
		var image = $form.data("image");
		if (image.data.indexOf(",") == image.data.length - 1) {
			bc.msg.info("没有图像数据！");
			return false;
		}

		// 将mime-type改为image/octet-stream，强制让浏览器直接download
		var imageData = image.data.replace('image/' + image.type, 'image/octet-stream');
		var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
		save_link.href = imageData;
		save_link.download = image.name + "." + image.type;

		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		save_link.dispatchEvent(event);
	}
};