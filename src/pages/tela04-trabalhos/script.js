$(document).ready(function() {
  // Inicializar todos os grids na página
  function initAllImageGrids() {
    $('.image-grid-component').each(function() {
      initImageGrid($(this));
    });
  }

  // Inicializar um grid específico
  function initImageGrid($grid) {
    const gridId = $grid.attr('data-grid-id') || 'grid-' + Math.random().toString(36).substr(2, 9);
    $grid.attr('data-grid-id', gridId);
    
    // Elementos do grid atual
    const $featuredImg = $grid.find('.featured-img');
    const $featuredImageContainer = $grid.find('.featured-image');
    const $imageTitle = $grid.find('.image-title');
    const $imageDesc = $grid.find('.image-desc');
    const $thumbnails = $grid.find('.thumbnail');

    // Adicionar evento de clique às miniaturas
    $thumbnails.on('click', function() {
      const index = $(this).data('index');
      const title = $(this).data('title');
      const description = $(this).data('desc');
      const imageSrc = $(this).find('img').attr('src').replace('300', '1000');
      
      changeFeaturedImage($grid, index, imageSrc, title, description);
    });

    // Ativar a primeira miniatura por padrão
    $thumbnails.first().addClass('active');
    
    // Pré-carregar imagens para melhor performance
    preloadImages($grid);
  }

  // Pré-carregar imagens de um grid específico
  function preloadImages($grid) {
    $grid.find('.thumbnail').each(function() {
      const imageSrc = $(this).find('img').attr('src').replace('300', '1000');
      const img = new Image();
      img.src = imageSrc;
    });
  }

  // Alterar a imagem em destaque de um grid específico
  function changeFeaturedImage($grid, index, imageSrc, title, description) {
    // Elementos do grid atual
    const $featuredImg = $grid.find('.featured-img');
    const $featuredImageContainer = $grid.find('.featured-image');
    const $imageTitle = $grid.find('.image-title');
    const $imageDesc = $grid.find('.image-desc');
    const $thumbnails = $grid.find('.thumbnail');

    // Remover classe active de todas as miniaturas deste grid
    $thumbnails.removeClass('active');
    
    // Adicionar classe active à miniatura clicada
    $thumbnails.eq(index).addClass('active');
    
    // Mostrar indicador de carregamento
    $featuredImageContainer.addClass('loading');
    $featuredImg.addClass('loading');
    
    // Criar uma nova imagem para pré-carregamento
    const newImage = new Image();
    
    newImage.onload = function() {
      // Quando a imagem carregar, atualizar a exibição
      $featuredImg.attr('src', imageSrc);
      $featuredImg.attr('alt', title);
      
      // Ajustar a altura com base na proporção da imagem
      adjustImageSize($grid, newImage.width, newImage.height);
      
      // Atualizar informações
      $imageTitle.text(title);
      $imageDesc.text(description);
      
      // Remover classes de loading e adicionar loaded
      setTimeout(function() {
        $featuredImageContainer.removeClass('loading');
        $featuredImg.removeClass('loading').addClass('loaded');
      }, 300);
    };
    
    newImage.onerror = function() {
      // Em caso de erro, ainda atualizar as informações
      $imageTitle.text(title);
      $imageDesc.text(description);
      
      // Remover loading
      $featuredImageContainer.removeClass('loading');
      $featuredImg.removeClass('loading');
      
      console.error('Erro ao carregar a imagem:', imageSrc);
    };
    
    // Iniciar o carregamento
    newImage.src = imageSrc;
  }

  // Ajustar o tamanho do container com base na proporção da imagem
  function adjustImageSize($grid, width, height) {
    const $featuredImageContainer = $grid.find('.featured-image');
    const ratio = height / width;
    const containerWidth = $featuredImageContainer.width();
    const newHeight = containerWidth * ratio;
    
    // Limitar a altura máxima
    const maxHeight = Math.min(newHeight, window.innerHeight * 0.8);
    
    // Aplicar a altura
    $featuredImageContainer.css('height', maxHeight + 'px');
  }

  // Redimensionar as imagens quando a janela for redimensionada
  $(window).on('resize', function() {
    $('.image-grid-component').each(function() {
      const $grid = $(this);
      const $featuredImg = $grid.find('.featured-img');
      
      if ($featuredImg.hasClass('loaded')) {
        const img = new Image();
        img.src = $featuredImg.attr('src');
        
        img.onload = function() {
          adjustImageSize($grid, img.width, img.height);
        };
      }
    });
  });

  // Navegação por teclado (para o grid com foco)
  $(document).on('keydown', function(e) {
    // Encontrar o grid que está em foco (que contém o elemento ativo)
    const $activeElement = $(document.activeElement);
    const $grid = $activeElement.closest('.image-grid-component');
    
    if ($grid.length === 0) return;
    
    const $thumbnails = $grid.find('.thumbnail');
    const currentActive = $grid.find('.thumbnail.active');
    let currentIndex = currentActive.data('index');
    
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      // Próxima imagem
      currentIndex = (currentIndex + 1) % $thumbnails.length;
      const nextThumb = $thumbnails.eq(currentIndex);
      const title = nextThumb.data('title');
      const description = nextThumb.data('desc');
      const imageSrc = nextThumb.find('img').attr('src').replace('300', '1000');
      
      changeFeaturedImage($grid, currentIndex, imageSrc, title, description);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // Imagem anterior
      currentIndex = (currentIndex - 1 + $thumbnails.length) % $thumbnails.length;
      const prevThumb = $thumbnails.eq(currentIndex);
      const title = prevThumb.data('title');
      const description = prevThumb.data('desc');
      const imageSrc = prevThumb.find('img').attr('src').replace('300', '1000');
      
      changeFeaturedImage($grid, currentIndex, imageSrc, title, description);
    }
  });

  // Inicializar todos os grids
  initAllImageGrids();

  // Debug: Log para verificar se o script está carregando
  console.log('Grid de Imagens Multi-instância carregado com sucesso!');
  console.log('Grids encontrados:', $('.image-grid-component').length);
});