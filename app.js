var listAPI = 'http://www.ndtv.com/apis/article/category-listing/client_key/apps-news-iphone7-8776f78f8257ac4ca91cafd5f805d582/?s=ndtv-khabar&pagesize=15&extra_params=category,place&format=json&site=classic&pwa=1&category=';
var detailAPI = 'http://www.ndtv.com/apis/article/detail/client_key/apps-news-iphone7-8776f78f8257ac4ca91cafd5f805d582/cms/1/category/khabar/format/json/native/1/type/pwa/pwa/1/id/';
var isStoryLoaded = false;
var __currentSlide = -1;
var storiesArr = {};
var __prevORnext = 'right';
var whatCachedName = 'whatCachedName';
var __browSupport = false;
var __listSlug = 'india-news';
var __curl = '';
var __debug = false;
var __storyCount = 15;
var __localCacheVersion = 'v5.0';
var prev ='',next = '';
var __busy = false;
var __autoLoadType = '';
var __storyHideHeight = 250;
var __scrollStryCnt = 0;
var __listingTemplate = '<li data-row="1" class="loading">\
                        <h2 style="display:inline-block; vertical-align: top;width:100%;" class="lContent" >\
                            <a data-link="link" data-val="" href="">\
                                <div data-title="title"><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div></div>\
                            </a>\
                        </h2>\
                        <a style="display:table-cell;" class="cimage loading" data-link="link" data-val="" href="">\
                            <img class="lazythumb" data-original="original" data-img="img" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">\
                        </a>\
                        <div class="clear"></div>\
                    </li>';

var __storyTemplate = '<div class="loading" style="margin-bottom:20px;margin-top:20px;" data-story="">\
                        <div data-nextstory="nextstory" style="display:none;font-size: 14px;color: #ff0000;text-align: center;background: #eaeaea;padding: 8px;margin-bottom: 10px;text-transform: uppercase;font-weight: bold;border-top:2px solid #ccc;">à¤…à¤—à¤²à¥€ à¤–à¤¬à¤°</div>\
                        <div data-nextstory="nextstory" style="display:none;">\
                            <div class="clear" style="text-align: center;width:100%;padding-bottom: 10px; display: table;">\
                                <div style="margin:0 auto;font-size:10px;color:#ccc;">\
                                    <div style="">-------Advertisement--------</div>\
                                    <div data-google-ad="google" style="text-align:center;"></div>\
                                </div>\
                            </div>\
                        </div>\
                        <div style="margin:10px 15px 5px 15px">\
                        <div class="breadcrumb"><a href="http://khabar.ndtv.com">à¤¹à¥‹à¤®</a>&nbsp;|&nbsp;<a data-breadcrumb="href" href="" data-breadcrumb-slug=""><span class="fill">&nbsp;</span></a></div>\
                        <div class="cStory">\
                            <h1 itemprop="headline" data-title="title"><div class="fill" style="width:100%;height:20px;">&nbsp;</div><div class="fill" style="width:75%;height:20px;">&nbsp;</div><div class="fill" style="width:50%;height:20px;">&nbsp;</div></h1>\
                            <div class="byline">\
                                <span itemprop="author" itemscope="" itemtype="https://schema.org/Person">\
                                <span itemprop="name" data-author="author"><span class="fill">&nbsp;</span></span>\
                                </span>, <time itemprop="dateModified" data-datemodified="datemodified" datetime=""><span class="fill">&nbsp;</span></time>\
                            </div>\
                            <div itemprop="image" itemscope="" itemtype="https://schema.org/ImageObject" class="story-pic row">\
                                <div class="mimg">\
                                    <img data-original="original" data-img="img" class="lazystory" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="" title="" border="0">\
                                </div>\
                                <p class="col-12 caption" data-caption="caption"></p>\
                            </div>\
                            <div class="share_bar">\
                                <ul class="list-inline social-share">\
                                    <li><a data-share-whatsapp="whatsapp" href="whatsapp://send?text=http://khabar.google.com" data-action="share/whatsapp/share"><i class="sprite whatsapp"></i></a></li>\
                                    <li><a target="_blank" data-share-tw="tw" href=""><i class="sprite twitter"></i></a></li>\
                                    <li><a target="_blank" data-share-fb="fb" href="javascript:void(0)"><i class="sprite facebook"></i></a></li>\
                                    <li><a target="_blank" data-share-rd="rd" href=""><i class="sprite reddit"></i></a></li>\
                                    <li><a data-share-email="email" href=""><i class="sprite email"></i></a></li>\
                                </ul>\
                            </div>\
                            <div class="storyContent" style="position:relative; clear:both;" itemprop="articleBody">\
                                <div class="storyhigh" style="display: none;" data-highlights="highlights">\
                                    <div class="head">à¤–à¤¾à¤¸ à¤¬à¤¾à¤¤à¥‡à¤‚</div>\
                                    <div class="colw">\
                                        <div class="col col1" >\
                                            <ul data-highlights-data="data">\
                                            </ul>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div data-story-container="container" itemprop="description" style="position:relative;">\
                                    <div data-story-detials="story"><div class="fill" style="width:100%;height:70px;">&nbsp;</div></div>\
                                    <div class="top10list_head" data-intro="intro" style="display:none;"></div>\
                                    <div data-description-more="more"></div>\
                                    <div class="stry_ldmore" onclick="__loadFullStory(this);">\
                                        <div class="stry_fdr"></div>\
                                        <div class="stry_shwmre">à¤†à¤—à¥‡ à¤ªà¤¢à¤¼à¥‡à¤‚</div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div style="text-align:center;">\
                                <a href="javascript:void(0);" data-comment-option="comment-option" data-comment-url="comment-url" data-comment-title="comment-title" data-comment-identifier="comment-identifier" onclick="javascript:showCommentForStory(this);" style="text-decoration:none;">\
                                    <div id="showcommentbutton">\
                                        <span style="color:#fff;" class="white ndtv-detailp-comments-count"> à¤Ÿà¤¿à¤ªà¥à¤ªà¤£à¥€</span>\
                                    </div>\
                                </a>\
                                <div class="comments" data-comment-block="comment-block" style="display: none;">\
                                    <div class="commenttab">\
                                        <div class="pcomment active fl" style="width: 100%;">à¤…à¤ªà¤¨à¥€ à¤Ÿà¤¿à¤ªà¥à¤ªà¤£à¥€ à¤ªà¥‹à¤¸à¥à¤Ÿ à¤•à¤°à¥‡à¤‚</div><div style="display: none;" class="ndtv-detailp-comments-count"></i></div>\
                                        <div class="clear"></div>\
                                    </div>\
                                    <div data-comment-container="comment-container"></div>\
                                </div>\
                            </div>\
                        </div>\
                        <div data-taboola="taboola" style="text-align:center;" class="tblacont"></div>\
                        <div data-crowdynews="crowdynews" style="text-align:center;" class="tblacont"></div>\
                        </div>\
                        <div class="clear"></div>\
                    </div>';
