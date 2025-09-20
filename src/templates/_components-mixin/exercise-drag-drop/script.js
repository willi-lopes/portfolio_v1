events.on('ready', function() {

	$('.exercise-drag-drop').each(function(indice, item) {

			//console.log('dragdrop ' + window.uid + ' ' + indice);

			var _template = this;
			var currentID = indice;
			var uidPAGE = window.uid;
			var repeat = 0;
			var repeatCache = 0;
      var repeatInit = 0;
			var maxItensInAlvo = ($(_template).attr('maxItensInAlvo')) ? $(_template).attr('maxItensInAlvo') : 1;
			var featuredClass = ($(_template).attr('featuredClass')) ? $(_template).attr('featuredClass') : "featured-item";

			var relacionarExerc = ($(_template).attr('relacionar') == 'relacionar' || $(_template).attr('relacionar') == true) ? true : false;
			var randomExerc = ($(_template).attr('random') == 'random' || $(_template).attr('random') == true) ? true : false;

			var standardBtn = ($(_template).attr('standardBtn')) ? $(_template).attr('standardBtn') : 'confirmar';
			var repeatBtn = ($(_template).attr('repeatBtn')) ? $(_template).attr('repeatBtn') : 'refazer';
			var cacheBtn = ($(_template).attr('cacheBtn')) ? $(_template).attr('cacheBtn') : 'rever';
			var pesoQuestion = ($(_template).attr('peso')) ? $(_template).attr('peso') : -1;

			var arrasteAll = $(_template).find('.item-select').length;

			var infoClass = ($(_template).attr('infoClass')) ? $(_template).attr('infoClass') : false;
			var infoTxt = ($(_template).attr('infoTxt')) ? $(_template).attr('infoTxt') : 'Arraste os elementos';

      var feedObj = null;
			var buzzfeedStatus = $(_template).hasClass('children-buzzfeed');

      $(_template).find('.button-confirm').addClass('hide');


			// ///Informação das variaveis do CSS(structure.less)
			// // :root {
			// //     --mobile: @mobile;
			// //     --tablet: @tablet;
			// //     --notebook: @notebook;
			// //     --desktop: @desktop;
			// // }
			function css_var(_name, _value) {
					var gcs = getComputedStyle(document.documentElement).getPropertyValue(_name);
					return (parseInt(gcs)) ? parseInt(gcs) : _value;
			}

			//verifica a resolução min com base na variavel do CSS Tablet( tema > structure.less )
			var resolucaoMin = (css_var('--tablet', '900') >= $(window).width()) ? true : false;

			if (resolucaoMin)
					$(_template).parent().find("." + infoClass).html(infoTxt);

			if ($(_template).attr('repeat')) {
					repeat = parseInt($(this).attr('repeat'));
					repeatInit = parseInt($(this).attr('repeat'));
					repeatCache = parseInt($(this).attr('repeat'));
			}

			reset();

			function reset() {

					$(_template).find('.feedback').addClass('hide');
					$(_template).find('.button-confirm').html(standardBtn);

					$(_template).find('.arraste').each(function(indice, item) {

							var parent = $(item)[0].parentInit;
							$(parent).find('.cloneItens').remove();
							$(parent).append(item);
							$(item).removeAttr("encap");
					});

					$(_template).find('.alvo').each(function(indice, item) {

							$(item).find('.arraste').remove();

							$(_template).find('.arraste').each(function() {
									var _arraste = $(this).attr('arraste');
									$(item).removeAttr("a" + _arraste);
							})

					})
			}

			function blockArraste() {
					$(_template).find('.arraste').removeClass('featuredItens');
					$(_template).find('.arraste').css('pointer-events', 'none');
					$(_template).find('.alvo').css('pointer-events', 'none');
			}


			if (randomExerc) {
					$(_template).find('.col-itens').html(
							$(_template).find('.col-itens .container-item').sort(function() {
									return Math.random() - 0.5;
							})
					);
			}

			$(_template).drag_drop_exerc({
					itemClass: 'dragDrop_element',
					featuredItemClass: featuredClass,
					confirmarClass: 'confirmar',
					limiteAlvo: parseInt(maxItensInAlvo), /// quantidade de elementos que cabe em cada alvo
					relacionar: relacionarExerc,
					call: function(e) {
							if (e.action.status == 'init') {
									getCache();
							}
							if (e.action.status == 'confirmar') {
									//e.action.response


									if (e.action.response == true) {

											$(_template).attr('res-feed', 1);
											feedObj = 'feedback-positive';
											repeat = 0;

									} else {

											$(_template).attr('res-feed', 0);
											feedObj = 'feedback-negative';

											// Quando a questao tiver refazer é preciso cadastrar
											// cada feed negativo. ex: '.feedback-negative1', '.feedback-negative2' ate 10 Ex.:9999 passa a ser um feed só
											if (repeatInit > 0 && repeatInit <= 10) {
													var feedCurrent = repeatInit - repeat + 1;
													if ( $(_template).find('.feedback-negative' + feedCurrent).length > 0) {
															feedObj ='feedback-negative' + feedCurrent;
													}
											}
									}

									if(buzzfeedStatus){
										$(_template).find('.container-alternative').removeClass('actived');
										$(_template).trigger('buzzfeed', [ $(_template).attr('res-feed') ]);
										$(_template).find('.button-confirm').addClass('hide');
										reset();
									}else{
										var feedContain = $(_template).find('.'+feedObj);
										$("body").trigger('openModal', [feedContain]);
									}
							}
					}
			});

			$(_template).find('.modal-close').on('click focusin', function() {

					$(_template).find('.feedback').addClass('hide');

					if (repeat <= 0) {

							if ($(this).attr('arrow_status_class')) {
									$('body').trigger('nextLiberate');
							}

							$(_template).find('.container-alternative').addClass('respondido');
							$(_template).find('.button-confirm').html(cacheBtn);

							blockArraste();
							saveCache();

					} else {

							reset();

							$(_template).find('.container-alternative').removeClass('respondido');
							$(_template).find('.button-confirm').html(repeatBtn);

							$(_template).find('.button-confirm').addClass('hide');
							$(_template).find('.container-alternative').removeClass('actived');

							repeat--;
							repeatCache--;


					}

					var feedContain = $(_template).find('.'+feedObj);
					$("body").trigger('closeModal', [feedContain] );
			});

			function getCache() {

					if ($(_template).attr('cache')) {
							if (scorm.loadObject('dragdrop')) {

									//var dragdrop = JSON.parse(scorm.loadObject('dragdrop'));
									var dragdrop = scorm.loadObject('dragdrop');

									if (dragdrop.length > 0) {


											$.each(dragdrop, function(indice, item) {
													if (item.uid == uidPAGE && item.q == currentID) {

															$(_template).find('.button-confirm').removeClass('hide');
															$(_template).find('.button-confirm').html(cacheBtn);

															repeat = 0;
															repeatInit = 0;
															repeatCache = 0;

															$(_template).find('.alvo').each(function(ind, it) {

																	var alv = item.a[ind];
																	if (alv.length > 0) {
																			$.each(alv, function(indX, itemX) {
																					$(it).attr('a' + itemX, 1);
																					$(it).attr('alvoAtivo', 1);

																					var _arraste = $('.arraste' + itemX);
																					var _clone = _arraste.clone();
																					_arraste.addClass('cloneItens');

																					$(it).append(_clone);

																			});
																	}
															});

															blockArraste();
													}

											})

									}

							}
					}

			}

			function saveCache() {

					//// informação para caso precise salvar no suspendata
					if ($(_template).attr('cache')) {

							var drag_drop = [];
							var drag_drop_cache = [];
							if (scorm.loadObject('dragdrop')) {
								drag_drop = scorm.loadObject('dragdrop');
							}


							$(_template).find('.alvo').each(function(indice, item) {

									var alvo = [];
									for (var i = 1; i <= arrasteAll; i++) {
											if ($(this).attr('a' + i)) {
													alvo.push(i);
											}
									}
									drag_drop_cache.push(alvo);
							})

							$.each(drag_drop, function(indice, it) {

								try {
									if (it && it["uid"] == uidPAGE && it["q"] == currentID) {
										drag_drop.splice(indice, 1);
									}
								} catch (e) {
										// declarações para manipular quaisquer exceções
										console.error("erro no array do dragdrop", e); // passa o objeto de exceção para o manipulador de erro
								}

							})

							var _obj = {
									uid: uidPAGE,
									q: currentID,
									a: drag_drop_cache,
									r: parseInt($(_template).attr('res-feed')),
									t: repeatInit - repeatCache,
							};

							//Peso da Questao
							if (pesoQuestion > -1) {
								if (_obj.r == 1) {
									_obj.pq = parseInt(pesoQuestion);
								} else {
									_obj.pq = 0;
								}
							}

							drag_drop.push(_obj);
							//scorm.saveObject('dragdrop', JSON.stringify(drag_drop));
							scorm.saveObject('dragdrop', drag_drop);
							questionTrigger();
					}
			}
	});

	questionTrigger();

	function questionTrigger() {

			if (scorm.loadObject('dragdrop')) {
					//var dragdrop = JSON.parse(scorm.loadObject('dragdrop'));
					var dragdrop = scorm.loadObject('dragdrop');

					var dragdropOpen = [];
					var totalQestao = dragdrop.length;
					var totalErros = 0;
					var totalCorretas = 0;
					var pesoQuestao = 0;
					var pesoQuestaoStatus = false;
					var pesoAlternativa = 0;
					var pesoAlternativaStatus = false;

					$.each(dragdrop, function(indice, item) {

							var it_dragdrop = {
									uidPAGE: item.uid,
									currentID: item.q,
									alternativas: item.a,
									status: item.r,
									tentativas: item.t
							}

							if (item.r == 0) totalErros += 1;
							if (item.r == 1) totalCorretas += 1;
							if (item.pq) {
									pesoQuestao += parseInt(item.pq);
									pesoQuestaoStatus = true;
									it_dragdrop.pesoQuestao = item.pq;
							}
							if (item.pa) {
									pesoAlternativa += parseInt(item.pa);
									pesoAlternativaStatus = true;
									it_dragdrop.pesoAlternativa = item.pa;
							}

							dragdropOpen.push(it_dragdrop);
					})

					var obj = {
							dragdrop: dragdropOpen,
							total: totalQestao,
							erradas: totalErros,
							corretas: totalCorretas,
							porcentagem: parseInt((totalCorretas / totalQestao) * 100),
							totalPesoQuestao: 0,
							totalPesoAlternativas:0
					};

					if (pesoQuestaoStatus) {
							obj.totalPesoQuestao = pesoQuestao;
					}

					if (pesoAlternativaStatus) {
							obj.totalPesoAlternativas = pesoAlternativa;
					}

					//console.log(obj);
					events.emit('dragdrop', obj);
			}
	}

});

