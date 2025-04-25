document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.custom-cursor');
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  
  // Animation for the service items on scroll
  const serviceItems = document.querySelectorAll('.service-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  serviceItems.forEach(item => {
    item.style.opacity = 0;
    item.style.transform = 'translateY(50px)';
    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(item);
  });

  
});
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Create a timeline for the header animations
const headerTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: ".about-header",
        start: "top center",
        toggleActions: "restart none none none"
    }
});

// Expanding image animation with ScrollTrigger
gsap.fromTo('.expanding-image-container', 
  { width: '40%' },
  {
      width: '90%',
      scrollTrigger: {
          trigger: '.expanding-image-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
      }
  }
);

// Image scale animation
gsap.to('.expanding-image', {
  scale: 1,
  scrollTrigger: {
      trigger: '.expanding-image-section',
      start: 'top bottom',
      end: 'center center',
      scrub: 1
  }
});
