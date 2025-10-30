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
- ⚡ **Lightweight**: Small bundle size (~100KB) with external dependencies for advanced features
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

For complete functionality including blockchain redemption, load ethers.js first:

```html
<!-- Load dependencies -->
<script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>

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
npm install ethers@5.7.2
```

### External Dependencies

The SDK uses external dependencies for blockchain redemption to keep the bundle size small:

- **ethers.js v5** (Required for redemption): Handles blockchain transactions and wallet interactions
- Load via CDN: `https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js`

**What works without ethers.js:**
- ✅ AI Chat
- ✅ Offer browsing and search
- ✅ Category exploration
- ✅ Brand discovery

**What requires ethers.js:**
- ❌ Offer redemption (blockchain transactions)
- ❌ Reward token swaps
- ❌ Wallet authentication for purchases

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

- `ethers` v5.7.2 - Blockchain interactions
- `@developeruche/runtime-sdk` - ME Protocol runtime
- `@developeruche/protocol-core` - ME Protocol core functionality

These are loaded externally via CDN or need to be installed for npm usage. See the installation section for details.

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

## License

MIT License - see LICENSE file for details
