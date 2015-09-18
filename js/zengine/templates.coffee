class Templates
  constructor: ->
    # console.log("Loading templates...")
    @templates = {}

    for script in document.getElementsByClassName("template")
      name = script.id.replace("-template", "")
      @templates[name] = script.innerHTML.trim()
      Mustache.parse(@templates[name])
      # console.log(" - template `" + name + "` loaded.");

  render: (templateName, data) =>
    Mustache.render(@templates[templateName], data)

window.Templates = new Templates()
