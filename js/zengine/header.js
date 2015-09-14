(function() {
  var Header = Class.extend(function() {
    var element;

    this.constructor = function() {
      element = document.getElementById("header");
    };

    this.update = function(siteInfo, settings) {
      element.outerHTML = Templates.render("header", { 
        boardName:  "Development",//settings.boardName,
        peers:      siteInfo.settings.peers,
        siteSize:   formatSizeUnits(siteInfo.settings.size),
      });
      element = document.getElementById("header");
    };
  });

  window.Header = new Header()
})();
