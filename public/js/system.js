var Orbital = {
  createProjections: function(ev) {
    $sphere = $(ev.target);
    var models_density  = Math.floor($sphere.find('li').length / $('#source .model').length);

    $('#source .model').each( function(index) {
      var projection = $('li:not([title]):eq(' + (index * models_density) + ')', $sphere)
      Orbital.Projection.init($(this), projection);
    });
    $('li:not([title])', $sphere).css('visibility', 'hidden');
  },

  Projection: {
    init: function(model, projection) {
      var model_name = model.data('class-name');
      var model_color = model.data('color');
      projection.attr('title', model_name).css('background-color', model_color);
      projection.data('model', model);
      $.get(model.data('source-url'), function(data) {
        model.data('source', data);
        var line_count = data.split("\n").length * 3;
        Orbital.Projection.resize(projection, line_count);
      });
      projection.mouseover(function() { Orbital.Projection.show_status(model_name, model_color); });

      projection.mouseout(function() {
        if(!$('body').is('.editing')) {
          $(document).trigger('status:clear');
        }
      });

      projection.dblclick(function() {
        var model_text = $($(this).data('model')).data('source');
        $(document).trigger('editor:open', {text:model_text, twice: true});
      });
    },
    resize: function(projection, size) {
      projection.css({
        width: "" + size + "px",
        height: "" + size + "px",
        'border-radius': "" + (size/2) + "px",
        'margin-top': "" + (50 - size/2) + "px"
      });
    },
    show_status: function(model_name, model_color ) {
      $('#status_bar').text(model_name).css('border-bottom-color', model_color);
    }
  }

};

$(document).bind('dyson:complete', Orbital.createProjections);


$('#editor-close').click(function() {
  $(document).trigger('editor:close');
});

$(document).bind('editor:open', function(ev, data) {
  // console.log('foo', RubyMode);
  if(Orbital.editor == undefined) {
    var RubyMode = require("ace/mode/ruby").Mode;
    Orbital.editor = ace.edit("editor");
    Orbital.editor.getSession().setMode(new RubyMode());
  }
  $('body').addClass('editing').addClass('editor-opening').removeClass('editor-closing');
  $('#editor').show();
  Orbital.editor.getSession().setValue(data.text);
});

$(document).bind('editor:close', function(ev) {
  $('#editor').hide();
  $(document).trigger('status:clear');
  $('body').addClass('editor-closing').removeClass('editing').removeClass('editor-opening');
});
$(document).bind('status:clear', function() {
  $('#status_bar').text('').css('border-bottom-color', 'transparent');
});
