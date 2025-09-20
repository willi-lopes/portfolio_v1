var save_object;
var document_location;
var autoCompleted;
var realProgrees;

events.on('ready', function() {
	
	document_location = navigate.currentScreenUid;
	autoCompleted = $('.progress-line').attr('autoCompleted');
	realProgrees = $('.progress-line').attr('realProgrees');

	bridge.updateLineProgress = function(){
		updateLine();
	}
	
	checkViews();
	updateLine();
	onScroll();

	if(autoCompleted){
		checkCompleted();
	}
	
	$(window).scroll(onScroll);
	
	// var scrollStatus = $('.progress-line').attr('scrollLine');

	// if (!scrollStatus) {
	// 	var countPages = navigate.currentScreen.model.pages.length;
	// 	var actualPage = Math.round(navigate.currentScreen.index + 1);
	// 	var progress = Math.round(100 / countPages * actualPage) + '%';

	// 	$('.progress-line .progress-line-porcentagem').css('width', progress);
	// }
	// else {
	// 	$('.progress-line .progress-line-porcentagem').css('width', 0);

	// 	$(window).on('resize scroll', function(){
	// 		var s = $(window).scrollTop(),
	// 			d = $(document).height(),
	// 			c = $(window).height();
	// 		var scrollPercent = (s / (d - c)) * 100;
	// 		$('.progress-line .progress-line-porcentagem').css('width', parseInt(scrollPercent) + "%");
	// 	});
	// }
})


function updateLine(){
	var scrollStatus = $('.progress-line').attr('scrollLine');
	

	if (!scrollStatus) {
		save_object = scorm.loadObject("save_object");
		var countPages = navigate.currentScreen.model.pages.length;
		var actualPage;

		if(realProgrees){
			actualPage = save_object==undefined?0:save_object.views.length;	
		}else{
			actualPage = Math.round(navigate.currentScreen.index + 1);
		}

		var progress = Math.round(100 / countPages * actualPage) + '%';

		$('.progress-line .progress-line-porcentagem').css('width', progress);
	}else {
		$('.progress-line .progress-line-porcentagem').css('width', 0);

		$(window).on('resize scroll', function(){
			var s = $(window).scrollTop(),
				d = $(document).height(),
				c = $(window).height();
			var scrollPercent = (s / (d - c)) * 100;
			$('.progress-line .progress-line-porcentagem').css('width', parseInt(scrollPercent) + "%");
		});
	}
}

function onScroll() {
	var hasMap = $('.progress-line').attr('trailMap');

    if($(window).scrollTop() + $(window).height() >= ($(document).height() - 200)) {
      if(customIndex(save_object.views, document_location) == -1){
        save_object.views.push(document_location);
        scorm.saveObject("save_object", save_object);
        if(autoCompleted){
			checkCompleted();
		}
		if(hasMap){
			bridge.updateMap();
		}
        bridge.updateLineProgress();
      } 
    }
  }

function checkViews(){
    save_object = scorm.loadObject("save_object");

    if(save_object == undefined || save_object.views == null || save_object.views == "" || save_object.views == undefined){
        save_object = {};
		save_object.views = [];
    }
    scorm.saveObject("save_object", save_object);    
  }

  function checkCompleted(){
	save_object = scorm.loadObject("save_object");

    if(navigate.currentScreen.model.pages.length == save_object.views.length){
        scorm.set("cmi.core.lesson_status", "completed");
    }
  }

  function customIndex(arr, element){
      for(var i=0; i<arr.length; i++){
        if(arr[i] == element){
          return i;
        }
      }

      return -1;
  }
