(function( $ ) {

  var settings = {
	'destination'	: $('#destination'),
	'idleWaitTime'	: 2000
  };

  var methods = {
	init : function( options ) { 
		
		return this.each(function() {
	      var $this = $(this);
		  var data = $this.data('fantastical');

		  if ( options ) { 
			$.extend( settings, options );
		  }
		
		  if ( ! data ) {
			$(this).data('fantastical', {
				pattern 	: /(\w+)[.!?]?\s*$/,
				offset		: 10,
				idleTimer	: null,
				moved		: false
			});
		  }
		
		  $this.bind('keyup.fantastical', methods.keyup);
		})
		
	},
	keyup : function( event ) { 
		if (!settings.destination) { return; }
		
		var $this = $(this);
		var data = $this.data('fantastical');

		if (data.idleTimer) {
			clearTimeout(data.idleTimer);
		}

		if (event.keyCode == '32') {
			$this.one('move.fantastical', methods.move);
			$this.trigger('move.fantastical');
		} else {
		  data.moved = false;
		  data.idleTimer = setTimeout(function( ) { 
			$this.one('move.fantastical', methods.move);
			$this.trigger('move.fantastical');
		  }, settings.idleWaitTime);
		}
	},
	move : function( ) {
		var $this = $(this);
		var data = $this.data('fantastical');
		
		if (!data.moved) {
			var match = data.pattern.exec($this.val());
			if (match && match[0]) {
				// move text from source to destination
				$this.parent().append("<span id='__temp'>" + match[0] + "</span>");
				var temp = $this.parent().children("#__temp");
			
				// copy the css from the source
				temp.css("font-size", $this.css("font-size"));
				temp.css("font-weight", $this.css("font-weight"));
				temp.css("font-family", $this.css("font-family"));
				temp.css("color", $this.css("color"));
			
				var left = $this.offset().left + ($this.caret() * data.offset);
				if ((($this.caret() * data.offset) + (match[0].length * data.offset)) > $this.width()) {
					left = ($this.offset().left + $this.width()) - (match[0].length * data.offset);
				}
			
				var offset = { top: $this.offset().top, left: left };
				temp.offset( offset );
				var from = temp.offset();
			
				// The destination must have some content if it is an inline element to get the offset
				if (settings.destination.html().length == 0) {
					settings.destination.html(".");
				}
				var to = settings.destination.offset();
				var width = settings.destination.width();
			
				var top = "+=" + (to.top - from.top) + "px";
				left = "+=" + ((to.left + width) - from.left) + "px";
			
				temp.animate({top: top, left: left}, function() {
					settings.destination.html($this.val());
			 		temp.remove();
			    	data.moved = true;
			 	});
			}
		}
	},
	destroy : function( ) { 
		
		return this.each(function(){
			var $this = $(this);
			var data = $this.data('fantastical');
			if (data.idleTimer) {
				clearTimeout(data.idleTimer);
			}

			$this.unbind('.fantastical');
			$this.removeData('fantastical');
		})
	}
  };
	
  $.fn.fantastical = function( method ) {
	
	// Method calling logic
	if ( methods[method] ) {
		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.fantastical' );
	}
  };
})( jQuery );

(function( $) {
  $.fn.caret = function() {
    var pos = 0;
    var input = $(this).get(0);
    
    // IE Support
    if (document.selection) {
      input.focus();
      var sel = document.selection.createRange();
      var selLen = document.selection.createRange().text.length;
      sel.moveStart('character', -input.value.length);
      pos = sel.text.length - selLen;
    }
    // Firefox support
    else if (input.selectionStart || input.selectionStart == '0')
      pos = input.selectionStart;

    return pos;
  };
})( jQuery );