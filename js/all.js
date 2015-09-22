

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



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/lib/frame.coffee ---- */


(function() {
  var ZeroFrame,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  ZeroFrame = (function() {
    function ZeroFrame(url) {
      this.onCloseWebsocket = bind(this.onCloseWebsocket, this);
      this.onOpenWebsocket = bind(this.onOpenWebsocket, this);
      this.route = bind(this.route, this);
      this.onMessage = bind(this.onMessage, this);
      this.url = url;
      this.waiting_cb = {};
      this.connect();
      this.next_message_id = 1;
      this.init();
    }

    ZeroFrame.prototype.init = function() {
      return this;
    };

    ZeroFrame.prototype.connect = function() {
      this.target = window.parent;
      window.addEventListener("message", this.onMessage, false);
      return this.cmd("innerReady");
    };

    ZeroFrame.prototype.onMessage = function(e) {
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

    ZeroFrame.prototype.route = function(cmd, message) {
      return this.log("Unknown command", message);
    };

    ZeroFrame.prototype.response = function(to, result) {
      return this.send({
        "cmd": "response",
        "to": to,
        "result": result
      });
    };

    ZeroFrame.prototype.cmd = function(cmd, params, cb) {
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

    ZeroFrame.prototype.send = function(message, cb) {
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

    ZeroFrame.prototype.log = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return console.log.apply(console, ["[ZeroFrame]"].concat(slice.call(args)));
    };

    ZeroFrame.prototype.onOpenWebsocket = function() {
      return this.log("Websocket open");
    };

    ZeroFrame.prototype.onCloseWebsocket = function() {
      return this.log("Websocket close");
    };

    return ZeroFrame;

  })();

  window.ZeroFrame = ZeroFrame;

}).call(this);


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


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/forms.coffee ---- */


(function() {
  var Forms,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Forms = (function() {
    function Forms() {
      this.clearForm = bind(this.clearForm, this);
      this.callReplyForm = bind(this.callReplyForm, this);
      this.updateAuthForms = bind(this.updateAuthForms, this);
      this.collectFormData = bind(this.collectFormData, this);
      this.processFiles = bind(this.processFiles, this);
      this.uploadPost = bind(this.uploadPost, this);
      this.validateFormData = bind(this.validateFormData, this);
      this.handleError = bind(this.handleError, this);
      this.handleSubmit = bind(this.handleSubmit, this);
      this.blurForm = bind(this.blurForm, this);
      this.authPlease = bind(this.authPlease, this);
      this.bindEvents = bind(this.bindEvents, this);
      this.showTopForm = bind(this.showTopForm, this);
    }

    Forms.prototype.topForm = null;

    Forms.prototype.replyForm = null;

    Forms.prototype.showTopForm = function(event) {
      var button, element;
      button = document.getElementById("form-call-button");
      element = document.createElement("div");
      element.innerHTML = Templates.render("form");
      this.topForm = element.firstChild;
      button.parentNode.replaceChild(this.topForm, button);
      this.topForm.getElementsByClassName("text")[0].focus();
      if (Nullchan.currentPage() !== "list") {
        this.topForm.getElementsByClassName("parent")[0].value = Threads.currentThread();
      }
      return this.updateAuthForms().then((function(_this) {
        return function() {
          return _this.bindEvents(_this.topForm);
        };
      })(this));
    };

    Forms.prototype.bindEvents = function(form) {
      var auth;
      form.addEventListener("submit", this.handleSubmit);
      if ((auth = form.getElementsByClassName("auth-please")).length > 0) {
        return auth[0].addEventListener("click", this.authPlease);
      }
    };

    Forms.prototype.authPlease = function(event) {
      return Nullchan.cmd("certSelect", [["zeroid.bit"]]);
    };

    Forms.prototype.blurForm = function(form, state) {
      if (state === true) {
        return form.className = "form loading";
      } else {
        return form.className = "form";
      }
    };

    Forms.prototype.handleSubmit = function(event) {
      var data, form, validation;
      event.preventDefault();
      form = event.currentTarget;
      data = this.collectFormData(form);
      validation = this.validateFormData(data);
      if (validation !== true) {
        Nullchan.displayError(validation);
        return false;
      }
      this.blurForm(form, true);
      this.processFiles(data).then((function(_this) {
        return function(modifiedData) {
          return _this.uploadPost(modifiedData).then(function(newPost) {
            _this.blurForm(form, false);
            _this.clearForm(form);
            if (form.id === "reply-form" || Nullchan.currentPage() === "thread") {
              if (form.id === "reply-form") {
                form.style.display = "none";
              }
              return Threads.appendPost(newPost);
            } else {
              return Nullchan.determineRoute();
            }
          });
        };
      })(this));
      return false;
    };

    Forms.prototype.handleError = function(err) {
      var form, i, len, ref, results;
      Nullchan.displayError(err);
      ref = document.getElementsByClassName("form loading");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        form = ref[i];
        results.push(this.blurForm(form, false));
      }
      return results;
    };

    Forms.prototype.validateFormData = function(data) {
      var ref;
      if (data.body.length > 3000) {
        return "Comment length shouldn't exceed 3000 symbols.";
      }
      if (data.body.length === 0 && !!!data.file) {
        return "Your post is empty, need a comment or a file.";
      }
      if (!!data.file) {
        if ((ref = data.file.type) !== "image/jpeg" && ref !== "image/png" && ref !== "image/gif") {
          return "Your file is not an image.";
        }
      }
      return true;
    };

    Forms.prototype.uploadPost = function(formData) {
      return new Promise((function(_this) {
        return function(fulfill, reject) {
          var filePath;
          filePath = "data/users/" + (Nullchan.getSiteInfo().auth_address) + "/data.json";
          return Nullchan.cmd("fileGet", {
            inner_path: filePath,
            required: true
          }, function(data) {
            var err, error, json;
            if (!!data) {
              try {
                data = JSON.parse(data);
              } catch (error) {
                err = error;
                data = {
                  message: []
                };
              }
            } else {
              data = {
                message: []
              };
            }
            formData.hashsum = md5(JSON.stringify(formData));
            data.message.push(formData);
            json = unescape(encodeURIComponent(JSON.stringify(data, void 0, '  ')));
            return Nullchan.uploadFile(btoa(json), "data.json", true).then(function() {
              return fulfill(formData);
            })["catch"](function(err) {
              return reject(err);
            });
          });
        };
      })(this));
    };

    Forms.prototype.processFiles = function(formData) {
      return new Promise((function(_this) {
        return function(fulfill, reject) {
          var image, reader;
          if (!formData.file) {
            delete formData.file;
            return fulfill(formData);
          }
          image = document.createElement("img");
          reader = new FileReader();
          reader.onload = function(event) {
            return image.src = event.target.result;
          };
          image.onload = function() {
            var canvas, ctx, hash, height, imageFull, imageThumb, maxHeight, maxWidth, width;
            canvas = document.createElement("canvas");
            ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            imageFull = canvas.toDataURL("image/jpeg", 1).split(',')[1];
            maxWidth = 200;
            maxHeight = 200;
            width = image.width;
            height = image.height;
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            canvas.width = width;
            canvas.height = height;
            ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, width, height);
            imageThumb = canvas.toDataURL("image/jpeg", 1).split(',')[1];
            hash = md5(imageFull);
            return Nullchan.uploadFile(imageFull, hash + ".jpg", false).then(function(fullPath) {
              return Nullchan.uploadFile(imageThumb, hash + "-thumb.jpg", false).then(function(thumbPath) {
                formData.file_thumb = thumbPath;
                formData.file_full = fullPath;
                delete formData.file;
                return fulfill(formData);
              });
            });
          };
          return reader.readAsDataURL(formData.file);
        };
      })(this));
    };

    Forms.prototype.collectFormData = function(form) {
      var name, result;
      result = {
        body: form.getElementsByClassName("text")[0].value.trim(),
        file: form.getElementsByClassName("file")[0].files[0],
        created_at: Time.timestamp(),
        parent: form.getElementsByClassName("parent")[0].value
      };
      if (!!!result.parent) {
        result.parent = null;
      }
      name = form.getElementsByClassName("name")[0];
      result.anonymous = name.options[name.selectedIndex].value === "anonymous";
      return result;
    };

    Forms.prototype.updateAuthForms = function(state) {
      return new Promise((function(_this) {
        return function(fulfill, reject) {
          var auth, i, len, ref;
          ref = document.getElementsByClassName("auth-form");
          for (i = 0, len = ref.length; i < len; i++) {
            auth = ref[i];
            auth.innerHTML = Templates.render("auth-form", {
              user: Nullchan.shortUserName()
            });
          }
          return fulfill();
        };
      })(this));
    };

    Forms.prototype.callReplyForm = function(event) {
      var el, hash, post, thread;
      post = event.target.parentNode.parentNode.parentNode;
      thread = post.parentNode;
      hash = thread.dataset.hashsum;
      if (!this.replyForm) {
        el = document.createElement("div");
        el.innerHTML = Templates.render("form");
        this.replyForm = el.firstChild;
        this.replyForm.id = "reply-form";
        this.replyForm.addEventListener("submit", this.handleSubmit);
      }
      thread.insertBefore(this.replyForm, post.nextSibling);
      this.replyForm.style.display = "table";
      this.replyForm.getElementsByClassName("text")[0].focus();
      this.replyForm.getElementsByClassName("parent")[0].value = hash;
      return this.updateAuthForms();
    };

    Forms.prototype.clearForm = function(form) {
      return form.reset();
    };

    return Forms;

  })();

  window.Forms = new Forms();

}).call(this);


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/header.coffee ---- */


