class Forms
  topForm:   null
  replyForm: null

  showTopForm: (event) =>
    button  = document.getElementById("form-call-button")
    element = document.createElement("div")
    element.innerHTML = Templates.render("form")

    @topForm = element.firstChild
    button.parentNode.replaceChild(@topForm, button)
    @topForm.getElementsByClassName("text")[0].focus()

    if Nullchan.currentPage() != "list"
      @topForm.getElementsByClassName("parent")[0].value = Threads.currentThread()

    @updateAuthForms().then => @bindEvents(@topForm)

  bindEvents: (form) =>
    form.addEventListener("submit", @handleSubmit)
    if ((auth = form.getElementsByClassName("auth-please")).length > 0) 
      auth[0].addEventListener("click", @authPlease)

  authPlease: (event) =>
    Nullchan.cmd("certSelect", [["zeroid.bit"]])

  blurForm: (form, state) =>
    if state == true
      form.className = "form loading"
    else
      form.className = "form"

  handleSubmit: (event) =>
    event.preventDefault()
    form = event.currentTarget
    data = @collectFormData(form)
    validation = @validateFormData(data)

    if validation != true
      Nullchan.displayError(validation)
      return false

    @blurForm(form, true)
    @processFiles(data).then (modifiedData) =>
      @uploadPost(modifiedData).then (newPost) =>
        @blurForm(form, false)
        @clearForm(form)

        if form.id == "reply-form" or Nullchan.currentPage() == "thread"
          form.style.display = "none" if form.id == "reply-form"
          Threads.appendPost(newPost)
        else 
          Nullchan.determineRoute()
    return false

  handleError: (err) =>
    Nullchan.displayError(err)
    for form in document.getElementsByClassName("form loading")
      @blurForm(form, false)

  validateFormData: (data) =>
    if data.body.length > 3000
      return "Comment length shouldn't exceed 3000 symbols."
    if data.body.length == 0 && !!!data.file
      return "Your post is empty, need a comment or a file."
    if !!data.file
      unless data.file.type in ["image/jpeg", "image/png", "image/gif"]
        return "Your file is not an image."
    return true


  uploadPost: (formData) =>
    new Promise (fulfill, reject) =>
      filePath = ("data/users/#{Nullchan.getSiteInfo().auth_address}/data.json")
      Nullchan.cmd "fileGet", { inner_path: filePath, required: true }, (data) =>
        if !!data
          try 
            data = JSON.parse(data)
          catch err
            data = { message: [] }
        else
          data = { message: [] }

        formData.hashsum = md5(JSON.stringify(formData))
        data.message.push(formData)
        json = unescape(encodeURIComponent(JSON.stringify(data, undefined, '  ')))

        Nullchan.uploadFile(btoa(json), "data.json", true).then(=> 
          fulfill(formData)
        ).catch (err) => reject(err)

  processFiles: (formData) =>
    new Promise (fulfill, reject) =>
      if !formData.file
        delete formData.file
        return fulfill(formData)

      image  = document.createElement("img")
      reader = new FileReader()

      reader.onload = (event) => image.src = event.target.result
      image.onload  = =>
        canvas    = document.createElement("canvas")
        ctx       = canvas.getContext("2d")
        canvas.width  = image.width
        canvas.height = image.height

        ctx.drawImage(image, 0, 0, image.width, image.height)
        imageFull   = canvas.toDataURL("image/jpeg", 1).split(',')[1]
        maxWidth    = 200
        maxHeight   = 200
        width       = image.width
        height      = image.height

        if width > height
          if width > maxWidth
            height *= (maxWidth / width)
            width   = maxWidth
        else
          if height > maxHeight
            width *= (maxHeight/ height)
            height = maxHeight

        canvas.width  = width
        canvas.height = height
        ctx = canvas.getContext("2d")
        ctx.drawImage(image, 0, 0, width, height)
        imageThumb = canvas.toDataURL("image/jpeg", 1).split(',')[1]
        hash = md5(imageFull)

        Nullchan.uploadFile(imageFull, (hash + ".jpg"), false).then (fullPath) =>
          Nullchan.uploadFile(imageThumb, (hash + "-thumb.jpg"), false).then (thumbPath) =>
            formData.file_thumb = thumbPath
            formData.file_full  = fullPath
            delete formData.file

            fulfill(formData)
      reader.readAsDataURL(formData.file)

  collectFormData: (form) =>
    result = 
      body:       form.getElementsByClassName("text")[0].value.trim()
      file:       form.getElementsByClassName("file")[0].files[0]
      created_at: Time.timestamp()
      parent:     form.getElementsByClassName("parent")[0].value

    if !!!result.parent
      result.parent = null

    name = form.getElementsByClassName("name")[0]
    result.anonymous = (name.options[name.selectedIndex].value == "anonymous")
    return result

  updateAuthForms: (state) =>
    new Promise (fulfill, reject) =>
      for auth in document.getElementsByClassName("auth-form")
        auth.innerHTML = Templates.render("auth-form", { user: Nullchan.shortUserName() })
      fulfill()

  callReplyForm: (event) =>
    post   = event.target.parentNode.parentNode.parentNode
    thread = post.parentNode
    hash   = thread.dataset.hashsum

    if !@replyForm
      el = document.createElement("div")
      el.innerHTML = Templates.render("form")
      @replyForm = el.firstChild
      @replyForm.id = "reply-form"
      @replyForm.addEventListener("submit", @handleSubmit)

    thread.insertBefore(@replyForm, post.nextSibling)
    @replyForm.style.display = "table"
    @replyForm.getElementsByClassName("text")[0].focus()
    @replyForm.getElementsByClassName("parent")[0].value = hash
    @updateAuthForms()

  clearForm: (form) =>
    form.reset()

window.Forms = new Forms()

