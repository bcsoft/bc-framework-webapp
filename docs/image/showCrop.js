bc.cropImage = {
	/** jcrop原始图片区的宽度 */
	FIX_WIDTH : 400,
	/** 初始化 */
	init : function(option) {
		$page = $(this);
		var preWidth = option.preWidth;// 预览区的宽度
		var preHeight = option.preHeight;// 预览区的高度
		var jcrop_api;
		var boundWidth, boundHeight;
		var ratio = false;

		// Jcrop初始化
		var jcropOption = {
			onChange : doUpdate,
			onSelect : doUpdate,
			boxWidth : 400,
			boxHeight : 350
		};
		if (option.preWidth && option.preHeight) {
			// 设置裁剪区的长宽比例
			ratio = option.preWidth / option.preHeight;
			jcropOption.aspectRatio = ratio;
		}
		$page.find('#source').Jcrop(
				jcropOption,
				function() {
					jcrop_api = this;
					$page.data("jcrop_api", this);// 保存为页面数据
					// 获取img图片的css尺寸并记录
					var bounds = this.getBounds();
					boundWidth = bounds[0];
					boundHeight = bounds[1];
					logger.info("bound:w=" + bounds[0] + ",h=" + bounds[1]);

					// 预设置预览区为接近整张图片
					var w = boundWidth;
					var h = Math.round(boundWidth / ratio);
					if (h > boundHeight) {
						h = boundHeight;
						w = Math.round(boundHeight * ratio);
					}
					logger.info("w=" + w + ",h=" + h);
//					updatePreview({
//						w : w,
//						h : h,
//						x : 0,
//						y : 0
//					}, boundWidth, boundHeight, preWidth, preHeight);
					
//					 jcrop_api.animateTo([option.boundWidth/4,
//					 					 option.boundHeight/4,option.boundWidth/2,
//					 					 option.boundHeight/2]);
				});

		// 根据裁剪区的参数更新预览区的图片
		function doUpdate(crop) {
			$page.find("#ignore").val("false");
			updatePreview(crop, boundWidth, boundHeight, preWidth, preHeight);
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
		function updatePreview(crop, boundWidth, boundHeight, preWidth,
				preHeight) {
			if (parseInt(crop.w) > 0) {
				logger.info("crop:w=" + crop.w + ",h=" + crop.h + ",x="
						+ crop.x + ",y=" + crop.y);
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
				$page.find("img").remove();
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
	}
};