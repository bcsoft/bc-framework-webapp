bc.cropImage = {
	/** 初始化 */
	init : function(option) {
		$page = $(this);
		var preWidth = option.preWidth;//预览区的宽度
		var preHeight = option.preHeight;//预览区的高度
		var jcrop_api;
		var boundWidth,boundHeight;
		var ratio = false;
		
		//Jcrop初始化
		var jcropOption = {
			onChange : doUpdate,
			onSelect : doUpdate 
		};
		if(option.preWidth && option.preHeight){
			//设置裁剪区的长宽比例
			ratio = option.preWidth/option.preHeight;
			jcropOption.aspectRatio = ratio;
		}
		$page.find('#source').Jcrop(jcropOption, function() {
			jcrop_api = this;
			// 获取img图片的css尺寸并记录
			var bounds = this.getBounds();
			boundWidth = bounds[0];
			boundHeight = bounds[1];
			logger.info("boundWidth=" + boundWidth + ",boundHeight=" + boundHeight);
			
			//预设置预览区为接近整张图片
			//jcrop_api.animateTo([option.boundWidth/4, option.boundHeight/4,option.boundWidth/2, option.boundHeight/2]);
			var w = boundWidth;
			var h = Math.round(boundWidth/ratio);
			if(h > boundHeight){
				h = boundHeight;
				w =  Math.round(boundHeight*ratio);
			}
			logger.info("w=" + w + ",h=" + h);
			updatePreview({w:w,h:h,x:0,y:0},boundWidth,boundHeight,preWidth,preHeight);
		});
		
		//根据裁剪区的参数更新预览区的图片
		function doUpdate(crop) {
			updatePreview(crop,boundWidth,boundHeight,preWidth,preHeight);
		}
		
		/**更新预览区的图片
		 * 
		 * @param crop 裁剪区的尺寸和定位
		 * @param boundWidth 原图所在img的css宽度
		 * @param boundHeight 原图所在img的css高度
		 * @param preWidth 裁剪预览区的宽度
		 * @param preHeight 裁剪预览区的高度
		 */
		function updatePreview(crop,boundWidth,boundHeight,preWidth,preHeight) {
			if (parseInt(crop.w) > 0) {
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

		alert("ok");
	}
};