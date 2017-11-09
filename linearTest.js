/**
 * @fileoverview A VPAID ad useful for testing functionality of the sdk.
 * This particular ad will just play a video.
 *
 * @author ryanthompson@google.com (Ryan Thompson)
 */



/**
 * @constructor
 */
var VpaidVideoPlayer = function() {
  /**
   * The slot is the div element on the main page that the ad is supposed to
   * occupy.
   * @type {Object}
   * @private
   */
  this.slot_ = null;

  /**
   * The video slot is the video element used by the ad to render video content.
   * @type {Object}
   * @private
   */
  this.videoSlot_ = null;

  /**
   * An object containing all registered events.  These events are all
   * callbacks for use by the VPAID ad.
   * @type {Object}
   * @private
   */
  this.eventsCallbacks_ = {};

  /**
   * A list of getable and setable attributes.
   * @type {Object}
   * @private
   */
  this.attributes_ = {
    'companions' : '',
    'desiredBitrate' : 256,
    'duration': 30,
    'expanded' : false,
    'height' : 0,
    'icons' : false,
    'linear' : true,
    'remainingTime' : 13,
    'skippableState' : false,
    'viewMode' : 'normal',
    'width' : 0,
    'volume' : 1.0
  };

  /**
   * @type {?number} id of the interval used to synch remaining time
   * @private
   */
  this.intervalId_ = null;

  /**
   * A set of events to be reported.
   * @type {Object}
   * @private
   */
  this.quartileEvents_ = [
    {event: 'AdImpression', value: 0},
    {event: 'AdVideoStart', value: 0},
    {event: 'AdVideoFirstQuartile', value: 25},
    {event: 'AdVideoMidpoint', value: 50},
    {event: 'AdVideoThirdQuartile', value: 75},
    {event: 'AdVideoComplete', value: 100}
  ];

  /**
   * @type {number} An index into what quartile was last reported.
   * @private
   */
  this.lastQuartileIndex_ = 0;

  /**
   * An array of urls and mimetype pairs.
   *
   * @type {!object}
   * @private
   */
  this.parameters_ = {};
};


/**
 * VPAID defined init ad, initializes all attributes in the ad.  The ad will
 * not start until startAd is called.
 *
 * @param {number} width The ad width.
 * @param {number} height The ad heigth.
 * @param {string} viewMode The ad view mode.
 * @param {number} desiredBitrate The desired bitrate.
 * @param {Object} creativeData Data associated with the creative.
 * @param {Object} environmentVars Variables associated with the creative like
 *     the slot and video slot.
 */
VpaidVideoPlayer.prototype.initAd = function(
    width,
    height,
    viewMode,
    desiredBitrate,
    creativeData,
    environmentVars) {
  // slot and videoSlot are passed as part of the environmentVars
  this.attributes_['width'] = width;
  this.attributes_['height'] = height;
  this.attributes_['viewMode'] = viewMode;
  this.attributes_['desiredBitrate'] = desiredBitrate;
  this.slot_ = environmentVars.slot;
  this.videoSlot_ = environmentVars.videoSlot;

  // Parse the incoming parameters.
  data = JSON.parse(creativeData['AdParameters']);

  this.imageUrls_ = data.overlays || [];
  this.videos_ = data.videos || [];
  this.accountId = data.accountId;
  this.siteId = data.siteId;
  this.zoneId = data.zoneId;
  this.sizeId = data.sizeId;

  zoneIdF = [this.zoneId, this.sizeId].join('-');
  //this.sizeDimensionW = data.sizeDimension.split('x')[0];
  //this.sizeDimensionH = data.sizeDimension.split('x')[1];
  this.skippable = data.skippable;
  this.skippableTime = data.skippableTime || 5;
  this.timeoutRubicon = data.timeoutRubicon || 3;
  this.timeoutDisplay = data.timeoutDisplay || 15;

  this.attributes_['skippableState'] = this.skippable;

  this.log('initAd ' + width + 'x' + height +
      ' ' + viewMode + ' ' + desiredBitrate);
 

  this.callEvent_('AdLoaded');
};




/**
 * Helper function to update the size of the video player.
 * @private
 */
VpaidVideoPlayer.prototype.updateVideoPlayerSize_ = function() {
  try {
    this.videoSlot_.setAttribute('width', this.attributes_['width']);
    this.videoSlot_.setAttribute('height', this.attributes_['height']);
    this.videoSlot_.style.width = this.attributes_['width'] + 'px';
    this.videoSlot_.style.height = this.attributes_['height'] + 'px';
  } catch (e) { /* no op*/}
};


