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