(function() {
  var Header,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Header = (function() {
    Header.element = null;

    function Header() {
      this.update = bind(this.update, this);
      this.element = document.getElementById("header");
    }

    Header.prototype.update = function(siteInfo, settings) {
      var link;
      this.element.outerHTML = Templates.render("header", {
        boardName: "Development",
        peers: siteInfo.settings.peers,
        siteSize: formatSizeUnits(siteInfo.settings.size)
      });
      this.element = document.getElementById("header");
      if (document.location.pathname === "/") {
        link = document.getElementById("nullchan-link");
        return link.href = "//0chan.bit";
      }
    };

    return Header;

  })();

  window.Header = new Header();

}).call(this);


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/markup.coffee ---- */


(function() {
  var Markup,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Markup = (function() {
    function Markup() {
      this.escapeHTML = bind(this.escapeHTML, this);
      this.render = bind(this.render, this);
    }

    Markup.prototype.htmlEntityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };

    Markup.prototype.expressions = [
      [
        /^\s*&gt;\s{0,1}(.+?)$/mg, (function(match, content) {
          var br;
          if (content.substring(0, 3) === "&gt;") {
            return match;
          }
          br = "";
          if (match[0] === "\n") {
            br = "<br>";
          }
          return br + "<em class='quote'>&gt; " + content + "</em>";
        })
      ], [/\*\*([\s\S]+?)\*\*/mg, '<em class="bold">$1</em>'], [/\*([\s\S]+?)\*/mg, '<em class="italic">$1</em>'], [/(^|\s|\A)__([\s\S]+?)__(\s|\z|$)/mg, '$1<em class="underline">$2</em>$3'], [
        /\^([\s\S]+?)\^/mg, (function(match, text) {
          if (text.match(/^_+$/)) {
            return match;
          }
          return "<em class='strike'>" + text + "</em>";
        })
      ], [/%%([\s\S]+?)%%/mg, '<em class="spoiler">$1</em>'], [/\r?\n/g, "\n"], [/\n/g, '<br>'], [/(<br>){2,}/g, '<br><br>']
    ];

    Markup.prototype.render = function(content) {
      var exp, i, len, ref;
      content = this.escapeHTML(content);
      content = content.trim();
      ref = this.expressions;
      for (i = 0, len = ref.length; i < len; i++) {
        exp = ref[i];
        content = content.replace(exp[0], exp[1]);
      }
      return content;
    };

    Markup.prototype.escapeHTML = function(raw) {
      return String(raw).replace(/[&<>"'\/]/g, (function(_this) {
        return function(s) {
          return _this.htmlEntityMap[s];
        };
      })(this));
    };

    return Markup;

  })();

  window.Markup = new Markup();

}).call(this);


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/templates.coffee ---- */


