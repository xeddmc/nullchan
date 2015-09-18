class Header
  @element = null

  constructor: ->
    @element = document.getElementById("header")

  update: (siteInfo, settings) =>
    @element.outerHTML = Templates.render "header", 
      boardName:  "Development"
      peers:      siteInfo.settings.peers
      siteSize:   formatSizeUnits(siteInfo.settings.size)

    @element = document.getElementById("header")

window.Header = new Header()

