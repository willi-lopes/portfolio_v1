var configLibras;
var arrVideosLibras = [];
var view = null;
var player;

events.on('ready', function () {

});

var searchDataLibras = function (_view) {
    view = _view;
    $(view.document).find("*").each(function () {
        var librasData = $(this).data("libras");
        if (librasData) {
            $(this).click(function () {
                var librasDataIn = $(this).data("libras");
                callLibras(librasDataIn);
            });
        }
    });
}

var initLibras = function (configObj) {
    configLibras = configObj;
}

var callVimeoData = async function () {
    if (configLibras.vimeoAPICall) {
        var arrData = [];
        let page = 1;
        var jsonDataMod = await callVimeoApi(page);
        console.log(jsonDataMod);
        arrData = jsonDataMod.data;
        var totalPages = Math.ceil(jsonDataMod.total / jsonDataMod.per_page);
        while (totalPages > page) {
            page++;
            const videos = await callVimeoApi(page)
            arrData = [...arrData, ...videos.data];
        }

        return arrData;
    } else {
        $.getJSON(`../../data/libras.json`, function (data) {
            arrVideosLibras = data.librasGroup;
            var lastCalled = scorm.loadObject("lastLibrasCalled");
            setTimeout(function () {
                if (view) {
                    callLibras(lastCalled);
                }
            }, 1000)
        });
    }
}

var callVimeoApi = function (page) {
    const VIDEOS_POR_PAGINA = 100;
    var body = {
        "grant_type": "Implicit",
        "access_token": configLibras.vimeo_acess_token,
        "token_type": "Bearer",
        "user": configLibras.vimeo_user_id
    };
    return $.ajax({
        url: 'https://api.vimeo.com/me/projects/' + configLibras.vimeo_folder_id + '/videos?per_page=' + VIDEOS_POR_PAGINA + '&page=' + page,
        type: "GET",
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/vnd.vimeo.*+json;version=3.4');
            xhr.setRequestHeader('Authorization', "Basic " + btoa(configLibras.vimeo_client_id + ":" + configLibras.vimeo_client_secret));
            xhr.setRequestHeader('Authorization', "Bearer " + configLibras.vimeo_acess_token)
        },
        data: body,
        crossDomain: true,
    })
}

var callYoutubeApi = function (dados) {
    const VIDEOS_POR_PAGINA = 100;
    const KEY = configLibras.youtube_key;
    const IDCANAL = configLibras.youtube_id_canal;

    var urlApiYoutube = "https://www.googleapis.com/youtube/v3/search?key=" + KEY + "&channelId=" + IDCANAL + "&part=snippet,id&order=date&maxResults=" + VIDEOS_POR_PAGINA;

    return urlApiYoutube;
}


var setActiveLibrasBt = function (btnLibras) {
    btnLibras.click(function () {
        activeLibras();
    });
}

var activeLibras = function () {
    scorm.saveObject("librasActive", true);
    $(".librasDiv").fadeIn();
    $(".librasDiv").css("display", "flex");

    if (arrVideosLibras.length == 0) {
        var lastCalled;
        var newHtml = `<img style='width:4em; margin-right:1em;' src='../../assets/img/hand_anima.gif'/></div><div>Aguarde, carregando Libras...</div><div>`;

        $(".librasDiv").find('.video').html(newHtml);
        setTimeout(async function () {
            lastCalled = scorm.loadObject("lastLibrasCalled");

            if (lastCalled == undefined || lastCalled == null || lastCalled == "") {
                scorm.saveObject("lastLibrasCalled", view.uid)
            }

            if (configLibras.type == "vimeo" && configLibras.vimeoAPICall == true) {
                arrVideosLibras = await callVimeoData();
                callLibras(lastCalled);

                //Descomentar o console.log para copiar json vindo do vímeo e deixar o json local, deixar no config da lib a propriedade vimeoAPICall como false, para a aplicação buscar o arquivo libras.json dentro da pasta data.
                console.log(JSON.stringify(arrVideosLibras));
            } else {
                callVimeoData();
            }
        }, 500);
    } else {
        setTimeout(function () {
            lastCalled = scorm.loadObject("lastLibrasCalled");
            callLibras(lastCalled);
        }, 1000);
    }
}

var findVimeoEmbedByName = function (videoName) {
    for (var obj in arrVideosLibras) {
        if (arrVideosLibras[obj].name.toUpperCase() == videoName.toUpperCase()) {
            //return arrVideosLibras[obj].embed.html;
            return arrVideosLibras[obj].uri.split("/")[2];
        }
    }
}

var closeLibras = function () {
    scorm.saveObject("librasActive", false);
    $(".librasDiv").css("display", "none");

    if (player) {
        player.pause();
        player.setCurrentTime(0);
    }

    $(".librasDiv").find('.video').empty();
}

var setLibrasVideo = function (html_video) {
    $(".librasDiv").find('.video').empty();
    $(".librasDiv").find('.video').html(html_video);
    var videoVimeo = view.document.getElementById('vimeo_player');
    var videoYoutube = view.document.getElementById('youtube_player');

    if (videoVimeo) {
        player = new Vimeo.Player(videoVimeo);
        player.ready().then(function () {
            player.setVolume(0);
        });
    }

    if (videoYoutube) {
        player = new YT.Player('player', {
            videoId: 'M7lc1UVf-VE',
            playerVars: {
                'autoplay': 0,
                'rel': 0,
                'showinfo': 0
            }
        });
    }
}

var callLibras =  function (url) {
    scorm.saveObject("lastLibrasCalled", url);
    if (arrVideosLibras.length > 0 && scorm.loadObject("librasActive") == true) {
        console.log("*Libras ID: " + url);

        var newHtml;
        const {type} = configLibras;

        if (type == "vimeo") {
            var videoID = findVimeoEmbedByName(url);
            const [video, id] = videoID.split(":");

            newHtml = `<iframe id="vimeo_player" src="https://player.vimeo.com/video/${video}?h=${id}&amp;autoplay=1&amp;loop=0&amp;autopause=0&amp;title=0&amp;byline=0&amp;portrait=0&amp;speed=1&amp;muted=1" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;

            if (videoID == undefined) {
                newHtml = `<img style='width:4em; margin-right:1em;' src='../../assets/img/hand_anima.gif'/></div><div>Vídeo não encontrado.</div>`
            }

        } else if (type == "mp4") {
					newHtml = `<video width="100%" height="100%" controls autoplay muted src="../../assets/video/${url}.mp4" type="video/mp4"></video>`;

        } else if (type == "gif") {
            newHtml = `<img src="../../assets/img/${url}.gif"/>`;

        } else if (type == "youtube") {
            var urlYoutube = callYoutubeApi();

            $.getJSON(urlYoutube,  function (data) {
                for (var i in data.items) {
                    var tituloVideo = data.items[i]["snippet"].title;
                    var IDVideo = data.items[i]["id"].videoId;

                    if (tituloVideo == url) {
                        newHtml = `<iframe id="youtube_player" src="https://www.youtube.com/embed/${IDVideo}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                    }
                }
            });
        }

        setTimeout(function () {
            setLibrasVideo(newHtml);
        }, 500);

    } else if (scorm.loadObject("librasActive") == true) {
        setTimeout(function () {
            var lastCalled = scorm.loadObject("lastLibrasCalled");
            callLibras(lastCalled);
        }, 500);
    }
}
