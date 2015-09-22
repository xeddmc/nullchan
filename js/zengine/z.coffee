class Nullchan extends ZeroFrame
  initialized:  false
  settings:     null
  siteInfo:     null
  container:    null
  preloader:    null

  init: =>
    @container = document.getElementById("container")
    @preloader = document.getElementById("preloader")    

  onOpenWebsocket: (event) =>
    unless @initialized
      @initialized = true
      @loadSettings().then => 
        @loadSiteInfo().then (newInfo) =>
          @updateSiteInfo(newInfo)
          @determineRoute()

  route: (command, message) =>
    if command == "setSiteInfo"
      @updateSiteInfo(message.params)

  updateSiteInfo: (newInfo) =>
    @siteInfo = newInfo
    Header.update(@siteInfo, @settings)
    Forms.updateAuthForms()

  loadSiteInfo: =>
    new Promise (fulfill, reject) =>
      @cmd "siteInfo", {}, (newInfo) => fulfill(newInfo)

  loadSettings: =>
    new Promise (fulfill, reject) =>
      @cmd "fileGet", { inner_path: "data/settings.json", required: true }, (data) =>
        try 
          settings = JSON.parse(data)
        catch err
          alert("Fix your settings file!")
          settings = {}
        fulfill()

  determineRoute: =>
    Threads.showList(@cmd).then => @togglePreloader(false)

  getSiteInfo: =>
    return @siteInfo

  togglePreloader: (state) =>
    if state == true
      inactive = container
      active   = preloader
    else
      inactive = preloader
      active   = container

    inactive.style.display = "none"
    active.style.display   = "block"
    active.className       = "fadein"
    setTimeout (=> on.className = ""), 1100

  shortUserName: (full) =>
    if !full
      full = @siteInfo.cert_user_id
    if full == "edisontrent@zeroid.bit"
      return "[dev] edisontrent"
    if !full
      return full
    return full.split("@")[0]

  displayError: (text) =>
    @cmd("wrapperNotification", ["error", text, 5000])

  uploadFile: (rawBase64, fileName, publish) =>
    new Promise (fulfill, reject) =>
      dir  = "data/users/#{@siteInfo.auth_address}/"
      path = (dir + fileName)

      @cmd "fileWrite", [path, rawBase64], (write) =>
        if write == "ok"
          if publish == false
            fulfill(path)
          else
            @cmd "sitePublish", { "inner_path": path }, (publish) =>
              if publish == "ok"
                fulfill(path)
              else
                reject(publish)
        else 
          reject(write)

window.Nullchan = new Nullchan()
