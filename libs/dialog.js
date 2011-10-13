/*
 * jQuery UI Dialog 的扩展:(source:1.9pre Live from Git Thu Sep 29 10:15:03 UTC 2011)
 * 1)增加containment参数，控制对话框拖动的限制范围
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
				.appendTo( self.options.appendTo || "body" ),

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
	
	/** 增加containment参数，控制对话框拖动的限制范围 */
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
	
		if(self.options.containment){
			self.uiDialog.draggable({
				cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
				handle: ".ui-dialog-titlebar",
				containment: self.options.containment,//这里是增加的代码
				start: function( event, ui ) {
					$( this )
						.addClass( "ui-dialog-dragging" );
					self._trigger( "dragStart", event, filteredUi( ui ) );
				},
				drag: function( event, ui ) {
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
		}else{
			self.uiDialog.draggable({
				containment: false,
			    handle: '.ui-dialog-titlebar'
			});
		}
	}
});

}(jQuery));