var __liveBlogTemplate = '<script type="text/javascript">document.domain = "ndtv.com";</script>\
                            <script language="JavaScript" type="text/javascript" src="/static/js/front/blog/globalvars.js"></script>\
                            <script language="JavaScript" type="text/javascript" src="//platform.twitter.com/widgets.js"></script>\
                            <link type="text/css" rel="stylesheet" href="/static/css/front/blog/blogviewiphone.css"/>\
                            <script language="JavaScript" type="text/javascript" src="/static/js/front/blog/blogviewcommon.js"></script>\
                            <style type="text/css">iframe{width:100% !important;}.wid622 .story img{max-width:100% !important;}</style>\
                            <div style="width:95%;margin:0 auto;">\
                                <div style="width:100%;">\
                                    <div><a href="#" id="lb_a_main_image" style="display:none"><img alt="" src="//drop.ndtv.com/liveblog/images/live_blog.png" border="0" id="lb_img_main_image"></a><a href="javascript:reload();" class="frt marl10"><img alt="" src="//drop.ndtv.com/liveblog/images/refresh_iphone.png" width="41" height="25" border="0" /></a><a href="#commentsDiv" class="frt mart10" id="postcomment"></a></div>\
                                    <div class="blog_cont">\
                                        <div id="titleDiv"></div>\
                                        <div id="bannerDiv"></div>\
                                        <div id="descriptionDiv"></div>\
                                        <div id="topFixedDiv"></div>\
                                        <div id="blogDiv"></div>\
                                        <div id="bottomFixedDiv"></div>\
                                        <div id="loadDiv" class="loadmore"></div>\
                                    </div>\
                                    <div class="bottomgap"></div>\
                                </div>\
                            </div><script language="javascript">init();</script>';


if (false) {
    if ('serviceWorker' in navigator) {
        __log('Service Worker is supported');
        navigator.serviceWorker.register('sw.js').then(function (reg) {
            __browSupport = true;
            __log(':)', reg);
        }).catch(function (error) {
            __log(':^(', error);
        });
    } else {
        __log('Service Worker is NOT supported');
    }
}

//Appp cache invalidate
window.addEventListener('load', function (e) {
    if (window.applicationCache) {
        window.applicationCache.addEventListener('updateready', function (e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                window.applicationCache.update();
                addCachedData('', 1);
                __log('CACHE cleared');
            } else {
                // Manifest didn't changed. Nothing new to server.
            }
        }, false);
    }
}, false);

