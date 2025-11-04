# MeAgent SDK

AI-powered chatbot widget that can be embedded on any website. Built with TypeScript, works with vanilla HTML, React, Vue, Angular, and any other web framework.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://me-protocol.github.io/me-agent-sdk/)
[![GitHub](https://img.shields.io/badge/github-repo-blue?style=for-the-badge&logo=github)](https://github.com/Me-Protocol/me-agent-sdk)

**[🚀 Try the Live Demo](https://me-protocol.github.io/me-agent-sdk/)** | **[📖 View Documentation](#installation)**

## Features

- 🚀 **Easy Integration**: Single script tag integration
- 💬 **AI-Powered Chat**: Real-time streaming responses with offer recommendations
- 🎨 **Modern UI**: Beautiful, customizable interface with smooth animations
- 📱 **Fully Responsive**: Works perfectly on desktop and mobile
- 🔧 **Configurable**: Customize position, environment, network and more
- 🔐 **Magic Link Authentication**: Built-in wallet authentication for blockchain redemption
- ⚡ **Lightweight**: Small bundle size (~354KB minified) with external dependencies for blockchain features
- 🛍️ **Smart Redemption**: Same-brand and cross-brand reward token swapping
- 🎯 **Product Discovery**: AI-powered offer search, category browsing, and brand exploration

## Installation

### Basic Setup (Chat & Offers)

For basic functionality including AI chat and offer browsing:

```html
<!-- Load SDK -->
<script src="https://cdn.jsdelivr.net/gh/Me-Protocol/me-agent-sdk@main/dist/me-agent-sdk.min.js"></script>

<!-- Initialize -->
<script>
  MeAgent.init({
    emailAddress: "user@example.com", // optional
    brandId: "your-brand-id", // optional
    userId: "user-123", // optional
    position: "bottom-right", // optional: 'bottom-right' or 'bottom-left'
    environment: MeAgent.Environment.DEV, // optional: DEV, STAGING, or PROD
    network: MeAgent.Network.SEPOLIA, // optional: SEPOLIA, HEDERA, BASE, or POLYGON
  });
</script>
```

### Full Setup (with Redemption)

For complete functionality including blockchain redemption, load the required dependencies first:

```html
<!-- Load blockchain dependencies (required for redemption) -->
<script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@developeruche/runtime-sdk@0.11.7-development/dist/browser/runtime-sdk.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@developeruche/protocol-core@0.10.55-ethers5/dist/index.global.js"></script>

<!-- Load SDK -->
<script src="https://cdn.jsdelivr.net/gh/Me-Protocol/me-agent-sdk@main/dist/me-agent-sdk.min.js"></script>

<!-- Initialize -->
<script>
  MeAgent.init({
    emailAddress: "user@example.com", // required for redemption
    brandId: "your-brand-id",
    userId: "user-123",
    position: "bottom-right",
    environment: MeAgent.Environment.DEV,
    network: MeAgent.Network.SEPOLIA,
  });
</script>
```

**Important:** The dependencies must be loaded in this exact order for redemption to work correctly.

**CDN Options:**

- Latest from main branch: `@main/dist/me-agent-sdk.min.js`
- Specific version (recommended for production): `@v1.0.0/dist/me-agent-sdk.min.js`
- Unminified for development: `@main/dist/me-agent-sdk.js`

### Via npm

```bash
npm install me-agent-sdk
```

**Basic usage:**

```javascript
import MeAgent, { Environment, SupportedNetwork } from "me-agent-sdk";

MeAgent.init({
  emailAddress: "user@example.com",
  brandId: "your-brand-id",
  userId: "user-123",
  position: "bottom-right",
  environment: Environment.DEV,
  network: SupportedNetwork.SEPOLIA,
});
```

**With redemption (install additional dependencies):**

```bash
npm install ethers@5.7.2 @developeruche/runtime-sdk@0.11.7-development @developeruche/protocol-core@0.10.55-ethers5
```

### External Dependencies

The SDK uses external dependencies for blockchain redemption to keep the bundle size small:

- **ethers.js v5.7.2** - Blockchain transactions and wallet interactions
- **@developeruche/runtime-sdk** - ME Protocol runtime for reward redemption logic
- **@developeruche/protocol-core** - ME Protocol core for token swaps and relay operations

**CDN Links:**

```html
<script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@developeruche/runtime-sdk@0.11.7-development/dist/browser/runtime-sdk.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@developeruche/protocol-core@0.10.55-ethers5/dist/index.global.js"></script>
```

**What works without dependencies:**

- ✅ AI Chat
- ✅ Offer browsing and search
- ✅ Category exploration
- ✅ Brand discovery
- ✅ Offer detail viewing

**What requires all dependencies:**

- ❌ Offer redemption (blockchain transactions)
- ❌ Reward token swaps
- ❌ Wallet authentication and management
- ❌ Coupon code generation via blockchain

## Configuration Options

| Option         | Type             | Required | Default        | Description                                                   |
| -------------- | ---------------- | -------- | -------------- | ------------------------------------------------------------- |
| `emailAddress` | string           | No       | -              | User's email address for authentication                       |
| `brandId`      | string           | No       | -              | Your brand identifier                                         |
| `userId`       | string           | No       | auto-generated | Unique user identifier                                        |
| `position`     | string           | No       | 'bottom-right' | Widget position: 'bottom-right' or 'bottom-left'              |
| `environment`  | Environment      | No       | DEV            | Environment: DEV, STAGING, or PROD                            |
| `network`      | SupportedNetwork | No       | SEPOLIA        | Blockchain network: SEPOLIA, HEDERA, BASE, or POLYGON         |
| `onAddToCart`  | function         | No       | -              | Callback when user clicks "Add to Cart" on offer details      |
| `onShare`      | function         | No       | -              | Callback when user clicks share button on offer details       |
| `onLikeUnlike` | function         | No       | -              | Callback when user clicks like/unlike button on offer details |
| `likedOffers`  | object           | No       | {}             | Initial liked state for offers (map of offer IDs to booleans) |

### Callback Functions

The SDK supports optional callbacks for e-commerce actions on the offer details page:

```javascript
MeAgent.init({
  // ... other config
  onAddToCart: (offer) => {
    console.log("Add to cart clicked:", offer);
    // Your add to cart logic here
  },
  onShare: (offer) => {
    console.log("Share clicked:", offer);
    // Your share logic here
  },
  onLikeUnlike: (offer, isLiked) => {
    console.log(`Offer ${isLiked ? "liked" : "unliked"}:`, offer);
    // Your like/unlike logic here
  },
  likedOffers: {
    "offer-id-1": true,
    "offer-id-2": false,
  },
});
```

**Note:** Action buttons (Add to Cart, Like, Share) will only appear on the offer details page if their respective callback functions are provided.

## Environments

```javascript
MeAgent.Environment.DEV; // Development environment
MeAgent.Environment.STAGING; // Staging environment
MeAgent.Environment.PROD; // Production environment
```

## Supported Networks

```javascript
MeAgent.Network.SEPOLIA; // Ethereum Sepolia testnet
MeAgent.Network.HEDERA; // Hedera network
MeAgent.Network.BASE; // Base network
MeAgent.Network.POLYGON; // Polygon network
```

## Features in Detail

### 💬 AI Chat

The widget provides an AI-powered chat interface that can:

- Answer questions about products and services
- Search for offers and deals in real-time
- Provide personalized recommendations based on user queries
- Display quick action buttons for common tasks
- Stream responses for a natural conversation feel

### 🛍️ Offer Discovery

Users can explore offers through multiple channels:

- **AI Search**: Ask the AI to find specific offers
- **Category Browsing**: View offers organized by purchase categories
- **Brand Discovery**: Explore brands that offer signup and purchase rewards
- **Card Lists**: Horizontal scrollable lists with "View All" functionality
- **Detailed Views**: Full product details with variants, reviews, and pricing

### 🎁 Offer Redemption

Complete blockchain-powered redemption flow:

- **Same-Brand Redemption**: Use brand tokens to redeem offers from the same brand
- **Cross-Brand Redemption**: Swap tokens from one brand to redeem offers from another
- **Magic Link Authentication**: Secure wallet creation and management (no seed phrases!)
- **Multi-Reward Support**: Automatically check balances across all reward tokens
- **Swap Calculations**: Real-time token swap amount calculations
- **Step-by-Step UI**: Clear Review → Processing → Complete flow
- **Coupon Generation**: Automatic discount code generation and delivery
- **Checkout Integration**: Direct links to brand checkout with applied coupons

### 💰 Reward Management

The SDK integrates with ME Protocol for:

- Multi-reward balance checking
- Cross-brand token swapping via protocol vaults
- Automatic affordability checking before redemption
- Gelato relay for gasless transactions
- Transaction refunds on failed orders

## Troubleshooting

### Redemption Not Working

If redemption features aren't working, verify:

1. **All dependencies are loaded in the correct order:**

   ```html
   <!-- 1. ethers.js first -->
   <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
   <!-- 2. Runtime SDK -->
   <script src="https://cdn.jsdelivr.net/npm/@developeruche/runtime-sdk@0.11.7-development/dist/browser/runtime-sdk.umd.min.js"></script>
   <!-- 3. Protocol Core -->
   <script src="https://cdn.jsdelivr.net/npm/@developeruche/protocol-core@0.10.55-ethers5/dist/index.global.js"></script>
   <!-- 4. ME Agent SDK last -->
   <script src="...me-agent-sdk.min.js"></script>
   ```

2. **Check browser console for errors:**

   - `RuntimeSDK is not defined` - Runtime SDK not loaded or loaded after ME Agent SDK
   - `ProtocolCore is not defined` - Protocol Core not loaded or loaded after ME Agent SDK
   - `ethers is not defined` - ethers.js not loaded

3. **Email address is provided:**

   ```javascript
   MeAgent.init({
     emailAddress: "user@example.com", // Required for redemption
     // ... other config
   });
   ```

4. **Using supported browser** - See Browser Support section below

### CDN Loading Issues

If dependencies fail to load from CDN:

- Check your internet connection
- Verify firewall/proxy settings aren't blocking cdn.jsdelivr.net
- Check browser console for specific CDN errors
- Try using specific versions instead of `@latest`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/Me-Protocol/me-agent-sdk.git
cd me-agent-sdk

# Install dependencies
npm install

# Build the SDK
npm run build
```

### Development Workflow

```bash
# Watch mode (rebuilds on changes)
npm run watch

# Run local server
npm run serve

# Development with live reload
npm run dev:full
```

### External Dependencies

The SDK externalizes these blockchain libraries to reduce bundle size:

- `ethers` v5.7.2 - Blockchain interactions and wallet management
- `@developeruche/runtime-sdk` v0.11.7-development - ME Protocol runtime for redemption logic
- `@developeruche/protocol-core` v0.10.55-ethers5 - ME Protocol core for token swaps and relay

**For CDN usage:**
Load these scripts before the SDK (see [Full Setup](#full-setup-with-redemption) section).

**For npm usage:**

```bash
npm install ethers@5.7.2 @developeruche/runtime-sdk@0.11.7-development @developeruche/protocol-core@0.10.55-ethers5
```

### Project Structure

```
src/
├── types/           # TypeScript interfaces and types
├── core/            # Core utilities and constants
├── data/            # API clients and authentication
├── services/        # Business logic layer
├── controllers/     # UI orchestration layer
├── views/           # UI rendering (pure view functions)
└── index.ts         # Public API entry point
```

For detailed architecture information, see [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md).

### Testing

**Live Demo**: Visit [https://me-protocol.github.io/me-agent-sdk/](https://me-protocol.github.io/me-agent-sdk/) to see the SDK in action.

**Local Testing**:

1. Run `npm run serve` to start a local server
2. Open `http://localhost:5500` in your browser
3. The example includes ethers.js via CDN for full redemption functionality

## Quick Reference

### Complete CDN Setup (Copy & Paste)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App with ME Agent SDK</title>
  </head>
  <body>
    <!-- Your website content -->

    <!-- Load blockchain dependencies (in this order) -->
    <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@developeruche/runtime-sdk@0.11.7-development/dist/browser/runtime-sdk.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@developeruche/protocol-core@0.10.55-ethers5/dist/index.global.js"></script>

    <!-- Load ME Agent SDK -->
    <script src="https://cdn.jsdelivr.net/gh/Me-Protocol/me-agent-sdk@main/dist/me-agent-sdk.min.js"></script>

    <!-- Initialize SDK -->
    <script>
      MeAgent.init({
        emailAddress: "user@example.com",
        brandId: "your-brand-id",
        userId: "user-123",
        position: "bottom-right",
        environment: MeAgent.Environment.DEV,
        network: MeAgent.Network.SEPOLIA,
      });
    </script>
  </body>
</html>
```

### Dependency URLs

| Package       | Version            | CDN URL                                                                                                          |
| ------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| ethers.js     | 5.7.2              | `https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js`                                               |
| Runtime SDK   | 0.11.7-development | `https://cdn.jsdelivr.net/npm/@developeruche/runtime-sdk@0.11.7-development/dist/browser/runtime-sdk.umd.min.js` |
| Protocol Core | 0.10.55-ethers5    | `https://cdn.jsdelivr.net/npm/@developeruche/protocol-core@0.10.55-ethers5/dist/index.global.js`                 |
| ME Agent SDK  | latest             | `https://cdn.jsdelivr.net/gh/Me-Protocol/me-agent-sdk@main/dist/me-agent-sdk.min.js`                             |

### Load Order (Important!)

```
1. ethers.js          ← Must be first
2. Runtime SDK        ← Second
3. Protocol Core      ← Third
4. ME Agent SDK       ← Last
5. Your init code     ← After all scripts loaded
```

## License

MIT License - see LICENSE file for details
