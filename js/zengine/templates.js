(function() {
  var Templates = Class.extend(function() {
    var templates;

    this.constructor = function() {
      // console.log("Loading templates...");
      templates = {};
      var scripts = document.getElementsByClassName("template");
      var i;

      for (i = 0; i < scripts.length; i++) {
        var name = scripts[i].id.replace("-template", "");
        templates[name] = scripts[i].innerHTML.trim();
        Mustache.parse(templates[name]);
        // console.log(" - template `" + name + "` loaded.");
      }
    };

    this.render = function(templateName, data) {
      return Mustache.render(templates[templateName], data);
    };
  })

  window.Templates = new Templates;
})();
