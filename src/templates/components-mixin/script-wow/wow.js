////////////////////////////////////
// controle customizado do WOW ////
//////////////////////////////////

// $('.pulse').addClass('animated pulse infinite');
// $('.zoomIn').addClass('animated zoomIn');
// $('.heartBeat').addClass('animated heartBeat');
// $('.left').addClass('animated fadeInLeft');
// $('.right').addClass('animated fadeInRight');
// $('.down').addClass('animated fadeInDown');
// $('.up').addClass('animated fadeInUp');
// $('.in').addClass('animated fadeIn');

$('.pulse').addClass('wow pulse infinite');
$('.zoomIn').addClass('wow zoomIn');
$('.heartBeat').addClass('wow heartBeat');
$('.left').addClass('wow fadeInLeft');
$('.right').addClass('wow fadeInRight');
$('.down').addClass('wow fadeInDown');
$('.up').addClass('wow fadeInUp');
$('.in').addClass('wow fadeIn');

$('.wow_pulse').addClass('wow pulse infinite');
$('.wow_zoomIn').addClass('wow zoomIn');
$('.wow_heartBeat').addClass('wow heartBeat');
$('.wow_left').addClass('wow fadeInLeft');
$('.wow_right').addClass('wow fadeInRight');
$('.wow_down').addClass('wow fadeInDown');
$('.wow_up').addClass('wow fadeInUp');
$('.wow_in').addClass('wow fadeIn');

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

for (var i = 1; i < 50; i++) {
    var tempo = i / 2;
    $('.delay' + i).css('animation-delay', tempo + 's');
    $('.delay' + i).addClass('delay_tablet delay_mobile');
    if ( resolucaoMin ){
        $('.wow').css('animation-delay','0s');
    }
}



events.on('ready', function() {

  $.getScript('../../scripts/wow.min.js', function() {
        var wow = new WOW({
          boxClass: 'wow', // animated element css class (default is wow)
          animateClass: 'animated', // animation css class (default is animated)
          offset: 0, // distance to the element when triggering the animation (default is 0)
          mobile: true, // trigger animations on mobile devices (default is true)
          live: true, // act on asynchronously loaded content (default is true)
          callback: function(box) {
              // the callback is fired every time an animation is started
              // the argument that is passed in is the DOM node being animated
          },
          scrollContainer: null, // optional scroll container selector, otherwise use window,
          resetAnimation: true, // reset animation on end (default is true)
      });
      wow.init();
  });


    ///controle para funcões de acessibilidade.
    ///Ps.: O elemento precisa existir na tela para tabindex funcionar.
    $(document).on('keydown', function(e) {
        let key = e.which || e.keyCode;

        if (key == 9 || key == 37 || key == 38 || key == 39 || key == 40) {
            $('.wow').css('visibility', 'visible');
            $('.wow').removeClass('wow');
        }
    });
});
