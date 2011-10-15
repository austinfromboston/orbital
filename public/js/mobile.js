function spike_spinning_css() {
  var paper = new Raphael($('#css_canvas')[0], 600, 800);
  var leaf1 = paper.circle(200, 250, 20).attr({fill: '#800'});
  var handle0 = paper.path("M 300 150 v 70")
  var handle1 = paper.path("M 200 230 v -30")
  var handle2 = paper.path("M 400 220 v -20")
  var leaf2 = paper.circle(400, 250, 30).attr({fill: '#080'});
  var arc_path = paper.path("M 200 250 a 100 30 0 1 1 200 0 a 100 30 0 1 1 -200 0")
  var alt_arc_path = paper.path("M 400 250 a 100 30 0 1 1 -200 0 a 100 30 0 1 1 200 0");
  console.log(leaf1);
  // $('circle:first', '#css_canvas').addClass('rotatable');
  $('#css_canvas').addClass('rotatable');
}

spike_spinning_css();

Raphael.fn.mobile = function(origin_x, origin_y, weights) {
  var arc_length =  _.reduce(weights, function(memo, num){ return memo + num; }, 0) * 4;
  var handle_height = 20,
    arc_height = 30,
    arc_path = " m " + (0 - arc_length/2) + " " + (arc_height / 2) + " q " + (arc_length/2) + " " + (0-arc_height) + " " + arc_length + " 0" ,
    handle_path = "M " + origin_x + " " + origin_y + " v " + handle_height;
  var paper = this;

  var weight_x_offset = arc_length / (weights.length - 1);
  var weight_paths = function(weights, offset) {
    return _.map(weights, function(weight, index) {
      var offset = offset || weight_x_offset * index;
      var x_start = (origin_x - (arc_length/2) + offset);
      var y_start = (origin_y + 5 + arc_height);
      var weight_handle_start = " M " + x_start + " " + y_start + " "; 
      return weight_handle_start + weight_shape_path(weight);
      // var handle_height = 10;
      // var handle_path = "v " + handle_height + " ";
      // var arc_path = "a " + weight + " " + weight + " 20 1 0 0.1 0.1";
      // // paper.circle(x_start, y_start + weight + handle_height, weight)
      // return weight_handle_start + handle_path + arc_path;
      });
  }

  var weight_shape_path = function(weight) {
      var handle_height = 10;
      var handle_path = "v " + handle_height + " ";
      var arc_path = "a " + weight + " " + weight + " 20 1 0 0 " + (weight * 2);
      arc_path = arc_path +  " a " + weight + " " + weight + " 20 1 0 0 " + (0 - weight * 2);
      return handle_path + arc_path;
  }

  var full_path_string = handle_path + arc_path + weight_paths(weights).join(' ');
  var path  = this.path(full_path_string);
  var actions = {
    items: _.map(weights, function(value) { return { weight: value } }),
    full_path: full_path_string,
    spin: function() {
      var middle_path = handle_path + _(weights).map(weight_shape_path).join(" ");
      path.animate( { path: middle_path }, 3000, function() {
        path.animate( {path: handle_path + arc_path + weight_paths(_(weights).reverse()).join(' ') }, 3000);

      });
    }
  }
  return _.extend( path, actions);
}
// var paper = new Raphael($('#mood_canvas')[0], 600, 800);
// var m = paper.mobile(250,250, [20,30]);
// m.spin();

function spike_spinning() {
  var paper = new Raphael($('#mood_canvas')[0], 600, 800);
  var leaf1 = paper.circle(250, 250, 20).attr({fill: '#800'});
  var leaf2 = paper.circle(450, 250, 30).attr({fill: '#080'});
  var cycling = false;
  var cycle = function() {
    cycling = true;
    leaf1.animate({translation:"100 0", r: 25}, 350, function() {
      leaf1.animate({translation:"100 0", r: 20}, 350, function() {
        leaf1.animate({translation:"-100 0", r: 15}, 350, function() {
          leaf1.animate({translation:"-100 0", r: 20}, 350, function() {
            if(!cycling) setTimeout(cycle, 10);
            cycling = false;
          });
        }).toBack();
      });
    }).toFront();
    leaf2.animate({translation:"-100 0", r: 25}, 350, function() {
      leaf2.animate({translation:"-100 0", r: 30}, 350, function() {
        leaf2.animate({translation:"100 0", r: 35}, 350, function() {
          leaf2.animate({translation:"100 0", r: 30}, 350, function() {
            if(!cycling) setTimeout(cycle, 10);
            cycling = false;
          });
        }).toFront();
      });
    }).toBack();
  };
  cycle();
}
// spike_spinning();
function spike_spinning_path() {
  var paper = new Raphael($('#mood_canvas')[0], 600, 800);
  var leaf1 = paper.circle(250, 250, 20).attr({fill: '#800'});
  var handle0 = paper.path("M 350 150 v 70")
  var handle1 = paper.path("M 250 230 v -30")
  var handle2 = paper.path("M 450 220 v -20")
  var leaf2 = paper.circle(450, 250, 30).attr({fill: '#080'});
  var arc_path = paper.path("M 250 250 a 100 30 0 1 1 200 0 a 100 30 0 1 1 -200 0")
  var alt_arc_path = paper.path("M 450 250 a 100 30 0 1 1 -200 0 a 100 30 0 1 1 200 0");
  var mobile_arc = paper.path("M 250 200 q 100 -30 200 0");
  // var set1 = paper.set(leaf1, handle1);
  leaf1.onAnimation(function() {
    mobile_arc.attr({path:"M " + leaf2.attr("cx") + " " + (leaf2.attr("cy") - 50) + " Q 350 170 " + leaf1.attr('cx') + ' ' + (leaf1.attr('cy') - 50)});
  });
  leaf2.onAnimation(function() {
    mobile_arc.attr({path:"M " + leaf2.attr("cx") + " " + (leaf2.attr("cy") - 50) + " Q 350 170 " + leaf1.attr('cx') + ' ' + (leaf1.attr('cy') - 50)});
  });
  arc_path.hide();
  alt_arc_path.hide();
  var foo = function() {
    // leaf1.animateAlong(arc_path, 2000, 'easeIn', function() { setInterval(foo, 15) } );
    leaf1.animateAlong(arc_path, 2000, 'easeIn', foo);
    handle1.animateAlong(arc_path, 2000)
  }
  var foo2 = function() {
    leaf2.animateAlong(alt_arc_path, 2000, 'easeIn', foo2);
    handle2.animateAlong(alt_arc_path, 2000)
  }
  foo();
  foo2();
}
// spike_spinning_path();

function spike_mobile() {
  var paper = new Raphael($('#mood_canvas')[0], 600, 800);
  var leafs = [], fasteners = [];

  var x = function(origin_x, origin_y, weights) {
    var span = paper.path("M " + (origin_x - 80) + " " + (origin_y ) + " q 80 -30 200 " + (weights[1] - weights[0]));
    $.each(weights, function(weight) {
      leafs[leafs.length] = paper.circle(250, 250, weight).attr({fill: '#800'});
      fasteners[fasteners.length] = paper.path("M 250 250 v " + (-20 - weight)).toBack();
    });
    var leaf1 = paper.circle(250, 250, 20).attr({fill: '#800'});
    var fastener1 = paper.path("M 250 250 v -40").toBack();
    var leaf2 = paper.circle(450, 250, 30).attr({fill: '#080'});
    var fastener2 = paper.path("M 450 250 v -50").toBack();
  }(330, 210, [30, 20]);


}
