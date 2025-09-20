events.on('ready', function() {

	$('.magnet').each(function() {
		var _magnetClass = $(this).attr('magnetClass');
		var _order = $(this).attr('order');

		if( _order == "pre" ){
			$(this).prepend( $('.'+_magnetClass) );
		}else{
			$(this).append( $('.'+_magnetClass) );
		}

	});

	$("video").each(function () {
		var completeVideoReleaseNext = $(this).attr("completeVideoReleaseNext");
		var _video = $(this);

		_video.on("ended", function () {
		if (completeVideoReleaseNext) {
			$("body").trigger("nextLiberate");
		}
		});
	});

	$(".svgBase").each(function () {
		var _path = $(this).attr("svgPath");
		var _this = $(this);

		$.getScript(_path, function (data, textStatus, jqxhr) {
		_this.append(svgBase);
		});
	});

});
