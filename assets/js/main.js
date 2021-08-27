$(function () {
    const wow = new WOW({
        boxClass:     'wow',      // animated element css class (default is wow)
        animateClass: 'animate__animated', // animation css class (default is animated)
        offset:       0,          // distance to the element when triggering the animation (default is 0)
        mobile:       false,       // trigger animations on mobile devices (default is true)
        live:         true,       // act on asynchronously loaded content (default is true)
        callback:     function(box) {
        // the callback is fired every time an animation is started
        // the argument that is passed in is the DOM node being animated
        },
        scrollContainer: null,    // optional scroll container selector, otherwise use window,
        resetAnimation: true,     
    });
    wow.init()

    const owl = $('#slider-hero').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 4000,
        dots: false,
        smartSpeed: 450,
        animateOut: 'fadeOut'
    })

    owl.on('change.owl.carousel', function (event) {
        var el = event.target;
        $(el).find('.content').hide().show()
    });

    const preHead = $('#pre-header');
    const preHeadScrollTop = preHead.offset().top + preHead.height()
    
    $(window).on('scroll', function(e){
        const windowScrollTop = $(this).scrollTop()

        if(preHeadScrollTop <= windowScrollTop) {
            $('nav').addClass('sticky')
        } else {
            $('nav').removeClass('sticky')
        }

    })

    function renderProducts() {
        let products = [];
        const productsContainer = $('#products-slider');

        productsContainer.html(`<div class="loading"><i class="mdi mdi-spin mdi-loading"></i></div>`);

        $.getJSON('../../data/products.json', function(json){
            products = json.products;
            
            if(products && products.length) {
                const productCards = products.map((product, index) => `<div class="product wow animate__fadeInUp" data-wow-delay="${(500 + ((index + 1) * 100)) / 1000}s">
                    <div class="product-image">
                        <img src="${product.image}" />
                    </div>
                    <div class="product-details">
                        <div class="product-price">
                            AED ${product.price.special ? `<span class="new-price special">${product.price.special}</span>` : ''}
                             <span class="${product.price.special ? 'old-price' : 'new-price'}">${product.price.net}</span>
                                
                        </div>
                        <div class="product-title">
                            ${product.name}
                        </div>
                    </div>
                </div>`);

                productsContainer.html(productCards)
                productsContainer.slick({
                    infinite: false,
                    rows: 2,
                    slidesPerRow: 4,
                    arrows: true,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                              slidesPerRow: 4,
                            }
                          },
                          {
                            breakpoint: 600,
                            settings: {
                              slidesPerRow: 3,
                            }
                          },
                          {
                            breakpoint: 480,
                            settings: {
                              slidesPerRow: 2,
                            }
                          }
                    ]
                })
            } else {
                productsContainer.html(`<div class="no-data">Oops! No products found!</div>`);
            }
        })
    }

    renderProducts()

    $('#brands-slider').owlCarousel({
        items: 8,
        loop: true,
        autoplay: true,
        autoplayTimeout: 2000,
        dots: false,
        nav:false,
        smartSpeed: 450,
        responsive: {
            0:{
                items:3,
            },
            600:{
                items:5,
            },
            1000:{
                items:8,
            }
        }
    })

    function scrollToDiv(target) {
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, {
            duration: 'slow',
            easing: 'swing',
            complete: function() {
                if($('#mobile-menu').hasClass('active')) {
                    $('#mobile-menu').removeClass('active').fadeOut('slow')
                }
            }
        })
    }

    $('.scroll-to').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href')

        if(target) {
            scrollToDiv(target)
        }
    })

    $('#mobile-menu').hide()

    $(window).on('resize', function(e) {
        const width = $(window).width();
        const menu = $('#menu')
        const menuItems = menu.find('ul')
        const mobileMenu = $(menuItems).clone(true)
        const mobileMenuWrapper = menu.find('#mobile-menu')
        const nav = $('nav')

        mobileMenu.removeClass('menu-list').addClass('mobile-menu-list')

        if(width < 1200) {
            menuItems.hide()

            if(!$('.mobile-menu-trigger').length) {
                nav.append(`<span class="mobile-menu-trigger"><i class="mdi mdi-menu"></i></span>`)
            }

            mobileMenuWrapper.html(`<div class="menu-header"><span class="close-mobile-menu"><i class="mdi mdi-close"></i></span><div>`)
            mobileMenuWrapper.append(mobileMenu)
        } else {
            menuItems.show()
            mobileMenuWrapper.empty()

            if($('.mobile-menu-trigger').length) {
                nav.find('.mobile-menu-trigger').remove()
            }

            $('.brand-name').click(function(e) {
                scrollToDiv('#slider-hero')
            })
        }

        $(nav).click('.mobile-menu-trigger, .close-mobile-menu', function(e) {
            // mobileMenuWrapper.fadeIn('slow')

            const icon = $(e.target).eq(0);

            if(icon.hasClass('mdi-menu')) {
                mobileMenuWrapper.addClass('active')
            } else if(icon.hasClass('mdi-close')) {
                mobileMenuWrapper.removeClass('active')
            }

            if(mobileMenuWrapper.hasClass('active')) {
                mobileMenuWrapper.fadeIn('slow')
            } else {
                mobileMenuWrapper.fadeOut('slow')

            }
        })

    }).resize()
})
