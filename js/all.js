

/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/lib/byte_size.js ---- */


window.formatSizeUnits = function(bytes) {
  if      (bytes>=1000000000) { bytes=(bytes/1000000000).toFixed(2)+' GB'; }
  else if (bytes>=1000000)    { bytes=(bytes/1000000).toFixed(2)+' MB';    }
  else if (bytes>=1000)       { bytes=(bytes/1000).toFixed(2)+' KB';       }
  else if (bytes>1)           { bytes=bytes+' bytes';                      }
  else if (bytes==1)          { bytes=bytes+' byte';                       }
  else                        { bytes='0 byte';                            }
  return bytes
};



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/lib/extend.js ---- */


!function(a){"use strict";function b(a){a.parent instanceof Function&&(b.apply(this,[a.parent]),this.super=c(this,d(this,this.constructor))),a.apply(this,arguments)}function c(a,b){for(var c in a)"super"!==c&&a[c]instanceof Function&&!(a[c].prototype instanceof Class)&&(b[c]=a[c].super||d(a,a[c]));return b}function d(a,b){var c=a.super;return b.super=function(){return a.super=c,b.apply(a,arguments)}}a.Class=function(){},a.Class.extend=function e(a){function d(){b!==arguments[0]&&(b.apply(this,[a]),c(this,this),this.initializer instanceof Function&&this.initializer.apply(this),this.constructor.apply(this,arguments))}return d.prototype=new this(b),d.prototype.constructor=d,d.toString=function(){return a.toString()},d.extend=function(b){return b.parent=a,e.apply(d,arguments)},d},a.Class=a.Class.extend(function(){this.constructor=function(){}})}(this);



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/lib/frame.js ---- */


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



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/lib/md5.js ---- */


!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/lib/mustache.js ---- */


(function defineMustache(global,factory){if(typeof exports==="object"&&exports&&typeof exports.nodeName!=="string"){factory(exports)}else if(typeof define==="function"&&define.amd){define(["exports"],factory)}else{global.Mustache={};factory(Mustache)}})(this,function mustacheFactory(mustache){var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==="[object Array]"};function isFunction(object){return typeof object==="function"}function typeStr(obj){return isArray(obj)?"array":typeof obj}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function hasProperty(obj,propName){return obj!=null&&typeof obj==="object"&&propName in obj}var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string)}var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"};function escapeHtml(string){return String(string).replace(/[&<>"'\/]/g,function fromEntityMap(s){return entityMap[s]})}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==="string")tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)throw new Error("Invalid tags: "+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+"\\s*");closingTagRe=new RegExp("\\s*"+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp("\\s*"+escapeRegExp("}"+tagsToCompile[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length)}else{nonSpace=true}tokens.push(["text",chr,start,start+1]);start+=1;if(chr==="\n")stripSpace()}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||"name";scanner.scan(whiteRe);if(type==="="){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type==="{"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type="&"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error("Unclosed tag at "+scanner.pos);token=[type,value,start,scanner.pos];tokens.push(token);if(type==="#"||type==="^"){sections.push(token)}else if(type==="/"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start)}else if(type==="name"||type==="{"||type==="&"){nonSpace=true}else if(type==="="){compileTags(value)}}openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==="text"&&lastToken&&lastToken[0]==="text"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":case"^":collector.push(token);sections.push(token);collector=token[4]=[];break;case"/":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function eos(){return this.tail===""};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)return"";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view;this.cache={".":this.view};this.parent=parentContext}Context.prototype.push=function push(view){return new Context(view,this)};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name]}else{var context=this,names,index,lookupHit=false;while(context){if(name.indexOf(".")>0){value=context.view;names=name.split(".");index=0;while(value!=null&&index<names.length){if(index===names.length-1)lookupHit=hasProperty(value,names[index]);value=value[names[index++]]}}else{value=context.view[name];lookupHit=hasProperty(context.view,name)}if(lookupHit)break;context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.cache={}}Writer.prototype.clearCache=function clearCache(){this.cache={}};Writer.prototype.parse=function parse(template,tags){var cache=this.cache;var tokens=cache[template];if(tokens==null)tokens=cache[template]=parseTemplate(template,tags);return tokens};Writer.prototype.render=function render(template,view,partials){var tokens=this.parse(template);var context=view instanceof Context?view:new Context(view);return this.renderTokens(tokens,context,partials,template)};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate){var buffer="";var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==="#")value=this.renderSection(token,context,partials,originalTemplate);else if(symbol==="^")value=this.renderInverted(token,context,partials,originalTemplate);else if(symbol===">")value=this.renderPartial(token,context,partials,originalTemplate);else if(symbol==="&")value=this.unescapedValue(token,context);else if(symbol==="name")value=this.escapedValue(token,context);else if(symbol==="text")value=this.rawValue(token);if(value!==undefined)buffer+=value}return buffer};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate){var self=this;var buffer="";var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials)}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate)}}else if(typeof value==="object"||typeof value==="string"||typeof value==="number"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate)}else if(isFunction(value)){if(typeof originalTemplate!=="string")throw new Error("Cannot use higher-order sections without the original template");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate)}return buffer};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate){var value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate)};Writer.prototype.renderPartial=function renderPartial(token,context,partials){if(!partials)return;var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null)return this.renderTokens(this.parse(value),context,partials,value)};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return value};Writer.prototype.escapedValue=function escapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return mustache.escape(value)};Writer.prototype.rawValue=function rawValue(token){return token[1]};mustache.name="mustache.js";mustache.version="2.1.3";mustache.tags=["{{","}}"];var defaultWriter=new Writer;mustache.clearCache=function clearCache(){return defaultWriter.clearCache()};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function render(template,view,partials){if(typeof template!=="string"){throw new TypeError('Invalid template! Template should be a "string" '+'but "'+typeStr(template)+'" was given as the first '+"argument for mustache#render(template, view, partials)")}return defaultWriter.render(template,view,partials)};mustache.to_html=function to_html(template,view,partials,send){var result=mustache.render(template,view,partials);if(isFunction(send)){send(result)}else{return result}};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer});


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/lib/promise-done.js ---- */


