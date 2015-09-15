(function() { 
  var Threads = Class.extend(function() {
    var container;
    var cachedPosts;

    this.constructor = function() {
      container = document.getElementById("container");
    };

    this.showList = function() {
      return new Promise(function(fulfill, reject) {
        container.innerHTML = "";
        this.drawButton();
        this.loadThreads().then(function(threads) {
          for (var i = 0; i < threads.length; i++) {
            var cnt = this.renderThread(threads[i], false);
            if (cnt) {
              container.appendChild(cnt);
            }
          };
          this.bindEvents();
          fulfill();
        }.bind(this));
      }.bind(this))
    };

    this.renderThread = function(data, full) {
      var posts = data;
      var thread = document.createElement("div");

      if (data[0] == null) {
        return false;
      }

      thread.id = ("thread-" + data[0].hashsum);
      thread.dataset.hashsum = data[0].hashsum;
      thread.className = "thread";

      if (posts.length > 6 && full != true) {
        posts = [posts[0], "expand"].concat(posts.slice(posts.length-5, posts.length));
      }

      for (var i = 0; i < posts.length; i++) {
        if (posts[i] == "expand") {
          thread.innerHTML += Templates.render("skip-gap", { count: (data.length - 6) });
          continue;
        }

        this.preparePostInfo(posts[i]);
        console.log(JSON.stringify(posts[i].body))
        thread.innerHTML += Templates.render("post", { post: posts[i] });
      };

      return(thread);
    };

    this.preparePostInfo = function(post) {
      post.time = Time.since(post.created_at);

      if (!post.processed) {
        post.original_body = post.body;
        post.hashsum_short = post.hashsum.substring(22, 32);
        post.body = Markup.render(post.original_body);
        post.user = Nullchan.shortUserName(post.cert_user_id);
        post.processed = true;
      }
    };

    this.loadThreads = function() {
      return new Promise(function(fulfill, reject) {
        var query = ("SELECT message.*, keyvalue.value AS cert_user_id FROM message " + 
          "LEFT JOIN json AS data_json USING (json_id) " + 
          "LEFT JOIN json AS content_json ON (" + 
             "data_json.directory = content_json.directory AND content_json.file_name = 'content.json'" + 
          ")" + 
          "LEFT JOIN keyvalue ON (keyvalue.key = 'cert_user_id' AND keyvalue.json_id = content_json.json_id)")

        Nullchan.cmd("dbQuery", query, function(data) {
          var posts = {};
          var threads = [];

          for (var i = 0; i < data.length; i++) {
            var post = data[i];
            var threadHash = (post.parent || post.hashsum);

            if (!!!posts[threadHash]) {
              posts[threadHash] = { opening: null, replies: [] };
            }

            if (post.parent == null) {
              posts[threadHash].opening = post;
            } else {
              posts[threadHash].replies.push(post);
            }
          };

          cachedPosts = posts;

          for (var hash in posts) {
            if (posts.hasOwnProperty(hash)) {
              threads.push([posts[hash].opening].concat(posts[hash].replies.sort(sortPosts)))
            }
          }

          fulfill(threads.sort(sortThreads))
        }.bind(this));
      }.bind(this));
    };

    this.appendPost = function(post) {
      console.log(post);
      var thread = document.getElementById("thread-" + post.parent);

      if (!thread) {
        return false;
      }

      this.preparePostInfo(post);
      if (cachedPosts[post.parent]) {
        cachedPosts[post.parent].replies.push(post);
      }
      thread.innerHTML += Templates.render("post", { post: post });
    };

    this.drawButton = function() {
      container.innerHTML = Templates.render("form-call-button", { text: "start new thread" });
      document.getElementById("form-call-button").addEventListener("click", Forms.showTopForm);
    };

    this.expandThread = function(event) {
      var gap     = event.target;

      if (gap.className == "expand-button") {
        gap = gap.parentNode;
      }

      var thread  = gap.parentNode;
      var posts   = cachedPosts[thread.dataset.hashsum];
      gap.innerHTML = "loading...";

      if (!posts) {
        alert("Thread not found, wtf?");
        return false;
      }

      var data = [posts.opening].concat(posts.replies.sort(this.sortPosts));
      thread.innerHTML = this.renderThread(data, true).innerHTML;
    };

    this.bindEvents = function() {
      container.addEventListener("click", function(event) {
        if (event.target.className == "skip-gap" || event.target.className == "expand-button") {
          this.expandThread(event);
        }
        try {
          if (event.target.parentNode.className == "time-and-id") {
            Forms.callReplyForm(event);
          }
        } catch(err) {}
      }.bind(this))
    };
  });

  function sortPosts(a, b) {
    if (a.created_at > b.created_at) {
      return 1;
    }
    return -1;
  }

  function sortThreads(a, b) {
    if (a[a.length-1].created_at > b[b.length-1].created_at) {
      return -1;
    }
    return 1;
  }

  window.Threads = new Threads();
})();
