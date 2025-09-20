vlibrasInit();
events.on('ready', function() {
	var engine_config = navigate.currentScreen.model.acessibility;
	if (engine_config) {
			if (!engine_config.vlibras) { // REMOVENDO O VLIBRAS, CASO ESTIVER CONFIGURADO COMO FALSE.
					$(".vlibras").remove();
			}
	}
});

function vlibrasInit(){

	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { //Caso seja IE
			console.log("Este navegador não suporta o Vlibras.");
	}
	else {

		$('body').prepend(`
				<div vw class="enabled vlibras">
						<div vw-access-button class="active"></div>
						<div vw-plugin-wrapper>
								<div class="vw-plugin-top-wrapper"></div>
						</div>
				</div>
		`)
		$.getScript('https://vlibras.gov.br/app/vlibras-plugin.js', function() {
				new window.VLibras.Widget('https://vlibras.gov.br/app');
		});

	}
}
