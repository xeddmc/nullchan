(function() { 
  var Nullchan = ZeroFrame.extend(function() {
    var initialized = false;
    var settings;
    var siteInfo;
    var container;
    var preloader;

    this.init = function() {
      container = document.getElementById("container");
      preloader = document.getElementById("preloader");
    };

    this.onOpenWebsocket = function(event) {
      if (!initialized) {
        initialized = true;
        this.loadSettings().then(function() {
          this.loadSiteInfo().then(function(newInfo) {
            this.updateSiteInfo(newInfo);
            this.determineRoute();
          }.bind(this));
        }.bind(this));
      }
    };

    this.route = function(command, message) {
      if (command == "setSiteInfo") {
        this.updateSiteInfo(message.params);
        
      }
    };

    this.updateSiteInfo = function(newInfo) {
      siteInfo = newInfo;
      Header.update(siteInfo, settings);
      Forms.updateAuthForms();
    };

    this.loadSiteInfo = function() {
      return new Promise(function(fulfill, reject) {
        this.cmd("siteInfo", {}, function(newInfo) {
          fulfill(newInfo);
        })
      }.bind(this));
    }

    this.loadSettings = function() {
      return new Promise(function(fulfill, reject) {
        this.cmd("fileGet", { inner_path: "data/settings.json", required: true }, function(data) {
          try {
            settings = JSON.parse(data);
          } catch(err) {
            alert("Fix your settings file!")
            settings = {}
          }
          fulfill();
        }.bind(this));
      }.bind(this));
    }

    this.determineRoute = function() {
      Threads.showList(this.cmd).then(function() { 
        this.togglePreloader(false);
      }.bind(this));
    };

    this.getSiteInfo = function() {
      return siteInfo;
    };

    this.togglePreloader = function(state) {
      var off, on;

      if (state == true) {
        off = container;
        on  = preloader;
      } else {
        off = preloader;
        on  = container;
      }

      off.style.display = "none";
      on.style.display = "block";
      on.className = "fadein";

      setTimeout(function() {
        on.className = "";
      }.bind(this), 1100)
    };

    this.shortUserName = function(full) {
      if (!full) {
        full = siteInfo.cert_user_id;
      }
      if (full == "edisontrent@zeroid.bit") {
        return "[dev] Edison Trent";
      }
      if (!full) {
        return full;
      }

      return full.split("@")[0];
    };

    this.displayError = function(text) {
      this.cmd("wrapperNotification", ["error", text, 5000]);
    };

    this.uploadFile = function(rawBase64, fileName, publish) {
      return new Promise(function(fulfill, reject) {
        var dir  = ("data/users/" + siteInfo.auth_address + "/");
        var path = (dir + fileName);

        this.cmd("fileWrite", [path, rawBase64], function(write) {
          if (write == "ok") {
            if (publish == false) {
              fulfill(path);
            } else {
              this.cmd("sitePublish", { "inner_path": path }, function(publish) {
                if (publish == "ok") {
                  fulfill(path);
                } else {
                  reject(publish);
                }
              })
            }
          } else {
            reject(write);
          }
        }.bind(this));
      }.bind(this));
    };
  });

  window.Nullchan = new Nullchan();
})();