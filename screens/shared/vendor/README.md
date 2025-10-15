# Vendor Libraries

This directory contains locally hosted third-party JavaScript libraries for the CanvasChat application.

## Libraries

### Fabric.js v5.3.0
- **File**: `fabric.min.js` (306 KB)
- **Purpose**: Canvas manipulation and object management
- **Source**: https://unpkg.com/fabric@5.3.0/dist/fabric.min.js
- **License**: MIT
- **Documentation**: http://fabricjs.com/
- **Patch**: `fabric-patch.js` - Fixes 'alphabetical' textBaseline deprecation warning

### Anime.js v3.2.1
- **File**: `anime.min.js` (17 KB)
- **Purpose**: Smooth animations for canvas objects
- **Source**: https://unpkg.com/animejs@3.2.1/lib/anime.min.js
- **License**: MIT
- **Documentation**: https://animejs.com/

## Why Local Hosting?

These libraries are hosted locally instead of using CDN links for the following reasons:

1. **Reliability**: Ensures the application works even if CDN services are unavailable
2. **Performance**: Reduces external HTTP requests and potential latency
3. **Version Control**: Guarantees consistent library versions across all deployments
4. **Offline Development**: Allows development without internet connectivity

## Updating Libraries

To update these libraries to newer versions:

```bash
# Update Fabric.js
curl -o screens/shared/vendor/fabric.min.js https://unpkg.com/fabric@VERSION/dist/fabric.min.js

# Update Anime.js
curl -o screens/shared/vendor/anime.min.js https://unpkg.com/animejs@VERSION/lib/anime.min.js
```

Replace `VERSION` with the desired version number.

