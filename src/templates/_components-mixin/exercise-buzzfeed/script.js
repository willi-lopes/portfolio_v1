events.on('ready', function() {

	$('.container-exercise-buzzfeed').each(function(indice, item) {

			//console.log('quiz ' + window.uid + ' ' + indice);

			var _template = this;
			var currentID = indice;
			var uidPAGE = window.uid;
			var random = ($(_template).attr('random')) ? $(_template).attr('random') : false;
			var nextLiberate = ($(_template).attr('nextLiberate')) ? $(_template).attr('nextLiberate') : false;
			var modal = ($(_template).attr('modal')) ? $(_template).attr('modal') : false;
			var pesoQuestion = ($(_template).attr('peso')) ? $(_template).attr('peso') : -1;
			var repeat = ($(_template).attr('repeat')) ? $(_template).attr('repeat') : 1;
			var feedObj = null;
      var allBuzz = $(_template).find('> div').length - 1;

      $(_template).attr('buzzind',  "1/"+ allBuzz);

      if(modal)
        $(_template).addClass('buzzfeed-is-modal');
      else
        $(_template).addClass('buzzfeed-is-padrao');

			$(_template).find('.container-exercise-base').addClass('children-buzzfeed');///depois aplicar nos outros excecicicios

			if(random){

				$(_template).html(
					$(_template).find('> div').sort(function() {
							return Math.random() - 0.5;
					})
				);

				$(_template).append( $(_template).find('.feeds') );/// jogar o feed para o final

			}


			getCache();

			$(_template).find('.children-buzzfeed').on('buzzfeed', function(e, status){

				var excCurrent = parseInt($(_template).attr('excCurrent'));
				var excNext = excCurrent + 1;
				$(_template).attr('nt'+excCurrent, status);
        $(_template).attr('buzzind', (excNext+1) +"/"+allBuzz);

				currentExc(excNext);
			});

			$(_template).find('.feed .btn-refazer').on('click', function(){

        $(_template).removeClass('buzzfeed-final');
        $(_template).attr('buzzind',  "1/"+ allBuzz);

				if(modal)
					$("body").trigger('closeModal', [feedObj]);

				currentExc(0);
				repeat--;
			})

			$(_template).find('.modal-close').on('click mousedown touchstart focusin', function() {
				$("body").trigger('closeModal', [feedObj]);
				$(_template).append("<div class='blockBuzzFeed'></div>")
			})

			function currentExc(_current){

				var all = $(_template).find('.children-buzzfeed').length;

				if( _current == all){

					//$(_template).find('> div').addClass('hide');

					feedFinal();

					if(nextLiberate){
						$('body').trigger('nextLiberate'); // on in itenraction-arrows.
					}

				}else{
					$(_template).find('> div').addClass('hide');
					$(_template).find('> div').eq(_current).removeClass('hide');
					$(_template).attr('excCurrent', _current);
					$(_template).find('.button-confirm').addClass('hide');
				}

			}

			function feedFinal(){
				var all = $(_template).find('.children-buzzfeed').length;
				var nota = 0;
				var porc = 0;
				for( var i = 0; i < all; i++ ){
					if( $(_template).attr('nt'+i) == "1" ||  $(_template).attr('nt'+i) == 1 ){
						nota += 1;
					}
				}

				porc = parseInt(nota/all * 100);
				callfFeed(porc)
				saveCache(porc);
			}

			function callfFeed(porc){
				var media = JSON.parse( $(_template).attr('medias') );
				var result = 1;/// representa o valor do 0 ate a primeira media
				for (var i = 0; i < media.length; i++) {
						if (media[i] <= porc) {
								result += 1;
						}
				}

        // caso tenha a media máxima não precisa do repetir
        if( media.length == result - 1 ){
          repeat = 0;
        }

        $(_template).attr('buzzind',  "");

				if(!modal){
					$(_template).find('> div').addClass('hide');
					$(_template).find('.feeds').removeClass('hide');
					$(_template).find('.feed').addClass('hide');

					$(_template).find('.feed'+result).removeClass('hide');
          $(_template).addClass('buzzfeed-final');

				}else{

					$(_template).find('.feeds').removeClass('hide');
					$(_template).find('.feed').addClass('hide');
					feedObj = $( _template ).find( '.feed'+result );
					feedObj.removeClass('hide');

          if(repeat == 0){
            feedObj.find('.modal-close').attr("next_page",'next');
          }else{
            feedObj.find('.modal-close').attr("next_page",'hide');
          }

					$("body").trigger('openModal', [feedObj ]);
				}

				$(_template).find('.feed .nota').html( porc + "%" );

				if(repeat == 0){
					$(_template).find('.feed .btn-refazer').addClass('hide');
				}
			}

			function getCache() {
				if ($(_template).attr('cache')) {
						if (scorm.loadObject('buzzfeed')) {

							//var buzzfeed = JSON.parse(scorm.loadObject('buzzfeed'));
							var buzzfeed = scorm.loadObject('buzzfeed');

							if (buzzfeed.length > 0) {
									$.each(buzzfeed, function(indice, item) {
											if (item.uid == uidPAGE && item.q == currentID) {
												callfFeed(item.porc);
												repeat = item.rep;
											}
									})
							}

							setTimeout(function () {
								if(nextLiberate){
									$('body').trigger('nextLiberate'); // on in itenraction-arrows.
								}
								console.log('entrou')
							}, 1000 * 1 );

					}

				}else{
					currentExc(0);
				}
			}

			function saveCache(porcX) {

				if ($(_template).attr('cache')) {

					var buzzfeed = [];

					if (scorm.loadObject('buzzfeed')) {
						buzzfeed = scorm.loadObject('buzzfeed');
					}

					$.each(buzzfeed, function(indice, it) {

						try {
							if (it && it["uid"] == uidPAGE && it["q"] == currentID) {
								var it = buzzfeed.indexOf(it);
								if (it > -1) {
									buzzfeed.splice(it, 1);
								}
							}
						} catch (e) {
								// declarações para manipular quaisquer exceções
								console.error("erro no array do quiz", e); // passa o objeto de exceção para o manipulador de erro
						}
					})

					var _obj = {
							uid: uidPAGE,
							q: currentID,
							porc: porcX,
							rep: repeat
					};

					buzzfeed.push(_obj);
					//scorm.saveObject('buzzfeed', JSON.stringify(buzzfeed));
					scorm.saveObject('buzzfeed', buzzfeed);
					//questionTrigger();
				}

			}

	});

});