events.on('dragdrop', function(e) {
	// console.log('dragdrop');
	// console.log(e);
});

// var e = {current:''};
//events.emit('read-dragdrop', e);
//console.log(e);
events.on('read-dragdrop', function(e) {

	var obj = {};

	if (scorm.loadObject('dragdrop')) {
			//var dragdrop = JSON.parse(scorm.loadObject('dragdrop'));
			var dragdrop = scorm.loadObject('dragdrop');

			var dragdropOpen = [];
			var totalQestao = dragdrop.length;
			var totalErros = 0;
			var totalCorretas = 0;
			var pesoQuestao = 0;
			var pesoQuestaoStatus = false;
			var pesoAlternativa = 0;
			var pesoAlternativaStatus = false;

			$.each(dragdrop, function(indice, item) {

					var it_dragdrop = {
							uidPAGE: item.uid,
							currentID: item.q,
							alternativas: item.a,
							status: item.r,
							tentativas: item.t
					}

					if (item.r == 0) totalErros += 1;
					if (item.r == 1) totalCorretas += 1;
					if (item.pq) {
							pesoQuestao += parseInt(item.pq);
							pesoQuestaoStatus = true;
							it_dragdrop.pesoQuestao = item.pq;
					}
					if (item.pa) {
							pesoAlternativa += parseInt(item.pa);
							pesoAlternativaStatus = true;
							it_dragdrop.pesoAlternativa = item.pa;
					}

					dragdropOpen.push(it_dragdrop);
			})

			obj = {
					dragdrop: dragdropOpen,
					total: totalQestao,
					erradas: totalErros,
					corretas: totalCorretas,
					porcentagem: parseInt((totalCorretas / totalQestao) * 100),
					totalPesoQuestao: 0,
					totalPesoAlternativas:0
			};

			if (pesoQuestaoStatus) {
					obj.totalPesoQuestao = pesoQuestao;
			}

			if (pesoAlternativaStatus) {
					obj.totalPesoAlternativas = pesoAlternativa;
			}

			//console.log(obj);
			events.emit('dragdrop', obj);
	}

	e.current = obj;

});

// events.emit('dragdrop-reset');
events.on('dragdrop-reset', function() {
	console.log('dragdrop-reset');
	scorm.removeObject("dragdrop");
});
