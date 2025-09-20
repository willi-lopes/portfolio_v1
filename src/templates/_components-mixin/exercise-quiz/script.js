events.on("ready", function () {
  $(".container-exercise-quiz").each(function (indice, item) {
    //console.log('quiz ' + window.uid + ' ' + indice);

    var _template = this;
    var currentID = indice;
    var uidPAGE = window.uid;
    var countAlternativesCorrect = 0;
    var repeat = 0;
    var repeatCache = 0;
    var repeatInit = 0;
    var random = $(_template).attr("random")
      ? $(_template).attr("random")
      : false;
    var direct = $(_template).attr("direct")
      ? $(_template).attr("direct")
      : false;
    var standardBtn = $(_template).attr("standardBtn")
      ? $(_template).attr("standardBtn")
      : false;
    var repeatBtn = $(_template).attr("repeatBtn")
      ? $(_template).attr("repeatBtn")
      : false;
    var cacheBtn = $(_template).attr("cacheBtn")
      ? $(_template).attr("cacheBtn")
      : false;
    var pesoQuestion = $(_template).attr("peso")
      ? $(_template).attr("peso")
      : -1;
    var feedObj = null;
    var feedRes = null;
    var buzzfeedStatus = $(_template).hasClass("children-buzzfeed");

    var pesoActive = false;
    var infoCache = false;
    var tentativaRes = 0;

    if ($(_template).attr("repeat")) {
      repeat = parseInt($(this).attr("repeat"));
      repeatInit = parseInt($(this).attr("repeat"));
      repeatCache = parseInt($(this).attr("repeat"));
    }

    reset();
    getCache();

    if (random) {
      $(_template)
        .find(".wrapper-altervatives")
        .html(
          $(_template)
            .find(".wrapper-altervatives .container-alternative")
            .sort(function () {
              return Math.random() - 0.5;
            })
        );
    }

    function reset() {
      $(_template).find(".feedback").addClass("hide");

      if (standardBtn != false) {
        $(_template).find(".button-confirm .txtBtn").css("display", "none");
        $(_template)
          .find(".button-confirm .txtConfirm")
          .css("display", "block");
        // $(_template).find('.button-confirm').html(standardBtn);
      }

      countAlternativesCorrect = 0;
      $(_template)
        .find(".container-alternative")
        .each(function () {
          if (parseInt($(this).attr("status-alternative")) == 1) {
            countAlternativesCorrect++;
          }
        });
    }

    $(_template)
      .find(".container-alternative")
      .on("click", function () {
        if (countAlternativesCorrect == 1) {
          $(_template).find(".container-alternative").removeClass("actived");
        }

        if ($(this).hasClass("actived")) {
          $(this).removeClass("actived");
        } else {
          $(this).addClass("actived");
        }

        if (!direct) {
          $(_template).find(".button-confirm").removeClass("hide");
        } else {
          callFeed();
        }
      });

    $(_template)
      .find(".button-confirm")
      .on("click", function () {
        callFeed();
      });

    function callFeed() {
      var countQuestionResponse = 0;
      var pesoAlternativa = 0;

      $(_template)
        .find(".actived")
        .each(function () {
          if (parseInt($(this).attr("status-alternative")) == 1) {
            countQuestionResponse++;
          } else {
            countQuestionResponse--;
          }

          if ($(this).attr("peso-alternative")) {
            pesoActive = true;
            pesoAlternativa += parseInt($(this).attr("peso-alternative"));
          }
        });

      if (pesoActive) {
        $(_template).attr("peso-altenative", pesoAlternativa);
      }

      if (countQuestionResponse === countAlternativesCorrect) {
        $(_template).attr("res-feed", 1);
        feedObj = "feedback-positive";
        feedRes = "positive";
        repeat = 0;
      } else {
        $(_template).attr("res-feed", 0);
        feedObj = "feedback-negative";
        feedRes = "negative";
        tentativaRes += 1;

        // Quando a questao tiver refazer é preciso cadastrar
        // cada feed negativo. ex: '.feedback-negative1', '.feedback-negative2' ate 10 Ex.:9999 passa a ser um feed só
        if (repeatInit > 0 && repeatInit <= 10) {
          var feedCurrent = repeatInit - repeat + 1;
          if (
            $(_template).find(".feedback-negative" + feedCurrent).length > 0
          ) {
            feedObj = "feedback-negative" + feedCurrent;
          }
        }
      }

      if (buzzfeedStatus) {
        $(_template).find(".container-alternative").removeClass("actived");
        $(_template).trigger("buzzfeed", [$(_template).attr("res-feed")]);
        $(_template).find(".button-confirm").addClass("hide");
      } else {
        var feedContain = $(_template).find("." + feedObj);
        $("body").trigger("openModal", [feedContain]);

        /// customização para o curso BBRAUN 003360
        $("body").trigger("game", [feedRes, uidPAGE, tentativaRes, infoCache]);
        /// customização para o curso BBRAUN 003360
      }
    }

    ///$(_template).find('.modal-close').on('click', function(){
    $(_template)
      .find(".modal-close")
      .on("click focusin", function () {
        reset();

        if (repeat <= 0) {
          $(_template).find(".container-alternative").addClass("respondido");
          if (cacheBtn != false) {
            // $(_template).find('.button-confirm').html(cacheBtn);
            $(_template).find(".button-confirm .txtBtn").css("display", "none");
            $(_template)
              .find(".button-confirm .txtCache")
              .css("display", "block");
            saveCache();
          }

          if ($(this).attr("arrow_status_class")) {
            $("body").trigger("nextLiberate");
          }
        } else {
          $(_template).find(".container-alternative").removeClass("respondido");

          if (repeatBtn != false) {
            // $(_template).find('.button-confirm').html(repeatBtn);
            $(_template).find(".button-confirm .txtBtn").css("display", "none");
            $(_template)
              .find(".button-confirm .txtRepeat")
              .css("display", "block");
          }

          $(_template).find(".button-confirm").addClass("hide");
          $(_template).find(".container-alternative").removeClass("actived");

          repeat--;
          repeatCache--;
        }

        var feedContain = $(_template).find("." + feedObj);
        $("body").trigger("closeModal", [feedContain]);

        if ($(this).attr("next_page")) {
          navigate.goto($(this).attr("next_page"));
        }
      });

    function getCache() {
      /// Objeto recuperado do suspendata
      if ($(_template).attr("cache")) {
        if (scorm.loadObject("quiz")) {
          //var quiz = JSON.parse(scorm.loadObject('quiz'));
          var quiz = scorm.loadObject("quiz");

          if (quiz.length > 0) {
            $.each(quiz, function (indice, item) {
              if (item.uid == uidPAGE && item.q == currentID) {
                infoCache = true;
                $(_template)
                  .find(".container-alternative")
                  .addClass("respondido");
                $(_template).find(".button-confirm").removeClass("hide");

                if (cacheBtn != false) {
                  //$(_template).find('.button-confirm').html(cacheBtn);
                  $(_template)
                    .find(".button-confirm .txtBtn")
                    .css("display", "none");
                  $(_template)
                    .find(".button-confirm .txtCache")
                    .css("display", "block");
                }

                repeat = 0;
                repeatInit = 0;
                repeatCache = 0;

                $(_template)
                  .find(".container-alternative")
                  .each(function (indice, alten) {
                    var altCache = item.a;
                    for (var i = 0; i <= altCache.length; i++) {
                      if ($(alten).attr("alt-ind") == altCache[i]) {
                        $(alten).addClass("actived");
                      }
                    }
                  });
              }
            });
          }
        }
      }
    }

    function saveCache() {
      //// informação para caso precise salvar no suspendata
      if ($(_template).attr("cache")) {
        var quiz = [];
        var alternativaCache = [];
        if (scorm.loadObject("quiz")) {
          //quiz = JSON.parse(scorm.loadObject('quiz'));
          quiz = scorm.loadObject("quiz");
        }

        $(_template)
          .find(".container-alternative")
          .each(function (indice) {
            if ($(this).hasClass("actived")) {
              alternativaCache.push($(this).attr("alt-ind"));
            }
          });

        $.each(quiz, function (indice, it) {
          try {
            if (it && it["uid"] == uidPAGE && it["q"] == currentID) {
              quiz.splice(indice, 1);
            }
          } catch (e) {
            // declarações para manipular quaisquer exceções
            console.error("erro no array do quiz", e); // passa o objeto de exceção para o manipulador de erro
          }
        });

        var _obj = {
          uid: uidPAGE,
          q: currentID,
          a: alternativaCache,
          r: parseInt($(_template).attr("res-feed")),
          t: repeatInit - repeatCache,
        };

        //Peso da Questao
        if (pesoQuestion > -1) {
          if (_obj.r == 1) {
            _obj.pq = parseInt(pesoQuestion);
          } else {
            _obj.pq = 0;
          }
        }

        //Peso das Alternativas
        if (pesoActive) {
          var peso_alt = $(_template).attr("peso-altenative");
          _obj.pa = parseInt(peso_alt);
        }

        quiz.push(_obj);

        //console.log(quiz);
        //scorm.saveObject('quiz', JSON.stringify(quiz));
        scorm.saveObject("quiz", quiz);
        questionTrigger();
      }
    }
  });

  questionTrigger();

  function questionTrigger() {
    if (scorm.loadObject("quiz")) {
      //var quiz = JSON.parse(scorm.loadObject('quiz'));
      var quiz = scorm.loadObject("quiz");
      var quizOpen = [];
      var totalQestao = quiz.length;
      var totalErros = 0;
      var totalCorretas = 0;
      var pesoQuestao = 0;
      var pesoQuestaoStatus = false;
      var pesoAlternativa = 0;
      var pesoAlternativaStatus = false;

      $.each(quiz, function (indice, item) {
        var it_quiz = {
          uidPAGE: item.uid,
          currentID: item.q,
          alternativas: item.a,
          status: item.r,
          tentativas: item.t,
        };

        if (item.r == 0) totalErros += 1;
        if (item.r == 1) totalCorretas += 1;
        if (item.pq) {
          pesoQuestao += parseInt(item.pq);
          pesoQuestaoStatus = true;
          it_quiz.pesoQuestao = item.pq;
        }
        if (item.pa) {
          pesoAlternativa += parseInt(item.pa);
          pesoAlternativaStatus = true;
          it_quiz.pesoAlternativa = item.pa;
        }

        quizOpen.push(it_quiz);
      });

      var obj = {
        quiz: quizOpen,
        total: totalQestao,
        erradas: totalErros,
        corretas: totalCorretas,
        porcentagem: parseInt((totalCorretas / totalQestao) * 100),
        totalPesoQuestao: 0,
        totalPesoAlternativas: 0,
      };

      if (pesoQuestaoStatus) {
        obj.totalPesoQuestao = pesoQuestao;
      }

      if (pesoAlternativaStatus) {
        obj.totalPesoAlternativas = pesoAlternativa;
      }

      //console.log(obj);
      events.emit("quiz", obj);
    }
  }
});

