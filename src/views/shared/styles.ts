/**
 * Styles - Scoped CSS for SDK components
 */

import { clashDisplayFonts } from "../../core/fonts";
import { fireImage } from "../../core/images";

export const styles = `
  /* Clash Display font - embedded */
  ${clashDisplayFonts}

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
    width: 672px;
    height: 602px;
    background: rgba(250, 250, 250, 0.8);
    outline: 1px #E6E6E6 solid;
    border-radius: 16px;
    box-shadow: 0px 24px 40px rgba(0, 0, 0, 0.08);
    z-index: 999999;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
    backdrop-filter: blur(32px);
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

  /* Detail Panel Wrapper (right side) */
  .me-agent-detail-panel-wrapper {
    position: relative;
    width: 0;
    height: 100%;
    overflow: hidden;
    transition: width 0.3s ease;
  }

  .me-agent-chat.has-detail-panel .me-agent-detail-panel-wrapper {
    width: 672px;
    border-left: 1px solid #999999;
  }

  /* Maximized State */
  .me-agent-chat.maximized {
    width: 672px !important;
    height: 100vh !important;
    top: 0 !important;
    bottom: 0 !important;
    right: 0 !important;
    left: auto !important;
    border-radius: 0;
    animation: slideInFromRight 0.3s ease;
  }

  /* Maximized with detail panel */
  .me-agent-chat.maximized.has-detail-panel {
    width: 1272px !important;
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
    background: transparent;
    color: #0F0F0F;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .me-agent-chat-title-container {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .me-agent-chat-title {
    font-size: 16px;
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
    background: white;
    border: none;
    color: #000000;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
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
    background: rgba(255, 255, 255, 0.5);
  }

  /* Messages Container */
  .me-agent-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: transparent;
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
    gap: 10px;
    animation: slideIn 0.3s ease;
    margin-bottom: 16px;
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

  /* Avatar */
  .me-agent-message-avatar-wrapper {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
  }

  .me-agent-message-avatar {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* Content Wrapper */
  .me-agent-message-content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .me-agent-message-content {
    max-width: 400px;
    width: fit-content;
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
    word-break: break-word;
  }

  .me-agent-message.user .me-agent-message-content {
    background: #000000;
    color: white;
    border-top-right-radius: 0px;
    margin-left: auto;
  }

  .me-agent-message.assistant .me-agent-message-content {
    background: white;
    color: #1f2937;
    border-top-left-radius: 0px;
  }

  /* Links in message content */
  .me-agent-message-content a {
    color: #999999;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .me-agent-message-content a:hover {
    color: #000000;
    text-decoration: underline;
  }

  /* Offer links - special styling */
  .me-agent-message-content .me-agent-offer-link {
    color: #999999;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 1px dashed #999999;
    padding-bottom: 1px;
  }

  .me-agent-message-content .me-agent-offer-link:hover {
    color: #999999;
    border-bottom-color: #999999;
    text-decoration: none;
  }

  /* Bold and italic text */
  .me-agent-message-content strong {
    font-weight: 600;
  }

  .me-agent-message-content em {
    font-style: italic;
  }

  /* Quick Actions */
  .me-agent-quick-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .me-agent-quick-action-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    border: none;
    padding: 8px 0px;
    white-space: nowrap;
  }

  .me-agent-quick-action-button:hover {
    transform: translateX(5px);
  }

  .me-agent-quick-action-icon {
    flex-shrink: 0;
    color: #999999;
  }

  .me-agent-quick-action-text {
    flex-shrink: 0;
  }

  /* Welcome Message Specific Styles */
  .me-agent-welcome-message .me-agent-message-content {
    max-width: 400px;
    line-height: 1.6;
  }

  .me-agent-welcome-message .me-agent-message-content > div {
    margin-bottom: 4px;
  }

  .me-agent-welcome-message .me-agent-message-content > div:first-child {
    font-size: 20px;
    margin-bottom: 8px;
  }

  /* Input Container */
  .me-agent-input-container {
    padding: 20px;
  }

  .me-agent-input-content {
    padding: 16px 20px;
    background: white;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 16px;
  }

  .me-agent-input {
    flex: 1;
    padding: 12px 2px;
    font-size: 16px;
    outline: none;
    border: none;
  }

  .me-agent-send-button {
    width: 32px;
    height: 32px;
    background: #000000;
    color: white;
    border: none;
    border-radius: 100px;
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
    opacity: 0.3;
    cursor: not-allowed;
  }

  .me-agent-send-button:hover:not(:disabled) {
    background: #999999;
  }

  /* Loading Indicator */
  .me-agent-loading {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .me-agent-loading-text {
    color: #6b7280;
    font-size: 14px;
  }

  .me-agent-loading-dots {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 14px;
  }

  .me-agent-loading-dot {
    width: 4px;
    height: 4px;
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

  .me-agent-loading-dot:nth-child(3) {
    animation-delay: 0s;
  }

  @keyframes bounce {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    30% {
      transform: translateY(-4px);
      opacity: 1;
    }
  }

  /* Card List Component (for offers, earnings, etc.) */
  .me-agent-card-list {
    background: #CCD3FF;
    border: 1px solid #8899FF;
    border-radius: 16px;
    padding: 16px;
    margin-top: 8px;
    animation: slideIn 0.3s ease;
  }

  .me-agent-card-list-content {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .me-agent-card-avatars {
    display: flex;
    position: relative;
    min-width: fit-content;
  }

  .me-agent-card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    border: 2px solid #CCD3FF;
    background-size: cover;
    background-position: center;
    background-color: white;
    margin-left: -8px;
    flex-shrink: 0;
  }

  .me-agent-card-avatar:first-child {
    margin-left: 0;
  }

  .me-agent-card-avatar-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .me-agent-card-avatar-overlay::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
    z-index: 1;
  }

  .me-agent-card-avatar-count {
    color: white;
    font-size: 14px;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2;
  }

  .me-agent-card-list-text {
    flex: 1;
  }

  .me-agent-card-list-title {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
  }

  .me-agent-card-list-button {
    color: #0F0F0F;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 0px;
    margin: 0px;
    transition: opacity 0.2s ease;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .me-agent-card-list-button:hover {
    opacity: 0.8;
  }

  /* Detail Panel */
  .me-agent-detail-panel {
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

  .me-agent-detail-panel.visible {
    opacity: 1;
    pointer-events: auto;
  }

  /* Detail Panel Header */
  .me-agent-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e5e5;
    background: white;
    flex-shrink: 0;
  }

  .me-agent-detail-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    flex: 1;
  }

  .me-agent-back-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: #1a1a1a;
    font-size: 14px;
    font-weight: 600;
    transition: opacity 0.2s ease;
    flex: 1;
  }

  .me-agent-back-button:hover {
    opacity: 0.7;
  }

  .me-agent-detail-header .me-agent-close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    color: #666;
    transition: opacity 0.2s ease;
  }

  .me-agent-detail-header .me-agent-close-button:hover {
    opacity: 0.7;
  }

  /* Detail Panel Content */
  .me-agent-detail-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Detail Panel Loading State */
  .me-agent-detail-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    min-height: 400px;
    width: 100%;
  }

  .me-agent-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #f3f4f6;
    border-top-color: #0f0f0f;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .me-agent-cancel-loading-btn {
    padding: 10px 20px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-cancel-loading-btn:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  .me-agent-cancel-loading-btn:active {
    transform: scale(0.98);
  }

  .me-agent-offers-header {
    padding: 20px;
    background: white;
    color: #0f0f0f;
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
    color: #0f0f0f;
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
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    align-content: start;
  }

  /* Brands List */
  .me-agent-brands-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .me-agent-brand-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: #FAFAFA;
    border: 1px solid #F5F5F5;
    border-radius: 16px;
    transition: all 0.2s ease;
  }

  .me-agent-brand-card:hover {
  }

  .me-agent-brand-logo-container {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 12px;
    overflow: hidden;
    background: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .me-agent-brand-logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .me-agent-brand-info {
    flex: 1;
    min-width: 0;
  }

  .me-agent-brand-name {
    font-family: 'Clash Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 24px;
    font-weight: 500;
    color: #000000;
    margin: 0 0 2px 0;
  }

  .me-agent-brand-conversion {
    font-size: 14px;
    color: #6B7280;
    margin: 0;
  }

  .me-agent-brand-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  .me-agent-brand-reward-amount {
    font-family: 'Clash Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 24px;
    font-weight: 600;
    color: #000000;
    text-align: right;
  }

  .me-agent-brand-reward-symbol {
    font-size: 12px;
    color: #000000;
    font-weight: 500;
  }

  .me-agent-brand-signup-button {
    flex-shrink: 0;
    padding: 8px 12px;
    background: transparent;
    color: #000000;
    border: 1px solid #E6E6E6;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .me-agent-brand-signup-button:hover {
    background: #F9FAFB;
    border-color: #D1D5DB;
  }

  .me-agent-brand-signup-button svg {
    flex-shrink: 0;
  }

  /* Category Grid Styles */
  .me-agent-categories-grid {
    overflow-y: auto;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .me-agent-category-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: 1px solid #F5F5F5;
    height: 162px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
  }

  .me-agent-category-card:hover {
    transform: scale(1.02);
  }

  .me-agent-category-image-container {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;
  }

  .me-agent-category-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .me-agent-category-icon-overlay {
    width: 24px;
    height: 24px;
    background: black;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .me-agent-category-info {
    // padding: 16px;
  }

  .me-agent-category-title {
    font-size: 18px;
    font-weight: 600;
    color: #000000;
    margin: 0 0 8px 0;
    line-height: 1.3;
  }

  .me-agent-category-brand-count {
    font-size: 14px;
    color: #6B7280;
    margin: 0;
  }

  /* Brand Offers List Styles */
  .me-agent-brands-offers-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .me-agent-brand-offers-section {
    background: white;
  }

  .me-agent-brand-offers-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .me-agent-brand-offers-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .me-agent-brand-offers-logo {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    background: #F9FAFB;
  }

  .me-agent-brand-offers-name {
    font-family: 'Clash Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 24px;
    font-weight: 500;
    color: #000000;
    margin: 0;
  }

  .me-agent-brand-earning-amount {
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    text-align: right;
    flex-shrink: 0;
    padding: 8px 16px;
    background: #000000;
    border-radius: 100px;
  }

  .me-agent-brand-offers-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  .me-agent-brand-all-offers-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 20px;
  }

  .me-agent-view-all-offers-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    padding: 12px 20px;
    background: #F5F5F5;
    border: none;
    border-radius: 8px;
    color: #0F0F0F;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;
  }

  .me-agent-view-all-offers-btn:hover {
    background: #E5E5E5;
  }

  .me-agent-view-all-offers-btn:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    .me-agent-brand-offers-grid,
    .me-agent-brand-all-offers-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }

  .me-agent-brand-offer-card {
    width: 100%;
    background: #FAFAFA;
    border: 1px solid #F5F5F5;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-brand-offer-card:hover {
    transform: scale(1.02);
  }

  .me-agent-brand-offer-image-container {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;
    background: white;
  }

  .me-agent-brand-offer-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .me-agent-brand-offer-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #000000;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
  }

  .me-agent-brand-offer-info {
    padding: 12px;
  }

  .me-agent-brand-offer-name {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    margin: 0 0 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .me-agent-brand-offer-pricing {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .me-agent-brand-offer-price {
    font-size: 16px;
    font-weight: 600;
    color: #000000;
  }

  .me-agent-brand-offer-original-price {
    font-size: 14px;
    color: #9CA3AF;
    text-decoration: line-through;
  }

  .me-agent-empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6B7280;
    font-size: 16px;
  }

  /* Note: Offer cards now use .me-agent-brand-offer-card for consistency */
  
  /* Override brand offer card width when in grid layout */
  .me-agent-offers-grid .me-agent-brand-offer-card {
    min-width: unset;
    max-width: unset;
    width: 100%;
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
    display: flex;
    flex-direction: column;
    background: white;
    height: 100%;
    overflow: hidden;
  }

  .me-agent-offer-detail-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    min-height: 0;
  }

  /* Image Carousel */
  .me-agent-image-carousel {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    overflow-x: auto;
  }

  .me-agent-carousel-image {
    flex-shrink: 0;
    width: 220px;
    height: 220px;
    background-size: cover;
    background-position: center;
    background-color: #f3f4f6;
    border-radius: 12px;
  }

  .me-agent-carousel-image.active {
    border: 2px solid #0f0f0f;
  }

  /* Product Info */
  .me-agent-detail-info {
    margin-bottom: 24px;
  }

  .me-agent-detail-title {
    font-size: 14px;
    font-weight: 600;
    color: #0f0f0f;
    margin: 0 0 4px 0;
    line-height: 1.4;
  }

  .me-agent-detail-pricing {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 16px;
  }

  .me-agent-price-main {
    font-size: 14px;
    font-weight: 600;
    color: #0f0f0f;
  }

  .me-agent-price-original {
    font-size: 14px;
    color: #9ca3af;
    text-decoration: line-through;
    font-weight: 600;
  }

  .me-agent-discount-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #0F0F0F;
    color: white;
    border-radius: 100px;
    font-size: 10px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .me-agent-discount-badge::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    background-image: url(${fireImage});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    vertical-align: middle;
  }

  .me-agent-detail-shipping {
    font-size: 14px;
    margin: 0 0 20px 0;
  }

  /* Section Label */
  .me-agent-section-label {
    font-size: 14px;
    font-weight: 600;
    color: #0f0f0f;
    display: block;
    margin-bottom: 8px;
  }

  /* Variant Section */
  .me-agent-variant-section {
    margin-bottom: 40px;
  }

  .me-agent-variant-grid {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .me-agent-variant-card {
    flex-shrink: 0;
    background: none;
    border: 2px solid transparent;
    border-radius: 16px;
    cursor: pointer;
    padding: 2px;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .me-agent-variant-card:hover {
    border-color: #d1d5db;
  }

  .me-agent-variant-card.selected {
    border-color: #0f0f0f;
  }

  .me-agent-variant-image-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 14px;
    overflow: hidden;
  }

  .me-agent-variant-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #f3f4f6;
  }

  .me-agent-variant-placeholder {
    width: 100%;
    height: 100%;
    background: #f3f4f6;
  }

  .me-agent-variant-badge {
    position: absolute;
    bottom: 6px;
    left: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 2px 6px;
    background: rgba(0, 0, 0, 0.85);
    color: white;
    border-radius: 100px;
    font-size: 8px;
    font-weight: 500;
    width: 92%;
  }

  .me-agent-variant-badge-icon {
    font-size: 10px;
    display: inline-block;
    vertical-align: middle;
  }

  .me-agent-variant-badge-text {
    font-size: 10px;
  }

  /* Quantity Section */
  .me-agent-quantity-section {
    margin-bottom: 20px;
  }

  .me-agent-quantity-selector {
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 200px;
  }

  .me-agent-quantity-btn {
    width: 40px;
    height: 40px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .me-agent-quantity-btn:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  .me-agent-quantity-input {
    flex: 1;
    height: 40px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
  }

  .me-agent-quantity-input:focus {
    outline: none;
    border-color: #0f0f0f;
  }

  /* Tabs */
  .me-agent-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .me-agent-tab {
    padding: 10px 24px;
    background: none;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #0f0f0f;
    transition: all 0.2s ease;
  }

  .me-agent-tab:hover {
    background: #f3f4f6;
  }

  .me-agent-tab.active {
    background: #0f0f0f;
    color: white;
  }

  .me-agent-tab.active:hover {
    background: #1a1a1a;
  }

  .me-agent-tab-content {
    min-height: 200px;
  }

  .me-agent-tab-pane {
    display: none;
  }

  .me-agent-tab-pane.active {
    display: block;
  }

  .me-agent-description-text {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }

  /* Reviews */
  .me-agent-reviews {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .me-agent-reviews-summary {
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }

  .me-agent-reviews-bars {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .me-agent-rating-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .me-agent-stars-small {
    display: flex;
    gap: 2px;
    color: #d1d5db;
  }

  .me-agent-stars-small span.filled {
    color: #f59e0b;
  }

  .me-agent-rating-bar {
    flex: 1;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }

  .me-agent-rating-fill {
    height: 100%;
    background: #f59e0b;
  }

  .me-agent-rating-count {
    font-size: 14px;
    color: #6b7280;
    min-width: 30px;
    text-align: right;
  }

  .me-agent-reviews-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .me-agent-score-number {
    font-size: 48px;
    font-weight: 700;
    color: #0f0f0f;
    line-height: 1;
  }

  .me-agent-score-number span {
    font-size: 24px;
    color: #9ca3af;
  }

  .me-agent-stars-large {
    display: flex;
    gap: 4px;
    font-size: 20px;
    color: #d1d5db;
  }

  .me-agent-stars-large span.filled {
    color: #f59e0b;
  }

  .me-agent-review-count {
    font-size: 14px;
    color: #6b7280;
  }

  .me-agent-reviews-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .me-agent-review-item {
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }

  .me-agent-review-header {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }

  .me-agent-reviewer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .me-agent-reviewer-name {
    font-size: 14px;
    font-weight: 600;
    color: #0f0f0f;
    margin-bottom: 4px;
  }

  .me-agent-review-stars {
    display: flex;
    gap: 2px;
    font-size: 14px;
    color: #d1d5db;
  }

  .me-agent-review-stars span.filled {
    color: #f59e0b;
  }

  .me-agent-review-text {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }

  /* Redemption Info */
  .me-agent-redemption-info {
    margin-bottom: 16px;
    padding: 16px;
    background: #F5F6FF;
    border: 1px solid #EBEEFF;
    border-radius: 8px;
    font-size: 14px;
    color: #0F0F0F;
    line-height: 1.6;
  }

  .me-agent-redemption-info p {
    margin: 0;
  }

  /* Bottom Actions */
  .me-agent-detail-bottom-actions {
    position: sticky;
    bottom: 0;
    padding: 20px;
    background: white;
  }

  .me-agent-detail-bottom-actions-content {
    background: #FAFAFA;
    padding: 16px 20px;
    border-radius: 16px;
  }

  .me-agent-detail-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .me-agent-redeem-button {
    flex: 1;
    padding: 14px 24px;
    background: #000000;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-redeem-button:hover {
    background: #1f1f1f;
  }

  .me-agent-secondary-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .me-agent-action-button {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid #F5F5F5;
    border-radius: 10px;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-action-button:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  .me-agent-action-button svg {
    display: block;
  }

  .me-agent-add-to-cart-button {
    height: 48px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F5F5F5;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #0f0f0f;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .me-agent-add-to-cart-button:hover {
    background: #e5e5e5;
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

  /* Tablet Responsive */
  @media (max-width: 1024px) {
    .me-agent-offers-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .me-agent-offers-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }

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

    .me-agent-chat.maximized.has-detail-panel {
      width: 100vw !important;
    }

    .me-agent-button.bottom-right {
      right: 16px;
    }

    .me-agent-button.bottom-left {
      left: 16px;
    }

    /* Mobile Detail Panel - Full overlay */
    .me-agent-chat.has-detail-panel .me-agent-detail-panel-wrapper {
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
      padding: 12px;
    }

    .me-agent-card-list-content {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  /* ===== Redemption Styles ===== */
  .me-agent-redemption-container {
    margin: 0 auto;
    padding: 24px;
    flex: 1;
  }

  .me-agent-redemption-header {
    margin-bottom: 32px;
  }

  .me-agent-redemption-subtitle {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

  .me-agent-step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 60px;
    width: 100%;
    position: relative;
    padding: 0px;
  }

  .me-agent-step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    position: relative;
    z-index: 2;
    flex: 0 0 auto;
  }

  .me-agent-step-circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #E5E7EB;
    background: #F9FAFB;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
  }

  .me-agent-step-item.active .me-agent-step-circle {
    background: #0F0F0F;
    border-color: #0F0F0F;
  }

  .me-agent-step-item.completed .me-agent-step-circle {
    background: #0F0F0F;
    border-color: #0F0F0F;
  }

  .me-agent-step-item.completed .me-agent-step-circle::after {
    content: '✓';
    color: white;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .me-agent-step-label {
    font-size: 14px;
    color: #9CA3AF;
    font-weight: 400;
    white-space: nowrap;
  }

  .me-agent-step-item.active .me-agent-step-label {
    color: #0F0F0F;
    font-weight: 600;
  }

  .me-agent-step-item.completed .me-agent-step-label {
    color: #0F0F0F;
    font-weight: 500;
  }

  .me-agent-step-line {
    flex: 1;
    height: 2px;
    background: #E5E7EB;
    margin: 0 16px;
    margin-bottom: 32px;
    position: relative;
  }

  .me-agent-step-line.completed {
    background: #0F0F0F;
  }

  .me-agent-redemption-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .me-agent-offer-summary-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 12px;
    background: #FAFAFA;
    border-radius: 12px;
  }

  .me-agent-offer-summary-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .me-agent-offer-summary-details {
    flex: 1;
    min-width: 0;
  }

  .me-agent-offer-summary-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: #0F0F0F;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .me-agent-offer-summary-price {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .me-agent-price-final {
    font-size: 18px;
    font-weight: 700;
    color: #0F0F0F;
  }

  .me-agent-price-original {
    font-size: 16px;
    color: #9CA3AF;
    text-decoration: line-through;
  }

  .me-agent-offer-summary-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;
  }

  .me-agent-offer-summary-discount {
    background: #0F0F0F;
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  .me-agent-offer-summary-discount::before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 14px;
    background-image: url(${fireImage});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .me-agent-offer-amount-needed {
    font-size: 14px;
    font-weight: 600;
    color: #0F0F0F;
    white-space: nowrap;
  }

  .me-agent-reward-selection {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .me-agent-selected-reward-card {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .me-agent-reward-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .me-agent-reward-info {
    flex: 1;
    min-width: 0;
  }

  .me-agent-reward-balance {
    font-size: 16px;
    font-weight: 700;
    color: #0F0F0F;
  }

  .me-agent-reward-symbol {
    font-weight: 400;
    font-size: 12px;
  }

  .me-agent-reward-name {
    font-size: 14px;
    font-weight: 400;
    color: #666;
  }

  .me-agent-reward-amount {
    text-align: right;
    flex-shrink: 0;
  }

  .me-agent-amount-needed {
    font-size: 14px;
    font-weight: 600;
    color: #0F0F0F;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .me-agent-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .me-agent-status-dot.success {
    background: #10B981;
  }

  .me-agent-status-dot.error {
    background: #EF4444;
  }

  .me-agent-change-reward-btn {
    width: fit-content;
    margin: 0 auto;
    padding: 10px 24px;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #0F0F0F;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-change-reward-btn:hover {
    background: #F9FAFB;
    border-color: #D1D5DB;
  }

  .me-agent-redeem-btn-container {
    position: absolute;
    bottom: 0;
    padding: 20px;
    background: white;
    left: 0;
    right: 0;
    z-index: 5;
  }

  .me-agent-redeem-btn {
    width: 100%;
    padding: 16px;
    background: #0F0F0F;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 8px;
  }

  .me-agent-redeem-btn:hover:not(:disabled) {
    background: #1F2937;
  }

  .me-agent-redeem-btn:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .me-agent-processing-animation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
  }

  .me-agent-processing-animation h3 {
    margin: 24px 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #0F0F0F;
  }

  .me-agent-processing-animation p {
    margin: 0;
    font-size: 14px;
    color: #666;
  }

  .me-agent-success-animation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
  }

  .me-agent-success-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #0F0F0F;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: 700;
  }

  .me-agent-success-animation h3 {
    margin: 24px 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #0F0F0F;
  }

  .me-agent-success-animation p {
    margin: 0;
    font-size: 14px;
    color: #666;
  }

  .me-agent-coupon-details-card {
    padding: 24px;
    background: white;
    border: 2px dashed #E5E5E5;
    border-radius: 12px;
    text-align: center;
  }

  .me-agent-coupon-label {
    font-size: 12px;
    text-transform: uppercase;
    color: #666;
    margin-bottom: 12px;
  }

  .me-agent-coupon-code {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .me-agent-coupon-code-text {
    font-size: 24px;
    font-weight: 700;
    font-family: 'Courier New', monospace;
    color: #0F0F0F;
    letter-spacing: 2px;
  }

  .me-agent-copy-coupon-btn {
    padding: 6px 12px;
    background: #F5F5F5;
    border: 1px solid #E5E5E5;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #0F0F0F;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-copy-coupon-btn:hover {
    background: #E5E5E5;
  }

  .me-agent-coupon-discount {
    font-size: 14px;
    color: #666;
  }

  .me-agent-use-coupon-btn {
    width: 100%;
    padding: 16px;
    background: #0F0F0F;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-use-coupon-btn:hover {
    background: #0F0F0F;
    opacity: 0.8;
  }

  .me-agent-error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
  }

  .me-agent-error-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #FF4444;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    font-weight: 700;
  }

  .me-agent-error-state h3 {
    margin: 24px 0 8px 0;
    font-size: 20px;
    font-weight: 600;
    color: #0F0F0F;
  }

  .me-agent-error-state p {
    margin: 0 0 24px 0;
    font-size: 14px;
    color: #666;
  }

  .me-agent-try-again-btn {
    padding: 12px 24px;
    background: #0F0F0F;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-try-again-btn:hover {
    background: #333;
  }

  .me-agent-loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
  }

  .me-agent-loading-state p {
    margin: 24px 0 0 0;
    font-size: 14px;
    color: #666;
  }

  .me-agent-error-message {
    padding: 12px;
    background: #FFE5E5;
    border: 1px solid #FF4444;
    border-radius: 8px;
    font-size: 14px;
    color: #FF4444;
  }

  .me-agent-reward-list {
    padding: 24px;
  }

  .me-agent-reward-list-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #0F0F0F;
  }

  .me-agent-reward-list-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .me-agent-reward-list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: white;
    border: 2px solid #E5E5E5;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-reward-list-item:hover {
    border-color: #0F0F0F;
  }

  .me-agent-reward-list-item.selected {
    border-color: #0F0F0F;
    background: #F5F5F5;
  }

  .me-agent-reward-list-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .me-agent-reward-list-info {
    flex: 1;
  }

  .me-agent-reward-list-name {
    font-size: 16px;
    font-weight: 600;
    color: #0F0F0F;
    margin-bottom: 4px;
  }

  .me-agent-reward-list-balance {
    font-size: 14px;
    color: #666;
  }

  .me-agent-reward-list-check {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #0F0F0F;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .me-agent-reward-list-item.selected .me-agent-reward-list-check {
    opacity: 1;
  }

  /* ============================================
     BOTTOM SHEET MODAL
     ============================================ */
  .me-agent-bottom-sheet-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .me-agent-bottom-sheet-overlay.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .me-agent-bottom-sheet {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    border-radius: 24px 24px 0 0;
    max-height: 70vh;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 1001;
    display: flex;
    flex-direction: column;
  }

  .me-agent-bottom-sheet.visible {
    transform: translateY(0);
  }

  .me-agent-bottom-sheet-header {
    padding: 20px 24px;
    border-bottom: 1px solid #E5E7EB;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
  }

  .me-agent-bottom-sheet-title {
    font-size: 18px;
    font-weight: 600;
    color: #0F0F0F;
    margin: 0;
    text-align: center;
  }

  .me-agent-bottom-sheet-close {
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #F3F4F6;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .me-agent-bottom-sheet-close:hover {
    background: #E5E7EB;
  }

  .me-agent-bottom-sheet-content {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }

  .me-agent-bottom-sheet-footer {
    padding: 16px 24px;
    border-top: 1px solid #E5E7EB;
    flex-shrink: 0;
  }

  /* ============================================
     DEV HELPER STYLES
     ============================================ */
  .me-agent-dev-help-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100000;
    animation: fadeIn 0.2s ease;
  }

  .me-agent-dev-help-modal {
    background: white;
    border-radius: 16px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideInUp 0.3s ease;
  }

  .me-agent-dev-help-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    border-bottom: 1px solid #E5E5E5;
  }

  .me-agent-dev-help-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #0F0F0F;
  }

  .me-agent-dev-help-close {
    background: none;
    border: none;
    font-size: 32px;
    line-height: 1;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .me-agent-dev-help-close:hover {
    background: #F5F5F5;
    color: #0F0F0F;
  }

  .me-agent-dev-help-content {
    padding: 24px;
  }

  .me-agent-dev-shortcut {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #F5F5F5;
  }

  .me-agent-dev-shortcut:last-child {
    border-bottom: none;
  }

  .me-agent-dev-shortcut kbd {
    background: linear-gradient(180deg, #FAFAFA 0%, #F0F0F0 100%);
    border: 1px solid #D4D4D4;
    border-radius: 6px;
    padding: 8px 12px;
    font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    font-weight: 600;
    color: #0F0F0F;
    min-width: 40px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .me-agent-dev-shortcut span {
    flex: 1;
    color: #525252;
    font-size: 14px;
    line-height: 1.5;
  }

  .me-agent-dev-help-footer {
    padding: 16px 24px;
    background: #F9F9F9;
    border-radius: 0 0 16px 16px;
    text-align: center;
  }

  .me-agent-dev-help-footer small {
    color: #888;
    font-size: 12px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
