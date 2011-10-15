$(function() {
  //mood machine
  var mood_paper = new Raphael($('#mood_canvas')[0], 600, 800);
  var circ = mood_paper.circle(250, 250, 20).attr({fill: '#000'});
  var mood_text = mood_paper.text(250, 250, "My\nMood").attr({fill:'#fff'});

  var moods = ['Rubbish', 'Not Good', 'OK', 'Smily', 'Positively Manic'];  
  var colors = ['#cc0000', '#a97e22', '#9f9136', '#7c9a2d', '#3a9a2d'];
  var my_mood = 4;

  function show_mood() {
    for(var i=0; i<my_mood; i+=1) {
      (function(i) {
        setTimeout(function() {
          mood_paper.circle(250,250, 20).attr({
            stroke:'none',
            fill: colors[my_mood - 1] 
          }).animate({translation:'0 ' + (-41 * (i+1))}, 2000, 'bounce').toBack();
        }, 50*i);
      })(i);
    }
  }

  circ.node.onclick = show_mood;
  mood_text.node.onclick = show_mood;



  // initial experiments
  var paper = new Raphael($('#canvas')[0], 600, 800);
  var circle = paper.circle(100, 100, 80);
  for(var i= 0; i < 5; i+=1) {
    var multiplier = i*5;
    paper.circle(250 + (2*multiplier), 100+multiplier, 50-multiplier);
  }
  var rectangle = paper.rect(200, 200, 250, 100);
  var ellipse = paper.ellipse(200, 400, 100, 50);
  var line = paper.path("M 250 250 l 0 -50 l -50 0 l 0 -50 l -50 0 l 0 50 l -50 0 l 0 50 z");
  line.attr({fill: '#9cf', stroke: '#ddd', 'stroke-width': 5});
  line.attr({
    gradient: '90-#526c7a-#64a0c1',
    stroke: '#3b4449',
    'stroke-width': 10,
    'stroke-linejoin': 'round',
    rotation: -90
  });

  line.animate({rotation: 360, 'stroke-width': 1}, 2000, 'bounce', function() {
    this.animate({
      stroke: '#3b4449',
    }, 1000, function() {
      // this.attr({stroke: 'none', fill: 'blue'});
      this.animate({
        'stroke-width': 10,
        path: "M 550 250 l 0 -50 l -50 0 l 0 -50 l -100 0 l 0 50 l 50 0 l 0 50 z"}, 
                  5000, 'elastic');
    });
  });

  circle.attr({fill: '#000', stroke:'none'});
  var text = paper.text(100, 100, 'Bye Bye Circle');
  text.attr({opacity: 0, 'font-size':12}).toBack();
  circle.node.onmouseover = function() {
    this.style.cursor = 'pointer';
  }

  circle.node.onclick = function() {
    text.animate({opacity:1}, 2000);
    circle.animate({opacity: 0}, 2000, function() {
      // this.remove();
    });
  }


});
