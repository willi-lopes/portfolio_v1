$(document).ready(function() {
	addAlert("Aguarde, carregando!");
});

events.on('ready', function() {

	setTimeout(function() {

			bridge.hiddeViewsFromReaderScreen();

			createAriaPageInit();
			onePageTabIndexFix();
			fixTabIndexInComponents();
			controlAcessibilityModal();
			controlNavWereTab();

	}, 1000 * 1);
});

function createAriaPageInit() {
	var nav_current = navigate.currentScreen.index + 1;
	var nav_all = navigate.currentScreen.pages.length;

	if (nav_all > 1) {
			if (nav_current == 1) {
					addAlert(`Carregamento finalizado! Você está na página ${nav_current} de ${nav_all}. Para navegar no treinamento utilize apenas o TAB.`);
			} else {
					addAlert(`Carregamento finalizado! Você está na página ${nav_current} de ${nav_all}.`);
			}
	}
}


function hiddenElementesFromReader(ignoreId) {
	$("*").each(function() {
			if ($(this) != $(ignoreId)) {
					$(this).attr("aria-hidden", "true");
					$(this).attr("tabindex", "-1");
			}
	});
}

function controlAcessibilityModal() {

	$("body").on('openModal', function(e, modal) {
			openModal(modal);
	});

	$("body").on('closeModal', function() {
			closeModal();
	});
}

function openModal(_modalCurrent) {

	addAlert("Janela de conteúdo aberta.");

	var _elemTabModal = {
			ind: 99999999,
			item: null,
			last: 0
	};

	//grava o ultimo tabindex antes de entrar no modal
	$('body').attr('tabIndexModal', document.activeElement.tabIndex);

	_modalCurrent.find('.modal-close').attr("tabindex", -1);
	_modalCurrent.find("*").each(function(indice, item) {
			if (parseInt($(item).attr('tabindex')) > -1) {

					///grava o maior dos tab index dentro do modal para referenciar o btn de Fechar
					_elemTabModal.last = parseInt($(item).attr('tabindex')) + 1;

					///verifica qual o menor tab index dentro do modal e joga o foco pra ele
					if (_elemTabModal.ind > $(item).attr('tabindex')) {
							_elemTabModal.ind = $(item).attr('tabindex');
							_elemTabModal.item = $(item);
					}
			}
	});

	_modalCurrent.find('.modal-close').attr("tabindex", _elemTabModal.last);
	_modalCurrent.find('.modal-close').attr("aria-label", "Fechar modal.");

	_elemTabModal.item.focus();

}

function closeModal() {

	addAlert("Janela de conteúdo fechada.");
	// recupera o ultimo tabindex antes de entrar no modal
	var tabCurrent = parseInt($('body').attr('tabIndexModal'));
	document.activeElement.tabIndex = tabCurrent;

	if (window.keyToTabActive) {
			$("*").each(function() {
					var tabItem = parseInt($(this).attr('tabindex'));
					if (tabCurrent == tabItem) {
							$(this).focus();
					}
			});

			// $.tabNext();
	}


}

function controlNavWereTab() {
	$(window).keyup(function(evt) {
			if (evt.which == 37 || evt.which == 38) {
					//PREV
					$.tabPrev();
			}

			if (evt.which == 39 || evt.which == 40) {
					//NEXT
					$.tabNext();
					window.keyToTabActive = true;
			}
	});
}

function fixTabIndexInComponents() {
	$('button').find("*").each(function() {
			$(this).removeAttr("tabindex");
	});
	$('a').find("*").each(function() {
			$(this).removeAttr("tabindex");
	});
}

function onePageTabIndexFix() {
	var countTb = 20;
	var sections = $('section');

	for (var i = 0; i < sections.length; i++) {
			var _element = sections[i];
			$(_element).find("*").each(function() {
					if ($(this).attr("tabindex") != undefined &&
							$(this).attr("tabindex") != -1 &&
							$(this).attr("tabindex") != "-1" &&
							$(this).attr("tabindex") != "") {
							$(this).attr("tabindex", countTb++);
					}
			});
	}
}

function addAlert(aMsg) {
	removeOldAlert();
	var newAlert = document.createElement("div");
	newAlert.setAttribute("role", "alert");
	newAlert.setAttribute("id", "alert");
	var msg = document.createTextNode(aMsg);
	newAlert.appendChild(msg);
	document.body.appendChild(newAlert);
	$("#alert").css("opacity", "0");

	setTimeout(function() {
			removeOldAlert();
	}, 4000);
}

function removeOldAlert() {
	var oldAlert = document.getElementById("alert");
	if (oldAlert) {
			document.body.removeChild(oldAlert);
	}
}
