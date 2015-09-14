window.ZeroFrame = Class.extend(function() {
  var url;
  var waiting_cb;
  var next_message_id;
  var target;
  var slice = [].slice;

  this.constructor = function(url) {
    this.url = url;
    this.waiting_cb = {};
    this.connect();
    this.next_message_id = 1;
    this.init();
  };

  this.init = function() {
    console.log("INIT!");
    return this;
  };

  this.connect = function() {
    console.log("Connect");
    this.target = window.parent;
    window.addEventListener("message", this.onMessage, false);
    return this;
  };


  this.onMessage = function(e) {
    var cmd, message;
    message = e.data;
    cmd = message.cmd;
    if (cmd === "response") {
      if (this.waiting_cb[message.to] != null) {
        return this.waiting_cb[message.to](message.result);
      } else {
        return this.log("Websocket callback not found:", message);
      }
    } else if (cmd === "wrapperReady") {
      return this.cmd("innerReady");
    } else if (cmd === "ping") {
      return this.response(message.id, "pong");
    } else if (cmd === "wrapperOpenedWebsocket") {
      return this.onOpenWebsocket();
    } else if (cmd === "wrapperClosedWebsocket") {
      return this.onCloseWebsocket();
    } else {
      return this.route(cmd, message);
    }
  };

  this.route = function(cmd, message) {
    return this.log("Unknown command", message);
  };

  this.response = function(to, result) {
    return this.send({
      "cmd": "response",
      "to": to,
      "result": result
    });
  };

  this.cmd = function(cmd, params, cb) {
    if (params == null) {
      params = {};
    }
    if (cb == null) {
      cb = null;
    }
    return this.send({
      "cmd": cmd,
      "params": params
    }, cb);
  };

  this.send = function(message, cb) {
    if (cb == null) {
      cb = null;
    }
    message.id = this.next_message_id;
    this.next_message_id += 1;
    this.target.postMessage(message, "*");
    if (cb) {
      return this.waiting_cb[message.id] = cb;
    }
  };

  this.log = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return console.log.apply(console, ["[ZeroFrame]"].concat(slice.call(args)));
  };

  this.onOpenWebsocket = function() {
    return this.log("Websocket open");
  };

  this.onCloseWebsocket = function() {
    return this.log("Websocket close");
  };
});