//functions and definitions
var storyImageFunc = function (obj, src) {
    var downloadingImage = new Image();
    downloadingImage.onload = function () {
        obj.src = this.src;
    };
    downloadingImage.src = src;
};

$('ul.ddListing a.__l').click(function (e) {
    e.preventDefault();
    $('.ddToggle').removeClass('open');
    backToListing(true, false);
    getData($(this).attr('data-val'));
});

function registerListingClick() {
    $('a[data-link="link"]').unbind('click');
    $('a[data-link="link"]').click(function (e) {
        e.preventDefault();
        $('.ddToggle').removeClass('open');
        backToListing(false, false);
        $('#storyid').html(__storyTemplate);
        $('#storyid div.loading').addClass('story-'+$(this).attr('data-val'));
        getStoryData($(this).attr('data-val'));
    });
}

function menuItemSelected(slug) {
    $('.nav-item a').removeClass('selected');
    $('.nav-item a').each(function () {
        if ($(this).attr('data-val') == slug) {
            $(this).addClass('selected');

            //handling scrolling and keep content in middle
            var outerContent = $(this).parent().parent().parent();
            var innerContent = $(this).parent();
            var scrollTo = (innerContent.position().left + outerContent.scrollLeft()) > outerContent.width() / 2 ? (innerContent.position().left + outerContent.width() / 2 - innerContent.width() / 2) : 0;
            outerContent.scrollLeft(scrollTo);
            //handling scrolling and keep content in middle END
            return false;
        }
    });
}
// END

function getKeyFromObj(data) {
  for (var prop in data)
    return prop;
}

