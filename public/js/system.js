var Orbital = {
  messageCount: 0,
  createProjections: function(ev, data) {
    console.log('running createProjections', ev, data);
    $sphere = $(ev.target);
    var models_density  = Math.floor($sphere.find('li').length / $('#source > .model').length);

    $('#source > .model').each( function(index) {
      var projection = $('li:not([title]):eq(' + (index * models_density) + ')', $sphere)
      Orbital.Projection.init($(this), projection);
    });
    $('li:not([title])', $sphere).css('visibility', 'hidden');
  },

  fakeMessages: function() {
    var receiver_index = Math.floor(Math.random() * 5);
    var sender_index = Math.floor(Math.random() * 5);
    var receiver = $('#source .model').eq(receiver_index);
    var sender = $('#source .model').eq(sender_index);
    var method_name = ['action', 'save', 'init', 'callOrRegressToBackButton'][Math.floor(Math.random() * 4)]
    var method_args = [[1,2, "shoe"], ["Peter"], [{init:"blue"}], [360000]][Math.floor(Math.random() * 4)]
    if(sender_index != receiver_index) {
      receiver.trigger('model:message', {sender_class:sender.data('class-name'), method:method_name, arguments:method_args});
    }
  },

  Projection: {
    init: function(model, projection) {
      projection.data('model', model);
      model.data('projection', projection);
      var model_name = model.data('class-name');
      var model_color = model.data('color');
      console.log(model.data('source'));
      projection.attr('title', model_name).css('background-color', model_color);
      Orbital.Projection.resize(projection, projection.data('size') / 80);
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

$(document).bind('data:complete', Orbital.createProjections);


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

$('.start, .stop', '#controls').click(function(ev) {
  $('#sphere').addClass('active');
  $('.start, .stop', '#controls').toggle();
  $('#sphere').removeClass('paused');
  if($(ev.target).is(".stop")) {
    $('#sphere').addClass('paused');
    // clearTimeout(Orbital.messenger);
    clearInterval(Orbital.messenger);
    clearInterval(Orbital.messenger2);
  } else {
    // Orbital.messenger = setTimeout( Orbital.fakeMessages, 3000);
    Orbital.messenger = setInterval( Orbital.fakeMessages, 200);
    Orbital.messenger2 = setInterval( Orbital.fakeMessages, 700);
  }
});

$('#sphere').delegate('li[title]', 'message:display', function(ev, data) {
  var message_text = data.method + "(" + data.arguments.join(",") + ")";
  // var message_text = '';
  $('#sphere .container ul').append('<div class="message">'  + message_text + '</div>');
  $message = $('#sphere .container ul').find('.message:last');
  // var rotations_per_round = 360/2/$(this).siblings('li').length;
  // var my_position = $(this).prevAll('#sphere li').length;
  // var target_position = $(data.target).prevAll('#sphere li').length;
  // var offset = (my_position - target_position) * rotations_per_round;
  // $message.css({'-webkit-transform': "rotateY("+ offset + "deg)"});
  // $('#controls .stop').click();
  //
    // @-webkit-keyframes messagePush {from { -webkit-transform: ' + $(ev.target).css('-webkit-transform') + ';} \
    //   to { -webkit-transform: ' +  $(data.target).css('-webkit-transform') + '; }} \
  $('#system').append(
    // '<style type="text/css">@-webkit-keyframes messagePush' + Orbital.messageCount +' {from { -webkit-transform: rotateX(180deg); } to { -webkit-transform: rotateX(0deg); }}</style>');
    '<style type="text/css">@-webkit-keyframes messagePush' + Orbital.messageCount + '{from { -webkit-transform: ' + $(ev.target).css('-webkit-transform') + ';} to { -webkit-transform: ' +  $(data.target).css('-webkit-transform') + '; }}</style>');
  $message.attr('data-message-count', Orbital.messageCount);
  $message.css({
    '-webkit-transform': $(data.target).css('-webkit-transform'),
    '-webkit-animation': "messagePush" + Orbital.messageCount + " 500ms linear",
    // 'margin-top': '10px'
  });
  var old_message_count = Orbital.messageCount;
  setTimeout(function() { $('#system .message[data-message-count=' + old_message_count + "]").remove(); }, 2000);
  Orbital.messageCount++;
});

$('.model').bind('model:message', function(ev, data) {
  var sender = $('.model[data-class-name=' + data.sender_class + ']').data('projection');
  $.extend(data, {target:$(this).data('projection')});
  $(sender).trigger('message:display', data);
});

$('#controls .send_message').click(Orbital.fakeMessages);
