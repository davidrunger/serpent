;(function($) {
  $.fn.spinner = function() {
    this.each(function() {
      var el = $(this);

      // add elements
      el.wrap('<span class="spinner"></span>');
      el.before('<span class="sub">-</span>');
      el.after('<span class="add">+</span>');

      // decrement
      el.parent().on('mousedown', '.sub', function (event) {
        if (el.val() > parseInt(el.attr('min')))
          el.val( function(i, oldval) { return --oldval; });
        el.trigger('change', [el.val()]);
      });

      // increment
      el.parent().on('mousedown', '.add', function (event) {
        if (el.val() < parseInt(el.attr('max')))
          el.val( function(i, oldval) { return ++oldval; });
        el.trigger('change', [el.val()]);
      });

      el.parent().on('keypress', function (event) {
        if (event.which === 13) {
          el.trigger('change', [el.val()]);
          event.preventDefault();
        }
      });
    });
  };
})(jQuery);
