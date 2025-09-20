events.on('ready', function() {

    var headerHide = $('body').attr('header-hide');
    var headerClass = '.component-template-header';

    if (typeof headerHide !== 'undefined' && headerHide !== false) {
        $(headerClass).addClass('hide');
    }
    
    $('a[href^="#"]').on('click', function() {
         $(headerClass).find('input').prop('checked', false);
    });

    //nav-obj é a classe que se deve colocar junta as sections com ID/HREF que o header irar enviar
    $('.nav-obj').each(function() {
        $(this).isInViewportComplete({
            container: window,
            released: true,
            call: function(e) {
                $('a[href^="#"]').removeClass('header-active');
                $(`a[href^="#${$(e).attr('id')}"]`).addClass('header-active');
            }
        });
    })

    ///Controle de header caso o menu fique abaixo da capa, para fixar depois no topo
    var capa = $('.capa');
    if (capa.length) {
        var range = 200;
        $(window).on('scroll', function() {

            var scrollTop = $(this).scrollTop(),
                height = capa.outerHeight(),
                offset = height,
                calc = 1 - (scrollTop - offset + range) / range;

            if (calc > '1') {
                $(headerClass).removeClass('fixedHeader');
            } else if (calc < '0') {
                $(headerClass).addClass('fixedHeader');
            }
        });
    }
    
});
