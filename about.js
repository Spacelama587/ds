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

// Add animations to the timeline
headerTimeline
    .to(".about-header h1", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    })
    .to(".about-header p", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.6");

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

// Content section animations
gsap.to('.image-side', {
    opacity: 1,
    x: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '.content-section',
        start: 'top bottom-=100',
        toggleActions: 'restart none none none'
    }
});

gsap.to('.text-side', {
    opacity: 1,
    x: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
        trigger: '.content-section',
        start: 'top bottom-=100',
        toggleActions: 'restart none none none'
    }
});

// Content image scale animation
gsap.to('.image-side img', {
    scale: 1,
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
        trigger: '.content-section',
        start: 'top bottom',
        end: 'center center',
        scrub: 1
    }
});

// Stats counter animation
const statNumbers = document.querySelectorAll('.stat-number');
statNumbers.forEach(stat => {
    const targetValue = parseInt(stat.textContent);
    gsap.fromTo(stat, 
        { innerText: 0 },
        {
            innerText: targetValue,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: '.stats',
                start: 'top 80%',
                toggleActions: 'restart none none none'
            }
        }
    );
});

// Scroll progress indicator
const updateScrollProgress = () => {
    const pixelsScrolled = window.scrollY;
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (pixelsScrolled / totalScroll) * 100;
    document.querySelector('.scroll-indicator').textContent = 
        `Scroll Progress: ${Math.min(100, Math.round(scrollProgress))}%`;
};

window.addEventListener('scroll', updateScrollProgress);

// Initial call to set scroll indicator on page load
updateScrollProgress();