;
"use strict";

function DOMready() {

	//
	// page scroll
	//

	addSrollClass();

	var $activeSection = $('.h-section').eq(0);
	var $scrollable = $activeSection.find('.scrollable');
	var isSlideChanging = false;
	var isSlideCanChange;
	var scrollDirection;

	calcLeftBorder($activeSection);

	$(document).ready(function () {
		$('#sections-container').fullpage({
			licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
			autoScrolling: true,
			navigation: true,
			normalScrollElements: '.scrollable, .about-abilities__list-c.scroll-content.scroll-scrolly_visible, .scroll-wrapper.about-abilities__list-c.about-abilities__list-c_shadow',
			responsiveWidth: 1365,

			onLeave: function (origin, destination, direction) {
				var $activeTab = $('.h-section').eq(destination.index);

				if ( window.matchMedia("(min-width : 768px)").matches ){
					changeActiveUIColors($activeTab);
					changeCurrentClass($activeTab);
				}

				isSlideChanging = true;
				$scrollable = $activeTab.find('.scrollable');
			},

			afterLoad: function (origin, destination, direction) {
				var $activeTab = $('.h-section.active');
				
				if (window.matchMedia("(min-width : 1366px)").matches) {
					cardAlignment();
				}

				if ( window.matchMedia("(min-width : 768px)").matches ){
					calcLeftBorder($activeTab);
					changeActiveUIColors($activeTab);
					changeCurrentClass($activeTab);
				}

				addSrollClass();
				isSlideChanging = false;
			}
		});

		var scrollNavHeight = $('#fp-nav').height();
		var $fakeScrollNav = $('.fake-nav__in');

		if (scrollNavHeight){ 
			$fakeScrollNav.height(scrollNavHeight).addClass('active');
		};
	});

	$(window).on('resize', function () {
		var $activeTab = ($('.h-section.active').length) ? $('.h-section.active') : $('.h-section').eq(0);

		calcLeftBorder($activeTab);
	});

	// change UI colors only on mobile free scroll
	if (window.matchMedia("(max-width : 767px)").matches) {
		var $sections = $('#sections-container .h-section');

		$(window).on('scroll', function () {
			var cur_pos = $(this).scrollTop();

			$sections.each(function () {
				var $this = $(this);
				var headerH = 60;
				var top = $this.offset().top - headerH;
				var bottom = top + $this.outerHeight();

				if (cur_pos >= top && cur_pos <= bottom) {
					changeActiveUIColors($this);
					changeCurrentClass($this);
					return false;
				}
			});
		});
	}

	function changeActiveUIColors($activeTab) {
		var $container = $('.sections-structure');
		var $tab = $activeTab;
		var $nav = $('#fp-nav');

		var uiColor = $tab.data('ui-color');
		var navColor = $tab.data('nav-color')

		$container.removeClass('sections-structure_ui-white sections-structure_ui-gray').addClass('sections-structure_ui-' + uiColor);

		$nav.removeClass('onepage-pagination_white onepage-pagination_blue').addClass('onepage-pagination_' + navColor);
	};

	function calcLeftBorder($activeTab) {
		var $tab = $activeTab;
		
		var $borderTop = $('.sections-structure__left-border-top');
		var $borderMid = $('.sections-structure__left-border-mid');
		var margin = 10;

		var $spacer = $tab.find('.js--calc-height-for-border');
		var spacerH = $spacer.height();
		var spacerOffset = $spacer.offset().top;

		var $header = $('.header');
		var headerH = $header.outerHeight(true);
		var headerOffset = $header.offset().top;

		var addBotMargin = $spacer.hasClass('js--has-desc');
		var topResult = spacerOffset - headerOffset - headerH - margin;
		var midResult = spacerH;

		$borderTop.height(topResult);
		$borderMid.height(midResult);

		(addBotMargin) ? $borderMid.addClass('sections-structure__left-border-mid_added-margin'): $borderMid.removeClass('sections-structure__left-border-mid_added-margin');
	};

	function changeCurrentClass($activeTab) {
		var $structure = $('.sections-structure');
		var $tab = $activeTab;
		var $tabID = $tab.data('id');

		$structure.attr('data-current', $tabID);
	};

	//
	// scroll directions with change slides
	//

	var ts;

	$(window).on('mousewheel', function (e) {
		isSlideCanChange = true;

		if (e.originalEvent.wheelDelta > 0) {
			scrollDirection = 'up';
		} else {
			scrollDirection = 'down';
		}

		if (!isSlideChanging){
		    changeSlidesWithScrolls($scrollable);
		}
	});

	$(document).bind('touchstart', function (e) {
		ts = e.originalEvent.touches[0].clientY;
	});

	$(document).bind('touchend', function (e) {
		var te = e.originalEvent.changedTouches[0].clientY;

		if (ts > te + 5) {
			isSlideCanChange = true;
			scrollDirection = 'down';
		} else if (ts < te - 5) {
			isSlideCanChange = true;
			scrollDirection = 'up';
		} else {
			scrollDirection = 'static';
		}

		if (!isSlideChanging){
		    changeSlidesWithScrolls($scrollable);
		}
	});

	$(window).on('resize', function () {
		addSrollClass();
	});

	$('.scrollable').on('scroll', function(e){
		var $this = $(this);
		var height = $this.outerHeight();
		var scrollTop = $this.scrollTop();
		var scrollHeight = this.scrollHeight;

		var canScrollDown = scrollTop == (scrollHeight - height);
		var canScrollUp = scrollTop == 0;

		$this.data('can-scroll-down', false);
		$this.data('can-scroll-up', false);

		clearTimeout($this.data('timer'));

		$this.data('timer', setTimeout(function(){
			if (canScrollDown) {
				$this.data('can-scroll-down', true);			
			} else if (canScrollUp) {
				$this.data('can-scroll-up', true);
			}

		}, 400));
	});

	//prevent slide scrolling on scrollables divs
	$(document).on('mouseenter', '.scrollable, .about-abilities__list-c.scroll-content.scroll-scrolly_visible, .scroll-wrapper.about-abilities__list-c.about-abilities__list-c_shadow', function(e) {
		fullpage_api.setAllowScrolling(false);
	});

	$(document).on('mouseleave', '.scrollable, .about-abilities__list-c.scroll-content.scroll-scrolly_visible, .scroll-wrapper.about-abilities__list-c.about-abilities__list-c_shadow', function(e) {
		fullpage_api.setAllowScrolling(true);
	});

	//change scide after scroll scrollable elems
	function changeSlidesWithScrolls($scrollable) {
		if (!$scrollable.length || !isSlideCanChange || window.matchMedia("(max-width : 767px)").matches) return;

		var height = $scrollable.outerHeight();
		var scrollTop = $scrollable.scrollTop();
		var scrollHeight = $scrollable[0].scrollHeight;

		var canScrollDown = $scrollable.data('can-scroll-down');
		var canScrollUp = $scrollable.data('can-scroll-up');

		if (height == scrollHeight) return;

		$scrollable.data('scroll-top', scrollTop);

		if (scrollDirection == 'down' && canScrollDown) {
			fullpage_api.moveSectionDown();
		} else if (scrollDirection == 'up' && canScrollUp) {
			fullpage_api.moveSectionUp();
		}
	};

	//calculate height and add scrollable class if needed
	function addSrollClass() {
		$('[data-scrollable]').each(function (e) {
			var $this = $(this);
	
			if (window.matchMedia("(min-width : 1366px)").matches && $this.data('scroll-mobile-only')) {
				return
			}
			
			var height = $this.height();
			var scrollHeight = this.scrollHeight;

			var $row = $this.find('.row-wrap');
			var rowMB = parseInt($row.css('margin-bottom'));
			var resultScroll;

			if (!$this.hasClass('scrollable')){
				$this.data('scroll-top', $this.scrollTop());
				$this.data('can-scroll-up', true);
				$this.data('can-scroll-down', false);
				$this.data('timer', false);
			}

			if ($row.length) {
				resultScroll = scrollHeight + rowMB;
			} else {
				resultScroll = scrollHeight;
			}

			if (height == resultScroll) {
				$this.removeClass('scrollable');
			} else {
				$this.addClass('scrollable');
			}
		});
	}

	//
	// page scroll... end;
	// 

	//
	// custom dropdowns by id
	//

	var $customDrops = $('.js--custom-dropdown');
	var $customDropsBtns = $('.js--custom-dropdown-toggler');

	$('body').on('click', '.js--custom-dropdown-toggler', function (e) {
		e.preventDefault();
		var $this = $(this);
		var $dropIn = $this.find('.js--custom-dropdown');
		var $target = ($dropIn.length) ? $dropIn : $('#' + $this.data('target'));

		$customDrops.not($target).removeClass('active');
		$customDropsBtns.not($this).removeClass('active');
		$this.toggleClass('active');
		$target.toggleClass('active');
	});

	$(document).on('click', function (e) {
		if (!$customDrops.is(e.target) && $customDrops.has(e.target).length === 0 && !$customDropsBtns.is(e.target) && $customDropsBtns.has(e.target).length === 0) {
			$customDrops.removeClass('active');
			$customDropsBtns.removeClass('active');
		}
	});

	//
	// custom dropdowns by id ... end;
	//

	//
	// sliders
	//

	// team slider
	var teamSliderSettings = {
		dots: false,
		arrows: false,
		infinite: false,
		speed: 300,
		slidesToShow: 2,
		slidesToScroll: 2,
		centerMode: false,
		responsive: [,
			{
				breakpoint: 1366,
				settings: "unslick"
			}
		]
	};

	$('.team-slider').slick(teamSliderSettings);

	$(window).on('resize', function () {
		if (window.matchMedia("(max-width : 767px)").matches && !$('.team-slider').hasClass('slick-initialized')) {
			$('.team-slider').slick(teamSliderSettings);
		}
	});

	$('body').on('click', '.js--team-toggler', function () {
		$('.js--team-toggler').removeClass('active-item');
		$(this).addClass('active-item');
	});

	$('.team-slider').on('afterChange', function (slick, currentSlide) {

		if (!$('.js--team-toggler.slick-active').eq(0).hasClass('active-item')) {
			$('.js--team-toggler').removeClass('active-item');
			$('.js--team-toggler.slick-active').eq(0).addClass('active-item');
		}

	});

	// services slider
	$('.services-slider').on('init', function (slick) {
		var idx = $('.slick-slider .services__item.slick-current').index();

		doBigClasesToSlides(idx);
	});

	$('.services-slider').slick({
		dots: true,
		arrows: false,
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 1,
		centerMode: true,
		touchThreshold: 100,
		responsive: [{
			breakpoint: 767,
			settings: {
				slidesToShow: 1
			}
		}]
	});

	$('.services-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
		var idx = $(slick.$slides[nextSlide]).index();

		doBigClasesToSlides(idx);
	});

	function doBigClasesToSlides(idx) {
		var indxLowLeft = $('.slick-slider .services__item').eq(idx - 2).data('index');
		var indxLowRight = $('.slick-slider .services__item').eq(idx + 2).data('index');
		var indxMedLeft = $('.slick-slider .services__item').eq(idx - 1).data('index');
		var indxMedRight = $('.slick-slider .services__item').eq(idx + 1).data('index');
		var indxCenter = $('.slick-slider .services__item').eq(idx).data('index');

		$('.services__item').removeClass('big medium low low-l low-r medium-l medium-r');
		$('.services__item[data-index=' + indxLowLeft + ']').addClass('low low-l');
		$('.services__item[data-index=' + indxLowRight + ']').addClass('low low-r');
		$('.services__item[data-index=' + indxMedLeft + ']').addClass('medium medium-l');
		$('.services__item[data-index=' + indxMedRight + ']').addClass('medium medium-r');
		$('.services__item[data-index=' + indxCenter + ']').addClass('big');
	}

	//
	// sliders ... end;
	//

	//
	// custom select
	//

	$('body').on('click', '.js--fake-select-val', function (e) {
		e.preventDefault();

		var $this = $(this);
		var $fakeSelectBox = $this.closest('.fake-select');
		var $list = $this.closest('.fake-select__options-list');
		var syncTarget = $list.data('synchwith');
		var $select = $('[data-synchronizedas=' + syncTarget + ']');
		var $current = $fakeSelectBox.find('.fake-select__current');
		var value = $this.text();
		var indexOfVal = $this.parent().index();

		$list.find('.js--fake-select-val').removeClass('active');
		$this.addClass('active');
		$current.html(value).addClass('active');

		$select[0].selectedIndex = indexOfVal;
		$select.trigger('change');
	});

	//
	// custom select ... end;
	//

	//
	// inputs clear btn
	//

	$('.h-form__input').on('keyup change', function () {
		var $this = $(this);

		($this.val().length) ? $this.addClass('has-value'): $this.removeClass('has-value');
	});

	$('body').on('click', '.js--clear-input-btn', function (e) {
		e.preventDefault();

		var $this = $(this);
		var $input = $this.siblings('input');

		$input.val('').trigger('change');
	});

	//
	// inputs clear btn ...end;
	//

	//
	// menu
	//

	var $menuToggler = $('.js--menu-toggler');
	var $menu = $('.xs-menu');
	var $structure = $('.sections-structure');
	var $body = $('body');
	var htmlScroll;
	var scrollMargin;

	$body.on('click', '.js--menu-toggler', function (e) {
		var isMenuOpened = $structure.hasClass('menu-is-opened');

		toggleXsMenu(isMenuOpened);
	});

	function toggleXsMenu(isOpened) {
		if (isOpened){
			$body.removeClass('body-overflow').css('top', 0);

			if ( scrollMargin ) {
				document.scrollingElement.scrollTop = htmlScroll;
				scrollMargin = 0;
			}
		} else {
			htmlScroll = getBodyScrollTop();
			scrollMargin = '-' + htmlScroll + 'px';

			$body.addClass('body-overflow').css('top', scrollMargin);
		}

		$menuToggler.toggleClass('active');
		$menu.toggleClass('active');
		$structure.toggleClass('menu-is-opened');
		$.fn.fullpage.setMouseWheelScrolling(isOpened);
		$.fn.fullpage.setAllowScrolling(isOpened);
	};

	function getBodyScrollTop () { 
		var el = document.scrollingElement || document.documentElement;
		return el.scrollTop
	};

	//
	// menu ... end;
	//

	//
	// text dots
	//

	var truncate = function (el) {
		var text = el.text(),
			height = el.height(),
			clone = el.clone();

		clone.css({
			position: 'absolute',
			visibility: 'hidden',
			height: 'auto',
			maxHeight: '9999px',
			width: el.outerWidth()
		});
		el.after(clone);

		var l = text.length - 1;
		for (; l >= 0 && clone.height() > height; --l) {
			clone.text(text.substring(0, l) + '...');
		}

		el.text(clone.text());
		clone.remove();
	};

	$.fn.truncateText = function () {
		return this.each(function () {
			truncate($(this));
		});
	};

	$(window).on('load', function () {
		if ($('.js--dotdotdot-text').length) {
			$('.js--dotdotdot-text').truncateText();
		}
	});

	//
	// text dots .. end;
	//

	//
	// menu tabs
	//

	$('body').on('click', '.js--xs-menu-tab-toggler', function (e) {
		e.preventDefault();

		var $this = $(this);
		var $xsMenuTabs = $('.xs-menu__tab');
		var $xsMenuTabTogglers = $('.js--xs-menu-tab-toggler');
		var target = $this.data('target');

		changeTabs($xsMenuTabTogglers, $this, target, $xsMenuTabs);
	});

	function changeTabs($allBtns, $initiator, targetID, $allTabs) {
		$allBtns.removeClass('active');
		$allTabs.removeClass('active');

		$initiator.addClass('active');
		$(targetID).addClass('active');
	};

	//
	// menu tabs ... end;
	// 

	//
	// custom scrollbar
	//
	
	if (window.matchMedia("(min-width : 1366px)").matches) {
		$('.video-block__list-c').scrollbar({
			onScroll: function() {
				var $this = this.container;
				var w = Math.round($this.width());
				var sw = $this[0].scrollWidth;
				var $parent = $this.parent();
	
				(sw - w <= $this[0].scrollLeft) ? $parent.removeClass('video-block__list-c_shadow') : $parent.addClass('video-block__list-c_shadow');
			}
		});

		$('.about-abilities__list-c').scrollbar({
			onInit : function() {
				$('.about-abilities__list-c.scroll-content.scroll-scrolly_visible').parent().addClass('about-abilities__list-c_shadow');
			},
	
			onUpdate : function() {
				$('.about-abilities__list-c.scroll-content.scroll-scrolly_visible').parent().addClass('about-abilities__list-c_shadow');
			}
		});
	}	

	// if (window.matchMedia("(max-width : 1365px)").matches) {
	// 	$('.h-section-about__col-r').scrollbar({
	// 		onInit : function() {
	// 			var $this = this.container;
	// 			var $parent = $this.parent();

	// 			if ($this.hasClass('scrollable')){
	// 				$parent.removeClass('scrollable');
	// 			};
	// 		}
	// 	});
	// }

	//
	// custom scrollbar ... end;
	//

	//
	// video toggler
	//

	$('body').on('click', '.js--video-toggler', function(){
		var $this = $(this);
		var $videoCont = $('.video-block__list-c');

		$this.toggleClass('active');
		$videoCont.toggleClass('active');
	});

	//
	// video toggler ... end;
	//

	//
	// hide arrow-down icon if scroll elems
	//

	var $scrollElmsToHideArrow = $('[data-hide-arrow-if-scroll]');
	var $arrowDownIco = $('.sections-structure__scroll-ico-c');

	$scrollElmsToHideArrow.on('scroll', function () {
		$arrowDownIco.hide();
	});

	$(document).on('scroll', function(e) {
		var $arrow = $('[data-current^=about]').find('.sections-structure__scroll-ico-c');
		$arrow.hide();
	});

	//
	// hide arrow-down icon if scroll elems ... end;
	//

	//
	// about mobile info toggler
	//

	$('body').on('click', '.js--about-info-toggler', function(){
		var $this = $(this);
		var target = $this.data('target');
		var $target = $(target);

		isSlideCanChange = false;
		$this.toggleClass('active');
		$target.toggleClass('active');
	});

	//
	// about mobile info toggler ... end;
	//

	//
	// home page slide 3 cards alignments
	//

	if (window.matchMedia("(min-width : 1366px)").matches) {
		cardAlignment();

		$(window).on('resize', function () {
			cardAlignment();
		});
	}

	function cardAlignment() {
		var $title = $('.h-section-services__container .h-section__title');

		if (!$title.length) {
			return
		}

		var titleLH = parseInt($title.css('line-height'));
		var titleCSSLineH = {
			'100': 18,
			'130': 18
		}
		var titleLHOffset = titleCSSLineH[titleLH];
		var titleTop = $title.offset().top;
		var titleFontLine = titleTop + titleLH - titleLHOffset;

		var $cardsList = $('.services__list');
		var cardsListMargin = parseInt($cardsList.css('margin-top'));

		var $card = $('.services__item').eq(0);
		var cardTop = $card.offset().top;
		var cardHeight = $card.height();
		var cardBot = cardTop + cardHeight - cardsListMargin;

		var offset = titleFontLine - cardBot;

		$cardsList.css('margin-top', offset + "px");
	}

	//
	// home page slide 3 cards alignments ... end;
	//
}

document.addEventListener("DOMContentLoaded", DOMready);