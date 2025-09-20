//script navegation responsavel por alguns controles de liberação navegação
//JQUERY responsavel pela verificação se a div esta visivel na tela
(function() {
    $.fn.isInViewportComplete = function(options) {
        var BASE = {};
        var settings = $.extend({
            call: undefined,
            released: false,
            container: 'body',
            porcentagem: 0,
            completeVerify: false,
        }, options);

        BASE.SETTINGS = settings;
        BASE.THIS = this;


        var elm = $(BASE.THIS);

        // Se for com base em porcetagem
        if (elm.is('body') || elm.is('html') || elm[0] === window || elm[0] === document) {

            var compen = BASE.SETTINGS.porcentagem / 100;
            elm.on("scroll", function() {

                var scrollHeight = $(document).height();
                var scrollPosition = elm.height() + elm.scrollTop();

                if ((scrollHeight - scrollPosition) / scrollHeight <= compen) {

                    if (!BASE.SETTINGS.completeVerify) {
                        BASE.SETTINGS.call();
                        BASE.SETTINGS.completeVerify = true;
                    }
                }
            });
        } else // Se for com base em uma DIV na viewport
        {
            function isInViewport(_this) {
                try {
                    // var elementTop = _this.offset().top;
                    // var elementBottom = elementTop + _this.outerHeight();

                    // var viewportTop = $(window).scrollTop();
                    // var viewportBottom = viewportTop + $(window).height();

                    // return elementBottom > viewportTop && elementTop < viewportBottom;
                    var $div = _this; // Substitua pelo seletor da sua div
                    var windowTop = $(window).scrollTop();
                    var windowBottom = windowTop + $(window).height();
                    var divTop = $div.offset().top;
                    var divBottom = divTop + $div.outerHeight();

                    if (divBottom >= windowTop && divTop <= windowBottom) {
                        //   console.log("A div está visível na viewport!");
                        return true;
                    } else {
                        //console.log("A div não está visível na viewport.");
                        return false;
                    }
                } catch (e) {
                    console.log(e);
                }

            };

            $(BASE.SETTINGS.container).on('resize scroll', function() {

                if ($(BASE.THIS).length <= 0)
                    return false;

                if (isInViewport($(BASE.THIS))) {
                    if (BASE.SETTINGS.released) {
                        BASE.SETTINGS.call(BASE.THIS);
                    } else {
                        if (!BASE.SETTINGS.completeVerify) {
                            BASE.SETTINGS.call(BASE.THIS);
                            BASE.SETTINGS.completeVerify = true;
                        }
                    }
                }
            });
        }
    }
}(jQuery));
