// Copyright 2010 Citrus Media Group
// by Spencer Steffen
// Drop down alert, to be used globally rather than instantianiously. 
//
;var Alert = {
  version: "0.1.2",
  options: {
    overlay: true,
    speed: 'fast'
  },
  overlay_styles: {
    display: 'none',
    position: $.browser.msie ? 'absolute' : 'fixed',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: 0,
    zIndex: 12000
  },
  init: function(id) {
    Alert.a = $(id || '#alert').hide().css('z-index', '12500').appendTo(document.body);
    Alert.b = Alert.a.find('div.message');
    return Alert.conceal();
  },
  show: function() {
    if (!(Alert.a || Alert.b)) Alert.init();
    var args = $.makeArray(arguments);
    var overlay = Alert.options.overlay;
    if (args[0] === false) {
      overlay = false;
      args.shift();
    }
    if (overlay) Alert.setupOverlay().showOverlay();
    if (Alert.visible) return Alert.collide(args);
    
    if (args && 0 < args.length) Alert.update(args)
    
    var _top = $('body').scrollTop();
    
    if (_top !== 0) Alert.scroll();
    
    if (Alert.a.outerHeight() < _top) Alert.a.css('top', 0).show();
    else Alert.reveal();
    
    Alert.visible = true;
    
    return Alert;
  },
  scroll: function() {
    $('body').animate({
      scrollTop: 0
    }, Alert.options.speed);
    return Alert;
  },
  hide: function() {
    if (!Alert.visible) return Alert;
    if (!Alert.a) return Alert;
    else Alert.a.animate({ top: -Alert.a.outerHeight() }, Alert.options.speed, Alert.hideOverlay);
    return Alert;
  },
  setupOverlay: function() {
    if (Alert.o) return Alert;
    $(document.body).append('<div id="overlay"></div>');
    Alert.o = $('#overlay').css(Alert.overlay_styles).hide();
    return Alert;
  },
  toggleOverlay: function() {
    if (!Alert.o) Alert.setupOverlay();
    if (Alert.o.css('display') === 'none') Alert.showOverlay();
    else Alert.hideOverlay();
    return Alert;
  },
  showOverlay: function() {
    if (0 < Alert.o.css('opacity')) return Alert;
    Alert.o.show().fadeTo(Alert.options.speed, 0.80, arguments[0] || function(){return;});
    return Alert;
  },
  hideOverlay: function() {
    if (!Alert.o) return Alert;
    Alert.o.fadeTo(Alert.options.speed, 0, function() {
      Alert.o.remove();
      Alert.visible = false;
      Alert.o = null;
    });
    return Alert;
  },
  update: function(args) {
    if (args.length) {
      var t,m,i = 0;
      Alert.b.empty();
      while(args[i]) {
        if ($.isArray(args[i])) {
          t = args[i][0];
          m = args[i][1];
        } else {
          t = i == 0 ? 'h3' : 'p';
          m = args[i];
        }
        Alert.b.append('<'+t+'>'+m+'</'+t+'>');
        i++;
      }
    }
    return Alert.conceal();
  },
  conceal: function() {
    if (!Alert.a) return Alert;
    Alert.a.hide().css('top', -Alert.a.outerHeight());
    return Alert;
  },
  reveal: function() {
    if (!Alert.a) return Alert;
    console.log('reveal');
    Alert.a.show().animate({top: "0px" }, Alert.options.speed, function() {
      Alert.visible = true;
      Alert.collision = false;
    });
    return Alert;
  },  
  collide: function(args) {
    if (!Alert.visible || Alert.collision) return;
    Alert.collision = true;
    Alert.a.animate({top: -Alert.a.outerHeight()},Alert.options.speed, function() {
      Alert.update(args).reveal();
    });
    return Alert;
  }
};
