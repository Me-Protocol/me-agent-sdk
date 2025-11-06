# MeAgent SDK - React Demo

This demo shows how to integrate the MeAgent SDK into a React application using the npm package.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## 📦 Installation in Your Project

```bash
npm install me-agent-sdk
```

## 💻 Usage

```jsx
import { useState, useEffect } from 'react';
import { MeAgentSDK } from 'me-agent-sdk';

function App() {
  const [sdkInitialized, setSdkInitialized] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      try {
        const sdk = new MeAgentSDK({
          emailAddress: 'user@example.com',
          brandId: 'demo-brand',
          userId: 'user-123',
          position: 'bottom-right',
          primaryColor: '#667eea',
          apiUrl: 'https://api.meprotocol.io/api/v1'
        });

        await sdk.init();
        setSdkInitialized(true);
      } catch (err) {
        console.error('SDK init failed:', err);
      }
    };

    initSDK();
  }, []);

  return <div>Your App Content</div>;
}

export default App;
```

## ⚙️ Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `emailAddress` | string | ✅ | User's email address |
| `brandId` | string | ✅ | Your brand ID |
| `userId` | string | ✅ | Unique user identifier |
| `position` | string | ❌ | Chat button position (`bottom-right` or `bottom-left`) |
| `primaryColor` | string | ❌ | Brand color in hex format |
| `apiUrl` | string | ❌ | API endpoint URL |
| `magicApiKey` | string | ❌ | Magic.link API key for authentication |

## 🎨 Features Demonstrated

- ✅ NPM package installation
- ✅ React component integration
- ✅ useEffect initialization
- ✅ Error handling
- ✅ TypeScript support
- ✅ Vite development setup

## 📚 Tech Stack

- React 18
- Vite 5
- MeAgent SDK

## 🔗 Links

- [MeAgent SDK Documentation](../../README.md)
- [Main Example (Plain HTML)](../index.html)

