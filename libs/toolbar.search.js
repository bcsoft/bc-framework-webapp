/*
 * 工具条的高级搜索按钮
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function($) {

var idIncrement = 0;

$.widget( "ui.bcsearch", {
	version: "1.0",
	options: {
		position: {
			my: "left top",
			at: "left bottom"
		},
//		show: {
//			effect: "slideDown",
//			duration: "fast"
//		},
		hide: {
			effect: "fadeOut",
			duration: "fast"
		},
		useCleanButton: false
	},
	_create: function() {
		if ( !this.options.trigger ) {
			this.options.trigger = this.element.prev();
		}

		if ( !this.element.attr( "id" ) ) {
			this.element.attr( "id", "ui-popup-" + idIncrement++ );
			this.generatedId = true;
		}

		if ( !this.element.attr( "role" ) ) {
			// TODO alternatives to tooltip are dialog and menu, all three aren't generic popups
			this.element.attr( "role", "dialog" );
			this.generatedRole = true;
		}

		this.options.trigger
			.attr( "aria-haspopup", "true" )
			.attr( "aria-owns", this.element.attr( "id" ) );

		this.element
			.addClass( "ui-popup" );
		this._beforeClose();
		this.element.hide();
		
		// 添加关闭按钮
		var $this = this;
		if(this.element.children(".closeBtn").size() == 0){
			this.element.append('<a href="#" class="closeBtn ui-corner-all" title="点击关闭"><span class="ui-icon ui-icon-closethick">关闭</span></a>');
			this.element.children(".closeBtn").click(function(event){
				$this.close( event );
				return false;
			})
			.hover(
				function(){
					$(this).toggleClass("ui-state-hover");
				},
				function(){
					$(this).toggleClass("ui-state-hover");
				}
			);
		}
		
		// 添加搜索按钮
		if(this.element.children(".operate").size() == 0){
			var tpl = '<div class="operate">';
			
			// 搜索按钮
			tpl += '<button class="bc-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" '+
						'data-click="bc.toolbar.doAdvanceSearch">'+
						'<span class="ui-button-icon-primary ui-icon ui-icon-search"></span>'+
						'<span class="ui-button-text">查询</span>'+
					'</button>';
			
			// 清空按钮
			if(this.options.useCleanButton){
				tpl += '<button class="bc-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" type="button" '+
							'data-click="bc.toolbar.doAdvanceClean">'+
							'<span class="ui-button-icon-primary ui-icon ui-icon-minus"></span>'+
							'<span class="ui-button-text">清空</span>'+
						'</button>';
			}
			
			tpl += '</div>';

			this.element.append(tpl);
		}

		this._bind(this.options.trigger, {
			keydown: function( event ) {
				// prevent space-to-open to scroll the page, only happens for anchor ui.button
				if ( $.ui.button && this.options.trigger.is( "a:ui-button" ) && event.keyCode == $.ui.keyCode.SPACE ) {
					event.preventDefault();
				}
				// TODO handle SPACE to open popup? only when not handled by ui.button
				if ( event.keyCode == $.ui.keyCode.SPACE && this.options.trigger.is( "a:not(:ui-button)" ) ) {
					this.options.trigger.trigger( "click", event );
				}
				// translate keydown to click
				// opens popup and let's tooltip hide itself
				if ( event.keyCode == $.ui.keyCode.DOWN ) {
					// prevent scrolling
					event.preventDefault();
					this.options.trigger.trigger( "click", event );
				}
			},
			click: function( event ) {
				event.preventDefault();
				if (this.isOpen) {
					// let it propagate to close
					return;
				}
				clearTimeout( this.closeTimer );
				this._delay(function() {
					this.open( event );
				}, 1);
			}
		});

		if ( !$.ui.menu || !this.element.is( ":ui-menu" ) ) {
			// default use case, wrap tab order in popup
			this._bind({ keydown : function( event ) {
					if ( event.keyCode !== $.ui.keyCode.TAB ) {
						return;
					}
					var tabbables = $( ":tabbable", this.element ),
						first = tabbables.first(),
						last  = tabbables.last();
					if ( event.target === last[ 0 ] && !event.shiftKey ) {
						first.focus( 1 );
						event.preventDefault();
					} else if ( event.target === first[ 0 ] && event.shiftKey ) {
						last.focus( 1 );
						event.preventDefault();
					}
				}
			});
		}

		this._bind({
			focusout: function( event ) {
				// use a timer to allow click to clear it and letting that
				// handle the closing instead of opening again
				
				// 注释的代码，避免点击内部的非输入区就关闭
				//this.closeTimer = this._delay( function() {
				//	this.close( event );
				//}, 100);
			},
			focusin: function( event ) {
				clearTimeout( this.closeTimer );
			}
		});

		this._bind({
			// TODO only triggered on element if it can receive focus
			// bind to document instead?
			// either element itself or a child should be focusable
			keyup: function( event ) {
				if ( event.keyCode == $.ui.keyCode.ESCAPE && this.element.is( ":visible" ) ) {
					this.close( event );
					// TODO move this to close()? would allow menu.select to call popup.close, and get focus back to trigger
					this.options.trigger.focus();
				}
			}
		});

		// 注释的代码，强制由用户自己关闭
//		this._bind(document, {
//			click: function( event ) {
//				logger.info("----document.click in popup");
//				if ( this.isOpen && !$(event.target).closest(".ui-popup").length ) {
//					logger.info("----document.click in popup-close");
//					this.close( event );
//				}
//			}
//		});
	},

	_destroy: function() {
		this.element
			.show()
			.removeClass( "ui-popup" )
			.removeAttr( "aria-hidden" )
			.removeAttr( "aria-expanded" )
			.unbind( "keypress.ui-popup");

		this.options.trigger
			.removeAttr( "aria-haspopup" )
			.removeAttr( "aria-owns" );

		if ( this.generatedId ) {
			this.element.removeAttr( "id" );
		}
		if ( this.generatedRole ) {
			this.element.removeAttr( "role" );
		}
	},

	open: function( event ) {
		var position = $.extend( {}, {
			of: this.options.trigger
		}, this.options.position );

		this._show( this.element, this.options.show );
		this.element
			.attr( "aria-hidden", "false" )
			.attr( "aria-expanded", "true" )
			.position( position );

		// can't use custom selector when menu isn't loaded
		if ( $.ui.menu && this.element.is( ":ui-menu" ) ) {
			this.element.menu( "focus", event, this.element.children( "li" ).first() );
			this.element.focus();
		} else {
			// set focus to the first tabbable element in the popup container
			// if there are no tabbable elements, set focus on the popup itself
			var tabbables = this.element.find( ":tabbable" );
			this.removeTabIndex = false;
			if ( !tabbables.length ) {
				if ( !this.element.is(":tabbable") ) {
					this.element.attr("tabindex", "0");
					this.removeTabIndex = true;
				}
				tabbables = tabbables.add( this.element[ 0 ] );
			}
			tabbables.first().focus( 1 );
		}

		// take trigger out of tab order to allow shift-tab to skip trigger
		this.options.trigger.attr( "tabindex", -1 );
		this.isOpen = true;
		this._trigger( "open", event );
	},

	close: function( event ) {
		this._beforeClose();
		this._hide( this.element, this.options.hide );

		this.options.trigger.attr( "tabindex" , 0 );
		if ( this.removeTabIndex ) {
			this.element.removeAttr( "tabindex" );
		}
		this.isOpen = false;
		this._trigger( "close", event );
	},

	_beforeClose: function() {
		this.element
			.attr( "aria-hidden", "true" )
			.attr( "aria-expanded", "false" );
	}
});

}(jQuery));
