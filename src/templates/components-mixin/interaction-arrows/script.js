events.on('ready', function() {

	var prevHide = $('body').attr('prev-hide');
	var nextHide = $('body').attr('next-hide');
	var prevPage = $('body').attr('prev-page');
	var nextPage = $('body').attr('next-page');

	var prevClass = '.container-arrow-left';
	var nextClass = '.container-arrow-right';

	if (typeof prevHide !== 'undefined' && prevHide !== false) {
		$(prevClass).addClass('hide');
	}

	if (typeof nextHide !== 'undefined' && nextHide !== false) {
			$(nextClass).addClass('hide');
	}

	$(prevClass).on('click', function() {
			if (typeof prevPage !== 'undefined' && prevPage !== false) {
					if (prevPage != 'prev') {
							navigate.goto(prevPage);
					} else {
							navigate.prev();
					}
			} else {
					navigate.prev();
			}
	});

	$(nextClass).on('click', function() {
			if (typeof nextPage !== 'undefined' && nextPage !== false) {
					if (nextPage != 'prev') {
							navigate.goto(nextPage);
					} else {
							navigate.next();
					}
			} else {
					navigate.next();
			}
	});

	/// call modal, arcodeon, slide
	$('body').on('nextLiberate', function(){
		$(nextClass).removeClass('hide');
	})

});
