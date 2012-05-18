(function() {

EU_Cookie = {

    useOwnStyle: false, // set this to true if you want to custom css
                        // markup: <div id="EU_Cookie"><div>
                        // <p>Text</p>
                        // <button class="accept">Text</button>
                        // <button class="decline">Text</button>
                        // </div></div>
    message: 'This site uses cookies. <br /> EU regulations require us to gain your consent before continuing',
    refused: 'You chose not to enable cookies. <br /> To view this site please accept cookies',
    accept_text: 'Accept',
    decline_text: 'No thanks',
    //
    // You shouldn't need to customise anything below this line

    init: function() {

        var consent = docCookies.getItem('consent');
        if (consent === 'yes') {
            docCookies.setItem('consent', true, 31536e3);
        } else if (consent === 'no') {
            EU_Cookie.popup('refused');
        }
        else {
            EU_Cookie.popup();
        }

    },


    popup: function(type) {
   
        var body = document.getElementsByTagName('body')[0],
            wrap= document.createElement('div'),
            msg = EU_Cookie.template(type),
            div, top, anim;


        body.appendChild(wrap, body.firstChild);
        wrap.innerHTML = msg;
        wrap.id = 'EU_Cookie';
        div = wrap.firstChild;

        top = parseInt( div.style.top, 10 );

        function moveBox() {
            top += 5;
            div.style.top = top + 'px';
            if (top >= 100) {
                clearInterval(anim); 
            }
 
        }

        anim = setInterval(moveBox, 1000 / 60);

},


    template: function(type) {

        type = type || 'firstTime';

        var html, text,
            divStyle = [
                'div style="',
            'position: absolute; background: #000; color: #fff; top: -100px; left: 25%; width: 50%;',
            'text-align: center; display: block; padding: 1em, 0; border-radius: 5px;',
                '"'
            ],
            buttonStyle = [
                'button style="', 
                'border: none; background: #5f5; color: #000; border-radius: 5px; ',
                'font-size: 120%; margin: 1em;',
                '"'
            ],
            noButtonStyle = [
                'button style="', 
                'border: none; color: #fff; background: #000;',
                'font-size: 100%; margin-top: 1em;',
                '"'
            ],
            template = [
            '<{DIV}',
            '>',
            '{TEXT}',
            '</div>'
        ],
            firstTime = [
            '<p>',
            '{MESSAGE}',
            '<br />',
            '<{BUTTON}  class="accept" onclick="EU_Cookie.accept(); return false;">{ACCEPT}</button> ',
            '<{NOBUTTON} class="decline" onclick="EU_Cookie.decline(); return false;">{DECLINE}</button> </p>'
        ],
            refused = [
            
            '<p>',
            '{MESSAGE}',
            '</p>',
            '<{BUTTON} class="accept" onclick="EU_Cookie.accept(); return false;">Accept Now?</button> '
        ];
       
   
        html = template.join("\n");
        firstTime = firstTime.join("\n")
                        .replace(/\{MESSAGE\}/g, EU_Cookie.message);
        refused = refused.join("\n")
                        .replace(/\{MESSAGE\}/g, EU_Cookie.refused);

        text = (type === 'firstTime') ?
            firstTime : refused;
        html = html.replace(/\{TEXT\}/g, text);
        html = html.replace(/\{DIV\}/g, 
                ( EU_Cookie.useOwnStyle === true) ?
                    'div' : divStyle.join(''));

        html = html.replace(/\{BUTTON\}/g, 
                ( EU_Cookie.useOwnStyle === true) ?
                    'button class="accept"' : buttonStyle.join(''));

        html = html.replace(/\{NOBUTTON\}/g, 
                ( EU_Cookie.useOwnStyle === true) ?
                    'button class="decline"' : noButtonStyle.join(''));

        html = html.replace(/\{ACCEPT\}/g, EU_Cookie.accept_text);
        html = html.replace(/\{DECLINE\}/g, EU_Cookie.decline_text);


        return html;


    },


    accept: function() {

        var body = document.getElementsByTagName('body')[0],
            div = document.getElementById('EU_Cookie');

        body.removeChild(div);
        docCookies.setItem('consent', 'yes', 31536e3);

    },


    decline: function() {

        var body = document.getElementsByTagName('body')[0],
            div = document.getElementById('EU_Cookie');

        docCookies.setItem('consent', 'no', 31536e3);

        window.location = window.location;

    }


};


// https://developer.mozilla.org/en/DOM/document.cookie
var docCookies = {
  getItem: function (sKey) {
    if (!sKey || !this.hasItem(sKey)) { return null; }
    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/.test(sKey)) { return; }
    var sExpires = "";
    if (vEnd) {
      switch (typeof vEnd) {
        case "number": sExpires = "; max-age=" + vEnd; break;
        case "string": sExpires = "; expires=" + vEnd; break;
        case "object": if (vEnd.hasOwnProperty("toGMTString")) { sExpires = "; expires=" + vEnd.toGMTString(); } break;
      }
    }
    document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
  },
  removeItem: function (sKey) {
    if (!sKey || !this.hasItem(sKey)) { return; }
    var oExpDate = new Date();
    oExpDate.setDate(oExpDate.getDate() - 1);
    document.cookie = escape(sKey) + "=; expires=" + oExpDate.toGMTString() + "; path=/";
  },
  hasItem: function (sKey) { return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie); }
};

if (window.addEventListener) {
    window.addEventListener('load', EU_Cookie.init, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', EU_Cookie.init);
}

}());
