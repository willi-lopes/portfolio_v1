events.on('ready', function() {

  var sequ_help = $( ".interaction-sequencial-help" );
  var btnClass = (sequ_help.attr('btnClass')) ? "." + sequ_help.attr('btnClass') : '.sequencial-help-btn';
  var oboarding = (sequ_help.attr('oboarding')) ? sequ_help.attr('oboarding') : false;

  $( btnClass ).on('click', function(){

    $( ".modal-sequencial-help .owl-carousel" ).trigger('to.owl.carousel', [0, 200] );
    $("body").trigger('openModal', [$( ".modal-sequencial-help" )]);

  });

  $(".modal-sequencial-help .owl-nav").css('display', 'none');
  setTimeout(function(){
    resetOwlPrev();
  }, 1000* 1 );

  function resetOwlPrev() {
    $(".modal-sequencial-help .owl-nav").css('display', 'block');

    $(".modal-sequencial-help .owl-next").empty();
    $(".modal-sequencial-help .owl-next").append("<img width='100%' height='100%' src='../../assets/img/proximo-help.svg'/>");

    $(".modal-sequencial-help .owl-prev").empty();
    $(".modal-sequencial-help .owl-prev").append("<img width='100%' height='100%' src='../../assets/img/volta-help.svg'/>");
  }

  //$(".modal-sequencial-help .modal-close" ).on('click mousedown touchstart focusin', function() {
	$(".modal-sequencial-help .modal-close" ).on('click focusin', function() {
    $("body").trigger('closeModal', [$( ".modal-sequencial-help" )] );
  })

  $( ".modal-sequencial-help .owl-carousel" ).on('changed.owl.carousel', function(event) {

      try{
        if(event.item.index >= 0){

          $( ".modal-sequencial-help .owl-carousel video" ).each(function() {
              $(this).get(0).pause();
          });

          $( ".modal-sequencial-help .owl-carousel video" )[event.item.index].currentTime = 0;
          $( ".modal-sequencial-help .owl-carousel video" )[event.item.index].play();

        }
      }catch (e) {

      }

  });


  if(oboarding){

    if( !scorm.get('oboarding') ){

      $( ".modal-sequencial-help" ).removeClass('hide');
      $("body").trigger('openModal', [$( ".modal-sequencial-help" )]);

      //
      scorm.set('oboarding', true);

      $( ".modal-sequencial-help .owl-carousel video" ).each(function() {
        $(this).get(0).play();
      });
    }
  }


})
