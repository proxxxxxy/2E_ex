document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('scroll-container');
  const introSlide = document.getElementById('intro-slide');
  const topCard = document.getElementById('top-card');
  const videos = document.querySelectorAll('video');

  const formSlide = document.getElementById('form-slide');

  let isIntroVisible = true;
  let isFormVisible = false;

  const updateTopCardVisibility = () => {
    if (!isIntroVisible && !isFormVisible) {
      topCard.classList.add('visible');
    } else {
      topCard.classList.remove('visible');
    }
  };

  // Intersection Observer for visibility
  const observerOptions = {
    root: scrollContainer,
    rootMargin: '0px',
    threshold: 0.1
  };

  const introObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isIntroVisible = entry.isIntersecting;
      updateTopCardVisibility();
    });
  }, observerOptions);

  if (introSlide) {
    introObserver.observe(introSlide);
  }

  const formObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isFormVisible = entry.isIntersecting;
      updateTopCardVisibility();
    });
  }, observerOptions);

  if (formSlide) {
    formObserver.observe(formSlide);
  }

  // Intersection Observer for video autoplay & pause
  const videoObserverOptions = {
    root: scrollContainer,
    rootMargin: '0px',
    threshold: 0.6 // ビデオコンテナ（スライド）が60%以上見えたら再生
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (!video) return;

      if (entry.isIntersecting) {
        // 見えたら最初から再生開始
        video.currentTime = 0;
        video.play().catch(e => console.log('Autoplay prevented by browser:', e));
      } else {
        // 見えなくなったら一時停止
        video.pause();
      }
    });
  }, videoObserverOptions);

  // すべてのステップスライドを監視
  document.querySelectorAll('.step-slide').forEach(slide => {
    videoObserver.observe(slide);
  });

  // PCのマウスホイールで横スクロールできるようにする
  scrollContainer.addEventListener('wheel', (evt) => {
    // 縦スクロールイベントを横スクロールに変換
    if (evt.deltaY !== 0) {
      evt.preventDefault();
      scrollContainer.scrollBy({
        left: evt.deltaY > 0 ? window.innerWidth : -window.innerWidth,
        behavior: 'smooth'
      });
    }
  });
});