(function() {
  var Templates,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Templates = (function() {
    function Templates() {
      this.render = bind(this.render, this);
      var i, len, name, ref, script;
      this.templates = {};
      ref = document.getElementsByClassName("template");
      for (i = 0, len = ref.length; i < len; i++) {
        script = ref[i];
        name = script.id.replace("-template", "");
        this.templates[name] = script.innerHTML.trim();
        Mustache.parse(this.templates[name]);
      }
    }

    Templates.prototype.render = function(templateName, data) {
      return Mustache.render(this.templates[templateName], data);
    };

    return Templates;

  })();

  window.Templates = new Templates();

}).call(this);


/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/threads.coffee ---- */


(function() {
  var Threads, sortPosts, sortThreads,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Threads = (function() {
    Threads.prototype.container = null;

    Threads.prototype.cachedPosts = null;

    Threads.prototype.current = null;

    function Threads() {
      this.bindEvents = bind(this.bindEvents, this);
      this.renderNotFound = bind(this.renderNotFound, this);
      this.expandThread = bind(this.expandThread, this);
      this.drawButton = bind(this.drawButton, this);
      this.appendPost = bind(this.appendPost, this);
      this.loadThreads = bind(this.loadThreads, this);
      this.preparePostInfo = bind(this.preparePostInfo, this);
      this.renderThread = bind(this.renderThread, this);
      this.showList = bind(this.showList, this);
      this.showThread = bind(this.showThread, this);
      this.currentThread = bind(this.currentThread, this);
      this.container = document.getElementById("container");
    }

    Threads.prototype.currentThread = function() {
      return this.current;
    };

    Threads.prototype.showThread = function(hashsum) {
      return new Promise((function(_this) {
        return function(fulfill, reject) {
          var parent, query;
          parent = encodeURI(hashsum);
          query = "SELECT message.* FROM message WHERE message.hashsum = '" + parent + "'";
          return Nullchan.cmd('dbQuery', query, function(opening) {
            if (opening.length === 0) {
              _this.renderNotFound();
              return fulfill();
            }
            _this.current = parent;
            query = "SELECT message.*, keyvalue.value AS cert_user_id FROM message\nLEFT JOIN json AS data_json USING (json_id)\nLEFT JOIN json AS content_json ON (\n  data_json.directory = content_json.directory AND content_json.file_name = 'content.json'\n)\nLEFT JOIN keyvalue ON (keyvalue.key = 'cert_user_id' AND keyvalue.json_id = content_json.json_id)\nWHERE message.hashsum = '" + _this.current + "' OR message.parent = '" + _this.current + "'\nORDER BY message.created_at ASC";
            return Nullchan.cmd('dbQuery', query, function(data) {
              _this.container.innerHTML = "";
              _this.drawButton("reply to thread");
              _this.container.appendChild(_this.renderThread(data, true));
              _this.bindEvents();
              return fulfill();
            });
          });
        };
      })(this));
    };

    Threads.prototype.showList = function() {
      return new Promise((function(_this) {
        return function(fulfill, reject) {
          _this.container.innerHTML = "";
          _this.drawButton("start new thread");
          return _this.loadThreads().then(function(threads) {
            var cnt, i, len, ref, thread;
            ref = threads.slice(0, 21);
            for (i = 0, len = ref.length; i < len; i++) {
              thread = ref[i];
              if ((cnt = _this.renderThread(thread, false))) {
                _this.container.appendChild(cnt);
              }
            }
            _this.bindEvents();
            return fulfill();
          });
        };
      })(this));
    };

    Threads.prototype.renderThread = function(data, full) {
      var i, len, post, posts, thread;
      posts = data;
      thread = document.createElement("div");
      if (data[0] === null) {
        return false;
      }
      thread.id = "thread-" + data[0].hashsum;
      thread.dataset.hashsum = data[0].hashsum;
      thread.className = "thread";
      if (posts.length > 6 && full !== true) {
        posts = [posts[0], "expand"].concat(posts.slice(posts.length - 5, posts.length));
      }
      for (i = 0, len = posts.length; i < len; i++) {
        post = posts[i];
        if (post === "expand") {
          thread.innerHTML += Templates.render("skip-gap", {
            count: data.length - 6
          });
          continue;
        }
        this.preparePostInfo(post);
        thread.innerHTML += Templates.render("post", {
          post: post
        });
      }
      return thread;
    };

    Threads.prototype.preparePostInfo = function(post) {
      post.time = Time.since(post.created_at);
      if (!post.processed) {
        post.original_body = post.body;
        post.hashsum_short = post.hashsum.substring(22, 32);
        post.body = Markup.render(post.original_body);
        post.user = Nullchan.shortUserName(post.cert_user_id);
        post.processed = true;
        return post.button = !!!post.parent && Nullchan.currentPage() === "list";
      }
    };

    Threads.prototype.loadThreads = function() {
      return new Promise((function(_this) {
        return function(fulfill, reject) {
          var query;
          query = 'SELECT message.*, keyvalue.value AS cert_user_id FROM message\nLEFT JOIN json AS data_json USING (json_id)\nLEFT JOIN json AS content_json ON (\n  data_json.directory = content_json.directory AND content_json.file_name = \'content.json\'\n)\nLEFT JOIN keyvalue ON (keyvalue.key = \'cert_user_id\' AND keyvalue.json_id = content_json.json_id)';
          return Nullchan.cmd("dbQuery", query, function(data) {
            var hash, i, len, post, posts, threadHash, threads;
            posts = {};
            threads = [];
            for (i = 0, len = data.length; i < len; i++) {
              post = data[i];
              threadHash = post.parent || post.hashsum;
              if (!!!posts[threadHash]) {
                posts[threadHash] = {
                  opening: null,
                  replies: []
                };
              }
              if (post.parent === null) {
                posts[threadHash].opening = post;
              } else {
                posts[threadHash].replies.push(post);
              }
            }
            _this.cachedPosts = posts;
            for (hash in posts) {
              post = posts[hash];
              threads.push([post.opening].concat(post.replies.sort(sortPosts)));
            }
            return fulfill(threads.sort(sortThreads));
          });
        };
      })(this));
    };

    Threads.prototype.appendPost = function(post) {
      var ref, thread;
      thread = document.getElementById("thread-" + post.parent);
      if (!thread) {
        return false;
      }
      this.preparePostInfo(post);
      if ((ref = this.cachedPosts) != null ? ref[post.parent] : void 0) {
        this.cachedPosts[post.parent].replies.push(post);
      }
      thread.innerHTML += Templates.render("post", {
        post: post
      });
      return document.getElementById("post-" + post.hashsum_short).scrollIntoView();
    };

    Threads.prototype.drawButton = function(text) {
      container.innerHTML = Templates.render("form-call-button", {
        text: text
      });
      return document.getElementById("form-call-button").addEventListener("click", Forms.showTopForm);
    };

    Threads.prototype.expandThread = function(event) {
      var data, gap, posts, thread;
      gap = event.target;
      if (gap.className === "expand-button") {
        gap = gap.parentNode;
      }
      thread = gap.parentNode;
      posts = this.cachedPosts[thread.dataset.hashsum];
      gap.innerHTML = "loading...";
      if (!posts) {
        alert("Thread not found, wtf?");
        return false;
      }
      data = [posts.opening].concat(posts.replies.sort(sortPosts));
      return thread.innerHTML = this.renderThread(data, true).innerHTML;
    };

    Threads.prototype.renderNotFound = function() {
      return this.container.innerHTML = Templates.render("not-found");
    };

    Threads.prototype.bindEvents = function() {
      return container.addEventListener("click", (function(_this) {
        return function(event) {
          var err, error, ref;
          if ((ref = event.target.className) === "skip-gap" || ref === "expand-button") {
            _this.expandThread(event);
          }
          try {
            if (event.target.parentNode.className === "time-and-id") {
              return Forms.callReplyForm(event);
            }
          } catch (error) {
            err = error;
          }
        };
      })(this));
    };

    return Threads;

  })();

  sortPosts = (function(_this) {
    return function(a, b) {
      if (a.created_at > b.created_at) {
        return 1;
      }
      return -1;
    };
  })(this);

  sortThreads = (function(_this) {
    return function(a, b) {
      if (a[a.length - 1].created_at > b[b.length - 1].created_at) {
        return -1;
      }
      return 1;
    };
  })(this);

  window.Threads = new Threads();

}).call(this);



