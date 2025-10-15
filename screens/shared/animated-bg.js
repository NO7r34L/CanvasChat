/**
 * Animated Background with Anime.js
 * Floating gradient orbs behind blur layer
 */

(function() {
    // Wait for anime.js to be available
    if (typeof anime === 'undefined') {
        console.warn('Anime.js not loaded - animated background disabled');
        return;
    }

    // Create animated background container
    const bgContainer = document.createElement('div');
    bgContainer.id = 'animated-bg';
    bgContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        z-index: -1;
        pointer-events: none;
    `;

    // Create blur layer
    const blurLayer = document.createElement('div');
    blurLayer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(80px);
        -webkit-backdrop-filter: blur(80px);
    `;

    // Color palette - subtle grays and whites with hint of purple
    const colors = [
        'rgba(249, 250, 251, 0.4)',  // Very light gray
        'rgba(243, 244, 246, 0.5)',  // Light gray
        'rgba(229, 231, 235, 0.4)',  // Medium gray
        'rgba(209, 213, 219, 0.3)',  // Darker gray
        'rgba(107, 70, 193, 0.15)',  // Purple hint
        'rgba(167, 139, 250, 0.2)',  // Light purple hint
    ];

    // Create floating orbs
    const orbCount = 8;
    const orbs = [];

    for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        const size = Math.random() * 300 + 200; // 200-500px
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        orb.className = 'floating-orb';
        orb.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, ${color}, transparent);
            left: ${x}px;
            top: ${y}px;
            opacity: 0.6;
            mix-blend-mode: soft-light;
        `;
        
        bgContainer.appendChild(orb);
        orbs.push(orb);
    }

    // Add blur layer on top
    bgContainer.appendChild(blurLayer);

    // Insert into document
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.insertBefore(bgContainer, document.body.firstChild);
            animateOrbs();
        });
    } else {
        document.body.insertBefore(bgContainer, document.body.firstChild);
        animateOrbs();
    }

    // Animate orbs
    function animateOrbs() {
        orbs.forEach((orb, index) => {
            // Create unique animation for each orb
            const duration = 15000 + Math.random() * 10000; // 15-25 seconds
            const delay = index * 500; // Stagger start
            
            // Random movement path
            const moveDistance = 100 + Math.random() * 200;
            const angle = Math.random() * Math.PI * 2;
            
            anime({
                targets: orb,
                translateX: [
                    { value: Math.cos(angle) * moveDistance, duration: duration / 2 },
                    { value: 0, duration: duration / 2 }
                ],
                translateY: [
                    { value: Math.sin(angle) * moveDistance, duration: duration / 2 },
                    { value: 0, duration: duration / 2 }
                ],
                scale: [
                    { value: 1.2, duration: duration / 2 },
                    { value: 1, duration: duration / 2 }
                ],
                opacity: [
                    { value: 0.8, duration: duration / 3 },
                    { value: 0.4, duration: duration / 3 },
                    { value: 0.6, duration: duration / 3 }
                ],
                easing: 'easeInOutQuad',
                delay: delay,
                loop: true
            });
        });
    }

    // Responsive - recreate orbs on resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Reposition orbs smoothly
            orbs.forEach(orb => {
                const newX = Math.random() * window.innerWidth;
                const newY = Math.random() * window.innerHeight;
                
                anime({
                    targets: orb,
                    left: newX,
                    top: newY,
                    duration: 1000,
                    easing: 'easeInOutQuad'
                });
            });
        }, 250);
    });
})();

