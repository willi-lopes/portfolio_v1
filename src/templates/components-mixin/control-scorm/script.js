events.on('ready', function() {

    var scormComplete = $('body').attr('scorm-complete');

    if (typeof scormComplete !== 'undefined' && scormComplete !== false) {

        ///Normalmente usado em ONEPAGE. Ex.: body(prev-hide, next-hide, scorm-complete='#complete-tela') 
        if (scormComplete.indexOf('#') != -1 || scormComplete.indexOf('.') != -1) {

            /// Verifica se fez a tela completa
            $(scormComplete).isInViewportComplete({
                container: window,
                call: function() {
                    console.log('complete one-page');
                    scorm.setCompleted();
                }
            });
        } else {
            ///Normalmente usado na ultima página page-to-page. Ex.: body( next-hide, scorm-complete ) 
            setTimeout(function() {
                scorm.setCompleted();
                console.log('complete page-to-page');
            }, 1000 * 1)
        }
    }
});