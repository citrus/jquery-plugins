// Copyright 2010 Citrus Media Group
// jQuery Bubbles ( like the download popup on http://panic.com/coda )
// by Spencer Steffen

// Citrus Media Group
// spencer@citrusme.com


;(function($) {
  
  var version = "0.0.1";
   
  $.fn.extend({  
  
     bubbles: function(info, options) {
  	   
  	    options = options || $.fn.bubbles.defaults;
  	 
  			var self = $(this);
  			var info = $(info).css({ display: 'none', position: 'absolute', top: 'auto', right: 'auto', bottom: 'auto', left: 'auto' }).appendTo(document.body);
  	     		
  	     		
  	    var distance = 10;
        var time = 250;
        var hideDelay = 300;
        var hideDelayTimer = null;
        var beingShown = false;
        var shown = false;
        
  	    self.click(function(evt) {
  	      evt.preventDefault();
  	      return false;
  	    });
  	     		
  	    $([self.get(0), info.get(0)]).mouseover(function(evt){
  	      // info.show();
  	      if (hideDelayTimer) clearTimeout(hideDelayTimer);
          if (beingShown || shown) {
              // don't trigger the animation again
              return;
          } else {
              // reset position of info box
              beingShown = true;
  
              info.css({                
                left: evt.pageX - (info.width() * 0.33),
                top: evt.pageY - info.height(),
                opacity: 0,
                display: 'block'
              }).animate({
                top: '-=' + distance + 'px',
                opacity: 1
              }, time, 'swing', function() {
                beingShown = false;
                shown = true;
              });
          }  
          return false;
  	     
  	    });
  	    
  	    
  	    $([self.get(0), info.get(0)]).mouseout(function(){  	      
  	      if (hideDelayTimer) clearTimeout(hideDelayTimer);
          hideDelayTimer = setTimeout(function () {
              hideDelayTimer = null;
              info.animate({
                  top: '-=' + distance + 'px',
                  opacity: 0
              }, time, 'swing', function () {
                  shown = false;
                  info.css('display', 'none');
              });
  
          }, hideDelay);
  
          return false;
  	      
  	    });  	     
  	    
      } 
  });
  
  $.fn.bubbles.defaults = {
    speed: 100
  }
  
})(jQuery);