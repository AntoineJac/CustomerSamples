const rubiskin = function () {
    const self = this;
    let _document;
    let parentWindow;
    let rp_elementMarkerT;
    let rp_adband;
    const containerID = 'rp-skin-container-sandbox';
    const creativeID = 'rp-skin-creative';

    /**
     * @function interscroller#render
     * @param {object} ad response
     * @summary processes the ad response and calls interscroller functions
     */
    self.renderAd = (data) => {
        rp_elementMarkerT = data.insertionMarker;
        // Assign the correct document context
        _document = getCorrectDocument();

        init(data.fullBids, data.elementMarker, data.insertionMarker, data.expanderMarker, data.header_height, data.bgColor, data.custom_style_iframe, data.custom_style_page, data.iframe_url, data.contentWidth, data.click_url);
    
    };


//Stay 1 function:
//- add checkScroll function

    /**
     * @function init
     * @param {object} adResponse to add the ad response 
     * creative to a generated friendly iframe
     * @param {string} adDimensions ad dimensions in WxH format
     * @summary adds the interscroller stylesheet, 
     * creates an iframe and adds the interscoller animation
     */
    const init = (fullBids, rp_elementMarker, rp_insertionMarker, rp_expanderMarker, header_height, bgColor, custom_style_iframe, custom_style_page, iframe_url, contentWidth, clickUrl) => {
        const adDimensions = fullBids.size;
        document.querySelector('iframe[name^=google_ads_iframe]').style.display = 'none';
      console.log(fullBids);


        if (typeof rp_insertionMarker != 'undefined') {
          console.log("test1");
             if (typeof header_height != 'undefined')
             {
            rubiconExpanderSetup(header_height, rp_expanderMarker);
             };
            const containerIframe = getContainerIframe(
                adDimensions, rp_insertionMarker, rp_elementMarker, bgColor, custom_style_iframe, iframe_url, contentWidth
            );

            containerIframe.onload = function() {

            
            appendStyleSheet(custom_style_page);
            console.log('iframe loaded');
            console.log('post message', 'render');
            containerIframe.contentWindow.postMessage({
              message: 'render',
              html: fullBids.ad
             }, '*');

            function clickTracker(){
              var oFrame = document.getElementById(creativeID);
              var clickOk = false;
              oFrame.contentWindow.document.onclick = function() {
                if (clickOk == true) {
                  console.log("clickAlready");
                  return };
                 alert(clickUrl);
                 const clickTracker = _document.createElement('img'); 
                  clickTracker.id = "testTracker";
                 clickTracker.src = clickUrl;
                _document
            .getElementById(containerID)
            .appendChild(clickTracker);
             clickOk = true;
              };
            }
            setTimeout(clickTracker, 1000);
          };



        var fixedStyleWall =
          '.rp-bg-fixed { ' +
            'position: fixed !important; ' +
            'top: 0px !important; ' +
          '}' +
          '.rp-bg-scroll { ' +
            'position: inherit !important;' +
          '}';


            _style = _document.createElement('style');
            _style.setAttribute('type', 'text/css');
            _style.setAttribute('id', 'rubiconclientcss');
            _style.textContent = fixedStyleWall;
            document.getElementsByTagName('head')[0].appendChild(_style);
        if (window.attachEvent) {
          console.log("rr");
          _document.attachEvent('onscroll', checkScroll);
        } else {
          console.log("rr2");
          _document.addEventListener('scroll', checkScroll);
        }

        } else {
            console.error('RP: No element marker defined');
        }
    };

    const rubiconExpanderSetup = (header_height, expanderMarker) => {
    
   console.log("test12");
          rubiconExpander = _document.createElement('div');
          rubiconExpander.id = "rubiconExpander"
          rubiconExpander.className += 'rubicon-expander';
        var expenderT = _document.querySelector(expanderMarker);
        expenderT.insertBefore(rubiconExpander, expenderT.firstChild);
        rubiconExpander.style.height = header_height + 'px';
    }
    /**
     * @function appendStyleSheet
     * @param {string} adDimensions ad dimensions in WxH format
     * @summary adds a custom stylesheet to the dom. 
     * If rp_adband variable is present in the smart tag, 
     * additional ad band styles are added
     */

   function getCurrentScrollY() {

    var currentScrollY;

    if (!window.scrollY) {
      // for older IE support
      currentScrollY = _document.scrollTop;
    } else {
      // everyone else
      currentScrollY = window.scrollY;
    }

    return currentScrollY;
  }




function checkScroll() {

    var targetScrollYPos =  150; //rp_bg_scroll_ypos
    var _y = getCurrentScrollY();



    hasClass = function (str, elem) {

        var classStrings = elem.className.split(' ');
        
        var checkClass = function(array, matchString) {
            for (var i=0, l=array.length; i<l; i++) {
                if (array[i] === matchString) {
                    return true;
                }
            }
        };

        if (checkClass(classStrings, str)) {
            return true;
        } else {
            return false;
        }
    };

    addClass = function (str, elem) {
        if (hasClass(str, elem)) {
            return false;
        } else {
            var pad = elem.className.length > 0 ? " " : "";
            elem.className += (pad + str);
            return true;
        }
    };

    removeClass = function (str, elem) {
        if (hasClass(str, elem)) {
            var a = elem.className.split(" ");
            a.splice(a.indexOf(str),1);
            elem.className = a.join(" ");
            return true;
        } else {
            return false;
        }
    };

    if (_y > targetScrollYPos) {
      addClass('rp-bg-fixed', _document.getElementById(containerID));
      removeClass('rp-bg-scroll', _document.getElementById(containerID));
    } else {
      addClass('rp-bg-scroll', _document.getElementById(containerID));
      removeClass('rp-bg-fixed', _document.getElementById(containerID));
    }

  }

    const appendStyleSheet = (custom_style_page) => {

        const customStyleSheet = _document.createElement('style');
        customStyleSheet.id = 'rp-skin-styles';
        //const [x,y] = adDimensions.split('x');

        

            customStyleSheet.innerHTML = custom_style_page;
        
        
        _document.querySelector('body').appendChild(customStyleSheet);
    };

    /**
     * @function getContainerIframe
     * @param {string} adDimensions ad dimensions in WxH format
     * @param {string} containerElement the container div to 
     * hook the interscroller ad onto. By default, 
     * the div should be <div id='parallax'></div>
     * @summary creates a div to inject the interscroller 
     * ad into and adds a friendly iframe to this div
     * @returns {object} a friendly iframe 
     */

    const getContainerIframe = (adDimensions, containerElement, elementMarker, bgColor, custom_style_iframe, iframe_url, contentWidth) => {
              console.log("test");
        const skinContainer = _document.createElement('div');
        skinContainer.id = containerID;
        const elem = _document.querySelector(containerElement) || 
                     parent.document.querySelector(containerElement);
                     const elem2 = _document.getElementById('rubiconExpander')
        elem.insertBefore(skinContainer, elem2.nextSibling);

        
        const styles2 = [
            'z-index: 1000;',
            'top: 0;',
            'margin: 0;',
            custom_style_iframe
        ].join('');
        skinContainer.setAttribute("style", styles2);


        const creativeFrame = _document.createElement('iframe');

        //const [x,y] = adDimensions.split('x');
        var elementMarkerT = _document.querySelector(elementMarker);
        console.log(containerElement);
        console.log("test2");

  const getScaleRatio = (el) => {
    console.log(contentWidth);
    return (el.clientWidth) / parseInt(contentWidth);
    // 1000 is the standard content width
  }

  const calculateBackgroundSize = function (e) {
    var ratio = getScaleRatio(e);
    //console.log(ratio);

    rubiconExpander.style.height = (parseInt(rubiconExpander.style.height) * ratio) + 'px';
    return ratio;
}
  var ratio = calculateBackgroundSize(elementMarkerT);
  console.log(ratio);
        const styles = [
            'width: 1800px !important;',
            'height: 1000px !important;',
            'z-index: 1;',
            'margin: auto;',
            'position: absolute;',
            'transform: scale('+ratio+');',
            'transform-origin: 0 0;',
            custom_style_iframe
        ].join('');

        //creativeFrame.style.cssText = styles;
       // (creativeFrame.frameElement || creativeFrame).style.cssText = custom_style;
        creativeFrame.setAttribute('scrolling', 'no');
        creativeFrame.setAttribute('frameborder', 0);
        creativeFrame.setAttribute("style", styles);
        creativeFrame.src = iframe_url;
        creativeFrame.id = creativeID;
        _document
            .getElementById(containerID)
            .appendChild(creativeFrame);
        
        const contentDocument = (creativeFrame.contentWindow) ? 
            creativeFrame.contentWindow.document : 
            creativeFrame.contentDocument.document;

        return creativeFrame;
    };

    /**
     * @function getCorrectDocument
     * @param {string} the div containing the iframe
     * @summary return the current document
     * @returns {object} document
     */
    const getCorrectDocument = () => {
        if (typeof rp_elementMarkerT !== 'undefined') {
            if (document.querySelector(rp_elementMarkerT)) {
                return window.document;
            } else if (parent.window.document.querySelector(rp_elementMarkerT)) {
                return parent.window.document;
            } else {
                console.error(`RP:Could not access the parent window.
                    Possibly due to cross domain iframe`);
            }  
        } else {
            console.error('RP: No element marker defined');
        }      
    };

    /**
     * @function inIframe
     * @summary test to see if the script is loaded inside an iframe
     * @returns {boolean}
     */

    const inIframe = () => {
        return (window.top !== window.self);
    };
};

// module.exports = new rubiskin();

window.skinOverlay = new rubiskin();


