/**
 * Styles - Scoped CSS for SDK components
 */

export const styles = `
  /* Container for all SDK elements */
  .me-agent-container * {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  /* Floating Button */
  .me-agent-button {
    position: fixed;
    bottom: 24px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #0F0F0F;
    outline: 1px #4D4D4D solid;
    cursor: pointer;
    box-shadow: 0px 16px 40px rgba(255, 255, 255, 0.24);
    z-index: 999999;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .me-agent-button:hover {
    transform: scale(1.05);
    box-shadow: 0px 16px 40px rgba(255, 255, 255, 0.24);
  }

  .me-agent-button.bottom-right {
    right: 24px;
  }

  .me-agent-button.bottom-left {
    left: 24px;
  }

  /* Hidden state for button when chat is open */
  .me-agent-button.hidden {
    opacity: 0;
    transform: translateY(100px);
    pointer-events: none;
  }

  .me-agent-button-icon {
    display: block;
  }

  /* Chat Container */
  .me-agent-chat {
    position: fixed;
    bottom: 20px;
    width: 400px;
    height: 600px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    z-index: 999999;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .me-agent-chat.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .me-agent-chat.bottom-right {
    right: 24px;
  }

  .me-agent-chat.bottom-left {
    left: 24px;
  }

  /* Chat Content (left side) */
  .me-agent-chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Offers Panel Wrapper (right side) */
  .me-agent-offers-panel-wrapper {
    width: 0;
    overflow: hidden;
    transition: width 0.3s ease;
  }

  .me-agent-chat.has-offers-panel .me-agent-offers-panel-wrapper {
    width: 476px;
    border-left: 1px solid #e5e7eb;
  }

  /* Maximized State */
  .me-agent-chat.maximized {
    width: 600px !important;
    height: 100vh !important;
    top: 0 !important;
    bottom: 0 !important;
    right: 0 !important;
    left: auto !important;
    border-radius: 0;
    animation: slideInFromRight 0.3s ease;
  }

  /* Maximized with offers panel */
  .me-agent-chat.maximized.has-offers-panel {
    width: 1076px !important;
  }

  .me-agent-chat.minimizing {
    animation: slideOutToRight 0.3s ease;
  }

  @keyframes slideInFromRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutToRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  /* Chat Header */
  .me-agent-chat-header {
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .me-agent-chat-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .me-agent-header-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .me-agent-maximize-button,
  .me-agent-close-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  .me-agent-maximize-button {
    font-size: 16px;
  }

  .me-agent-maximize-button svg,
  .me-agent-close-button svg {
    display: block;
  }

  .me-agent-close-button {
    font-size: 24px;
  }

  .me-agent-maximize-button:hover,
  .me-agent-close-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Messages Container */
  .me-agent-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f9fafb;
  }

  /* Welcome Message */
  .me-agent-welcome {
    text-align: center;
    padding: 20px 0;
  }

  .me-agent-welcome-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 20px 0;
  }

  /* Quick Actions */
  .me-agent-quick-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .me-agent-quick-action {
    background: white;
    border: 1px solid #e5e7eb;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    color: #374151;
    text-align: left;
  }

  .me-agent-quick-action:hover {
    background: #f3f4f6;
    border-color: #667eea;
    transform: translateX(2px);
  }

  /* Message Bubble */
  .me-agent-message {
    display: flex;
    gap: 8px;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .me-agent-message.user {
    flex-direction: row-reverse;
  }

  .me-agent-message-content {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }

  .me-agent-message.user .me-agent-message-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-right-radius: 4px;
  }

  .me-agent-message.assistant .me-agent-message-content {
    background: white;
    color: #1f2937;
    border: 1px solid #e5e7eb;
    border-bottom-left-radius: 4px;
  }

  /* Links in message content */
  .me-agent-message-content a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .me-agent-message-content a:hover {
    color: #764ba2;
    text-decoration: underline;
  }

  /* Offer links - special styling */
  .me-agent-message-content .me-agent-offer-link {
    color: #667eea;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 1px dashed #667eea;
    padding-bottom: 1px;
  }

  .me-agent-message-content .me-agent-offer-link:hover {
    color: #764ba2;
    border-bottom-color: #764ba2;
    text-decoration: none;
  }

  /* Bold and italic text */
  .me-agent-message-content strong {
    font-weight: 600;
  }

  .me-agent-message-content em {
    font-style: italic;
  }

  /* Input Container */
  .me-agent-input-container {
    padding: 16px 20px;
    background: white;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 8px;
  }

  .me-agent-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 24px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease;
  }

  .me-agent-input:focus {
    border-color: #667eea;
  }

  .me-agent-send-button {
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .me-agent-send-button svg {
    display: block;
  }

  .me-agent-send-button:hover:not(:disabled) {
    transform: scale(1.02);
  }

  .me-agent-send-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading Indicator */
  .me-agent-loading {
    display: flex;
    gap: 4px;
    padding: 12px 16px;
  }

  .me-agent-loading-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #9ca3af;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .me-agent-loading-dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .me-agent-loading-dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

  /* Offer Preview Card */
  .me-agent-offer-preview {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
    animation: slideIn 0.3s ease;
  }

  .me-agent-offer-preview-content {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .me-agent-offer-avatars {
    display: flex;
    position: relative;
    padding-left: 8px;
  }

  .me-agent-offer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid white;
    background-size: cover;
    background-position: center;
    margin-left: -8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .me-agent-offer-preview-text {
    flex: 1;
  }

  .me-agent-offer-preview-title {
    font-size: 14px;
    color: #374151;
    margin: 0 0 8px 0;
    font-weight: 500;
  }

  .me-agent-offer-preview-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .me-agent-offer-preview-button:hover {
    transform: scale(1.05);
  }

  /* Offers Panel */
  .me-agent-offers-panel {
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .me-agent-offers-panel.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .me-agent-offers-header {
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 76px;
  }

  .me-agent-offers-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    flex: 1;
  }

  .me-agent-offers-back,
  .me-agent-offers-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background 0.2s ease;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 500;
  }

  .me-agent-offers-back {
    margin-right: auto;
  }

  .me-agent-offers-back svg,
  .me-agent-offers-close svg {
    display: inline-block;
    vertical-align: middle;
  }

  .me-agent-offers-close {
    font-size: 24px;
    width: 32px;
    height: 32px;
    justify-content: center;
  }

  .me-agent-offers-back:hover,
  .me-agent-offers-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Offers Grid */
  .me-agent-offers-grid {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    align-content: start;
  }

  .me-agent-offer-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .me-agent-offer-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .me-agent-offer-image {
    width: 100%;
    height: 120px;
    background-size: cover;
    background-position: center;
    background-color: #f3f4f6;
  }

  .me-agent-offer-info {
    padding: 12px;
  }

  .me-agent-offer-name {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .me-agent-offer-brand {
    font-size: 12px;
    color: #6b7280;
    margin: 0 0 8px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .me-agent-offer-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .me-agent-offer-discount {
    background: #dcfce7;
    color: #166534;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
  }

  .me-agent-offer-original-price {
    font-size: 13px;
    color: #1f2937;
    font-weight: 600;
  }

  /* Offers Loading */
  .me-agent-offers-loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Offer Detail */
  .me-agent-offer-detail {
    flex: 1;
    overflow-y: auto;
  }

  .me-agent-offer-detail-image {
    width: 100%;
    height: 300px;
    background-size: cover;
    background-position: center;
    background-color: #f3f4f6;
  }

  .me-agent-offer-detail-content {
    padding: 24px;
  }

  .me-agent-offer-detail-header {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 20px;
  }

  .me-agent-offer-brand-logo {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #e5e7eb;
  }

  .me-agent-offer-detail-name {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
  }

  .me-agent-offer-detail-brand {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }

  .me-agent-offer-detail-pricing {
    background: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .me-agent-offer-detail-discount {
    display: inline-block;
    background: #dcfce7;
    color: #166534;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .me-agent-offer-detail-price {
    display: flex;
    gap: 12px;
    align-items: baseline;
  }

  .me-agent-offer-detail-original {
    font-size: 18px;
    color: #9ca3af;
    text-decoration: line-through;
  }

  .me-agent-offer-detail-final {
    font-size: 28px;
    color: #1f2937;
    font-weight: 700;
  }

  .me-agent-offer-detail-description h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  .me-agent-offer-detail-description p {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0 0 20px 0;
  }

  .me-agent-offer-detail-code {
    background: #fef3c7;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #92400e;
  }

  .me-agent-offer-detail-code strong {
    font-weight: 600;
  }

  .me-agent-offer-claim-button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .me-agent-offer-claim-button:hover {
    transform: scale(1.02);
  }

  /* OTP Container */
  .me-agent-otp-container {
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .me-agent-otp-description {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }

  .me-agent-otp-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .me-agent-otp-email-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease;
  }

  .me-agent-otp-email-input:focus {
    border-color: #667eea;
  }

  .me-agent-otp-send-button {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .me-agent-otp-send-button:hover:not(:disabled) {
    transform: scale(1.02);
  }

  .me-agent-otp-send-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .me-agent-otp-status {
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.5;
  }

  .me-agent-otp-status-success {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
  }

  .me-agent-otp-status-error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }

  /* Variants Selector (Horizontal) */
  .me-agent-variants-selector {
    margin: 12px 0;
    padding: 12px 0;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }

  .me-agent-variants-list-horizontal {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 4px 0;
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f3f4f6;
  }

  .me-agent-variants-list-horizontal::-webkit-scrollbar {
    height: 6px;
  }

  .me-agent-variants-list-horizontal::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }

  .me-agent-variants-list-horizontal::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  .me-agent-variants-list-horizontal::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  .me-agent-variant-chip {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px 16px;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
    font-size: 13px;
  }

  .me-agent-variant-chip:hover:not(:disabled) {
    border-color: #667eea;
    background: #f9fafb;
  }

  .me-agent-variant-chip.active {
    border-color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  }

  .me-agent-variant-chip.out-of-stock {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f3f4f6;
  }

  .me-agent-variant-chip:disabled {
    cursor: not-allowed;
  }

  .me-agent-variant-chip-name {
    font-weight: 600;
    color: #1f2937;
  }

  .me-agent-variant-chip.active .me-agent-variant-chip-name {
    color: #667eea;
  }

  .me-agent-variant-chip-options {
    font-size: 11px;
    color: #6b7280;
  }

  .me-agent-variant-chip-stock {
    font-size: 10px;
    color: #dc2626;
    font-weight: 500;
  }

  /* Rewards Container */
  .me-agent-rewards-container {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .me-agent-rewards-description {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }

  .me-agent-rewards-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .me-agent-reward-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    transition: all 0.2s ease;
  }

  .me-agent-reward-item:hover {
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }

  .me-agent-reward-image {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background-size: cover;
    background-position: center;
    background-color: #f3f4f6;
    flex-shrink: 0;
  }

  .me-agent-reward-info {
    flex: 1;
  }

  .me-agent-reward-name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
  }

  .me-agent-reward-symbol {
    font-size: 12px;
    color: #6b7280;
    margin: 0 0 6px 0;
  }

  .me-agent-reward-balance {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
    margin: 0;
  }

  .me-agent-reward-select-button {
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .me-agent-reward-select-button:hover {
    transform: scale(1.05);
  }

  /* Error Container */
  .me-agent-error-container {
    padding: 48px 32px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .me-agent-error-icon {
    font-size: 64px;
    margin-bottom: 8px;
  }

  .me-agent-error-container h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  .me-agent-error-container p {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
    max-width: 400px;
  }

  .me-agent-error-container strong {
    color: #1f2937;
    font-weight: 600;
  }

  .me-agent-error-back-button {
    margin-top: 16px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .me-agent-error-back-button:hover {
    transform: scale(1.05);
  }

  /* Onboarding Container */
  .me-agent-onboarding-container {
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }

  .me-agent-onboarding-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #e5e7eb;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: me-agent-spin 1s linear infinite;
  }

  @keyframes me-agent-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .me-agent-onboarding-title {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .me-agent-onboarding-description {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.5;
    max-width: 400px;
    margin: 0;
  }

  .me-agent-onboarding-status {
    font-size: 13px;
    color: #667eea;
    font-weight: 500;
    padding: 8px 16px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 20px;
  }

  /* Confirmation Container */
  .me-agent-confirm-container {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .me-agent-confirm-summary {
    background: #f9fafb;
    padding: 24px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .me-agent-confirm-summary h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .me-agent-confirm-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  .me-agent-confirm-item span {
    color: #6b7280;
  }

  .me-agent-confirm-item strong {
    color: #1f2937;
    font-weight: 600;
  }

  .me-agent-confirm-savings {
    color: #16a34a !important;
    font-size: 18px !important;
  }

  .me-agent-confirm-button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .me-agent-confirm-button:hover {
    transform: scale(1.02);
  }

  /* Mobile Responsive */
  @media (max-width: 480px) {
    .me-agent-chat {
      width: calc(100vw - 32px) !important;
      height: calc(100vh - 40px) !important;
      bottom: 20px !important;
    }

    .me-agent-button {
      bottom: 16px;
    }

    .me-agent-chat.bottom-right,
    .me-agent-chat.bottom-left {
      left: 16px !important;
      right: 16px !important;
    }

    .me-agent-chat.maximized {
      width: 100vw !important;
      height: 100vh !important;
      top: 0 !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      border-radius: 0;
    }

    .me-agent-chat.maximized.has-offers-panel {
      width: 100vw !important;
    }

    .me-agent-button.bottom-right {
      right: 16px;
    }

    .me-agent-button.bottom-left {
      left: 16px;
    }

    /* Mobile Offers - Full overlay */
    .me-agent-chat.has-offers-panel .me-agent-offers-panel-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      z-index: 10;
      border-left: none;
    }

    .me-agent-offers-grid {
      grid-template-columns: 1fr;
      padding: 16px;
    }

    .me-agent-offer-preview-content {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

/**
 * Inject styles into the document
 */
export function injectStyles(): void {
  const styleId = "me-agent-sdk-styles";

  // Check if styles already exist
  if (document.getElementById(styleId)) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.id = styleId;
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
