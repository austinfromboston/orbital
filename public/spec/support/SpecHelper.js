beforeEach(function() {
  $('#jasmine-dom').html('<div id=canvas></div>');

  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong
          && player.isPlaying;
    }
  })
});
