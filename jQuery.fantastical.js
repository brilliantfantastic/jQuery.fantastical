(function( $ ) {
  $.fn.fantastical = function() {
    var pattern = /(\w+)[.!?]?\s*$/;
    
    return this.each(function() {
      var $this = $(this);
      
      $this.keyup(function(event) {
        if (event.keyCode == '32') {
          var match = pattern.exec($this.val());
          if (match[0]) {
            // move text from source to destination
            $this.parent().append("<span id='temp'>" + match[0] + "</span>");
            var temp = $this.parent().children("#temp");
            
            // TODO: Calculate the width of a character based on the style of the temp width
            var offset = { top: $this.offset().top, left: ($this.offset().left + ($this.caret() * 10)) };
            temp.offset( offset );
            var from = temp.offset();
            
            var to = $("#destination .inner").offset();
            var width = $("#destination .inner span").width();
            
            // TODO: The + or the - depends on the relative positioning of from and to
            var top = "+=" + (to.top - from.top) + "px";
            var left = "+=" + ((to.left + width) - from.left) + "px";
            
            temp.animate({top: top, left: left}, function() {
              $("#destination .inner span").html($this.val());
              temp.remove();
            });
          }
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