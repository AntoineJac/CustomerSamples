var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("services/ConfigService", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ConfigService, configService;
    return {
        setters:[],
        execute: function() {
            ConfigService = (function () {
                function ConfigService() {
                    this.configMap = {};
                }
                ConfigService.prototype.setConfig = function (key, config) {
                    this.configMap[key] = config;
                };
                ConfigService.prototype.getConfig = function (key) {
                    return this.configMap[key];
                };
                return ConfigService;
            }());
            configService = new ConfigService();
            exports_1("configService", configService);
        }
    }
});
System.register("models/StationComponent", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var StationComponent;
    return {
        setters:[],
        execute: function() {
            StationComponent = (function () {
                function StationComponent(selector, component) {
                    this.selector = selector;
                    this.component = component;
                }
                StationComponent.prototype.initialise = function () {
                    if (!this.exists()) {
                        return;
                    }
                    var component = this.component;
                    if (typeof this.component === 'function') {
                        component = new this.component(this.selector);
                    }
                    component.initialise();
                };
                StationComponent.prototype.exists = function () {
                    return $(this.selector).length > 0;
                };
                return StationComponent;
            }());
            exports_2("StationComponent", StationComponent);
        }
    }
});
System.register("services/LoggingService", ["services/ConfigService"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var ConfigService_1;
    var LoggingService;
    return {
        setters:[
            function (ConfigService_1_1) {
                ConfigService_1 = ConfigService_1_1;
            }],
        execute: function() {
            LoggingService = (function () {
                function LoggingService() {
                    this.options = ConfigService_1.configService.getConfig('LoggingService');
                }
                LoggingService.prototype.log = function (message) {
                    this.options.debug && console && console.log(message);
                };
                LoggingService.prototype.error = function (message) {
                    this.options.debug && console && console.error(message);
                };
                LoggingService.prototype.warn = function (message) {
                    this.options.debug && console && console.warn(message);
                };
                LoggingService.prototype.table = function (object) {
                    this.options.debug && console && console.table && console.table(object);
                };
                return LoggingService;
            }());
            exports_3("LoggingService", LoggingService);
        }
    }
});
System.register("components/BaseComponent", ["services/LoggingService"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var LoggingService_1;
    var BaseComponent;
    return {
        setters:[
            function (LoggingService_1_1) {
                LoggingService_1 = LoggingService_1_1;
            }],
        execute: function() {
            BaseComponent = (function () {
                function BaseComponent(selector) {
                    this.selector = selector;
                    this.init();
                    this.initialiseLogging();
                }
                BaseComponent.prototype.initialiseLogging = function () {
                    this.loggingService = new LoggingService_1.LoggingService();
                };
                BaseComponent.prototype.init = function () {
                    if (this.selector != null) {
                        this.$el = $(this.selector);
                    }
                };
                return BaseComponent;
            }());
            exports_4("BaseComponent", BaseComponent);
        }
    }
});
System.register("services/Environment", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Environment, environment;
    return {
        setters:[],
        execute: function() {
            Environment = (function () {
                function Environment() {
                    this.screenXs = 768;
                    this.screenMd = 1100;
                    this.init();
                }
                Environment.prototype.init = function () {
                    this.isIos() && this.detectIosBottomBar();
                    this.detectBrower();
                };
                Environment.prototype.detectBrower = function () {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.indexOf('firefox') > -1)
                        $('html').addClass('firefox');
                    if (ua.indexOf("msie ") > -1 || ua.indexOf("trident/") > -1 || ua.indexOf("edge/") > -1)
                        $('html').addClass('ie');
                };
                Environment.prototype.clientWidth = function (includeScrollbar) {
                    if (includeScrollbar === void 0) { includeScrollbar = true; }
                    if (includeScrollbar) {
                        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    }
                    else {
                        return document.documentElement.clientWidth;
                    }
                };
                Environment.prototype.screenWidth = function () {
                    return window.screen.width;
                };
                Environment.prototype.isDesktop = function () {
                    return this.clientWidth() > 768;
                };
                Environment.prototype.isWideDesktop = function () {
                    return this.clientWidth() >= this.screenMd;
                };
                Environment.prototype.isAndroid = function () {
                    return /android/i.test(navigator.userAgent);
                };
                Environment.prototype.isFirefox = function () {
                    return typeof (InstallTrigger) !== 'undefined';
                };
                Environment.prototype.isChrome = function () {
                    return !!window.chrome && !!window.chrome.webstore;
                };
                Environment.prototype.isIos = function () {
                    return /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !window.MSStream;
                };
                Environment.prototype.isMobile = function () {
                    return this.isAndroid() || this.isIos();
                };
                Environment.prototype.isSafari = function () {
                    return /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]'; })(!window['safari'] || window.safari.pushNotification);
                };
                Environment.prototype.cookiesEnabled = function () {
                    try {
                        document.cookie = 'cookietest=1';
                        var ret = document.cookie.indexOf('cookietest=') !== -1;
                        document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
                        return ret;
                    }
                    catch (e) {
                        return false;
                    }
                };
                Environment.prototype.isIe = function () {
                    return window.document.documentMode != null;
                };
                Environment.prototype.detectIosBottomBar = function () {
                    $(window).on('resize', function () {
                        var cssClass = 'iosWithBottomBar', $html = $('html');
                        $html.removeClass(cssClass);
                        var screenHeight = window.screen.height;
                        var canvasHeight = $(document).height();
                        var screenDifference = screenHeight - canvasHeight;
                        var assumeBottomBar = screenDifference > 35 && screenDifference <= 40;
                        if (assumeBottomBar) {
                            $html.addClass(cssClass);
                        }
                    });
                    $(window).resize();
                };
                Environment.prototype.handleIosScrolling = function (e) {
                    var $el = $(e.currentTarget), top = $el.scrollTop(), totalScroll = $el[0].scrollHeight, currentScroll = top + $el[0].offsetHeight;
                    if (totalScroll <= $el[0].offsetHeight) {
                        e.preventDefault();
                        return;
                    }
                    if (top === 0) {
                        $el.scrollTop(1);
                    }
                    else if (currentScroll === totalScroll) {
                        $el.scrollTop(top - 1);
                    }
                };
                return Environment;
            }());
            environment = new Environment();
            exports_5("environment", environment);
        }
    }
});
System.register("components/Header", ["components/BaseComponent", "services/Environment"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var BaseComponent_1, Environment_1;
    var Header;
    return {
        setters:[
            function (BaseComponent_1_1) {
                BaseComponent_1 = BaseComponent_1_1;
            },
            function (Environment_1_1) {
                Environment_1 = Environment_1_1;
            }],
        execute: function() {
            Header = (function (_super) {
                __extends(Header, _super);
                function Header() {
                    _super.apply(this, arguments);
                    this.scrollFlag = false;
                }
                Header.prototype.initialise = function () {
                    var _this = this;
                    $('.header__menu', this.$el).on('click', function (e) {
                        _this.toggleMenu(e);
                    });
                    $('.header__nav-lvl2-arrow', this.$el).on('click', function (e) {
                        e.preventDefault();
                        _this.toggleSecondLevelMenu(e);
                    });
                    var headerTop = this.$el.position().top;
                    $(window).on('scroll', function () {
                        if (headerTop === 0)
                            headerTop = _this.$el.position().top;
                        _this.shrinkHeader($(window).scrollTop() > headerTop);
                    }).trigger('init');
                    $(window).on('resize initSubNav', function () {
                        _this.setSubNavigationWidth();
                    }).trigger('initSubNav');
                    if (Environment_1.environment.isIos()) {
                        $('.header__nav').on('touchmove', function (e) { Environment_1.environment.handleIosScrolling(e); });
                    }
                    if (!$('.article').length) {
                        return;
                    }
                    $(window).on('scroll init', function () {
                        _this.toggleSocial();
                    }).trigger('init');
                };
                Header.prototype.scrollTop = function () {
                    var _this = this;
                    var offSet = $('.sca-ad__container').height();
                    var scrollPos = $(window).scrollTop();
                    if (!$('html, body').hasClass('nav-active')
                        && scrollPos < offSet) {
                        $('html, body').animate({
                            scrollTop: Math.abs(offSet + 1) + "px"
                        }, 300, function () {
                            $('html, body').addClass('nav-active');
                            $('.header__nav', _this.$el).addClass('header__nav--is-active');
                            $('.header__menu').addClass('header__menu--is-active');
                            _this.scrollFlag = false;
                        });
                    }
                    else {
                        $('.header__nav', this.$el).addClass('header__nav--is-active');
                        $('.header__menu').addClass('header__menu--is-active');
                        $('html, body').addClass('nav-active');
                    }
                };
                Header.prototype.setSubNavigationWidth = function () {
                    if (Environment_1.environment.isWideDesktop()) {
                        $('.header__nav-lvl2-outer').width(Environment_1.environment.clientWidth(false));
                        $('.header__nav-lvl2-outer').css('left', (Environment_1.environment.clientWidth(false) - $('header .l-container:eq(0)').width()) / 2 * -1);
                    }
                };
                Header.prototype.toggleMenu = function (e) {
                    if ($('html, body').hasClass('nav-active')) {
                        $('.header__nav', this.$el).removeClass('header__nav--is-active');
                        $('.header__menu').removeClass('header__menu--is-active');
                        $('html, body').removeClass('nav-active');
                    }
                    else {
                        this.scrollTop();
                    }
                };
                Header.prototype.toggleSecondLevelMenu = function (e) {
                    var $navItem = $(e.currentTarget).parent('.header__nav-item');
                    $navItem.toggleClass('header__nav-item--show-lvl2');
                    if ($navItem.hasClass('header__nav-item--show-lvl2')) {
                        $navItem.find('.header__nav-lvl2-outer').slideDown();
                    }
                    else {
                        $navItem.find('.header__nav-lvl2-outer').slideUp();
                    }
                };
                Header.prototype.toggleSocial = function () {
                    var _this = this;
                    if ($('.header__add-this table').length === 0) {
                        setTimeout(function () {
                            _this.toggleSocial();
                        }, 300);
                        return;
                    }
                    var scrollDistance = $('.article__content').offset().top - this.$el.height();
                    if ($(window).scrollTop() >= scrollDistance) {
                        this.$el.addClass('header--show-social');
                    }
                    else {
                        this.$el.removeClass('header--show-social');
                    }
                };
                Header.prototype.shrinkHeader = function (shrink) {
                    if (shrink) {
                        this.$el.addClass('header--is-shrunk');
                    }
                    else {
                        this.$el.removeClass('header--is-shrunk');
                    }
                };
                return Header;
            }(BaseComponent_1.BaseComponent));
            exports_6("Header", Header);
        }
    }
});
System.register("components/SmartDate", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var SmartDate;
    return {
        setters:[],
        execute: function() {
            SmartDate = (function () {
                function SmartDate() {
                    this.defaultSmartDateFieldSelector = '.smart-date';
                    this.defaultSmartDateFieldContainerSelector = '.smart-date-container';
                }
                SmartDate.prototype.initialise = function () {
                    this.initialiseSmartDateField();
                };
                SmartDate.prototype.initialiseSmartDateField = function (selector) {
                    selector = selector || this.defaultSmartDateFieldSelector;
                    var intervalSeconds = 1;
                    var self = this;
                    var smartDateElements = $(selector);
                    if (smartDateElements.length === 0) {
                        throw new Error("Unable to initialise smart date field. Element with selector '" + selector + "' could not be found.");
                    }
                    $.each(smartDateElements, function () {
                        var $el = $(this);
                        var utcInputDate = $el.html().trim();
                        var dateValid = self.dateValid(utcInputDate);
                        if (!dateValid) {
                            self.showDateField.call(self, $el);
                            return true;
                        }
                        $el.attr('data-published', utcInputDate);
                        var updateField = function (show) {
                            $el.html(self.getSmartDate(utcInputDate));
                            if (show) {
                                self.showDateField.call(self, $el);
                            }
                        };
                        updateField(true);
                        var timer = function () {
                            window.setTimeout(function () {
                                updateField();
                                timer();
                            }, intervalSeconds * 1000);
                        };
                        timer();
                    });
                };
                SmartDate.prototype.showDateField = function (el) {
                    var parent = el.parent();
                    if (parent.hasClass(this.defaultSmartDateFieldContainerSelector.replace('.', '')) && parent.hasClass('hide')) {
                        parent.removeClass('hide');
                    }
                    else {
                        el.removeClass('hide');
                    }
                };
                SmartDate.prototype.dateValid = function (utcInput) {
                    var date = moment(utcInput, moment.ISO_8601, true);
                    return date.isValid();
                };
                SmartDate.prototype.getSmartDate = function (utcInput) {
                    var date = moment(utcInput, moment.ISO_8601, true);
                    var minutes = Number(moment().diff(date, 'minutes'));
                    if (minutes <= 0) {
                        return 'just now';
                    }
                    if (minutes < 60) {
                        return minutes + " min" + (minutes === 1 ? '' : 's') + " ago";
                    }
                    if (minutes < 60 * 24) {
                        var hours = Math.floor(minutes / 60);
                        return hours + " hr" + (hours === 1 ? '' : 's') + " ago";
                    }
                    if (minutes < 60 * 24 * 7) {
                        var days = Math.floor(minutes / 60 / 24);
                        return days + " day" + (days === 1 ? '' : 's') + " ago";
                    }
                    return date.format('DD/MM/YYYY');
                };
                return SmartDate;
            }());
            exports_7("SmartDate", SmartDate);
        }
    }
});
System.register("services/Generator", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Generator, generator;
    return {
        setters:[],
        execute: function() {
            Generator = (function () {
                function Generator() {
                }
                Generator.prototype.generateUniqueId = function (classPrefix) {
                    classPrefix = classPrefix || '';
                    var id;
                    do {
                        id = "" + classPrefix + Math.ceil(Math.random() * 10000);
                    } while (id == null || $("#" + id).length);
                    return id;
                };
                Generator.prototype.sha256 = function (content) {
                    return window.sha256(content);
                };
                return Generator;
            }());
            generator = new Generator();
            exports_8("generator", generator);
        }
    }
});
System.register("components/ConfigurableComponent", ["services/ConfigService", "components/BaseComponent"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var ConfigService_2, BaseComponent_2;
    var ConfigurableComponent;
    return {
        setters:[
            function (ConfigService_2_1) {
                ConfigService_2 = ConfigService_2_1;
            },
            function (BaseComponent_2_1) {
                BaseComponent_2 = BaseComponent_2_1;
            }],
        execute: function() {
            ConfigurableComponent = (function (_super) {
                __extends(ConfigurableComponent, _super);
                function ConfigurableComponent(selector, componentName) {
                    _super.call(this, selector);
                    this.componentName = componentName;
                    this.setConfig();
                }
                ConfigurableComponent.prototype.setConfig = function () {
                    if (this.componentName != null) {
                        this.options = ConfigService_2.configService.getConfig(this.componentName);
                    }
                };
                return ConfigurableComponent;
            }(BaseComponent_2.BaseComponent));
            exports_9("ConfigurableComponent", ConfigurableComponent);
        }
    }
});
System.register("components/BrightcoveVideo", ["components/ConfigurableComponent"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var ConfigurableComponent_1;
    var BrightcoveVideo;
    return {
        setters:[
            function (ConfigurableComponent_1_1) {
                ConfigurableComponent_1 = ConfigurableComponent_1_1;
            }],
        execute: function() {
            BrightcoveVideo = (function (_super) {
                __extends(BrightcoveVideo, _super);
                function BrightcoveVideo(selector) {
                    _super.call(this, selector, 'BrightcoveVideo');
                }
                BrightcoveVideo.prototype.initialise = function () {
                    this.adServerUrl = this.buildAdTagUrl();
                    var $mainVideo = $('#article__video-player video');
                    if ($mainVideo && $mainVideo.length > 0) {
                        if ($mainVideo.is('video') && $mainVideo.attr('data-sca-video-id')) {
                            this.configureMainVideoPlayer($mainVideo);
                        }
                        else {
                            this.loggingService.error('Unable to properly configure main Brightcove video player');
                        }
                    }
                    var $embededVideo = $('.article__embed--brightcove video');
                    if ($embededVideo && $embededVideo.length > 0) {
                        if ($embededVideo.is('video') && $embededVideo.attr('data-sca-video-id')) {
                            this.configureEmbededVideoPlayer($embededVideo);
                        }
                        else {
                            this.loggingService.error('Unable to properly configure embedded Brightcove video player');
                        }
                    }
                };
                BrightcoveVideo.prototype.configureMainVideoPlayer = function ($video) {
                    var playerId = $video.attr('id');
                    var $player = document.getElementById(playerId);
                    this.configureVideoPlayer($player, playerId, 'main');
                };
                BrightcoveVideo.prototype.configureEmbededVideoPlayer = function ($embededVideo) {
                    var _this = this;
                    $embededVideo.each(function (idx, el) {
                        var embeddedPlayerId = $(el).attr('id');
                        _this.configureVideoPlayer(el, embeddedPlayerId, 'embed');
                    });
                };
                BrightcoveVideo.prototype.configureVideoPlayer = function ($player, playerId, playerType) {
                    var _this = this;
                    var player = videojs($player);
                    bc($player);
                    player.ima3.settings.serverUrl = this.adServerUrl;
                    $player.parentElement.setAttribute('data-videojs', 'true');
                    var playerLoadedEvent;
                    if (typeof (Event) === 'function') {
                        playerLoadedEvent = new Event('player-loaded');
                    }
                    else {
                        playerLoadedEvent = document.createEvent('Event');
                        playerLoadedEvent.initEvent('player-loaded', true, true);
                    }
                    $player.parentElement.dispatchEvent(playerLoadedEvent);
                    player.on('bc-catalog-error', function () {
                        if (_this.invalidVideoId(player)) {
                            _this.hideVideoControls(playerId);
                            _this.loggingService.log("Video Not found [" + playerId + "]");
                        }
                        ;
                    });
                    player.on('loadedmetadata', function () {
                        var theInterval;
                        var target = document.getElementById('timeTarget-' + playerId);
                        player.on('ads-pod-started', function () {
                            player.removeClass('hide-overlay');
                            theInterval = setInterval(function () {
                                var timeObject = _this.secondsToTime(Math.floor(player.ima3.adPlayer.duration() - player.ima3.adPlayer.currentTime()));
                                target.innerHTML = "in " + timeObject.m + ":" + timeObject.s;
                            }, 1000);
                        });
                        player.on('ads-pod-ended', function () {
                            clearInterval(theInterval);
                            player.addClass('hide-overlay');
                            target.innerHTML = '';
                        });
                    });
                    player.on('ended', function () {
                        if (player.duration() !== Infinity) {
                            player.addClass('vjs-replay')
                                .getChild('controlBar')
                                .getChild('playToggle')
                                .controlText(player.localize('Replay'));
                        }
                    });
                    player.on(['play', 'seeking'], function () {
                        if (!player.hasClass('vjs-replay')) {
                            return;
                        }
                        var controlLabel = (player.paused() ? player.localize('Play') : player.localize('Pause'));
                        player.removeClass('vjs-replay')
                            .getChild('controlBar')
                            .getChild('playToggle')
                            .controlText(controlLabel);
                    });
                    player.ready(function () {
                        _this.loggingService.log("Initialised " + playerType + " video");
                        _this.hideVideoControls(playerId);
                        _this.initialiseOverlay(player, playerId);
                    });
                };
                BrightcoveVideo.prototype.invalidVideoId = function (player) {
                    return player.catalog.error !== undefined;
                };
                BrightcoveVideo.prototype.hideVideoControls = function (playerId) {
                    $("#" + playerId + " .vjs-big-play-button, #" + playerId + " .vjs-dock-shelf").addClass('vjs-hidden');
                    $("#" + playerId + " .vjs-dock-title").text('Error: Video Not Found');
                };
                BrightcoveVideo.prototype.buildAdTagUrl = function () {
                    var unitPath = this.options.dfpUnitPathVideo;
                    var tagUrl = '';
                    if (!unitPath) {
                        this.loggingService.error('Video ad unit path has not been provided.');
                    }
                    if (this.options.isPreRollAdsSwtichedOff) {
                        this.loggingService.log('INFO: Video Pre-roll ads are switched off');
                        return tagUrl;
                    }
                    else {
                        this.loggingService.log('INFO: Video Pre-roll ads are switched on');
                    }
                    tagUrl = location.protocol +
                        '//pubads.g.doubleclick.net/gampad/ads' +
                        "?sz=640x360" +
                        ("&iu=" + unitPath) +
                        '&ciu_szs=300x250,728x90' +
                        '&impl=s' +
                        '&gdfp_req=1' +
                        '&env=vp' +
                        '&output=xml_vast2' +
                        '&unviewed_position_start=1' +
                        '&url=[referrer_url]' +
                        '&correlator=[timestamp]' +
                        ("&cust_params=" + this.buildCustomParams());
                    this.loggingService.log("AdTagUrl: " + tagUrl);
                    return tagUrl;
                };
                BrightcoveVideo.prototype.buildCustomParams = function () {
                    var urlPathArray = document.location.pathname.split('/');
                    var addTagParams = '';
                    if (urlPathArray[0] === '') {
                        urlPathArray.splice(0, 1);
                    }
                    for (var i = 0; i < urlPathArray.length; i++) {
                        if (urlPathArray[i] === '') {
                            continue;
                        }
                        addTagParams += "cat" + (i === 0 ? '' : i) + "=" + urlPathArray[i] + "&";
                    }
                    return encodeURIComponent(addTagParams);
                };
                BrightcoveVideo.prototype.initialiseOverlay = function (player, playerId) {
                    player.overlay({
                        overlays: [
                            {
                                'content': '<span class="article__video-message">Your video will play shortly <span id="timeTarget-' + playerId + '" class="article__video-timer"></span></span>',
                                'align': 'top',
                                'start': 'loadedmetadata'
                            }
                        ]
                    });
                    player.addClass('hide-overlay');
                };
                BrightcoveVideo.prototype.secondsToTime = function (secs) {
                    var hours = Math.floor(secs / 3600);
                    var minutes = Math.floor((secs - (hours * 3600)) / 60);
                    var seconds = (secs - (hours * 3600) - (minutes * 60));
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }
                    return {
                        'm': minutes,
                        's': seconds
                    };
                };
                return BrightcoveVideo;
            }(ConfigurableComponent_1.ConfigurableComponent));
            exports_10("BrightcoveVideo", BrightcoveVideo);
        }
    }
});
System.register("components/ShowPageNav", ["components/BaseComponent"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var BaseComponent_3;
    var ShowPageNav;
    return {
        setters:[
            function (BaseComponent_3_1) {
                BaseComponent_3 = BaseComponent_3_1;
            }],
        execute: function() {
            ShowPageNav = (function (_super) {
                __extends(ShowPageNav, _super);
                function ShowPageNav() {
                    _super.apply(this, arguments);
                }
                ShowPageNav.prototype.initialise = function () {
                    if (!this.navWiderThanScreen()) {
                        return;
                    }
                    this.centreActiveNavItem();
                };
                ShowPageNav.prototype.navWiderThanScreen = function () {
                    var totalWidth = 0;
                    $(this.selector + "__item", this.$el).each(function () {
                        totalWidth += $(this).outerWidth(true);
                    });
                    return totalWidth > $(window).width();
                };
                ShowPageNav.prototype.centreActiveNavItem = function () {
                    var $currentItem = $(this.selector + "__item--is-active", this.$el), centre = this.$el.width() / 2 - $currentItem.outerWidth() / 2;
                    this.$el.scrollLeft($currentItem.offset().left - centre);
                };
                return ShowPageNav;
            }(BaseComponent_3.BaseComponent));
            exports_11("ShowPageNav", ShowPageNav);
        }
    }
});
System.register("components/TextWrapper", ["components/ConfigurableComponent"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var ConfigurableComponent_2;
    var TextWrapper;
    return {
        setters:[
            function (ConfigurableComponent_2_1) {
                ConfigurableComponent_2 = ConfigurableComponent_2_1;
            }],
        execute: function() {
            TextWrapper = (function (_super) {
                __extends(TextWrapper, _super);
                function TextWrapper(selector) {
                    _super.call(this, selector, 'TextWrapper');
                }
                TextWrapper.prototype.initialise = function () {
                    if (!this.$el.length) {
                        return;
                    }
                    if (this.options == null) {
                        throw new Error('TextWrapper has been initialised with no options.');
                    }
                    var self = this;
                    $.each(this.$el, function () {
                        var textArray = $(this).text().split('');
                        var charIndex = textArray.indexOf(self.options.character);
                        if (charIndex === -1) {
                            return;
                        }
                        var cssClass = self.getClassFromSelector(self.selector);
                        textArray[charIndex] = "<span class=\"" + cssClass + "--" + self.options.cssModifierClass + "\">" + self.options.character + "</span>";
                        if (self.options.removeWhiteSpace) {
                            if (textArray[charIndex - 1] && textArray[charIndex - 1] === ' ') {
                                textArray.splice(charIndex - 1, 1);
                            }
                            if (textArray[charIndex] && textArray[charIndex] === ' ') {
                                textArray.splice(charIndex, 1);
                            }
                        }
                        $(this).html(textArray.join(''));
                    });
                };
                TextWrapper.prototype.getClassFromSelector = function (selector) {
                    var result = selector;
                    if (selector.charAt(0) === '.') {
                        result = selector.substr(1);
                    }
                    return result;
                };
                return TextWrapper;
            }(ConfigurableComponent_2.ConfigurableComponent));
            exports_12("TextWrapper", TextWrapper);
        }
    }
});
System.register("components/ShowInfo", ["components/ConfigurableComponent"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var ConfigurableComponent_3;
    var ShowInfo;
    return {
        setters:[
            function (ConfigurableComponent_3_1) {
                ConfigurableComponent_3 = ConfigurableComponent_3_1;
            }],
        execute: function() {
            ShowInfo = (function (_super) {
                __extends(ShowInfo, _super);
                function ShowInfo(selector) {
                    _super.call(this, selector, 'ShowInfo');
                    this.namespace = this.componentName;
                }
                ShowInfo.prototype.initialise = function () {
                    var _this = this;
                    this.$trigger = $(this.options.infoSelector, this.$el);
                    if (!this.$trigger.length) {
                        return;
                    }
                    this.$overlay = $(this.options.overlaySelector, this.$el);
                    if (!this.$overlay.length) {
                        return;
                    }
                    this.$trigger.on("click." + this.namespace, function (e) { return _this.show(e); });
                    var $closeSelector = this.$overlay;
                    if (this.options.overlayCloseSelector) {
                        $closeSelector = this.initialiseSelector(this.options.overlayCloseSelector);
                    }
                    $closeSelector.length && $closeSelector.on("click." + this.namespace, function (e) { return _this.hide(e); });
                };
                ShowInfo.prototype.initialiseSelector = function (childSelector) {
                    return $(childSelector, this.$el);
                };
                ShowInfo.prototype.show = function (e) {
                    var $targetInfoSelector = $(e.target).closest(this.options.infoSelector);
                    $targetInfoSelector.fadeOut('fast');
                    $(this.options.infoSelector).not($targetInfoSelector).fadeIn('fast');
                    var $targetOverlaySelector = $(e.target).closest(this.$el).children(this.options.overlaySelector);
                    $targetOverlaySelector.fadeIn('fast');
                    $(this.options.overlaySelector).not($targetOverlaySelector).fadeOut('fast');
                    this.swiper = new Swiper($targetOverlaySelector.find('.swiper-container')[0], {
                        freeMode: true,
                        slidesPerView: 'auto',
                        mousewheelControl: true,
                        direction: 'vertical',
                        scrollContainer: true,
                        scrollbar: '.swiper-scrollbar'
                    });
                };
                ShowInfo.prototype.hide = function (e) {
                    $(e.target).closest(this.options.overlaySelector).fadeOut('fast');
                    $(e.target).closest(this.$el).find(this.options.infoSelector).fadeIn('fast');
                    if (this.swiper) {
                        this.swiper.destroy();
                        this.swiper = undefined;
                    }
                };
                return ShowInfo;
            }(ConfigurableComponent_3.ConfigurableComponent));
            exports_13("ShowInfo", ShowInfo);
        }
    }
});
System.register("models/DfpAd", [], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var DfpAd;
    return {
        setters:[],
        execute: function() {
            DfpAd = (function () {
                function DfpAd(delayLoad) {
                    this.delayLoad = delayLoad;
                }
                Object.defineProperty(DfpAd.prototype, "idSelector", {
                    get: function () {
                        return "#" + this.id;
                    },
                    enumerable: true,
                    configurable: true
                });
                return DfpAd;
            }());
            exports_14("DfpAd", DfpAd);
        }
    }
});
System.register("services/AdManager", ["models/DfpAd", "services/Generator", "services/Environment", "components/ConfigurableComponent"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var DfpAd_1, Generator_1, Environment_2, ConfigurableComponent_4;
    var AdManager, adManager;
    return {
        setters:[
            function (DfpAd_1_1) {
                DfpAd_1 = DfpAd_1_1;
            },
            function (Generator_1_1) {
                Generator_1 = Generator_1_1;
            },
            function (Environment_2_1) {
                Environment_2 = Environment_2_1;
            },
            function (ConfigurableComponent_4_1) {
                ConfigurableComponent_4 = ConfigurableComponent_4_1;
            }],
        execute: function() {
            AdManager = (function (_super) {
                __extends(AdManager, _super);
                function AdManager() {
                    _super.call(this, null, 'AdManager');
                    this.megaAdPosition = 1;
                    this.megaAdMargin = 30;
                    this.viewPortWidth = Environment_2.environment.clientWidth();
                }
                AdManager.prototype.initialise = function () {
                    var _this = this;
                    this.bootstrap();
                    this.options.PREBID_TIMEOUT = 2000;
                    this.injectMegaAdIntoArticle(this.options.mobile);
                    this.injectMobileAdsIntoArticle(this.options.mobile);
                    this.addGoogleTagScript(function () {
                        _this.recordKruxSegments();
                        _this.defineAdSlots();
                    });
                };
                AdManager.prototype.createSingleAd = function (targetSelector, cssClass, sizes, sizesMobile) {
                    var _this = this;
                    this.bootstrap();
                    var position = 1;
                    var $items = $('[data-position]');
                    if ($items.length) {
                        var positions = $items
                            .map(function () {
                            return Number($(this).attr('data-position'));
                        })
                            .toArray()
                            .filter(function (c) { return c !== _this.megaAdPosition; });
                        position = (Math.max.apply(this, positions) + 1);
                    }
                    var $ad = $('<div>')
                        .attr('id', Generator_1.generator.generateUniqueId())
                        .attr('data-position', position)
                        .data('sizes', sizes)
                        .data('mobile-sizes', sizesMobile)
                        .addClass(cssClass);
                    var $target = $(targetSelector);
                    $target.append($ad);
                    return this.configureSingleAd($ad);
                };
                AdManager.prototype.configureSingleAd = function ($ad) {
                    var _this = this;
                    this.bootstrap();
                    var dfpAd = new DfpAd_1.DfpAd(false);
                    dfpAd.id = $ad.attr('id');
                    dfpAd.sizes = $ad.data('sizes');
                    dfpAd.sizesMobile = $ad.data('mobile-sizes');
                    dfpAd.position = $ad.data('position');
                    this.configureDfpAd(dfpAd);
                    var prebidAdUnit = this.configureAdsForPrebid([dfpAd]);
                    window.pbjs.que.push(function () {
                        window.pbjs.requestBids({
                            timeout: _this.options.PREBID_TIMEOUT,
                            adUnits: prebidAdUnit,
                            bidsBackHandler: function () {
                                window.pbjs.setTargetingForGPTAsync([dfpAd.slot]);
                                window.googletag.pubads().refresh([dfpAd.slot], { changeCorrelator: false });
                            }
                        });
                    });
                    this.loggingService.log("Ad inserted at position " + dfpAd.position);
                    return $ad;
                };
                AdManager.prototype.bootstrap = function () {
                    this.setConfig();
                    this.initialiseLogging();
                };
                AdManager.prototype.injectMegaAdIntoArticle = function (adConfig) {
                    var targetParagraph = '.article__body--ads-supported > p:nth-of-type(6)';
                    if ($(targetParagraph).length) {
                        var $megaAd = $('.sca-ad__mega--inline');
                        if ($megaAd.length) {
                            $megaAd
                                .detach()
                                .insertAfter(targetParagraph)
                                .removeClass('hide')
                                .before("<div class='article__ad-text'>Continue reading below ad</div>");
                            $(targetParagraph).css('margin-bottom', this.megaAdMargin);
                        }
                    }
                };
                AdManager.prototype.injectMobileAdsIntoArticle = function (adConfig) {
                    if (this.viewPortWidth > Environment_2.environment.screenXs) {
                        return;
                    }
                    var mainBody = document.getElementsByClassName(adConfig.bodyClass)[0];
                    var adsContainer = document.getElementsByClassName(adConfig.adContainerClass)[0];
                    if (mainBody == null || adsContainer == null) {
                        return;
                    }
                    var ads = [];
                    if (adConfig.maximumAllowed != null) {
                        ads = [].slice.call(adsContainer.getElementsByClassName(adConfig.adClass));
                        for (var i = 0; i < ads.length; i++) {
                            if (i > adConfig.maximumAllowed - 1) {
                                adsContainer.removeChild(ads[i]);
                            }
                        }
                        ads = [].slice.call(adsContainer.getElementsByClassName(adConfig.adClass));
                    }
                    if (ads.length === 0) {
                        return;
                    }
                    var blocks = [];
                    adConfig.targetTags.forEach(function (c) {
                        var tagElements = [].slice.call(mainBody.getElementsByTagName(c));
                        blocks = blocks.concat(tagElements);
                    });
                    for (var i = 1; i < blocks.length; i++) {
                        if ((i % adConfig.blockFrequency) === 0) {
                            if (ads.length === 0) {
                                return;
                            }
                            var ad = ads.shift();
                            mainBody.insertBefore(ad, blocks[i]);
                            ad.className += " " + adConfig.adClass + (adConfig.adClassModifier || '');
                            var containerChildNodes = [].slice.call(adsContainer.childNodes);
                            var remainingAds = containerChildNodes.filter(function (c) { return c.className === adConfig.adClass; });
                            if (remainingAds.length === 0) {
                                adsContainer.parentElement.removeChild(adsContainer);
                            }
                        }
                    }
                };
                AdManager.prototype.addGoogleTagScript = function (callback) {
                    var gAds = document.createElement('script');
                    var useSsl = ('https:' === document.location.protocol);
                    gAds.async = true;
                    gAds.src = 'http' + (useSsl ? 's' : '') + '://www.googletagservices.com/tag/js/gpt.js';
                    gAds.onload = callback;
                    var node = document.getElementsByTagName('script')[0];
                    node.parentNode.insertBefore(gAds, node);
                };
                AdManager.prototype.recordKruxSegments = function () {
                    var _this = this;
                    if (typeof (Krux) === 'undefined') {
                        setTimeout(function () {
                            _this.recordKruxSegments();
                        }, 300);
                        return;
                    }
                    var googletag = window.googletag || {};
                    googletag.cmd = googletag.cmd || [];
                    googletag.cmd.push(function () {
                        googletag.pubads().setTargeting('ksg', Krux.segments);
                        googletag.pubads().setTargeting('kuid', Krux.user);
                    });
                };
                AdManager.prototype.defineAdSlots = function () {
                    var _this = this;
                    var googletag = window.googletag || {};
                    googletag.cmd = googletag.cmd || [];
                    var dfpAds = this.getDfpSiteAds('*[data-sca-component="sca-ad"]');
                    googletag.cmd.push(function () {
                        dfpAds.forEach(function (ad) { return _this.configureDfpAd(ad); });
                        _this.indexAds(dfpAds);
                        googletag.pubads().collapseEmptyDivs();
                        googletag.pubads().enableSingleRequest();
                        googletag.pubads().disableInitialLoad();
                        googletag.pubads().setTargeting('type', _this.options.pageType);
                        _this.options.urlSegments.forEach(function (segment, idx) {
                            if (idx === 0) {
                                googletag.pubads().setTargeting("cat", segment);
                            }
                            else {
                                googletag.pubads().setTargeting("cat" + idx, segment);
                            }
                        });
                        googletag.pubads().addEventListener('slotRenderEnded', function (e) { return _this.onSlotRender(e); });
                        googletag.enableServices();
                    });
                    googletag.cmd.push(function () {
                        dfpAds.forEach(function (ad) { return googletag.display(ad.id); });
                    });
                    this.loadAds(dfpAds);
                };
                AdManager.prototype.loadAds = function (dfpAds) {
                    var _this = this;
                    var initialLoadAds = [];
                    dfpAds.forEach(function (c) {
                        if (c.delayLoad) {
                            _this.configureDelayLoadAd(c);
                        }
                    });
                    this.initPrebid(dfpAds);
                };
                AdManager.prototype.loadAd = function (ad) {
                    var callDFP = function () {
                        window.googletag.cmd.push(function () {
                            window.pbjs.que.push(function () {
                                window.pbjs.setTargetingForGPTAsyncCopy([ad.slot.getSlotElementId()]);
                                window.googletag.pubads().refresh([ad.slot], { changeCorrelator: false });
                            });
                        });
                    }
                    if (!window.pbjs.initialRequestSent) {
                        document.addEventListener("initialRequestSent",function(){setTimeout(callDFP, 200)},false);
                    } else {
                        callDFP();
                    }
                };
                AdManager.prototype.initPrebid = function (dfpAds) {
                    var _this = this;
                    var prebidAds = dfpAds.filter(function(c){
                        return c.prebid === 1;
                    });
                    var nonPrebidAds = dfpAds.filter(function(c){
                        return (c.prebid !== 1 && c.delayLoad !== true);
                    });
                    window.googletag.cmd.push(function () {
                        var nonPrebidAdsSlot = nonPrebidAds.map(function (ad) { return ad.slot; });
                        prebidAds.forEach(function (c) {
                            if (c.delayLoad === true) {
                                c.slot.delayLoad = true
                            }
                        });
                        var prebidAdsSlot = prebidAds.map(function (ad) { return ad.slot; });
                        window.googletag.pubads().refresh(nonPrebidAdsSlot);    
                        window.pbjs.que.push(function () {
                            window.pbjs.rp.addAdUnits();                        
                            window.pbjs.rp.requestBids({
                                callback: _this.loadATFAds,
                                gptSlotObjects: prebidAdsSlot,
                                data: {
                                    segmentType: { "key" : "value" }
                                }
                            });
                        });
                        setTimeout(function () {
                                _this.loadATFAds(prebidAdsSlot);
                        }, _this.options.PREBID_TIMEOUT);
                    });
                };
                AdManager.prototype.loadATFAds = function (prebidAdsSlot) {
                    if (window.pbjs.initialRequestSent)
                        return;
                    var evt = document.createEvent("Event");
                    evt.initEvent("initialRequestSent",true,true);
                    document.dispatchEvent(evt);
                    var initialLoadAds = prebidAdsSlot.filter(function(c){
                        return c.delayLoad !== true;
                    });
                    window.pbjs.initialRequestSent = true;
                    window.googletag.cmd.push(function () {
                        window.pbjs.que.push(function () {
                            window.pbjs.setTargetingForGPTAsyncCopy(initialLoadAds.map(function(d) {return d.getSlotElementId()}));
                            window.googletag.pubads().refresh(initialLoadAds);
                        });
                    });
                };
                AdManager.prototype.configureAdsForPrebid = function (dfpAds) {
                    var _this = this;
                    var bidders = this.options.bidders;
                    var playgroundXYZ = bidders ? window._.find(this.options.bidders, function (bidder) { return bidder.bidder === 'playgroundxyz'; }) : {};
                    return dfpAds.map(function (ad) {
                        var placementId = _this.configurePlaygroundXYZPlacementId(ad.sizes, playgroundXYZ.placementIds);
                        return {
                            code: ad.id,
                            mediaTypes: {
                                banner: {
                                    sizes: ad.sizes
                                }
                            },
                            bids: [{
                                    bidder: 'playgroundxyz',
                                    params: {
                                        placementId: placementId,
                                        usePaymentRule: true
                                    }
                                }
                            ]
                        };
                    });
                };
                AdManager.prototype.configurePlaygroundXYZPlacementId = function (adSizes, placementIds) {
                    if (!placementIds)
                        return '';
                    for (var i = 0; i < adSizes.length; i++) {
                        var width = adSizes[i][0];
                        var height = adSizes[i][1];
                        if (width === 320 && height === 50) {
                            return window._.find(placementIds, function (placementIdObj) { return placementIdObj.Width === 320 && placementIdObj.Height === 50; }).AdId;
                        }
                        else if (width === 300 && height === 250) {
                            return window._.find(placementIds, function (placementIdObj) { return placementIdObj.Width === 300 && placementIdObj.Height === 250; }).AdId;
                        }
                        else {
                            return '';
                        }
                    }
                };
                AdManager.prototype.getDfpSiteAds = function (adSelector) {
                    var dfpAds = [];
                    var self = this;
                    var mobileBannerAdsCount = 0;
                    $(adSelector).each(function (index, value) {
                        var $ad = $(value);
                        var delayLoad = ($ad.attr('id') !== 'ad-header');
                        var dfpAd = new DfpAd_1.DfpAd(delayLoad);
                        dfpAd.id = $ad.attr('id');
                        dfpAd.prebid = (typeof ($ad.data('prebid')) !== 'undefined' ? $ad.data('prebid') : 0);
                        if (self.adMatchesBreakpoints($ad) === false) {
                            return;
                        }
                        if (dfpAd.id === 'ad-mega') {
                            dfpAd.sizes = $ad.data('sizes');
                            dfpAd.sizesMobile = $ad.data('sizes');
                        }
                        else {
                            dfpAd.sizes = $ad.data('sizes');
                            dfpAd.sizesMobile = $ad.data('mobile-sizes');
                        }
                        if (!Environment_2.environment.isDesktop() && dfpAd.id.indexOf('ad-article-side-') >= 0) {
                            var pos = $ad.data('position') + 1;
                            dfpAd.position = pos.toString();
                        }
                        else {
                            dfpAd.position = $ad.data('position');
                        }                     
                        if (!Environment_2.environment.isDesktop() && dfpAd.sizesMobile.toString().indexOf('320,50') >= 0) {
                            mobileBannerAdsCount++;
                            if (dfpAd.id === 'ad-footer') {
                                dfpAd.position = mobileBannerAdsCount.toString();
                            }
                        }
                        if (dfpAd.id != null && dfpAd.id !== '') {
                            dfpAds.push(dfpAd);
                        }
                    });
                    return dfpAds;
                };
                AdManager.prototype.adMatchesBreakpoints = function ($ad) {
                    var minWidth = (typeof ($ad.data('min-width')) !== 'undefined' ? $ad.data('min-width') : '');
                    var maxWidth = (typeof ($ad.data('max-width')) !== 'undefined' ? $ad.data('max-width') : '');
                    if (minWidth === '' && maxWidth === '') {
                        return true;
                    }
                    if (maxWidth === '' && this.viewPortWidth >= minWidth) {
                        return true;
                    }
                    if (minWidth === '' && this.viewPortWidth < maxWidth) {
                        return true;
                    }
                    if (this.viewPortWidth >= minWidth && this.viewPortWidth < maxWidth) {
                        return true;
                    }
                    return false;
                };
                AdManager.prototype.configureDfpAd = function (ad) {
                    if (Environment_2.environment.isDesktop()) {
                        ad.unitPath = this.options.dfpUnitPath;
                        ad.slot = this.configureAdSlot(ad, this.options.dfpUnitPath, false);
                    }
                    else {
                        ad.unitPath = this.options.dfpUnitPathMobile;
                        ad.slot = this.configureAdSlot(ad, this.options.dfpUnitPathMobile, true);
                    }
                };
                AdManager.prototype.configureAdSlot = function (ad, unitPath, isMobile) {
                    var googletag = window.googletag;
                    if (ad.position) {
                        var slot = googletag.defineSlot(unitPath, (isMobile ? ad.sizesMobile : ad.sizes), ad.id);
                        try {
                            if (slot !== null) {
                                slot
                                    .setTargeting('pos', ad.position)
                                    .addService(googletag.pubads());
                            }
                            else {
                                throw 'googletag.defineSlot() is returning null. This can be caused by a missing ad unit path or duplicate id\`s on two or more different ad slots';
                            }
                        }
                        catch (e) {
                            this.loggingService.warn("[AdManager] -- caught error: " + e);
                        }
                        return slot;
                    }
                    else {
                        return googletag
                            .defineSlot(unitPath, (isMobile ? ad.sizesMobile : ad.sizes), ad.id)
                            .addService(googletag.pubads());
                    }
                };
                AdManager.prototype.indexAds = function (ads) {
                    var newLine = '\r\n';
                    var comments = [newLine];
                    comments.push(("Type: " + this.options.pageType) + newLine);
                    comments.push("Targeting" + newLine + "=========");
                    if (this.options.urlSegments.length > 0) {
                        this.options.urlSegments.forEach(function (segment, idx) {
                            if (idx === 0) {
                                comments.push("cat: " + segment);
                            }
                            else {
                                comments.push("cat" + idx + ": " + segment);
                            }
                        });
                    }
                    else {
                        comments.push('N/A');
                    }
                    comments.push(newLine + "Ads" + newLine + "=========");
                    this.indexAdSlotInfo(ads, comments);
                    var container = document.createElement('span');
                    container.className = 'dfp-ad-configuration';
                    document.body.appendChild(container);
                    $('<!-- \n\n  Start: DFP Ad Configuration \n\n -->').insertBefore('.dfp-ad-configuration');
                    var commentString = '';
                    comments.forEach(function (c) { return commentString += c + newLine; });
                    commentString += newLine;
                    var comment = document.createComment(commentString);
                    container.appendChild(comment);
                };
                AdManager.prototype.indexAdSlotInfo = function (ads, comments) {
                    var maxAdIdLength = Math.max.apply(this, ads.map(function (c) { return c.id.length; }));
                    var maxAdUnitPathLength = Math.max.apply(this, ads.map(function (c) { return c.unitPath.length; }));
                    ads.forEach(function (ad, idx) {
                        var id = "\"" + ad.id + "\",";
                        while (id.length < maxAdIdLength) {
                            id += ' ';
                        }
                        var unitPath = "\"" + ad.unitPath + "\",";
                        while (unitPath.length < maxAdUnitPathLength) {
                            unitPath += ' ';
                        }
                        var sizes = (window.innerWidth >= Environment_2.environment.screenXs ? ad.sizes : ad.sizesMobile);
                        var idIndent = (ad.id.length >= 20 ? '\t\t' : '\t\t\t');
                        if (!!ad.position) {
                            comments.push((idx + 1) + "] Id: " + id + idIndent + "Unit Path: " + unitPath + "\t\tPos: " + ad.position + "\t\tSizes: " + JSON.stringify(sizes));
                        }
                        else {
                            comments.push((idx + 1) + "] Id: " + id + idIndent + "Unit Path: " + unitPath + "\t\tSizes: " + JSON.stringify(sizes));
                        }
                    });
                };
                AdManager.prototype.onSlotRender = function (event) {
                    var _this = this;
                    var elementId = event.slot.getSlotElementId();
                    if (elementId && elementId === 'ad-header') {
                        var stickyHeaderPadding = 17;
                        var adHeight = event.size[1];
                        var adContainerHeight = (adHeight + stickyHeaderPadding * 2);
                        this.configureStickyHeader(adHeight, adContainerHeight);
                    }
                    if (elementId && elementId === 'ad-mega') {
                        var $megaAdInline_1 = $("#" + elementId + ".sca-ad__mega--inline");
                        if ($megaAdInline_1.length && !$megaAdInline_1.hasClass('hide')) {
                            var initialMegaAdHeight_1 = $megaAdInline_1.height();
                            var initaliseMegaAdHeight_1 = function () {
                                setTimeout(function () {
                                    if (($megaAdInline_1.height() > 100) && ($megaAdInline_1.height() !== initialMegaAdHeight_1)) {
                                        _this.addMegaAdParagraphHeight($megaAdInline_1);
                                        _this.checkMegaAdParagraphOffset();
                                        $(window).resize(function () {
                                            $megaAdInline_1.next().css('padding-top', $megaAdInline_1.height() + _this.megaAdMargin);
                                        });
                                        return;
                                    }
                                    initaliseMegaAdHeight_1();
                                }, 500);
                            };
                            initaliseMegaAdHeight_1();
                        }
                        this.createMegaAdPostMessageListener(elementId);
                    }
                };
                AdManager.prototype.configureStickyHeader = function (adHeight, adContainerHeight) {
                    var _this = this;
                    var $body = $('body');
                    var $header = $('.header');
                    var $geoLocationNav = $('.geo-location');
                    var $adContainer = $('.sca-ad__container');
                    var marginTop = adContainerHeight;
                    var geoLocationNavHeight = ($geoLocationNav.length ? $geoLocationNav.outerHeight() : 0);
                    if (geoLocationNavHeight > 0) {
                        marginTop = (geoLocationNavHeight + adContainerHeight);
                        $body.css('padding-top', geoLocationNavHeight);
                        $adContainer.css('top', geoLocationNavHeight);
                        $(window).unbind('scroll.geoLocation');
                        $(window).on('scroll.stickyHeader', function () {
                            $header.css('margin-top', '');
                            if ($(window).scrollTop() >= geoLocationNavHeight) {
                                $adContainer.css('top', 0);
                                $header.css('top', adContainerHeight);
                            }
                            else {
                                $adContainer.css('top', geoLocationNavHeight);
                                $header.css('top', marginTop);
                            }
                        });
                    }
                    $adContainer.css('height', adContainerHeight);
                    $header.css('margin-top', marginTop);
                    $body.css('margin-top', marginTop);
                    setTimeout(function () {
                        if ($geoLocationNav.length) {
                            $header.css('top', '');
                            $(window).unbind('scroll.stickyHeader');
                        }
                        _this.handlePageScroll(marginTop);
                        $(window).trigger('adHidden');
                        if ($(window).scrollTop() >= marginTop) {
                            $adContainer.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                                $body.addClass('sca-ad--relative-header');
                                $adContainer.attr('style', '').css('top', 0);
                            }).css({
                                'height': 0,
                                'transition-duration': '0.6s'
                            });
                            $header.css('margin-top', 0);
                        }
                        else {
                            $body.addClass('sca-ad--relative-header');
                            $adContainer.css('top', 0);
                            $header.css('margin-top', 0);
                        }
                        ;
                    }, 4000);
                };
                AdManager.prototype.handlePageScroll = function (adContainerHeight) {
                    var $body = $('body');
                    $(window).on('scroll adHidden', function () {
                        if ($(window).scrollTop() >= adContainerHeight) {
                            $body.addClass('sca-ad--fixed-header');
                        }
                        else {
                            $body.removeClass('sca-ad--fixed-header');
                        }
                    });
                };
                AdManager.prototype.addMegaAdParagraphHeight = function ($megaAd) {
                    var div = document.createElement('div');
                    $(div)
                        .css('padding-top', $megaAd.height() + this.megaAdMargin)
                        .insertAfter($megaAd);
                };
                AdManager.prototype.checkMegaAdParagraphOffset = function () {
                    if (this.viewPortWidth < Environment_2.environment.screenMd) {
                        return;
                    }
                    var $articleSide2 = $('#ad-article-side-2');
                    var $articleBodyAdsSupported = $('.article__body--ads-supported');
                    if (!$articleSide2.length || !$articleBodyAdsSupported.length) {
                        return;
                    }
                    var $p6 = $articleBodyAdsSupported.find('p:nth-of-type(6)');
                    if (!$p6.length) {
                        return;
                    }
                    var mrec2Offset = ($articleSide2.offset().top + $articleSide2.height());
                    var p6Offset = ($p6.offset().top + $p6.height());
                    if (p6Offset < mrec2Offset) {
                        $p6.css('margin-bottom', (mrec2Offset - p6Offset + $p6.height()));
                    }
                };
                AdManager.prototype.createMegaAdPostMessageListener = function (megaAdId) {
                    window.addEventListener('message', function (e) {
                        if (e.data.length && e.data.indexOf('{') === 0) {
                            var megaAdAttributes = void 0;
                            try {
                                megaAdAttributes = JSON.parse(e.data);
                            }
                            catch (e) {
                                return;
                            }
                            if (megaAdAttributes.bgImg != null) {
                                $("#" + megaAdId).css({
                                    'background-image': "url(" + megaAdAttributes.bgImg + ")",
                                    'background-color': "" + megaAdAttributes.bgHex
                                });
                            }
                        }
                    });
                };
                AdManager.prototype.getGoogleOptimzeConfigValue = function (googleOptimizeConfig, name, defaultValue) {
                    return googleOptimizeConfig.map(function (item) {
                        return (item.name === name) ? item.value : defaultValue;
                    });
                };
                AdManager.prototype.getUpdatedTriggerValue = function (ad, googleOptimizeConfig) {
                    var updatedAdAlmostVisibleScrollPercent = .6;
                    var updatedAdPosition = parseInt($(ad.idSelector).offset().top.toFixed(0));
                    var updatedAdAlmostVisibleScrollFixed = parseInt(this.getGoogleOptimzeConfigValue(googleOptimizeConfig, 'adAlmostVisibleScrollValue', 400));
                    var updatedAdAlmostVisibleScrollValue = (ad.id === 'ad-footer') ? updatedAdAlmostVisibleScrollFixed : updatedAdAlmostVisibleScrollPercent * updatedAdPosition;
                    return updatedAdPosition - updatedAdAlmostVisibleScrollValue;
                };
                AdManager.prototype.renderAdOnScroll = function (googletag, ad) {
                    var _this = this;
                    var eventNamespace = "scroll.ad-" + ad.id + " resize.ad-" + ad.id;
                    $(window).on(eventNamespace, function () {
                        var updatedAdPosition = parseInt($(ad.idSelector).offset().top.toFixed(0));
                        var googleOptimizeConfig = window.GoogleOptimizeConfig || [];
                        var updatedTriggerValue = _this.getUpdatedTriggerValue(ad, googleOptimizeConfig);
                        var screenHeight = $(window).height();
                        if (window.pageYOffset + screenHeight >= updatedTriggerValue) {
                            screenHeight = $(window).height();
                            _this.loadAd(ad);
                            $(window).off(eventNamespace);
                        }
                    });
                };
                AdManager.prototype.configureDelayLoadAd = function (ad) {
                    var googleOptimizeConfig = window.GoogleOptimizeConfig || [];
                    var googletag = window.googletag;
                    var updatedTriggerValue = this.getUpdatedTriggerValue(ad, googleOptimizeConfig);
                    if (updatedTriggerValue <= $(window).height()) {
                        this.loadAd(ad);
                    }
                    else {
                        this.renderAdOnScroll(googletag, ad);
                    }
                };
                return AdManager;
            }(ConfigurableComponent_4.ConfigurableComponent));
            adManager = new AdManager();
            exports_15("adManager", adManager);
        }
    }
});
System.register("services/StorageService", ["components/ConfigurableComponent"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var ConfigurableComponent_5;
    var StorageService;
    return {
        setters:[
            function (ConfigurableComponent_5_1) {
                ConfigurableComponent_5 = ConfigurableComponent_5_1;
            }],
        execute: function() {
            StorageService = (function (_super) {
                __extends(StorageService, _super);
                function StorageService() {
                    _super.call(this, null, 'StorageService');
                }
                StorageService.prototype.getNetworkDomain = function (hostname) {
                    var stripDomain = hostname.replace(/^(?:[a-z0-9\-\.]+\.)?([a-z0-9\-]+)(\.com\.au|\.com|\.io|\.net|\.org)$/, '$1$2');
                    return "." + stripDomain;
                };
                StorageService.prototype.setCurrentStation = function () {
                    if (!this.options.setStationCookie) {
                        return;
                    }
                    Cookies.remove(this.options.stationCookieName, { domain: this.getNetworkDomain(window.location.hostname) });
                    var myStationCookieName = Cookies.get(this.options.stationCookieName);
                    if (myStationCookieName == null || myStationCookieName !== this.options.currentStation) {
                        Cookies.set(this.options.stationCookieName, this.options.currentStation, { expires: 365 });
                    }
                    var myStateCookieName = Cookies.get(this.options.stateCookieName);
                    if ((myStateCookieName == null || myStateCookieName !== this.options.currentStationState) && this.options.stationType !== 'Digital' && this.options.currentStationState) {
                        Cookies.set(this.options.stateCookieName, this.options.currentStationState, { expires: 365, path: '/', domain: this.getNetworkDomain(window.location.hostname) });
                    }
                };
                StorageService.prototype.getCurrentStation = function () {
                    var mycookie = Cookies.get(this.options.stationCookieName);
                    return (mycookie ? mycookie : '');
                };
                StorageService.prototype.getCurrentStationState = function () {
                    var mycookie = Cookies.get(this.options.stateCookieName);
                    return (mycookie ? mycookie : '');
                };
                StorageService.prototype.getPreferedDigitalStream = function () {
                    var digitalStreamCookie = Cookies.get(this.options.digitalStreamCookieName) || null;
                    var currentDigitalStream = JSON.parse(digitalStreamCookie);
                    return currentDigitalStream ? currentDigitalStream : null;
                };
                return StorageService;
            }(ConfigurableComponent_5.ConfigurableComponent));
            exports_16("StorageService", StorageService);
        }
    }
});
System.register("components/NewWindowLink", ["components/ConfigurableComponent"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var ConfigurableComponent_6;
    var NewWindowLink;
    return {
        setters:[
            function (ConfigurableComponent_6_1) {
                ConfigurableComponent_6 = ConfigurableComponent_6_1;
            }],
        execute: function() {
            NewWindowLink = (function (_super) {
                __extends(NewWindowLink, _super);
                function NewWindowLink(selector) {
                    _super.call(this, selector, 'NewWindowLink');
                }
                NewWindowLink.prototype.initialise = function () {
                    var _this = this;
                    this.$el.on('click', function (e) {
                        e.preventDefault();
                        _this.openWindow($(e.currentTarget));
                    });
                };
                NewWindowLink.prototype.openWindow = function ($el) {
                    var location = $el.attr('href');
                    window.open(location, '_blank', "height=" + this.options.height + ",width=" + this.options.width + "," + this.options.windowOptions);
                };
                return NewWindowLink;
            }(ConfigurableComponent_6.ConfigurableComponent));
            exports_17("NewWindowLink", NewWindowLink);
        }
    }
});
System.register("components/Modal", ["components/ConfigurableComponent", "services/Environment"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var ConfigurableComponent_7, Environment_3;
    var Modal;
    return {
        setters:[
            function (ConfigurableComponent_7_1) {
                ConfigurableComponent_7 = ConfigurableComponent_7_1;
            },
            function (Environment_3_1) {
                Environment_3 = Environment_3_1;
            }],
        execute: function() {
            Modal = (function (_super) {
                __extends(Modal, _super);
                function Modal() {
                    _super.call(this, null, 'Modal');
                }
                Modal.prototype.initialise = function () {
                    var _this = this;
                    $('.modal__close', this.$el).on('click', function (e) {
                        e.preventDefault();
                        Modal.closeModalWindow(_this.$el);
                    });
                    if (this.options.lazyLoadImages) {
                        Modal.loadLazyImages();
                    }
                    if (Environment_3.environment.isIos()) {
                        $('.modal__inner').on('touchmove', Environment_3.environment.handleIosScrolling);
                    }
                    ;
                };
                Modal.getModalState = function ($el) {
                    return $('.modal-state', $el).prop('checked');
                };
                Modal.openModalWindow = function ($el) {
                    $('.modal-state', $el).prop('checked', true);
                    $('body').addClass('modal-open');
                    Modal.loadLazyImages();
                };
                Modal.closeModalWindow = function ($el) {
                    $('.modal-state', $el).prop('checked', false);
                    $('body').removeClass('modal-open');
                };
                Modal.loadLazyImages = function () {
                    $('.modal__inner').find('img[data-img-src]').each(function () {
                        var src = $(this).data('img-src');
                        $(this).attr('src', src).removeAttr('data-img-src');
                    });
                };
                return Modal;
            }(ConfigurableComponent_7.ConfigurableComponent));
            exports_18("Modal", Modal);
        }
    }
});
System.register("components/ChangeStation", ["components/BaseComponent", "components/Modal", "services/Environment"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var BaseComponent_4, Modal_1, Environment_4;
    var ChangeStation;
    return {
        setters:[
            function (BaseComponent_4_1) {
                BaseComponent_4 = BaseComponent_4_1;
            },
            function (Modal_1_1) {
                Modal_1 = Modal_1_1;
            },
            function (Environment_4_1) {
                Environment_4 = Environment_4_1;
            }],
        execute: function() {
            ChangeStation = (function (_super) {
                __extends(ChangeStation, _super);
                function ChangeStation() {
                    _super.apply(this, arguments);
                }
                ChangeStation.prototype.initialise = function () {
                    this.displayCookiesMessage();
                    $('.header__change-station', this.$el).on('click', function (e) {
                        e.preventDefault();
                        Modal_1.Modal.openModalWindow($('.modal-stations'));
                        $('.modal__close').addClass('modal__close--show');
                    });
                };
                ChangeStation.prototype.displayCookiesMessage = function () {
                    if (Environment_4.environment.cookiesEnabled())
                        return;
                    this.setCookieSettingsLink();
                    $('.station-selector__cookies-message').addClass('station-selector__cookies-message--is-visible');
                };
                ChangeStation.prototype.setHref = function (href) {
                    $('.station-selector__cookies-message-link').attr('href', href);
                };
                ChangeStation.prototype.setCookieSettingsLink = function () {
                    if (Environment_4.environment.isIe()) {
                        this.setHref('https://answers.microsoft.com/en-us/ie/forum/ie10-windows_8/how-to-enable-cookies-in-internet-explorer-10/9174d88f-c1dd-4395-bea4-69cc12c99619');
                        return;
                    }
                    if (Environment_4.environment.isFirefox()) {
                        this.setHref('https://support.mozilla.org/t5/Cookies-and-cache/Enable-and-disable-cookies-that-websites-use-to-track-your/ta-p/2784');
                        return;
                    }
                    if (Environment_4.environment.isAndroid()) {
                        this.setHref('https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid&hl=en&oco=0');
                        return;
                    }
                    if (Environment_4.environment.isChrome()) {
                        this.setHref('https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en&oco=0');
                        return;
                    }
                    if (Environment_4.environment.isIos()) {
                        this.setHref('https://support.apple.com/en-au/HT201265');
                        return;
                    }
                    if (Environment_4.environment.isSafari()) {
                        this.setHref('https://support.apple.com/kb/ph21411?locale=en_US');
                        return;
                    }
                };
                return ChangeStation;
            }(BaseComponent_4.BaseComponent));
            exports_19("ChangeStation", ChangeStation);
        }
    }
});
System.register("services/Lightstreamer", ["components/ConfigurableComponent", "services/StorageService"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var ConfigurableComponent_8, StorageService_1;
    var LightstreamerService;
    return {
        setters:[
            function (ConfigurableComponent_8_1) {
                ConfigurableComponent_8 = ConfigurableComponent_8_1;
            },
            function (StorageService_1_1) {
                StorageService_1 = StorageService_1_1;
            }],
        execute: function() {
            LightstreamerService = (function (_super) {
                __extends(LightstreamerService, _super);
                function LightstreamerService() {
                    _super.call(this, null, 'LightstreamerService');
                }
                LightstreamerService.prototype.initialise = function (parameters) {
                    this.params = parameters;
                    this.createLightstreamerSubscription();
                };
                LightstreamerService.prototype.createLightstreamerSubscription = function () {
                    var _this = this;
                    var subscription = this.getSubscription();
                    subscription.setRequestedSnapshot('yes');
                    subscription.setDataAdapter('MONITOR');
                    subscription.addListener({
                        onSubscription: function () {
                            _this.loggingService.log('Lightstreamer: Subscription initialised');
                        }
                    });
                    subscription.addListener({
                        onItemUpdate: function (itemUpdate) {
                            _this.onLightStreamerItemUpdate(itemUpdate);
                        }
                    });
                    subscription.addListener({
                        onSubscriptionError: function (code, message) {
                            _this.loggingService.log("Lightstreamer: Subscription failed: " + message);
                        }
                    });
                    var client = new LightstreamerClient(this.options.lightstreamerEndpoint, this.params.adapterSet);
                    client.connect();
                    client.subscribe(subscription);
                };
                LightstreamerService.prototype.getSubscription = function () {
                    var subscriptionMode = this.options.subscriptionMode;
                    var fields = this.params.fields;
                    var storageService = new StorageService_1.StorageService();
                    var preferedDigitalStream = storageService.getPreferedDigitalStream();
                    var items = preferedDigitalStream ? [preferedDigitalStream.LightStreamerStation] : this.options.station;
                    return new Subscription(subscriptionMode, items, fields);
                };
                LightstreamerService.prototype.onLightStreamerItemUpdate = function (itemUpdate) {
                    this.params.subscriberMethod(JSON.parse(itemUpdate.getValue(this.params.fields)));
                };
                return LightstreamerService;
            }(ConfigurableComponent_8.ConfigurableComponent));
            exports_20("LightstreamerService", LightstreamerService);
        }
    }
});
System.register("services/SignalR", ["components/ConfigurableComponent"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var ConfigurableComponent_9;
    var SignalRService;
    return {
        setters:[
            function (ConfigurableComponent_9_1) {
                ConfigurableComponent_9 = ConfigurableComponent_9_1;
            }],
        execute: function() {
            SignalRService = (function (_super) {
                __extends(SignalRService, _super);
                function SignalRService() {
                    _super.call(this, null, 'SignalRService');
                }
                SignalRService.prototype.initialise = function (cb) {
                    if (!this.options.nowPlayingEnabled) {
                        return false;
                    }
                    this.retry = 0;
                    this.callback = cb;
                    this.connect();
                    return true;
                };
                SignalRService.prototype.retryConnection = function () {
                    var _this = this;
                    setTimeout(function () {
                        if (_this.retry >= 3)
                            return;
                        _this.retry++;
                        _this.startConnection();
                    }, 5000);
                };
                SignalRService.prototype.connect = function () {
                    var _this = this;
                    this.connection = new signalR.HubConnectionBuilder()
                        .withUrl(this.options.nowPlayingUrl, {
                        skipNegotiation: true,
                        transport: signalR.HttpTransportType.WebSockets
                    })
                        .configureLogging(signalR.LogLevel.Error)
                        .build();
                    this.connection.on('nowPlaying', this.callback);
                    this.connection.onclose(function () {
                        _this.retryConnection();
                    });
                    this.startConnection();
                };
                SignalRService.prototype.startConnection = function () {
                    var _this = this;
                    this.connection.start().then(function () {
                        _this.connection
                            .invoke('Subscribe', { 'Station': _this.options.station })
                            .then(function (d) {
                            _this.callback(d);
                            _this.retry = 0;
                        });
                    }, function () {
                        _this.retryConnection();
                    }).catch(function (err) {
                        console.error(err);
                        _this.retryConnection();
                    });
                };
                return SignalRService;
            }(ConfigurableComponent_9.ConfigurableComponent));
            exports_21("SignalRService", SignalRService);
        }
    }
});
System.register("components/ListenLiveBar", ["components/ConfigurableComponent", "services/Lightstreamer", "services/SignalR"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var ConfigurableComponent_10, Lightstreamer_1, SignalR_1;
    var ListenLiveBar;
    return {
        setters:[
            function (ConfigurableComponent_10_1) {
                ConfigurableComponent_10 = ConfigurableComponent_10_1;
            },
            function (Lightstreamer_1_1) {
                Lightstreamer_1 = Lightstreamer_1_1;
            },
            function (SignalR_1_1) {
                SignalR_1 = SignalR_1_1;
            }],
        execute: function() {
            ListenLiveBar = (function (_super) {
                __extends(ListenLiveBar, _super);
                function ListenLiveBar(selector) {
                    _super.call(this, selector, 'ListenLiveBar');
                }
                ListenLiveBar.prototype.initialise = function () {
                    if (!new SignalR_1.SignalRService().initialise(this.updateTrackAndShow)) {
                        var lightstreamerParams = {
                            adapterSet: this.options.lightstreamerAdapterSet,
                            fields: this.options.lightstreamerFields,
                            subscriberMethod: this.onLightstreamerUpdate
                        };
                        var lightstreamer = new Lightstreamer_1.LightstreamerService();
                        lightstreamer.initialise(lightstreamerParams);
                        this.pollForCurrentShow();
                    }
                };
                ListenLiveBar.prototype.onLightstreamerUpdate = function (trackInformation) {
                    var trackSelector = '.listen-live__track';
                    $(trackSelector + "-name").text(trackInformation.Title);
                    $(trackSelector + "-artist").text(" - " + trackInformation.Artist);
                    $("" + trackSelector).attr('title', trackInformation.Artist + " - " + trackInformation.Title);
                };
                ListenLiveBar.prototype.pollForCurrentShow = function () {
                    var settings = {
                        url: this.options.currentShowEndpoint
                    };
                    this.waitUpdateShowName(settings, 0);
                };
                ListenLiveBar.prototype.waitUpdateShowName = function (settings, timeout) {
                    var _this = this;
                    window.setTimeout(function () {
                        _this.requestCurrentShow(settings)
                            .then(function (data) {
                            _this.onCurrentShowRequested(data);
                            _this.waitUpdateShowName(settings, _this.options.currentShowPollFrequency * 1000);
                        });
                    }, timeout);
                };
                ListenLiveBar.prototype.requestCurrentShow = function (ajaxRequestSettings) {
                    var _this = this;
                    var promise = $.ajax(ajaxRequestSettings);
                    promise.fail(function () {
                        _this.loggingService.error('Unable to retrive current show data');
                    });
                    return promise;
                };
                ListenLiveBar.prototype.onCurrentShowRequested = function (data) {
                    if (data != null) {
                        $(this.selector + "__show-name", this.$el).text(data.title);
                        if (data.image.url != null) {
                            this.setTalent(data.image.url, data.title);
                        }
                        else {
                            this.loggingService.warn('No image url supplied by API');
                        }
                    }
                };
                ListenLiveBar.prototype.setTalent = function (imageUrl, title) {
                    var $talent = $(this.selector + "__talent", this.$el);
                    if (!$talent.length) {
                        $talent = $('<img class="listen-live__talent" alt="">');
                        $(this.selector).find('.listen-live__wrapper').prepend($talent);
                    }
                    $talent.attr({
                        src: imageUrl.replace('http://cdn.scahw.com.au', 'https://cdn-epi.scadigital.io'),
                        alt: title
                    });
                };
                ListenLiveBar.prototype.setShow = function (showTitle, showImage) {
                    $(this.selector + "__show-name", this.$el).text(showTitle);
                    if (showImage != null) {
                        this.setTalent(showImage, showTitle);
                    }
                    else {
                        this.loggingService.warn('No image url supplied by API');
                    }
                };
                ListenLiveBar.prototype.updateTrackAndShow = function (data) {
                    var containerSelector = '.listen-live';
                    var trackInformation = {
                        title: data.currentTrack ? data.currentTrack.title : (data.currentShow ? data.currentShow.title : ''),
                        artist: data.currentTrack ? data.currentTrack.artistName : ''
                    };
                    var trackSelector = '.listen-live__track';
                    $(trackSelector + "-name").text(trackInformation.title);
                    $(trackSelector + "-artist").text("" + (trackInformation.artist ? "- " + trackInformation.artist : ''));
                    $("" + trackSelector).attr('title', "" + (trackInformation.artist ? trackInformation.artist + " - " : '') + trackInformation.title);
                    if (data.currentShow == null) {
                        return;
                    }
                    $(containerSelector + "__show-name").text(data.currentShow.title);
                    var $talent = $(containerSelector + "__talent");
                    if (!$talent.length) {
                        $talent = $('<img class="listen-live__talent" alt="">');
                        $(containerSelector + "__wrapper").prepend($talent);
                    }
                    $talent.attr({
                        src: data.currentShow.imageUrl,
                        alt: data.currentShow.title
                    });
                };
                return ListenLiveBar;
            }(ConfigurableComponent_10.ConfigurableComponent));
            exports_22("ListenLiveBar", ListenLiveBar);
        }
    }
});
System.register("components/PromoSlider", ["components/BaseComponent"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var BaseComponent_5;
    var PromoSlider;
    return {
        setters:[
            function (BaseComponent_5_1) {
                BaseComponent_5 = BaseComponent_5_1;
            }],
        execute: function() {
            PromoSlider = (function (_super) {
                __extends(PromoSlider, _super);
                function PromoSlider(selector) {
                    _super.call(this, selector);
                }
                PromoSlider.prototype.initialise = function () {
                    this.initialiseSwiper();
                };
                PromoSlider.prototype.initialiseSwiper = function () {
                    this.swiper = new Swiper(this.selector + " .swiper-container", {
                        speed: 400,
                        slidesPerView: 'auto',
                        preventClicks: false
                    });
                };
                return PromoSlider;
            }(BaseComponent_5.BaseComponent));
            exports_23("PromoSlider", PromoSlider);
        }
    }
});
System.register("services/GeoLocationService", ["components/ConfigurableComponent", "services/Environment"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var ConfigurableComponent_11, Environment_5;
    var GeoLocationService;
    return {
        setters:[
            function (ConfigurableComponent_11_1) {
                ConfigurableComponent_11 = ConfigurableComponent_11_1;
            },
            function (Environment_5_1) {
                Environment_5 = Environment_5_1;
            }],
        execute: function() {
            GeoLocationService = (function (_super) {
                __extends(GeoLocationService, _super);
                function GeoLocationService() {
                    _super.call(this, null, 'GeoLocationService');
                }
                GeoLocationService.prototype.initialise = function () {
                    var _this = this;
                    if (!Environment_5.environment.cookiesEnabled() || !this.options.geoLocationEnabled) {
                        return;
                    }
                    if (window.location.href.indexOf('?geoRedirect') >= 0) {
                        return;
                    }
                    this.getCurrentPosition().then(function (position) {
                        var station = _this.getNearestStation(position);
                        _this.redirectToStationUrl(station);
                    }, function (reason) {
                        console.error(reason);
                    });
                };
                GeoLocationService.prototype.getCurrentPosition = function () {
                    var promise = $.Deferred();
                    if ('geolocation' in navigator) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            promise.resolve(position);
                        }, function (error) {
                            promise.reject('Unable to retrieve GeoLocation. Error (#' + error.code + '): ' + error.message);
                        }, {
                            enableHighAccuracy: false
                        });
                    }
                    else {
                        promise.reject('GeoLocation service not available.');
                    }
                    return promise;
                };
                GeoLocationService.prototype.getNearestStation = function (position) {
                    var _this = this;
                    var currentPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    var stationDistances = this.options.stations.map(function (station) {
                        var coords = {
                            latitude: station.latitude,
                            longitude: station.longitude
                        };
                        station.distance = _this.computeGeometricDistance(currentPosition, coords);
                        return station;
                    }).sort(function (a, b) {
                        return (a.distance - b.distance);
                    });
                    return stationDistances[0].station;
                };
                GeoLocationService.prototype.computeGeometricDistance = function (pointA, pointB) {
                    var radius = 6371;
                    var dLatitude = this.convertDegreesToRadians(pointB.latitude - pointA.latitude);
                    var dLongitude = this.convertDegreesToRadians(pointB.longitude - pointA.longitude);
                    var latitudeA = this.convertDegreesToRadians(pointA.latitude);
                    var latitudeB = this.convertDegreesToRadians(pointB.latitude);
                    var area = (Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) + Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(latitudeA) * Math.cos(latitudeB));
                    var circumfrence = (2 * Math.atan2(Math.sqrt(area), Math.sqrt(1 - area)));
                    return radius * circumfrence;
                };
                GeoLocationService.prototype.convertDegreesToRadians = function (degree) {
                    return (degree * Math.PI / 180);
                };
                GeoLocationService.prototype.redirectToStationUrl = function (station) {
                    var url = window.location.href;
                    var host = '';
                    switch (station) {
                        case '2go':
                            host = 'www.2gofm.com.au';
                            break;
                        case '4to':
                            host = 'www.4tofm.com.au';
                            break;
                        case 'goldfm':
                            host = 'www.goldfm.com.au';
                            break;
                        case 'kofm':
                            host = 'www.kofm.com.au';
                            break;
                        case 'mix':
                            host = 'www.mix.com.au';
                            break;
                    }
                    if ('' === host) {
                        if ('/' === window.location.pathname) {
                            url += station + '/?geoRedirect=true';
                        }
                        else {
                            url += (window.location.href.indexOf('?') >= 0 ? '&' : '?') + 'station=' + station + '&geoRedirect=true';
                        }
                    }
                    else {
                        url = url.replace(window.location.host, host);
                        url += (url.indexOf('?') >= 0 ? '&' : '?') + 'geoRedirect=true';
                    }
                    window.location.href = url;
                };
                return GeoLocationService;
            }(ConfigurableComponent_11.ConfigurableComponent));
            exports_24("GeoLocationService", GeoLocationService);
        }
    }
});
System.register("components/GeoLocationNav", ["components/BaseComponent", "components/Modal"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var BaseComponent_6, Modal_2;
    var GeoLocationNav;
    return {
        setters:[
            function (BaseComponent_6_1) {
                BaseComponent_6 = BaseComponent_6_1;
            },
            function (Modal_2_1) {
                Modal_2 = Modal_2_1;
            }],
        execute: function() {
            GeoLocationNav = (function (_super) {
                __extends(GeoLocationNav, _super);
                function GeoLocationNav() {
                    _super.apply(this, arguments);
                }
                GeoLocationNav.prototype.initialise = function () {
                    if (window.location.href.indexOf('geoRedirect') < 0) {
                        return;
                    }
                    this.$body = $('body');
                    this.$geoLocation = $('.geo-location');
                    this.$header = $('.header');
                    this.offset = this.$geoLocation.find('.geo-location__wrapper').outerHeight();
                    this.showGeoLocationNav();
                };
                GeoLocationNav.prototype.showGeoLocationNav = function () {
                    var _this = this;
                    this.$body.css('padding-top', (this.offset + this.$header.outerHeight()));
                    this.$header.css('margin-top', this.offset);
                    this.$geoLocation.css('height', this.offset);
                    $('.geo-location__change-station', this.$el).on('click', function (e) {
                        e.preventDefault();
                        Modal_2.Modal.openModalWindow($('.modal-stations'));
                        $('.modal__close').addClass('modal__close--show');
                    });
                    $('.geo-location__close', this.$el).on('click', function (e) {
                        e.preventDefault();
                        _this.hideGeoLocationNav();
                    });
                    $(window).on('scroll.geoLocation', function () {
                        _this.handleScroll();
                    });
                    $(window).on('resize.geoLocaiton', function () {
                        _this.handleResize();
                    });
                };
                GeoLocationNav.prototype.hideGeoLocationNav = function () {
                    var _this = this;
                    var $headerAd = $('.sca-ad__container');
                    if ($headerAd.length && 'fixed' === $headerAd.css('position')) {
                        this.$geoLocation.slideUp('slow', function () {
                            _this.$body.css('padding-top', 0);
                            $headerAd.css('top', 0);
                            _this.$header.css({
                                'margin-top': '',
                                'top': $headerAd.outerHeight()
                            });
                        });
                    }
                    else {
                        this.$geoLocation.slideUp('slow', function () {
                            _this.$body.css('padding-top', 0);
                            _this.$header.css('margin-top', '');
                        });
                    }
                    $(window).unbind('scroll.geoLocation').unbind('resize.geoLocation');
                };
                GeoLocationNav.prototype.handleScroll = function () {
                    if ($(window).scrollTop() > this.offset) {
                        this.$header.css('margin-top', '');
                    }
                    else {
                        this.$header.css('margin-top', this.offset);
                    }
                };
                GeoLocationNav.prototype.handleResize = function () {
                    this.offset = this.$geoLocation.find('.geo-location__wrapper').outerHeight();
                    this.$header.css('margin-top', this.offset);
                    this.$geoLocation.css('height', this.offset);
                };
                return GeoLocationNav;
            }(BaseComponent_6.BaseComponent));
            exports_25("GeoLocationNav", GeoLocationNav);
        }
    }
});
System.register("components/CategoryHero", ["components/BaseComponent", "services/Environment"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var BaseComponent_7, Environment_6;
    var CategoryHero;
    return {
        setters:[
            function (BaseComponent_7_1) {
                BaseComponent_7 = BaseComponent_7_1;
            },
            function (Environment_6_1) {
                Environment_6 = Environment_6_1;
            }],
        execute: function() {
            CategoryHero = (function (_super) {
                __extends(CategoryHero, _super);
                function CategoryHero() {
                    _super.apply(this, arguments);
                }
                CategoryHero.prototype.initialise = function () {
                    var _this = this;
                    var lastScrollY = 0;
                    var imageBottom = 0;
                    $(window).on('scroll', function (e) {
                        if (!Environment_6.environment.isDesktop()) {
                            return;
                        }
                        var currentScrollY = $(window).scrollTop();
                        if (_this.isParralaxArea(currentScrollY)) {
                            imageBottom = _this.calculateImageBottom(currentScrollY, imageBottom, lastScrollY);
                            lastScrollY = currentScrollY;
                            if (currentScrollY === 0) {
                                imageBottom = 0;
                            }
                            _this.createParralaxEffect(imageBottom);
                        }
                    });
                    $(window).on('resize', function (e) {
                        _this.$el.removeAttr('style');
                    });
                };
                CategoryHero.prototype.calculateImageBottom = function (currentScrollY, imageBottom, lastScrollY) {
                    var scrollingStep = 5;
                    return imageBottom + ((lastScrollY < currentScrollY) ? -scrollingStep : scrollingStep);
                };
                CategoryHero.prototype.createParralaxEffect = function (imageBottom) {
                    var maxImageHeight = 250;
                    var headerImageHeight = maxImageHeight + imageBottom;
                    this.$el.find('.hero-block__background').css({ 'bottom': imageBottom });
                    this.$el.css({ 'height': (headerImageHeight > maxImageHeight) ? maxImageHeight : headerImageHeight });
                };
                CategoryHero.prototype.isParralaxArea = function (currentScrollY) {
                    return (currentScrollY < this.$el.height() + this.$el.offset().top);
                };
                return CategoryHero;
            }(BaseComponent_7.BaseComponent));
            exports_26("CategoryHero", CategoryHero);
        }
    }
});
System.register("components/VipRegistrationForm", [], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var VipRegistrationForm;
    return {
        setters:[],
        execute: function() {
            VipRegistrationForm = (function () {
                function VipRegistrationForm() {
                }
                VipRegistrationForm.prototype.initialise = function () {
                    this.initialiseForm();
                };
                VipRegistrationForm.prototype.initialiseForm = function () {
                    var name = this.getQueryString('name');
                    var email = this.getQueryString('email');
                    if (name) {
                        var firstNameInput = $('input[type="text"]', '.vip-registration__form').first();
                        $(firstNameInput).val(name);
                        $(firstNameInput).prop('readonly', true);
                    }
                    if (email) {
                        var emailInput = $('input[type="email"]', '.vip-registration__form').first();
                        emailInput.val(email);
                        emailInput.prop('readonly', true);
                    }
                };
                VipRegistrationForm.prototype.getQueryString = function (field) {
                    var href = window.location.href;
                    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
                    var queryString = reg.exec(href);
                    return queryString ? decodeURIComponent(queryString[1]) : null;
                };
                return VipRegistrationForm;
            }());
            exports_27("VipRegistrationForm", VipRegistrationForm);
        }
    }
});
System.register("app", ["services/ConfigService", "models/StationComponent", "components/Header", "components/SmartDate", "components/BrightcoveVideo", "components/ShowPageNav", "components/TextWrapper", "components/ShowInfo", "services/AdManager", "services/StorageService", "components/NewWindowLink", "components/Modal", "components/ChangeStation", "components/ListenLiveBar", "components/PromoSlider", "services/GeoLocationService", "components/GeoLocationNav", "components/CategoryHero", "components/VipRegistrationForm"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var ConfigService_3, StationComponent_1, Header_1, SmartDate_1, BrightcoveVideo_1, ShowPageNav_1, TextWrapper_1, ShowInfo_1, AdManager_1, StorageService_2, NewWindowLink_1, Modal_3, ChangeStation_1, ListenLiveBar_1, PromoSlider_1, GeoLocationService_1, GeoLocationNav_1, CategoryHero_1, VipRegistrationForm_1;
    var App;
    return {
        setters:[
            function (ConfigService_3_1) {
                ConfigService_3 = ConfigService_3_1;
            },
            function (StationComponent_1_1) {
                StationComponent_1 = StationComponent_1_1;
            },
            function (Header_1_1) {
                Header_1 = Header_1_1;
            },
            function (SmartDate_1_1) {
                SmartDate_1 = SmartDate_1_1;
            },
            function (BrightcoveVideo_1_1) {
                BrightcoveVideo_1 = BrightcoveVideo_1_1;
            },
            function (ShowPageNav_1_1) {
                ShowPageNav_1 = ShowPageNav_1_1;
            },
            function (TextWrapper_1_1) {
                TextWrapper_1 = TextWrapper_1_1;
            },
            function (ShowInfo_1_1) {
                ShowInfo_1 = ShowInfo_1_1;
            },
            function (AdManager_1_1) {
                AdManager_1 = AdManager_1_1;
            },
            function (StorageService_2_1) {
                StorageService_2 = StorageService_2_1;
            },
            function (NewWindowLink_1_1) {
                NewWindowLink_1 = NewWindowLink_1_1;
            },
            function (Modal_3_1) {
                Modal_3 = Modal_3_1;
            },
            function (ChangeStation_1_1) {
                ChangeStation_1 = ChangeStation_1_1;
            },
            function (ListenLiveBar_1_1) {
                ListenLiveBar_1 = ListenLiveBar_1_1;
            },
            function (PromoSlider_1_1) {
                PromoSlider_1 = PromoSlider_1_1;
            },
            function (GeoLocationService_1_1) {
                GeoLocationService_1 = GeoLocationService_1_1;
            },
            function (GeoLocationNav_1_1) {
                GeoLocationNav_1 = GeoLocationNav_1_1;
            },
            function (CategoryHero_1_1) {
                CategoryHero_1 = CategoryHero_1_1;
            },
            function (VipRegistrationForm_1_1) {
                VipRegistrationForm_1 = VipRegistrationForm_1_1;
            }],
        execute: function() {
            App = (function () {
                function App(config) {
                    this.initialise(config);
                }
                App.prototype.initialise = function (config) {
                    this.setConfiguration(config);
                    var storageService = new StorageService_2.StorageService();
                    storageService.setCurrentStation();
                    if ('' === storageService.getCurrentStation()) {
                        var geoLocationService = new GeoLocationService_1.GeoLocationService();
                        geoLocationService.initialise();
                    }
                    var components = this.getComponents();
                    components.forEach(function (stationComponent) {
                        try {
                            stationComponent.initialise();
                        }
                        catch (e) {
                            console && console.error("Unable to initialise component for " + stationComponent.selector + " - " + e);
                        }
                    });
                };
                App.prototype.setConfiguration = function (config) {
                    if (config == null) {
                        return;
                    }
                    config.forEach(function (cfg) {
                        ConfigService_3.configService.setConfig(cfg.name, cfg.config);
                    });
                };
                App.prototype.getComponents = function () {
                    return [
                        new StationComponent_1.StationComponent('body', AdManager_1.adManager),
                        new StationComponent_1.StationComponent('.smart-date', SmartDate_1.SmartDate),
                        new StationComponent_1.StationComponent('.article__video-player, .article__embed--brightcove', BrightcoveVideo_1.BrightcoveVideo),
                        new StationComponent_1.StationComponent('.header', Header_1.Header),
                        new StationComponent_1.StationComponent('.show__nav', ShowPageNav_1.ShowPageNav),
                        new StationComponent_1.StationComponent('.hero-block__name-text', TextWrapper_1.TextWrapper),
                        new StationComponent_1.StationComponent('.hero-block', ShowInfo_1.ShowInfo),
                        new StationComponent_1.StationComponent('.catchup-strip__popout--button, .hero-block__catchup-button, .catchup-block__button, .page-nav__link--schedule, .listen-live__link', NewWindowLink_1.NewWindowLink),
                        new StationComponent_1.StationComponent('.modal-stations', Modal_3.Modal),
                        new StationComponent_1.StationComponent('.header', ChangeStation_1.ChangeStation),
                        new StationComponent_1.StationComponent('.listen-live', ListenLiveBar_1.ListenLiveBar),
                        new StationComponent_1.StationComponent('.promoted', PromoSlider_1.PromoSlider),
                        new StationComponent_1.StationComponent('.geo-location', GeoLocationNav_1.GeoLocationNav),
                        new StationComponent_1.StationComponent('.category-page .hero-block', CategoryHero_1.CategoryHero),
                        new StationComponent_1.StationComponent('.vip-registration__form', VipRegistrationForm_1.VipRegistrationForm)
                    ];
                };
                return App;
            }());
            exports_28("App", App);
        }
    }
});
System.register("components/ListenLiveBarDeprecated", ["components/ConfigurableComponent", "services/SignalR", "services/Lightstreamer"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var ConfigurableComponent_12, SignalR_2, Lightstreamer_2;
    var ListenLiveBar;
    return {
        setters:[
            function (ConfigurableComponent_12_1) {
                ConfigurableComponent_12 = ConfigurableComponent_12_1;
            },
            function (SignalR_2_1) {
                SignalR_2 = SignalR_2_1;
            },
            function (Lightstreamer_2_1) {
                Lightstreamer_2 = Lightstreamer_2_1;
            }],
        execute: function() {
            ListenLiveBar = (function (_super) {
                __extends(ListenLiveBar, _super);
                function ListenLiveBar(selector) {
                    _super.call(this, selector, 'ListenLiveBar');
                }
                ListenLiveBar.prototype.initialise = function () {
                    if (this.initialiseSignaR()) {
                        return;
                    }
                    this.initialiseLightstreamer();
                };
                ListenLiveBar.prototype.initialiseSignaR = function () {
                    return new SignalR_2.SignalRService().initialise(this.udpateNowPlayingInformation);
                };
                ListenLiveBar.prototype.initialiseLightstreamer = function () {
                    var lightstreamerParams = {
                        adapterSet: this.options.lightstreamerAdapterSet,
                        fields: this.options.lightstreamerFields,
                        subscriberMethod: this.onLightstreamerUpdate
                    };
                    var lightstreamer = new Lightstreamer_2.LightstreamerService();
                    lightstreamer.initialise(lightstreamerParams);
                    this.pollForCurrentShow();
                };
                ListenLiveBar.prototype.udpateNowPlayingInformation = function (data) {
                    var trackInformation = {
                        title: data.currentTrack ? data.currentTrack.title : '',
                        artist: data.currentTrack ? data.currentTrack.artistName : ''
                    };
                    var trackSelector = '.listen-live__track';
                    $(trackSelector + "-name").text(trackInformation.title);
                    $(trackSelector + "-artist").text("" + (trackInformation.artist ? "- " + trackInformation.artist : ''));
                    $("" + trackSelector).attr('title', "" + (trackInformation.artist ? trackInformation.artist + " - " : '') + trackInformation.title);
                    if (data.currentShow != null) {
                        $(this.selector + "__show-name", this.$el).text(data.currentShow.title != null ? data.currentShow.title : '');
                        if (data.currentShow.imageUrl != null) {
                            this.setTalent(data.currentShow.imageUrl, data.currentShow.title);
                        }
                        else {
                            this.loggingService.warn('No image url supplied by API');
                        }
                    }
                };
                ListenLiveBar.prototype.onLightstreamerUpdate = function (trackInformation) {
                    var trackSelector = '.listen-live__track';
                    $(trackSelector + "-name").text(trackInformation.Title);
                    $(trackSelector + "-artist").text(" - " + trackInformation.Artist);
                    $("" + trackSelector).attr('title', trackInformation.Artist + " - " + trackInformation.Title);
                };
                ListenLiveBar.prototype.pollForCurrentShow = function () {
                    var settings = {
                        url: this.options.currentShowEndpoint
                    };
                    this.waitUpdateShowName(settings, 0);
                };
                ListenLiveBar.prototype.waitUpdateShowName = function (settings, timeout) {
                    var _this = this;
                    window.setTimeout(function () {
                        _this.requestCurrentShow(settings)
                            .then(function (data) {
                            _this.onCurrentShowRequested(data);
                            _this.waitUpdateShowName(settings, _this.options.currentShowPollFrequency * 1000);
                        });
                    }, timeout);
                };
                ListenLiveBar.prototype.requestCurrentShow = function (ajaxRequestSettings) {
                    var _this = this;
                    var promise = $.ajax(ajaxRequestSettings);
                    promise.fail(function () {
                        _this.loggingService.error('Unable to retrive current show data');
                    });
                    return promise;
                };
                ListenLiveBar.prototype.onCurrentShowRequested = function (data) {
                    if (data != null) {
                        $(this.selector + "__show-name", this.$el).text(data.title);
                        if (data.image.url != null) {
                            this.setTalent(data.image.url, data.title);
                        }
                        else {
                            this.loggingService.warn('No image url supplied by API');
                        }
                    }
                };
                ListenLiveBar.prototype.setTalent = function (imageUrl, title) {
                    var $talent = $(this.selector + "__talent", this.$el);
                    if (!$talent.length) {
                        $talent = $('<img class="listen-live__talent" alt="">');
                        $(this.selector).find('.listen-live__wrapper').prepend($talent);
                    }
                    $talent.attr({
                        src: imageUrl.replace('http://cdn.scahw.com.au', 'https://cdn-epi.scadigital.io'),
                        alt: title
                    });
                };
                return ListenLiveBar;
            }(ConfigurableComponent_12.ConfigurableComponent));
            exports_29("ListenLiveBar", ListenLiveBar);
        }
    }
});
System.register("services/VideoTracking", ["components/BaseComponent", "services/LoggingService"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var BaseComponent_8, LoggingService_2;
    var Tracking, GgComAdapter;
    return {
        setters:[
            function (BaseComponent_8_1) {
                BaseComponent_8 = BaseComponent_8_1;
            },
            function (LoggingService_2_1) {
                LoggingService_2 = LoggingService_2_1;
            }],
        execute: function() {
            Tracking = (function (_super) {
                __extends(Tracking, _super);
                function Tracking() {
                    _super.call(this, null);
                }
                Tracking.prototype.initialise = function (beacon, player, playerId, videoId, accountId, loggingEnabled) {
                    var adapter = new GgComAdapter(beacon, player, playerId, videoId, accountId, new LoggingService_2.LoggingService());
                    adapter.loggingEnabled = loggingEnabled;
                    this.bindEvents(player, adapter);
                };
                Tracking.prototype.bindEvents = function (player, GgComAdapter) {
                    player.on('loadstart', function () { return GgComAdapter.onInit(); });
                    player.on('ads-load', function () { return GgComAdapter.onPlayPreroll(); });
                    player.on('volumechange', function () { return GgComAdapter.onStatusChanged('volumechange'); });
                    player.on('play', function () { return GgComAdapter.onStatusChanged('start'); });
                    player.on('pause', function () { return GgComAdapter.onStatusChanged('pause'); });
                    player.on('ended', function () { return GgComAdapter.onStatusChanged('finish'); });
                    player.on('seeked', function () { return GgComAdapter.onStatusChanged('seeked'); });
                    player.on('timeupdate', function (e) { return GgComAdapter.onPlayContinued(e); });
                    player.on('loadeddata', function () { return GgComAdapter.updateVars(); });
                };
                return Tracking;
            }(BaseComponent_8.BaseComponent));
            exports_30("Tracking", Tracking);
            GgComAdapter = (function () {
                function GgComAdapter(gg, player, playerCode, videoId, accountId, loggingService) {
                    this.gg = gg;
                    this.player = player;
                    this.playerCode = playerCode;
                    this.videoId = videoId;
                    this.accountId = accountId;
                    this.loggingService = loggingService;
                    this.useSWF = false;
                    this.type = 'content';
                    this.content = 'content';
                    this.started = false;
                    this.previousState = '';
                    this.cur_position = 0;
                    this.prev_position = 0;
                    this.videoMetaData = {
                        'type': 'content',
                        'dataSrc': 'cms',
                        'length': '',
                        'title': '',
                        'program': 'myProgram',
                        'assetid': '',
                        'isfullepisode': 'N',
                        'hasAds': '1'
                    };
                    this.prerollMetaData = {
                        type: 'preroll',
                        assetId: 'assetId'
                    };
                    this.ie = navigator.userAgent.indexOf('MSIE') !== -1;
                }
                GgComAdapter.prototype.getUrl = function () {
                    return "https://players.brightcove.net/" + this.accountId + "/" + this.playerCode + "_default/index.html?videoId=" + this.uniqueID;
                };
                GgComAdapter.prototype.updateVars = function () {
                    this.cur_movie = this.getTitle('testTitle');
                    this.duration = this.getDuration();
                    this.cur_position = this.getCurrentPosition();
                    this.cur_mute = this.player.volume() === 0;
                    this.cur_volume = this.player.volume();
                    var id = this.videoId;
                    if (this.uniqueID !== id) {
                        this.started = false;
                        this.previousState = '';
                        this.uniqueID = id;
                    }
                    this.cur_movie_url = this.getUrl();
                };
                GgComAdapter.prototype.onPlayPreroll = function () {
                    this.updateVars();
                    this.logger('[Nielsen] Preroll start - Loaded preroll metadata');
                    this.gg.ggPM('loadMetadata', this.prerollMetaData);
                };
                GgComAdapter.prototype.onInit = function () {
                    this.videoMetaData.title = this.getTitle('');
                    this.videoMetaData.assetid = this.videoId;
                    this.videoMetaData.length = this.getDuration().toString();
                    this.logger('[Nielsen] Video loaded - Loaded video metadata');
                    this.gg.ggPM('loadMetadata', this.videoMetaData);
                    this.updateVars();
                };
                GgComAdapter.prototype.getTitle = function (defaultTitle) {
                    return this.player.player().mediainfo.name != null ? this.player.player().mediainfo.name : defaultTitle;
                };
                GgComAdapter.prototype.getCurrentPosition = function () {
                    var position = this.player.currentTime();
                    return position != null ? position.toFixed(0) : 0;
                };
                GgComAdapter.prototype.getDuration = function () {
                    var duration = this.player.player().mediainfo.duration;
                    return duration != null ? duration : 0;
                };
                GgComAdapter.prototype.onPlayContinued = function (event) {
                    this.cur_position = this.getCurrentPosition();
                    if (this.prev_position === this.cur_position) {
                        return;
                    }
                    else {
                        this.prev_position = this.cur_position;
                    }
                    this.logger("[Nielsen] Video starting - Sending playhead position " + this.getCurrentPosition());
                    this.gg.ggPM('play', this.getCurrentPosition());
                };
                GgComAdapter.prototype.onStatusChanged = function (movieStatus) {
                    switch (movieStatus) {
                        case 'start':
                            if ((!this.started && this.previousState === '') || (!this.started && this.duration > 0)) {
                                this.updateVars();
                                this.logger('[Nielsen] Video start - Loaded video metadata');
                                this.gg.ggPM('loadMetadata', this.videoMetaData);
                                this.started = true;
                                this.previousState = movieStatus;
                            }
                            else if (this.previousState === 'pause') {
                                this.cur_position = this.getCurrentPosition();
                                this.logger("[Nielsen] Video unpaused - Sending playhead position " + this.cur_position);
                                this.gg.ggPM('play', this.cur_position);
                                this.previousState = movieStatus;
                            }
                            return;
                        case 'pause':
                            if (this.previousState === 'start') {
                                this.cur_position = this.getCurrentPosition();
                                if (this.cur_position === this.duration)
                                    return;
                                this.logger("[Nielsen] Video paused - Sending playhead position " + this.cur_position);
                                this.gg.ggPM('stop', this.cur_position);
                                this.previousState = movieStatus;
                            }
                            return;
                        case 'finish':
                            this.logger("[Nielsen] Video Ended - Sending playhead position " + this.cur_position);
                            this.gg.ggPM('end', this.cur_position);
                            this.cur_position = 0;
                            this.started = false;
                            this.previousState = '';
                            return;
                    }
                };
                GgComAdapter.prototype.logger = function (logStr) {
                    try {
                        if (this.loggingEnabled && logStr != null) {
                            this.loggingService.log(logStr);
                        }
                    }
                    catch (e) {
                    }
                };
                return GgComAdapter;
            }());
        }
    }
});

//# sourceMappingURL=app.js.map
