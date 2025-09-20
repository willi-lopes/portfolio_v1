  events.on('ready', function() {
    $('.owl-carousel').each(function() {

        var _bgSliderContainerClass = ($(this).attr('bgSliderContainerClass')) ? $(this).attr('bgSliderContainerClass') : false;

        var _show = ($(this).attr('show') > 1) ? $(this).attr('show') : "slide";
        var _loop = ($(this).attr('infinite') == 1 ) ? true : false;
        var _nextLiberate = ($(this).attr('nextLiberate') == 1 ) ? true : false;
        var _nav = ($(this).attr('nav') == 1 ) ? true : false;
        var _dots = ($(this).attr('dots') == 1 ) ? true : false;
        var _center = ($(this).attr('center') == 1 ) ? true : false;
        var _auto = ($(this).attr('autp') == 1 ) ? true : false;
        var _dotsloader = ($(this).attr('dotsloader') == 1 ) ? true : false;
        var _margin = ($(this).attr('margin') ) ? $(this).attr('margin') : 0;
        var _this = this;

        createBgSlider(_bgSliderContainerClass, this);

        if(_dotsloader){
          _auto = true;
        }

        if (_show == "slide") {
            $(this).owlCarousel({
                loop: _loop,
                margin: _margin,
                nav: _nav,
                dots: _dots,
                autoplay: _auto,
                // autoplayTimeout:1000,
                // autoplayHoverPause:true,
                // autoWidth: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    550: {
                        items: 1
                    },
                    900: {
                        items: 1
                    }
                }
            })
        } else // verificação caso seja um carousel
        {
            $(this).addClass('model-carousel');
            $(this).owlCarousel({
                loop: _loop,
                margin: _margin,
                center: _center,
                autoplay: _auto,
                // autoplayTimeout:1000,
                // autoplayHoverPause:true,
                nav: _nav,
                dots: _dots,
                responsive: {
                    0: {
                        items: 1
                    },
                    550: {
                        items: 1
                    },
                    900: {
                        items: _show
                    }
                }
            })
        }

        setTimeout(function () {
            controlSlideDisabled(_this, _nav, _dots)
        }, 1000*1);

        $(this).on('changed.owl.carousel', function(event) {

            controlSlideDisabled(_this, _nav, _dots);
            controlSlideBg(_bgSliderContainerClass, event.item.index);
            controlLibras(_this, event);
            if ((event.page.index + 1) == event.page.count) {
              activeNextPage(_nextLiberate);
            }
        });

        if(_dotsloader){

          $(this).addClass('slider-dots-loader');
          var _this = this;

          //
          loaderTrans({ page:{count:100, index:0} }, _this);
          $(this).on('translate.owl.carousel', function(event) {
            loaderTrans(event, _this);
          });

        }

        function loaderTrans(e, _this){

          $(_this).find('.owl-dots .owl-dot').css( "opacity", "0.2" );
          $(_this).find('.owl-dots .owl-dot').find('span').css( "width", 0 );
          $(_this).find('.owl-dots .owl-dot').find('span').stop().animate({width: "0"}, 1000 * 0.1);

          if( e.page.index == 0){

            $(_this).find('.owl-dots .owl-dot').eq( 0 ).css( "opacity", 1 );
            $(_this).find('.owl-dots .owl-dot').eq( 0 ).find('span').stop().animate({width: "100%"}, 1000 * 5);

          }else{
            for( var i = 0;  i < e.page.count; i++  ){
              if( i < e.page.index ){
                $(_this).find('.owl-dots .owl-dot').eq( i ).css( "opacity", 1 );
                $(_this).find('.owl-dots .owl-dot').eq( i ).find('span').stop().animate({width: "100%"}, 1000 * 0.1);
              }
              else if( i == e.page.index){
                $(_this).find('.owl-dots .owl-dot').eq( i ).css( "opacity", 1 );
                $(_this).find('.owl-dots .owl-dot').eq( i ).find('span').stop().animate({width: "100%"}, 1000 * 5);
              }
            }
          }
        }



        $(window).resize(function() {
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function() {
                controlSlideDisabled(_this, _nav, _dots);
            }, 1000 * 1);
        });

        controlSlideAcessibility(_this, _nextLiberate);

    })

    customOwlSetas();

  });

  function controlLibras(item,e) {
    var _it = $(item);

    var engine_config = navigate.currentScreen.model.acessibility;
    var data_libras = $(_it.find('.owl-item')[e.item.index]).find('.col')[0];
    // var data_libras = $(_it.find('.owl-item')[e.page.index]).find('.col')[0];

    if (engine_config.customLibras && $(data_libras).attr('data-libras')) {
      var name_slide_libras = $(data_libras).attr('data-libras');
      callLibras(name_slide_libras);
    }
  }

  function createBgSlider(_bgSliderContainerClass, _this) {
    if (_bgSliderContainerClass) {
        $("." + _bgSliderContainerClass).find('.col-full').css('height', '100vh');
        $("." + _bgSliderContainerClass).prepend('<div class="bgElementSlider"></div>');
        $(".bgElementSlider").prepend($(_this).find(".bgSlideContainer"));

        $("." + _bgSliderContainerClass).find('.slideImg').css('z-index', -1);
        $("." + _bgSliderContainerClass).find('.slideImg0').css('z-index', 0);
    }
  }

  function controlSlideBg(_bgSliderContainerClass, index) {

    if (_bgSliderContainerClass) {

        $("." + _bgSliderContainerClass).find('.slideImg').css('z-index', -1);
        $("." + _bgSliderContainerClass).find('.slideImg').removeClass('entranceSlide');
        $("." + _bgSliderContainerClass).find('.slideImg').addClass('exitSlide');

        $("." + _bgSliderContainerClass).find('.slideImg' + index).css('z-index', 0);
        $("." + _bgSliderContainerClass).find('.slideImg' + index).removeClass('exitSlide');
        $("." + _bgSliderContainerClass).find('.slideImg' + index).addClass('entranceSlide');
    }

  }

  function controlSlideDisabled(_this, _nav, _dots) {
    if (_nav)
        $(_this).find('.owl-nav').removeClass('disabled');

    if (_dots)
        $(_this).find('.owl-dots').removeClass('disabled');
  }

  function controlSlideAcessibility(_this, _nextLiberate) {
    //Acessibildade em tela com slide, controle de liberar o avançar
    $(_this).find('.owl-dot').attr('tabindex', '-1');
    $(_this).find('.owl-prev').attr('tabindex', '-1');
    $(_this).find('.owl-next').attr('tabindex', '-1');
    $(document).on('keydown', function(e) {
        let key = e.which || e.keyCode;

        if (key == 9 || key == 37 || key == 38 || key == 39 || key == 40) {
            $(_this).find('*').each(function() {
                var element = $(this);

                if (element.is(":focus")) {
                    activeNextPage(_nextLiberate);
                }
            })
        }
    });
  }

  function activeNextPage(_nextLiberate) {
    if (_nextLiberate) {
        $('body').trigger('nextLiberate'); // on in itenraction-arrows.
    }
  }

  function customOwlSetas() {
    $(".owl-next").empty();
    $(".owl-next").append("<img width='50%' height='100%' src='../../assets/img/arrow-slider.svg'/>");

    $(".owl-prev").empty();
    $(".owl-prev").append("<img width='50%' height='auto' src='../../assets/img/arrow-slider.svg'/>");
    $(".owl-prev").css('transform', 'scaleX(-1)');
  }
