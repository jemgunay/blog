var rootPath = "../../";

$(document).ready(function() {
	// main nav element click
	$('#main-navbar a').click(function(e) {
	    if (e.which != 1) return;
        e.preventDefault();

        // get target page
		var targetPage = stripSubFolder($(this).attr('href')).split('/')[0];
        // update banner indicator
        setBannerArrow(targetPage);
		var ajaxResult = performAjax(targetPage, { 'ajax':true });
		if (ajaxResult) {
            processNewPage(targetPage, ajaxResult);
            // push history state
            window.history.pushState($(this).attr('href'), null, $(this).attr('href'));
        }
	});

    // categories side nav element click
    $('#navmenu-side a').click(function(e) {
        if (e.which != 1) return;
        e.preventDefault();

        // get target page
        var targetPage = stripSubFolder($(this).attr('href')).split('/')[0];
        // update banner indicator
        setBannerArrow(targetPage);
        var ajaxResult = performAjax(stripSubFolder($(this).attr('href')), { 'ajax':true });
        if (ajaxResult) {
            processNewPage(targetPage, ajaxResult);
            // push history state
            window.history.pushState($(this).attr('href'), null, $(this).attr('href'));
        }
    });

	// process initially received page generated server side
    function processInitialPage(targetPage) {
        // update banner indicator
        setBannerArrow(targetPage);
        checkWindowWidth();
        processPage(targetPage);
        // push history state
        window.history.pushState(window.location.pathname, null, window.location.pathname);
    }

    // process page retrieved from ajax request
    function processNewPage(targetPage, htmlContent) {
        // scroll up to middle of banner
        var scrollTargetY = 347;
        if ($(window).scrollTop() > scrollTargetY) {
            $('body,html').animate({scrollTop: scrollTargetY}, 250);
        }

        // append content
        $("#main-content").animate({ opacity: 0 }, 75, function() {
            $('#main-content').empty().append(htmlContent);
            $("#main-content").animate({ opacity: 1 }, 75, function() {
                processPage(targetPage);
            });
        });
    }

    // page setup for static page load and ajax page load
    function processPage(targetPage) {
        // set title & show/hide categories nav menu
        setTitle(targetPage);
        setPageSpecificUI(targetPage);
    }

    // when back/forward button pressed, pop history state and load relevant page
    window.addEventListener('popstate', function(e) {
        if (e.state) {
            var urlPath = e.state;
            var targetPage = stripSubFolder(urlPath).split('/')[0];
            // update banner indicator
            setBannerArrow(targetPage);

            // get target page
            var ajaxResult = performAjax(stripSubFolder(urlPath), {'ajax': true});
            if (ajaxResult) {
                processNewPage(targetPage, ajaxResult);
            }
        }
    });

    // perform ajax
    function performAjax(path, data) {
        var result = false;
        $.ajax({
            type: "POST",
            url: rootPath + path,
            data: data,
            dataType: "text",
            async: false,
            success: function(e) {
                result = e;
            },
            error: function (e) {
                console.log(e);
            }
        });

        return result;
    }

    // set page/tab title
    function setTitle(title) {
        document.title = "Jem Gunay - " + title.charAt(0).toUpperCase() + title.slice(1);
    }

    //set UI aspects depending on current page
    function setPageSpecificUI(targetPage) {
        // hide side categories nav
        $('#navmenu-side').css('opacity', 0).hide();

        if (targetPage == "blog") {
            // on blog preview img hover, fade all but read more text
            $(".post-clickable").hover(function(e) {
                $(this).children(":not(.read-more-anchor, .read-more)").animate({ opacity: 0.7 }, 150);
            }, function() {
                $(this).children(":not(.read-more-anchor, .read-more)").animate({ opacity: 1 }, 150);
            });

            // post preview click
            $(document).off('click', '.post-clickable, .read-more-anchor');
            $(document).on('click', '.post-clickable, .read-more-anchor', function(e) {
                if (e.which != 1) return;
                e.preventDefault();
                e.stopPropagation();
                var targetUrl = $(this).attr('data-target');
                // get target page
                var targetPage = stripSubFolder(targetUrl).split('/')[0];
                var ajaxResult = performAjax(stripSubFolder(targetUrl), { 'ajax':true });
                if (ajaxResult) {
                    processNewPage(targetPage, ajaxResult);
                    // push history state
                    window.history.pushState(targetUrl, null, targetUrl);
                }
            });

            // categories nav visibility
            if ($('#navmenu-side').css('opacity') == 0) {
                $('#navmenu-side').show().animate({opacity: 1}, 150);
            }

            // show image enlarge modal on click
            $("#post-img-modal").modal("hide").off('click');
            $(document).on('click', '.img-modal', function(e) {
                $("#img-modal-body").empty().append('<img class="img-responsive" src="' + $(e.target).attr("src") + '">');
                $("#img-modal-body").append('<p class="modal-label"><strong>' + $(e.target).attr("alt") + '</strong></p>');
                $("#post-img-modal").modal("show");
            });
        }
        else {
            // categories nav visibility
            if ($('#navmenu-side').css('opacity') != 0) {
                $('#navmenu-side').animate({opacity: 0}, 150, function() {
                    $('#navmenu-side').hide();
                });
            }

            if (targetPage == "contact") {
                if (!captchaPreparing) {
                    captchaPreparing = true;
                    checkCaptchaReady();
                }
                initContactForm();
            }
        }
    }

    // strip subfolder from path
    function stripSubFolder(urlPath) {
        var targetPage = "projects";

        // determine target page from URL, removing and subfolders from path
        var mainPages = ['projects', 'blog', 'about', 'contact'];
        for (var i = 0; i < mainPages.length; i++) {
            if (urlPath.indexOf(mainPages[i]) != -1) {
                targetPage = urlPath.slice(urlPath.indexOf(mainPages[i]));
                break;
            }
        }
        return targetPage;
    }

    // close collapsed nav on option click
    $(document).click(function() {
        $('.navbar-collapse.in').collapse('hide');
    });

    // update UI based on screen width
    $(window).resize(function() {
        checkWindowWidth();
    });
    $(window).scroll(function() {
        checkWindowWidth();
    });
    function checkWindowWidth() {
        if ($(window).width() < 992) {
            $('#navmenu-top').off('affixed.bs.affix');
            $('#navmenu-top').off('affixed-top.bs.affix');
            // compensate when to show shadow based on whether navmenu-top is affixed to top of page
            if ($(window).width() > 520) {
                $('#navmenu-top').on('affixed.bs.affix', function(e) {
                    $(this).removeClass('nav-hide-shadow');
                    $(this).addClass('nav-show-shadow');
                });
                $('#navmenu-top').on('affixed-top.bs.affix', function(e) {
                    $(this).removeClass('nav-show-shadow');
                });
            }
            else {
                if (window.scrollY > 0) {
                    $('#navmenu-top').removeClass('nav-hide-shadow');
                    $('#navmenu-top').addClass('nav-show-shadow');
                }
                else {
                    $('#navmenu-top').removeClass('nav-show-shadow');
                    $('#navmenu-top').addClass('nav-hide-shadow');
                }
            }
        }
    }
    // fix glitch when resizing after uncollapsing top nav
    $('#main-navbar').on('hidden.bs.collapse', function() {
        $(this).attr('aria-expanded', true);
        $(this).attr('style', '');
    });
    //animate burger menu button
    $('#main-navbar').on('hide.bs.collapse show.bs.collapse', function() {
        $('#nav-animated-icon').toggleClass('open');
    });

    // init
    var initialPage = $('#initial-param').attr('data-page');
    processInitialPage(initialPage);
});

// captcha state vars
var captchaReady = false;
var captchaExists = false;
var captchaPreparing = false;
// callback for captcha api ready
var setCaptcha = function() {
    captchaReady = true;
};
// recursively check if api is ready
function checkCaptchaReady() {
    if (captchaReady) {
        loadCaptcha();
    } else {
        window.setTimeout(checkCaptchaReady, 100);
    }
}
// render captcha
function loadCaptcha() {
    if (captchaExists == true) {
        grecaptcha.reset();
        $('#g-recaptcha').html('');
    }

    captchaContainer = grecaptcha.render('g-recaptcha', {
        'sitekey' : '6LcmRCkTAAAAAD5GZIwhAWWdijwSVxQvx3eZWrv4'
    });

    captchaExists = true;
    captchaPreparing = false;
}

// google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-84475260-1', 'auto');
ga('send', 'pageview');
