/* 
test global

rp_adband
rp_elementMarker
*/

//const renderAd = require('../../modules/RenderAd');

/**
 * @constructor
 */
const interScroller = function () {
    const self = this;
    let _document;
    let parentWindow;
    let rp_adband;
    const containerID = 'rp-interscroller-container';
    const creativeID = 'rp-interscroller-creative';
    

    /**
     * @function interscroller#render
     * @param {object} ad response
     * @summary processes the ad response and calls interscroller functions
     */
    self.renderAd = (data) => {
        rp_elementMarker = data.elementMarker;
        // Assign the correct document context
        _document = getCorrectDocument();

        init(data.fullBids, data.elementMarker, data.pVisibility, data.iniTranslate);
    };

    /**
     * @function init
     * @param {object} adResponse to add the ad response 
     * creative to a generated friendly iframe
     * @param {string} adDimensions ad dimensions in WxH format
     * @summary adds the interscroller stylesheet, 
     * creates an iframe and adds the interscoller animation
     */
    const init = (fullBids, rp_elementMarker, pVisibility, iniTranslate) => {
    adDimensions = fullBids.size;

        document.querySelector('iframe[name^=google_ads_iframe]').style.display = "none";

        if (typeof iniTranslate == 'undefined') {
            iniTranslate = -35;
        }

        if (typeof rp_elementMarker != 'undefined') {
            appendStyleSheet(adDimensions, pVisibility);
            
            const containerIframe = getContainerIframe(
                adDimensions, rp_elementMarker
            );
            
            addCreative(containerIframe, fullBids.ad);
            parallax(iniTranslate);

        } else {
            console.error('RP: No element marker defined');
        }
    };

    /**
     * @function appendStyleSheet
     * @param {string} adDimensions ad dimensions in WxH format
     * @summary adds a custom stylesheet to the dom. 
     * If rp_adband variable is present in the smart tag, 
     * additional ad band styles are added
     */
    const appendStyleSheet = (adDimensions, pVisibility) => {

        const customStyleSheet = _document.createElement('style');
        customStyleSheet.id = 'rp-interscroller-styles';
        const [x,y] = adDimensions.split('x');

        const adBandStyles = `#${containerID}:before{
            position:absolute;
            content:"${rp_adband}";
            top:0px;
            height:20px;
            text-align:center;
            background-color:#000;
            color:#fff;
            width:${x}px;
            z-index:3000;
        }`;

        /* eslint-disable no-magic-numbers */
        const interScrollerStyles = `#${containerID}{
            position:relative;
            width:${x}px;
            height:${parseInt(y) / (100 / pVisibility) }px;
            margin:0px;
            overflow:hidden;
            padding-top:20px;
        }
        #${creativeID}{
            height:600px;
            width:300px;
            position:absolute;
        }`;
        /* eslint-enable no-magic-numbers */

        if (rp_adband !== '') {
            customStyleSheet.innerHTML = interScrollerStyles + adBandStyles;
        } else {
            customStyleSheet.innerHTML = interScrollerStyles;
        }
        
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
    const getContainerIframe = (adDimensions, containerElement) => {
        const interScrollerContainer = _document.createElement('div');
        interScrollerContainer.id = containerID;
        const elem = _document.querySelector(containerElement) || 
                     parent.document.querySelector(containerElement);
        elem.insertBefore(interScrollerContainer, null);

        const creativeFrame = _document.createElement('iframe');

        const [x,y] = adDimensions.split('x');

        const styles = [
            `width: ${x}px;`, 
            `height: ${y}px;`, 
            'border: 0;', 
            'margin: 0;', 
            'padding: 0;', 
            'overflow: hidden;',
        ].join('');

        (creativeFrame.frameElement || creativeFrame).style.cssText = styles;
        creativeFrame.setAttribute('scrolling', 'no');
        creativeFrame.src = 'about:blank';
        creativeFrame.id = creativeID;
        _document
            .getElementById(containerID)
            .appendChild(creativeFrame);
        
        const contentDocument = (creativeFrame.contentWindow) ? 
            creativeFrame.contentWindow.document : 
            creativeFrame.contentDocument.document;
        return contentDocument;
    };

    /**
     * @function addCreative
     * @param {object} containerFrame a friendly iframe to add the creative into
     * @param {object} adResponse the ad response containing 
     * the creative to add into the iframe
     * @summary adds the ad response creative to the iframe
     */
    const addCreative = (containerFrame, adResponse) => {
        containerFrame.open().write(
            `<html>
            <head>
            <script type='text/javascript'>
            var inDapIF = true;
            </script>
            <body style='margin : 0; padding: 0;'>
            <script type='text/javascript'>${adResponse}</script>
            </body>
            </html>`
        );
        containerFrame.close();
    };

    /**
     * @function parallax
     * @summary adds the parallax animation to move the ad up 
     * or down as the user scrolls the page
     */
    const parallax = (iniTranslate) => {
        let adUnitIsCompletelyVisible; 
        let maxSpaceLeft;
        const useTransform = true;

        const adUnit = inIframe() ? 
            window.frameElement : 
            document.querySelector(`#${containerID}`);

        const adUnitImage = document.querySelector(`#${creativeID}`);
        if (useTransform) {
            adUnitImage.style.transform = 'translateY('+iniTranslate+'%)';
        }

        try {
            parentWindow = parent.window;

        } catch (e) {
            console.error(`RP:Could not access the parent window. 
                Possibly due to cross domain iframe`);
            parentWindow = window;
        }
        
        // As the user scrolls, a check is performed to see if the ad 
        // is partially or fully visible
        parentWindow.addEventListener('scroll', () => {
            
            const elemBounds = adUnit.getBoundingClientRect();
            const elemImgBounds = adUnitImage.getBoundingClientRect();

            if (isElementFullyVisible(adUnit)) {
                adUnitIsCompletelyVisible = true;
                if (!maxSpaceLeft) {
                    maxSpaceLeft = parentWindow.innerHeight - elemBounds.height;
                }
            } else {
                adUnitIsCompletelyVisible = false;
            }

            if (adUnitIsCompletelyVisible) {
                const spaceLeft = elemBounds.top;
                /* eslint-disable no-magic-numbers */
                if (useTransform) {
                    let tformAmount = (spaceLeft / maxSpaceLeft * 100) / 2;
                    tformAmount = tformAmount > 50 ? 50 : tformAmount;
                    adUnitImage
                        .style
                        .transform = `translateY(-${tformAmount}%)`;
                }

                if (!useTransform) {
                    // eslint-disable-next-line max-len
                    let topAmount = -((elemImgBounds.height / 2) + spaceLeft);
                    topAmount = topAmount < -(elemImgBounds.height / 2) ? 
                                topAmount - (-(elemImgBounds.height / 2)) :
                                -(elemImgBounds.height / 2);

                    adUnitImage.style.top = topAmount +'px';
                }
                /* eslint-enable no-magic-numbers */
            }
        });
    };

    /**
     * @function isElementFullyVisible
     * @summary check to see if ad is completely in view
     * @returns {boolean} true if ad is completely visible, fasle otherwise
     */
    const isElementFullyVisible = (elem) => {
        const elBounds = elem.getBoundingClientRect();

        return elBounds.bottom < parentWindow.innerHeight && 
            elBounds.top > 0;
    };

    /**
     * @function getCorrectDocument
     * @param {string} the div containing the iframe
     * @summary return the current document
     * @returns {object} document
     */
    const getCorrectDocument = () => {
        if (typeof rp_elementMarker !== 'undefined') {
            if (document.querySelector(rp_elementMarker)) {
                return window.document;
            } else if (parent.window.document.querySelector(rp_elementMarker)) {
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

window.interscroller = new interScroller();
