import {
    simulationVertexShader,
    simulationFragmentShader,
    renderVertexShader,
    renderFragmentShader,
  } from "./shaders.js";
  
  
  document.addEventListener("DOMContentLoaded", () => {
    // Create a container for the canvas with specific dimensions
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.top = '0';
    canvasContainer.style.left = '0';
    canvasContainer.style.width = '100%';
    canvasContainer.style.height = '100vh'; // Use viewport height for hero section
    canvasContainer.style.zIndex = '-1'; // Place below other content
    canvasContainer.style.pointerEvents = 'none'; // Allow clicks to pass through
    document.body.prepend(canvasContainer); // Add to beginning of body
  
    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
  
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement); // Add to container instead of body
  
    const mouse = new THREE.Vector2();
    let frame = 0;
  
    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;
    const options = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };
    let rtA = new THREE.WebGLRenderTarget(width, height, options);
    let rtB = new THREE.WebGLRenderTarget(width, height, options);
  
    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });
  
    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: null },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    });
  
    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    const renderQuad = new THREE.Mesh(plane, renderMaterial);
  
    simScene.add(simQuad);
    scene.add(renderQuad);
  
    // Function to calculate responsive font size based on viewport width
    const calculateFontSize = () => {
      const viewportWidth = window.innerWidth;
      
      // Base font size calculation (adjust these values as needed)
      if (viewportWidth < 480) {
        return Math.min(viewportWidth * 0.35, 50); // For mobile
      } else if (viewportWidth < 768) {
        return Math.min(viewportWidth * 0.30, 180); // For larger mobile/small tablets
      } else if (viewportWidth < 1024) {
        return Math.min(viewportWidth * 0.25, 220); // For tablets
      } else {
        return Math.min(viewportWidth * 0.20, 210); // For desktops
      }
    };
  
    // Function to draw text to canvas with current dimensions
    const drawTextToCanvas = (canvas, ctx) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Clear canvas
      ctx.fillStyle = "#001433";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Calculate responsive font size and apply device pixel ratio
      const fontSize = Math.round(calculateFontSize() * window.devicePixelRatio);
      
      // Draw text
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.textRendering = "geometricPrecision";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillText("deep minds", canvasWidth / 2, canvasHeight / 2);
    };
  
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: true });
    
    // Initial text drawing
    drawTextToCanvas(canvas, ctx);
  
    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.format = THREE.RGBAFormat;
  
    // Debounce function to limit how often resize handler fires
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };
  
    // Resize handler with debounce
    const handleResize = debounce(() => {
      const newWidth = window.innerWidth * window.devicePixelRatio;
      const newHeight = window.innerHeight * window.devicePixelRatio;
  
      renderer.setSize(window.innerWidth, window.innerHeight);
      rtA.setSize(newWidth, newHeight);
      rtB.setSize(newWidth, newHeight);
      simMaterial.uniforms.resolution.value.set(newWidth, newHeight);
  
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Redraw text with new dimensions
      drawTextToCanvas(canvas, ctx);
      textTexture.needsUpdate = true;
    }, 250); // 250ms debounce
  
    window.addEventListener("resize", handleResize);
  
    // Update mouse position tracking to work with canvas container
    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX * window.devicePixelRatio;
      mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
    });
  
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX * window.devicePixelRatio;
        mouse.y = (window.innerHeight - e.touches[0].clientY) * window.devicePixelRatio;
        e.preventDefault(); // Prevent scrolling while interacting with the wave effect
      }
    });
  
    document.addEventListener("mouseleave", () => {
      mouse.set(0, 0);
    });
  
    document.addEventListener("touchend", () => {
      mouse.set(0, 0);
    });
  
    const animate = () => {
      simMaterial.uniforms.frame.value = frame++;
      simMaterial.uniforms.time.value = performance.now() / 1000;
  
      simMaterial.uniforms.textureA.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.render(simScene, camera);
  
      renderMaterial.uniforms.textureA.value = rtB.texture;
      renderMaterial.uniforms.textureB.value = textTexture;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
  
      const temp = rtA;
      rtA = rtB;
      rtB = temp;
  
      requestAnimationFrame(animate);
    };
  
    animate();
    
    // Initialize mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      });
    }
  });