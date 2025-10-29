# 🏗️ SDK Architecture Guide

Quick reference for navigating the new layer-based architecture.

---

## 📂 "Where do I find...?"

### **Types & Interfaces**

```
src/types/
├── config.ts       → MeAgentConfig, callbacks
├── message.ts      → Message, ChatState, QuickAction
├── offer.ts        → Offer, OfferDetail, OfferVariant
├── brand.ts        → Brand, Category
└── redemption.ts   → RewardBalance, SwapAmount
```

**Import example:**

```typescript
import { Offer, Brand, MeAgentConfig } from "../types";
```

---

### **Utilities & Helpers**

```
src/core/utils/
└── formatters.ts   → formatNumber(), formatPrice(), generateUUID()
```

**Import example:**

```typescript
import { formatNumber, formatPrice } from "../../core/utils/formatters";
```

---

### **Configuration**

```
src/core/config/
└── env.ts          → Environment configs, API URLs
```

**Import example:**

```typescript
import { getEnv, Environment } from "../../core/config/env";
```

---

### **API Calls**

```
src/data/api/
├── api-client.ts   → Main facade (use this!)
├── offer-api.ts    → Offer endpoints
├── brand-api.ts    → Brand endpoints
├── chat-api.ts     → SSE streaming
└── ...
```

**Usage example:**

```typescript
import { APIClient } from "../../data/api/api-client";

const apiClient = new APIClient(config, env);
const offers = await apiClient.fetchOfferDetails(code, sessionId);
```

---

### **Business Logic**

```
src/services/
├── message-parser.ts   → Parse AI responses
├── offer-service.ts    → Offer logic (caching, pricing)
├── brand-service.ts    → Brand logic (signup links, rewards)
└── session-service.ts  → Session & message management
```

**Usage example:**

```typescript
import { OfferService } from "../../services/offer-service";

const offerService = new OfferService(offerAPI);
const detail = await offerService.getOfferDetail(code, sessionId);
```

---

### **UI Rendering**

```
src/views/
├── offers/
│   ├── offer-grid-view.ts      → Grid of offers
│   └── offer-detail-view.ts    → Single offer detail
├── brands/
│   ├── brand-list-view.ts      → List of brands
│   └── brand-offers-view.ts    → Brands with offers
├── categories/
│   └── category-grid-view.ts   → Category grid
└── shared/
    └── icons.ts                 → SVG icons
```

**Usage example:**

```typescript
import { OfferGridView } from "../../views/offers/offer-grid-view";

const view = new OfferGridView();
const html = view.render(offers);
container.innerHTML = html;
```

---

### **Controllers (Coordination)**

```
src/controllers/
└── detail-panel-controller.ts  → Orchestrates all detail views
```

**Usage example:**

```typescript
import { DetailPanelController } from "../../controllers/detail-panel-controller";

const controller = new DetailPanelController(
  config,
  offerService,
  brandService,
  onClose
);

controller.showOfferGrid(offers);
controller.showOfferDetail(offerCode, sessionId);
```

---

## 🔄 "How do I...?"

### **Add a new API endpoint**

1. Add method to appropriate API class in `data/api/`
2. Expose it in `api-client.ts` facade
3. Use it from a service

Example:

```typescript
// 1. In data/api/offer-api.ts
async fetchOffersByCategory(categoryId: string): Promise<Offer[]> {
  const result = await this.get<{ data: Offer[] }>(
    `${this.env.API_URL}offers/category/${categoryId}`
  );
  return result.data;
}

// 2. In data/api/api-client.ts
async fetchOffersByCategory(categoryId: string) {
  return this.offerAPI.fetchOffersByCategory(categoryId);
}

// 3. In services/offer-service.ts
async getOffersByCategory(categoryId: string): Promise<Offer[]> {
  return this.offerAPI.fetchOffersByCategory(categoryId);
}
```

---

### **Add a new view**

1. Create view class in `views/` (appropriate subfolder)
2. Add render methods (return HTML strings)
3. Use in controller

Example:

```typescript
// 1. views/offers/offer-list-view.ts
export class OfferListView {
  render(offers: Offer[]): string {
    return `
      <div class="offer-list">
        ${offers.map((o) => this.renderItem(o)).join("")}
      </div>
    `;
  }

  private renderItem(offer: Offer): string {
    return `<div class="offer-item">${offer.name}</div>`;
  }
}

// 2. In controller
import { OfferListView } from "../views/offers/offer-list-view";

this.offerListView = new OfferListView();
const html = this.offerListView.render(offers);
container.innerHTML = html;
```

---

### **Add business logic**

1. Add method to appropriate service in `services/`
2. Keep it pure (no side effects)
3. Use services from controllers

Example:

```typescript
// services/offer-service.ts
calculateTotalPrice(offers: Offer[]): number {
  return offers.reduce((total, offer) => {
    const finalPrice = this.calculateFinalPrice(
      offer.price,
      offer.discountPercentage
    );
    return total + finalPrice;
  }, 0);
}
```

---

### **Format numbers or prices**

Use utilities from `core/utils/formatters.ts`:

```typescript
import { formatNumber, formatPrice } from "../../core/utils/formatters";

const formatted = formatNumber(3000); // "3,000"
const price = formatPrice(19.99); // "$19.99"
```

---

### **Parse AI responses**

Use `MessageParser` service:

```typescript
import { MessageParser } from "../../services/message-parser";

const parser = new MessageParser();
const { offers, brands, categories } = parser.parseMessageData(rawData);
```

---

## 🎯 Layer Communication Rules

### **Allowed Dependencies:**

```
Views           → Core (utils, formatters)
Controllers     → Services + Views
Services        → Data (APIs) + Core
Data (APIs)     → Core
Core            → Nothing (foundation layer)
```

### **Not Allowed:**

- ❌ Views → Services (use controllers)
- ❌ Services → Views (return data, not HTML)
- ❌ Core → Any other layer (must be pure)
- ❌ Data → Services (keep APIs dumb)

---

## 📝 File Naming Conventions

### **Classes:**

- PascalCase for class names: `OfferService`, `BrandAPI`
- File names match class names: `offer-service.ts`, `brand-api.ts`

### **Views:**

- Suffix with `-view`: `offer-grid-view.ts`
- Class name: `OfferGridView`

### **Controllers:**

- Suffix with `-controller`: `detail-panel-controller.ts`
- Class name: `DetailPanelController`

### **Services:**

- Suffix with `-service`: `offer-service.ts`
- Class name: `OfferService`

### **APIs:**

- Suffix with `-api`: `offer-api.ts`
- Class name: `OfferAPI`

---

## 🧪 Testing Strategy

### **Unit Tests:**

- **Services** - Pure logic, easy to test
- **Formatters** - Pure functions
- **Message Parser** - Pure transformation

### **Integration Tests:**

- **Controllers** - Mock services
- **APIs** - Mock fetch

### **E2E Tests:**

- Full user flows through SDK

---

## 🚀 Quick Start for New Features

1. **Define types** in `src/types/`
2. **Add API call** in `src/data/api/`
3. **Add business logic** in `src/services/`
4. **Create view** in `src/views/`
5. **Wire in controller** in `src/controllers/`
6. **Expose in SDK** via `src/sdk.ts`

---

**Questions? Check `REFACTORING_SUMMARY.md` for detailed examples!**
