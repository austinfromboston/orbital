var Orbital = {};

$(document).bind('dyson:complete', function(ev) {
  $sphere = $(ev.target);
  var models_density  = Math.floor($sphere.find('li').length / $('#source .model').length);
 
  $('#source .model').each( function(index) {
    var projection = $('li:not([title]):eq(' + (index * models_density) + ')', $sphere)
    initProjection(this, projection);
  });
  $('li:not([title])', $sphere).css('visibility', 'hidden');
});

function initProjection(model, projection) {
  var model_name = $(model).data('class-name');
  var model_color = $(model).data('color');
  projection.attr('title', model_name).css('background-color', model_color);
  projection.data('model', model);
  projection.mouseover(function() {
    $('#status_bar').text(model_name).css('border-bottom-color', model_color);
  });

  projection.mouseout(function() {
    if(!$('body').is('.editing')) {
      $(document).trigger('status:clear');
    }
  });

  projection.dblclick(function() {
    var model_text = $($(this).data('model')).text();
    $(document).trigger('editor:open', {text:model_text, twice: true});
  });
}

$('#editor-close').click(function() {
  $(document).trigger('editor:close');
});

$(document).bind('editor:open', function(ev, data) {
  // var RubyMode = require("ace/mode/ruby").Mode();
  // console.log('foo', RubyMode);
  console.log(arguments);
  if(Orbital.editor == undefined) {
    Orbital.editor = ace.edit("editor");
  }
  $('body').addClass('editing').addClass('editor-opening').removeClass('editor-closing');
  $('#editor').show();
  // editor.getSession().setMode(new RubyMode());
  Orbital.editor.getSession().setValue(data.text);
  // if(data.twice) {
  //   console.log('opening twice');
  //   $(document).trigger('editor:open', {text: data.text});
  // }
});

$(document).bind('editor:close', function(ev) {
  $('#editor').hide();
  $(document).trigger('status:clear');
  $('body').addClass('editor-closing').removeClass('editing').removeClass('editor-opening');
});
$(document).bind('status:clear', function() {
  $('#status_bar').text('').css('border-bottom-color', 'transparent');
});
