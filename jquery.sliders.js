// Copyright 2010 Citrus Media Group
// jQuery Sliders
// by Spencer Steffen

// Citrus Media Group
// spencer@citrusme.com

;(function($) {

  var ver = '0.2.4';
    
  $.fn.sliders = function() {
    var args = arguments;
    
    if (!$.isReady) return $.fn.sliders.errors.dom();
    
    return this.each(function() {
      
      
      // =================================  
      // get vars or set defaults
      
      var slider, index;
      
      var $id        =  this.$id || $.fn.sliders.generateId();
      
      var container  =  $(this);
      var slider     =  this.slider || getSlider();
      var slides     =  getSlides();
      
      var index      =  this.index || 0;
      var options    =  this.options = $.extend(false, this.options || $.fn.sliders.defaults, (args[0] && args[0].constructor == Object ? args[0] : {}));
      var delay      =  this.delay || null;
      var keyEnabled =  this.keyEnabled || false;
      var locked     =  $(slider).data('locked') || false;
      
      var transitions = {
        slide: function() {
          if (locked) return;
          slider.animate({ left: -container.width() * index }, options.speed, options.ease);
        },
        lock: function(unlock) {
          if (slider.data('locked')) return;
          slider.data('locked', true);
          if (unlock) setTimeout(transitions.unlock, options.speed - 25);
        },
        unlock: function() {
          slider.data('locked', false);
        }  
      }
      
      if (!this.hasInit) {
  
        align();
        
        if (slides.length < $.fn.sliders.defaults.minimum) $.fn.sliders.errors.minimum(slides.length);
        if (options.delay < 500) options.delay = $.fn.sliders.errors.delay(options.delay);
        if (options.speed < 300) options.speed = $.fn.sliders.errors.speed(options.speed);
        
        advance(Number(options.first));
        
        if (!args[0] || args[0].constructor != String) {
          if (options.play) play();
          if (options.keyboardEvents) enableKeyboard();
        }
        this.hasInit = true;
      }
      
      if (args[0] && args[0].constructor == String) control(args[0], args[1]);
      
      
      // save for laters!
      
      this.$id        = $id;
      this.slider     = slider;
      this.options    = options;
      this.index      = index;
      this.delay      = delay;
      this.keyEnabled = keyEnabled;
      this.locked     = locked;
      
      return this;
      
      
          
          
          
      // =================================  
      // SETUP SLIDER & SLIDES
      
      function getSlider() {
        if (slider) return slider;
        var w = container.width();    
        var h = container.height();
        var pos = container.css('position');
        if (!pos || !pos.match(/relative|absolute/)) container.css('position', 'relative');
        
        container.css({ display: 'block', overflow: 'hidden' }).wrapInner('<div class="slider"></div>');
        
        return $('div.slider', container).css($.fn.sliders.absTopLeft);
      }
      
      function getSlides() {
        return slider ? slider.children().get() : container.children().get();
      }
      
      
      function align() {
        var w = container.width();    
        var h = container.height();
        slider.css({ width: w * slides.length, height: h, left: -w * index });
        return $(slides).css({ display: 'block', position: 'absolute', top: 0, width: w }).each(function(i) { 
          $(this).css({ left: w * i, zIndex: slides.length - i });
        });
      }
      
      
      
      // =================================  
      // CONTROLS 
      
      function control(control, option) {
        switch(control) {
    		  case 'play':
    		    play();
    		    break;
          case 'stop':
            stop();
            break;
          case 'toggle':
            toggle();
            break;
          case 'prev':
          case 'previous':
            stop();
            prev();
            break;
          case 'next':
            stop();
            next();
            break;
          case 'goto':
          case 'go to':
            var idx;
            if (option.constructor == String) {
              switch(option) {
                case 'next':
                  idx = advance(1);
                  break;
                case 'prev':
                  idx = advance(-1);
                  break;
                case 'last':
                case 'end':
                case 'finish':
                  idx = slides.length - 1;
                  break;
                case 'first':
                case 'start':
                default:
                  idx = Number(option.replace(/[^0-9]/g, ''));
                  break;
              }
            } else {
              idx = Number(option);
            }
            stop();
            goto(idx);
            break;
          case 'advance':
            stop();
            advance(option || 1);
            transition();
            break;
          case 'enableKeyboard':
            enableKeyboard();
            break;
          case 'disableKeyboard':
            disableKeyboard();
            break;
          case 'toggleKeyboard':
            toggleKeyboard();
            break;
          case 'show':
            if (option === false) container.css('display', 'block');
            else container.fadeIn();            
            if (options.play) play();
            if (options.keyboardEvents) enableKeyboard();
            break;
          case 'hide':
            stop();
            disableKeyboard();
            if (option === false) container.css('display', 'none');
            else container.fadeOut();
            break;
          default:
            // nothing!
            break;
        }
      };
      
      
      
      // slideshow 
      
      function play() {
        if (delay) return;
        delay = setInterval(next, options.delay);
      };
      function stop() {
        if(delay) delay = clearTimeout(delay);
      };
      function toggle() {
        if(delay) stop();
        else play();
      };
      
      
      
      // manual
      
      function next() {
        if (locked || slides.length < 2) return;
        advance(1);
        transition();
      };      
      function prev() {
        if (locked || slides.length < 2) return;
        advance(-1);
        transition();
      }; 
      function goto(n) {
        if (locked || slides.length < 2 || index == n) return;
        index = withinLimits(n);
        transition();
      };
      
      
      
      
      // =================================  
      // KEYBOARD 
      
      function enableKeyboard() {
        if (keyEnabled) return false;
        $(window).bind('keyup.' + $id, container, $.fn.sliders.handleKeyboard);
        keyEnabled = true;
      };
      function disableKeyboard() {
        if (!keyEnabled) return false;
        $(window).unbind('keyup.' + $id, $.fn.sliders.handleKeyboard);
        keyEnabled = false;
      };
      function toggleKeyboard() {
        if (keyEnabled) disableKeyboard();
        else enableKeyboard();
      }  
      
      
      
      
      // =================================  
      // TRANSITION 
      
      function transition() {
        if (locked) return;
        switch(options.transition) {
          case 'slide':
          default:
            transitions.slide();
            break;
        }
        if (!options.allowCue) transitions.lock(true);
      };
      
          
  
      // =================================  
      // LOGIC 
    
      function advance(count) {
        if (locked) return index;
        var l = slides.length; 
        var i = count < l ? count : l - (count % l);
        return index = withinLimits(index + i);
      };
      
      function withinLimits(n) {
        var l = slides.length;
        var i = n < l ? n : l - (n % l);
        return i < 0 ? l + i : l <= i ? i - l : i;
      };
      
      
            
    });
    
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  $.fn.sliders.handleKeyboard = function(evt) {
    switch(evt.keyCode) {
      case 39:
      case 40:
        $(evt.data).sliders('next');
        break;
      case 37:
      case 38:
        $(evt.data).sliders('prev');
        break;
      case 32:
        $(evt.data).sliders('toggle');
        break;
    }
  };
  
  
  
  
  
  
  
  
  
  // =================================  
  // ERRORS  

  $.fn.sliders.errors = {
    dom: function() {
      $.fn.sliders.errors.show('Sliders::DOM not ready, quiting slideshow');
    },
    minimum: function(count) {
      $.fn.sliders.errors.show('Sliders::Not enough slides. ' + count + '/' + $.fn.sliders.defaults.minimum);
    },
    delay: function(delay) {
      $.fn.sliders.errors.show('Sliders::Speed to slow. (' + speed + 'ms) minimum 300ms');
      return $.fn.sliders.minimums.delay;
    },
    speed: function(speed) {
      $.fn.sliders.errors.show('Sliders::Speed to slow. (' + speed + 'ms) minimum 300ms');
      return $.fn.sliders.minimums.speed;
    },
    show: function(err) {
      if (window.console && window.console.log) window.console.log(err);
      return this;
    } 
  }
  
  
  
  
  // =================================  
  // ID  

  $.fn.sliders.generateId = function() {
    return Math.round(new Date().getTime() * Math.random());
  }
  
  
  
    
  // =================================  
  // DEFAULTS 
  
  $.fn.sliders.absTopLeft = {
    display:     'block',
    position: 'absolute',
    left:              0,
    top:               0
  };
  
  $.fn.sliders.minimums = {
    delay:           500,
    speed:           300  
  };
        
  $.fn.sliders.defaults = {
    transistion: 'slide',
    allowCue:      false,
    delay:          5000, 
    speed:           750,
    minimum:           2,
    first:             0,
    ease:        'swing',
    play:           true,
    keyboardEvents: true
  };
  
        
})(jQuery);
