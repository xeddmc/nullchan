class Threads
  container:    null
  cachedPosts:  null
  current:      null

  constructor: ->
    @container = document.getElementById("container")

  currentThread: => @current

  showThread: (hashsum) =>
    new Promise (fulfill, reject) =>
      parent = encodeURI(hashsum)
      query  = "SELECT message.* FROM message WHERE message.hashsum = '#{parent}'"

      Nullchan.cmd 'dbQuery', query, (opening) =>
        if opening.length == 0
          @renderNotFound()
          return fulfill()

        @current = parent
        query = """
          SELECT message.*, keyvalue.value AS cert_user_id FROM message
          LEFT JOIN json AS data_json USING (json_id)
          LEFT JOIN json AS content_json ON (
            data_json.directory = content_json.directory AND content_json.file_name = 'content.json'
          )
          LEFT JOIN keyvalue ON (keyvalue.key = 'cert_user_id' AND keyvalue.json_id = content_json.json_id)
          WHERE message.hashsum = '#{@current}' OR message.parent = '#{@current}'
          ORDER BY message.created_at ASC
        """

        Nullchan.cmd 'dbQuery', query, (data) =>
          @container.innerHTML = ""
          @drawButton("reply to thread")
          @container.appendChild(@renderThread(data, true))
          @bindEvents()
          fulfill()

  showList: =>
    new Promise (fulfill, reject) =>
      @container.innerHTML = ""
      @drawButton("start new thread")
      @loadThreads().then (threads) =>
        for thread in threads[0..20]
          if (cnt = @renderThread(thread, false))
            @container.appendChild(cnt)
        @bindEvents()
        fulfill()

  renderThread: (data, full) =>
    posts  = data
    thread = document.createElement("div")

    if data[0] == null
      return false

    thread.id = ("thread-" + data[0].hashsum)
    thread.dataset.hashsum = data[0].hashsum
    thread.className = "thread"

    if posts.length > 6 and full != true
      posts = [posts[0], "expand"].concat(posts.slice(posts.length-5, posts.length))

    for post in posts 
      if post == "expand"
        thread.innerHTML += Templates.render("skip-gap", { count: (data.length - 6) })
        continue
      @preparePostInfo(post)
      thread.innerHTML += Templates.render("post", { post: post })

    return(thread)

  preparePostInfo: (post) =>
    post.time = Time.since(post.created_at)
    unless post.processed
      post.original_body = post.body
      post.hashsum_short = post.hashsum.substring(22, 32)
      post.body = Markup.render(post.original_body)
      post.user = Nullchan.shortUserName(post.cert_user_id)
      post.processed = true
      post.button = (!!!post.parent and Nullchan.currentPage() == "list")

  loadThreads: =>
    new Promise (fulfill, reject) =>
      query = '''
        SELECT message.*, keyvalue.value AS cert_user_id FROM message
        LEFT JOIN json AS data_json USING (json_id)
        LEFT JOIN json AS content_json ON (
          data_json.directory = content_json.directory AND content_json.file_name = 'content.json'
        )
        LEFT JOIN keyvalue ON (keyvalue.key = 'cert_user_id' AND keyvalue.json_id = content_json.json_id)
      '''

      Nullchan.cmd "dbQuery", query, (data) =>
        posts   = {}
        threads = []

        for post in data
          threadHash = (post.parent || post.hashsum)
          if !!!posts[threadHash]
            posts[threadHash] = { opening: null, replies: [] }
          if post.parent == null
            posts[threadHash].opening = post
          else
            posts[threadHash].replies.push(post)

        @cachedPosts = posts

        for hash, post of posts 
          threads.push([post.opening].concat(post.replies.sort(sortPosts)))

        fulfill(threads.sort(sortThreads))

  appendPost: (post) =>
    thread = document.getElementById("thread-" + post.parent)
    if !thread
      return false

    @preparePostInfo(post)
    if @cachedPosts?[post.parent]
      @cachedPosts[post.parent].replies.push(post)
    thread.innerHTML += Templates.render("post", { post: post })
    document.getElementById("post-#{post.hashsum_short}").scrollIntoView()

  drawButton: (text) =>
    container.innerHTML = Templates.render("form-call-button", { text })
    document.getElementById("form-call-button").addEventListener("click", Forms.showTopForm)

  expandThread: (event) =>
    gap = event.target
    if gap.className == "expand-button"
      gap = gap.parentNode
    thread  = gap.parentNode
    posts   = @cachedPosts[thread.dataset.hashsum]
    gap.innerHTML = "loading..."

    unless posts
      alert("Thread not found, wtf?")
      return false

    data = [posts.opening].concat(posts.replies.sort(sortPosts))
    thread.innerHTML = @renderThread(data, true).innerHTML

  renderNotFound: =>
    @container.innerHTML = Templates.render("not-found")

  bindEvents: =>
    container.addEventListener "click", (event) =>
      if event.target.className in ["skip-gap", "expand-button"]
        @expandThread(event)

      try 
        if event.target.parentNode.className == "time-and-id"
          Forms.callReplyForm(event)
      catch err

sortPosts = (a, b) =>
  if a.created_at > b.created_at
    return 1
  return -1
sortThreads = (a, b) =>
  if a[a.length-1].created_at > b[b.length-1].created_at
    return -1
  return 1

window.Threads = new Threads()

