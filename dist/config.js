var config = {
    salvarDados: true,
    debug: false,
    waterMark: false,
    language: 'pt-br',
    video: 'default',
    lms: {
        name: 'default'
    },
    acessibility: {
        tools: false,
        outlines: false,
        vlibras: false,
        customLibras: false
    },
    behaviors: {
        adaptive: false,
        width: 1920,
        height: 1080,
        fontSize: 30
    },
    modalVoltar: {
        active: false,
        msg: 'Você quer continuar de onde parou ou reiniciar o curso?',
        yes: 'CONTINUAR',
        no: 'REINICIAR',
        color: '#0a698d'
    },
    pages: [{
            uid: 'tela01-index',
            src: 'tela01-index/index.html'
        },
        {
            uid: 'tela02-trabalhos',
            src: 'tela02-trabalhos/index.html'
        },
        {
            uid: 'tela03-trabalhos',
            src: 'tela03-trabalhos/index.html'
        },
        {
            uid: 'tela04-trabalhos',
            src: 'tela04-trabalhos/index.html'
        },
        {
            uid: 'tela05-pessoal',
            src: 'tela05-pessoal/index.html'
        }
    ]
};
try {
    module.exports = config;
} catch (e) {}