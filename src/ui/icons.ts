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
    <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
        <path d="M8 8L13 13M8 8L3 3M8 8L3 13M8 8L13 3" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
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
    <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
        <rect x="2" y="3" width="12" height="10" rx="2" stroke="${color}"/>
        <rect x="8" y="4" width="5" height="8" rx="1" fill="${color}"/>
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
    <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
        <rect x="2" y="3" width="12" height="10" rx="2" stroke="${color}"/>
        <rect x="8" y="4" width="5" height="8" rx="1" fill="${color}"/>
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

/**
 * User Avatar Icon (GitHub-style)
 */
export function getUserAvatarIcon(options: IconOptions = {}): string {
  const {
    width = 32,
    height = 32,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <circle cx="16" cy="16" r="16" fill="#667eea"/>
      <path d="M16 16C18.2091 16 20 14.2091 20 12C20 9.79086 18.2091 8 16 8C13.7909 8 12 9.79086 12 12C12 14.2091 13.7909 16 16 16Z" fill="white"/>
      <path d="M16 18C11.5817 18 8 20.6863 8 24V26H24V24C24 20.6863 20.4183 18 16 18Z" fill="white"/>
    </svg>
  `.trim();
}

/**
 * Assistant Avatar Icon (Bot)
 */
export function getAssistantAvatarIcon(options: IconOptions = {}): string {
  const { width = 32, height = 32, color = "white", className = "" } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
        <rect width="${width}" height="${height}" rx="16" fill="#0F0F0F"/>
        <path d="M18.5513 15.9277V17.3563M12.7656 15.9277V17.3563M13.4888 21.642C13.4888 21.642 14.2121 22.3563 15.6585 22.3563C17.1049 22.3563 17.8281 21.642 17.8281 21.642M14.9353 15.9277V19.4992H15.6585" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.5625 15.4375C23.8111 15.4375 24.0496 15.3387 24.2254 15.1629C24.4012 14.9871 24.5 14.7486 24.5 14.5V12.625C24.5 12.3764 24.4012 12.1379 24.2254 11.9621C24.0496 11.7863 23.8111 11.6875 23.5625 11.6875H8.5625C8.31386 11.6875 8.0754 11.7863 7.89959 11.9621C7.72377 12.1379 7.625 12.3764 7.625 12.625V14.5C7.625 14.7486 7.72377 14.9871 7.89959 15.1629C8.0754 15.3387 8.31386 15.4375 8.5625 15.4375" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.8437 11.6879C11.2221 11.6879 10.626 11.441 10.1865 11.0014C9.74693 10.5619 9.5 9.96576 9.5 9.34416C9.5 8.72256 9.74693 8.12642 10.1865 7.68688C10.626 7.24734 11.2221 7.00041 11.8437 7.00041C12.7481 6.98465 13.6344 7.42347 14.3869 8.25962C15.1395 9.09578 15.7234 10.2905 16.0625 11.6879C16.4016 10.2905 16.9855 9.09578 17.7381 8.25962C18.4906 7.42347 19.3769 6.98465 20.2812 7.00041C20.9028 7.00041 21.499 7.24734 21.9385 7.68688C22.3781 8.12642 22.625 8.72256 22.625 9.34416C22.625 9.96576 22.3781 10.5619 21.9385 11.0014C21.499 11.441 20.9028 11.6879 20.2812 11.6879" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.6931 15.3577C23.6931 15.3577 23.005 15.394 22.7288 15.6791C22.4583 15.9584 22.4341 16.63 22.4341 16.63V23.1256C22.4341 23.6228 22.2366 24.0998 21.885 24.4514C21.5333 24.803 21.0564 25.0006 20.5592 25.0006L11.1842 25.0006C10.6869 25.0006 10.21 24.803 9.85833 24.4514C9.5067 24.0998 9.30915 23.6228 9.30915 23.1256V16.63C9.30915 16.63 9.27141 16.0437 8.90737 15.6791C8.55244 15.3237 8.02344 15.2773 8.02344 15.2773" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Search Icon (for quick actions)
 */
export function getSearchIcon(options: IconOptions = {}): string {
  const {
    width = 20,
    height = 20,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <circle cx="11" cy="11" r="8" stroke="${color}" stroke-width="2"/>
      <path d="M21 21L16.5 16.5" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `.trim();
}

/**
 * Tag Icon (for quick actions)
 */
export function getTagIcon(options: IconOptions = {}): string {
  const {
    width = 20,
    height = 20,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M20.59 13.41L13.42 20.58C13.05 20.95 12.55 21.15 12.04 21.15C11.53 21.15 11.03 20.95 10.66 20.58L2 12V2H12L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="7" cy="7" r="1.5" fill="${color}"/>
    </svg>
  `.trim();
}

/**
 * Sparkles Icon (for AI suggestions)
 */
export function getSparklesIcon(options: IconOptions = {}): string {
  const {
    width = 20,
    height = 20,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M19 3L19.5 5L21.5 5.5L19.5 6L19 8L18.5 6L16.5 5.5L18.5 5L19 3Z" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M19 16L19.5 18L21.5 18.5L19.5 19L19 21L18.5 19L16.5 18.5L18.5 18L19 16Z" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Chat Icon (for chat title)
 */
export function getChatIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
        <path d="M17 4.16667V13.5C17 13.8094 16.8784 14.1062 16.662 14.325C16.4457 14.5437 16.1522 14.6667 15.8462 14.6667H6.25482L3.90386 16.72L3.89737 16.7251C3.68967 16.9031 3.42612 17.0005 3.15386 17C2.98459 16.9997 2.81744 16.9619 2.6642 16.8892C2.46488 16.7963 2.29624 16.6473 2.17845 16.4601C2.06066 16.2728 1.99872 16.0552 2.00002 15.8333V4.16667C2.00002 3.85725 2.12159 3.5605 2.33797 3.34171C2.55436 3.12292 2.84785 3 3.15386 3H15.8462C16.1522 3 16.4457 3.12292 16.662 3.34171C16.8784 3.5605 17 3.85725 17 4.16667Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
}

/**
 * Arrow Right Icon (for card list button)
 */
export function getArrowRightIcon(options: IconOptions = {}): string {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
  } = options;

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
    <path d="M13.3281 8L1.66146 8M13.3281 8L8.32813 3M13.3281 8L8.32813 13" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`.trim();
}

/**
 * User Icon (for "Sign up for a brand" action)
 */
export function getUserIcon(options: IconOptions = {}): string {
  const {
    width = 20,
    height = 20,
    color = "#999999",
    className = "",
  } = options;

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
    <path d="M9.5 2C5.35775 2 2 5.35775 2 9.5C2 13.6422 5.35775 17 9.5 17C13.6422 17 17 13.6422 17 9.5C17 5.35775 13.6422 2 9.5 2Z" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3.70312 14.2605C3.70312 14.2605 5.37488 12.126 9.49988 12.126C13.6249 12.126 15.2974 14.2605 15.2974 14.2605M9.49988 9.50098C10.0966 9.50098 10.6689 9.26392 11.0909 8.84197C11.5128 8.42001 11.7499 7.84771 11.7499 7.25098C11.7499 6.65424 11.5128 6.08194 11.0909 5.65999C10.6689 5.23803 10.0966 5.00098 9.49988 5.00098C8.90314 5.00098 8.33084 5.23803 7.90888 5.65999C7.48693 6.08194 7.24988 6.65424 7.24988 7.25098C7.24988 7.84771 7.48693 8.42001 7.90888 8.84197C8.33084 9.26392 8.90314 9.50098 9.49988 9.50098Z" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`.trim();
}

/**
 * Money Icon (for "Purchase from a brand" action)
 */
export function getMoneyIcon(options: IconOptions = {}): string {
  const {
    width = 20,
    height = 20,
    color = "#999999",
    className = "",
  } = options;

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
    <path d="M14.75 9.7315C14.501 9.69578 14.2509 9.66901 14 9.65125M5 11.0988C4.744 11.0808 4.494 11.054 4.25 11.0185M11.375 10.375C11.375 10.8723 11.1775 11.3492 10.8258 11.7008C10.4742 12.0525 9.99728 12.25 9.5 12.25C9.00272 12.25 8.52581 12.0525 8.17417 11.7008C7.82254 11.3492 7.625 10.8723 7.625 10.375C7.625 9.87772 7.82254 9.40081 8.17417 9.04917C8.52581 8.69754 9.00272 8.5 9.5 8.5C9.99728 8.5 10.4742 8.69754 10.8258 9.04917C11.1775 9.40081 11.375 9.87772 11.375 10.375Z" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.5 16C8.501 16.4665 7.18775 16.75 5.75 16.75C4.9505 16.75 4.19 16.6623 3.5 16.5048C2.375 16.2468 2 15.5695 2 14.4145V6.3355C2 5.59675 2.78 5.08975 3.5 5.25475C4.19 5.41225 4.9505 5.5 5.75 5.5C7.18775 5.5 8.501 5.2165 9.5 4.75C10.499 4.2835 11.8122 4 13.25 4C14.0495 4 14.81 4.08775 15.5 4.24525C16.6865 4.5175 17 5.215 17 6.3355V14.4145C17 15.1532 16.22 15.6602 15.5 15.4952C14.81 15.3377 14.0495 15.25 13.25 15.25C11.8122 15.25 10.499 15.5335 9.5 16Z" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`.trim();
}

/**
 * External link icon
 */
export function getExternalLinkIcon(options: IconOptions = {}): string {
  const {
    width = 12,
    height = 12,
    color = "#0F0F0F",
    className = "",
  } = options;

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
    <path d="M8.25 1.125H10.875V3.75M10.3125 1.6875L7.5 4.5M6.375 1.875H3C2.70163 1.875 2.41548 1.99353 2.2045 2.2045C1.99353 2.41548 1.875 2.70163 1.875 3V9C1.875 9.29837 1.99353 9.58452 2.2045 9.7955C2.41548 10.0065 2.70163 10.125 3 10.125H9C9.29837 10.125 9.58452 10.0065 9.7955 9.7955C10.0065 9.58452 10.125 9.29837 10.125 9V5.625" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`.trim();
}
