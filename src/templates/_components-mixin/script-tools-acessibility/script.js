var acessOptions = {
    labels: {
        menuTitle: ' ',
        increaseText: 'Aumentar',
        decreaseText: 'Diminuir',
        increaseTextSpacing: 'Aumentar espaçamento das fontes',
        decreaseTextSpacing: 'Diminuir espaçamento das fontes',
        invertColors: 'Inverter cores',
        grayHues: 'Tonalidade cinza',
        underlineLinks: 'Sublinhar links',
        bigCursor: 'Aumentar o cursor',
        readingGuide: 'reading guide (in my language)',
        textToSpeech: 'text to speech (in my language)',
        speechToText: 'speech to text (in my language)'
    },
    textToSpeechLang: 'pt-BR',
    speechToTextLang: 'pt-BR',
    // textPixelMode: true,
    hotkeys: {
        enabled: true
    },
    icon: {
        circular: true,
        img: '',
        position: {
            top: {
                size: 0,
                units: 'px'
            },
            left: {
                size: 0,
                units: 'px'
            },
            type: 'fixed'
        }
    },
    modules: {
        increaseText: false,
        decreaseText: false,
        invertColors: true,
        increaseTextSpacing: true,
        decreaseTextSpacing: true,
        grayHues: true,
        underlineLinks: true,
        bigCursor: true,
        readingGuide: false,
        textToSpeech: false,
        speechToText: false
    },
    textPixelMode: true
};

events.on('ready', function() {

	var engine_config = navigate.currentScreen.model.acessibility;

	setTimeout(function() {

			if (engine_config.tools) { // CREATE TOOLS
					createTools();
			}

	}, 1000);
});


function createTools() {

	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { //Caso seja IE
			$('.icone-active-help-25').attr("aria-hidden", "true");
			$('.icone-active-help-25').attr("tabindex", -1);
	} else {
			new Accessibility(acessOptions);
			$("._access-icon").empty();
			$('._access-menu').attr("aria-hidden", "true");
			$('._access-menu').attr("tabindex", -1);

			$('._access-menu').find("i").attr("aria-hidden", "true");
			$('._access-menu').find("i").attr("tabindex", -1);

			$('._access-menu').find("ul").attr("aria-hidden", "true");
			$('._access-menu').find("ul").attr("tabindex", -1);

			$('._access-menu').find("ul").find('li').attr("aria-hidden", "true");
			$('._access-menu').find("ul").find('li').attr("tabindex", -1);
	}
}
