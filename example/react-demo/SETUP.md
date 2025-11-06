# React Demo Setup Guide

This guide explains how the React demo is configured to use the MeAgent SDK as an npm package.

## 📁 Project Structure

```
react-demo/
├── src/
│   ├── main.jsx          # Entry point
│   └── App.jsx           # Main App component with SDK integration
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
├── README.md             # Usage documentation
└── .gitignore           # Git ignore rules
```

## 🔧 Configuration Details

### 1. Package.json

The demo uses a **local file reference** to the SDK during development:

```json
{
  "dependencies": {
    "me-agent-sdk": "file:../../"
  }
}
```

This allows you to test changes to the SDK immediately without publishing.

**For production apps**, you would use:

```json
{
  "dependencies": {
    "me-agent-sdk": "^1.0.1"
  }
}
```

### 2. Vite Setup

We use **Vite** for fast development and building:

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### 3. SDK Integration

The SDK is imported and initialized in `src/App.jsx`:

```jsx
import { MeAgentSDK } from "me-agent-sdk";

// In useEffect
const sdk = new MeAgentSDK({
  emailAddress: "user@example.com",
  brandId: "demo-brand",
  userId: "user-123",
  // ... other options
});

await sdk.init();
```

## 🚀 Running the Demo

### Development Mode

```bash
cd example/react-demo
npm install
npm run dev
```

Opens at `http://localhost:5173` with hot reload.

### Production Build

```bash
npm run build
npm run preview
```

Creates optimized bundle in `dist/` folder.

## 🔄 How It Works

1. **Vite** bundles the React app and resolves the SDK import
2. The SDK's **standalone bundle** (`me-agent-sdk.min.js`) is included
3. All dependencies (ethers, magic-sdk, etc.) are bundled together
4. The app initializes the SDK in a React `useEffect` hook
5. The chat widget renders and works alongside React components

## 📦 Dependency Resolution

```
React App (Vite)
    ↓
me-agent-sdk (npm package)
    ↓
Standalone Bundle (me-agent-sdk.min.js)
    ↓
Bundled: ethers, magic-sdk, runtime-sdk, protocol-core, relay-sdk
```

## 🛠️ Troubleshooting

### Issue: SDK not found

**Solution**: Make sure you've built the SDK first:

```bash
cd ../..  # Go to SDK root
npm run build
cd example/react-demo
npm install
```

### Issue: Module resolution errors

**Solution**: Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Vite build errors

**Solution**: Check that vite.config.js exists and is properly configured.

## 🎯 Key Differences from Script Tag Approach

| Aspect         | Script Tag         | NPM Package                                 |
| -------------- | ------------------ | ------------------------------------------- |
| Installation   | `<script>` in HTML | `npm install`                               |
| Import         | Global `MeAgent`   | `import { MeAgentSDK } from 'me-agent-sdk'` |
| Initialization | `MeAgent.init()`   | `new MeAgentSDK().init()`                   |
| Build Process  | None               | Bundled by Vite/Webpack                     |
| TypeScript     | No                 | Yes (via .d.ts files)                       |
| Tree Shaking   | No                 | Yes (if supported)                          |

## 📚 Next Steps

1. Customize the configuration in `src/App.jsx`
2. Add your own React components
3. Style the chat integration to match your brand
4. Deploy to production with `npm run build`

## 🔗 Related Documentation

- [Main README](../../README.md)
- [Plain HTML Example](../index.html)
- [Vite Documentation](https://vitejs.dev/)
