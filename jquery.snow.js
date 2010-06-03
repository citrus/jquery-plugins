// Copyright 2010 Citrus Media Group
// jQuery Snow
// by Spencer Steffen

// Citrus Media Group
// spencer@citrusme.com


;(function($) {
  
  var version = "0.1.3";
   
  $.fn.snow = function() {  
    
  	 var args = arguments;
      
     
     return this.each(function() {
        var count = this.count || count;
	      var self = $(this).css('overflow', 'hidden');
	      var options =  this.options = $.extend(false, this.options || $.fn.snow.defaults, (args[0] && args[0].constructor == Object ? args[0] : {}));
        var parent = self.parent()
        var int = this.int || 0;
        
        if (!this.hasInit) {
          if (options.play) control('play');
          this.hasInit = true;
        }
      
        if (args[0] && args[0].constructor == String) control(args[0], args[1]);
        
        this.int = int;
        this.images = options.images;
        this.options = options;
        
        return this;
      
        function control(control, option) {
          switch(control) {
    		    case 'play':
    		      int = window.setInterval(function() { animate(); count += 1; }, options.speed);
    		      break;
            case 'stop':
              int = window.clearInterval(int);
              $(options.className).stop().fadeOut();
              break;
          }
        }
        
        function animate() {
          var a = addElement();
          var p = a.position();
          var x;
          var y;
          
          if (options.layout == 'vertical') {     
            x = p.left + $.fn.snow.math.randomRange(100, 250);
            y = screen.height + a.height();
          } else {
            x = screen.width + a.width();
            y = p.top + $.fn.snow.math.randomRange(100, 250);
          }
          a.animate({
            left: x,
            top: y
          }, $.fn.snow.math.randomRange(options.minSpeed, options.maxSpeed), 'swing', function() { 
            a.remove();        
          });
        }
        
        function addElement() {
          var size = $.fn.snow.math.randomRange(10, 100);
          var div = $($.fn.snow.elements.div(count,options.className));
          
          if (options.images && 0 < options.images.length) {
            var img;
            img = $($.fn.snow.elements.image(options.images[$.fn.snow.math.randomRange(0,options.images.length-1)]));
            if (img) div.append(img);
          } else {
            div.text(options.snowflake);
          }
          
          div.css({
            display: 'block',
            position: 'absolute',
            width: 'auto',
            height: 'auto',
            fontSize: size,
            zIndex: -1,
            opacity: $.fn.snow.math.randomRange(70,100) * 0.01
          }).hide().appendTo(parent);
          
          var w = div.width();
          var h = div.height();
          var x, y;
          
          if (options.layout == 'vertical') {
            x = $.fn.snow.math.randomRange(-w, screen.width + w);
            y = -h;
          } else {
            x = -w;
            y = $.fn.snow.math.randomRange(-h, screen.height + h);
          }
                    
          div.css({
            left: x,
            top: y
            //top: $.fn.snow.math.randomRange(-h, screen.width + h)
          }).show();
          
          return div;
        }
    });
  };
  
  $.fn.snow.elements = {
    div: function(id,className) {
      return '<div class="' + className + '">&nbsp;</div>'
    },
    image: function(img) {
      return '<img src="' + img + '" alt="" />'
    }
  }
  
  $.fn.snow.math = {
    random: function(i) {
      return Math.floor(i*(Math.random()%1));
    },
    randomRange: function(i,j) {
      return i + $.fn.snow.math.random(j-i+1);
    },
    eitherOr: function() {
      return 0.5 - Math.random();
    }
  }  
  
  $.fn.snow.defaults = {
    play: true,
    minSpeed: 22000,
    maxSpeed: 27000,
    images: [],
    className: 'snowflake',
    speed: 100,
    snowflake: "*",
    layout: 'vertical'
  }
  
})(jQuery);