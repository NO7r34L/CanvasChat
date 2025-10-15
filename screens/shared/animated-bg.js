/**
 * Animated Background with CSS Gradients
 * Slow moving gradient with blur overlay
 */

(function() {
    // Add keyframe animation to document
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);

    // Create gradient background with blur
    const gradientBg = document.createElement('div');
    gradientBg.id = 'animated-gradient-bg';
    gradientBg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        background: linear-gradient(
            270deg,
            #F9FAFB,
            #E5E7EB,
            #D1D5DB,
            #A78BFA,
            #6B46C1,
            #D1D5DB,
            #F3F4F6
        );
        background-size: 400% 400%;
        animation: gradientMove 30s ease-in-out infinite;
        filter: blur(80px);
        opacity: 0.9;
    `;

    // Insert into document
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.insertBefore(gradientBg, document.body.firstChild);
        });
    } else {
        document.body.insertBefore(gradientBg, document.body.firstChild);
    }
})();

