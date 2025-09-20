events.on('ready', function() {

	create_sistema();
	adapt_sistema();
	var resizeId;
	$(window).resize(function() {
			clearTimeout(resizeId);
			resizeId = setTimeout(function() {
					adapt_sistema();
			}, 200);
	});

	function create_sistema() {

			$('.interaction-image-mapping').each(function() {
					var template = $(this);

					createContainerInfo(template);
					dataPin(template);

					template.find('.image-mapping-pin').on('click', function() {

							var _parent = parseInt($(this).attr('parent'));
							var _indice = parseInt($(this).attr('ind'));

							$(this).find('*').removeClass('animated');
							callScreenSystem(template, _parent, _indice);

							controlVerify( template, this );
							$(this).trigger('change-mapping-pin', [template, _parent, _indice] );

					});

			});

	}

	function controlVerify( template, _this ){

		$(_this).attr("pin-active", true);

		var _comp = true;
		template.find('.image-mapping-pin').each( function() {
			if(!$(this).attr('pin-active'))
				_comp = false;
		})


		var _nextLiberate = (template.attr('nextLiberate')) ? template.attr('nextLiberate') : false;
		if (_nextLiberate && _comp) {
				console.log('final das telas');
				$('body').trigger('nextLiberate'); // on in itenraction-arrows.
		}

	}

	function createContainerInfo(template) {

			template.find('.interaction-mapping-int').each(function() {

					var _this = this;
					var model = $(this).attr('model');

					if (model == 'top') {
							$(_this).find('.image-mapping-top').css('display', 'block');

							$(_this).find('.image-mapping-info').each(function() {
									$(_this).find('.image-mapping-top').append($(this));
							})

					} else if (model == 'bottom') {
							$(_this).find('.image-mapping-bottom').css('display', 'block');

							$(_this).find('.image-mapping-info').each(function() {
									$(_this).find('.image-mapping-bottom').append($(this));
							})
					} else {

							if (model != 'modal') {
									$(_this).find('.image-mapping-info').each(function() {
											$('.' + model).addClass('image-mapping-base');
											$('.' + model).append($(this));
									})
							}

					}
			})

	}

	function dataPin(template) {

			var count = template.attr('count');

			// Controle de gravaçao de dados do pin
			template.find('.image-mapping-container').css('display', 'flex');
			template.find('.image-mapping-pin').each(function() {
					$(this).attr('pin_w', $(this).width());
					$(this).attr('pin_h', $(this).height());
			});
			template.find('.image-mapping-container').css('display', 'none');
			// Controle de gravaçao de dados do pin

			// Ativar o primeiro Pin do primeiro screen
			template.find('.image-mapping-container').eq(0).css('display', 'flex');
			$('.image-mapping-info').css('display', 'none');
			$('.image-mapping-pin').css('display', 'none');
			$(`.image-mapping-pin-${count}-${0}-${0}`).css('display', 'flex');

			template.find('.image-mapping-container').attr('screen-all', $('.image-mapping-container').length);
			template.find('.image-mapping-container').each(function() {
					var pinAll = $(this).find('.image-mapping-pin').length;
					$(this).attr('pinAll', pinAll);
			});

			var _pinsLiberate = (template.attr('pinsLiberate')) ? template.attr('pinsLiberate') : false;
			if (_pinsLiberate) {
					$('.image-mapping-pin').css('display', 'flex');
			}

	}

	function callScreenSystem(template, _parent, _indice) {

			var _system_screen_container = template.find('.image-mapping-container').eq(_parent);
			_system_screen_container.attr('pos', _indice);

			callPin(template, _parent, _indice);
			callNextScreenSystem(template, _parent, _indice);

	}

	function callNextScreenSystem(template, _parent, _indice) {

			var _system_screen_container = template.find('.image-mapping-container').eq(_parent);
			var _screenAll = parseInt(_system_screen_container.attr('screen-all')) - 1;
			var _positionPin = parseInt(_system_screen_container.attr('pos'));
			var _allPin = parseInt(_system_screen_container.attr('pinAll')) - 1;


			if (_positionPin == _allPin) {

					// passa para a proxima screen
					if (_parent < _screenAll) {

							template.find('.image-mapping-container').css('display', 'none');

							var _next = _parent + 1;
							template.find('.image-mapping-container').eq(_next).css('display', 'flex');
							callPin(template, _next, 0);


							adapt_sistema();

					} else {

							// var _nextLiberate = (template.attr('nextLiberate')) ? template.attr('nextLiberate') : false;
							// if (_nextLiberate) {
							// 		console.log('final das telas');
							// 		$('body').trigger('nextLiberate'); // on in itenraction-arrows.
							// }
					}

			}
	}

	function callPin(template, parent, indice) {

			var count = template.attr('count');

			$('.image-mapping-info').css('display', 'none');
			$('.image-mapping-pin').css('display', 'none');

			$(`.image-mapping-info-${count}-${parent}-${indice}`).css('display', 'flex');
			$(`.image-mapping-pin-${count}-${parent}-${indice+1}`).css('display', 'flex');

			var _pinsLiberate = (template.attr('pinsLiberate')) ? template.attr('pinsLiberate') : false;
			if (_pinsLiberate) {
					$('.image-mapping-pin').css('display', 'flex');
			}

	}

	function adapt_sistema() {

			$('.image-mapping-pin').each(function() {

					var myImg = $(this).parent().find('.image-mapping-img');
					var realWidth = myImg.get(0).naturalWidth;
					var realHeight = myImg.get(0).naturalHeight;
					var utilWidth = myImg.width();
					var utilHeight = myImg.height();

					var scaleBox = Math.min(
							utilWidth / realWidth,
							utilHeight / realHeight
					);

					var realPinWidth = parseInt($(this).attr('pin_w'));
					var realPinHeight = parseInt($(this).attr('pin_h'));
					var realPinX = parseInt($(this).attr('pin_x'));
					var realPinY = parseInt($(this).attr('pin_y'));

					var pinW = realPinWidth * scaleBox;
					var pinH = realPinHeight * scaleBox;
					var porcX = realPinX * scaleBox;
					var porcY = realPinY * scaleBox;

					$(this).width(pinW);
					$(this).height(pinH);
					$(this).css('left', porcX + 'px');
					$(this).css('top', porcY + 'px');

			});
	}

});