/**
 * Returns the versions of VPAID ad supported.
 * @param {string} version
 * @return {string}
 */
VpaidVideoPlayer.prototype.handshakeVersion = function(version) {
  return ('2.0');
};






/**
 * Called by the wrapper to start the ad.
 */
VpaidVideoPlayer.prototype.startAd = function() {
  this.log('Starting ad');

var closeButton = document.createElement("div");
closeButton.id = "demo";
closeButton.style.width="120px"
closeButton.style.height="16px"
closeButton.style.bottom="10px"
closeButton.style.right="10px"
closeButton.style.position="absolute"
closeButton.style.display="inline-block"
closeButton.style.background="white"
window.document.body.insertAdjacentElement('afterbegin', closeButton);


function onAdsLoaded(response) {
   if (response.status == "ok") {
       var ad;
       var html;
       for (var i = 0; i < response.ads.length; i++) {
           ad = response.ads[i];
           if (ad.status == "ok") {
               if (ad.type == "script") {
                   document.write("<div id = 'test' style = 'width: 300px; height: 250px; top: 10%; margin: 0 auto; position: relative;'><script type='text/javascript'>"+ad.script+"</scr"+"ipt></div>"); 
                   createCloseButton();
               }
               if (ad.type == "html") {
                   document.write(ad.html);
               }
           } else {
                document.write("<div>status="+ad.status+"</div>");
           }
       }
   }
}

window.stopAd = this.stopAd.bind(this);
window.adError = this.adError.bind(this);


  //add a test mute button
var val1 = '<scr' + 'ipt type="text/javascript"> rp_account  = "8263"; rp_site      = "148426"; rp_zonesize  = "703002-15"; rp_adtype    = "jsonp"; rp_callback = '+onAdsLoaded+';rp_smartfile = "[SMART FILE URL]";</scr' + 'ipt>';
document.write(val1);

var val2 = '<scr' + 'ipt type="text/javascript" src="https://ads.rubiconproject.com/ad/8263.js"></scr' + 'ipt>';
document.write(val2);    

  //add a test mute button
  var muteButton = document.createElement('input');
  muteButton.setAttribute('type', 'button');
  muteButton.setAttribute('value', 'mute/unMute');

  muteButton.addEventListener('click',
      this.muteButtonOnClick_.bind(this),
      false);
  this.slot_.appendChild(muteButton);

  this.callEvent_('AdStarted');
};


VpaidVideoPlayer.prototype.adError = function() {
  this.log('adError');
  this.callEvent_('AdError');
};

/**
 * Called by the wrapper to stop the ad.
 */
VpaidVideoPlayer.prototype.stopAd = function() {
  this.log('Stopping ad');
  if (this.intervalId_){
    clearInterval(this.intervalId_)
  }
  // Calling AdStopped immediately terminates the ad. Setting a timeout allows
  // events to go through.
  var callback = this.callEvent_.bind(this);
  setTimeout(callback, 75, ['AdStopped']);
};


/**
 * @param {number} value The volume in percentage.
 */
VpaidVideoPlayer.prototype.setAdVolume = function(value) {
  this.attributes_['volume'] = value;
  this.log('setAdVolume ' + value);
  this.videoSlot_.volume = value / 100.0;
  this.callEvent_('AdVolumeChange');
};


/**
 * @return {number} The volume of the ad.
 */
VpaidVideoPlayer.prototype.getAdVolume = function() {
  this.log('getAdVolume');
  return this.attributes_['volume'];
};


/**
 * @param {number} width The new width.
 * @param {number} height A new height.
 * @param {string} viewMode A new view mode.
 */
VpaidVideoPlayer.prototype.resizeAd = function(width, height, viewMode) {
  this.log('resizeAd ' + width + 'x' + height + ' ' + viewMode);
  this.attributes_['width'] = width;
  this.attributes_['height'] = height;
  this.attributes_['viewMode'] = viewMode;
  this.updateVideoPlayerSize_();
  this.callEvent_('AdSizeChange');
};


/**
 * Pauses the ad.
 */
VpaidVideoPlayer.prototype.pauseAd = function() {
  this.log('pauseAd');
  this.videoSlot_.pause();
  this.callEvent_('AdPaused');
  if (this.intervalId_){
    clearInterval(this.intervalId_)
  }
};


/**
 * Resumes the ad.
 */
