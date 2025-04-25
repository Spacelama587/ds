document.addEventListener('mousemove', function(e) {
    const cursorFollow = document.querySelector('.cursor-follow');
    const sectionRect = document.querySelector('.cta-section').getBoundingClientRect();
    
    
    if (e.clientY > sectionRect.top && e.clientY < sectionRect.bottom) {
      const offsetX = (e.clientX / window.innerWidth - 0.5) * 100;
      const offsetY = (e.clientY - sectionRect.top - sectionRect.height/2) * 0.1;
      cursorFollow.style.transform = `translateX(${offsetX}px) translateY(${offsetY}px)`;
    }
  });