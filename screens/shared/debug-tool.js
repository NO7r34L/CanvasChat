/**
 * UI Debug Tool - Toggle Container Outlines
 * Add this to any HTML page for visual debugging
 */

(function() {
    let debugMode = false;
    
    // Create toggle button
    const button = document.createElement('button');
    button.id = 'debug-toggle';
    button.innerHTML = '🔲 Toggle Outlines';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 999;
        transition: transform 0.2s, box-shadow 0.2s;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    button.onmouseover = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    };
    
    button.onmouseout = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    };
    
    // Toggle function
    button.onclick = function() {
        debugMode = !debugMode;
        
        if (debugMode) {
            // Create style element if it doesn't exist
            if (!document.getElementById('debug-styles')) {
                const style = document.createElement('style');
                style.id = 'debug-styles';
                style.textContent = `
                    * { outline: 1px solid rgba(255, 0, 0, 0.3) !important; }
                    div { outline-color: rgba(255, 0, 0, 0.5) !important; }
                    section { outline: 2px solid rgba(0, 255, 0, 0.6) !important; }
                    header { outline: 2px solid rgba(0, 0, 255, 0.6) !important; }
                    footer { outline: 2px solid rgba(255, 0, 255, 0.6) !important; }
                    main { outline: 2px solid rgba(255, 165, 0, 0.6) !important; }
                    article { outline: 2px solid rgba(0, 255, 255, 0.6) !important; }
                    aside { outline: 2px solid rgba(255, 255, 0, 0.6) !important; }
                    nav { outline: 2px solid rgba(128, 0, 128, 0.6) !important; }
                    form { outline: 2px solid rgba(255, 192, 203, 0.6) !important; }
                    button { outline: 2px solid rgba(255, 69, 0, 0.8) !important; }
                    input { outline: 2px solid rgba(0, 128, 0, 0.8) !important; }
                    textarea { outline: 2px solid rgba(0, 128, 0, 0.8) !important; }
                    img { outline: 2px solid rgba(255, 215, 0, 0.8) !important; }
                    canvas { outline: 3px solid rgba(255, 0, 255, 0.9) !important; }
                    
                    /* Add labels */
                    div::before,
                    section::before,
                    header::before,
                    footer::before,
                    main::before,
                    article::before,
                    aside::before,
                    nav::before {
                        content: attr(class) " <" attr(data-debug-tag) ">";
                        position: absolute;
                        background: rgba(0,0,0,0.8);
                        color: white;
                        font-size: 10px;
                        padding: 2px 6px;
                        border-radius: 3px;
                        z-index: 998;
                        font-family: monospace;
                        pointer-events: none;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Add debug tags
            document.querySelectorAll('*').forEach(el => {
                el.setAttribute('data-debug-tag', el.tagName.toLowerCase());
            });
            
            button.innerHTML = '✅ Outlines ON';
            button.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
        } else {
            // Remove styles
            const style = document.getElementById('debug-styles');
            if (style) {
                style.remove();
            }
            
            button.innerHTML = '🔲 Toggle Outlines';
            button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    };
    
    // Add to page when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.appendChild(button);
        });
    } else {
        document.body.appendChild(button);
    }
})();

