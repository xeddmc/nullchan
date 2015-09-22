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
    if document.location.pathname == "/"
      link = document.getElementById("nullchan-link")
      link.href = "//0chan.bit"

window.Header = new Header()

