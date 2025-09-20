$(window).on("beforeunload", function() {
    scorm.quit();
});

$(window).on("unload", function() {
    scorm.quit();
});

$(window).on(VIEW_EVENT.READY, function() {

});