function getData(slug, options) {
    $('.nav-toggle').removeClass('open');
    slug = typeof(slug) == 'undefined'?__listSlug:slug;
    __prevORnext = 'right';
    options = options || {};
    var pullStoryid = options.hasOwnProperty('pullStoryid') ? options.pullStoryid : false;
    
    menuItemSelected(slug);
    var background = options.hasOwnProperty('background') ? options.background : 0;
    var page = options.hasOwnProperty('page') ? options.page : 1;
    var updateCache = true, updateUI = true, updateUIsilent = false;
    var template = options.hasOwnProperty('template') ? options.template : 'list';
    if(background){
        updateCache = false,updateUI = true,updateUIsilent = true;
    }
    updateUIsilent = options.hasOwnProperty('updateUIsilent') ? options.updateUIsilent : updateUIsilent;
    if(__listSlug !== slug){
        $('#listing-pagination').html('');
    }
    if (!updateUIsilent && template!=='menu-list') {
        $('#everythingelse').hide();
        //document.querySelector("[data-slug]").id = 'listing-' + slug;
        $('ul.listing[data-slug]').attr('id','listing-' + slug).attr('data-page',page).attr('data-slug',slug);
        if (template != 'listing-pagination') {
            $('.listTitle').html('<span style="background-color:#ccc">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
            window.scrollTo(0, 0);
            $('#listing-' + slug + ' li').addClass('loading');
            $('#listing-' + slug + ' div[data-title="title"]').html('<div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div>');
            $('#listing-' + slug + ' a[data-link="link"]').attr('href', '');
            $('#listing-' + slug + ' a.cimage').addClass('loading');            
            $('#listing-' + slug + ' div[data-stype="stype"]').html('&nbsp;');
            $('#listing-' + slug + ' img[data-img="img"]').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
            $('#listing-' + slug + ' img[data-img="img"]').attr('alt', '');
            $('#listing-' + slug + ' img[data-img="img"]').attr('title', '');
        }
        __autoLoadType = 'list';
        //UI
    }
    if(template!=='menu-list'){
        __listSlug = slug;
    }
    
    
    if (!__browSupport) {
        var params = {'slug': slug, 'updateCache': updateCache, 'updateUI':updateUI,'updateUIsilent':updateUIsilent, 'page':page,'template':template};
        if(pullStoryid){
            params.callback = __getData;
            params.callbackparams = {'slug': pullStoryid, 'updateCache': true, 'updateUI':true,'updateUIsilent':true, 'type': 'story', 'api': detailAPI, 'cacheKey': 'storyDetail'};
        }
        __getData(params);
        return false;
    }

    var networkDataReceived = false;
    startSpinner();

    // fetch fresh data
    var networkUpdate = fetch(listAPI + slug).then(function (response) {
        response.json().then(function (data) {
            updateListing(data, slug);
        });
    }).then(function (data) {
        networkDataReceived = true;
    });


    //fetch cached data
    caches.match(listAPI + slug).then(function (response) {
        if (!response)
            throw Error("No data");
        return response.json();
    }).then(function (data) {
        if (!networkDataReceived) {
            __log('CACHE data');
            updateListing(data, slug);
        }
    }).catch(function () {
        __log("NETWORK call");
        return networkUpdate;
    }).catch(showErrorMessage).then(stopSpinner);
    return false;
}

function getStoryData(id, options){
    options = options || [];
    var background = options.hasOwnProperty('background') ? options.background : false;
    var updateCache = options.hasOwnProperty('updateCache') ? options.updateCache : true;
    var template = options.hasOwnProperty('template') ? options.template : 'story';
    var updateUI = true,updateUIsilent = false;
    if(background){
        updateUI = false,updateUIsilent = true;
    }
    if (!updateUIsilent) {
        $('#everythingelse,.everythingelse').hide();
        if(template!='story-pagination'){
            window.scrollTo(0, 0);
        }
        __autoLoadType = 'story';
    }
    

    if (!__browSupport) {
        __getData({'slug': id, 'updateCache': updateCache, 'updateUI':updateUI,'updateUIsilent':updateUIsilent, 'type': 'story', 'api': detailAPI, 'cacheKey': 'storyDetail', 'template':template});
        return true;
    }
    var networkDataReceivedStory = false;
    startSpinner();

    // fetch fresh data
    var networkUpdateStory = fetch(detailAPI + id).then(function (response) {
        response.json().then(function (data) {
            if (updateUI) {
                updateStoryDetial(data, pushBack);
            }
        });
    }).then(function (data) {
        networkDataReceivedStory = true;
    });


    //fetch cached data
    caches.match(detailAPI + id).then(function (response) {
        if (!response)
            throw Error("No data");
        return response.json();
    }).then(function (data) {
        __log('CACHE data story');
        if (!networkDataReceivedStory && updateUI) {
            updateStoryDetial(data, pushBack);
        }
    }).catch(function () {
        __log("NETWORK call story");
        return networkUpdateStory;
    }).catch(showErrorMessage).then(stopSpinner);
}

function startSpinner() {
    $('#loading').show();
}

function stopSpinner() {
    $('#loading').hide();
}

function showErrorMessage() {
    __log('showErrorMessage');
}


function updateListing(data, options) {
    __currentSlide = -1;
    var slug = options.slug || '';
    __log('updateListing options:', options);
    if(options.template == 'menu-list'){
        $('#menu-' + slug +' li._d').each(function(i, elem) {
            if(i>data.results.length-1){return false;}
            $(this).find("a").attr('href', data.results[i].link).attr('data-val', data.results[i].id).html(decodeURIComponent(escape(data.results[i].title)));
        });
        registerListingClick();
        return true;
    }
    if (!$('#listing-' + slug)) {
        __log('element not found:'+'listing-' + slug);
        return true;
    }
    $('#listing-' + slug).attr('data-slug',slug);
    $('#listing-' + slug).attr('data-page',options.page);
    $('.listTitle').html(data.meta.category_title);
    if (!options.updateUIsilent && options.template != 'listing-pagination') {
        updatePageUrlTitle({url:'/news/' + slug + (options.page>1?'/page-'+options.page:''), title:data.meta.title + (options.page>1?' | Page '+options.page:''), template: options.template});
    }
    var listType = options.template == 'listing-pagination' ? '-pagination-' + options.page : '';
    if ($('#listing-' + slug + listType +' li').length<=0) {
        if($('#listing-' + slug + listType).length<=0){
            $('#listing-pagination').append('<ul class="listing __lslide" data-url="'+'/news/' + slug + (options.page>1?'/page-'+options.page:'')+'" data-title="'+data.meta.title + (options.page>1?' | Page '+options.page:'')+'" data-scrollStryCnt="'+options.page+'" id="listing-'+slug+listType+'"></ul>');
        }
        data.results = data.results?data.results:[];
        for (var i = 0; i < data.results.length; i++) {
            $('#listing-' + slug + listType).append(__listingTemplate);
        }
    }
    storiesArr = {};
    $('#listing-' + slug + listType +' li').each(function(i, elem) {
        if (i <= data.results.length - 1) {
            $(this).removeClass('loading');
            $(this).find("[data-title='title']").html(decodeURIComponent(escape(data.results[i].title)));
            $(this).find("[data-link='link']").attr('href', data.results[i].link);
            $(this).find("[data-link='link']").attr('data-val', data.results[i].id);
            $(this).find("[data-img='img']").attr('data-original', data.results[i].thumb_image);
            //storyImageFunc($(this).find("[data-img='img']")[0], data.results[i].thumb_image);
            getStoryData(data.results[i].id, {background:true, updateCache:false});

            next = 0 <= (i - 1) ? (i - 1) : (data.results.length - 1);
            prev = data.results.length > (i + 1) ? (i + 1) : 0;
            //__log('storiesArr: ', storiesArr);
            //__log('next:'+next+', prev:'+prev);
            //__log(data.results[i].id+'=='+next+'='+data.results[next].id +','+prev+'='+data.results[prev].id +'=='+x.length);
            storiesArr[data.results[i].id] = {'prev': data.results[prev].id, 'next': data.results[next].id};
            i++;
        }
    });
    $("img.lazythumb").lazyload({
        load : function(elements_left, settings) {
            $(this).parent().removeClass('loading');
        }
    });
    registerListingClick();
    if(options.ajax){
        __busy = false;
        $('#scroll-to-cont').hide();
        if(data.results.length<__storyCount){__autoLoadType = '';}
    }
}


function updateStoryDetial(data, options) {
    __log('updateStoryDetial options:', options);
    
    var temp = 'story-'+data.entry.id;
    
    $('#storyid div.'+temp).removeClass('loading');
    //$('#storyid div.'+temp).attr('data-url', data.entry.link).attr('data-title',data.entry.title);
    $('#storyid div.'+temp).find("[data-title]").html(data.entry.title).attr('data-url', data.entry.link).attr('data-title',data.entry.title).attr('data-id',data.entry.id).addClass('__sslide');
    $('#storyid div.'+temp).find("[data-author]").html(data.entry.by_line);
    $('#storyid div.'+temp).find("[data-breadcrumb]").attr('href','http://khabar.ndtv.com/news/' + data.entry.category).attr('data-breadcrumb-slug', data.entry.category).html(data.entry.category_title);
    $('#storyid div.'+temp).find("[data-breadcrumb-slug]").click(function(e){e.preventDefault();backToListing(true, false);getData(data.entry.category);});
    $('#storyid div.'+temp).find("[data-datemodified]").html('à¤…à¤‚à¤¤à¤¿à¤® à¤…à¤ªà¤¡à¥‡à¤Ÿ: '+data.entry.updatedAt);
    $('#storyid div.'+temp).find("[data-caption]").html(data.entry.image_caption);
    if(options.template == 'story-pagination'){
        $('#storyid div.'+temp).find("[data-img='img']").attr('src', data.entry.thumb_image).attr('data-original',data.entry.story_image).attr('content', data.entry.story_image).attr('alt', data.entry.title).attr('title', data.entry.title);
    }else{
        $('#storyid div.'+temp).find("[data-img='img']").attr('src', data.entry.story_image).attr('alt', data.entry.title).attr('title', data.entry.title).parent().addClass('loaded');
    }
    
    $('#storyid div.'+temp).find("[data-highlights]").hide();
    $('#storyid div.'+temp).find("[data-highlights-data]").html('');
    if (data.entry.highlights.length > 0) {
        $('#storyid div.'+temp).find("[data-highlights]").show();
        var cont = '';
        [].forEach.call(data.entry.highlights, function (elem) {
            cont += '<li>' + elem + '</li>';
        });
        $('#storyid div.'+temp).find("[data-highlights-data]").html(cont);
    }
    //share
    
    $('#storyid div.'+temp+' a[data-share-whatsapp="whatsapp"]').attr('href', 'whatsapp://send?text=' + data.entry.title + ' - NDTV  '+data.entry.link);
    $('#storyid div.'+temp+' a[data-share-tw="tw"]').attr('href', 'https://twitter.com/intent/tweet?url=' + data.entry.link + '&amp;text=' + data.entry.title + ' - NDTV');
    $('#storyid div.'+temp+' a[data-share-fb="fb"]').attr('href', 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURI(data.entry.link) + '&t=' + encodeURI(data.entry.title) + ' - NDTV');
    $('#storyid div.'+temp+' a[data-share-rd="rd"]').attr('href', 'http://reddit.com/submit?url=' + data.entry.link + '&amp;title=' + data.entry.title + ' - NDTV');
    $('#storyid div.'+temp+' a[data-share-email="email"]').attr('href','mailto:?Subject=' + data.entry.title + '&Body=' + data.entry.title + '%0D%0A' + data.entry.link + '%0D%0A---%0D%0AShared via NDTV %0D%0Ahttp://ndtv.com/ %0D%0A---');

    if( data.entry.category== 'blogview' ){
        var blogview_identity = data.entry.id;
        $('#storyid div.'+temp+' div[data-story-detials="story"]').html(__liveBlogTemplate);
    }else if ( data.entry.category== 'file-facts' || data.entry.template == 'cheat-sheet' || data.entry.category == 'who-said-what') {
        $('#storyid div.'+temp+' div[data-story-detials="story"]').html((data.entry.place?'<b>' + data.entry.place + ':</b> ':'') + data.entry.excerpt);
        $('#storyid div.'+temp+' div[data-description-more="more"]').html(data.entry.description);
        $('#storyid div.'+temp+' div[data-intro="intro"]').html(data.entry.custom_label).show();
    } else {
        //xDetail.querySelector("[data-story-detials]").innerHTML = '<b>' + data.entry.place + ':</b> ' + data.entry.description;
        $('#storyid div.'+temp+' div[data-description-more="more"]').html();
        $('#storyid div.'+temp+' div[data-story-detials="story"]').html((data.entry.place?'<b>' + data.entry.place + ':</b> ':'') + data.entry.description);
    }
    if($('#storyid div.'+temp+' div[data-story-container="container"]').height()>__storyHideHeight){
        $('#storyid div.'+temp+' div[data-story-container="container"]').css({'height' : __storyHideHeight+'px','overflow' : 'hidden'});
        $('#storyid div.'+temp+' div.stry_ldmore').show();
    }
    
    $('#storyid div.'+temp+' a[data-comment-option="comment-option"]').attr('data-comment-url',data.entry.link).attr('data-comment-title',data.entry.title).attr('data-comment-identifier',data.entry.identifier);
    $('#storyid').attr('data-next-story',storiesArr[data.entry.id]?storiesArr[data.entry.id].next:getKeyFromObj(storiesArr));
    
    if (!options.updateUIsilent) {
        if (options.template == 'story-pagination') {
            $('#storyid div.' + temp).find("[data-nextstory]").show();
            ++__scrollStryCnt;
        } else {
            __scrollStryCnt = 0;
            __curl = data.entry.link;
            updatePageUrlTitle({url: (data.entry.link).replace("http://khabar.ndtv.com", ""), title: data.entry.title, template: options.template, scrollStryCnt: __scrollStryCnt, id: data.entry.id});
        }
        $("img.lazystory").lazyload({load : function(elements_left, settings) {$(this).removeClass('lazystory');$(this).parent().addClass('loaded');}});
    }    
    //$('#storyid div.'+temp).attr('data-scrollStryCnt', __scrollStryCnt);
    $('#storyid div.'+temp).find("[data-title]").attr('data-scrollStryCnt', __scrollStryCnt);
    if(options.ajax){
        __busy = false;
    }
}

function backToListing(check, pushBack) {
    //__log(check+'=='+pushBack);
    if (pushBack) {
        return false;
    }
    if (check) {
        $('#storyid').hide();$('#listing').show();
        $('div[data-story-others="others"]').hide();
        $('#menuForListing').show();
        $('#menuForStory').hide();
        
    } else {
        $('#storyid').show();$('#listing').hide();
        $('#listing-pagination').html('');
        $('div[data-story-others="others"]').show();
        $('#menuForListing').hide();
        $('#menuForStory').show();
    }
}

function updatePageUrlTitle(options) {
    var template = options.hasOwnProperty('template') ? options.template : '';
    var scrollStryCnt = options.hasOwnProperty('scrollStryCnt') ? options.scrollStryCnt : 0;
    var storyId = options.hasOwnProperty('id') ? options.id : '';
    
    window.history.pushState(options.url, options.title, options.url);
    document.title = options.title;
    __log('title updated: ' + options.url);
    ga('send',{
        hitType: 'pageview',
        page: options.url + ((template == 'story-pagination' || template == 'listing-pagination') ? '#PWA'+scrollStryCnt : ''),
        location: 'http://khabar.ndtv.com' + options.url + ((template == 'story-pagination' || template == 'listing-pagination') ? '#PWA'+scrollStryCnt : '')
    });
    __log('GA refreshed: ' + options.url + ((template == 'story-pagination' || template == 'listing-pagination') ? '#PWA'+scrollStryCnt : ''));
    if(template == 'story' || template =='list'){
        $('.google-ad-header').dfp({
            dfpID:1068322
        });
        __log('Header Google AD refreshed: ' + options.url);
    }
    
    if((template == 'story-pagination' || template == 'story') && storyId!='' && scrollStryCnt!=0){
        platTaboola({container: $('#storyid div.story-' + storyId + ' div[data-taboola="taboola"]'), url: options.url});
        plotGoogleAD({container: $('#storyid div.story-' + storyId + ' div[data-google-ad="google"]')});
        if (scrollStryCnt != 0 && scrollStryCnt % 4 == 0) {
            plotCrowdynews({container: $('#storyid div.story-' + storyId + ' div[data-crowdynews="crowdynews"]')});
        }
    }
    (self.COMSCORE && COMSCORE.beacon({c1: "2", c2: " 9548033"}));
    __log('comScore Refreshed : ' + options.url);
}

function __log(msg, obj){
    if (!__debug){
        return false;
    }
    obj = typeof (obj) == 'undefined' ? false : obj;
    console.log(msg+ (obj?' : ' + JSON.stringify(obj):''));
}


////////////////////////////// FALL BACK

(function ($) {
    this.__getData = function (options) {

        var settings = $.extend({
            slug: '',
            api: listAPI,
            type: 'list',
            cacheKey: 'storyList',
            callback: '',
            callbackparams: '',
            updateCache:true,
            updateUI:true,
            updateUIsilent:false,
            template:'normal',
            page:1,
            ajax:false
        }, options);

        //__log('settings',settings);
        
        if (settings.updateUI) {
            startSpinner();
        }

        var cacheKey = __localCacheVersion + '-' + settings.cacheKey + '-' + settings.slug +  (settings.type == 'list' ? '-' + settings.page : '');
        var api = settings.api + settings.slug + (settings.type == 'list' ?'&page=' + settings.page:'');
        var cacheData = false;
        var data = amplify.store(cacheKey);
        if (data) {
            if(__debug){
                console.log('%c CACHE call for:' + settings.type +', '+ settings.slug + (settings.type == 'list' ?', page=' + settings.page:''), 'background: green; color: white')
            }
            cacheData = true;
            settings.ajax = settings.updateCache ? settings.ajax : true;
            if (settings.type == 'list' && settings.updateUI) {
                updateListing(data, settings);
            } else if (settings.type == 'story' && settings.updateUI) {
                updateStoryDetial(data, settings);
            }
            if (settings.callback && typeof (settings.callback) === "function") {
                settings.callback(settings.callbackparams);
            }
            if (settings.updateUI) {
                stopSpinner();
            }
        }
        
        if(!cacheData || settings.updateCache){
            if(__debug){
                console.log('%c NETWORK call for:' + settings.type +', '+ settings.slug + (settings.type == 'list' ?', page=' + settings.page:''), 'background: red; color: white')
            }
            $.ajax({'url': api, async : true, success: function (data) {
                var newSettings = $.extend(settings, {'updateUIsilent': (settings.updateUIsilent ? true : cacheData),'ajax': true});
                if (settings.type == 'list' && settings.updateUI) {
                    updateListing(data, newSettings);
                } else if (settings.type == 'story' && settings.updateUI) {
                    updateStoryDetial(data, newSettings);
                }
                amplify.store(cacheKey, data);
                addCachedData(cacheKey);

                if (!cacheData && settings.updateUI) {
                    stopSpinner();
                    if (settings.callback && typeof (settings.callback) === "function") {
                        settings.callback(settings.callbackparams);
                    }
                }
            }});
        }
    };
}(jQuery));

function addCachedData(key, clear) {
    var data = amplify.store('whatCachedName') || [];
    if (clear) {
        amplify.store('whatCachedName', null);
        $(data).each(function (index, value) {
            amplify.store(value, null);
        });
        return true;
    }
    if (data.indexOf(key) !== -1) {
        return true;
    }
    data.push(key);

    amplify.store('whatCachedName', data);
}
amplify.store.error = function () {
    console.log('%c cleared cache','background: blue; color: white');
    addCachedData('', 1);
    return true;
};
////////////////////////////// FALL BACK

//TABOOLA CODE -- GOOGLE DFP CODE

function platTaboolaMidWidget(options){
    if($(options.container).length<=0){ return false;}
    var t = (new Date()).getTime();
    window._taboola = window._taboola || [];
    var taboola_container_id = 'taboola-mobile-mid-article-' + t;
    $(options.container).after('<br/><div style="margin:1px;"><div id="'+taboola_container_id+'"></div></div>');
    _taboola.push({
        mode: 'alternating-thumbnails-a',
        container: taboola_container_id,
        placement: 'Mobile Mid Article Thumbnails',
        target_type: 'mix'
    });
    __log('Taboola MID Article');
}

function platTaboola(options) {
    if ($(options.container).length <= 0) {
        return false;
    }
    var t = (new Date()).getTime();
    window._taboola = window._taboola || [];
    _taboola.push({article: 'auto', url: options.url});
    var taboola_container_id2 = 'taboola-mobile-below-article-' + t;
    $(options.container).html('<div id="' + taboola_container_id2 + '"></div>');
    window._taboola = window._taboola || [];
    _taboola.push({
        mode: 'thumbs-mobile-2r',
        container: taboola_container_id2,
        placement: 'Mobile Below Article Thumbnails',
        target_type: 'mix'
    });
    __log('Taboola AFter Article:'+options.url);
    return true;
}

function platTaboolaOld(options){
    if($(options.container).length<=0){ return false;}
    var maxCharLength = 36;
    var api = 'http://api.taboola.com/1.1/json/ndtv-hindinewsapp/recommendations.get?rec.visible=false&app.type=mobile&app.apikey=cdc1d0df5ecef0be02ed3b14e936eadbc77ecc1e&source.type=text&rec.type=mix&rec.count=4&source.placement=Mid-Article-Thumbnails&user.session=init&source.id='+options.url+'&source.url='+options.url+'&rec.thumbnail.width=165&rec.thumbnail.height=115&user.agent='+navigator.userAgent+'&user.referrer='+options.url+'';
    $.ajax({'url': api, async : true, success: function (data) {
            var cont = '';
            $.each( data.list, function( k, v ) {
               cont+='<div style="width:50%;float:left;"><a target="_blank" href="'+v.url+'" style="text-decoration:none;"><div style="text-align:left;margin:5px;"><div><img style="max-width:100%;width:100%;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" class="lazytaboola" data-original="'+v.thumbnail[0].url+'" alt="" title=""></div><div style="height:40px;line-height:17px;color:#4C4C4C;font-size:14px;font-weight:bold;">'+(v.name.length>maxCharLength?v.name.substring(0,maxCharLength)+' ...':v.name)+'</div><div style="height:18px;line-height:18px;color:#606060;font-size:11px;font-weight:bold;">'+(v.branding.length>20?v.branding.substring(0,20)+' ...':v.branding)+'</div></div></a></div>';
            });
            if(cont!=''){
                cont = '<div style="width:100%;"><div style="margin:5px;"><div style="float:left;font-size: 17px;font-weight: bold;color:#575757;">From the Web</div><div style="float:right;font-size: 11px;color:#606060;">Promoted Links by Taboola</div></div></div><div style="clear:both"></div>'+cont+'<div style="clear:both;"></div>';
            }
            $(options.container).html(cont);
            $("img.lazytaboola").lazyload({
                load: function (elements_left, settings) {
                    $(this).parent().removeClass('loading');
                }
            });
            __log('Taboola refresh');
        }});    
}

function plotGoogleAD(options){
    if($(options.container).length<=0){ return false;}
    if ($(options.container).prev().hasClass("noRefresh"))  {return;} 
    var t = (new Date()).getTime();
    var type = options.hasOwnProperty('type') ? options.type : 'header';
    var adunit = type=='header'?'NDTV_Khabar_WAP_ROS_320x50_ATF':'NDTV_Khabar_WAP_ROS_300x250_BTF';
    var dimension = type=='header'?'320x50,300x250':'300x250';
    var network = 1068322;
    nextSlotId++
    $(options.container).html('<div class="adunit google-ad-'+t+'" data-adunit="'+adunit+'" data-dimensions="'+dimension+'"></div>');
    $('.google-ad-'+t).dfp({
        dfpID:network
    });
    $(options.container).prev().addClass("noRefresh");
    __log('Google AD refresh');
}
//TABOOLA CODE -- GOOGLE DFP CODE

//comments
function showCommentForStory(obj){
    var iframeid= $(obj).attr('data-comment-identifier')
    var api = 'http://social.ndtv.com/static/Comment/Widget/?&key=ndtv-khabar-bddaaca4a5b5c5205483&link='+encodeURI($(obj).attr('data-comment-url'))+'&title='+encodeURI($(obj).attr('data-comment-title'))+'&ctype=story&identifier='+encodeURI($(obj).attr('data-comment-identifier'))+'&enableCommentsSubscription=1&ver=1&reply=1&sorted_by=likes&iframeid='+iframeid;
    $(obj).parent().find('[data-comment-container="comment-container"]').html('à¤²à¥‹à¤¡ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ...');
    $(obj).hide();
    $(obj).parent().find('[data-comment-block="comment-block"]').show();
    $(obj).parent().find('[data-comment-container="comment-container"]').html('<iframe id="'+iframeid+'" src="'+api+'" width="100%" height="360px" scrolling="no" frameborder="0" allowtransparency="true" style="height: 379px;">à¤²à¥‹à¤¡ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ...</iframe>');
}
//crowdyWidget
function plotCrowdynews(options){
    if($(options.container).length<=0){ return false;}
    $(options.container).html('<div data-crowdynews-widget="NDTVKhabar_ndtvkhabar-horizontal"><script src="//widget.crowdynews.com/NDTVKhabar_ndtvkhabar-horizontal.js" async="true"></script></div>')
}

function __loadFullStory(obj) {
    $(obj).hide();
    $(obj).parent().css({'height': 'auto', 'overflow': 'none'});
    platTaboolaMidWidget({container:$(obj).parent().find('br:nth-child(6)')});
}
