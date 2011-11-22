/*
 * jQuery UI Dialog 的扩展:(source:1.9pre Live from Git Thu Sep 29 10:15:03 UTC 2011)
 * 1)增加containment参数，控制对话框拖动的限制范围
 * 2)增加dragLimit参数，控制对话框拖动的范围
 */
(function( $, undefined ) {
	
/** copy过来的局部变量 */
var uiDialogClasses = "ui-dialog ui-widget ui-widget-content ui-corner-all ",
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	};

$.extend($.ui.dialog.prototype.options, {
	appendTo: "body",
	dragLimit: [0,80,30,20]//上,右,下,左
});
$.extend($.ui.dialog.prototype.options.position, {
	// 修改为避免对话框顶部超出容器的top或left
	using: function( pos ) {
		//logger.info("pos=" + $.toJSON(pos));
		if ( pos.top < 0 ) {
			pos.top = 10;
		}
		if ( pos.left < 0 ) {
			pos.left = 10;
		}
		$( this ).css( pos );
	}
});

$.extend($.ui.dialog.prototype, {

	/** 增加最小化、最大化按钮 */
	_create: function() {
		this.originalTitle = this.element.attr( "title" );
		// #5742 - .attr() might return a DOMElement
		if ( typeof this.originalTitle !== "string" ) {
			this.originalTitle = "";
		}

		this.options.title = this.options.title || this.originalTitle;
		var self = this,
			options = self.options,

			title = options.title || "&#160;",
			titleId = $.ui.dialog.getTitleId( self.element ),

			uiDialog = ( self.uiDialog = $( "<div>" ) )
				.addClass( uiDialogClasses + options.dialogClass )
				.css({
					display: "none",
					outline: 0, // TODO: move to stylesheet
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				.attr( "tabIndex", -1)
				.keydown(function( event ) {
					if ( options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
							event.keyCode === $.ui.keyCode.ESCAPE ) {
						self.close( event );
						event.preventDefault();
					}
				})
				.attr({
					role: "dialog",
					"aria-labelledby": titleId
				})
				.mousedown(function( event ) {
					self.moveToTop( false, event );
				})
				.appendTo( self.options.appendTo),

			uiDialogContent = self.element
				.show()
				.removeAttr( "title" )
				.addClass( "ui-dialog-content ui-widget-content" )
				.appendTo( uiDialog ),

			uiDialogTitlebar = ( self.uiDialogTitlebar = $( "<div>" ) )
				.addClass( "ui-dialog-titlebar  ui-widget-header  " +
					"ui-corner-all  ui-helper-clearfix" )
				.prependTo( uiDialog ),

			uiDialogTitlebarClose = $( "<a href='#'></a>" )
				.addClass( "ui-dialog-titlebar-close  ui-corner-all" )
				.attr( "role", "button" )
				.click(function( event ) {
					event.preventDefault();
					self.close( event );
				})
				.appendTo( uiDialogTitlebar ),

			uiDialogTitlebarCloseText = ( self.uiDialogTitlebarCloseText = $( "<span>" ) )
				.addClass( "ui-icon ui-icon-closethick" )
				.text( options.closeText )
				.appendTo( uiDialogTitlebarClose ),

			uiDialogTitle = $( "<span>" )
				.addClass( "ui-dialog-title" )
				.attr( "id", titleId )
				.html( title )
				.prependTo( uiDialogTitlebar );

		uiDialogTitlebar.find( "*" ).add( uiDialogTitlebar ).disableSelection();
		this._hoverable( uiDialogTitlebarClose );
		this._focusable( uiDialogTitlebarClose );

		if ( options.draggable && $.fn.draggable ) {
			self._makeDraggable();
		}
		if ( options.resizable && $.fn.resizable ) {
			self._makeResizable();
		}

		self._createButtons( options.buttons );
		self._isOpen = false;

		if ( $.fn.bgiframe ) {
			uiDialog.bgiframe();
		}
	},
	
	/** 
	 * 1)修改创建button的方式
	 */
	_createButtons: function( buttons ) {
		var self = this,
			hasButtons = false;

		// if we already have a button pane, remove it
		self.uiDialog.find( ".ui-dialog-buttonpane" ).remove();

		if ( typeof buttons === "object" && buttons !== null ) {
			$.each( buttons, function() {
				return !(hasButtons = true);
			});
		}
		if ( hasButtons ) {
			var uiDialogButtonPane = $( "<div>" )
					.addClass( "ui-dialog-buttonpane  ui-widget-content ui-helper-clearfix" ),
				uiButtonSet = $( "<div>" )
					.addClass( "ui-dialog-buttonset" )
					.appendTo( uiDialogButtonPane );

			$.each( buttons, function( name, props ) {
				if(props && props.html ){
					//这里是添加的扩展处理，让按钮支持使用ToolbarButton生成的html代码
					uiButtonSet.append(props.html);
				}else{
					props = $.isFunction( props ) ?
						{ click: props, text: name } :
						props;
					
					var button = $( "<button type='button'>" )
						.attr( props, true )
						.unbind( "click" )
						.click(function() {
							props.click.apply( self.element[0], arguments );
						})
						.appendTo( uiButtonSet );
					if ( $.fn.button ) {
						button.button();
					}
				}
			});
			self.uiDialog.addClass( "ui-dialog-buttons" );
			uiDialogButtonPane.appendTo( self.uiDialog );
		} else {
			self.uiDialog.removeClass( "ui-dialog-buttons" );
		}
	},
	
	/** 
	 * 1)增加containment参数，控制对话框拖动的限制范围；
	 * 2)增加dragLimit参数，控制对话框拖出容器的范围；
	 */
	_makeDraggable: function() {
		var self = this,
		options = self.options,
		doc = $( document );

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}
	
		self.uiDialog.draggable({
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			containment: self.options.containment,//这里是修改的代码
			start: function( event, ui ) {
				$( this )
					.addClass( "ui-dialog-dragging" );
				self._trigger( "dragStart", event, filteredUi( ui ) );
			},
			drag: function( event, ui ) {
				if(!self.options.containment && options.dragLimit){
					var parent =  $(options.appendTo);
					var minTop = options.dragLimit[0];
					var maxTop = parent.height() - options.dragLimit[2];
					var minLeft = options.dragLimit[3] - self.uiDialog.width();
					var maxLeft = parent.width() - options.dragLimit[1];
					//logger.info("parent:" + $.toJSON(parent.position()) + ",w" + parent.width() + ",h" + parent.height());
					//logger.info("position:" + $.toJSON(ui.position));
					
					//控制top
					if(ui.position.top > maxTop){
						ui.position.top = maxTop;
					}else if(ui.position.top < minTop){
						ui.position.top = minTop;
					}
					
					//控制left
					if(ui.position.left > maxLeft){
						logger.info("maxLeft:" + maxLeft);
						ui.position.left = maxLeft;
					}else if(ui.position.left < minLeft){
						ui.position.left = minLeft;
					}
				}
				self._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				options.position = [
					ui.position.left - doc.scrollLeft(),
					ui.position.top - doc.scrollTop()
				];
				$( this )
					.removeClass( "ui-dialog-dragging" );
				self._trigger( "dragStop", event, filteredUi( ui ) );
				$.ui.dialog.overlay.resize();
			}
		});
	}
});

//遮罩的扩展
$.extend( $.ui.dialog.overlay, {
	create: function( dialog ) {
		if ( this.instances.length === 0 ) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ( $.ui.dialog.overlay.instances.length ) {
					$( document ).bind( $.ui.dialog.overlay.events, function( event ) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event (#3523)
						if ( $( event.target ).zIndex() < $.ui.dialog.overlay.maxZ ) {
							return false;
						}
					});
				}
			}, 1 );

			// allow closing by pressing the escape key
			$( document ).bind( "keydown.dialog-overlay", function( event ) {
				if ( dialog.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
					event.keyCode === $.ui.keyCode.ESCAPE ) {
					
					dialog.close( event );
					event.preventDefault();
				}
			});

			// handle window resize
			$( window ).bind( "resize.dialog-overlay", $.ui.dialog.overlay.resize );
		}

		var $el = ( this.oldInstances.pop() || $( "<div>" ).addClass( "ui-widget-overlay" ) )
			.appendTo( dialog.options.appendTo || document.body )//修改的代码
			.css({
				width: this.width(),
				height: this.height()
			});

		if ( $.fn.bgiframe ) {
			$el.bgiframe();
		}

		this.instances.push( $el );
		return $el;
	}
});

}(jQuery));
