(function() {
  var Forms = Class.extend(function() {
    var topForm;
    var replyForm;

    this.constructor = function() {
      
    };

    this.showTopForm = function(event) {
      var button  = document.getElementById("form-call-button");
      var element = document.createElement("div");
      element.innerHTML = Templates.render("form");

      topForm = element.firstChild;
      button.parentNode.replaceChild(topForm, button);
      topForm.getElementsByClassName("text")[0].focus();

      this.updateAuthForms().then(function() {
        this.bindEvents(topForm);
      }.bind(this));
    };

    this.bindEvents = function(form) {
      form.addEventListener("submit", this.handleSubmit);
      var auth;
      if ((auth = form.getElementsByClassName("auth-please")).length > 0) {
        auth[0].addEventListener("click", this.authPlease);
      }
    };

    this.authPlease = function(event) {
      Nullchan.cmd("certSelect", [["zeroid.bit"]]);
    };

    this.blurForm = function(form, state) {
      if (state == true) {
        form.className = "form loading";
      } else {
        form.className = "form";
      }
    };

    this.handleSubmit = function(event) {
      event.preventDefault();
      var form = event.currentTarget;
      var data = this.collectFormData(form);
      var validation = this.validateFormData(data);

      if (validation != true) {
        Nullchan.displayError(validation);
        return false;
      }

      this.blurForm(form, true);
      this.processFiles(data).then(function(modifiedData) {
        this.uploadPost(modifiedData).then(function(newPost) {
          this.blurForm(form, false);
          this.clearForm(form);

          if (form.id == "reply-form") {
            form.style.display = "none";
            Threads.appendPost(newPost);
          } else {
            Nullchan.determineRoute();
          }
        }.bind(this)).catch(this.handleError);  
      }.bind(this)).catch(this.handleError);

      return false;
    };

    this.handleError = function(err) {
      Nullchan.displayError(err);
      var forms = document.getElementsByClassName("form loading");
      for (var i = 0; i < forms.length; i++) {
        this.blurForm(forms[i], false);
      };
    };

    this.validateFormData = function(data) {
      if (data.body.length > 3000) {
        return "Comment length shouldn't exceed 3000 symbols."
      }

      if (data.body.length == 0 && !!!data.file) {
        return "Your post is empty, need a comment or a file."
      }

      if (!!data.file) {
        if (["image/jpeg", "image/png", "image/gif"].indexOf(data.file.type) == -1) {
          return "Your file is not an image."
        }
      }

      return true;
    };

    this.uploadPost = function(formData) {
      return new Promise(function(fulfill, reject) {
        var filePath = ("data/users/" + Nullchan.getSiteInfo().auth_address + "/data.json");
        Nullchan.cmd("fileGet", { inner_path: filePath, required: true }, function(data) {
          if (!!data) {
            try {
              data = JSON.parse(data);
            } catch(err) {
              data = { message: [] };
            }
          } else {
            data = { message: [] };
          }

          formData.hashsum = md5(JSON.stringify(formData));
          data.message.push(formData);
          var json = unescape(encodeURIComponent(JSON.stringify(data, undefined, '  ')));

          Nullchan.uploadFile(btoa(json), "data.json", true).then(function() {
            fulfill(formData);
          }.bind(this)).catch(function(err) { reject(err); }.bind(this));
        }.bind(this))
      }.bind(this));
    }

    this.processFiles = function(formData) {
      return new Promise(function(fulfill, reject) {
        if (!formData.file) {
          delete formData.file;
          return fulfill(formData);
        }

        var image  = document.createElement("img");
        var reader = new FileReader();

        reader.onload = function(event) {
          image.src = event.target.result;
        }.bind(this);

        image.onload = function() {
          var canvas    = document.createElement("canvas");
          var ctx       = canvas.getContext("2d");
          canvas.width  = image.width;
          canvas.height = image.height;

          ctx.drawImage(image, 0, 0, image.width, image.height);
          var imageFull   = canvas.toDataURL("image/jpeg", 1).split(',')[1];
          var maxWidth    = 200;
          var maxHeight   = 200;
          var width       = image.width;
          var height      = image.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= (maxWidth / width);
              width   = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= (maxHeight/ height);
              height = maxHeight;
            }
          }

          canvas.width  = width;
          canvas.height = height;
          ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, width, height);
          var imageThumb = canvas.toDataURL("image/jpeg", 1).split(',')[1];
          var hash = md5(imageFull);

          Nullchan.uploadFile(imageFull, (hash + ".jpg"), false).then(function(fullPath) {
            Nullchan.uploadFile(imageThumb, (hash + "-thumb.jpg"), false).then(function(thumbPath) {
              formData.file_thumb = thumbPath;
              formData.file_full  = fullPath;
              delete formData.file;

              fulfill(formData);
            }.bind(this))
          }.bind(this))
        }.bind(this)

        reader.readAsDataURL(formData.file);
      }.bind(this))
    };

    this.collectFormData = function(form) {
      var result = {
        body:       form.getElementsByClassName("text")[0].value.trim(),
        file:       form.getElementsByClassName("file")[0].files[0],
        created_at: Time.timestamp(),
        parent:     form.getElementsByClassName("parent")[0].value,
      }

      if (!!!result.parent) {
        result.parent = null;
      }

      var name = form.getElementsByClassName("name")[0];
      result.anonymous = (name.options[name.selectedIndex].value == "anonymous");
      return result;
    }

    this.updateAuthForms = function(state) {
      return new Promise(function(fulfill, reject) {
        var auths = document.getElementsByClassName("auth-form");
        for (var i = 0; i < auths.length; i++) {
          auths[i].innerHTML = Templates.render("auth-form", { user: Nullchan.shortUserName() });
        };
        fulfill();
      })
    };

    this.callReplyForm = function(event) {
      var post   = event.target.parentNode.parentNode.parentNode;
      var thread = post.parentNode;
      var hash   = thread.dataset.hashsum;

      if (!replyForm) {
        var el = document.createElement("div");
        el.innerHTML = Templates.render("form");
        replyForm = el.firstChild;
        replyForm.id = "reply-form";
        replyForm.addEventListener("submit", this.handleSubmit);
      }

      thread.insertBefore(replyForm, post.nextSibling);
      replyForm.style.display = "table";
      replyForm.getElementsByClassName("text")[0].focus();
      replyForm.getElementsByClassName("parent")[0].value = hash;
      console.log(hash);
      this.updateAuthForms();
    };

    this.clearForm = function(form) {
      form.reset();
    };
  });

  window.Forms = new Forms();
})();
