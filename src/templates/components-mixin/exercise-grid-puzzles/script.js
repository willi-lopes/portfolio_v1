events.on('ready', function() {
    $('.exercise-grid-puzzles').each(function(indice, item) {
		createGridPuzzles($(item));
	});
});

function createGridPuzzles(gameItem) {
    var feedObj = null;
    var feedModal = ($(gameItem).attr('feedmodal')) ? $(gameItem).attr('feedmodal') : false;
    console.log(feedModal)
    reset();

    function reset() {
        if( feedModal )   
            $(gameItem).find('.feedback').addClass('hide');  
    }   

	gameItem.find('.grid-puzzles').each(function(indice, item) {
        var element = $(item);
        
        element.find('.cell').on('click', function() {
            var col = $(this).attr('data-col');

            if ( !$(this).attr('status') ) {
                $(this).text('✖');
                $(this).attr('status', '✖');
            } else if ( $(this).attr('status') == '✖' ) {
                gameItem.find(`[data-col=${col}]`).text('✖');
                gameItem.find(`[data-col=${col}]`).attr('status', '✖');
                $(this).parent().find('.cell').text('✖');
                $(this).parent().find('.cell').attr('status', '✖');
                $(this).text('✔');
                $(this).attr('status', '✔');
            } else {
                gameItem.find(`[data-col=${col}]`).text('');
                gameItem.find(`[data-col=${col}]`).removeAttr('status');
                $(this).parent().find('.cell').text('');
                $(this).parent().find('.cell').removeAttr('status');
                $(this).text('');
                $(this).removeAttr('status');
            }

            verifyConfirm();

        });
    });

    function verifyConfirm() {
        var status = null;
        var allCounter = 0;
        var allRow = gameItem.find('.grid-puzzles').find('.row').length;

        gameItem.find('.grid-puzzles').find('.row').each(function( indice, it ) {
            $(it).find('.cell').each(function( indice, rowIt ) {
                if ( $(rowIt).attr('status') == '✔' ) {
                    allCounter++;
                }
            });
        });

        if ( allRow == allCounter ) {
            gameItem.find('.btn-responder').removeClass('hide');
        } else {
            gameItem.find('.btn-responder').addClass('hide');
        }
    }

    gameItem.find('.btn-responder').on('click', function() {
        $(this).addClass('hide');
        var response =  true;

        gameItem.find('.grid-puzzles').find('.cell').each(function( indice, item ) {
            var res = $(this).attr('data-res');
            var row = $(this).attr('data-row');
            var status = $(this).attr('status');

            if ( !status ) {
                response = false;
                $(this).addClass('neg');
            }
            if ( res == row && status == '✖' ) {
                response = false
                $(this).addClass('neg');
            }
            if ( res != row && status == '✔' ) {
                response = false
                $(this).addClass('neg');
            }
            if ( res == row && status == '✔' ) {
                $(this).addClass('pos');
            }
            if ( res != row && status == '✖' ) {
                $(this).addClass('pos');
            }
        });

        // alert(response);
        if ( response ) {
            feedObj = 'feedback-positive';
        } else {
            feedObj = 'feedback-negative';
            clearPuzzle();
        }

        if( feedModal )
            var feedContain = $(gameItem).find('.'+feedObj);
            $("body").trigger('openModal', [feedContain]);
    });

    $(gameItem).find('.modal-close').on('click focusin', function() {
        reset();
        var feedContain = $(gameItem).find('.'+feedObj);
        $("body").trigger('closeModal', [feedContain]);
    });

    gameItem.find('.btn-limpar').on('click', function() {
        clearPuzzle();
    });

    function clearPuzzle() {
        gameItem.find('.cell').text(' ');
        gameItem.find('.cell').attr('status', '');
        $('body').trigger('clearPuzzle', [gameItem]);
    }
}
