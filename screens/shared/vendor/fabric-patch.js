/**
 * Fabric.js v5.3.0 Patch
 * Fixes the 'alphabetical' textBaseline warning in modern browsers
 * 
 * Issue: Fabric.js 5.3.0 uses 'alphabetical' which was deprecated
 * Solution: Patch the CanvasRenderingContext2D to convert to 'alphabetic'
 */
(function() {
    'use strict';
    
    if (typeof CanvasRenderingContext2D === 'undefined') {
        return;
    }
    
    // Store original textBaseline descriptor
    const originalDescriptor = Object.getOwnPropertyDescriptor(
        CanvasRenderingContext2D.prototype,
        'textBaseline'
    );
    
    if (!originalDescriptor) {
        return;
    }
    
    // Create patched descriptor that converts 'alphabetical' to 'alphabetic'
    Object.defineProperty(CanvasRenderingContext2D.prototype, 'textBaseline', {
        get: function() {
            return originalDescriptor.get ? originalDescriptor.get.call(this) : this._textBaseline;
        },
        set: function(value) {
            // Convert deprecated 'alphabetical' to standard 'alphabetic'
            const correctedValue = value === 'alphabetical' ? 'alphabetic' : value;
            
            if (originalDescriptor.set) {
                originalDescriptor.set.call(this, correctedValue);
            } else {
                this._textBaseline = correctedValue;
            }
        },
        configurable: true,
        enumerable: true
    });
    
    console.log('Fabric.js textBaseline patch applied');
})();

