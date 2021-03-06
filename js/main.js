// Gumby is ready to go
Gumby.ready(function() {
	Gumby.log('Gumby is ready to go...', Gumby.dump());

	// placeholder polyfil
	if(Gumby.isOldie || Gumby.$dom.find('html').hasClass('ie9')) {
		$('input, textarea').placeholder();
	}

	// skip link and toggle on one element
	// when the skip link completes, trigger the switch
	$('#skip-switch').on('gumby.onComplete', function() {
		$(this).trigger('gumby.trigger');
	});
	
	var $window = $(window),
	$lastContent = $("#docs-content > div:last-child"),
	sideBarHeight = $("#sidebar-nav-holder").height();
	if ($lastContent.height() < sideBarHeight) {
		$lastContent.css("height", sideBarHeight)
	}
	if ($window.width() > 767) {
		var scrollTop = $window.scrollTop(),
		url = window.location.href,
		hash = window.location.hash,
		historySupport = !!history.pushState,
		$targets = $("#docs-content [data-target]"),
		$sidebarNav = $("#sidebar-nav li"),
		length = $targets.length,
		delay = 0,
		currentNav = "";
		$(window).load(function () {
			$targets.each(function () {
				var $this = $(this);
				$this.data("offset", $this.offset().top)
			})
		});
		if (!hash && url.substr(url.length - 1, url.length) !== "/") {
			window.location.href = window.location.href + "/"
		}
		if (hash.length > 3) {
			var type = hash.substr(3, hash.length - 3);
			$window.load(function () {
				setTimeout(function () {
					$('#sidebar-nav .skip[href="#' + type + '"]').trigger("gumby.skip")
				}, 100)
			})
		}
		$("#sidebar-nav .skip").on("gumby.onComplete", function () {
			var href = $(this).attr("href");
			currentNav = href;
			window.location.hash = "#!/" + href.substr(1, href.length - 1)
		});
		$window.on("popstate", function (e, another) {
			var hash = window.location.hash;
			if (!hash) {
				return false
			}
			hash = hash.replace("!/", "");
			var $link = $('.skip[href="' + hash + '"]');
			if (currentNav && currentNav !== hash && hash.length > 2 && $link.length) {
				$link.trigger("gumby.skip")
			}
		}).scroll(function () {
			clearTimeout(delay);
			delay = setTimeout(function () {
					var scrollOffset = $window.scrollTop(),
					i = 0,
					distance = 0,
					$closest;
					if (!scrollOffset) {
						window.location.hash = "#!/";
						clearTimeout(delay);
						$sidebarNav.removeClass("active");
						$sidebarNav.first().addClass("active");
						return;
					}
					for (i; i < length; i++) {
						var $target = $($targets[i]),
						targetOffset = $target.data("offset");
						if (!distance || targetOffset - scrollOffset < 20 && targetOffset > distance) {
							distance = targetOffset;
							$closest = $target
						}
					}
					var $activeLink = $("#sidebar-nav .skip[gumby-goto=\"[data-target='" + $closest.attr("data-target") + "']\"]");
					$sidebarNav.removeClass("active");
					$activeLink.parent().addClass("active");
					var href = $activeLink.attr("href");
					currentNav = href;
					window.location.hash = "#!/" + href.substr(1, href.length - 1)
				}, 100)
		});
		$("#sidebar-nav-holder.vertical-nav").on("gumby.onFixed", function () {
			var $this = $(this),
			vnwidth = $this.parent(".columns").width(),
			html = '<li>							<a href="#" class="skip" gumby-goto="top" gumby-duration="600">								<i class="icon icon-up-open"></i> Back to top							</a>						</li>';
			if (!$this.find("ul li:first-child a i").length) {
				$this.find("ul").prepend(html)
			}
			Gumby.initialize("skiplink")
		}).on("gumby.onUnfixed", function () {
			$(this).find("ul li:first-child").remove()
		})
	}

// Oldie document loaded
}).oldie(function() {
	Gumby.warn("This is an oldie browser...");

// Touch devices loaded
}).touch(function() {
	Gumby.log("This is a touch enabled device...");
});
