/**
 * SVG Icons for ME Agent SDK
 * Each icon function accepts optional width, height, and color parameters
 */

interface IconOptions {
  width?: string | number;
  height?: string | number;
  color?: string;
  className?: string;
}

/**
 * Main ME Agent Bot Icon (for the chat button)
 */
export function getBotIcon(options: IconOptions = {}): string {
  const { width = 37, height = 40, color = "white", className = "" } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 37 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M23.4571 18.3143V21.1714M11.8857 18.3143V21.1714M13.3321 29.7429C13.3321 29.7429 14.7786 31.1714 17.6714 31.1714C20.5643 31.1714 22.0107 29.7429 22.0107 29.7429M16.225 18.3143V25.4572H17.6714" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M33.475 18.4767C33.9723 18.4767 34.4492 18.2791 34.8008 17.9275C35.1525 17.5759 35.35 17.099 35.35 16.6017V12.8517C35.35 12.3544 35.1525 11.8775 34.8008 11.5259C34.4492 11.1742 33.9723 10.9767 33.475 10.9767H3.475C2.97772 10.9767 2.50081 11.1742 2.14918 11.5259C1.79754 11.8775 1.6 12.3544 1.6 12.8517V16.6017C1.6 17.099 1.79754 17.5759 2.14918 17.9275C2.50081 18.2791 2.97772 18.4767 3.475 18.4767" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.0308 10.9758C8.7876 10.9758 7.59532 10.482 6.71624 9.6029C5.83716 8.72382 5.3433 7.53153 5.3433 6.28833C5.3433 5.04513 5.83716 3.85284 6.71624 2.97377C7.59532 2.09469 8.7876 1.60083 10.0308 1.60083C11.8396 1.56932 13.6121 2.44694 15.1172 4.11926C16.6223 5.79157 17.7901 8.18096 18.4683 10.9758C19.1465 8.18096 20.3143 5.79157 21.8194 4.11926C23.3245 2.44694 25.097 1.56932 26.9058 1.60083C28.149 1.60083 29.3413 2.09469 30.2204 2.97377C31.0994 3.85284 31.5933 5.04513 31.5933 6.28833C31.5933 7.53153 31.0994 8.72382 30.2204 9.6029C29.3413 10.482 28.149 10.9758 26.9058 10.9758" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M33.7429 18.3143C33.7429 18.3143 32.3666 18.3869 31.8143 18.9572C31.2733 19.5157 31.225 20.8589 31.225 20.8589V33.85C31.225 34.8446 30.8299 35.7984 30.1266 36.5017C29.4234 37.2049 28.4696 37.6 27.475 37.6L8.725 37.6C7.73044 37.6 6.77661 37.2049 6.07335 36.5017C5.37009 35.7984 4.975 34.8446 4.975 33.85V20.8589C4.975 20.8589 4.89952 19.6862 4.17143 18.9572C3.46158 18.2464 2.40357 18.1536 2.40357 18.1536" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Close/X Icon (for close buttons)
 */
export function getCloseIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M18 6L6 18M6 6L18 18" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Send/Arrow Icon (for send message button)
 */
export function getSendIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Chevron/Arrow Back Icon (for back navigation)
 */
export function getChevronLeftIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M15 18L9 12L15 6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Maximize/Expand Icon (for expanding the chat window)
 */
export function getMaximizeIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Minimize Icon (for minimizing the chat window)
 */
export function getMinimizeIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M4 14H10V20M20 10H14V4" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Loading/Spinner Icon (for loading states)
 */
export function getLoadingIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className} me-agent-spin">
      <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Check/Success Icon (for success states)
 */
export function getCheckIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M20 6L9 17L4 12" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Error/Alert Icon (for error states)
 */
export function getErrorIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2"/>
      <path d="M12 8V12M12 16H12.01" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `.trim();
}

/**
 * Gift/Rewards Icon (for rewards/offers)
 */
export function getGiftIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <rect x="3" y="8" width="18" height="4" rx="1" stroke="${color}" stroke-width="2"/>
      <rect x="5" y="12" width="14" height="9" rx="1" stroke="${color}" stroke-width="2"/>
      <path d="M12 8V21M9 8C9 6.34315 7.65685 5 6 5C4.34315 5 3 6.34315 3 8M15 8C15 6.34315 16.3431 5 18 5C19.6569 5 21 6.34315 21 8" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `.trim();
}
