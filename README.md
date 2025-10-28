# MeAgent SDK

AI-powered chatbot widget that can be embedded on any website. Built with TypeScript, works with vanilla HTML, React, Vue, Angular, and any other web framework.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://me-protocol.github.io/me-agent-sdk/)
[![GitHub](https://img.shields.io/badge/github-repo-blue?style=for-the-badge&logo=github)](https://github.com/Me-Protocol/me-agent-sdk)

**[🚀 Try the Live Demo](https://me-protocol.github.io/me-agent-sdk/)** | **[📖 View Documentation](#installation)**

## Features

- 🚀 **Easy Integration**: Single script tag integration
- 💬 **AI-Powered Chat**: Real-time streaming responses with offer redemption
- 🎨 **Modern UI**: Beautiful, customizable interface inspired by Notion
- 📱 **Fully Responsive**: Works perfectly on desktop and mobile
- 🔧 **Configurable**: Customize position, environment, network and more
- 🔐 **Magic Link Authentication**: Built-in wallet authentication for offer redemption
- ⚡ **Lightweight**: Optimized bundle with all dependencies included

## Installation

### Via CDN (Recommended)

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

**CDN Options:**
- Latest from main branch: `@main/dist/me-agent-sdk.min.js`
- Specific version (recommended for production): `@v1.0.0/dist/me-agent-sdk.min.js`
- Unminified for development: `@main/dist/me-agent-sdk.js`

### Via npm

```bash
npm install me-agent-sdk
```

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

## Features

### AI Chat

The widget provides an AI-powered chat interface that can:

- Answer questions about your products and services
- Search for offers and deals
- Provide personalized recommendations

### Offer Redemption

Users can:

- Browse available offers directly in the chat
- View offer details including discounts and variants
- Redeem offers using their reward tokens
- Authenticate with Magic Link for secure transactions

### Reward Management

The SDK integrates with ME Protocol for:

- Multi-reward balance checking
- Cross-reward swapping
- Automatic affordability checking
- Seamless blockchain transactions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Building

```bash
npm run build
```

### Testing

**Live Demo**: Visit [https://me-protocol.github.io/me-agent-sdk/](https://me-protocol.github.io/me-agent-sdk/) to see the SDK in action.

**Local Testing**: Open `example/index.html` in your browser to test the SDK locally.

## License

MIT License - see LICENSE file for details