VpaidVideoPlayer.prototype.resumeAd = function() {
  this.log('resumeAd');
  this.videoSlot_.play();
  this.callEvent_('AdPlaying');
  var callback = (function(){
    this.attributes_['remainingTime'] -= 0.25;
    this.callEvent_('AdRemainingTimeChange');
  }).bind(this);
  this.intervalId_ = setInterval(callback, 250);
};


/**
 * Expands the ad.
 */
VpaidVideoPlayer.prototype.expandAd = function() {
  this.log('expandAd');
  this.attributes_['expanded'] = true;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
  this.callEvent_('AdExpanded');
};


/**
 * Returns true if the ad is expanded.
 * @return {boolean}
 */
VpaidVideoPlayer.prototype.getAdExpanded = function() {
  this.log('getAdExpanded');
  return this.attributes_['expanded'];
};


/**
 * Returns the skippable state of the ad.
 * @return {boolean}
 */
VpaidVideoPlayer.prototype.getAdSkippableState = function() {
  this.log('getAdSkippableState');
  return this.attributes_['skippableState'];
};


/**
 * Collapses the ad.
 */
VpaidVideoPlayer.prototype.collapseAd = function() {
  this.log('collapseAd');
  this.attributes_['expanded'] = false;
};


/**
 * Skips the ad.
 */
VpaidVideoPlayer.prototype.skipAd = function() {
  this.log('skipAd');
  var skippableState = this.attributes_['skippableState'];
  if (skippableState) {
    this.callEvent_('AdSkipped');
  }
};


/**
 * Registers a callback for an event.
 * @param {Function} aCallback The callback function.
 * @param {string} eventName The callback type.
 * @param {Object} aContext The context for the callback.
 */
VpaidVideoPlayer.prototype.subscribe = function(
    aCallback,
    eventName,
    aContext) {
  this.log('Subscribe ' + aCallback);
  var callBack = aCallback.bind(aContext);
  this.eventsCallbacks_[eventName] = callBack;
};


/**
 * Removes a callback based on the eventName.
 *
 * @param {string} eventName The callback type.
 */
VpaidVideoPlayer.prototype.unsubscribe = function(eventName) {
  this.log('unsubscribe ' + eventName);
  this.eventsCallbacks_[eventName] = null;
};


/**
 * @return {number} The ad width.
 */
VpaidVideoPlayer.prototype.getAdWidth = function() {
  return this.attributes_['width'];
};


/**
 * @return {number} The ad height.
 */
VpaidVideoPlayer.prototype.getAdHeight = function() {
  return this.attributes_['height'];
};


/**
 * @return {number} The time remaining in the ad.
 */
VpaidVideoPlayer.prototype.getAdRemainingTime = function() {
  return this.attributes_['remainingTime'];
};


/**
 * @return {number} The duration of the ad.
 */
VpaidVideoPlayer.prototype.getAdDuration = function() {
  return this.attributes_['duration'];
};


/**
 * @return {string} List of companions in vast xml.
 */
VpaidVideoPlayer.prototype.getAdCompanions = function() {
  return this.attributes_['companions'];
};


/**
 * @return {boolean} A list of icons.
 */
VpaidVideoPlayer.prototype.getAdIcons = function() {
  return this.attributes_['icons'];
};


/**
 * @return {boolean} True if the ad is a linear, false for non linear.
 */
VpaidVideoPlayer.prototype.getAdLinear = function() {
  return this.attributes_['linear'];
};


/**
 * Logs events and messages.
 *
 * @param {string} message
 */
VpaidVideoPlayer.prototype.log = function(message) {
  console.log(message);
};


/**
 * Calls an event if there is a callback.
 * @param {string} eventType
 * @private
 */
VpaidVideoPlayer.prototype.callEvent_ = function(eventType) {
  if (eventType in this.eventsCallbacks_) {
    this.eventsCallbacks_[eventType]();
  }
};


/**
 * Callback for when the mute button is clicked.
 * @private
 */
VpaidVideoPlayer.prototype.muteButtonOnClick_ = function() {
  if (this.attributes_['volume'] == 0) {
    this.attributes_['volume'] = 1.0;
    this.videoSlot_.volume = 1.0;
  } else {
    this.attributes_['volume'] = 0.0;
    this.videoSlot_.volume = 0.0;
  }
  this.callEvent_('AdVolumeChange');
};


/**
 * Callback when the video element calls start.
 * @private
 */
VpaidVideoPlayer.prototype.videoResume_ = function() {
  this.log("video element resumed.");
};


/**
 * Main function called by wrapper to get the VPAID ad.
 * @return {Object} The VPAID compliant ad.
 */
var getVPAIDAd = function() {
  return new VpaidVideoPlayer();
};
