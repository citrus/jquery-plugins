// Copyright 2010 Citrus Media Group
// jQuery Autodate
// by Spencer Steffen

// Citrus Media Group
// spencer@citrusme.com

;(function(jQuery){
  jQuery.fn.extend({
    autodate:function(helper,options){

      var self = this;
  		var input = $(this);
  		var helper = $(helper);
  		var form = input.parents('form:first');
  		var date = null;
  		var options = $.extend($.fn.autodate.defaults, options);
  		var set = false;
  		
  		if (typeof(this.hasInit) === 'undefined') {
  		  init();
  		  this.hasInit = true;
  		} else {
        updateDisplay();
  		}
  		
  		
  		return this;
  		
  		
  		
  		function init() {
  		  input.keyup(handleKeys);
  		  input.focus(handleFocus);
  		  input.blur(handleBlur);
  		  form.submit(handleBlur);
        updateDisplay();
  		}
  		function parseDate() {
        return date = Date.parse(input.val());
  		}
  		function updateDisplay() {
  		  if (parseDate()) showDate();
  		  else showHelp();
  		}
  		function showDate() {
  		  if (!date) return showHelp();
  		  input.val(date.toString(options.date_format));
  		  helper.html("");
  		  set = true;
  		  return true;
  		} 
  		function showHelp() {
  		  if (date) return showDate();
  		  input.val(options.input_empty);
  		  helper.html("");
  		  return true;
  		}
  		function showDateInHelper() {
    		helper.text(date.toString(options.date_format));
  		}
  		function invalidInput() {
			  input.addClass("error").text(options.input_invalid);
  			helper.text(options.input_invalid);
      }      	
      function handleKeys(evt) {
        var enter = evt.keyCode === 13;
        if (enter && date && set) enter = false;
        if (enter) updateDisplay();
 				if (!enter && 0 < input.val().length) {
 					parseDate();
 					if (date !== null) {
 					  input.removeClass("error");
 						showDateInHelper();
 					} else {
 					  invalidInput();
 					}
 				}
 				return !enter;
  		}
  		function handleFocus(evt) {
  		  input.val("");
				if (date) showDateInHelper();
  		}  		
  		function handleBlur(evt) {
  		  if (date || parseDate()) showDate();
  		  else invalidInput();
      }      
    }
  });
  
  $.fn.autodate.defaults = {
    date_format: "dddd, MMMM d, yyyy h:mm:ss tt",
    empty_string: "Type a date above",
    input_empty: "Enter any date here..",
    input_invalid: "Please enter a valid date."
  }
  
})(jQuery);