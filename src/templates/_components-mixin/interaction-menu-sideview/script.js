events.on('ready', function() {

  var menu_sideview = $('.component-menu-sideview');
  var btnClass = (menu_sideview.attr('btnClass')) ? "." + menu_sideview.attr('btnClass') : '.menu-sideview-btn';

  menu_sideview.attr('sideview-status', 'off');
  $(btnClass).on('click', function(){

      if( menu_sideview.attr('sideview-status') == 'off' ){
        menu_sideview.attr('sideview-status', 'on');
      }else{
        menu_sideview.attr('sideview-status', 'off');
      }
  })

  $('.closeMenuBtn').on('click', function(){
    menu_sideview.attr('sideview-status', 'off');
  })

  //criaçao via JSON
  if( menu_sideview.attr('json') ){
    var path = menu_sideview.attr('json');

    $.getJSON( "../../data/"+ path, function( data ) {
      createSideView(data);
    });

  }else{

    //criaçao via attributos na sections
    createSideObj();
  }

  function createSideObj(){

    var sideView = [];

    $('[sideview-n1]').each(function(){

      $(this).isInViewportComplete({
          container: window,
          released: true,
          call: function(e) {
              $('a[href^="#"]').removeClass('active');
              $(`a[href^="#${$(e).attr('id')}"]`).addClass('active');
          }
      });

      var _n1 = {
        title: $(this).attr('sideview-n1'),
        id: $(this).attr('id'),
        type: 'hashtag',
        n2:[]
      }

      var addObj = true;
      $.each( sideView, function(index, item){
        if(item.title == _n1.title )
          addObj = false;
      })

      if(addObj){
        sideView.push(_n1);
      }
    });

    $('[sideview-n2]').each(function(){

      var n1 = $(this).attr('sideview-n1');

      var _n2 = {
        title: $(this).attr('sideview-n2'),
        type: 'hashtag',
        id: $(this).attr('id')
      }

      $.each( sideView, function(index, item){
        if(item.title == n1 ){
          item.n2.push(_n2);
          delete item.id;
          delete item.type;
        }
      })

    });

    $.each( sideView, function(index, item){
      if(item.n2.length == 0)
        delete item.n2;
    })

    createSideView(sideView);

  }

  function createSideView(sideView){

    console.log(sideView);
    var _parentSide = $('.sidebarMenuContainer');
    $.each( sideView, function(index, item){

      if(!item.id){
        _parentSide.append(`
          <li class="dropdown dropdown${index}">
            <a data-toggle="dropdown">${item.title} <i class="icon-arrow"></i></a>
            <ul class="dropdown-menu"></ul>
          </li>`)

        $.each( item.n2, function(indexN2, itemN2){

          var event = `href="#${itemN2.id}"`;
          if(itemN2.type == 'page'){
            event = `type=${ itemN2.type } page=${ itemN2.id }`
          }

          var classActive=""
          if(itemN2.id == navigate.currentScreenUid)
            classActive = " active ";

          $(`.dropdown${index} .dropdown-menu`).append(`
            <li>
              <a class="titleClick ${classActive}" ${event} >${itemN2.title}</a>
            <li>`)
        });
      }else{

        var event = `href="#${item.id}"`;
        if(item.type == 'page'){
          event = `type=${ item.type } page=${ item.id }`
        }

        var classActive=""
          if(item.id == navigate.currentScreenUid)
            classActive = " active ";

        _parentSide.append(`
        <li class="dropdown dropdown${index}">
          <a class="titleClick ${classActive}" ${event} data-toggle="dropdown">${item.title}</a>
        </li>`)
      }

    })

    $('[data-toggle="dropdown"]').on('click', function(){

      var _parent = $(this).parent();
      var _menu = _parent.find('.dropdown-menu');
      var _arrow = $(this).find('.icon-arrow');

      if(!_menu.hasClass('show-side')) {
        _menu.addClass('show-side');
        _menu.removeClass('hide-side');
        _arrow.addClass('open-side');
        _arrow.removeClass('close-side');
      }
      else {
        _menu.removeClass('show-side');
        _menu.addClass('hide-side');
        _arrow.removeClass('open-side');
        _arrow.addClass('close-side');
      }

    });

    $('.titleClick').on('click', function(){

      if( $(this).attr('type') == 'page' ){
        navigate.goto( $(this).attr('page') );
      }

      menu_sideview.attr('sideview-status', 'off');
      $('.titleClick').removeClass('active');
      $(this).addClass('active');

    });

  }



})
