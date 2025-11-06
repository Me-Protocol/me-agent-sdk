# MeAgent SDK

AI-powered chatbot widget that can be embedded on any website. Built with TypeScript, works with vanilla HTML, React, Vue, Angular, and any other web framework.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://me-protocol.github.io/me-agent-sdk/)
[![GitHub](https://img.shields.io/badge/github-repo-blue?style=for-the-badge&logo=github)](https://github.com/Me-Protocol/me-agent-sdk)

**[🚀 Try the Live Demo](https://me-protocol.github.io/me-agent-sdk/)** | **[📖 View Documentation](#installation)**

## Features

- 🚀 **Easy Integration**: Single script tag integration - no dependencies required
- 💬 **AI-Powered Chat**: Real-time streaming responses with offer recommendations
- 🎨 **Modern UI**: Beautiful, customizable interface with smooth animations
- 📱 **Fully Responsive**: Works perfectly on desktop and mobile
- 🔧 **Configurable**: Customize position, environment, network and more
- 🔐 **Magic Link Authentication**: Built-in wallet authentication for blockchain redemption
- ⚡ **Standalone Bundle**: All dependencies included (~1.7MB minified, includes ethers, web3, runtime-sdk, protocol-core)
- 🛍️ **Smart Redemption**: Same-brand and cross-brand reward token swapping
- 🎯 **Product Discovery**: AI-powered offer search, category browsing, and brand exploration

## Installation

### CDN Usage (Recommended)

The SDK is a standalone bundle with all blockchain dependencies included. Just load one script:

```html
<!-- Load SDK from npm CDN -->
<script src="https://cdn.jsdelivr.net/npm/me-agent-sdk/dist/me-agent-sdk.min.js"></script>

<!-- Initialize -->
<script>
  window.addEventListener("DOMContentLoaded", async () => {
    await MeAgent.init({
      emailAddress: "user@example.com", // optional (required for redemption)
      brandId: "your-brand-id", // optional
      userId: "user-123", // optional
      position: "bottom-right", // optional: 'bottom-right' or 'bottom-left'
      environment: MeAgent.Environment.DEV, // optional: DEV, STAGING, or PROD
      network: MeAgent.Network.SEPOLIA, // optional: SEPOLIA, HEDERA, BASE, or POLYGON
    });
  });
</script>
```

**Global Variable:** The SDK exposes `window.MeAgent` for browser usage.

**CDN Options:**

**jsDelivr (Recommended):**

- Latest version: `https://cdn.jsdelivr.net/npm/me-agent-sdk/dist/me-agent-sdk.min.js`
- Specific version: `https://cdn.jsdelivr.net/npm/me-agent-sdk@1.0.0/dist/me-agent-sdk.min.js`
- Unminified (dev): `https://cdn.jsdelivr.net/npm/me-agent-sdk/dist/me-agent-sdk.js`

**unpkg:**

- Latest version: `https://unpkg.com/me-agent-sdk/dist/me-agent-sdk.min.js`
- Specific version: `https://unpkg.com/me-agent-sdk@1.0.0/dist/me-agent-sdk.min.js`

**Global Variable:** The SDK exposes `window.MeAgent` for browser usage. All methods and constants are available on this global object.

### Via npm

```bash
npm install me-agent-sdk
```

**Usage:**

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

**Note:** The npm package is built with Webpack and includes all blockchain dependencies bundled together:

- ethers.js v5.7.2
- web3 v1.10.0
- @developeruche/runtime-sdk v0.11.8
- @developeruche/protocol-core v0.10.55
- @gelatonetwork/relay-sdk

No additional packages needed - everything works out of the box!

## Configuration Options

| Option             | Type             | Required | Default        | Description                                                       |
| ------------------ | ---------------- | -------- | -------------- | ----------------------------------------------------------------- |
| `emailAddress`     | string           | No       | -              | User's email address for authentication                           |
| `brandId`          | string           | No       | -              | Your brand identifier                                             |
| `userId`           | string           | **Yes**  | -              | Unique user identifier (required)                                 |
| `position`         | string           | No       | 'bottom-right' | Widget position: 'bottom-right' or 'bottom-left'                  |
| `environment`      | Environment      | No       | DEV            | Environment: DEV, STAGING, or PROD                                |
| `network`          | SupportedNetwork | No       | SEPOLIA        | Blockchain network: SEPOLIA, HEDERA, BASE, or POLYGON             |
| `onAddToCart`      | function         | No       | -              | Callback when user adds an offer to cart                          |
| `onRemoveFromCart` | function         | No       | -              | Callback when user removes an offer from cart                     |
| `onShare`          | function         | No       | -              | Callback when user clicks share button on offer details           |
| `onLikeUnlike`     | function         | No       | -              | Callback when user clicks like/unlike button on offer details     |
| `likedOffers`      | object           | No       | {}             | Initial liked state for offers (map of offer IDs to booleans)     |
| `cartItems`        | CartItem[]       | No       | []             | Array of items currently in cart (for showing "Remove from Cart") |

### Callback Functions & Cart Management

The SDK supports optional callbacks for e-commerce actions on the offer details page:

```javascript
// Example cart state
let myCart = [];

await MeAgent.init({
  // ... other config

  // Cart Management
  onAddToCart: async (offer, variantId) => {
    console.log("Adding to cart:", offer, "variant:", variantId);
    myCart.push({ offerCode: offer.offerCode, variantId });

    // Update SDK's cart state
    MeAgent.updateCartItems(myCart);

    // Your add to cart logic here (e.g., API call, state update)
  },

  onRemoveFromCart: async (offerCode, variantId) => {
    console.log("Removing from cart:", offerCode, "variant:", variantId);
    myCart = myCart.filter(
      (item) => !(item.offerCode === offerCode && item.variantId === variantId)
    );

    // Update SDK's cart state
    MeAgent.updateCartItems(myCart);

    // Your remove from cart logic here
  },

  // Pass initial cart items to show correct button state
  cartItems: myCart, // Array of { offerCode, variantId?, quantity? }

  // Social Actions
  onShare: (offer) => {
    console.log("Share clicked:", offer);
    // Your share logic here
  },

  onLikeUnlike: (offer, isLiked) => {
    console.log(`Offer ${isLiked ? "liked" : "unliked"}:`, offer);

    // Update your liked offers state
    const myLikedOffers = { ...likedOffers };
    myLikedOffers[offer.id] = isLiked;

    // Update SDK's liked state
    MeAgent.updateLikedOffers(myLikedOffers);

    // Your like/unlike logic here (e.g., API call)
  },

  likedOffers: {
    "offer-id-1": true,
    "offer-id-2": false,
  },
});
```

#### CartItem Interface

```typescript
interface CartItem {
  offerCode: string; // Offer code/ID
  variantId?: string; // Product variant ID (if applicable)
  quantity?: number; // Quantity (optional)
}
```

**How it works:**

- If an offer is in `cartItems`, the button shows "Remove from Cart"
- If not in cart, the button shows "Add to Cart"
- Clicking the button calls either `onAddToCart` or `onRemoveFromCart`
- You manage your cart state, and the SDK reflects it in the UI

**Important:**

- After adding or removing items from your cart, call `MeAgent.updateCartItems(newCartArray)` to update the SDK's cart state.
- After liking or unliking offers, call `MeAgent.updateLikedOffers(newLikedObject)` to update the SDK's liked state.
- These updates ensure the UI reflects changes immediately without requiring a page refresh.

**Note:** Action buttons (Add to Cart, Like, Share) will only appear on the offer details page if their respective callback functions are provided.

## Programmatic Control

The SDK provides methods to programmatically control the chat widget:

### Browser (CDN)

```javascript
// After initialization
await MeAgent.init({ ... });

// Open the chat widget
MeAgent.open();

// Close the chat widget
MeAgent.close();

// Toggle the chat widget
MeAgent.toggle();

// Update cart items (after cart changes)
MeAgent.updateCartItems(newCartArray);

// Update liked offers (after like/unlike)
MeAgent.updateLikedOffers(newLikedObject);

// Destroy the SDK
MeAgent.destroy();
```

### React / NPM

```jsx
import { useState, useEffect } from "react";
import { MeAgentSDK } from "me-agent-sdk";

function App() {
  const [sdkInstance, setSdkInstance] = useState(null);

  useEffect(() => {
    const initSDK = async () => {
      const sdk = new MeAgentSDK({
        emailAddress: "user@example.com",
        brandId: "your-brand",
        userId: "user-123",
      });

      await sdk.init();
      setSdkInstance(sdk); // Store instance for control
    };

    initSDK();
  }, []);

  // Control methods
  const handleOpenChat = () => sdkInstance?.open();
  const handleCloseChat = () => sdkInstance?.close();
  const handleToggleChat = () => sdkInstance?.toggle();
  const handleUpdateCart = (newCart) => sdkInstance?.updateCartItems(newCart);
  const handleUpdateLiked = (newLiked) =>
    sdkInstance?.updateLikedOffers(newLiked);

  return (
    <div>
      <button onClick={handleOpenChat}>Open Chat</button>
      <button onClick={handleCloseChat}>Close Chat</button>
      <button onClick={handleToggleChat}>Toggle Chat</button>
    </div>
  );
}
```

### Common Use Cases

**Auto-open on page load:**

```javascript
await MeAgent.init({ ... });
MeAgent.open();
```

**Open after user action:**

```javascript
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Process form...
  MeAgent.open(); // Show chat for support
});
```

**Open for first-time visitors:**

```javascript
const isFirstVisit = !localStorage.getItem("visited");
if (isFirstVisit) {
  MeAgent.open();
  localStorage.setItem("visited", "true");
}
```

**Deep link integration:**

```javascript
const params = new URLSearchParams(window.location.search);
if (params.get("chat") === "open") {
  MeAgent.open();
}
```

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

1. **SDK is properly loaded:**

   ```html
   <script src="https://cdn.jsdelivr.net/npm/me-agent-sdk/dist/me-agent-sdk.min.js"></script>
   ```

2. **Email address is provided:**

   ```javascript
   MeAgent.init({
     emailAddress: "user@example.com", // Required for redemption
     // ... other config
   });
   ```

3. **Using supported browser** - See Browser Support section below

4. **Check browser console for errors** - Look for authentication or network errors

### CDN Loading Issues

If the SDK fails to load from CDN:

- Check your internet connection
- Verify firewall/proxy settings aren't blocking cdn.jsdelivr.net
- Try using unpkg as an alternative: `https://unpkg.com/me-agent-sdk/dist/me-agent-sdk.min.js`
- Use a specific version instead of `@latest`

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

### Bundled Dependencies

The SDK is built with Webpack and includes these blockchain libraries:

- `ethers` v5.7.2 - Blockchain interactions and wallet management
- `web3` v1.10.0 - Web3 provider for Magic wallet
- `@developeruche/runtime-sdk` v0.11.8 - ME Protocol runtime for redemption logic
- `@developeruche/protocol-core` v0.10.55 - ME Protocol core for token swaps and relay
- `@gelatonetwork/relay-sdk` - Gelato relay for gasless transactions

Everything is bundled together - no external dependencies needed!

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

1. Build the SDK: `npm run build`
2. Run `npm run serve` to start a local server
3. Open `http://localhost:5500` in your browser
4. The example uses the local build from `dist/me-agent-sdk.min.js`

**Note**: The `docs/index.html` and `example/index.html` files load the SDK from the local `dist/` folder for development. When deploying to production (GitHub Pages, CDN), update the script tag to use the CDN URL.

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

    <!-- Load ME Agent SDK (standalone - includes all dependencies) -->
    <script src="https://cdn.jsdelivr.net/npm/me-agent-sdk/dist/me-agent-sdk.min.js"></script>

    <!-- Initialize SDK -->
    <script>
      window.addEventListener("DOMContentLoaded", async () => {
        await MeAgent.init({
          emailAddress: "user@example.com",
          brandId: "your-brand-id",
          userId: "user-123",
          position: "bottom-right",
          environment: MeAgent.Environment.DEV,
          network: MeAgent.Network.SEPOLIA,
        });
      });
    </script>
  </body>
</html>
```

### CDN URLs

| Package      | Version | CDN URL                                                                    |
| ------------ | ------- | -------------------------------------------------------------------------- |
| ME Agent SDK | latest  | `https://cdn.jsdelivr.net/npm/me-agent-sdk/dist/me-agent-sdk.min.js`       |
| ME Agent SDK | 1.0.0   | `https://cdn.jsdelivr.net/npm/me-agent-sdk@1.0.0/dist/me-agent-sdk.min.js` |
| unpkg (alt)  | latest  | `https://unpkg.com/me-agent-sdk/dist/me-agent-sdk.min.js`                  |

## License

MIT License - see LICENSE file for details
