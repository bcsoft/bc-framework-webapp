bc.cropImage = {
	/** jcrop原始图片区的宽度 */
	FIX_WIDTH : 400,
	/** 初始化 */
	init : function(option) {
		$page = $(this);
		var preWidth = option.preWidth;// 预览区的宽度
		var preHeight = option.preHeight;// 预览区的高度
		var ratio = false;
		var jcrop_api;

		// Jcrop初始化
		var jcropOption = {
			onChange : doUpdate,
			onSelect : doUpdate,
			boxWidth : 400,
			boxHeight : 350,
			minSize: [16,16]
		};
		if (option.preWidth && option.preHeight) {
			// 设置裁剪区的长宽比例
			ratio = option.preWidth / option.preHeight;
			jcropOption.aspectRatio = ratio;
		}
		$page.find('#source').Jcrop(jcropOption, function() {
			jcrop_api = this;
			$page.data("jcrop_api", this);// 保存为页面数据
			// 获取img图片的css尺寸并记录
			var bounds = this.getBounds();
			//var widgetSize = jcrop_api.getWidgetSize();
			$page.find("#zoomInfo").html(Math.round(bounds[0]) + "x" + Math.round(bounds[1]));// + " --> " + widgetSize[0] + "x" + widgetSize[1] + ")");

			//setSelect | animateTo
			jcrop_api.animateTo(bc.cropImage.getRandomArea.call($page[0]));
		});

		// 根据裁剪区的参数更新预览区的图片
		function doUpdate(crop) {
			$page.find("#ignore").val("false");
			var bounds = jcrop_api.getBounds();
			updatePreview(crop, bounds[0], bounds[1], preWidth, preHeight);
		}

		/**
		 * 更新预览区的图片
		 * 
		 * @param crop
		 *            裁剪区的尺寸和定位
		 * @param boundWidth
		 *            原图所在img的css宽度
		 * @param boundHeight
		 *            原图所在img的css高度
		 * @param preWidth
		 *            裁剪预览区的宽度
		 * @param preHeight
		 *            裁剪预览区的高度
		 */
		function updatePreview(crop, boundWidth, boundHeight, preWidth, preHeight) {
			if (parseInt(crop.w) > 0) {
				logger.info("bound:w=" + boundWidth + ",h=" + boundHeight);
				logger.info("pre:w=" + preWidth + ",h=" + preHeight);
				logger.info("crop:w=" + crop.w + ",h=" + crop.h + ",x=" + crop.x + ",y=" + crop.y);
				var rx = preWidth / crop.w;
				var ry = preHeight / crop.h;
				$page.find('#preview').css({
					width : Math.round(rx * boundWidth) + 'px',
					height : Math.round(ry * boundHeight) + 'px',
					marginLeft : '-' + Math.round(rx * crop.x) + 'px',
					marginTop : '-' + Math.round(ry * crop.y) + 'px'
				});
			}
		}
	},

	/** 点击确认按钮的处理 */
	onOk : function() {
		$page = $(this);
		var ignore = $page.find("#ignore").val();
		if("true" == ignore){
			$page.dialog("close");
			return;
		}

		// 获取本页的jcrop对象
		var jcrop_api = $page.data("jcrop_api");
		var bounds = jcrop_api.getBounds();
		var crop = jcrop_api.tellSelect();
		var imgRealSize = bc.cropImage.getImageRealSize(document
				.getElementById("source"));
		logger.info("real:w=" + imgRealSize[0] + ",h=" + imgRealSize[1]);
		logger.info("bound:w=" + bounds[0] + ",h=" + bounds[1]);
		logger.info("crop:w=" + crop.w + ",h=" + crop.h + ",x=" + crop.x
				+ ",y=" + crop.y);
		
		var data = {
			cw:crop.w,
			ch:crop.h,
			cx:crop.x,
			cy:crop.y,
			preWidth:$page.find("input:hidden[name='preWidth']").val(),
			preHeight:$page.find("input:hidden[name='preHeight']").val()
		};
		var id = $page.find("input:hidden[name='id']").val();
		if(id && id.length > 0){// 编辑现有附件
			data.id = id;
		}else{//
			var empty = $page.find("input:hidden[name='empty']").val();
			if(empty && empty.length > 0)
				data.empty = empty;
		}
		
		// 使用ajax上传处理参数
		bc.ajax({
			dataType:"json",
			data:data,
			url:bc.root + "/bc/image/doCrop",
			success : function(json) {
				logger.info("success:" + $.param(json));
				jcrop_api.destroy();
				$page.data("data-status",json);
				$page.removeData("jcrop_api");
				$page.dialog("close");
			}
		});
	},

	originImage : null,
	/** 获取图片原始尺寸的大小 */
	getImageRealSize : function(img) {
		if (bc.cropImage.originImage == null)
			bc.cropImage.originImage = new Image();

		var oImg = bc.cropImage.originImage;
		if (oImg.src != img.src) {
			oImg.src = img.src;
		}

		return [ oImg.width, oImg.height ];
	},
	
	/** 获取靠近中间的区域 */
	getRandomArea : function(jcrop_api) {
		//return [0,0,110,140];
		var $page = $(this);
		var jcrop_api = $page.data("jcrop_api");
		var preWidth = parseInt($page.find("input:hidden[name='preWidth']").val());
		var preHeight = parseInt($page.find("input:hidden[name='preHeight']").val());
		var ratio = preWidth / preHeight;// 裁剪区的长宽比例
		var bounds = jcrop_api.getBounds();//原图尺寸
		var widgetSize = jcrop_api.getWidgetSize();//crop区的尺寸
		logger.info("-bound:w=" + bounds[0] + ",h=" + bounds[1]);
		logger.info("-widget:w=" + widgetSize[0] + ",h=" + widgetSize[1]);
		logger.info("-pre:w=" + preWidth + ",h=" + preHeight);
		
		var w,h,x,y;
		if(bounds[0] > preWidth){
			if(bounds[1] > preHeight){
				w = preWidth;
				h = preHeight;
				x = Math.round((bounds[0] - w)/2);
				y = Math.round((bounds[1] - h)/2);
			}else{
				h = Math.round(bounds[1]);
				w = Math.round(h * ratio);
				x = Math.round((bounds[0] - w)/2);
				y = 0;
			}
		}else{
			if(bounds[1] > preHeight){
				w = Math.round(bounds[0]);
				h = Math.round(w / ratio);
				x = 0;
				y = Math.round((bounds[1] - h)/2);
			}else{
				w = Math.round(bounds[0]);
				h = Math.round(bounds[1]);
				x = 0;
				y = 0;
			}
		}
		logger.info("-random:w=" + w + ",h=" + h + ",x=" + x + ",y=" + y + ",x2=" + (x+w) + ",y2=" + (y+h));

		// [x,y,x2,y2]
		return [x,y,x+w,y+h];
	},
	
	/** 文件上传完毕后的回调函数 */
	finishUpload: function(json,text){
		//alert(text);
		var $page = $(this);
		
		var newImgUrl = bc.root + '/bc/image/download?id=' + json.msg.id;
		
		//更改图片的地址
		var srcImg = $page.find("#source,#preview").attr("src",newImgUrl);//.filter("#source").show()[0];
		var jcrop_api = $page.data("jcrop_api");
		jcrop_api.setImage(newImgUrl,function(){
			var b = this.getBounds();
			//logger.info("b:w=" + b[0] + ",h=" + b[1]);
			
			// 自动选中靠近中间的区域
			this.animateTo(bc.cropImage.getRandomArea.call($page[0]));
			
			//界面显示新图片的尺寸
			$page.find("#zoomInfo").html(b[0] + "x" + b[1]);
		});
		
		//记录新的附件id
		$page.find("input:hidden[name='id']").val(json.msg.id);
		
		$page.find("#ignore").val("false");
	}
};