events.on("quiz", function (e) {
  // console.log('quiz');
  // console.log(e);
});

// var e = {current:''};
//events.emit('read-quiz', e);
//console.log(e);
events.on("read-quiz", function (e) {
  var obj = {};

  if (scorm.loadObject("quiz")) {
    //var quiz = JSON.parse(scorm.loadObject('quiz'));
    var quiz = scorm.loadObject("quiz");
    var quizOpen = [];
    var totalQestao = quiz.length;
    var totalErros = 0;
    var totalCorretas = 0;
    var pesoQuestao = 0;
    var pesoQuestaoStatus = false;
    var pesoAlternativa = 0;
    var pesoAlternativaStatus = false;

    $.each(quiz, function (indice, item) {
      var it_quiz = {
        uidPAGE: item.uid,
        currentID: item.q,
        alternativas: item.a,
        status: item.r,
        tentativas: item.t,
      };

      if (item.r == 0) totalErros += 1;
      if (item.r == 1) totalCorretas += 1;
      if (item.pq) {
        pesoQuestao += parseInt(item.pq);
        pesoQuestaoStatus = true;
        it_quiz.pesoQuestao = item.pq;
      }
      if (item.pa) {
        pesoAlternativa += parseInt(item.pa);
        pesoAlternativaStatus = true;
        it_quiz.pesoAlternativa = item.pa;
      }

      quizOpen.push(it_quiz);
    });

    obj = {
      quiz: quizOpen,
      total: totalQestao,
      erradas: totalErros,
      corretas: totalCorretas,
      porcentagem: parseInt((totalCorretas / totalQestao) * 100),
      totalPesoQuestao: 0,
      totalPesoAlternativas: 0,
    };

    if (pesoQuestaoStatus) {
      obj.totalPesoQuestao = pesoQuestao;
    }

    if (pesoAlternativaStatus) {
      obj.totalPesoAlternativas = pesoAlternativa;
    }
  }

  e.current = obj;
});

// events.emit('quiz-reset');
events.on("quiz-reset", function () {
  console.log("quiz-reset");
  scorm.removeObject("quiz");
});
