class JogoMemoria {
	static get EVENTS() {
		return {
			COMPLETE: "complete"
		};
	}
	constructor(element) {
		this.element = $(element);
		this.pairs = {};
		this.random = this.element.attr('random');
    this.cache = this.element.attr('cache');
    this.nextLiberate = this.element.attr('nextLiberate');

		this.cards.each((i, card) => {
			$(card).addClass('selected');
			this.pairs[$(card).attr('data-pair')] = false;
			$(card).click(() => this.cardClick(card));
		});

		setTimeout(() => {
			$('.selected').removeClass('selected');
			if (this.random == 'true' || this.random ) {
				setTimeout(() => this.shuffeAll(), 1000);
			}
		}, 2000);
	}

	shuffeAll() {
		this.cards.each((i, card) => {
			if (Math.random() > 0.5) {
				this.element.append($(card));
			}
		});
	}

	cardClick(card) {
		if (this.selected.length < 2) {
			$(card).addClass('selected');
			if (this.selected.length == 2) {
				setTimeout(() => this.validatePairs(), 1000);
			}
		}
	}

	get cards() {
		return this.element.find('.card');
	}

	get selected() {
		return this.cards.filter('.selected');
	}

	validatePairs() {
		var selection = this.selected;
		var card1 = $(selection.get(0));
		var card2 = $(selection.get(1));

		if (card1.attr('data-pair') == card2.attr('data-pair')) {
			selection.addClass('right-selection');
			this.pairs[card1.attr('data-pair')] = true;
		}
		selection.removeClass('selected');
		if (this.isComplete()) {
			this.element.trigger({
				type: JogoMemoria.EVENTS.COMPLETE
			});

      if (this.nextLiberate == 'true' || this.nextLiberate ) {
        $('body').trigger('nextLiberate'); // on in itenraction-arrows.
      }
		}
	}
	isComplete() {
		for (const par in this.pairs) {
			if (this.pairs.hasOwnProperty(par)) {
				const completo = this.pairs[par];
				if (!completo) {
					return false;
				}
			}
		}
		return true;
	}
}
window.JogoMemoria = JogoMemoria;

var game;
events.on('ready',function () {
	var memoria_element = $('.exercise-memory').first();
	game = new JogoMemoria(memoria_element);

	memoria_element.on(JogoMemoria.EVENTS.COMPLETE, function(){
		//jogo finalizado
	})
});