"function"!=typeof Promise.prototype.done&&(Promise.prototype.done=function(t,n){var o=arguments.length?this.then.apply(this,arguments):this;o.then(null,function(t){setTimeout(function(){throw t},0)})});



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/lib/time.coffee ---- */


(function() {
  var Time;

  Time = (function() {
    function Time() {}

    Time.prototype.since = function(time) {
      var back, now, secs;
      now = +(new Date) / 1000;
      secs = now - time;
      if (secs < 60) {
        back = "just now";
      } else if (secs < 60 * 60) {
        back = (Math.round(secs / 60)) + " minutes ago";
      } else if (secs < 60 * 60 * 24) {
        back = (Math.round(secs / 60 / 60)) + " hours ago";
      } else if (secs < 60 * 60 * 24 * 3) {
        back = (Math.round(secs / 60 / 60 / 24)) + " days ago";
      } else {
        back = "on " + this.date(time);
      }
      back = back.replace(/1 ([a-z]+)s/, "1 $1");
      return back;
    };

    Time.prototype.date = function(timestamp, format) {
      var display, parts;
      if (format == null) {
        format = "short";
      }
      parts = (new Date(timestamp * 1000)).toString().split(" ");
      if (format === "short") {
        display = parts.slice(1, 4);
      } else {
        display = parts.slice(1, 5);
      }
      return display.join(" ").replace(/( [0-9]{4})/, ",$1");
    };

    Time.prototype.timestamp = function(date) {
      if (date == null) {
        date = "";
      }
      if (date === "now" || date === "") {
        return parseInt(+(new Date) / 1000);
      } else {
        return parseInt(Date.parse(date) / 1000);
      }
    };

    Time.prototype.readtime = function(text) {
      var chars;
      chars = text.length;
      if (chars > 1500) {
        return parseInt(chars / 1500) + " min read";
      } else {
        return "less than 1 min read";
      }
    };

    return Time;

  })();

  window.Time = new Time;

}).call(this);


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/lib/url_regexp.js ---- */


window.urlRegexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((\:\d+)?(?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_\#\/\?\*\:]*))?)/g;


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/forms.js ---- */


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



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/header.js ---- */


(function() {
  var Header = Class.extend(function() {
    var element;

    this.constructor = function() {
      element = document.getElementById("header");
    };

    this.update = function(siteInfo, settings) {
      element.outerHTML = Templates.render("header", { 
        boardName:  settings.boardName,
        peers:      siteInfo.settings.peers,
        siteSize:   formatSizeUnits(siteInfo.settings.size),
      });
      element = document.getElementById("header");
    };
  });

  window.Header = new Header()
})();



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/markup.js ---- */


(function() {
  var Markup = Class.extend(function() {
    var expressions;
    var htmlEntityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;',
    };

    this.constructor = function() {
      var r;
      expressions = [
        // quote
        [(re = /^\s*&gt;\s{0,1}(.+?)$/mg), function(match, content) {
          if (content.substring(0, 3) == "&gt;") {
            console.log('dick');
            return match;
          }
          var br = "";
          if (match[0] == "\n") {
            br = "<br>";
          }

          return (br + "<em class='quote'>&gt; " + content + "</em>");
        }],

        // bold
        [(re = /\*\*([\s\S]+?)\*\*/mg), '<em class="bold">$1</em>'],

        // italic
        [(re =/\*([\s\S]+?)\*/mg), '<em class="italic">$1</em>'],

        // underline
        [(re = /(^|\s|\A)__([\s\S]+?)__(\s|\z|$)/mg), '$1<em class="underline">$2</em>$3'],

        // strike
        [(re = /\^([\s\S]+?)\^/mg), function(match, text) {
          if (text.match(/^_+$/)) {
            return match;
          } else {
            return ("<em class='strike'>" + text + "</em>");
          }
        }],

        // spoiler 
        [(re = /%%([\s\S]+?)%%/mg), '<em class="spoiler">$1</em>'],

        // line breaks
        [(re = /\r\n/g), '<br />'],
        [(re = /(<br \/>){2,}/g), '<br /><br />'],
      ];
    };

    this.render = function(content) {
      content = this.escapeHTML(content);
      content = content.trim();

      for (var i = 0; i < expressions.length; i++) {
        content = content.replace(expressions[i][0], expressions[i][1]);
      };

      return content;
    };

    this.escapeHTML = function(raw) {
      return String(raw).replace(/[&<>"'\/]/g, function(s) {
        return htmlEntityMap[s];
      }.bind(this))
    };
  });

  window.Markup = new Markup();
})();


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/templates.js ---- */


(function() {
  var Templates = Class.extend(function() {
    var templates;

    this.constructor = function() {
      // console.log("Loading templates...");
      templates = {};
      var scripts = document.getElementsByClassName("template");
      var i;

      for (i = 0; i < scripts.length; i++) {
        var name = scripts[i].id.replace("-template", "");
        templates[name] = scripts[i].innerHTML.trim();
        Mustache.parse(templates[name]);
        // console.log(" - template `" + name + "` loaded.");
      }
    };

    this.render = function(templateName, data) {
      return Mustache.render(templates[templateName], data);
    };
  })

  window.Templates = new Templates;
})();



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/threads.js ---- */


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
        if (event.target.className == "skip-gap") {
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



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/z.js ---- */


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