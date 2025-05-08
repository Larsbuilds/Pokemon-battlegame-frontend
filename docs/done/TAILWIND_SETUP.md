# Tailwind CSS Setup Guide for Vite + React Projects

## Common Issues and Solutions

### 1. PostCSS Plugin Configuration
**Issue**: Error message: "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin"

**Solution**:
```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 2. ES Modules vs CommonJS
**Issue**: "module is not defined in ES module scope" error

**Solution**: Use ES module syntax in configuration files:
```javascript
// ✅ Correct (ES Modules)
export default {
  // config
}

// ❌ Incorrect (CommonJS)
module.exports = {
  // config
}
```

### 3. Dependencies Installation
**Issue**: Missing or incorrect dependencies causing build failures

**Solution**: Install the correct versions:
```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

### 4. Configuration Files Setup
**Required Files**:

1. `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

2. `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

3. `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Vite Configuration
**Issue**: Base URL conflicts with routing

**Solution**: Update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pokemon-app/' // Adjust based on your deployment path
})
```

### 6. React Router Integration
**Issue**: Routes not matching due to base URL

**Solution**: Add basename to Router:
```javascript
<Router basename="/pokemon-app">
  {/* routes */}
</Router>
```

## Step-by-Step Setup Process

1. Create new Vite project:
```bash
npm create vite@latest my-project -- --template react
cd my-project
```

2. Install dependencies:
```bash
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
```

3. Initialize Tailwind:
```bash
npx tailwindcss init -p
```

4. Configure files as shown above

5. Clean up default styles:
   - Remove default styles from `App.css`
   - Keep only Tailwind directives in `index.css`

6. Start development server:
```bash
npm run dev
```

## Troubleshooting Checklist

1. Verify all configuration files use ES module syntax
2. Check if all required dependencies are installed
3. Ensure content paths in `tailwind.config.js` are correct
4. Verify PostCSS configuration is properly set up
5. Check if base URL in Vite config matches router basename
6. Ensure no conflicting styles in CSS files

## Common Pitfalls to Avoid

1. ❌ Using CommonJS syntax in configuration files
2. ❌ Missing PostCSS configuration
3. ❌ Incorrect content paths in Tailwind config
4. ❌ Conflicting styles between Tailwind and default Vite styles
5. ❌ Mismatched base URLs between Vite and React Router 