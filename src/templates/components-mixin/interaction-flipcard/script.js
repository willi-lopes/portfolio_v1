events.on('ready', function() {

	adapt_flip();
	var resizeId;
	$(window).resize(function() {
			clearTimeout(resizeId);
			resizeId = setTimeout(function() {
					adapt_flip();
			}, 100);
	});

	function adapt_flip(){
		$('.container-item-flipcard').each(function() {

			$(this).find('.container-item-card').css('height','auto');

			var front = $(this).find('.front .container-item-card');
			var back = $(this).find('.back .container-item-card');
			var frontRect = front[0].getBoundingClientRect();
			var backRect = back[0].getBoundingClientRect();

			if( !back.attr('stFlip') ){
				if( front.height() > back.height()){
					back.css('min-height', frontRect.height );
					back.attr('stFlip', 'front');
				}
				else {
					front.css('min-height', backRect.height );
					back.attr('stFlip', 'back');
				}

			}else{
				if( back.attr('stFlip') == 'front' ){
					back.css('min-height', frontRect.height );
				}else{
					front.css('min-height', backRect.height );
				}
			}

		})
	}

	$('.flip-click').each(function(indice, item) {
		$( item ).on('click', function(){
			$(this).toggleClass("flip-active");
		});
	})

})


