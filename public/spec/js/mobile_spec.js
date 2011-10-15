describe("mobile drawing", function() {
  var paper;
  beforeEach(function() {
    paper = new Raphael($('#canvas')[0], 600, 800);
  });

  it("passes a line through the point of origin", function() {
    var mobile = paper.mobile(300, 100, [20, 30]);
    expect(mobile.getBBox().x).toBeLessThan(300);
    expect(mobile.getBBox().y).toEqual(100)
    expect(mobile.getBBox().height).toBeLessThan(100)
  });

  it("creates circles sized based on the weight", function() {
    var mobile = paper.mobile(300, 100, [20, 30]);
    expect(mobile.items.length).toEqual(2);
    expect(mobile.items[0].weight).toEqual(20);
    expect(mobile.items[1].weight).toEqual(30);
  });

  it("spins", function() {
    var mobile = paper.mobile(300, 100, [20, 30]);
    mobile.spin();
    waits(1000);
    runs(function() {
      expect(mobile.getBBox().x).toBeGreaterThan(200);
    });
  });
})
