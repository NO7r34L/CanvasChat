#!/bin/bash

# Fix all TypeScript errors systematically

echo "Fixing API route type errors..."

# Fix canvas route
sed -i '' 's/const body = await req.json();/const body = await req.json() as { title: string; fabricData: string; thumbnail?: string; width?: number; height?: number; };/g' src/app/api/canvas/route.ts

# Fix canvas [id] route  
sed -i '' 's/const body = await req.json();/const body = await req.json() as { title?: string; fabricData?: string; thumbnail?: string; width?: number; height?: number; };/g' src/app/api/canvas/\[id\]/route.ts

# Fix comments route
sed -i '' 's/const body = await req.json();/const body = await req.json() as { content: string; positionX: number; positionY: number; };/g' src/app/api/canvas/\[id\]/comments/route.ts

# Fix history route
sed -i '' 's/const body = await req.json();/const body = await req.json() as { fabricData: string; };/g' src/app/api/canvas/\[id\]/history/route.ts

# Fix templates route
sed -i '' 's/const body = await req.json();/const body = await req.json() as { title: string; description?: string; fabricData: string; thumbnail?: string; category?: string; };/g' src/app/api/templates/route.ts

# Fix teams route
sed -i '' 's/const body = await req.json();/const body = await req.json() as { name: string; };/g' src/app/api/teams/route.ts
sed -i '' 's/const body = await req.json();/const body = await req.json() as { name: string; };/g' src/app/api/teams/\[id\]/route.ts

echo "Done!"