/* ---- data/14kr6qSTxrHAcNEhZQ6RWZyovnyhzXT2Ag/js/zengine/z.coffee ---- */


(function() {
  var Nullchan,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Nullchan = (function(superClass) {
    extend(Nullchan, superClass);

    function Nullchan() {
      this.uploadFile = bind(this.uploadFile, this);
      this.displayError = bind(this.displayError, this);
      this.shortUserName = bind(this.shortUserName, this);
      this.togglePreloader = bind(this.togglePreloader, this);
      this.getSiteInfo = bind(this.getSiteInfo, this);
      this.determineRoute = bind(this.determineRoute, this);
      this.loadSettings = bind(this.loadSettings, this);
      this.loadSiteInfo = bind(this.loadSiteInfo, this);
      this.currentPage = bind(this.currentPage, this);
      this.updateSiteInfo = bind(this.updateSiteInfo, this);
      this.route = bind(this.route, this);
      this.onOpenWebsocket = bind(this.onOpenWebsocket, this);
      this.init = bind(this.init, this);
      return Nullchan.__super__.constructor.apply(this, arguments);
    }

    Nullchan.prototype.initialized = false;

    Nullchan.prototype.settings = null;

    Nullchan.prototype.siteInfo = null;

    Nullchan.prototype.container = null;

    Nullchan.prototype.preloader = null;

    Nullchan.prototype.page = null;

    Nullchan.prototype.init = function() {
      this.container = document.getElementById("container");
      return this.preloader = document.getElementById("preloader");
    };

    Nullchan.prototype.onOpenWebsocket = function(event) {
      if (!this.initialized) {
        this.initialized = true;
        return this.loadSettings().then((function(_this) {
          return function() {
            return _this.loadSiteInfo().then(function(newInfo) {
              _this.updateSiteInfo(newInfo);
              return _this.determineRoute();
            });
          };
        })(this));
      }
    };

    Nullchan.prototype.route = function(command, message) {
      if (command === "setSiteInfo") {
        return this.updateSiteInfo(message.params);
      }
    };

    Nullchan.prototype.updateSiteInfo = function(newInfo) {
      this.siteInfo = newInfo;
      Header.update(this.siteInfo, this.settings);
      return Forms.updateAuthForms();
    };

    Nullchan.prototype.currentPage = function() {
      return this.page;
    };

    Nullchan.prototype.loadSiteInfo = function() {
      return new Promise((function(_this) {
        return function(fulfill, reject) {
          return _this.cmd("siteInfo", {}, function(newInfo) {
            return fulfill(newInfo);
          });
        };
      })(this));
    };

    Nullchan.prototype.loadSettings = function() {
      return new Promise((function(_this) {
        return function(fulfill, reject) {
          return _this.cmd("fileGet", {
            inner_path: "data/settings.json",
            required: true
          }, function(data) {
            var err, error, settings;
            try {
              settings = JSON.parse(data);
            } catch (error) {
              err = error;
              alert("Fix your settings file!");
              settings = {};
            }
            return fulfill();
          });
        };
      })(this));
    };

    Nullchan.prototype.determineRoute = function() {
      var i, len, pair, query, rawPair, ref;
      query = {};
      ref = window.location.search.substring(1).split('&');
      for (i = 0, len = ref.length; i < len; i++) {
        rawPair = ref[i];
        pair = rawPair.split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }
      if (!!query["thread"]) {
        this.page = "thread";
        return Threads.showThread(query["thread"]).then((function(_this) {
          return function() {
            return _this.togglePreloader(false);
          };
        })(this));
      } else {
        this.page = "list";
        return Threads.showList().then((function(_this) {
          return function() {
            return _this.togglePreloader(false);
          };
        })(this));
      }
    };

    Nullchan.prototype.getSiteInfo = function() {
      return this.siteInfo;
    };

    Nullchan.prototype.togglePreloader = function(state) {
      var active, inactive;
      if (state === true) {
        inactive = container;
        active = preloader;
      } else {
        inactive = preloader;
        active = container;
      }
      inactive.style.display = "none";
      active.style.display = "block";
      active.className = "fadein";
      return setTimeout(((function(_this) {
        return function() {
          return true.className = "";
        };
      })(this)), 1100);
    };

    Nullchan.prototype.shortUserName = function(full) {
      if (!full) {
        full = this.siteInfo.cert_user_id;
      }
      if (full === "edisontrent@zeroid.bit") {
        return "[dev] edisontrent";
      }
      if (!full) {
        return full;
      }
      return full.split("@")[0];
    };

    Nullchan.prototype.displayError = function(text) {
      return this.cmd("wrapperNotification", ["error", text, 5000]);
    };

    Nullchan.prototype.uploadFile = function(rawBase64, fileName, publish) {
      return new Promise((function(_this) {
        return function(fulfill, reject) {
          var dir, path;
          dir = "data/users/" + _this.siteInfo.auth_address + "/";
          path = dir + fileName;
          return _this.cmd("fileWrite", [path, rawBase64], function(write) {
            if (write === "ok") {
              if (publish === false) {
                return fulfill(path);
              } else {
                return _this.cmd("sitePublish", {
                  "inner_path": path
                }, function(publish) {
                  if (publish === "ok") {
                    return fulfill(path);
                  } else {
                    return reject(publish);
                  }
                });
              }
            } else {
              return reject(write);
            }
          });
        };
      })(this));
    };

    return Nullchan;

  })(ZeroFrame);

  window.Nullchan = new Nullchan();

}).call(this);