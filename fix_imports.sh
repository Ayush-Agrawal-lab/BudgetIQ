#!/bin/bash

# Function to fix imports in a file
fix_imports() {
  file="$1"
  sed -i "s/@[0-9.]\+\"/@\"/g" "$file"
  sed -i "s/@[0-9.]\+\//@\//g" "$file"
  sed -i "s/from \"@radix-ui\/react-[^\"]\+@[0-9.]\+/from \"@radix-ui\/react-/g" "$file"
  sed -i "s/from \"lucide-react@[0-9.]\+/from \"lucide-react/g" "$file"
  sed -i "s/from \"class-variance-authority@[0-9.]\+/from \"class-variance-authority/g" "$file"
  sed -i "s/from \"next-themes@[0-9.]\+/from \"next-themes/g" "$file"
  sed -i "s/from \"cmdk@[0-9.]\+/from \"cmdk/g" "$file"
  sed -i "s/from \"vaul@[0-9.]\+/from \"vaul/g" "$file"
  sed -i "s/from \"recharts@[0-9.]\+/from \"recharts/g" "$file"
}

# Fix imports in all TypeScript/React files
find src/components -type f -name "*.tsx" -exec sh -c "echo Fixing imports in {}; fix_imports {}" \;
