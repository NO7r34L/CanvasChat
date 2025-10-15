/**
 * Animated Background with Gradient Images
 * Crossfading between beautiful gradient backgrounds
 */

(function() {
    // Add keyframe animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            20%, 80% { opacity: 1; }
        }
        
        @keyframes zoomSlow {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);

    // Gradient images to cycle through
    const gradientImages = [
        '../shared/assets/gradient-bg-1.jpg',
        '../shared/assets/gradient-bg-2.jpg',
        '../shared/assets/gradient-bg-3.jpg',
        '../shared/assets/gradient-bg-4.jpg',
        '../shared/assets/gradient-bg-5.jpg'
    ];

    // Create background container
    const bgContainer = document.createElement('div');
    bgContainer.id = 'animated-gradient-bg';
    bgContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        overflow: hidden;
    `;

    // Create individual background layers
    gradientImages.forEach((img, index) => {
        const layer = document.createElement('div');
        layer.style.cssText = `
            position: absolute;
            top: -5%;
            left: -5%;
            width: 110%;
            height: 110%;
            background-image: url('${img}');
            background-size: cover;
            background-position: center;
            opacity: 0;
            animation: fadeInOut ${gradientImages.length * 8}s ease-in-out ${index * 8}s infinite,
                       zoomSlow ${gradientImages.length * 8}s ease-in-out ${index * 8}s infinite;
        `;
        bgContainer.appendChild(layer);
    });

    // Add blur overlay
    const blurOverlay = document.createElement('div');
    blurOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(60px);
        -webkit-backdrop-filter: blur(60px);
        background: rgba(255, 255, 255, 0.1);
    `;
    bgContainer.appendChild(blurOverlay);

    // Insert into document
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.insertBefore(bgContainer, document.body.firstChild);
        });
    } else {
        document.body.insertBefore(bgContainer, document.body.firstChild);
    }
})();

