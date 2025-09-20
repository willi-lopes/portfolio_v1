events.on('ready', function() {

	$('.modal').addClass('hide');

/// se dentro do modal tiver um carousel ou um accordeon add a class md-close-off para desativar o fechar do modal
	$('.modal').find(".owl-carousel").each(function() {
			$(this).addClass('md-close-off');
	});

	$('.modal').find(".container-accordeon").each(function() {
			$(this).addClass('md-close-off');
	});

	$("[data-modal]").each(function(i, element) {
			var $botao = $(element);
			var modal_id = $botao.attr('data-modal');
			var $popup = $(modal_id);
			$popup.addClass('modal hide');

			$botao.attr("role", "button");
			$botao.on('click', function() {
					$botao.addClass('checked');
					$botao.addClass('clicked');
					verifyClose($popup);

					$("body").trigger('openModal', [$popup]); /// evento usado em acessibilidade e bloqueos de scroll
			});

			//$popup.find('.modal-close').on('click focusin'
			$popup.find('.modal-close').on('click focusin', function(evt) {

					evt.preventDefault();
					$botao.removeClass('clicked');

					$("body").trigger('closeModal', [ $popup ] ); /// evento usado em acessibilidade e bloqueos de scroll

			})

	});

	function verifyClose(_pop) {

			/// verifica se é para deixar o close desativado no inicio
			if (_pop.find(".md-close-off").length > 0) {
					_pop.find(".modal-close").addClass("hide");
			}

			/// libera o close no final do slide
			var owl = _pop.find(".owl-carousel");
			owl.on('changed.owl.carousel', function(event) {
					if ((event.item.index + 1) == event.item.count) {
							_pop.find(".modal-close").removeClass("hide");
					}
			})

			/// libera o close ao clicar em todo o accordeon
			var accordeon = _pop.find('.container-accordeon');
			accordeon.on('click', function() {

					$(this).addClass('open');

					var botoes = $(accordeon).toArray();
					var todosBotoesClicados = botoes.every(botao => {
							return $(botao).hasClass('open');
					});

					if (todosBotoesClicados) {
							_pop.find(".modal-close").removeClass("hide");
					}
			})

			/// liberar o close para Acessibildade com qualquer evento do teclado.
			$(window).keyup(function(evt) {
					_pop.find(".modal-close").removeClass("hide");
			})
	}
})

$("body").on('openModal', function(e, $popup) {
	$("html").css('overflow-y', 'hidden');
	$popup.removeClass('hide');

  ///Verificar se é para deixar Hide via atributo
  if( $popup.find(".modal-close").attr('next_page') == "hide" ){
    $popup.find(".modal-close").addClass('hide');
  }else{
    if( $popup.find(".md-close-off").length == 0) {
      $popup.find(".modal-close").removeClass("hide");
    }
  }


	var engine_config = navigate.currentScreen.model.acessibility;
	if ( engine_config.customLibras && $($popup.find('.col')[0]).attr('data-libras') ) {
		var name_modal_libras = $( $popup.find('.col')[0] ).attr('data-libras');
		callLibras(name_modal_libras);
	}
});

$("body").on('closeModal', function( e, $popup ) {
  $popup.addClass('hide');
  $("html").css('overflow-y', 'auto');

  var _close = $popup.find('.modal-close');
  if (_close.attr('arrow_status_class')) {
    _close.attr('arrow_status_active', true);
    var _liberate_arrow = true;

    $('.modal .modal-close').each(function(indice, item) {
        if ($(item).attr('arrow_status_class') == _close.attr('arrow_status_class')) {
            if (!$(item).attr('arrow_status_active')) {
                _liberate_arrow = false;
            }
        }
    });

    if (_liberate_arrow) {
        $('body').trigger('nextLiberate'); // on in itenraction-arrows.
    }
  }

  if (_close.attr('next_page')) {
		$('.modal .modal-close').each(function (indice, item) {
			if ($(item).attr('next_page') == _close.attr('next_page')) {

        if( _close.attr('next_page') != "hide" ){
          if( _close.attr('next_page') == "next" ){
            navigate.next();
          }else{
            navigate.goto(_close.attr('next_page'));
          }
        }
			}
		});
	}

});
