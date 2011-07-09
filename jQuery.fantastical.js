(function( $ ) {
  $.fn.fantastical = function( destination, options ) {
    var pattern = /(\w+)[.!?]?\s*$/;
    var character_offset = 10;	// TODO: Calculate the width of a character based on the style of the temp width
	var idleTimer = null;
	var moved = false;

    var settings = {
		'idleWaitTime'	: 2000
	};
    
    return this.each(function() {
      var $this = $(this);

	  if ( options ) { 
		$.extend( settings, options );
	  }

	  function idle() {
		move();
	  }
	
	  function move() {
		if (!moved) {
		  var match = pattern.exec($this.val());
          if (match[0]) {
            // move text from source to destination
            $this.parent().append("<span id='__temp'>" + match[0] + "</span>");
            var temp = $this.parent().children("#__temp");
  		    // copy the css from the source
	  	    temp.css("font-size", $this.css("font-size"));
		    temp.css("font-weight", $this.css("font-weight"));
		    temp.css("font-family", $this.css("font-family"));
		    temp.css("color", $this.css("color"));

		    var left = $this.offset().left + ($this.caret() * character_offset);
		    if ((($this.caret() * character_offset) + (match[0].length * character_offset)) > $this.width()) {
			  left = ($this.offset().left + $this.width()) - (match[0].length * character_offset);
		    }
            var offset = { top: $this.offset().top, left: left };
            temp.offset( offset );
            var from = temp.offset();

			// The destination must have some content if it is an inline element to get the offset
			if (destination.html().length == 0) {
				destination.html(".");
			}
            var to = destination.offset();
            var width = destination.width();

            var top = "+=" + (to.top - from.top) + "px";
            left = "+=" + ((to.left + width) - from.left) + "px";

            temp.animate({top: top, left: left}, function() {
              destination.html($this.val());
              temp.remove();
              moved = true;
            });
          }
		}
	  }
      
      $this.keyup(function(event) {
		if (!destination) { return; }
		
		if (idleTimer) {
			clearTimeout(idleTimer);
		}
		
        if (event.keyCode == '32') {
		  move();
        } else {
	        moved = false;
			idleTimer = setTimeout(idle, settings.idleWaitTime);
		}

      });
	});
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