(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ethers'), require('@developeruche/runtime-sdk'), require('@developeruche/protocol-core')) :
    typeof define === 'function' && define.amd ? define(['exports', 'ethers', '@developeruche/runtime-sdk', '@developeruche/protocol-core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MeAgent = {}, global.ethers, global.RuntimeSDK, global.ProtocolCore));
})(this, (function (exports, ethers, runtimeSdk, protocolCore) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /**
     * Formatting Utilities
     * Pure helper functions for formatting numbers, currency, etc.
     */
    /**
     * Format a number with thousand separators
     * @example formatNumber(3000) => "3,000"
     */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    /**
     * Generate a unique ID
     * @example generateId() => "1234567890-abc123def"
     */
    function generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Generate a UUID v4
     */
    function generateUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Session Service
     * Business logic for session and message management
     */
    /**
     * Session Service
     * Handles session creation and message management
     */
    class SessionService {
        constructor(sessionAPI, chatAPI) {
            this.sessionAPI = sessionAPI;
            this.chatAPI = chatAPI;
            this.sessionId = null;
            this.messages = [];
        }
        /**
         * Initialize or get existing session
         */
        getOrCreateSession() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.sessionId) {
                    this.sessionId = yield this.sessionAPI.createSession();
                }
                return this.sessionId;
            });
        }
        /**
         * Get current session ID
         */
        getSessionId() {
            return this.sessionId;
        }
        /**
         * Send a message in the current session
         */
        sendMessage(content, onChunk, onComplete, onError) {
            return __awaiter(this, void 0, void 0, function* () {
                const sessionId = yield this.getOrCreateSession();
                // Add user message to history
                const userMessage = this.createMessage("user", content);
                this.messages.push(userMessage);
                // Send via API
                yield this.chatAPI.sendMessage(sessionId, content, onChunk, onComplete, onError);
            });
        }
        /**
         * Add a message to history
         */
        addMessage(message) {
            this.messages.push(message);
        }
        /**
         * Update the last message content
         */
        updateLastMessage(content) {
            if (this.messages.length > 0) {
                this.messages[this.messages.length - 1].content = content;
            }
        }
        /**
         * Get all messages
         */
        getMessages() {
            return [...this.messages];
        }
        /**
         * Get chat state
         */
        getChatState() {
            return {
                isOpen: false,
                messages: this.getMessages(),
                sessionId: this.sessionId,
                isLoading: false,
            };
        }
        /**
         * Clear all messages
         */
        clearMessages() {
            this.messages = [];
        }
        /**
         * Create a message object
         */
        createMessage(role, content) {
            return {
                id: generateId(),
                role,
                content,
                timestamp: Date.now(),
            };
        }
    }

    const PRESET_CATEGORIES = [
        {
            id: 1,
            image: "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589166/cate-1_qizn7y.png",
            title: "Must Haves",
            icon: "award",
            description: "Essential products you shouldn't miss",
            categoryNames: ["Must Haves", "Essentials"],
        },
        {
            id: 2,
            image: "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589166/cate7_tbhw5u.png",
            title: "Cosmetics",
            icon: "shirt",
            description: "Beauty and personal care products",
            categoryNames: ["Cosmetics", "Beauty"],
        },
        {
            id: 3,
            image: "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589167/cate2_gtjck8.png",
            title: "Travel &\nExperiences",
            icon: "heartPulse",
            description: "Destinations and unforgettable moments",
            categoryNames: ["Travel", "Experiences", "Travel & Experiences"],
        },
        {
            id: 6,
            image: "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589167/cate-4_uxqxqx.png",
            title: "Sneakers",
            icon: "sofa",
            description: "Stylish footwear for all occasions",
            categoryNames: ["Sneakers", "Shoes", "Footwear"],
        },
        {
            id: 7,
            image: "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589167/cate-5_zxqxqx.png",
            title: "Food &\nBeverages",
            icon: "tag",
            description: "Culinary delights and refreshments",
            categoryNames: [
                "Food",
                "Beverages",
                "Food & Beverages",
                "Food and beverages",
            ],
        },
        {
            id: 8,
            image: "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589168/cate-3_sports.png",
            title: "Deals &\nSports",
            icon: "layoutGrid",
            description: "Sporting goods and special offers",
            categoryNames: ["Sports", "Sport deals", "Deals"],
        },
        {
            id: 5,
            image: "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589167/cate-6_pfxfbq.png",
            title: "Gadgets &\nElectronics",
            icon: "laptop",
            description: "Tech products and accessories",
            categoryNames: ["Electronics", "Gadgets", "Tech"],
        },
        {
            id: 4,
            image: "https://res.cloudinary.com/dlwsf8xgj/image/upload/v1712589168/cate-8_s6yf5z.png",
            title: "Art &\nCollectibles",
            icon: "bookOpen",
            description: "Unique items for collectors",
            categoryNames: ["Art", "Collectibles", "Art & Collectibles"],
        },
    ];
    /**
     * Get preset category by category name from backend
     */
    function getCategoryPreset(categoryName) {
        return PRESET_CATEGORIES.find((preset) => preset.categoryNames.some((name) => name.toLowerCase() === categoryName.toLowerCase()));
    }
    /**
     * Merge backend categories with presets
     */
    function mergeCategoriesWithPresets(backendCategories) {
        return backendCategories.map((category) => {
            const preset = getCategoryPreset(category.categoryName);
            if (preset) {
                return Object.assign(Object.assign({}, category), { image: preset.image, title: preset.title, icon: preset.icon, description: preset.description });
            }
            return category;
        });
    }

    /**
     * Message Parser Service
     * Extracts structured data from AI agent responses
     */
    /**
     * Message Parser Service
     * Handles parsing of AI agent responses and function calls/responses
     */
    class MessageParser {
        /**
         * Parse raw AI response data into structured format
         */
        parseMessageData(rawData) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            let offers = [];
            let brands = [];
            let categories = [];
            let showWaysToEarn = false;
            const functionResponse = (_c = (_b = (_a = rawData.content) === null || _a === void 0 ? void 0 : _a.parts) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.functionResponse;
            const functionCall = (_f = (_e = (_d = rawData.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.functionCall;
            if (functionResponse) {
                if (functionResponse.name === "query_offers") {
                    const matches = ((_g = functionResponse.response) === null || _g === void 0 ? void 0 : _g.matches) || [];
                    offers = this.parseOffers(matches);
                }
                else if (functionResponse.name === "get_signup_earning_brands") {
                    const rawBrands = ((_h = functionResponse.response) === null || _h === void 0 ? void 0 : _h.brands) || [];
                    brands = this.parseBrands(rawBrands);
                }
                else if (functionResponse.name === "get_category_purchase_earning") {
                    const rawCategories = ((_j = functionResponse.response) === null || _j === void 0 ? void 0 : _j.categories) || [];
                    categories = mergeCategoriesWithPresets(rawCategories);
                }
            }
            else if ((functionCall === null || functionCall === void 0 ? void 0 : functionCall.name) === "ways_to_earn") {
                showWaysToEarn = true;
            }
            return { offers, brands, categories, showWaysToEarn };
        }
        /**
         * Parse offers from query_offers function response
         * New format:
         * [0] = id, [1] = name, [2] = offerCode, [3] = price, [4] = description,
         * [5] = available methods, [6] = discountType, [7] = discountDetails array,
         * [8] = variant title, [9] = null, [10] = null, [11] = brandName, [12] = image
         */
        parseOffers(matches) {
            return matches.map((match) => ({
                id: match[0] || "",
                name: match[1] || "Unnamed Offer",
                offerCode: match[2] || "",
                price: match[3] || 0,
                description: match[4] || "",
                discountType: match[6] || "",
                discountDetails: match[7] || [],
                brandName: match[11] || "Unknown Brand",
                image: match[12] || undefined,
            }));
        }
        /**
         * Parse brands from get_signup_earning_brands function response
         */
        parseBrands(brands) {
            return brands.map((brand) => ({
                id: brand.id || "",
                name: brand.name || "Unknown Brand",
                logoUrl: brand.logoUrl || null,
                description: brand.description || null,
                websiteUrl: brand.websiteUrl || null,
                shopifyStoreUrl: brand.shopifyStoreUrl || null,
                network: brand.network || "sepolia",
                categoryId: brand.categoryId || "",
                categoryName: brand.categoryName || "Unknown Category",
                rewardDetails: brand.rewardDetails || {
                    earningMethodId: "",
                    earningType: "sign_up",
                    isActive: true,
                    rewardExistingCustomers: false,
                    rewardInfo: {
                        id: "",
                        rewardName: "",
                        rewardSymbol: "",
                        rewardImage: "",
                        rewardValueInDollars: "0",
                        rewardOriginalValue: "0",
                    },
                    rules: [],
                },
            }));
        }
    }

    /**
     * Magic Link Client Wrapper
     * Handles authentication and wallet operations
     */
    class MagicClient {
        constructor(config) {
            this.magic = null;
            this.initialized = false;
            this.config = config;
        }
        /**
         * Initialize Magic SDK
         * Loads the Magic SDK from CDN if not already loaded
         */
        init() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.initialized) {
                    return;
                }
                // Load Magic SDK from CDN if not already loaded
                if (!window.Magic) {
                    yield this.loadMagicSDK();
                }
                // Initialize Magic instance with network configuration
                this.magic = new window.Magic(this.config.apiKey, {
                    network: {
                        rpcUrl: this.config.rpcUrl,
                        chainId: parseInt(this.config.chainId),
                    },
                });
                this.initialized = true;
            });
        }
        /**
         * Load Magic SDK from CDN
         */
        loadMagicSDK() {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (window.Magic) {
                    resolve();
                    return;
                }
                const script = document.createElement("script");
                script.src = "https://auth.magic.link/sdk";
                script.async = true;
                script.onload = () => {
                    // Wait a bit for Magic to be available
                    setTimeout(() => resolve(), 100);
                };
                script.onerror = () => reject(new Error("Failed to load Magic SDK"));
                document.head.appendChild(script);
            });
        }
        /**
         * Check if user is logged in
         */
        isLoggedIn() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.initialized) {
                    yield this.init();
                }
                try {
                    return yield this.magic.user.isLoggedIn();
                }
                catch (error) {
                    console.error("Error checking Magic login status:", error);
                    return false;
                }
            });
        }
        /**
         * Get user metadata (including wallet address)
         */
        getUserMetadata() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (!this.initialized) {
                    yield this.init();
                }
                try {
                    // Magic SDK uses getInfo() method, not getMetadata()
                    const metadata = yield this.magic.user.getInfo();
                    // Extract wallet address from the wallets object
                    const publicAddress = (_b = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.wallets) === null || _a === void 0 ? void 0 : _a.ethereum) === null || _b === void 0 ? void 0 : _b.publicAddress;
                    if (!publicAddress) {
                        console.error("Failed to extract wallet address from metadata:", metadata);
                        throw new Error("Magic returned invalid user metadata - no Ethereum wallet address found");
                    }
                    return {
                        publicAddress,
                        email: metadata.email || null,
                    };
                }
                catch (error) {
                    console.error("Error getting Magic user metadata:", error);
                    throw error;
                }
            });
        }
        /**
         * Login with email OTP
         */
        loginWithEmailOTP(email) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.initialized) {
                    yield this.init();
                }
                try {
                    // Magic SDK v11+ uses loginWithEmailOTP directly on auth
                    const didToken = yield this.magic.auth.loginWithEmailOTP({
                        email,
                        showUI: true, // Show Magic's UI for OTP entry
                    });
                    return didToken;
                }
                catch (error) {
                    console.error("Error logging in with Magic:", error);
                    throw error;
                }
            });
        }
        /**
         * Logout
         */
        logout() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.initialized) {
                    return;
                }
                try {
                    yield this.magic.user.logout();
                }
                catch (error) {
                    console.error("Error logging out from Magic:", error);
                    throw error;
                }
            });
        }
        /**
         * Get wallet address (shortcut method)
         */
        getWalletAddress() {
            return __awaiter(this, void 0, void 0, function* () {
                const metadata = yield this.getUserMetadata();
                return metadata.publicAddress;
            });
        }
        /**
         * Get Web3 provider for signing transactions
         */
        getProvider() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.initialized) {
                    yield this.init();
                }
                return this.magic.rpcProvider;
            });
        }
        /**
         * Get the Magic instance (for advanced usage)
         */
        getMagicInstance() {
            return this.magic;
        }
    }

    /**
     * Offer Types
     * All types related to offers and products
     */
    /**
     * Redemption method types
     */
    var RedemptionMethodType;
    (function (RedemptionMethodType) {
        RedemptionMethodType["FIXED_AMOUNT_OFF"] = "FIXED_AMOUNT_OFF";
        RedemptionMethodType["FIXED_PERCENTAGE_OFF"] = "FIXED_PERCENTAGE_OFF";
        RedemptionMethodType["VARIABLE_AMOUNT_OFF"] = "VARIABLE_AMOUNT_OFF";
        RedemptionMethodType["VARIABLE_PERCENTAGE_OFF"] = "VARIABLE_PERCENTAGE_OFF";
        RedemptionMethodType["FREE_SHIPPING"] = "FREE_SHIPPING";
    })(RedemptionMethodType || (RedemptionMethodType = {}));

    /**
     * Redemption Types
     * All types related to reward redemption and swaps
     */
    /**
     * Order verifier type
     */
    var OrderVerifier;
    (function (OrderVerifier) {
        OrderVerifier["GELATO"] = "gelato";
        OrderVerifier["RUNTIME"] = "runtime";
    })(OrderVerifier || (OrderVerifier = {}));
    /**
     * Runtime task status
     */
    var TaskStatus;
    (function (TaskStatus) {
        TaskStatus["SUCCEEDED"] = "SUCCEDDED";
        TaskStatus["PROCESSING"] = "PROCESSING";
        TaskStatus["FAILED"] = "FAILED";
        TaskStatus["ABANDONED"] = "ABANDONED";
        TaskStatus["INCOMPLETE"] = "INCOMPLETE";
        TaskStatus["PENDING"] = "PENDING";
        TaskStatus["FULFILLED"] = "FULLFILLED";
        TaskStatus["CANCELLED"] = "CANCELLED";
    })(TaskStatus || (TaskStatus = {}));

    /**
     * Environment types
     */
    exports.Environment = void 0;
    (function (Environment) {
        Environment["DEV"] = "dev";
        Environment["STAGING"] = "staging";
        Environment["PROD"] = "prod";
    })(exports.Environment || (exports.Environment = {}));
    /**
     * Supported Networks
     */
    exports.SupportedNetwork = void 0;
    (function (SupportedNetwork) {
        SupportedNetwork["SEPOLIA"] = "sepolia";
        SupportedNetwork["HEDERA"] = "hedera";
        SupportedNetwork["BASE"] = "base";
        SupportedNetwork["POLYGON"] = "polygon";
    })(exports.SupportedNetwork || (exports.SupportedNetwork = {}));
    // Development environment
    const DEV_CONFIG = {
        API_URL: 'https://paas.meappbounty.com/v1/api/',
        AGENT_BASE_URL: 'https://fastapi-proxy-580283507238.us-central1.run.app',
        ME_API_KEY: 'hl3elmtvji75or71j4xy5e',
        API_V1_URL: 'https://api.meappbounty.com/',
        MAGIC_PUBLISHABLE_API_KEY: 'pk_live_FB79F672A43B8AC2',
        RUNTIME_URL: 'https://runtime.meappbounty.com',
        GELATO_API_KEY: 'g1UFyiAfIyq_m_M3Cn3LWIO6VQpjVTIbeCV7XLzWGb4_',
    };
    // Staging environment
    const STAGING_CONFIG = {
        API_URL: 'https://paas-staging.meappbounty.com/v1/api/',
        AGENT_BASE_URL: 'https://fastapi-proxy-staging-580283507238.us-central1.run.app',
        ME_API_KEY: 'staging_key',
        API_V1_URL: 'https://api-staging.meappbounty.com/',
        MAGIC_PUBLISHABLE_API_KEY: 'pk_live_STAGING_KEY',
        RUNTIME_URL: 'https://runtime-staging.meappbounty.com',
        GELATO_API_KEY: 'staging_gelato_key',
    };
    // Production environment
    const PROD_CONFIG = {
        API_URL: 'https://paas.meappbounty.com/v1/api/',
        AGENT_BASE_URL: 'https://fastapi-proxy.meappbounty.com',
        ME_API_KEY: 'prod_key',
        API_V1_URL: 'https://api.meappbounty.com/',
        MAGIC_PUBLISHABLE_API_KEY: 'pk_live_PROD_KEY',
        RUNTIME_URL: 'https://runtime.meappbounty.com',
        GELATO_API_KEY: 'prod_gelato_key',
    };
    const ENV_CONFIGS = {
        [exports.Environment.DEV]: DEV_CONFIG,
        [exports.Environment.STAGING]: STAGING_CONFIG,
        [exports.Environment.PROD]: PROD_CONFIG,
    };
    const NETWORK_CONFIGS = {
        [exports.SupportedNetwork.SEPOLIA]: {
            CHAIN_ID: '11155111',
            RPC_URL: 'https://eth-sepolia.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip',
            OPEN_REWARD_DIAMOND: '0xacd3379d449ad0042a12f4fa88bc183948f7f472',
        },
        [exports.SupportedNetwork.HEDERA]: {
            CHAIN_ID: '296',
            RPC_URL: 'https://testnet.hashio.io/api',
            OPEN_REWARD_DIAMOND: '0x3b03a7980bfe38c9daa4c346ccf495eb24e16782',
        },
        [exports.SupportedNetwork.BASE]: {
            CHAIN_ID: '11155111', // Using Sepolia for now
            RPC_URL: 'https://eth-sepolia.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip',
            OPEN_REWARD_DIAMOND: '0xacd3379d449ad0042a12f4fa88bc183948f7f472',
        },
        [exports.SupportedNetwork.POLYGON]: {
            CHAIN_ID: '11155111', // Using Sepolia for now
            RPC_URL: 'https://eth-sepolia.g.alchemy.com/v2/Ytq0aV34dWOA9X6gWhl_6trwmUTb58Ip',
            OPEN_REWARD_DIAMOND: '0xacd3379d449ad0042a12f4fa88bc183948f7f472',
        },
    };
    /**
     * Get environment configuration based on environment and network
     */
    const getEnv = (environment = exports.Environment.DEV, network = exports.SupportedNetwork.SEPOLIA) => {
        const envConfig = ENV_CONFIGS[environment] || ENV_CONFIGS[exports.Environment.DEV];
        const networkConfig = NETWORK_CONFIGS[network] || NETWORK_CONFIGS[exports.SupportedNetwork.SEPOLIA];
        return Object.assign(Object.assign({}, envConfig), networkConfig);
    };
    // Default environment (Dev + Sepolia)
    getEnv(exports.Environment.DEV, exports.SupportedNetwork.SEPOLIA);

    /**
     * Redemption Service
     * Handles the complete offer redemption flow
     */
    class RedemptionService {
        constructor(authAPI, rewardAPI, redemptionAPI, magicConfig, openRewardDiamond, chainId, rpcUrl, runtimeUrl, meApiKey, apiV1Url, gelatoApiKey, brandId) {
            this.magicClient = null;
            this.walletAddress = null;
            this.balances = [];
            this.meProtocolLoggedIn = false;
            this.currentEmail = null;
            this.meProtocolToken = null;
            this.currentOrder = null;
            this.authAPI = authAPI;
            this.rewardAPI = rewardAPI;
            this.redemptionAPI = redemptionAPI;
            this.magicClient = new MagicClient(magicConfig);
            this.openRewardDiamond = openRewardDiamond;
            this.chainId = chainId;
            this.rpcUrl = rpcUrl;
            this.runtimeUrl = runtimeUrl;
            this.meApiKey = meApiKey;
            this.apiV1Url = apiV1Url;
            this.gelatoApiKey = gelatoApiKey;
            this.brandId = brandId;
        }
        /**
         * Get email from stored or config
         */
        getEmail() {
            return this.currentEmail || this.authAPI.getUserEmail() || null;
        }
        /**
         * Set email (for OTP flow)
         */
        setEmail(email) {
            this.currentEmail = email;
        }
        /**
         * Check if Magic is configured
         */
        isMagicConfigured() {
            return this.magicClient !== null;
        }
        /**
         * Check if user is authenticated
         */
        isAuthenticated() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.magicClient) {
                    return false;
                }
                try {
                    return yield this.magicClient.isLoggedIn();
                }
                catch (error) {
                    console.error("Error checking authentication:", error);
                    return false;
                }
            });
        }
        /**
         * Get wallet address (with force refresh option)
         */
        /**
         * Ensure user is logged in to Magic (triggers OTP if not)
         * Also verifies that the logged-in email matches the SDK email
         */
        ensureMagicLogin(email) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!this.magicClient) {
                    throw new Error("Magic is not configured");
                }
                try {
                    // Check if already logged in
                    const isLoggedIn = yield this.magicClient.isLoggedIn();
                    if (isLoggedIn) {
                        // Verify the logged-in email matches the SDK email
                        try {
                            const metadata = yield this.magicClient.getUserMetadata();
                            const loggedInEmail = (_a = metadata.email) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim();
                            const sdkEmail = email.toLowerCase().trim();
                            if (loggedInEmail !== sdkEmail) {
                                console.log(`🔧 Email mismatch: Logged in as "${loggedInEmail}", but SDK expects "${sdkEmail}". Logging out...`);
                                // Logout and re-login with the correct email
                                yield this.magicClient.logout();
                                yield this.magicClient.loginWithEmailOTP(email);
                            }
                            else {
                                console.log(`✅ Already logged in with correct email: ${loggedInEmail}`);
                            }
                        }
                        catch (error) {
                            console.error("Error verifying logged-in email:", error);
                            // If we can't verify, logout and re-login to be safe
                            yield this.magicClient.logout();
                            yield this.magicClient.loginWithEmailOTP(email);
                        }
                    }
                    else {
                        // Not logged in, trigger Magic OTP login
                        console.log(`🔐 Not logged in. Triggering Magic OTP for: ${email}`);
                        yield this.magicClient.loginWithEmailOTP(email);
                    }
                }
                catch (error) {
                    console.error("Error logging in to Magic:", error);
                    throw new Error("Failed to login with Magic Link. Please try again.");
                }
            });
        }
        getWalletAddress() {
            return __awaiter(this, arguments, void 0, function* (forceRefresh = false) {
                // Use cached value unless force refresh is requested
                if (this.walletAddress && !forceRefresh) {
                    return this.walletAddress;
                }
                if (!this.magicClient) {
                    throw new Error("Magic is not configured");
                }
                try {
                    // First verify user is logged in
                    const isLoggedIn = yield this.magicClient.isLoggedIn();
                    if (!isLoggedIn) {
                        throw new Error("User is not logged in to Magic");
                    }
                    // Retry logic for fetching wallet address (Magic might need a moment)
                    let retries = 3;
                    let lastError = null;
                    while (retries > 0) {
                        try {
                            // Fetch wallet address from Magic
                            this.walletAddress = yield this.magicClient.getWalletAddress();
                            if (this.walletAddress) {
                                return this.walletAddress;
                            }
                            // If null, wait and retry
                            console.warn("Wallet address is null, retrying...");
                            yield new Promise((resolve) => setTimeout(resolve, 1000));
                            retries--;
                        }
                        catch (err) {
                            lastError = err;
                            console.warn(`Error on attempt ${4 - retries}:`, err);
                            yield new Promise((resolve) => setTimeout(resolve, 1000));
                            retries--;
                        }
                    }
                    // All retries failed
                    throw new Error(`Failed to retrieve wallet address from Magic after 3 attempts. Last error: ${(lastError === null || lastError === void 0 ? void 0 : lastError.message) || "Unknown"}`);
                }
                catch (error) {
                    console.error("Error getting wallet address:", error);
                    throw error;
                }
            });
        }
        /**
         * Clear cached wallet address (useful after logout or re-authentication)
         */
        clearWalletAddressCache() {
            this.walletAddress = null;
        }
        /**
         * Send OTP to email
         */
        sendOTP(email) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.magicClient) {
                    throw new Error("Magic is not configured");
                }
                try {
                    this.currentEmail = email; // Store email for later use
                    yield this.magicClient.loginWithEmailOTP(email);
                }
                catch (error) {
                    console.error("Error sending OTP:", error);
                    throw error;
                }
            });
        }
        /**
         * Login to ME Protocol (creates account if new user)
         */
        loginToMEProtocol() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const email = this.getEmail();
                    if (!email) {
                        throw new Error("Email not available");
                    }
                    // Force refresh wallet address to ensure we have the latest from Magic
                    const walletAddress = yield this.getWalletAddress(true);
                    // Login to ME Protocol (this creates account if new user)
                    const loginResponse = yield this.authAPI.meProtocolLogin(email, walletAddress);
                    if (loginResponse.data.user && loginResponse.data.token) {
                        this.meProtocolLoggedIn = true;
                        this.meProtocolToken = loginResponse.data.token; // Store the token
                    }
                    else {
                        throw new Error("Login failed");
                    }
                }
                catch (error) {
                    console.error("Error logging in to ME Protocol:", error);
                    throw error;
                }
            });
        }
        /**
         * Check if user is logged in to ME Protocol
         */
        isMEProtocolLoggedIn() {
            return this.meProtocolLoggedIn;
        }
        /**
         * Fetch user's reward balances
         */
        fetchBalances() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const walletAddress = yield this.getWalletAddress();
                    if (!this.meProtocolToken) {
                        throw new Error("ME Protocol token not available. Please login first.");
                    }
                    const balances = yield this.rewardAPI.fetchRewardBalances(walletAddress, this.meProtocolToken);
                    this.balances = balances;
                    return balances;
                }
                catch (error) {
                    console.error("Error fetching balances:", error);
                    throw error;
                }
            });
        }
        /**
         * Calculate swap amount for redemption
         */
        calculateSwapAmount(selectedRewardAddress, offerDetail, selectedVariantId) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    const walletAddress = yield this.getWalletAddress();
                    if (!this.meProtocolToken) {
                        throw new Error("ME Protocol token not available. Please login first.");
                    }
                    // Use provided variant ID, or first variant if available
                    let variantId = selectedVariantId;
                    if (!variantId &&
                        offerDetail.offerVariants &&
                        offerDetail.offerVariants.length > 0) {
                        // Use the underlying product variant id, not the offerVariant id
                        variantId =
                            ((_a = offerDetail.offerVariants[0].variant) === null || _a === void 0 ? void 0 : _a.id) ||
                                offerDetail.offerVariants[0].variantId ||
                                undefined;
                    }
                    const payload = {
                        walletAddress,
                        inputRewardAddress: selectedRewardAddress, // The reward the user wants to use
                        outPutRewardAddress: offerDetail.reward.contractAddress, // The reward from the offer
                        redemptionMethodId: offerDetail.redemptionMethod.id,
                        offerId: offerDetail.id,
                        variantId,
                        brandId: offerDetail.brand.id,
                    };
                    const result = yield this.rewardAPI.fetchSwapAmount(payload, this.meProtocolToken);
                    return result;
                }
                catch (error) {
                    console.error("Error calculating swap amount:", error);
                    throw error;
                }
            });
        }
        /**
         * Update Magic network configuration
         */
        updateNetwork(brandNetwork) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.magicClient) {
                    return;
                }
            });
        }
        /**
         * Check if user can afford the offer with selected reward
         */
        canAffordOffer(selectedReward, amountNeeded) {
            return selectedReward.balance >= amountNeeded;
        }
        /**
         * Get cached balances
         */
        getCachedBalances() {
            return this.balances;
        }
        /**
         * Clear wallet address cache
         */
        clearCache() {
            this.walletAddress = null;
            this.balances = [];
        }
        /**
         * Execute same brand redemption transaction
         * Used when the selected reward is from the same brand as the offer
         */
        executeSameBrandRedemption(rewardAddress, rewardId, amount, offerId, redemptionMethodId, variantId) {
            return __awaiter(this, void 0, void 0, function* () {
                let pushTransactionRef = null;
                try {
                    if (!this.magicClient) {
                        throw new Error("Magic is not configured");
                    }
                    if (!this.meProtocolToken) {
                        throw new Error("ME Protocol token not available. Please login first.");
                    }
                    // Validate amount
                    if (!amount || amount === "undefined" || isNaN(Number(amount))) {
                        throw new Error("Invalid amount value for transaction");
                    }
                    console.log("Same-brand transaction params:", { amount });
                    // Get Magic provider and signer
                    const provider = yield this.magicClient.getProvider();
                    const web3Provider = new ethers.ethers.providers.Web3Provider(provider);
                    const accounts = yield web3Provider.listAccounts();
                    const signer = web3Provider.getSigner(accounts[0]);
                    console.log("SIGNER", yield signer.getAddress());
                    // Prepare transaction
                    const rewardAmount = ethers.ethers.utils.parseEther(amount);
                    // Call runtime SDK
                    const result = yield runtimeSdk.same_brand_reward_redeption_magic(rewardAddress, rewardAmount, ethers.ethers.BigNumber.from(this.chainId), signer, this.runtimeUrl);
                    const hash = result.hash;
                    console.log("FROM", result.from);
                    // Push transaction to runtime
                    pushTransactionRef = yield this.redemptionAPI.pushTransaction({
                        params: {
                            from: result.from,
                            data: result.data,
                            nonce: result.nonce.toString(),
                            r: result.r,
                            s: result.s,
                            v: result.v.toString(),
                            hash: result.hash,
                        },
                    }, this.meProtocolToken);
                    if (!pushTransactionRef) {
                        throw new Error("No data returned from push transaction");
                    }
                    // Process order
                    const order = yield this.processOrder(pushTransactionRef.result, hash, rewardId, amount, offerId, redemptionMethodId, OrderVerifier.RUNTIME, variantId);
                    return order;
                }
                catch (error) {
                    // Refund if transaction was pushed but order processing failed
                    if ((pushTransactionRef === null || pushTransactionRef === void 0 ? void 0 : pushTransactionRef.result) && this.meProtocolToken) {
                        try {
                            yield this.redemptionAPI.refundTask({ spend_data: pushTransactionRef.result }, this.meProtocolToken);
                        }
                        catch (refundError) {
                            console.error("Error refunding task:", refundError);
                        }
                    }
                    throw error;
                }
            });
        }
        /**
         * Execute cross brand redemption transaction
         * Used when the selected reward is from a different brand than the offer
         */
        executeCrossBrandRedemption(rewardAddress, rewardId, amount, neededAmount, brandRewardAddress, offerId, redemptionMethodId, variantId) {
            return __awaiter(this, void 0, void 0, function* () {
                let pushTransactionRef = null;
                try {
                    if (!this.magicClient) {
                        throw new Error("Magic is not configured");
                    }
                    if (!this.meProtocolToken) {
                        throw new Error("ME Protocol token not available. Please login first.");
                    }
                    if (!this.walletAddress) {
                        throw new Error("Wallet address not available");
                    }
                    // Validate amounts
                    if (!neededAmount ||
                        neededAmount === "undefined" ||
                        isNaN(Number(neededAmount))) {
                        throw new Error("Invalid needed amount value for transaction");
                    }
                    if (!amount || amount === "undefined" || isNaN(Number(amount))) {
                        throw new Error("Invalid amount value for transaction");
                    }
                    console.log("Cross-brand transaction params:", { neededAmount, amount });
                    // Get Magic provider and signer
                    const provider = yield this.magicClient.getProvider();
                    const web3Provider = new ethers.ethers.providers.Web3Provider(provider);
                    const accounts = yield web3Provider.listAccounts();
                    const signer = web3Provider.getSigner(accounts[0]);
                    // Prepare spend info
                    const amountOfRewardAtHand = ethers.ethers.utils.parseEther(neededAmount);
                    const expectedAmountOfTargetedReward = ethers.ethers.utils.parseEther(amount);
                    const spendInfo = {
                        rewardAtHand: rewardAddress,
                        targettedReward: brandRewardAddress,
                        amountOfRewardAtHand,
                        expectedAmountOfTargetedReward,
                    };
                    console.log("SPEND REWARD MAGIC", rewardAddress, amountOfRewardAtHand, this.openRewardDiamond, signer, this.runtimeUrl, spendInfo);
                    // Call runtime SDK
                    const result = yield runtimeSdk.spend_reward_magic(rewardAddress, amountOfRewardAtHand, this.openRewardDiamond, ethers.ethers.BigNumber.from(this.chainId), signer, this.runtimeUrl);
                    // Push transaction to runtime
                    pushTransactionRef = yield this.redemptionAPI.pushTransaction({
                        params: {
                            from: result.from,
                            data: result.data,
                            nonce: result.nonce.toString(),
                            r: result.r,
                            s: result.s,
                            v: result.v.toString(),
                            hash: result.hash,
                        },
                    }, this.meProtocolToken);
                    if (!pushTransactionRef) {
                        throw new Error("No data returned from push transaction");
                    }
                    // Get vault permit
                    const vaultParams = {
                        owner: pushTransactionRef.owner,
                        count: ethers.ethers.BigNumber.from(pushTransactionRef.count),
                        globalHash: pushTransactionRef.globalHash,
                        prefixedHash: pushTransactionRef.prefixedHash,
                        r: pushTransactionRef.sig.r,
                        s: pushTransactionRef.sig.s,
                        v: pushTransactionRef.sig.v,
                        reward: pushTransactionRef.reward,
                        spender: pushTransactionRef.spender,
                        value: ethers.ethers.BigNumber.from(pushTransactionRef.value),
                    };
                    console.log("DATUM", spendInfo, vaultParams, this.openRewardDiamond, this.rpcUrl);
                    const datum = yield protocolCore.usersServiceWithPermit.spendRewardsOnAnotherBrandWithVaultPermit(spendInfo, vaultParams, this.openRewardDiamond, this.rpcUrl);
                    if (!(datum === null || datum === void 0 ? void 0 : datum.data)) {
                        throw new Error("No data returned from vault permit");
                    }
                    console.log("RELAY", {
                        from: this.walletAddress,
                        data: datum.data,
                        to: this.openRewardDiamond,
                    }, signer, this.meApiKey, this.apiV1Url, this.gelatoApiKey, this.rpcUrl, this.chainId, this.openRewardDiamond, this.brandId);
                    // Relay via Gelato
                    const { taskId } = yield protocolCore.relay({
                        from: this.walletAddress,
                        data: datum.data,
                        to: this.openRewardDiamond,
                    }, signer, this.meApiKey, this.apiV1Url, this.gelatoApiKey, this.rpcUrl, this.chainId, this.openRewardDiamond, this.brandId, false, "");
                    // Process order
                    const order = yield this.processOrder(pushTransactionRef.result, taskId, rewardId, amount, offerId, redemptionMethodId, OrderVerifier.GELATO, variantId);
                    return order;
                }
                catch (error) {
                    // Refund if transaction was pushed but order processing failed
                    if ((pushTransactionRef === null || pushTransactionRef === void 0 ? void 0 : pushTransactionRef.result) && this.meProtocolToken) {
                        try {
                            yield this.redemptionAPI.refundTask({ spend_data: pushTransactionRef.result }, this.meProtocolToken);
                        }
                        catch (refundError) {
                            console.error("Error refunding task:", refundError);
                        }
                    }
                    throw error;
                }
            });
        }
        /**
         * Process order after successful transaction
         */
        processOrder(spendData, taskId, rewardId, amount, offerId, redemptionMethodId, verifier, variantId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.meProtocolToken) {
                    throw new Error("ME Protocol token not available");
                }
                const payload = {
                    task_id: taskId,
                    reward_id: rewardId,
                    target_reward_id: rewardId, // Same for now, adjust if needed
                    verifier,
                    spend_data: spendData,
                    offer_id: offerId,
                    amount,
                    redemption_method_id: redemptionMethodId,
                    offer_variants: variantId ? [variantId] : [],
                };
                const response = yield this.redemptionAPI.processOrder(payload, this.meProtocolToken);
                this.currentOrder = response.order;
                return response.order;
            });
        }
        /**
         * Get checkout URL for the redeemed offer
         */
        getCheckoutUrl(brandId, productVariantIdOnBrandSite) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.currentOrder) {
                    throw new Error("No order available. Please redeem an offer first.");
                }
                if (!this.meProtocolToken) {
                    throw new Error("ME Protocol token not available");
                }
                const payload = {
                    brandId,
                    discountCode: this.currentOrder.coupon.code,
                    productVariantIdOnBrandSite,
                };
                return yield this.redemptionAPI.getCheckoutUrl(payload, this.meProtocolToken);
            });
        }
        /**
         * Get current order
         */
        getCurrentOrder() {
            return this.currentOrder;
        }
        /**
         * Clear current order
         */
        clearCurrentOrder() {
            this.currentOrder = null;
        }
        /**
         * Logout - REMOVED: Users should stay logged in
         * Kept for backward compatibility but does nothing
         */
        logout() {
            return __awaiter(this, void 0, void 0, function* () {
                // Do nothing - users stay logged in with Magic
            });
        }
    }

    /**
     * Base API Client
     * Foundation for all domain-specific API clients
     */
    class BaseAPI {
        constructor(config, env) {
            this.config = config;
            this.env = env;
            this.userId = config.userId || generateUUID();
        }
        /**
         * Get user ID
         */
        getUserId() {
            return this.userId;
        }
        /**
         * Get user email from config
         */
        getUserEmail() {
            return this.config.emailAddress;
        }
        /**
         * Make a GET request
         */
        get(url_1) {
            return __awaiter(this, arguments, void 0, function* (url, headers = {}) {
                const response = yield fetch(url, {
                    method: "GET",
                    headers: Object.assign({ "Content-Type": "application/json" }, headers),
                });
                if (!response.ok) {
                    throw new Error(`GET ${url} failed: ${response.statusText}`);
                }
                return yield response.json();
            });
        }
        /**
         * Make a POST request
         */
        post(url_1, body_1) {
            return __awaiter(this, arguments, void 0, function* (url, body, headers = {}) {
                const response = yield fetch(url, {
                    method: "POST",
                    headers: Object.assign({ "Content-Type": "application/json" }, headers),
                    body: JSON.stringify(body),
                });
                if (!response.ok) {
                    throw new Error(`POST ${url} failed: ${response.statusText}`);
                }
                return yield response.json();
            });
        }
    }

    /**
     * Session API
     * Handles session creation and management
     */
    class SessionAPI extends BaseAPI {
        /**
         * Create a new chat session
         */
        createSession() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.post(`${this.env.AGENT_BASE_URL}/apps/consumer/users/${this.userId}/sessions`, {});
                    return data.id;
                }
                catch (error) {
                    console.error("Error creating session:", error);
                    throw error;
                }
            });
        }
    }

    /**
     * Chat API
     * Handles chat messages and SSE streaming
     */
    class ChatAPI extends BaseAPI {
        /**
         * Send a message and handle streaming response via SSE
         */
        sendMessage(sessionId, message, onChunk, onComplete, onError) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const payload = {
                        appName: "consumer",
                        userId: this.userId,
                        sessionId: sessionId,
                        newMessage: {
                            parts: [{ text: message }],
                            role: "user",
                        },
                        streaming: true,
                    };
                    const headers = {};
                    // Add email header if provided
                    if (this.config.emailAddress) {
                        headers["x-user-email"] = this.config.emailAddress;
                    }
                    const response = yield fetch(`${this.env.AGENT_BASE_URL}/run_sse`, {
                        method: "POST",
                        headers: Object.assign({ "Content-Type": "application/json" }, headers),
                        body: JSON.stringify(payload),
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to send message: ${response.statusText}`);
                    }
                    // Handle SSE streaming response
                    yield this.handleSSEStream(response, onChunk, onComplete);
                }
                catch (error) {
                    console.error("Error sending message:", error);
                    onError(error);
                }
            });
        }
        /**
         * Handle Server-Sent Events (SSE) stream
         */
        handleSSEStream(response, onChunk, onComplete) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const reader = (_a = response.body) === null || _a === void 0 ? void 0 : _a.getReader();
                const decoder = new TextDecoder();
                if (!reader) {
                    throw new Error("Response body is not readable");
                }
                let buffer = "";
                while (true) {
                    const { done, value } = yield reader.read();
                    if (done) {
                        onComplete();
                        break;
                    }
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";
                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6).trim();
                            if (data && data !== "[DONE]") {
                                this.processSSEData(data, onChunk);
                            }
                        }
                    }
                }
            });
        }
        /**
         * Process individual SSE data chunks
         */
        processSSEData(data, onChunk) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            try {
                const parsed = JSON.parse(data);
                // Extract text from content.parts[0].text
                if ((_c = (_b = (_a = parsed.content) === null || _a === void 0 ? void 0 : _a.parts) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.text) {
                    const text = parsed.content.parts[0].text;
                    onChunk(text, parsed);
                }
                else if ((_f = (_e = (_d = parsed.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.functionCall) {
                    // Function call - pass along but no text chunk
                    onChunk("", parsed);
                }
                else if ((_j = (_h = (_g = parsed.content) === null || _g === void 0 ? void 0 : _g.parts) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.functionResponse) {
                    // Function response - pass along but no text chunk
                    onChunk("", parsed);
                }
                else if (parsed.chunk) {
                    onChunk(parsed.chunk, parsed);
                }
                else if (parsed.text) {
                    onChunk(parsed.text, parsed);
                }
            }
            catch (e) {
                // If not JSON, treat as plain text chunk
                onChunk(data);
            }
        }
    }

    /**
     * Offer API
     * Handles offer-related endpoints
     */
    class OfferAPI extends BaseAPI {
        /**
         * Fetch detailed information about a specific offer
         */
        fetchOfferDetails(offerCode, sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.get(`${this.env.API_V1_URL}store/offer/${offerCode}?sessionId=${sessionId}`);
                    return result.data;
                }
                catch (error) {
                    console.error("Error fetching offer details:", error);
                    throw error;
                }
            });
        }
        /**
         * Fetch offers by brand ID
         */
        fetchOffersByBrandId(brandId, token) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    const headers = {};
                    if (token) {
                        headers["authorization"] = `Bearer ${token}`;
                    }
                    const result = yield this.get(`${this.env.API_V1_URL}store/offer?page=1&limit=50&brandId=${brandId}`, headers);
                    return ((_a = result.data) === null || _a === void 0 ? void 0 : _a.offers) || [];
                }
                catch (error) {
                    console.error("Error fetching offers by brand:", error);
                    throw error;
                }
            });
        }
    }

    /**
     * Brand API
     * Handles brand-related endpoints
     */
    class BrandAPI extends BaseAPI {
        /**
         * Fetch brands by category ID with purchase earning methods
         */
        fetchBrandsByCategoryId(categoryId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.get(`${this.env.API_URL}brands/earning-methods/purchase/categories/${categoryId}/brands`);
                    return result.data || [];
                }
                catch (error) {
                    console.error("Error fetching brands by category:", error);
                    throw error;
                }
            });
        }
    }

    /**
     * Reward API
     * Handles reward and redemption endpoints
     */
    class RewardAPI extends BaseAPI {
        /**
         * Fetch user reward balances
         */
        fetchRewardBalances(walletAddress, token) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.get(`${this.env.API_URL}reward/sdk/balances?walletAddress=${walletAddress}`, {
                        "x-access-token": token,
                        Authorization: `Bearer ${token}`,
                        "x-public-key": this.env.ME_API_KEY,
                    });
                    return result.data || [];
                }
                catch (error) {
                    console.error("Error fetching reward balances:", error);
                    throw error;
                }
            });
        }
        /**
         * Fetch swap amount needed for redemption
         */
        fetchSwapAmount(payload, token) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.post(`${this.env.API_URL}reward/sdk/swap-amount`, payload, {
                        "x-access-token": token,
                        Authorization: `Bearer ${token}`,
                        "x-public-key": this.env.ME_API_KEY,
                    });
                    return result.data;
                }
                catch (error) {
                    console.error("Error fetching swap amount:", error);
                    throw error;
                }
            });
        }
    }

    /**
     * Auth API
     * Handles authentication endpoints
     */
    class AuthAPI extends BaseAPI {
        /**
         * Login to ME Protocol (creates account if new user)
         */
        meProtocolLogin(email, walletAddress) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield this.post(`${this.env.API_URL}auth/sdk/login`, {
                        walletAddress,
                        email,
                    });
                    return data;
                }
                catch (error) {
                    console.error("Error in ME Protocol login:", error);
                    throw error;
                }
            });
        }
    }

    /**
     * Redemption API
     * Handles transaction, order processing, and checkout endpoints
     */
    class RedemptionAPI extends BaseAPI {
        /**
         * Push signed transaction to runtime
         */
        pushTransaction(payload, token) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.post(`${this.env.API_URL}runtime/push-transaction`, payload, { "x-access-token": token });
                    return result.data;
                }
                catch (error) {
                    console.error("Error pushing transaction:", error);
                    throw error;
                }
            });
        }
        /**
         * Process order after successful transaction
         */
        processOrder(payload, token) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.post(`${this.env.API_URL}orders/sdk/process-order`, payload, { "x-access-token": token });
                    return result.data;
                }
                catch (error) {
                    console.error("Error processing order:", error);
                    throw error;
                }
            });
        }
        /**
         * Generate Shopify checkout URL with discount code
         */
        getCheckoutUrl(payload, token) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.post(`${this.env.API_V1_URL}order/shopify/checkout-url`, payload, { Authorization: `Bearer ${token}` });
                    return result.data.url;
                }
                catch (error) {
                    console.error("Error getting checkout URL:", error);
                    throw error;
                }
            });
        }
        /**
         * Refund task if transaction fails
         */
        refundTask(payload, token) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.post(`${this.env.API_URL}runtime/refund-task`, payload, { "x-access-token": token });
                }
                catch (error) {
                    console.error("Error refunding task:", error);
                    throw error;
                }
            });
        }
    }

    /**
     * Unified API Client
     * Combines all domain-specific API clients into a single facade
     */
    /**
     * Main API Client - Facade for all domain APIs
     */
    class APIClient {
        constructor(config, env) {
            // Initialize all domain APIs
            this._sessionAPI = new SessionAPI(config, env);
            this._chatAPI = new ChatAPI(config, env);
            this._offerAPI = new OfferAPI(config, env);
            this._brandAPI = new BrandAPI(config, env);
            this._rewardAPI = new RewardAPI(config, env);
            this._authAPI = new AuthAPI(config, env);
            this._redemptionAPI = new RedemptionAPI(config, env);
        }
        // ===== API Access (for services) =====
        get brandAPI() {
            return this._brandAPI;
        }
        get offerAPI() {
            return this._offerAPI;
        }
        get redemptionAPI() {
            return this._redemptionAPI;
        }
        // ===== User Info =====
        getUserEmail() {
            return this._sessionAPI.getUserEmail();
        }
        getUserId() {
            return this._sessionAPI.getUserId();
        }
        // ===== Session Management =====
        createSession() {
            return __awaiter(this, void 0, void 0, function* () {
                return this._sessionAPI.createSession();
            });
        }
        // ===== Chat & Messaging =====
        sendMessage(sessionId, message, onChunk, onComplete, onError) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._chatAPI.sendMessage(sessionId, message, onChunk, onComplete, onError);
            });
        }
        // ===== Offers =====
        fetchOfferDetails(offerCode, sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._offerAPI.fetchOfferDetails(offerCode, sessionId);
            });
        }
        fetchOffersByBrandId(brandId, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._offerAPI.fetchOffersByBrandId(brandId, token);
            });
        }
        // ===== Brands =====
        fetchBrandsByCategoryId(categoryId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._brandAPI.fetchBrandsByCategoryId(categoryId);
            });
        }
        // ===== Rewards & Redemption =====
        fetchRewardBalances(walletAddress, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._rewardAPI.fetchRewardBalances(walletAddress, token);
            });
        }
        fetchSwapAmount(payload, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._rewardAPI.fetchSwapAmount(payload, token);
            });
        }
        // ===== Authentication =====
        meProtocolLogin(email, walletAddress) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._authAPI.meProtocolLogin(email, walletAddress);
            });
        }
    }

    /**
     * SVG Icons for ME Agent SDK
     * Each icon function accepts optional width, height, and color parameters
     */
    /**
     * Main ME Agent Bot Icon (for the chat button)
     */
    function getBotIcon(options = {}) {
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
    function getCloseIcon(options = {}) {
        const { width = 24, height = 24, color = "currentColor", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
        <path d="M8 8L13 13M8 8L3 3M8 8L3 13M8 8L13 3" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
    }
    /**
     * Share Icon (for share button)
     */
    function getShareIcon(options = {}) {
        const { width = 16, height = 16, color = "black", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M15 8L9.4 2V5C6.6 5 1 6.8 1 14C1 12.9997 2.68 11 9.4 11V14L15 8Z" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
    }
    /**
     * Heart Icon (for like button - outlined)
     */
    function getHeartIcon(options = {}) {
        const { width = 16, height = 16, color = "#0F0F0F", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M4.85 2C2.72375 2 1 3.72173 1 5.84548C1 9.69096 5.55 13.1869 8 14C10.45 13.1869 15 9.69096 15 5.84548C15 3.72173 13.2762 2 11.15 2C9.848 2 8.6965 2.64569 8 3.63398C7.64493 3.12896 7.17328 2.7168 6.62498 2.43238C6.07667 2.14796 5.46784 1.99965 4.85 2Z" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
    }
    /**
     * Heart Icon (for like button - filled)
     */
    function getHeartFilledIcon(options = {}) {
        const { width = 16, height = 16, color = "#0F0F0F", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M4.85 2C2.72375 2 1 3.72173 1 5.84548C1 9.69096 5.55 13.1869 8 14C10.45 13.1869 15 9.69096 15 5.84548C15 3.72173 13.2762 2 11.15 2C9.848 2 8.6965 2.64569 8 3.63398C7.64493 3.12896 7.17328 2.7168 6.62498 2.43238C6.07667 2.14796 5.46784 1.99965 4.85 2Z" stroke="${color}" fill="${color}" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
    }
    /**
     * Send/Arrow Icon (for send message button)
     */
    function getSendIcon(options = {}) {
        const { width = 24, height = 24, color = "currentColor", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
    }
    /**
     * Chevron/Arrow Back Icon (for back navigation)
     */
    function getChevronLeftIcon(options = {}) {
        const { width = 24, height = 24, color = "currentColor", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M15 18L9 12L15 6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
    }
    /**
     * Chevron/Arrow Right Icon (for forward navigation)
     */
    function getChevronRightIcon(options = {}) {
        const { width = 16, height = 16, color = "#0F0F0F", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <path d="M6 12L10 8L6 4" stroke="${color}" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
    }
    /**
     * Maximize/Expand Icon (for expanding the chat window)
     */
    function getMaximizeIcon(options = {}) {
        const { width = 24, height = 24, color = "currentColor", className = "", } = options;
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
    function getMinimizeIcon(options = {}) {
        const { width = 24, height = 24, color = "currentColor", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
        <rect x="2" y="3" width="12" height="10" rx="2" stroke="${color}"/>
        <rect x="8" y="4" width="5" height="8" rx="1" fill="${color}"/>
    </svg>
  `.trim();
    }
    /**
     * Gift/Rewards Icon (for rewards/offers)
     */
    function getGiftIcon(options = {}) {
        const { width = 24, height = 24, color = "currentColor", className = "", } = options;
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
    function getUserAvatarIcon(options = {}) {
        const { width = 32, height = 32, color = "currentColor", className = "", } = options;
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
    function getAssistantAvatarIcon(options = {}) {
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
    function getSearchIcon(options = {}) {
        const { width = 20, height = 20, color = "currentColor", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
      <circle cx="11" cy="11" r="8" stroke="${color}" stroke-width="2"/>
      <path d="M21 21L16.5 16.5" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `.trim();
    }
    /**
     * Sparkles Icon (for AI suggestions)
     */
    function getSparklesIcon(options = {}) {
        const { width = 20, height = 20, color = "currentColor", className = "", } = options;
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
    function getChatIcon(options = {}) {
        const { width = 24, height = 24, color = "currentColor", className = "", } = options;
        return `
    <svg width="${width}" height="${height}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
        <path d="M17 4.16667V13.5C17 13.8094 16.8784 14.1062 16.662 14.325C16.4457 14.5437 16.1522 14.6667 15.8462 14.6667H6.25482L3.90386 16.72L3.89737 16.7251C3.68967 16.9031 3.42612 17.0005 3.15386 17C2.98459 16.9997 2.81744 16.9619 2.6642 16.8892C2.46488 16.7963 2.29624 16.6473 2.17845 16.4601C2.06066 16.2728 1.99872 16.0552 2.00002 15.8333V4.16667C2.00002 3.85725 2.12159 3.5605 2.33797 3.34171C2.55436 3.12292 2.84785 3 3.15386 3H15.8462C16.1522 3 16.4457 3.12292 16.662 3.34171C16.8784 3.5605 17 3.85725 17 4.16667Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `.trim();
    }
    /**
     * Arrow Right Icon (for card list button)
     */
    function getArrowRightIcon(options = {}) {
        const { width = 24, height = 24, color = "currentColor", className = "", } = options;
        return `
  <svg width="${width}" height="${height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
    <path d="M13.3281 8L1.66146 8M13.3281 8L8.32813 3M13.3281 8L8.32813 13" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`.trim();
    }
    /**
     * User Icon (for "Sign up for a brand" action)
     */
    function getUserIcon(options = {}) {
        const { width = 20, height = 20, color = "#999999", className = "", } = options;
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
    function getMoneyIcon(options = {}) {
        const { width = 20, height = 20, color = "#999999", className = "", } = options;
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
    function getExternalLinkIcon(options = {}) {
        const { width = 12, height = 12, color = "#0F0F0F", className = "", } = options;
        return `
  <svg width="${width}" height="${height}" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}">
    <path d="M8.25 1.125H10.875V3.75M10.3125 1.6875L7.5 4.5M6.375 1.875H3C2.70163 1.875 2.41548 1.99353 2.2045 2.2045C1.99353 2.41548 1.875 2.70163 1.875 3V9C1.875 9.29837 1.99353 9.58452 2.2045 9.7955C2.41548 10.0065 2.70163 10.125 3 10.125H9C9.29837 10.125 9.58452 10.0065 9.7955 9.7955C10.0065 9.58452 10.125 9.29837 10.125 9V5.625" stroke="${color}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`.trim();
    }
    /**
     * Tag icon (for Food & Beverages category)
     */
    function getTagIcon(options = {}) {
        const { width = 24, height = 24, color = "currentColor", className = "", } = options;
        return `<svg width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className}"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 17L12 22L22 17" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 12L12 17L22 12" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`.trim();
    }

    /**
     * Floating Button Component
     */
    class FloatingButton {
        constructor(position, onClick) {
            this.position = position;
            this.onClick = onClick;
            this.element = this.create();
        }
        /**
         * Create the button element
         */
        create() {
            const button = document.createElement("button");
            button.className = `me-agent-button ${this.position}`;
            button.setAttribute("aria-label", "Open chat");
            // Add bot icon
            button.innerHTML = getBotIcon({
                width: 32,
                height: 35,
                className: "me-agent-button-icon",
            });
            button.addEventListener("click", this.onClick);
            return button;
        }
        /**
         * Mount the button to the DOM
         */
        mount() {
            document.body.appendChild(this.element);
        }
        /**
         * Remove the button from the DOM
         */
        unmount() {
            this.element.remove();
        }
        /**
         * Get the button element
         */
        getElement() {
            return this.element;
        }
        /**
         * Hide the button
         */
        hide() {
            this.element.classList.add("hidden");
        }
        /**
         * Show the button
         */
        show() {
            this.element.classList.remove("hidden");
        }
    }

    /**
     * Message Component - Renders individual chat messages
     */
    class MessageComponent {
        /**
         * Parse markdown-style content and convert to HTML
         */
        static parseMarkdown(content) {
            if (!content)
                return "";
            // Convert markdown links [text](url) to HTML links
            // Special handling for offer links
            let html = content.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, (match, text, url) => {
                // Check if this is an offer link
                const offerMatch = url.match(/\/offer\/([^\/\s]+)/);
                if (offerMatch) {
                    const offerCode = offerMatch[1];
                    return `<a href="#" class="me-agent-offer-link" data-offer-code="${offerCode}">${text}</a>`;
                }
                // Regular external link
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
            });
            // Convert bold **text** to <strong>
            html = html.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");
            // Convert italic *text* to <em>
            html = html.replace(/\*([^\*]+)\*/g, "<em>$1</em>");
            // Convert line breaks to <br>
            html = html.replace(/\n/g, "<br>");
            return html;
        }
        /**
         * Get avatar for message role
         */
        static getAvatar(role) {
            if (role === "user") {
                return getUserAvatarIcon({
                    width: 32,
                    height: 32,
                    className: "me-agent-message-avatar",
                });
            }
            // Default to assistant avatar for "assistant" and "system" roles
            return getAssistantAvatarIcon({
                width: 32,
                height: 32,
                className: "me-agent-message-avatar",
            });
        }
        /**
         * Create a message element
         */
        static create(message, onOfferClick) {
            const messageDiv = document.createElement("div");
            messageDiv.className = `me-agent-message ${message.role}`;
            messageDiv.setAttribute("data-message-id", message.id);
            // Avatar
            const avatarDiv = document.createElement("div");
            avatarDiv.className = "me-agent-message-avatar-wrapper";
            avatarDiv.innerHTML = this.getAvatar(message.role);
            // Content wrapper
            const contentWrapper = document.createElement("div");
            contentWrapper.className = "me-agent-message-content-wrapper";
            const contentDiv = document.createElement("div");
            contentDiv.className = "me-agent-message-content";
            // Parse markdown and set as HTML
            contentDiv.innerHTML = this.parseMarkdown(message.content);
            // Add click handlers for offer links
            if (onOfferClick) {
                const offerLinks = contentDiv.querySelectorAll(".me-agent-offer-link");
                offerLinks.forEach((link) => {
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        const offerCode = link.getAttribute("data-offer-code");
                        if (offerCode) {
                            onOfferClick(offerCode);
                        }
                    });
                });
            }
            contentWrapper.appendChild(contentDiv);
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentWrapper);
            return messageDiv;
        }
        /**
         * Create a loading indicator
         */
        static createLoading() {
            const loadingDiv = document.createElement("div");
            loadingDiv.className = "me-agent-message assistant";
            loadingDiv.setAttribute("data-loading", "true");
            // Avatar
            const avatarDiv = document.createElement("div");
            avatarDiv.className = "me-agent-message-avatar-wrapper";
            avatarDiv.innerHTML = this.getAvatar("assistant");
            // Content wrapper
            const contentWrapper = document.createElement("div");
            contentWrapper.className = "me-agent-message-content-wrapper";
            const contentDiv = document.createElement("div");
            contentDiv.className = "me-agent-message-content";
            const loadingIndicator = document.createElement("div");
            loadingIndicator.className = "me-agent-loading";
            loadingIndicator.innerHTML = `
      <span class="me-agent-loading-text">Typing</span>
      <span class="me-agent-loading-dots">
        <span class="me-agent-loading-dot"></span>
        <span class="me-agent-loading-dot"></span>
        <span class="me-agent-loading-dot"></span>
      </span>
    `;
            contentDiv.appendChild(loadingIndicator);
            contentWrapper.appendChild(contentDiv);
            loadingDiv.appendChild(avatarDiv);
            loadingDiv.appendChild(contentWrapper);
            return loadingDiv;
        }
        /**
         * Update message content (for streaming)
         */
        static updateContent(element, content, onOfferClick) {
            const contentDiv = element.querySelector(".me-agent-message-content");
            if (contentDiv) {
                // Parse markdown and update HTML
                contentDiv.innerHTML = this.parseMarkdown(content);
                // Re-attach click handlers for offer links
                if (onOfferClick) {
                    const offerLinks = contentDiv.querySelectorAll(".me-agent-offer-link");
                    offerLinks.forEach((link) => {
                        link.addEventListener("click", (e) => {
                            e.preventDefault();
                            const offerCode = link.getAttribute("data-offer-code");
                            if (offerCode) {
                                onOfferClick(offerCode);
                            }
                        });
                    });
                }
            }
        }
        /**
         * Append a card list or other element to a message's content wrapper
         */
        static appendToMessage(messageElement, element) {
            const contentWrapper = messageElement.querySelector(".me-agent-message-content-wrapper");
            if (contentWrapper) {
                contentWrapper.appendChild(element);
            }
        }
    }

    /**
     * Quick Actions Component - Renders a list of actionable items
     */
    class QuickActionsComponent {
        /**
         * Get icon for action type
         */
        static getIconForAction(action) {
            const iconMap = {
                search: () => getSearchIcon({
                    width: 18,
                    height: 18,
                    className: "me-agent-quick-action-icon",
                }),
                offers: () => getGiftIcon({
                    width: 18,
                    height: 18,
                    className: "me-agent-quick-action-icon",
                }),
                tags: () => getTagIcon({
                    width: 18,
                    height: 18,
                    className: "me-agent-quick-action-icon",
                }),
                suggestions: () => getSparklesIcon({
                    width: 18,
                    height: 18,
                    className: "me-agent-quick-action-icon",
                }),
                user: () => getUserIcon({
                    width: 18,
                    height: 18,
                    className: "me-agent-quick-action-icon",
                }),
                money: () => getMoneyIcon({
                    width: 18,
                    height: 18,
                    className: "me-agent-quick-action-icon",
                }),
            };
            // Use icon from action if specified, otherwise use type-based icon
            if (action.icon && iconMap[action.icon]) {
                return iconMap[action.icon]();
            }
            // Default to sparkles icon
            return getSparklesIcon({
                width: 18,
                height: 18,
                className: "me-agent-quick-action-icon",
            });
        }
        /**
         * Create quick actions list
         */
        static create(actions, onClick) {
            const container = document.createElement("div");
            container.className = "me-agent-quick-actions";
            actions.forEach((action) => {
                const button = document.createElement("button");
                button.className = "me-agent-quick-action-button";
                button.setAttribute("data-action-id", action.id);
                const icon = this.getIconForAction(action);
                button.innerHTML = `
        ${icon}
        <span class="me-agent-quick-action-text">${action.label}</span>
      `;
                button.addEventListener("click", () => onClick(action));
                container.appendChild(button);
            });
            return container;
        }
        /**
         * Create a message with quick actions
         */
        static createMessageWithActions(content, actions, messageId, onActionClick) {
            const wrapper = document.createElement("div");
            wrapper.className = "me-agent-message-with-actions";
            wrapper.setAttribute("data-message-id", messageId);
            // Message content
            const contentDiv = document.createElement("div");
            contentDiv.className = "me-agent-message-actions-content";
            contentDiv.textContent = content;
            // Quick actions
            const actionsContainer = this.create(actions, onActionClick);
            wrapper.appendChild(contentDiv);
            wrapper.appendChild(actionsContainer);
            return wrapper;
        }
    }

    /**
     * Card List Component - Reusable component for displaying lists in chat
     * Can be used for offers, earnings, recommendations, etc.
     */
    class CardList {
        /**
         * Create a card list element
         */
        static create(config) {
            const container = document.createElement("div");
            container.className = "me-agent-card-list";
            // Create preview with avatars (show up to 3, plus a 4th with count if more)
            const maxVisible = 3;
            const previewItems = config.items.slice(0, maxVisible);
            const remainingCount = config.items.length - maxVisible;
            const avatarGroup = previewItems
                .map((item, index) => {
                const imageUrl = item.image || `https://via.placeholder.com/40x40?text=${index + 1}`;
                return `<div class="me-agent-card-avatar" style="background-image: url('${imageUrl}'); z-index: ${index + 1};"></div>`;
            })
                .join("");
            // Add overlay avatar if there are more items
            const overlayAvatar = remainingCount > 0
                ? (() => {
                    // Get the next image (4th item) to show as background
                    const nextItem = config.items[maxVisible];
                    const overlayImage = (nextItem === null || nextItem === void 0 ? void 0 : nextItem.image) ||
                        `https://via.placeholder.com/40x40?text=${maxVisible + 1}`;
                    return `<div class="me-agent-card-avatar me-agent-card-avatar-overlay" style="background-image: url('${overlayImage}'); z-index: ${maxVisible + 1};">
            <span class="me-agent-card-avatar-count">+${remainingCount > 99 ? "99+" : remainingCount}</span>
           </div>`;
                })()
                : "";
            container.innerHTML = `
      <div class="me-agent-card-list-content">
        <div class="me-agent-card-avatars">
          ${avatarGroup}
          ${overlayAvatar}
        </div>
        <div class="me-agent-card-list-text">
          <p class="me-agent-card-list-title">${config.title || `${config.items.length} items found`}</p>
          ${config.actionLabel
            ? `<button class="me-agent-card-list-button">${config.actionLabel}${getArrowRightIcon({
                width: 16,
                height: 16,
                color: "#0F0F0F",
            })}</button>`
            : ""}
        </div>
      </div>
    `;
            // Add event listener for action button
            if (config.onAction) {
                const button = container.querySelector(".me-agent-card-list-button");
                button === null || button === void 0 ? void 0 : button.addEventListener("click", config.onAction);
            }
            return container;
        }
    }

    /**
     * Offer Preview Card - Shows in chat after AI response
     * Uses the generic CardList component
     */
    class OfferPreviewCard {
        /**
         * Create offer preview card element
         */
        static create(offers, onViewOffers) {
            // Convert offers to card list items
            const items = offers.map((offer) => ({
                id: offer.offerCode || offer.id,
                image: offer.image,
                title: offer.name,
                subtitle: offer.brandName,
            }));
            // Use the generic CardList component
            return CardList.create({
                items,
                title: `Here are ${offers.length} ${offers.length === 1 ? "offer" : "offers"} we found for you`,
                actionLabel: "View offers",
                onAction: () => onViewOffers(offers),
            });
        }
    }

    /**
     * Discount Utility
     * Calculates discounted prices based on redemption method
     */
    /**
     * Calculate the final discounted price based on redemption method
     */
    function getDiscountedPrice(originalPrice, method) {
        switch (method.type) {
            case RedemptionMethodType.FREE_SHIPPING:
                return "Free shipping";
            case RedemptionMethodType.FIXED_AMOUNT_OFF: {
                const discount = Math.min(method.discountAmount || 0, method.maxDiscountAmount && method.maxDiscountAmount > 0
                    ? method.maxDiscountAmount
                    : Infinity);
                return originalPrice - discount;
            }
            case RedemptionMethodType.FIXED_PERCENTAGE_OFF: {
                const calculatedDiscount = originalPrice * ((method.discountPercentage || 0) / 100);
                const discount = method.maxDiscountAmount && method.maxDiscountAmount > 0
                    ? Math.min(calculatedDiscount, method.maxDiscountAmount)
                    : calculatedDiscount;
                return originalPrice - discount;
            }
            case RedemptionMethodType.VARIABLE_AMOUNT_OFF:
                // Variable amount uses discountAmount without max cap
                return originalPrice - (method.discountAmount || 0);
            case RedemptionMethodType.VARIABLE_PERCENTAGE_OFF: {
                const calculatedDiscount = originalPrice * ((method.discountPercentage || 0) / 100);
                const discount = method.maxDiscountAmount && method.maxDiscountAmount > 0
                    ? Math.min(calculatedDiscount, method.maxDiscountAmount)
                    : calculatedDiscount;
                return originalPrice - discount;
            }
            default:
                return originalPrice;
        }
    }
    /**
     * Calculate discount from offer data (from query_offers response)
     */
    function calculateOfferDiscount(originalPrice, discountType, discountDetails) {
        if (!discountDetails || discountDetails.length === 0) {
            return originalPrice;
        }
        const firstDiscount = discountDetails[0];
        const method = {
            type: discountType,
            discountPercentage: firstDiscount.percentage,
            discountAmount: firstDiscount.amount,
        };
        return getDiscountedPrice(originalPrice, method);
    }
    /**
     * Format discount for display
     */
    function formatDiscount(discountType, discountDetails) {
        if (!discountDetails || discountDetails.length === 0) {
            return "";
        }
        const firstDiscount = discountDetails[0];
        switch (discountType) {
            case RedemptionMethodType.FIXED_PERCENTAGE_OFF:
            case RedemptionMethodType.VARIABLE_PERCENTAGE_OFF:
                return firstDiscount.percentage ? `${firstDiscount.percentage}% OFF` : "";
            case RedemptionMethodType.FIXED_AMOUNT_OFF:
            case RedemptionMethodType.VARIABLE_AMOUNT_OFF:
                return firstDiscount.amount ? `$${firstDiscount.amount} OFF` : "";
            case RedemptionMethodType.FREE_SHIPPING:
                return "FREE SHIPPING";
            default:
                return "";
        }
    }

    /**
     * Offer Grid View
     * Renders a grid of offer cards
     */
    class OfferGridView {
        /**
         * Render a grid of offers
         */
        render(offers) {
            return `
      <div class="me-agent-offers-container">
        <div class="me-agent-offers-grid">
          ${offers.map((offer) => this.renderOfferCard(offer)).join("")}
        </div>
      </div>
    `;
        }
        /**
         * Render a single offer card (using same styling as brand offers)
         */
        renderOfferCard(offer) {
            const price = typeof offer.price === "string" ? parseFloat(offer.price) : offer.price;
            const discountedPrice = calculateOfferDiscount(price, offer.discountType, offer.discountDetails);
            const discountBadge = formatDiscount(offer.discountType, offer.discountDetails);
            // Check if it's free shipping
            const isFreeShipping = discountedPrice === "Free shipping";
            const hasDiscount = isFreeShipping || (typeof discountedPrice === "number" && discountedPrice < price);
            return `
      <div class="me-agent-brand-offer-card" data-offer-code="${offer.offerCode}">
        <div class="me-agent-brand-offer-image-container">
          <img 
            src="${offer.image || "https://via.placeholder.com/200x200?text=No+Image"}" 
            alt="${offer.name}"
            class="me-agent-brand-offer-image"
          />
          ${discountBadge
            ? `<div class="me-agent-brand-offer-badge">${discountBadge}</div>`
            : ""}
        </div>
        <div class="me-agent-brand-offer-info">
          <h4 class="me-agent-brand-offer-name">${offer.name}</h4>
          <div class="me-agent-brand-offer-pricing">
            ${isFreeShipping
            ? `<span class="me-agent-brand-offer-original-price">$${price.toFixed(2)}</span>
                   <span class="me-agent-brand-offer-price">Free Shipping</span>`
            : `<span class="me-agent-brand-offer-price">$${typeof discountedPrice === "number" ? discountedPrice.toFixed(2) : price.toFixed(2)}</span>
                   ${hasDiscount
                ? `<span class="me-agent-brand-offer-original-price">$${price.toFixed(2)}</span>`
                : ""}`}
          </div>
        </div>
      </div>
    `;
        }
        /**
         * Render loading state
         */
        renderLoading(showCancelButton = false) {
            return `
      <div class="me-agent-detail-loading">
        <div class="me-agent-spinner"></div>
        ${showCancelButton
            ? `<button class="me-agent-cancel-loading-btn">Cancel</button>`
            : ""}
      </div>
    `;
        }
    }

    /**
     * SDK Images - Base64 Encoded
     * Auto-generated by scripts/convert-images.js
     * DO NOT EDIT MANUALLY
     */
    const fireImage = 'data:image/gif;base64,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';

    /**
     * Offer Detail View
     * Renders detailed offer information with variants, reviews, and actions
     */
    class OfferDetailView {
        /**
         * Render complete offer detail page
         */
        render(detail, selectedVariant, config) {
            var _a, _b;
            const currentVariant = selectedVariant || ((_a = detail.offerVariants) === null || _a === void 0 ? void 0 : _a[0]) || null;
            const variantData = currentVariant === null || currentVariant === void 0 ? void 0 : currentVariant.variant;
            const finalPrice = this.calculateFinalPrice(detail, currentVariant);
            return `
      <div class="me-agent-offer-detail-scroll">
        ${this.renderImageCarousel(detail, variantData)}
        ${this.renderProductInfo(detail, currentVariant, finalPrice)}
        ${this.renderVariantSelector(detail.offerVariants, selectedVariant, detail.redemptionMethod)}
        ${this.renderTabs(detail)}
      </div>
      ${this.renderActions(detail, (_b = config.likedOffers) === null || _b === void 0 ? void 0 : _b[detail.id])}
    `;
        }
        /**
         * Render image carousel
         */
        renderImageCarousel(detail, variantData) {
            var _a;
            const images = (variantData === null || variantData === void 0 ? void 0 : variantData.productImages) || detail.offerImages || [];
            const primaryImage = ((_a = images[0]) === null || _a === void 0 ? void 0 : _a.url) || detail.coverImage;
            return `
      <div class="me-agent-image-carousel">
        <img 
          src="${primaryImage}" 
          alt="${detail.name}"
          class="me-agent-carousel-image"
        />
      </div>
    `;
        }
        /**
         * Render product information section
         */
        renderProductInfo(detail, currentVariant, finalPrice) {
            var _a, _b, _c;
            const originalPrice = currentVariant
                ? parseFloat(currentVariant.variant.price)
                : parseFloat(detail.originalPrice);
            // Calculate discount from redemptionMethod first, then fallback to variant/offer discount
            let discount = 0;
            if ((_a = detail.redemptionMethod) === null || _a === void 0 ? void 0 : _a.discountPercentage) {
                discount = parseFloat(detail.redemptionMethod.discountPercentage);
            }
            else if ((_b = detail.redemptionMethod) === null || _b === void 0 ? void 0 : _b.discountAmount) {
                // Calculate percentage from fixed amount discount
                const discountAmount = parseFloat(detail.redemptionMethod.discountAmount);
                discount = (discountAmount / originalPrice) * 100;
            }
            else {
                // Fallback to variant or offer discount
                discount = currentVariant
                    ? parseFloat(currentVariant.discountPercentage)
                    : parseFloat(detail.discountPercentage);
            }
            const variantName = (currentVariant === null || currentVariant === void 0 ? void 0 : currentVariant.variant.name) || "Default";
            const redemptionType = ((_c = detail.redemptionMethod) === null || _c === void 0 ? void 0 : _c.type) || "";
            const isFreeShipping = finalPrice === "Free shipping" || redemptionType === "FREE_SHIPPING";
            return `
      <div class="me-agent-detail-info">
        <h2 class="me-agent-detail-title">${detail.name}${variantName !== "Default" ? ` - ${variantName}` : ""}</h2>
        <div class="me-agent-detail-pricing">
          ${isFreeShipping
            ? `<div class="me-agent-price-original">$${originalPrice.toFixed(2)}</div>
                 <div class="me-agent-price-main">Free Shipping</div>`
            : `
                <div class="me-agent-price-main">$${typeof finalPrice === "number"
                ? finalPrice.toFixed(2)
                : originalPrice.toFixed(2)}</div>
                ${discount > 0 &&
                typeof finalPrice === "number" &&
                finalPrice < originalPrice
                ? `<div class="me-agent-price-original">$${originalPrice.toFixed(2)}</div>`
                : ""}
              `}
        </div>
        ${discount > 0 || isFreeShipping
            ? `<div class="me-agent-discount-badge">${isFreeShipping
                ? "Free Shipping"
                : `${Math.round(discount)}% Off With Coupon`}</div>`
            : ""}
        <div class="me-agent-detail-shipping">Ships To Texas, United State Of America</div>
      </div>
    `;
        }
        /**
         * Render variant selector
         */
        renderVariantSelector(offerVariants, selectedVariant, redemptionMethod) {
            var _a;
            if (!offerVariants || offerVariants.length === 0)
                return "";
            const selectedId = (selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.id) || ((_a = offerVariants[0]) === null || _a === void 0 ? void 0 : _a.id);
            const isFreeShipping = (redemptionMethod === null || redemptionMethod === void 0 ? void 0 : redemptionMethod.type) === "FREE_SHIPPING";
            const redemptionDiscount = (redemptionMethod === null || redemptionMethod === void 0 ? void 0 : redemptionMethod.discountPercentage)
                ? parseFloat(redemptionMethod.discountPercentage)
                : 0;
            return `
      <div class="me-agent-variant-section">
        <label class="me-agent-section-label">Variant</label>
        <div class="me-agent-variant-grid">
          ${offerVariants
            .map((variant) => this.renderVariantCard(variant, variant.id === selectedId, isFreeShipping, redemptionDiscount))
            .join("")}
        </div>
      </div>
    `;
        }
        /**
         * Render a single variant card
         */
        renderVariantCard(variant, isSelected, isFreeShipping = false, redemptionDiscount = 0) {
            var _a, _b;
            const variantImage = ((_b = (_a = variant.variant.productImages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) || "";
            // Use redemptionMethod discount if available, otherwise use variant discount
            const discount = redemptionDiscount > 0
                ? redemptionDiscount
                : parseFloat(variant.discountPercentage);
            const hasDiscount = isFreeShipping || discount > 0;
            return `
      <div class="me-agent-variant-card ${isSelected ? "selected" : ""}" data-variant-id="${variant.id}">
        <div class="me-agent-variant-image-wrapper">
          ${variantImage
            ? `<img src="${variantImage}" alt="${variant.variant.name}" class="me-agent-variant-image" />`
            : `<div class="me-agent-variant-placeholder"></div>`}
          ${hasDiscount
            ? `<div class="me-agent-variant-badge">
                  <img src="${fireImage}" alt="fire" class="me-agent-variant-badge-icon" style="width: 12px; height: 12px; object-fit: contain;" />
                  <span class="me-agent-variant-badge-text">${isFreeShipping
                ? "Free Shipping"
                : `${Math.round(discount)}% Off`}</span>
                </div>`
            : ""}
        </div>
      </div>
    `;
        }
        /**
         * Render tabs (Description & Reviews)
         */
        renderTabs(detail) {
            return `
      <div class="me-agent-tabs">
        <button class="me-agent-tab active" data-tab="description">Description</button>
        <button class="me-agent-tab" data-tab="reviews">Reviews</button>
      </div>
      <div class="me-agent-tab-content">
        <div class="me-agent-tab-pane active" data-pane="description">
          <p class="me-agent-description-text">${detail.description || "No description available."}</p>
        </div>
        <div class="me-agent-tab-pane" data-pane="reviews">
          ${this.renderReviews()}
        </div>
      </div>
    `;
        }
        /**
         * Render reviews section
         */
        renderReviews() {
            const dummyReviews = [
                {
                    name: "Sarah M.",
                    rating: 5,
                    text: "Absolutely love this product! The quality exceeded my expectations and it arrived quickly.",
                },
                {
                    name: "James T.",
                    rating: 4,
                    text: "Great value for money. Would recommend to anyone looking for a reliable option.",
                },
                {
                    name: "Emily R.",
                    rating: 5,
                    text: "Perfect! Exactly what I was looking for. Will definitely purchase again.",
                },
            ];
            const avgRating = 4.7;
            const totalReviews = dummyReviews.length;
            return `
      <div class="me-agent-reviews">
        <div class="me-agent-reviews-summary">
          <div class="me-agent-reviews-score">
            <div class="me-agent-score-number">${avgRating.toFixed(1)}</div>
            <div class="me-agent-stars-large">${this.renderStars(avgRating, 20)}</div>
            <div class="me-agent-review-count">${formatNumber(totalReviews)} reviews</div>
          </div>
          <div class="me-agent-reviews-bars">
            ${[5, 4, 3, 2, 1]
            .map((stars) => `
              <div class="me-agent-rating-row">
                <span class="me-agent-stars-small">${this.renderStars(stars, 12)}</span>
                <div class="me-agent-rating-bar">
                  <div class="me-agent-rating-fill" style="width: ${stars === 5 ? 70 : stars === 4 ? 20 : 10}%"></div>
                </div>
                <span class="me-agent-rating-count">${stars === 5 ? 2 : stars === 4 ? 1 : 0}</span>
              </div>
            `)
            .join("")}
          </div>
        </div>
        <div class="me-agent-reviews-list">
          ${dummyReviews
            .map((review) => `
            <div class="me-agent-review-item">
              <div class="me-agent-review-header">
                <div class="me-agent-reviewer-avatar">${review.name.charAt(0)}</div>
                <div>
                  <div class="me-agent-reviewer-name">${review.name}</div>
                  <div class="me-agent-review-stars">${this.renderStars(review.rating, 14)}</div>
                </div>
              </div>
              <p class="me-agent-review-text">${review.text}</p>
            </div>
          `)
            .join("")}
        </div>
      </div>
    `;
        }
        /**
         * Render stars rating
         */
        renderStars(rating, size) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            return `
      ${"★".repeat(fullStars)}
      ${hasHalfStar ? "½" : ""}
      ${"☆".repeat(emptyStars)}
    `.trim();
        }
        /**
         * Render redemption info
         */
        renderRedemptionInfo(detail) {
            return `
      <div class="me-agent-redemption-info">
        <p>Redeem this offer to get a unique coupon code, then enter the code on checkout and the discount will be applied to your total before payment.</p>
      </div>
    `;
        }
        /**
         * Render action buttons
         */
        renderActions(detail, isLiked = false) {
            return `
      <div class="me-agent-detail-bottom-actions">
        <div class="me-agent-detail-bottom-actions-content">
          ${this.renderRedemptionInfo(detail)}
          <div class="me-agent-detail-actions">
            <button class="me-agent-redeem-button" data-action="redeem">
              Redeem Now
            </button>
            <div class="me-agent-secondary-actions">
              <button class="me-agent-add-to-cart-button" data-action="add-to-cart">
                Add To Cart
              </button>
              <button class="me-agent-action-button" data-action="like" data-liked="${isLiked}">
                ${isLiked ? getHeartFilledIcon() : getHeartIcon()}
              </button>
              <button class="me-agent-action-button" data-action="share">
                ${getShareIcon()}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
        }
        /**
         * Calculate final price after discount
         */
        calculateFinalPrice(detail, currentVariant) {
            const price = currentVariant
                ? parseFloat(currentVariant.variant.price)
                : parseFloat(detail.originalPrice);
            // Use the redemption method to calculate proper discounted price
            if (detail.redemptionMethod) {
                const method = {
                    type: detail.redemptionMethod.type,
                    discountPercentage: detail.redemptionMethod.discountPercentage
                        ? parseFloat(detail.redemptionMethod.discountPercentage)
                        : undefined,
                    discountAmount: detail.redemptionMethod.discountAmount
                        ? parseFloat(detail.redemptionMethod.discountAmount)
                        : undefined,
                };
                return getDiscountedPrice(price, method);
            }
            // Fallback to percentage-based calculation
            const discount = currentVariant
                ? parseFloat(currentVariant.discountPercentage)
                : parseFloat(detail.discountPercentage);
            return price * (1 - discount / 100);
        }
    }

    /**
     * Brand List View
     * Renders a list of brands with signup earning methods
     */
    class BrandListView {
        /**
         * Render brand list
         */
        render(brands, origin) {
            return `
      <div class="me-agent-brands-list">
        ${brands.map((brand) => this.renderBrandCard(brand, origin)).join("")}
      </div>
    `;
        }
        /**
         * Render a single brand card
         */
        renderBrandCard(brand, origin) {
            const rule = brand.rewardDetails.rules[0];
            const points = (rule === null || rule === void 0 ? void 0 : rule.points) || 0;
            const { rewardSymbol, rewardValueInDollars, rewardOriginalValue } = brand.rewardDetails.rewardInfo;
            const signupUrl = this.buildSignupUrl(brand, origin);
            const conversionRate = this.formatConversionRate(rewardSymbol, rewardOriginalValue, rewardValueInDollars);
            return `
      <div class="me-agent-brand-card">
        <div class="me-agent-brand-logo-container">
          <img 
            src="${brand.logoUrl ||
            "https://via.placeholder.com/64x64?text=" + brand.name.charAt(0)}" 
            alt="${brand.name}"
            class="me-agent-brand-logo"
          />
        </div>
        <div class="me-agent-brand-info">
          <h3 class="me-agent-brand-name">${brand.name}</h3>
          <p class="me-agent-brand-conversion">${conversionRate}</p>
        </div>
        <div class="me-agent-brand-actions">
          <div class="me-agent-brand-reward-amount">
            ${formatNumber(points)} <span class="me-agent-brand-reward-symbol">${rewardSymbol}</span>
          </div>
          <a 
            href="${signupUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="me-agent-brand-signup-button"
          >
            Sign Up & Earn
            ${getExternalLinkIcon({ width: 12, height: 12 })}
          </a>
        </div>
      </div>
    `;
        }
        /**
         * Build signup URL with callback
         */
        buildSignupUrl(brand, origin) {
            const baseUrl = brand.shopifyStoreUrl || brand.websiteUrl || "";
            if (!baseUrl)
                return "#";
            try {
                const url = new URL(baseUrl);
                url.searchParams.append("meprotocol_callback", origin);
                return url.toString();
            }
            catch (error) {
                console.error("Invalid brand URL:", baseUrl);
                return baseUrl;
            }
        }
        /**
         * Format conversion rate display
         */
        formatConversionRate(symbol, originalValue, dollarValue) {
            const value = parseFloat(dollarValue || originalValue || "0");
            return `1 ${symbol} = $${value.toFixed(2)}`;
        }
    }

    /**
     * Brand Offers View
     * Renders brands with their horizontal offer lists
     */
    class BrandOffersView {
        /**
         * Render brands with offers
         */
        render(brandsWithOffers) {
            if (brandsWithOffers.length === 0) {
                return this.renderEmptyState();
            }
            return `
      <div class="me-agent-brands-offers-list">
        ${brandsWithOffers
            .map((item) => this.renderBrandWithOffers(item))
            .join("")}
      </div>
    `;
        }
        /**
         * Render a brand with its offers
         */
        renderBrandWithOffers(item) {
            var _a, _b;
            const { brand, offers } = item;
            const rule = (_b = (_a = brand.rewardDetails) === null || _a === void 0 ? void 0 : _a.rules) === null || _b === void 0 ? void 0 : _b[0];
            const earningInfo = rule
                ? `Earn ${rule.earningPercentage}% back in ${brand.rewardDetails.rewardInfo.rewardSymbol}`
                : "Earn rewards";
            const displayedOffers = offers.slice(0, 4);
            const hasMore = offers.length > 4;
            return `
      <div class="me-agent-brand-offers-section" data-brand-id="${brand.id}">
        <div class="me-agent-brand-offers-header">
          <div class="me-agent-brand-offers-info">
            <img 
              src="${brand.logoUrl ||
            "https://via.placeholder.com/60x60?text=" + brand.name.charAt(0)}" 
              alt="${brand.name}"
              class="me-agent-brand-offers-logo"
            />
            <h3 class="me-agent-brand-offers-name">${brand.name}</h3>
          </div>
          <div class="me-agent-brand-earning-amount">${earningInfo}</div>
        </div>
        <div class="me-agent-brand-offers-grid">
          ${displayedOffers
            .map((offer) => this.renderOfferCard(offer))
            .join("")}
        </div>
        ${hasMore
            ? `<button class="me-agent-view-all-offers-btn" data-brand-name="${brand.name}">
                View All
                ${getChevronRightIcon({ width: 16, height: 16 })}
              </button>`
            : ""}
      </div>
    `;
        }
        /**
         * Render a single offer card
         */
        renderOfferCard(offer) {
            var _a;
            const price = parseFloat(offer.price || offer.originalPrice || "0");
            const discountedPrice = calculateOfferDiscount(price, offer.discountType || "", offer.discountDetails || []);
            const discountBadge = formatDiscount(offer.discountType || "", offer.discountDetails || []);
            // Check if it's free shipping
            const isFreeShipping = discountedPrice === "Free shipping";
            const hasDiscount = isFreeShipping || (typeof discountedPrice === "number" && discountedPrice < price);
            // Get product URL from nested product object and ensure it has a protocol
            let productUrl = ((_a = offer.product) === null || _a === void 0 ? void 0 : _a.productUrl) || "#";
            // Add https:// if the URL doesn't start with http:// or https://
            if (productUrl !== "#" &&
                !productUrl.startsWith("http://") &&
                !productUrl.startsWith("https://")) {
                productUrl = `https://${productUrl}`;
            }
            return `
      <div 
        class="me-agent-brand-offer-card" 
        data-product-url="${productUrl}"
      >
        <div class="me-agent-brand-offer-image-container">
          <img 
            src="${offer.coverImage ||
            offer.image ||
            "https://via.placeholder.com/200x200?text=No+Image"}" 
            alt="${offer.name}"
            class="me-agent-brand-offer-image"
          />
          ${discountBadge
            ? `<div class="me-agent-brand-offer-badge">${discountBadge}</div>`
            : ""}
        </div>
        <div class="me-agent-brand-offer-info">
          <h4 class="me-agent-brand-offer-name">${offer.name}</h4>
          <div class="me-agent-brand-offer-pricing">
            ${isFreeShipping
            ? `<span class="me-agent-brand-offer-original-price">$${price.toFixed(2)}</span>
                   <span class="me-agent-brand-offer-price">Free Shipping</span>`
            : `<span class="me-agent-brand-offer-price">$${typeof discountedPrice === "number" ? discountedPrice.toFixed(2) : price.toFixed(2)}</span>
                   ${hasDiscount
                ? `<span class="me-agent-brand-offer-original-price">$${price.toFixed(2)}</span>`
                : ""}`}
          </div>
        </div>
      </div>
    `;
        }
        /**
         * Render all offers for a single brand in a grid
         */
        renderBrandOffersGrid(offers) {
            return `
      <div class="me-agent-brand-all-offers-grid">
        ${offers.map((offer) => this.renderOfferCard(offer)).join("")}
      </div>
    `;
        }
        /**
         * Render empty state
         */
        renderEmptyState() {
            return `
      <div class="me-agent-empty-state">
        <p>No offers available at this time.</p>
      </div>
    `;
        }
    }

    /**
     * Category Grid View
     * Renders a grid of purchase earning categories
     */
    class CategoryGridView {
        /**
         * Render category grid
         */
        render(categories) {
            return `
      <div class="me-agent-categories-grid">
        ${categories
            .map((category) => this.renderCategoryCard(category))
            .join("")}
      </div>
    `;
        }
        /**
         * Render a single category card
         */
        renderCategoryCard(category) {
            const iconSvg = this.getCategoryIcon(category.icon || "");
            return `
      <div 
        class="me-agent-category-card" 
        data-category-id="${category.categoryId}"
      >
        <div class="me-agent-category-icon-overlay">
          ${iconSvg}
        </div>
        <div class="me-agent-category-info">
          <h3 class="me-agent-category-title">${category.title || category.categoryName}</h3>
          <p class="me-agent-category-brand-count">${category.brandCount} brands</p>
        </div>
      </div>
    `;
        }
        /**
         * Get category icon SVG (from Lucide React icons)
         */
        getCategoryIcon(iconName) {
            const icons = {
                award: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
                shirt: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
                heartPulse: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
                sofa: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/></svg>`,
                tag: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="white"/></svg>`,
                layoutGrid: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
                laptop: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>`,
                bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
            };
            return icons[iconName] || icons.tag; // Default to tag icon
        }
    }

    /**
     * Redemption View
     * Renders the redemption flow UI (Review, Processing, Complete steps)
     */
    class RedemptionView {
        /**
         * Render review step (show offer, selected reward, amount needed)
         */
        renderReviewStep(offerDetail, selectedReward, swapAmount, selectedVariant) {
            const variantName = selectedVariant
                ? selectedVariant.variant.name
                : "Default";
            const originalPrice = selectedVariant
                ? parseFloat(selectedVariant.variant.price)
                : parseFloat(offerDetail.originalPrice);
            const finalPrice = getDiscountedPrice(originalPrice, offerDetail.redemptionMethod);
            const isAffordable = selectedReward.balance >= swapAmount.amountNeeded;
            // Calculate discount percentage for display
            let discountDisplay = "";
            const redemptionMethod = offerDetail.redemptionMethod;
            if (redemptionMethod) {
                if (redemptionMethod.type === "FREE_SHIPPING") {
                    discountDisplay = "FREE SHIPPING";
                }
                else if (redemptionMethod.discountPercentage &&
                    parseFloat(redemptionMethod.discountPercentage) > 0) {
                    discountDisplay = `${Math.round(parseFloat(redemptionMethod.discountPercentage))}% OFF`;
                }
                else if (redemptionMethod.discountAmount &&
                    parseFloat(redemptionMethod.discountAmount) > 0) {
                    discountDisplay = `$${parseFloat(redemptionMethod.discountAmount).toFixed(0)} OFF`;
                }
                else if ((selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.discountPercentage) &&
                    parseFloat(selectedVariant.discountPercentage) > 0) {
                    discountDisplay = `${Math.round(parseFloat(selectedVariant.discountPercentage))}% OFF`;
                }
                else {
                    // Calculate percentage from prices
                    const discount = ((originalPrice -
                        (typeof finalPrice === "number" ? finalPrice : originalPrice)) /
                        originalPrice) *
                        100;
                    discountDisplay = discount > 0 ? `${Math.round(discount)}% OFF` : "";
                }
            }
            else if ((selectedVariant === null || selectedVariant === void 0 ? void 0 : selectedVariant.discountPercentage) &&
                parseFloat(selectedVariant.discountPercentage) > 0) {
                discountDisplay = `${Math.round(parseFloat(selectedVariant.discountPercentage))}% OFF`;
            }
            else if (offerDetail.discountPercentage &&
                parseFloat(offerDetail.discountPercentage) > 0) {
                discountDisplay = `${Math.round(parseFloat(offerDetail.discountPercentage))}% OFF`;
            }
            return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-redemption-header">
          <p class="me-agent-redemption-subtitle">You are about to redeem this offer</p>
        </div>

        <div class="me-agent-step-indicator">
          <div class="me-agent-step-item">
            <div class="me-agent-step-circle active"></div>
            <div class="me-agent-step-label active">Review</div>
          </div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step-item">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Processing</div>
          </div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step-item">
            <div class="me-agent-step-circle"></div>
            <div class="me-agent-step-label">Complete</div>
          </div>
        </div>

        <div class="me-agent-redemption-content">
          <div class="me-agent-offer-summary-card">
            <img src="${offerDetail.coverImage}" alt="${offerDetail.name}" class="me-agent-offer-summary-image" />
              <div class="me-agent-offer-summary-details">
                <h3 class="me-agent-offer-summary-title">${offerDetail.name}${variantName !== "Default" ? ` - ${variantName}` : ""}</h3>
                <div class="me-agent-offer-summary-price">
                  ${finalPrice === "Free shipping"
            ? `<span class="me-agent-price-final">Free Shipping</span>
                      <span class="me-agent-price-original">$${originalPrice.toFixed(2)}</span>`
            : `<span class="me-agent-price-final">$${typeof finalPrice === "number"
                ? finalPrice.toFixed(2)
                : originalPrice.toFixed(2)}</span>
                      ${typeof finalPrice === "number" &&
                finalPrice < originalPrice
                ? `<span class="me-agent-price-original">$${originalPrice.toFixed(2)}</span>`
                : ""}`}
                </div>
              </div>
              <div class="me-agent-offer-summary-right">
                ${discountDisplay
            ? `<div class="me-agent-offer-summary-discount">${discountDisplay}</div>`
            : ""}
                <div class="me-agent-offer-amount-needed">${swapAmount.amountNeeded.toFixed(2)} ${selectedReward.reward.symbol} Needed</div>
              </div>
            </div>

            <div class="me-agent-reward-selection">
              <div class="me-agent-selected-reward-card">
                <img src="${selectedReward.reward.image}" alt="${selectedReward.reward.name}" class="me-agent-reward-icon" />
                <div class="me-agent-reward-info">
                  <div class="me-agent-reward-balance">${selectedReward.balance.toFixed(2)} <span class="me-agent-reward-symbol">${selectedReward.reward.symbol}</span></div>
                  <div class="me-agent-reward-name">${selectedReward.reward.name}</div>
                </div>
                <div class="me-agent-reward-amount">
                  <div class="me-agent-amount-needed">
                    ${swapAmount.amountNeeded.toFixed(2)} ${selectedReward.reward.symbol} Needed
                    <span class="me-agent-status-dot ${isAffordable ? "success" : "error"}"></span>
                  </div>
                </div>
              </div>
              ${!isAffordable
            ? `
                    <div class="me-agent-error-message">
                      Insufficient balance. You need ${swapAmount.amountNeeded.toFixed(2)} ${selectedReward.reward.symbol} but only have ${selectedReward.balance.toFixed(2)}.
                    </div>
                  `
            : ""}
              <button class="me-agent-change-reward-btn">Use Another Reward</button>
            </div> 
          </div> 
      </div>
      <div class="me-agent-redeem-btn-container">
        <button class="me-agent-redeem-btn" ${!isAffordable ? "disabled" : ""}>
          Redeem Offer
        </button>
      </div>   
    `;
        }
        /**
         * Render processing step (show loading during transaction)
         */
        renderProcessingStep(offerDetail) {
            return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-step-indicator">
          <div class="me-agent-step completed">Review</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step active">Processing</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step">Complete</div>
        </div>

        <div class="me-agent-redemption-content">
          <div class="me-agent-processing-animation">
            <div class="me-agent-spinner"></div>
            <h3>Processing your redemption...</h3>
            <p>Please wait while we complete your transaction. This may take a few moments.</p>
          </div>
        </div>
      </div>
    `;
        }
        /**
         * Render complete step (show success message and checkout button)
         */
        renderCompleteStep(order, offerDetail) {
            return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-step-indicator">
          <div class="me-agent-step completed">Review</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step completed">Processing</div>
          <div class="me-agent-step-line"></div>
          <div class="me-agent-step active">Complete</div>
        </div>

        <div class="me-agent-redemption-content">
          <div class="me-agent-success-animation">
            <div class="me-agent-success-icon">✓</div>
            <h3>Redemption Successful!</h3>
            <p>Thank you for redeeming. Your redemption details have been sent to your email.</p>
          </div>

          <div class="me-agent-coupon-details-card">
            <div class="me-agent-coupon-label">Your Discount Code</div>
            <div class="me-agent-coupon-code">
              <span class="me-agent-coupon-code-text">${order.coupon.code}</span>
              <button class="me-agent-copy-coupon-btn" data-code="${order.coupon.code}">Copy</button>
            </div>
            <div class="me-agent-coupon-discount">
              ${order.coupon.discountValue || "Discount applied"}
            </div>
          </div>

          <button class="me-agent-use-coupon-btn" data-order-id="${order.id}">
            Use Coupon
          </button>
        </div>
      </div>
    `;
        }
        /**
         * Render error state
         */
        renderError(error) {
            return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-error-state">
          <div class="me-agent-error-icon">✕</div>
          <h3>Redemption Failed</h3>
          <p>${error}</p>
          <button class="me-agent-try-again-btn">Try Again</button>
        </div>
      </div>
    `;
        }
        /**
         * Render loading state (when fetching data)
         */
        renderLoading() {
            return `
      <div class="me-agent-redemption-container">
        <div class="me-agent-loading-state">
          <div class="me-agent-spinner"></div>
          <p>Loading redemption details...</p>
        </div>
      </div>
    `;
        }
        /**
         * Render reward selection list (for bottom sheet)
         */
        renderRewardList(rewards, currentRewardId) {
            return `
      <div class="me-agent-reward-list-items">
        ${rewards
            .map((reward) => `
          <div class="me-agent-reward-list-item ${reward.reward.id === currentRewardId ? "selected" : ""}" data-reward-id="${reward.reward.id}">
            <img src="${reward.reward.image}" alt="${reward.reward.name}" class="me-agent-reward-list-icon" />
            <div class="me-agent-reward-list-info">
              <div class="me-agent-reward-list-name">${reward.reward.name}</div>
              <div class="me-agent-reward-list-balance">Balance: ${reward.balance.toFixed(2)} ${reward.reward.symbol}</div>
            </div>
            <div class="me-agent-reward-list-check">✓</div>
          </div>
        `)
            .join("")}
      </div>
    `;
        }
    }

    /**
     * Bottom Sheet Modal Component
     * A modal that slides up from the bottom of the screen
     */
    class BottomSheet {
        constructor(container) {
            this.container = container;
            this.isVisible = false;
            this.overlay = this.createOverlay();
            this.sheet = this.createSheet();
            this.contentElement = this.sheet.querySelector(".me-agent-bottom-sheet-content");
        }
        /**
         * Create overlay element
         */
        createOverlay() {
            const overlay = document.createElement("div");
            overlay.className = "me-agent-bottom-sheet-overlay";
            overlay.addEventListener("click", () => this.hide());
            return overlay;
        }
        /**
         * Create sheet element
         */
        createSheet() {
            const sheet = document.createElement("div");
            sheet.className = "me-agent-bottom-sheet";
            sheet.innerHTML = `
      <div class="me-agent-bottom-sheet-header">
        <h3 class="me-agent-bottom-sheet-title"></h3>
        <button class="me-agent-bottom-sheet-close" data-action="close">
          ${getCloseIcon({ width: 16, height: 16 })}
        </button>
      </div>
      <div class="me-agent-bottom-sheet-content"></div>
    `;
            // Prevent clicks inside sheet from closing it
            sheet.addEventListener("click", (e) => e.stopPropagation());
            // Close button
            const closeBtn = sheet.querySelector('[data-action="close"]');
            if (closeBtn) {
                closeBtn.addEventListener("click", () => this.hide());
            }
            return sheet;
        }
        /**
         * Show the bottom sheet
         */
        show(title, content, onClose) {
            this.onCloseCallback = onClose;
            // Update title and content
            const titleElement = this.sheet.querySelector(".me-agent-bottom-sheet-title");
            if (titleElement) {
                titleElement.textContent = title;
            }
            this.contentElement.innerHTML = content;
            // Append to container if not already
            if (!this.overlay.parentElement) {
                this.container.appendChild(this.overlay);
                this.container.appendChild(this.sheet);
            }
            // Trigger animation
            requestAnimationFrame(() => {
                this.overlay.classList.add("visible");
                this.sheet.classList.add("visible");
                this.isVisible = true;
            });
        }
        /**
         * Hide the bottom sheet
         */
        hide() {
            this.overlay.classList.remove("visible");
            this.sheet.classList.remove("visible");
            this.isVisible = false;
            // Remove from DOM after animation
            setTimeout(() => {
                if (!this.isVisible && this.overlay.parentElement) {
                    this.overlay.remove();
                    this.sheet.remove();
                }
            }, 300);
            // Call onClose callback
            if (this.onCloseCallback) {
                this.onCloseCallback();
            }
        }
        /**
         * Get the content element for attaching event listeners
         */
        getContentElement() {
            return this.contentElement;
        }
        /**
         * Check if bottom sheet is visible
         */
        isOpen() {
            return this.isVisible;
        }
        /**
         * Destroy the bottom sheet
         */
        destroy() {
            this.hide();
            this.overlay.remove();
            this.sheet.remove();
        }
    }

    /**
     * Detail Panel Controller
     * Orchestrates the detail panel and routes between different views
     */
    class DetailPanelController {
        constructor(config, offerService, brandService, redemptionService, onClose) {
            this.config = config;
            this.offerService = offerService;
            this.brandService = brandService;
            this.redemptionService = redemptionService;
            this.onClose = onClose;
            this.isVisible = false;
            this.currentView = null;
            this.viewStack = [];
            this.sessionId = "";
            this.currentAbortController = null;
            // Current state
            this.currentOfferDetail = null;
            this.selectedVariant = null;
            this.currentBrandsWithOffers = [];
            // Redemption state
            this.userBalances = [];
            this.selectedReward = null;
            this.swapAmount = null;
            // Components
            this.bottomSheet = null;
            // Initialize views
            this.offerGridView = new OfferGridView();
            this.offerDetailView = new OfferDetailView();
            this.brandListView = new BrandListView();
            this.brandOffersView = new BrandOffersView();
            this.categoryGridView = new CategoryGridView();
            this.redemptionView = new RedemptionView();
            // Create DOM elements
            this.wrapper = document.createElement("div");
            this.wrapper.className = "me-agent-detail-panel-wrapper";
            this.container = document.createElement("div");
            this.container.className = "me-agent-detail-panel";
            // Create fixed header
            this.header = document.createElement("div");
            this.header.className = "me-agent-detail-header";
            // Back button with title
            this.backButton = document.createElement("button");
            this.backButton.className = "me-agent-back-button";
            this.backButton.style.display = "none"; // Hidden by default
            this.backButton.addEventListener("click", () => this.goBack());
            // Title (standalone when no back)
            this.headerTitle = document.createElement("h2");
            this.headerTitle.className = "me-agent-detail-title";
            this.headerTitle.textContent = "Details";
            this.headerTitle.style.display = "block"; // Visible by default
            // Close button
            this.closeButton = document.createElement("button");
            this.closeButton.className = "me-agent-close-button";
            this.closeButton.innerHTML = getCloseIcon({ width: 20, height: 20 });
            this.closeButton.addEventListener("click", () => this.onClose());
            this.header.appendChild(this.backButton);
            this.header.appendChild(this.headerTitle);
            this.header.appendChild(this.closeButton);
            // Create content area
            this.content = document.createElement("div");
            this.content.className = "me-agent-detail-content";
            // Assemble
            this.container.appendChild(this.header);
            this.container.appendChild(this.content);
            this.wrapper.appendChild(this.container);
            // Initialize bottom sheet
            this.bottomSheet = new BottomSheet(this.wrapper);
        }
        /**
         * Get the wrapper element
         */
        getElement() {
            return this.wrapper;
        }
        /**
         * Show the detail panel
         */
        show() {
            this.isVisible = true;
            this.container.classList.add("visible");
        }
        /**
         * Hide the detail panel
         */
        hide() {
            this.cancelCurrentRequest();
            this.isVisible = false;
            this.container.classList.remove("visible");
            this.viewStack = [];
            this.currentView = null;
            // Reset header to default state
            this.backButton.style.display = "none";
            this.headerTitle.style.display = "block";
            this.headerTitle.textContent = "Details";
        }
        /**
         * Cancel any pending requests
         */
        cancelCurrentRequest() {
            if (this.currentAbortController) {
                this.currentAbortController.abort();
                this.currentAbortController = null;
            }
        }
        /**
         * Update header title and back button visibility
         */
        updateHeader(title) {
            // Show back button with title if there's more than one view in the stack
            if (this.viewStack.length > 1) {
                this.backButton.style.display = "flex";
                this.backButton.innerHTML = `
        ${getChevronLeftIcon({ width: 20, height: 20 })}
        <span style="margin-left: 8px;">${title}</span>
      `;
                this.headerTitle.style.display = "none";
            }
            else {
                // Just show title, no back button
                this.backButton.style.display = "none";
                this.headerTitle.style.display = "block";
                this.headerTitle.textContent = title;
            }
        }
        /**
         * Go back to previous view
         */
        goBack() {
            if (this.viewStack.length <= 1) {
                return; // No previous view
            }
            // Cancel any pending requests
            this.cancelCurrentRequest();
            // Pop current view
            this.viewStack.pop();
            // Get previous view state
            const previousView = this.viewStack[this.viewStack.length - 1];
            // Restore previous view
            this.restoreView(previousView);
        }
        /**
         * Restore a view from state
         */
        restoreView(viewState) {
            switch (viewState.type) {
                case "offer-grid":
                    this.content.innerHTML = this.offerGridView.render(viewState.data);
                    this.attachOfferGridListeners();
                    break;
                case "brand-list":
                    const origin = window.location.origin;
                    this.content.innerHTML = this.brandListView.render(viewState.data, origin);
                    this.attachBrandListListeners();
                    break;
                case "category-grid":
                    this.content.innerHTML = this.categoryGridView.render(viewState.data);
                    this.attachCategoryGridListeners();
                    break;
                case "brand-offers":
                    this.currentBrandsWithOffers = viewState.data;
                    this.content.innerHTML = this.brandOffersView.render(viewState.data);
                    this.attachBrandOffersListeners();
                    break;
                case "single-brand-offers":
                    this.content.innerHTML = this.brandOffersView.renderBrandOffersGrid(viewState.data.offers);
                    this.attachSingleBrandOffersListeners();
                    break;
                case "offer-detail":
                    // Re-fetch offer detail as it needs dynamic data
                    const { offerCode, sessionId } = viewState.data;
                    this.showOfferDetail(offerCode, sessionId);
                    return; // Avoid duplicate header update
            }
            this.currentView = viewState.type;
            this.updateHeader(viewState.title);
        }
        /**
         * Show offer grid
         */
        showOfferGrid(offers, sessionId) {
            this.sessionId = sessionId;
            this.content.innerHTML = this.offerGridView.render(offers);
            this.currentView = "offer-grid";
            this.viewStack = [
                {
                    type: "offer-grid",
                    title: "Available Offers",
                    data: offers,
                },
            ];
            this.updateHeader("Available Offers");
            this.attachOfferGridListeners();
            this.show();
        }
        /**
         * Show offer detail
         */
        showOfferDetail(offerCode, sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                // Cancel any existing request
                this.cancelCurrentRequest();
                // Create new AbortController
                this.currentAbortController = new AbortController();
                const signal = this.currentAbortController.signal;
                try {
                    // Show loading with cancel button
                    this.content.innerHTML = this.offerGridView.renderLoading(true);
                    this.attachCancelLoadingListener();
                    this.updateHeader("Loading...");
                    this.show();
                    // Fetch offer details
                    const detail = yield this.offerService.getOfferDetail(offerCode, sessionId);
                    // Check if request was aborted
                    if (signal.aborted) {
                        return;
                    }
                    this.currentOfferDetail = detail;
                    this.selectedVariant = ((_a = detail.offerVariants) === null || _a === void 0 ? void 0 : _a[0]) || null;
                    // Render offer detail
                    this.content.innerHTML = this.offerDetailView.render(detail, this.selectedVariant, this.config);
                    this.currentView = "offer-detail";
                    this.viewStack.push({
                        type: "offer-detail",
                        title: "Product Details",
                        data: { offerCode, sessionId },
                    });
                    this.updateHeader("Product Details");
                    this.attachOfferDetailListeners();
                    // Clear abort controller after successful completion
                    this.currentAbortController = null;
                }
                catch (error) {
                    // Don't show error if request was aborted
                    if (signal.aborted) {
                        return;
                    }
                    console.error("Error showing offer detail:", error);
                    this.content.innerHTML = `<div class="me-agent-error">Failed to load offer details</div>`;
                    this.updateHeader("Error");
                    this.currentAbortController = null;
                }
            });
        }
        /**
         * Show brand list
         */
        showBrandList(brands) {
            const origin = window.location.origin;
            this.content.innerHTML = this.brandListView.render(brands, origin);
            this.currentView = "brand-list";
            this.viewStack = [
                {
                    type: "brand-list",
                    title: "Brands with Sign-Up Rewards",
                    data: brands,
                },
            ];
            this.updateHeader("Brands with Sign-Up Rewards");
            this.attachBrandListListeners();
            this.show();
        }
        /**
         * Show category grid
         */
        showCategoryGrid(categories) {
            this.content.innerHTML = this.categoryGridView.render(categories);
            this.currentView = "category-grid";
            this.viewStack = [
                {
                    type: "category-grid",
                    title: "Purchase Earning Categories",
                    data: categories,
                },
            ];
            this.updateHeader("Purchase Earning Categories");
            this.attachCategoryGridListeners();
            this.show();
        }
        /**
         * Show brands with offers for a category
         */
        showBrandsWithOffers(categoryId, token) {
            return __awaiter(this, void 0, void 0, function* () {
                // Cancel any existing request
                this.cancelCurrentRequest();
                // Create new AbortController
                this.currentAbortController = new AbortController();
                const signal = this.currentAbortController.signal;
                try {
                    // Show loading with cancel button
                    this.content.innerHTML = this.offerGridView.renderLoading(true);
                    this.attachCancelLoadingListener();
                    this.updateHeader("Loading...");
                    this.show();
                    // Fetch brands with offers
                    const brandsWithOffers = yield this.brandService.getBrandsWithOffers(categoryId, token);
                    // Check if request was aborted
                    if (signal.aborted) {
                        return;
                    }
                    // Store and render brands with offers
                    this.currentBrandsWithOffers = brandsWithOffers;
                    this.content.innerHTML = this.brandOffersView.render(brandsWithOffers);
                    this.currentView = "brand-offers";
                    this.viewStack.push({
                        type: "brand-offers",
                        title: "Brands with Purchase Rewards",
                        data: brandsWithOffers,
                    });
                    this.updateHeader("Brands with Purchase Rewards");
                    this.attachBrandOffersListeners();
                    // Clear abort controller after successful completion
                    this.currentAbortController = null;
                }
                catch (error) {
                    // Don't show error if request was aborted
                    if (signal.aborted) {
                        return;
                    }
                    console.error("Error showing brands with offers:", error);
                    this.content.innerHTML = `<div class="me-agent-error">Failed to load brands</div>`;
                    this.updateHeader("Error");
                    this.currentAbortController = null;
                }
            });
        }
        /**
         * Attach event listeners for offer grid
         */
        attachOfferGridListeners() {
            // Offer cards (using brand-offer-card class for consistency)
            const offerCards = this.content.querySelectorAll(".me-agent-brand-offer-card");
            offerCards.forEach((card) => {
                card.addEventListener("click", () => {
                    const offerCode = card.getAttribute("data-offer-code");
                    if (offerCode && this.sessionId) {
                        this.showOfferDetail(offerCode, this.sessionId);
                    }
                });
            });
        }
        /**
         * Attach event listeners for offer detail
         */
        attachOfferDetailListeners() {
            // Variant selection
            const variantCards = this.content.querySelectorAll(".me-agent-variant-card");
            variantCards.forEach((card) => {
                card.addEventListener("click", () => {
                    const variantId = card.getAttribute("data-variant-id");
                    if (variantId && this.currentOfferDetail) {
                        this.selectVariant(variantId);
                    }
                });
            });
            // Tabs
            const tabs = this.content.querySelectorAll(".me-agent-tab");
            tabs.forEach((tab) => {
                tab.addEventListener("click", () => {
                    const tabName = tab.getAttribute("data-tab");
                    if (tabName) {
                        this.switchTab(tabName);
                    }
                });
            });
            // Action buttons
            this.attachActionListeners();
        }
        /**
         * Attach event listeners for brand list
         */
        attachBrandListListeners() {
            // No additional listeners needed - back/close handled by header
        }
        /**
         * Attach event listeners for category grid
         */
        attachCategoryGridListeners() {
            // Category cards
            const categoryCards = this.content.querySelectorAll(".me-agent-category-card");
            categoryCards.forEach((card) => {
                card.addEventListener("click", () => {
                    const categoryId = card.getAttribute("data-category-id");
                    if (categoryId) {
                        this.showBrandsWithOffers(categoryId);
                    }
                });
            });
        }
        /**
         * Show all offers for a single brand
         */
        showSingleBrandOffers(brandId, brandName) {
            // Find the brand from stored data
            const brandData = this.currentBrandsWithOffers.find((item) => item.brand.id === brandId);
            if (!brandData) {
                console.error("Brand not found:", brandId);
                return;
            }
            // Render all offers for this brand
            this.content.innerHTML = this.brandOffersView.renderBrandOffersGrid(brandData.offers);
            this.currentView = "single-brand-offers";
            this.viewStack.push({
                type: "single-brand-offers",
                title: brandName,
                data: { brandId, brandName, offers: brandData.offers },
            });
            this.updateHeader(brandName);
            this.attachSingleBrandOffersListeners();
        }
        /**
         * Attach event listeners for single brand offers grid
         */
        attachSingleBrandOffersListeners() {
            // Offer cards - navigate to product URL
            const offerCards = this.content.querySelectorAll(".me-agent-brand-offer-card");
            offerCards.forEach((card) => {
                card.addEventListener("click", () => {
                    const productUrl = card.getAttribute("data-product-url");
                    if (productUrl && productUrl !== "#") {
                        window.open(productUrl, "_blank");
                    }
                });
            });
        }
        /**
         * Attach event listeners for brand offers
         */
        attachBrandOffersListeners() {
            // Offer cards - navigate to product URL
            const offerCards = this.content.querySelectorAll(".me-agent-brand-offer-card");
            offerCards.forEach((card) => {
                card.addEventListener("click", () => {
                    const productUrl = card.getAttribute("data-product-url");
                    if (productUrl && productUrl !== "#") {
                        window.open(productUrl, "_blank");
                    }
                });
            });
            // View All buttons
            const viewAllButtons = this.content.querySelectorAll(".me-agent-view-all-offers-btn");
            viewAllButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    const brandSection = button.closest(".me-agent-brand-offers-section");
                    const brandId = brandSection === null || brandSection === void 0 ? void 0 : brandSection.getAttribute("data-brand-id");
                    const brandName = button.getAttribute("data-brand-name") || "Brand";
                    if (brandId) {
                        this.showSingleBrandOffers(brandId, brandName);
                    }
                });
            });
        }
        /**
         * Attach cancel button listener during loading
         */
        attachCancelLoadingListener() {
            const cancelBtn = this.content.querySelector(".me-agent-cancel-loading-btn");
            if (cancelBtn) {
                cancelBtn.addEventListener("click", () => {
                    // Cancel the current request
                    this.cancelCurrentRequest();
                    // Restore current view (top of stack) without popping
                    const currentView = this.viewStack[this.viewStack.length - 1];
                    if (currentView) {
                        this.restoreView(currentView);
                    }
                });
            }
        }
        /**
         * Attach action button listeners (like, share, add to cart)
         */
        attachActionListeners() {
            const redeemBtn = this.content.querySelector('[data-action="redeem"]');
            const likeBtn = this.content.querySelector('[data-action="like"]');
            const shareBtn = this.content.querySelector('[data-action="share"]');
            const cartBtn = this.content.querySelector('[data-action="add-to-cart"]');
            // Redeem button
            redeemBtn === null || redeemBtn === void 0 ? void 0 : redeemBtn.addEventListener("click", () => {
                if (this.currentOfferDetail) {
                    this.handleRedemption();
                }
            });
            likeBtn === null || likeBtn === void 0 ? void 0 : likeBtn.addEventListener("click", () => {
                if (this.currentOfferDetail && this.config.onLikeUnlike) {
                    const isLiked = likeBtn.getAttribute("data-liked") === "true";
                    this.config.onLikeUnlike(this.currentOfferDetail, !isLiked);
                    likeBtn.setAttribute("data-liked", (!isLiked).toString());
                    likeBtn.querySelector(".me-agent-action-icon").textContent = !isLiked
                        ? "❤️"
                        : "♡";
                }
            });
            shareBtn === null || shareBtn === void 0 ? void 0 : shareBtn.addEventListener("click", () => {
                if (this.currentOfferDetail && this.config.onShare) {
                    this.config.onShare(this.currentOfferDetail);
                }
            });
            cartBtn === null || cartBtn === void 0 ? void 0 : cartBtn.addEventListener("click", () => {
                if (this.currentOfferDetail && this.config.onAddToCart) {
                    this.config.onAddToCart(this.currentOfferDetail);
                }
            });
        }
        /**
         * Handle redemption button click
         */
        handleRedemption() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.currentOfferDetail)
                    return;
                try {
                    // Show loading
                    this.content.innerHTML = this.redemptionView.renderLoading();
                    // Step 1: Check if email is available
                    const email = this.redemptionService.getEmail();
                    if (!email) {
                        throw new Error("Email is required for redemption. Please configure the SDK with an email address.");
                    }
                    // Step 2: Ensure Magic is logged in (will trigger OTP if needed)
                    yield this.redemptionService.ensureMagicLogin(email);
                    // Step 3: Login to ME Protocol
                    yield this.redemptionService.loginToMEProtocol();
                    // Step 4: Fetch user's reward balances
                    this.userBalances = yield this.redemptionService.fetchBalances();
                    if (this.userBalances.length === 0) {
                        this.content.innerHTML = `
          <div class="me-agent-error-message">
            <p>You don't have any reward tokens yet.</p>
            <button class="me-agent-try-again-btn" data-action="back">Go Back</button>
          </div>
        `;
                        this.attachBackButtonListener();
                        return;
                    }
                    // Step 3: Select default reward (offer's reward if available, else first reward)
                    this.selectedReward = this.findDefaultReward();
                    // Step 4: Show redemption review (with loading state for amount)
                    this.swapAmount = {
                        amount: 0,
                        amountNeeded: 0,
                        checkAffordability: false,
                    }; // Placeholder
                    this.showRedemptionReview();
                    // Step 5: Calculate swap amount in background and update UI
                    yield this.calculateAndUpdateSwapAmount();
                }
                catch (error) {
                    console.error("Redemption error:", error);
                    this.content.innerHTML = this.redemptionView.renderError(error instanceof Error ? error.message : "Failed to start redemption");
                    this.attachRedemptionRetryListener();
                }
            });
        }
        /**
         * Find default reward to use for redemption
         */
        findDefaultReward() {
            if (!this.currentOfferDetail)
                throw new Error("No offer selected");
            // Try to find the offer's reward
            const offerReward = this.userBalances.find((r) => r.reward.id === this.currentOfferDetail.reward.id);
            if (offerReward)
                return offerReward;
            // Otherwise use first reward
            return this.userBalances[0];
        }
        /**
         * Calculate swap amount needed for redemption
         */
        calculateSwapAmount() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (!this.currentOfferDetail || !this.selectedReward)
                    return;
                const variant = this.selectedVariant || ((_a = this.currentOfferDetail.offerVariants) === null || _a === void 0 ? void 0 : _a[0]);
                const variantId = ((_b = variant === null || variant === void 0 ? void 0 : variant.variant) === null || _b === void 0 ? void 0 : _b.id) || (variant === null || variant === void 0 ? void 0 : variant.variantId);
                this.swapAmount = yield this.redemptionService.calculateSwapAmount(this.selectedReward.reward.contractAddress, this.currentOfferDetail, variantId);
            });
        }
        /**
         * Calculate swap amount and update the UI with result or error
         */
        calculateAndUpdateSwapAmount() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.currentOfferDetail || !this.selectedReward)
                    return;
                const amountElement = this.content.querySelector(".me-agent-amount-needed");
                const redeemButton = this.content.querySelector(".me-agent-redeem-btn");
                if (!amountElement)
                    return;
                try {
                    // Show loading
                    amountElement.innerHTML = `
        <span style="display: flex; align-items: center; gap: 8px;">
          <span style="animation: spin 1s linear infinite;">⏳</span>
          Loading...
        </span>
      `;
                    // Calculate amount
                    yield this.calculateSwapAmount();
                    // Check if view was changed during calculation
                    if (!this.swapAmount ||
                        this.content.querySelector(".me-agent-redemption-container") === null) {
                        return;
                    }
                    // Update with actual amount
                    amountElement.textContent = `${this.swapAmount.amountNeeded.toFixed(2)} ${this.selectedReward.reward.symbol}`;
                    amountElement.style.color = "";
                    // Enable/disable button based on affordability
                    if (redeemButton) {
                        const isAffordable = this.selectedReward.balance >= this.swapAmount.amountNeeded;
                        redeemButton.disabled = !isAffordable;
                        // Show insufficient balance message if needed
                        if (!isAffordable) {
                            const errorMsg = this.content.querySelector(".me-agent-error-message");
                            if (!errorMsg) {
                                const rewardSelection = this.content.querySelector(".me-agent-reward-selection");
                                if (rewardSelection) {
                                    const errorDiv = document.createElement("div");
                                    errorDiv.className = "me-agent-error-message";
                                    errorDiv.innerHTML = `
                <p>Insufficient balance. You need ${this.swapAmount.amountNeeded.toFixed(2)} ${this.selectedReward.reward.symbol} but only have ${this.selectedReward.balance.toFixed(2)}.</p>
              `;
                                    rewardSelection.appendChild(errorDiv);
                                }
                            }
                        }
                    }
                }
                catch (error) {
                    console.error("Error calculating swap amount:", error);
                    // Show error in red
                    amountElement.innerHTML = `<span style="color: #ef4444;">Failed to fetch needed amount</span>`;
                    // Disable redeem button
                    if (redeemButton) {
                        redeemButton.disabled = true;
                    }
                }
            });
        }
        /**
         * Show redemption review step
         */
        showRedemptionReview() {
            var _a;
            if (!this.currentOfferDetail || !this.selectedReward || !this.swapAmount)
                return;
            const variant = this.selectedVariant || ((_a = this.currentOfferDetail.offerVariants) === null || _a === void 0 ? void 0 : _a[0]);
            this.viewStack.push({
                type: "redemption-review",
                title: "Complete Your Redemption",
                data: {
                    offer: this.currentOfferDetail,
                    reward: this.selectedReward,
                    swapAmount: this.swapAmount,
                    variant,
                },
            });
            this.content.innerHTML = this.redemptionView.renderReviewStep(this.currentOfferDetail, this.selectedReward, this.swapAmount, variant);
            this.updateHeader("Complete Your Redemption");
            this.attachRedemptionReviewListeners();
        }
        /**
         * Attach listeners for redemption review step
         */
        attachRedemptionReviewListeners() {
            // Change reward button
            const changeRewardBtn = this.content.querySelector(".me-agent-change-reward-btn");
            changeRewardBtn === null || changeRewardBtn === void 0 ? void 0 : changeRewardBtn.addEventListener("click", () => {
                this.showRewardSelectionList();
            });
            // Redeem button
            const redeemBtn = this.content.querySelector(".me-agent-redeem-btn");
            redeemBtn === null || redeemBtn === void 0 ? void 0 : redeemBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                yield this.executeRedemption();
            }));
        }
        /**
         * Show list of available rewards for selection
         */
        showRewardSelectionList() {
            var _a;
            if (!this.userBalances.length || !this.bottomSheet)
                return;
            // Use view to generate HTML
            const listHTML = this.redemptionView.renderRewardList(this.userBalances, ((_a = this.selectedReward) === null || _a === void 0 ? void 0 : _a.reward.id) || "");
            // Show in bottom sheet
            this.bottomSheet.show("Select a Reward", listHTML);
            // Attach listeners after bottom sheet is shown
            setTimeout(() => {
                var _a;
                const contentElement = (_a = this.bottomSheet) === null || _a === void 0 ? void 0 : _a.getContentElement();
                if (contentElement) {
                    const rewardItems = contentElement.querySelectorAll(".me-agent-reward-list-item");
                    rewardItems.forEach((item) => {
                        item.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                            const rewardId = item.getAttribute("data-reward-id");
                            if (rewardId) {
                                yield this.selectReward(rewardId);
                            }
                        }));
                    });
                }
            }, 0);
        }
        /**
         * Select a different reward
         */
        selectReward(rewardId) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                const reward = this.userBalances.find((r) => r.reward.id === rewardId);
                if (!reward)
                    return;
                // Close bottom sheet
                (_a = this.bottomSheet) === null || _a === void 0 ? void 0 : _a.hide();
                this.selectedReward = reward;
                this.swapAmount = { amount: 0, amountNeeded: 0, checkAffordability: false }; // Reset to loading state
                this.showRedemptionReview();
                yield this.calculateAndUpdateSwapAmount();
            });
        }
        /**
         * Execute the redemption transaction
         */
        executeRedemption() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!this.currentOfferDetail || !this.selectedReward || !this.swapAmount)
                    return;
                try {
                    // Show processing step
                    this.content.innerHTML = this.redemptionView.renderProcessingStep(this.currentOfferDetail);
                    this.updateHeader("Processing");
                    const variant = this.selectedVariant || ((_a = this.currentOfferDetail.offerVariants) === null || _a === void 0 ? void 0 : _a[0]);
                    const variantId = variant === null || variant === void 0 ? void 0 : variant.id;
                    // Determine if same-brand or cross-brand redemption
                    const isSameBrand = this.selectedReward.reward.contractAddress ===
                        this.currentOfferDetail.reward.contractAddress;
                    let order;
                    if (isSameBrand) {
                        // Same brand redemption
                        order = yield this.redemptionService.executeSameBrandRedemption(this.selectedReward.reward.contractAddress, this.selectedReward.reward.id, this.swapAmount.amount.toString(), this.currentOfferDetail.id, this.currentOfferDetail.redemptionMethod.id, variantId);
                    }
                    else {
                        // Cross brand redemption
                        order = yield this.redemptionService.executeCrossBrandRedemption(this.selectedReward.reward.contractAddress, this.selectedReward.reward.id, this.swapAmount.amount.toString(), this.swapAmount.amountNeeded.toString(), this.currentOfferDetail.reward.contractAddress, this.currentOfferDetail.id, this.currentOfferDetail.redemptionMethod.id, variantId);
                    }
                    // Show complete step
                    this.showRedemptionComplete(order);
                }
                catch (error) {
                    console.error("Redemption transaction error:", error);
                    this.content.innerHTML = this.redemptionView.renderError(error instanceof Error
                        ? error.message
                        : "Redemption failed. Please try again.");
                    this.updateHeader("Error");
                    this.attachRedemptionRetryListener();
                }
            });
        }
        /**
         * Show redemption complete step
         */
        showRedemptionComplete(order) {
            if (!this.currentOfferDetail)
                return;
            this.content.innerHTML = this.redemptionView.renderCompleteStep(order, this.currentOfferDetail);
            this.updateHeader("Complete");
            this.attachRedemptionCompleteListeners(order);
        }
        /**
         * Attach listeners for redemption complete step
         */
        attachRedemptionCompleteListeners(order) {
            // Copy coupon button
            const copyBtn = this.content.querySelector('[data-action="copy-coupon"]');
            copyBtn === null || copyBtn === void 0 ? void 0 : copyBtn.addEventListener("click", () => {
                const couponCode = copyBtn.getAttribute("data-coupon-code");
                if (couponCode) {
                    navigator.clipboard.writeText(couponCode);
                    copyBtn.textContent = "Copied!";
                    setTimeout(() => {
                        copyBtn.textContent = "Copy";
                    }, 2000);
                }
            });
            // Use coupon button
            const useCouponBtn = this.content.querySelector('[data-action="use-coupon"]');
            useCouponBtn === null || useCouponBtn === void 0 ? void 0 : useCouponBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    if (!this.currentOfferDetail)
                        return;
                    const variant = this.selectedVariant || ((_a = this.currentOfferDetail.offerVariants) === null || _a === void 0 ? void 0 : _a[0]);
                    const checkoutUrl = yield this.redemptionService.getCheckoutUrl(this.currentOfferDetail.brand.id, ((_b = variant === null || variant === void 0 ? void 0 : variant.variant) === null || _b === void 0 ? void 0 : _b.id) || "" // Use variant ID as the product variant ID
                    );
                    // Open checkout in new tab
                    window.open(checkoutUrl, "_blank");
                }
                catch (error) {
                    console.error("Error getting checkout URL:", error);
                    alert("Failed to generate checkout URL. Please use the coupon code manually.");
                }
            }));
        }
        /**
         * Attach retry listener for redemption errors
         */
        attachRedemptionRetryListener() {
            const retryBtn = this.content.querySelector('[data-action="retry-redemption"]');
            retryBtn === null || retryBtn === void 0 ? void 0 : retryBtn.addEventListener("click", () => {
                this.handleRedemption();
            });
        }
        /**
         * Attach back button listener
         */
        attachBackButtonListener() {
            const backBtn = this.content.querySelector('[data-action="back"]');
            backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener("click", () => {
                this.goBack();
            });
        }
        /**
         * Select a variant
         */
        selectVariant(variantId) {
            var _a;
            if (!this.currentOfferDetail)
                return;
            const variant = (_a = this.currentOfferDetail.offerVariants) === null || _a === void 0 ? void 0 : _a.find((v) => v.id === variantId);
            if (variant) {
                this.selectedVariant = variant;
                // Re-render
                this.content.innerHTML = this.offerDetailView.render(this.currentOfferDetail, this.selectedVariant, this.config);
                this.attachOfferDetailListeners();
            }
        }
        /**
         * Switch tab
         */
        switchTab(tabName) {
            // Remove active class from all tabs and panes
            this.content.querySelectorAll(".me-agent-tab").forEach((tab) => {
                tab.classList.remove("active");
            });
            this.content.querySelectorAll(".me-agent-tab-pane").forEach((pane) => {
                pane.classList.remove("active");
            });
            // Add active class to selected tab and pane
            const selectedTab = this.content.querySelector(`[data-tab="${tabName}"]`);
            const selectedPane = this.content.querySelector(`[data-pane="${tabName}"]`);
            selectedTab === null || selectedTab === void 0 ? void 0 : selectedTab.classList.add("active");
            selectedPane === null || selectedPane === void 0 ? void 0 : selectedPane.classList.add("active");
        }
    }

    /**
     * Offer Service
     * Business logic for offer management
     */
    /**
     * Offer Service
     * Handles offer fetching, caching, and business logic
     */
    class OfferService {
        constructor(offerAPI) {
            this.offerAPI = offerAPI;
            this.offerCache = new Map();
        }
        /**
         * Get offer details (with caching)
         */
        getOfferDetail(offerCode_1, sessionId_1) {
            return __awaiter(this, arguments, void 0, function* (offerCode, sessionId, useCache = true) {
                // Check cache first
                if (useCache && this.offerCache.has(offerCode)) {
                    return this.offerCache.get(offerCode);
                }
                // Fetch from API
                const detail = yield this.offerAPI.fetchOfferDetails(offerCode, sessionId);
                // Cache the result
                this.offerCache.set(offerCode, detail);
                return detail;
            });
        }
        /**
         * Get offers by brand ID
         */
        getOffersByBrandId(brandId, token) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.offerAPI.fetchOffersByBrandId(brandId, token);
            });
        }
        /**
         * Clear offer cache
         */
        clearCache() {
            this.offerCache.clear();
        }
        /**
         * Calculate final price after discount
         */
        calculateFinalPrice(originalPrice, discountPercentage) {
            const price = typeof originalPrice === "string"
                ? parseFloat(originalPrice)
                : originalPrice;
            const discount = typeof discountPercentage === "string"
                ? parseFloat(discountPercentage)
                : discountPercentage;
            return price * (1 - discount / 100);
        }
    }

    /**
     * Brand Service
     * Business logic for brand and category management
     */
    /**
     * Brand Service
     * Handles brand fetching and business logic
     */
    class BrandService {
        constructor(brandAPI, offerAPI) {
            this.brandAPI = brandAPI;
            this.offerAPI = offerAPI;
        }
        /**
         * Get brands by category ID
         */
        getBrandsByCategory(categoryId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.brandAPI.fetchBrandsByCategoryId(categoryId);
            });
        }
        /**
         * Get brands with their offers for a category
         * Filters out brands with no offers
         */
        getBrandsWithOffers(categoryId, token) {
            return __awaiter(this, void 0, void 0, function* () {
                // Fetch all brands for the category
                const brands = yield this.brandAPI.fetchBrandsByCategoryId(categoryId);
                // Fetch offers for each brand in parallel
                const brandsWithOffers = yield Promise.all(brands.map((brand) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const offers = yield this.offerAPI.fetchOffersByBrandId(brand.id, token);
                        return { brand, offers };
                    }
                    catch (error) {
                        console.error(`Error fetching offers for brand ${brand.id}:`, error);
                        return { brand, offers: [] };
                    }
                })));
                // Filter out brands with no offers
                return brandsWithOffers.filter((item) => item.offers.length > 0);
            });
        }
        /**
         * Generate signup link for a brand
         */
        generateSignupLink(brand, callbackUrl) {
            const baseUrl = brand.shopifyStoreUrl || brand.websiteUrl || "";
            if (!baseUrl)
                return "#";
            const url = new URL(baseUrl);
            url.searchParams.append("meprotocol_callback", callbackUrl);
            return url.toString();
        }
        /**
         * Format conversion rate display
         */
        formatConversionRate(brand) {
            const { rewardSymbol, rewardValueInDollars } = brand.rewardDetails.rewardInfo;
            const dollars = parseFloat(rewardValueInDollars || "0");
            return `1 ${rewardSymbol} = $${dollars.toFixed(2)}`;
        }
        /**
         * Get reward amount display text
         */
        getRewardAmountText(brand) {
            const rule = brand.rewardDetails.rules[0];
            if (!rule)
                return "N/A";
            const { points } = rule;
            const { rewardSymbol } = brand.rewardDetails.rewardInfo;
            return `${points.toLocaleString()} ${rewardSymbol}`;
        }
    }

    /**
     * Chat Popup Component
     */
    class ChatPopup {
        constructor(position, onSendMessage, onClose, apiClient, sessionId, config, redemptionService) {
            this.welcomeElement = null;
            this.isMaximized = false;
            this.currentOffers = [];
            this.sessionId = "";
            this.redemptionService = null;
            this.position = position;
            this.onSendMessage = onSendMessage;
            this.onClose = onClose;
            this.apiClient = apiClient;
            this.sessionId = sessionId;
            this.config = config;
            this.redemptionService = redemptionService || null;
            // Initialize services
            this.offerService = new OfferService(apiClient.offerAPI);
            this.brandService = new BrandService(apiClient.brandAPI, apiClient.offerAPI);
            // Initialize detail panel controller
            if (!this.redemptionService) {
                throw new Error("RedemptionService is required for DetailPanelController");
            }
            this.detailPanelController = new DetailPanelController(config, this.offerService, this.brandService, this.redemptionService, () => this.hideDetailPanel());
            this.element = this.create();
            this.messagesContainer = this.element.querySelector(".me-agent-messages");
            this.inputElement = this.element.querySelector(".me-agent-input");
            this.sendButton = this.element.querySelector(".me-agent-send-button");
            this.maximizeButton = this.element.querySelector(".me-agent-maximize-button");
            // Mount detail panel inside chat - controller provides its own wrapper
            this.element.appendChild(this.detailPanelController.getElement());
            this.setupEventListeners();
        }
        /**
         * Create the chat popup element
         */
        create() {
            const chat = document.createElement("div");
            chat.className = `me-agent-chat ${this.position}`;
            chat.innerHTML = `
      <div class="me-agent-chat-content">
        <div class="me-agent-chat-header">
          <div class="me-agent-chat-title-container">
            ${getChatIcon({
            width: 20,
            height: 20,
            className: "me-agent-chat-icon",
            color: "#999999",
        })}
            <h3 class="me-agent-chat-title">Chats</h3>
          </div>
          <div class="me-agent-header-buttons">
            <button class="me-agent-maximize-button" aria-label="Maximize chat">
              <span class="me-agent-maximize-icon">${getMaximizeIcon({
            width: 16,
            height: 16,
        })}</span>
              <span class="me-agent-minimize-icon" style="display:none;">${getMinimizeIcon({ width: 16, height: 16 })}</span>
            </button>
            <button class="me-agent-close-button" aria-label="Close chat">${getCloseIcon({ width: 20, height: 20 })}</button>
          </div>
        </div>
        <div class="me-agent-messages"></div>
        <div class="me-agent-input-container">
          <div class="me-agent-input-content">
            <input 
              type="text" 
              class="me-agent-input" 
              placeholder="Ask or search anything..."
              aria-label="Message input"
            />
            <button class="me-agent-send-button" aria-label="Send message">${getSendIcon({ width: 18, height: 18 })}</button>
          </div>
        </div>
      </div>
    `;
            return chat;
        }
        /**
         * Setup event listeners
         */
        setupEventListeners() {
            // Close button
            const closeButton = this.element.querySelector(".me-agent-close-button");
            closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener("click", this.onClose);
            // Maximize button
            this.maximizeButton.addEventListener("click", () => this.toggleMaximize());
            // Send button
            this.sendButton.addEventListener("click", () => this.handleSend());
            // Enter key to send
            this.inputElement.addEventListener("keypress", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSend();
                }
            });
            // Monitor input changes to enable/disable send button
            this.inputElement.addEventListener("input", () => {
                this.updateSendButtonState();
            });
            // Set initial send button state
            this.updateSendButtonState();
        }
        /**
         * Update send button state based on input value
         */
        updateSendButtonState() {
            const hasText = this.inputElement.value.trim().length > 0;
            this.sendButton.disabled = !hasText;
        }
        /**
         * Handle send message
         */
        handleSend() {
            const message = this.inputElement.value.trim();
            if (message) {
                this.hideWelcome(); // Remove quick actions when user sends a message
                this.onSendMessage(message);
                this.inputElement.value = "";
                this.updateSendButtonState(); // Disable button after clearing input
            }
        }
        /**
         * Show welcome message with quick actions
         */
        showWelcome() {
            this.welcomeElement = document.createElement("div");
            this.welcomeElement.className =
                "me-agent-message assistant me-agent-welcome-message";
            const quickActions = [
                {
                    id: "search",
                    label: "Search for an offer",
                    value: "Search for an offer",
                    icon: "search",
                },
                {
                    id: "offers",
                    label: "Earn a reward",
                    value: "Earn a reward",
                    icon: "offers",
                },
                { id: "rewards", label: "My rewards", value: "My rewards", icon: "tags" },
            ];
            // Avatar
            const avatarDiv = document.createElement("div");
            avatarDiv.className = "me-agent-message-avatar-wrapper";
            avatarDiv.innerHTML = getAssistantAvatarIcon({
                width: 32,
                height: 32,
                className: "me-agent-message-avatar",
            });
            // Content wrapper
            const contentWrapper = document.createElement("div");
            contentWrapper.className = "me-agent-message-content-wrapper";
            // Message content
            const contentDiv = document.createElement("div");
            contentDiv.className = "me-agent-message-content";
            contentDiv.innerHTML = `
      <div>👋</div>
      <div>Hi there! Welcome, I am Meely. How would you like me to help you today?</div>
    `;
            // Quick actions
            const actionsContainer = QuickActionsComponent.create(quickActions, (action) => {
                // Hide only the quick actions, not the entire message
                actionsContainer.remove();
                this.onSendMessage(action.value);
            });
            contentWrapper.appendChild(contentDiv);
            contentWrapper.appendChild(actionsContainer);
            this.welcomeElement.appendChild(avatarDiv);
            this.welcomeElement.appendChild(contentWrapper);
            this.messagesContainer.appendChild(this.welcomeElement);
        }
        /**
         * Hide welcome message (but keep the message, just remove quick actions)
         */
        hideWelcome() {
            if (this.welcomeElement) {
                // Just hide the quick actions, keep the welcome message visible
                const actionsContainer = this.welcomeElement.querySelector(".me-agent-quick-actions");
                if (actionsContainer) {
                    actionsContainer.remove();
                }
            }
        }
        /**
         * Add a message to the chat
         */
        addMessage(message) {
            const messageElement = MessageComponent.create(message, (offerCode) => {
                this.handleOfferClick(offerCode);
            });
            this.messagesContainer.appendChild(messageElement);
            this.scrollToBottom();
        }
        /**
         * Show loading indicator
         */
        showLoading() {
            const loadingElement = MessageComponent.createLoading();
            this.messagesContainer.appendChild(loadingElement);
            this.scrollToBottom();
            return loadingElement;
        }
        /**
         * Remove loading indicator
         */
        removeLoading() {
            const loadingElement = this.messagesContainer.querySelector('[data-loading="true"]');
            if (loadingElement) {
                loadingElement.remove();
            }
        }
        /**
         * Update last message content (for streaming)
         */
        updateLastMessage(content) {
            const messages = this.messagesContainer.querySelectorAll(".me-agent-message.assistant");
            const lastMessage = messages[messages.length - 1];
            if (lastMessage) {
                MessageComponent.updateContent(lastMessage, content, (offerCode) => {
                    this.handleOfferClick(offerCode);
                });
                this.scrollToBottom();
            }
        }
        /**
         * Scroll to bottom of messages
         */
        scrollToBottom() {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
        /**
         * Toggle maximize/minimize
         */
        toggleMaximize() {
            this.isMaximized = !this.isMaximized;
            if (this.isMaximized) {
                // Maximizing
                this.element.classList.add("maximized");
                const maximizeIcon = this.maximizeButton.querySelector(".me-agent-maximize-icon");
                const minimizeIcon = this.maximizeButton.querySelector(".me-agent-minimize-icon");
                maximizeIcon.style.display = "none";
                minimizeIcon.style.display = "block";
                this.maximizeButton.setAttribute("aria-label", "Restore chat");
                // Scroll to bottom after animation
                setTimeout(() => this.scrollToBottom(), 300);
            }
            else {
                // Minimizing - hide detail panel first
                this.hideDetailPanel();
                // Trigger slide out animation
                this.element.classList.add("minimizing");
                const maximizeIcon = this.maximizeButton.querySelector(".me-agent-maximize-icon");
                const minimizeIcon = this.maximizeButton.querySelector(".me-agent-minimize-icon");
                // Wait for slide out animation to complete
                setTimeout(() => {
                    // Remove maximized state and minimizing class
                    this.element.classList.remove("maximized");
                    this.element.classList.remove("minimizing");
                    // Temporarily remove visible class to prepare for slide-in animation
                    this.element.classList.remove("visible");
                    // Update icons
                    maximizeIcon.style.display = "block";
                    minimizeIcon.style.display = "none";
                    this.maximizeButton.setAttribute("aria-label", "Maximize chat");
                    // Trigger slide-in animation from bottom
                    setTimeout(() => {
                        this.element.classList.add("visible");
                        setTimeout(() => this.scrollToBottom(), 100);
                    }, 50);
                }, 300);
            }
        }
        /**
         * Show the chat popup
         */
        show() {
            this.element.classList.add("visible");
            this.inputElement.focus();
        }
        /**
         * Hide the chat popup
         */
        hide() {
            this.element.classList.remove("visible");
            this.hideDetailPanel(); // Hide detail panel when closing chat
            if (this.isMaximized) {
                this.toggleMaximize(); // Reset to normal size when closing
            }
        }
        /**
         * Set loading state for input
         */
        setLoading(loading) {
            this.inputElement.disabled = loading;
            this.sendButton.disabled = loading;
        }
        /**
         * Clear all messages
         */
        clearMessages() {
            this.messagesContainer.innerHTML = "";
            this.showWelcome();
        }
        /**
         * Show offer preview card - appends to the last assistant message
         */
        showOfferPreview(offers) {
            // Create preview card with its own offers bound to the click handler
            const previewCard = OfferPreviewCard.create(offers, () => this.showDetailPanel(offers));
            // Find the last assistant message and append the card to its content wrapper
            const messages = this.messagesContainer.querySelectorAll(".me-agent-message.assistant");
            const lastMessage = messages[messages.length - 1];
            if (lastMessage) {
                MessageComponent.appendToMessage(lastMessage, previewCard);
            }
            else {
                // Fallback: append to messages container if no assistant message found
                this.messagesContainer.appendChild(previewCard);
            }
            this.scrollToBottom();
        }
        /**
         * Show brand preview card - appends to the last assistant message
         */
        showBrandPreview(brands) {
            // Convert brands to CardListItem format
            const brandItems = brands.slice(0, 10).map((brand) => ({
                id: brand.id,
                title: brand.name,
                image: brand.logoUrl ||
                    `https://via.placeholder.com/40x40?text=${brand.name.charAt(0)}`,
            }));
            // Create card list
            const brandCard = CardList.create({
                title: "List of brands that offer sign up rewards",
                items: brandItems,
                actionLabel: "View All",
                onAction: () => this.showBrandsDetail(brands),
            });
            // Find the last assistant message and append the card to its content wrapper
            const messages = this.messagesContainer.querySelectorAll(".me-agent-message.assistant");
            const lastMessage = messages[messages.length - 1];
            if (lastMessage) {
                MessageComponent.appendToMessage(lastMessage, brandCard);
            }
            else {
                // Fallback: append to messages container if no assistant message found
                this.messagesContainer.appendChild(brandCard);
            }
            this.scrollToBottom();
        }
        /**
         * Show brands detail panel with full list
         */
        showBrandsDetail(brands) {
            if (this.isMaximized) {
                this.detailPanelController.showBrandList(brands);
                this.element.classList.add("has-detail-panel");
            }
            else {
                this.toggleMaximize();
                // Wait for maximize animation
                setTimeout(() => {
                    this.detailPanelController.showBrandList(brands);
                    this.element.classList.add("has-detail-panel");
                }, 300);
            }
        }
        /**
         * Show category preview with card list
         */
        showCategoryPreview(categories) {
            const categoryItems = categories
                .slice(0, 10)
                .map((category) => ({
                id: category.categoryId,
                title: category.title || category.categoryName,
                image: category.image ||
                    `https://via.placeholder.com/40x40?text=${(category.title || category.categoryName).charAt(0)}`,
            }));
            const categoryCard = CardList.create({
                title: "List of category that offer purchase rewards",
                items: categoryItems,
                actionLabel: "View All",
                onAction: () => this.showCategoriesDetail(categories),
            });
            const messages = this.messagesContainer.querySelectorAll(".me-agent-message.assistant");
            const lastMessage = messages[messages.length - 1];
            if (lastMessage) {
                MessageComponent.appendToMessage(lastMessage, categoryCard);
            }
            else {
                this.messagesContainer.appendChild(categoryCard);
            }
            this.scrollToBottom();
        }
        /**
         * Show categories detail panel with grid
         */
        showCategoriesDetail(categories) {
            if (this.isMaximized) {
                this.detailPanelController.showCategoryGrid(categories);
                this.element.classList.add("has-detail-panel");
            }
            else {
                this.toggleMaximize();
                // Wait for maximize animation
                setTimeout(() => {
                    this.detailPanelController.showCategoryGrid(categories);
                    this.element.classList.add("has-detail-panel");
                }, 300);
            }
        }
        /**
         * Show ways to earn quick actions
         */
        showWaysToEarnActions() {
            const actions = [
                {
                    id: "sign_up_brand",
                    label: "Sign up for a brand",
                    value: "Sign up for a brand",
                    icon: "user",
                },
                {
                    id: "purchase_brand",
                    label: "Purchase from a brand",
                    value: "Purchase from a brand",
                    icon: "money",
                },
            ];
            const quickActionsElement = QuickActionsComponent.create(actions, (action) => {
                // Send the action label as a message
                this.onSendMessage(action.label);
            });
            // Find the last assistant message and append the quick actions
            const messages = this.messagesContainer.querySelectorAll(".me-agent-message.assistant");
            const lastMessage = messages[messages.length - 1];
            if (lastMessage) {
                MessageComponent.appendToMessage(lastMessage, quickActionsElement);
            }
            else {
                // Fallback: append to messages container if no assistant message found
                this.messagesContainer.appendChild(quickActionsElement);
            }
            this.scrollToBottom();
        }
        /**
         * Show detail panel with offers
         */
        showDetailPanel(offers) {
            // Store the offers that are being displayed
            this.currentOffers = offers;
            // Auto-maximize when showing offers
            if (!this.isMaximized) {
                this.toggleMaximize();
            }
            this.element.classList.add("has-detail-panel");
            this.detailPanelController.showOfferGrid(offers, this.sessionId);
            this.detailPanelController.show();
        }
        /**
         * Hide detail panel
         */
        hideDetailPanel() {
            this.element.classList.remove("has-detail-panel");
            this.detailPanelController.hide();
        }
        /**
         * Handle offer click
         */
        handleOfferClick(offerCode) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Maximize widget if not already maximized
                    if (!this.isMaximized) {
                        this.toggleMaximize();
                    }
                    // Show the detail panel with offer details
                    this.element.classList.add("has-detail-panel");
                    yield this.detailPanelController.showOfferDetail(offerCode, this.sessionId);
                }
                catch (error) {
                    console.error("Error fetching offer details:", error);
                    alert("Failed to load offer details. Please try again.");
                }
            });
        }
        /**
         * Mount the chat to the DOM
         */
        mount() {
            document.body.appendChild(this.element);
        }
        /**
         * Remove the chat from the DOM
         */
        unmount() {
            this.element.remove();
        }
        /**
         * Get the chat element
         */
        getElement() {
            return this.element;
        }
        // ============================================
        // Dev Mode Helper Methods
        // ============================================
        /**
         * Show offer detail (for dev mode)
         */
        devShowOfferDetail(offerCode, sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                // Maximize if not already
                if (!this.isMaximized) {
                    this.toggleMaximize();
                    yield new Promise((resolve) => setTimeout(resolve, 300));
                }
                // Show detail panel
                this.element.classList.add("has-detail-panel");
                yield this.detailPanelController.showOfferDetail(offerCode, sessionId);
                // Show chat
                this.show();
            });
        }
        /**
         * Show brand list (for dev mode)
         */
        devShowBrandList() {
            // For now, we'll need sample data or fetch from API
            console.warn("Dev: Brand list requires data - use AI chat to trigger");
        }
        /**
         * Show category grid (for dev mode)
         */
        devShowCategoryGrid() {
            // For now, we'll need sample data or fetch from API
            console.warn("Dev: Category grid requires data - use AI chat to trigger");
        }
    }

    /**
     * Clash Display Font - Base64 Encoded
     * Auto-generated by scripts/convert-fonts.js
     * DO NOT EDIT MANUALLY
     */
    const clashDisplayFonts = `
  @font-face {
    font-family: 'Clash Display';
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    src: url(data:font/opentype;base64,T1RUTwAMAIAAAwBAQ0ZGIGgyqxMAAAr4AABJqUdERUYjliJOAABUpAAAAU5HUE9TK+FhEAAAVfQAAAkuR1NVQuHw44oAAF8kAAADuE9TLzJX3dEEAAABMAAAAGBjbWFwjgltPgAABogAAARQaGVhZB1JPqEAAADMAAAANmhoZWEJPwZvAAABBAAAACRobXR4i08zlgAAYtwAAAZ8bWF4cAGfUAAAAAEoAAAABm5hbWV39Z8cAAABkAAABPhwb3N0/58AMgAACtgAAAAgAAEAAAABAEK70539Xw889QADA+gAAAAA3DQr5QAAAADclc7p/xj/NAZQA3oAAAAGAAIAAAAAAAAAAQAAA3r/BgBaBrH/GP8YBlAAAQAAAAAAAAAAAAAAAAAAAZ8AAFAAAZ8AAAAEAjABkAAFAAACigJYAAAASwKKAlgAAAFeADIBLAAAAAAAAAAAAAAAAIAAAEcAAAAAAAAAAAAAAABJVEZPAMAADfsEA3r/BgBaA3oA+gAAAJMAAAAAAe4CngAAACAAAwAAAA0AogADAAEECQAAAHAAAAADAAEECQABABoAcAADAAEECQACAA4AigADAAEECQADAD4AmAADAAEECQAEACoA1gADAAEECQAFABoBAAADAAEECQAGACgBGgADAAEECQAHAGABQgADAAEECQAIACYBogADAAEECQALADoByAADAAEECQAMAEICAgADAAEECQANAdwCRAADAAEECQAOADYEIABDAG8AcAB5AHIAaQBnAGgAdAAgADIAMAAyADEAIABJAG4AZABpAGEAbgAgAFQAeQBwAGUAIABGAG8AdQBuAGQAcgB5AC4AIABBAGwAbAAgAHIAaQBnAGgAdABzACAAcgBlAHMAZQByAHYAZQBkAC4AQwBsAGEAcwBoACAARABpAHMAcABsAGEAeQBSAGUAZwB1AGwAYQByADEALgAwADAAMQA7AEkAVABGAE8AOwBDAGwAYQBzAGgARABpAHMAcABsAGEAeQAtAFIAZQBnAHUAbABhAHIAQwBsAGEAcwBoACAARABpAHMAcABsAGEAeQAgAFIAZQBnAHUAbABhAHIAVgBlAHIAcwBpAG8AbgAgADEALgAwADAAMQBDAGwAYQBzAGgARABpAHMAcABsAGEAeQAtAFIAZQBnAHUAbABhAHIAQwBsAGEAcwBoACAAaQBzACAAYQAgAHQAcgBhAGQAZQBtAGEAcgBrACAAbwBmACAAdABoAGUAIABJAG4AZABpAGEAbgAgAFQAeQBwAGUAIABGAG8AdQBuAGQAcgB5AC4ASQBuAGQAaQBhAG4AIABUAHkAcABlACAARgBvAHUAbgBkAHIAeQBoAHQAdABwAHMAOgAvAC8AaQBuAGQAaQBhAG4AdAB5AHAAZQBmAG8AdQBuAGQAcgB5AC4AYwBvAG0AaAB0AHQAcABzADoALwAvAHcAdwB3AC4AaQBuAGQAaQBhAG4AdAB5AHAAZQBmAG8AdQBuAGQAcgB5AC4AYwBvAG0AVABoAGkAcwAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABpAHMAIABwAHIAbwB0AGUAYwB0AGUAZAAgAHUAbgBkAGUAcgAgAGQAbwBtAGUAcwB0AGkAYwAgAGEAbgBkACAAaQBuAHQAZQByAG4AYQB0AGkAbwBuAGEAbAAgAHQAcgBhAGQAZQBtAGEAcgBrACAAYQBuAGQAIABjAG8AcAB5AHIAaQBnAGgAdAAgAGwAYQB3AC4AIABZAG8AdQAgAGEAZwByAGUAZQAgAHQAbwAgAGkAZABlAG4AdABpAGYAeQAgAHQAaABlACAASQBUAEYAIABmAG8AbgB0AHMAIABiAHkAIABuAGEAbQBlACAAYQBuAGQAIABjAHIAZQBkAGkAdAAgAHQAaABlACAASQBUAEYAJwBzACAAbwB3AG4AZQByAHMAaABpAHAAIABvAGYAIAB0AGgAZQAgAHQAcgBhAGQAZQBtAGEAcgBrAHMAIABhAG4AZAAgAGMAbwBwAHkAcgBpAGcAaAB0AHMAIABpAG4AIABhAG4AeQAgAGQAZQBzAGkAZwBuACAAbwByACAAcAByAG8AZAB1AGMAdABpAG8AbgAgAGMAcgBlAGQAaQB0AHMALgBoAHQAdABwAHMAOgAvAC8AZgBvAG4AdABzAGgAYQByAGUALgBjAG8AbQAvAHQAZQByAG0AcwAAAAIAAAADAAAAFAADAAEAAAAUAAQEPAAAAGAAQAAFACAADQAvADkAXwB+AKMApwCrAK4AswC3ATcBSAF+AZIB/wIbAjcDBAMIAwwDEgMoAzUDOB6FHr0e8x75IBQgGiAeICIgJiAwIDogRCBwIHQgrCC5ISIiEiJIImAiZfsE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Y2lyY3VtZmxleFNjZWRpbGxhU2NvbW1hYWNjZW50VGNvbW1hYWNjZW50VGNhcm9uVXRpbGRlVW1hY3JvblVicmV2ZVVyaW5nVWh1bmdhcnVtbGF1dFVvZ29uZWtXY2lyY3VtZmxleFdncmF2ZVdhY3V0ZVdkaWVyZXNpc1ljaXJjdW1mbGV4WWdyYXZlWmFjdXRlWmRvdGFjY2VudEFFYWN1dGVPc2xhc2hhY3V0ZURjcm9hdEhiYXJJSkxkb3RFbmdUYmFyYW1hY3JvbmFicmV2ZWFvZ29uZWtjYWN1dGVjZG90YWNjZW50Y2Nhcm9uZGNhcm9uZW1hY3JvbmVicmV2ZWVkb3RhY2NlbnRlb2dvbmVrZWNhcm9uZl9iZl9mZl9mX2JmX2ZfaGZfZl9pZl9mX2pmX2Zfa2ZfZl9sZl9oZl9qZl9rZ2NpcmN1bWZsZXhnYnJldmVnZG90YWNjZW50Z2NvbW1hYWNjZW50aGNpcmN1bWZsZXhpdGlsZGVpbWFjcm9uaWJyZXZlaW9nb25la2pjaXJjdW1mbGV4a2NvbW1hYWNjZW50bGFjdXRlbGNvbW1hYWNjZW50bGNhcm9ubmFjdXRlbmNvbW1hYWNjZW50bmNhcm9ub21hY3Jvbm9icmV2ZW9odW5nYXJ1bWxhdXRyYWN1dGVyY29tbWFhY2NlbnRyY2Fyb25zYWN1dGVzY2lyY3VtZmxleHNjZWRpbGxhc2NvbW1hYWNjZW50dGNvbW1hYWNjZW50dGNhcm9udXRpbGRldW1hY3JvbnVicmV2ZXVyaW5ndWh1bmdhcnVtbGF1dHVvZ29uZWt3Y2lyY3VtZmxleHdncmF2ZXdhY3V0ZXdkaWVyZXNpc3ljaXJjdW1mbGV4eWdyYXZlemFjdXRlemRvdGFjY2VudGFlYWN1dGVvc2xhc2hhY3V0ZWRjcm9hdGhiYXJpamxkb3Rlbmd0YmFyYXBwcm94ZXF1YWxub3RlcXVhbGxlc3NlcXVhbGdyZWF0ZXJlcXVhbEV0aWxkZVl0aWxkZWV0aWxkZXl0aWxkZWZfdHRfdENjaXJjdW1mbGV4SGNpcmN1bWZsZXhUY2VkaWxsYWNjaXJjdW1mbGV4ZG90bGVzc2p0Y2VkaWxsYWQuY29tcG9uZW50aC5jb21wb25lbnR6ZXJvLnN1cGVyaW9yZm91ci5zdXBlcmlvcnNvZnRoeXBoZW5uYnNwYWNlQ1IubnVsbEV1cm9pbmRpYW5ydXBlZWRpZXJlc2lzY29tYmRvdGFjY2VudGNvbWJncmF2ZWNvbWJhY3V0ZWNvbWJodW5nYXJ1bWxhdXRjb21iY2Fyb25jb21iLmFsdGNpcmN1bWZsZXhjb21iY2Fyb25jb21iYnJldmVjb21icmluZ2NvbWJ0aWxkZWNvbWJtYWNyb25jb21iY29tbWF0dXJuZWRhYm92ZWNvbWJjb21tYWFjY2VudGNvbWJjZWRpbGxhY29tYm9nb25la2NvbWJzdHJva2VzaG9ydGNvbWJzbGFzaHNob3J0Y29tYnNsYXNobG9uZ2NvbWJkaWVyZXNpc2NvbWIuY2FzZWRvdGFjY2VudGNvbWIuY2FzZWdyYXZlY29tYi5jYXNlYWN1dGVjb21iLmNhc2VodW5nYXJ1bWxhdXRjb21iLmNhc2VjYXJvbmNvbWIuYWx0LmNhc2VjaXJjdW1mbGV4Y29tYi5jYXNlY2Fyb25jb21iLmNhc2VicmV2ZWNvbWIuY2FzZXJpbmdjb21iLmNhc2V0aWxkZWNvbWIuY2FzZW1hY3JvbmNvbWIuY2FzZWNvbW1hYWNjZW50Y29tYi5jYXNlY2VkaWxsYWNvbWIuY2FzZW9nb25la2NvbWIuY2FzZXN0cm9rZXNob3J0Y29tYi5jYXNlc3Ryb2tlbG9uZ2NvbWIuY2FzZXNsYXNoc2hvcnRjb21iLmNhc2VzbGFzaGxvbmdjb21iLmNhc2VJVEYxLjFDbGFzaCBpcyBhIHRyYWRlbWFyayBvZiB0aGUgSW5kaWFuIFR5cGUgRm91bmRyeS5Db3B5cmlnaHQgMjAyMSBJbmRpYW4gVHlwZSBGb3VuZHJ5LiBBbGwgcmlnaHRzIHJlc2VydmVkLkNsYXNoIERpc3BsYXkgUmVndWxhckNsYXNoIERpc3BsYXlOb3JtYWwAAAEAIgAArgAAqwEAsAAArQAArwABhwIAIwEAsQABigIAJQABjQAAJgAAtQAAsgIBjgQAJwEBkwMAKQEAuQAAtgIBlwQAKwABnAAALAABnQAALQABngIALgEAugABoQIAMAAAvgAAuwEAvwAAvQABpAIAMQIBpwIANAABqgIAwAABrQAANQABrgEANgAAxAAAwQIBsAUANwEBtgMAOQEA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AAACYAAAAmYCeAAAAmwCcgAAAngAAAMCAAAAAAL2AAACfgAAAAAChAAAAooAAAKQA+AAAAKWA+wAAAKcAAADsAAAAAACogAAAqgAAAAAAq4CtAK6AAACwALGAAACzAAAAAAC0gAAA5IAAAAAAvYC2AL8At4C5ALqAAAC8AAAAAAC9gAAAvwAAAAAA1YAAAMCAAAAAAMIAAADDgAAAAADFAAAAxoAAAMgAyYDLAMyAzgAAAM+AAADRAAAAAADSgAAA1AAAAAAA1YAAANcAAAAAANiAAADaAAAAAADbgAAA3QAAAAAAAAAAAAAAAADegOAAAADhgOMAAAD4AAAA5IAAAAAA5gAAAOeAAAAAAOkA6oDsAAAA7YDvAAAA8IDyAAAA84AAAPUAAAAAAYaAAAD2gAAAAAD4AAABI4AAAPmAAAAAAAAA+wAAAPyAAAEZAAAAAAD+AP+BAQAAAQKBBAAAAQWAAAAAAQcAAAEjgAAAAAEggQiBCgELgQ0BDoAAARAAAAAAARGAAAETAAAAAAEUgAABFgAAAAABF4AAARkAAAAAARqBHAEdgAABHwEggSIBI4ElAAABKYAAASsAAAAAASaAAAEoAAAAAAEpgAABKwAAAAABLIAAAS4AAAAAAS+AAAExAAAAAAEygAABNAAAAAABNYAAATcBOIAAAToAAAE7gAAAAAE9AT6BQAAAAUGBQwAAAUSAAAFGAABAWYCngABAWYAAAABAscAAAABAWICngABAXEAAAABAXQCngABAWcAAAABAKUBTwABATAAAAABAjkAAAABAToCngABAUcAAAABAVsCngABAVsAAAABAVsCGwABAF8AAAABAhACngABAVECngABAUgAAAABAGACngABAXoB7gABARoAAAABAKMBiwABAbsCngABAbsAAAABAWACngABAtgCngABAqEACgABAXIBTwABAT0CngABAT0AAAABAXYCngABAXYAAAABAToAAAABATICngABATcAAAABAUICngABATEAAAABAUIBbgABAWUCngABArYCngABAWUAAAABAakAAAABAVUCngABAVUAAAABAgMCngABAgMAAAABAVYCngABAVYAAAABAUQCngABAUQAAAABAUsCngABAUsAAAABAn8BTwABARoB7gABARUAAAABAfEAAAABAUUAAAABATEB7gABATIAAAABAWoCGQABAn0B7gABATQAAAABAWsBUQABASAB7gABASAAAAABAWQAAAABALICGQABALIAAAABATP/0QABAF8CngABAG8CLAABAIMAAAABARUB7gABAGECngABANcB7gABAF0AAAABAFgBmAABAeMB7gABAeMAAAABATAB7gABAkkB7gABAS4AAAABAYUAAwABASgA9wABAUIB7gABAUIAAAABASkB7gABASkAAAABAQcB7gABAF4AAAABAQQB7gABARAAAAABAIMCZAABAQUCPQABAQoAAAABAL8A9wABAS4B7gABAkoB7gABAS8AAAABAiMAAAABAawB7gABAawAAAABASEB7gABASEAAAABARgB7gABARv/1AABARQB7gABARQAAAABAeYB7gABAeQAAAABAFwB7gABAFwAAAABAH8AAAABAGAB7gABAGAAAAABAUAB7gABAmsB7gABAUAAAAABAbYCNAABAGcCngABATUAAAABALwCNAAGABAAAQAKAAAAAQAMAAwAAQAYADwAAQAEAYUBhgGXAZgABAAAABIAAAAeAAAAGAAAAB4AAQCLAAAAAQCFAAAAAQCJAAAABAAKABYAEAAWAAEAi/84AAEAhf84AAEAif80AAYAEAABAAoAAQABAAwADAABAC4BGgACAAUAqwCrAAABeAF8AAEBfgGEAAYBiwGPAA0BkQGWABIAGAAAAGIAAABoAAAAbgAAAHQAAAB6AAAAgAAAAIYAAACGAAAAjAAAAJIAAACYAAAAngAAAKQAAACqAAAAsAAAALYAAAC8AAAAwgAAAMgAAADOAAAA1AAAANoAAADgAAAA5gABASwB7gABAK0B7gABAFAB7gABAKcB7gABAJsB7gABAOkB7gABAPIB7gABAKgB7gABAIgB7gABALwB7gABALQB7gABAVQB7gABAK0CngABAFACngABAKYCngABAJwCngABAOkCngABAPICngABAPUCngABAKgCngABAIgCngABALsCngABALQCngAYADIAOAA+AEQASgBQAFYAVgBcAGIAaABuAHQAegCAAIYAjACSAJgAngCkAKoAsAC2AAEBLAK2AAEArQKmAAEAUAKmAAEApwKyAAEAmwKyAAEA6QKyAAEA8gKyAAEAqAKsAAEAiALQAAEAvAK0AAEAtAKLAAEBVAKyAAEArQNQAAEAUANQAAEApgNWAAEAnANWAAEA6QNWAAEA8gNcAAEA9QNcAAEAqANJAAEAiAN6AAEAuwNeAAEAtAM2AAAAAQAAAAoAcgDuAAJERkxUAA5sYXRuABIAFAAAABAAAk1PTCAAJlJPTSAAPgAA//8ACAAAAAEAAgADAAQABwAIAAkAAP//AAkAAAABAAIAAwAEAAUABwAIAAkAAP//AAkAAAABAAIAAwAEAAYABwAIAAkACmFhbHQAPmNhc2UARmRsaWcATGZyYWMAUmxpZ2EAWGxvY2wAXmxvY2wAZG9yZG4AanNhbHQAcHN1cHMAdgAAAAIAAAABAAAAAQALAAAAAQAJAAAAAQAFAAAAAQAKAAAAAQACAAAAAQADAAAAAQAGAAAAAQAIAAAAAQAEAAwAGgCUALAAsADSAOoBRAGMAa4B0AHwAoQAAQAAAAEACAACADoAGgBQANkBawFsAW0BbgFvAFIA2wGLAYwBjQGOAY8BkQGTAZQBlQGWAZcBmAGZAZoBnAGdAZAAAQAaAE4A1wEKAQsBDAENAQ4BZAFoAXgBeQF6AXsBfAF+AYABgQGCAYMBhQGGAYcBiAGJAYoBkgADAAAAAQAIAAEADgABAAgAAgF9AZIAAQABAX8AAQAAAAEACAACAA4ABABQANkAUgDbAAEABABOANcBZAFoAAEAAAABAAgAAQAGAGEAAgABAQoBDgAAAAQAAAABAAgAAQBKAAIACgA0AAQACgASABoAIgEUAAMBSQEOARUAAwFJAQwBFAADATIBDgEVAAMBMgEMAAIABgAOARYAAwFJAQ4BFgADATIBDgABAAIBCwENAAYAAAACAAoAJAADAAEALAABABIAAAABAAAABwABAAIAAQB9AAMAAQASAAEAHAAAAAEAAAAHAAIAAQEKARMAAAABAAIAPADFAAEAAAABAAgAAgAOAAQA+AD5APgA+QABAAQAAQA8AH0AxQADAAAAAQAIAAEAEgACAAoADgABAX0AAQGQAAEAAgF/AZIABAAAAAEACAABABIAAQAIAAEABAFhAAIA2gABAAEA2gAEAAAAAQAIAAEAhgABAAgADgAeACYALgA2AD4ARgBOAFQAWgBgAGYAbAByAHgAnAADAJkAhwCdAAMAmQCsAJ4AAwCZAK4AnwADAJkAtwCgAAMAmQC5AKEAAwCZALsAmgACAIcAmwACAJkAogACAKwAowACAK4ApAACALcApQACALkApgACALsBYAACANoAAQABAJkAAQAAAAEACAACACgAEQGLAYwBjQGOAY8BkQGSAZMBlAGVAZYBlwGYAZkBmgGcAZ0AAgADAXgBfAAAAX4BgwAFAYUBigALAvQAQQLMAAUCzAAFAswABQLMAAUCzAAFAswABQLMAAUCzAAFAswABQLMAAUCiQA0AsQAIwLEACMCxAAjAsQAIwLEACMCzQA+As0APgJgADwCYAA8AmAAPAJgADwCYAA8AmAAPAJgADwCYAA8AmAAPAJgADwCVQA8AtYAIwLWACMC1gAjAtYAIwLWACMCtQA8AL4APAC+/6UAvgA7AL7/tgC+/+oAvv/PAL7/2AC+/90AvgAGAL4APAJoABkCaAAZAqIAPAKiADwCQAA8AkAAPAJAADwCQAA8A3UAPALAADwCwAA8AsAAPALAADwCwAA8AuwAIwLsACMC7AAjAuwAIwLsACMC7AAjAuwAIwLsACMC7AAjAngAPALsACMCkAA8ApAAPAKQADwCkAA8AmsAHwJrAB8CawAfAmsAHwJrAB8CawAfAoQACwKEAAsChAALAsoANwLKADcCygA3AsoANwLKADcCygA3AsoANwLKADcCygA3AsoANwLKADcCq//9BAYAEAQGABAEBgAQBAYAEAQGABACqgAFAoj//AKI//wCiP/8Aoj//AKI//wClQAkApUAJAKVACQClQAkBEf//gRH//4C/QAKAuwAIwLsACMCewA8Av0ACgK1/98DJgA8AkAAPAJzAAoCwAA8BDUAIwKEAAsCKgAiAioAIgIqACICKgAiAioAIgIqACICKgAiAioAIgIqACICKgAiAmYAPAJBACMCQQAjAkEAIwJBACMCQQAjAmYAGwKVABsCQAAjAkAAIwJAACMCQAAjAkAAIwJAACMCQAAjAkAAIwJAACMCQAAjAXcAEAPdABAC1QAQBTsAEAUzABADkwAQA5UAEAT/ABADkwAQA9QAEAI1ABACNgAQA6EAEAI1ABACZwAjAmcAIwJnACMCZwAjAmcAIwJeADwCXv+1AL4APAC4/6UAuAA3ALj/swC4/+cAuP/LALj/1QC4/9oAvgAGAMD/xQDA/7cCKwA8AisAPAC+ADwAvgA8AL7/3gD2ADwDxAA8AlsAPAJbADwCWwA8AlsAPAJbADwCXQAiAl0AIgJdACICXQAiAl0AIgJdACICXQAiAl0AIgJdACICZgA8AmYAGwHpADwB6QA8Aen/3wHpADwCEgAjAhIAIwISACMCEgAjAhIAIwISACMBfQAHAX0ABwFuAAcCXgA5Al4AOQJeADkCXgA5Al4AOQJeADkCXgA5Al4AOQJeADkCXgA5Al4AOQJDAAoDVwAKA1cACgNXAAoDVwAKA1cACgJDAAkCNQAFAjUABQI1AAUCNQAFAjUABQIpABoCKQAaAikAGgIpABoA1QAjAOUAIwJpADIDxgAeA8YAHgJf//4CXQAiAl0AIgJfADQCfwAbAl3/+QF+ADwA7wA8ASD/9gJMADQEFQAiAX0ABwHq//YCswAjASoACgJkACkCewAjAqQAGQJ6ACUCogAqAiYACgKEABoCogAqAr0ADwL0AA8DAgAXAXwACgFMAB4B0gAeAusAHgEXACoA8AA8AQ8AFAD1AB0BHgAdASIAEgD2//0BEAAOAJQAHgEeAB4A9QAPAJQAHQEeAB0A9QAeALAALAD/ABsDQgAUAxoAGQKjAA0AgAAbAWUAGQCUAB0AlAAeAYr/7ACUAB4AlAAdAjkACgNyAA0BjP/sAKMAJQCjACUCKgANAeUAFAHlABQBBwAbAhAAJQSdABkB0AAlAckAHQHQACUByQAlALoAPAIoAEMB0QAlAcYAPAHfAC4AsP8YAdAAJQHxACUB0AAlAckAHgHJACUCawAfAjIAIwJ2AB4CkgABAdUADwCnADIB9AAVAvkAGwGGABQA6gAaAoIAFAIrAAUAuAAAAmAAPAKI//wCQAAjAjUABQLQABAC0AAHAsQAIwK1ADwChAALAkEAIwC4ADgAwP/FAX0ABwJ/ABsCXQBCAYsAFADqAAYBZgAcAXAAGwF/AAoCWAAeAeUADwHlAB4AuAAAAlgAAAJYAAACigAKAmYALQFaADgAnwAsAUD/8AFAAHYBvgBwAfQA1wHfAEkB3wBJAVAAJgEQACUBdQArAWgALQJnAQoBAAANAPsAagD2AC4CfwB8ATQAAAJMACYBWgA4AJ8ALAFA/+sBQAB4Ab4AZQI+APMB5wBJAecATAFQACYBEAAfAXUAKgFoAC0BAAAcAPsAWwD2ACwC+wCxAwoACgJ2AGwC7AAnBrEAYQ==) format('opentype');
  }

  @font-face {
    font-family: 'Clash Display';
    font-weight: 500;
    font-style: normal;
    font-display: swap;
    src: url(data:font/opentype;base64,T1RUTwAMAIAAAwBAQ0ZGIMWT+zsAAAsYAABKZUdERUYjliJOAABVgAAAAU5HUE9THn98fQAAVtAAAAkiR1NVQuHw44oAAF/0AAADuE9TLzJYQdEcAAABMAAAAGBjbWFwjgltPgAABqgAAARQaGVhZB0+PpkAAADMAAAANmhoZWEJNAZXAAABBAAAACRobXR4rTYr3wAAY6wAAAZ8bWF4cAGfUAAAAAEoAAAABm5hbWWAhaddAAABkAAABRZwb3N0/58AMgAACvgAAAAgAAEAAAABAELGSsFJXw889QADA+gAAAAA3DQr5QAAAADclc7s/xj/KQZFA3oAAAAGAAIAAAAAAAAAAQAAA3r/BgBaBpr/GP8XBkUAAQAAAAAAAAAAAAAAAAAAAZ8AAFAAAZ8AAAAEAkUB9AAFAAACigJYAAAASwKKAlgAAAFeADIBLAAAAAAAAAAAAAAAAIAAAEcAAAAAAAAAAAAAAABJVEZPAMAADfsEA3r/BgBaA3oA+gAAAJMAAAAAAfECngAAACAAAwAAAA8AugADAAEECQAAAHAAAAADAAEECQABACgAcAADAAEECQACAA4AmAADAAEECQADADwApgADAAEECQAEACgAcAADAAEECQAFABoA4gADAAEECQAGACYA/AADAAEECQAHAGABIgADAAEECQAIACYBggADAAEECQALADoBqAADAAEECQAMAEIB4gADAAEECQANAdwCJAADAAEECQAOADYEAAADAAEECQAQABoENgADAAEECQARAAwEUABDAG8AcAB5AHIAaQBnAGgAdAAgADIAMAAyADEAIABJAG4AZABpAGEAbgAgAFQAeQBwAGUAIABGAG8AdQBuAGQAcgB5AC4AIABBAGwAbAAgAHIAaQBnAGgAdABzACAAcgBlAHMAZQByAHYAZQBkAC4AQwBsAGEAcwBoACAARABpAHMAcABsAGEAeQAgAE0AZQBkAGkAdQBtAFIAZQBnAHUAbABhAHIAMQAuADAAMAAxADsASQBUAEYATwA7AEMAbABhAHMAaABEAGkAcwBwAGwAYQB5AC0ATQBlAGQAaQB1AG0AVgBlAHIAcwBpAG8AbgAgADEALgAwADAAMQBDAGwAYQBzAGgARABpAHMAcABsAGEAeQAtAE0AZQBkAGkAdQBtAEMAbABhAHMAaAAgAGkAcwAgAGEAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG8AZgAgAHQAaABlACAASQBuAGQAaQBhAG4AIABUAHkAcABlACAARgBvAHUAbgBkAHIAeQAuAEkAbgBkAGkAYQBuACAAVAB5AHAAZQAgAEYAbwB1AG4AZAByAHkAaAB0AHQAcABzADoALwAvAGkAbgBkAGkAYQBuAHQAeQBwAGUAZgBvAHUAbgBkAHIAeQAuAGMAbwBtAGgAdAB0AHAAcwA6AC8ALwB3AHcAdwAuAGkAbgBkAGkAYQBuAHQAeQBwAGUAZgBvAHUAbgBkAHIAeQAuAGMAbwBtAFQAaABpAHMAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAaQBzACAAcAByAG8AdABlAGMAdABlAGQAIAB1AG4AZABlAHIAIABkAG8AbQBlAHMAdABpAGMAIABhAG4AZAAgAGkAbgB0AGUAcgBuAGEAdABpAG8AbgBhAGwAIAB0AHIAYQBkAGUAbQBhAHIAawAgAGEAbgBkACAAYwBvAHAAeQByAGkAZwBoAHQAIABsAGEAdwAuACAAWQBvAHUAIABhAGcAcgBlAGUAIAB0AG8AIABpAGQAZQBuAHQAaQBmAHkAIAB0AGgAZQAgAEkAVABGACAAZgBvAG4AdABzACAAYgB5ACAAbgBhAG0AZQAgAGEAbgBkACAAYwByAGUAZABpAHQAIAB0AGgAZQAgAEkAVABGACcAcwAgAG8AdwBuAGUAcgBzAGgAaQBwACAAbwBmACAAdABoAGUAIAB0AHIAYQBkAGUAbQBhAHIAawBzACAAYQBuAGQAIABjAG8AcAB5AHIAaQBnAGgAdABzACAAaQBuACAAYQBuAHkAIABkAGUAcwBpAGcAbgAgAG8AcgAgAHAAcgBvAGQAdQBjAHQAaQBvAG4AIABjAHIAZQBkAGkAdABzAC4AaAB0AHQAcABzADoALwAvAGYAbwBuAHQAcwBoAGEAcgBlAC4AYwBvAG0ALwB0AGUAcgBtAHMAQwBsAGEAcwBoACAARABpAHMAcABsAGEAeQBNAGUAZABpAHUAbQAAAAAAAgAAAAMAAAAUAAMAAQAAABQABAQ8AAAAYABAAAUAIAANAC8AOQBfAH4AowCnAKsArgCzALcBNwFIAX4BkgH/AhsCNwMEAwgDDAMSAygDNQM4HoUevR7zHvkgFCAa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Y3V0ZVJjb21tYWFjY2VudFJjYXJvblNhY3V0ZVNjaXJjdW1mbGV4U2NlZGlsbGFTY29tbWFhY2NlbnRUY29tbWFhY2NlbnRUY2Fyb25VdGlsZGVVbWFjcm9uVWJyZXZlVXJpbmdVaHVuZ2FydW1sYXV0VW9nb25la1djaXJjdW1mbGV4V2dyYXZlV2FjdXRlV2RpZXJlc2lzWWNpcmN1bWZsZXhZZ3JhdmVaYWN1dGVaZG90YWNjZW50QUVhY3V0ZU9zbGFzaGFjdXRlRGNyb2F0SGJhcklKTGRvdEVuZ1RiYXJhbWFjcm9uYWJyZXZlYW9nb25la2NhY3V0ZWNkb3RhY2NlbnRjY2Fyb25kY2Fyb25lbWFjcm9uZWJyZXZlZWRvdGFjY2VudGVvZ29uZWtlY2Fyb25mX2JmX2ZmX2ZfYmZfZl9oZl9mX2lmX2ZfamZfZl9rZl9mX2xmX2hmX2pmX2tnY2lyY3VtZmxleGdicmV2ZWdkb3RhY2NlbnRnY29tbWFhY2NlbnRoY2lyY3VtZmxleGl0aWxkZWltYWNyb25pYnJldmVpb2dvbmVramNpcmN1bWZsZXhrY29tbWFhY2NlbnRsYWN1dGVsY29tbWFhY2NlbnRsY2Fyb25uYWN1dGVuY29tbWFhY2NlbnRuY2Fyb25vbWFjcm9ub2JyZXZlb2h1bmdhcnVtbGF1dHJhY3V0ZXJjb21tYWFjY2VudHJjYXJvbnNhY3V0ZXNjaXJjdW1mbGV4c2NlZGlsbGFzY29tbWFhY2NlbnR0Y29tbWFhY2NlbnR0Y2Fyb251dGlsZGV1bWFjcm9udWJyZXZldXJpbmd1aHVuZ2FydW1sYXV0dW9nb25la3djaXJjdW1mbGV4d2dyYXZld2FjdXRld2RpZXJlc2lzeWNpcmN1bWZsZXh5Z3JhdmV6YWN1dGV6ZG90YWNjZW50YWVhY3V0ZW9zbGFzaGFjdXRlZGNyb2F0aGJhcmlqbGRvdGVuZ3RiYXJhcHByb3hlcXVhbG5vdGVxdWFsbGVzc2VxdWFsZ3JlYXRlcmVxdWFsRXRpbGRlWXRpbGRlZXRpbGRleXRpbGRlZl90dF90Q2NpcmN1bWZsZXhIY2lyY3VtZmxleFRjZWRpbGxhY2NpcmN1bWZsZXhkb3RsZXNzanRjZWRpbGxhZC5jb21wb25lbnRoLmNvbXBvbmVudHplcm8uc3VwZXJpb3Jmb3VyLnN1cGVyaW9yc29mdGh5cGhlbm5ic3BhY2VDUi5udWxsRXVyb2luZGlhbnJ1cGVlZGllcmVzaXNjb21iZG90YWNjZW50Y29tYmdyYXZlY29tYmFjdXRlY29tYmh1bmdhcnVtbGF1dGNvbWJjYXJvbmNvbWIuYWx0Y2lyY3VtZmxleGNvbWJjYXJvbmNvbWJicmV2ZWNvbWJyaW5nY29tYnRpbGRlY29tYm1hY3JvbmNvbWJjb21tYXR1cm5lZGFib3ZlY29tYmNvbW1hYWNjZW50Y29tYmNlZGlsbGFjb21ib2dvbmVrY29tYnN0cm9rZXNob3J0Y29tYnNsYXNoc2hvcnRjb21ic2xhc2hsb25nY29tYmRpZXJlc2lzY29tYi5jYXNlZG90YWNjZW50Y29tYi5jYXNlZ3JhdmVjb21iLmNhc2VhY3V0ZWNvbWIuY2FzZWh1bmdhcnVtbGF1dGNvbWIuY2FzZWNhcm9uY29tYi5hbHQuY2FzZWNpcmN1bWZsZXhjb21iLmNhc2VjYXJvbmNvbWIuY2FzZWJyZXZlY29tYi5jYXNlcmluZ2NvbWIuY2FzZXRpbGRlY29tYi5jYXNlbWFjcm9uY29tYi5jYXNlY29tbWFhY2NlbnRjb21iLmNhc2VjZWRpbGxhY29tYi5jYXNlb2dvbmVrY29tYi5jYXNlc3Ryb2tlc2hvcnRjb21iLmNhc2VzdHJva2Vsb25nY29tYi5jYXNlc2xhc2hzaG9ydGNvbWIuY2FzZXNsYXNobG9uZ2NvbWIuY2FzZUlURjEuMUNsYXNoIGlzIGEgdHJhZGVtYXJrIG9mIHRoZSBJbmRpYW4gVHlwZSBGb3VuZHJ5LkNvcHlyaWdodCAyMDIxIEluZGlhbiBUeXBlIEZvdW5kcnkuIEFsbCByaWdodHMgcmVzZXJ2ZWQuQ2xhc2ggRGlzcGxheSBNZWRpdW1DbGFzaCBEaXNwbGF5AAABACIAAK4AAKsBALAAAK0AAK8AAYcCACMBALEAAYoCACUAAY0AACYAALUAALICAY4EACcBAZMDACkBALkAALYCAZcEACsAAZwAACwAAZ0AAC0AAZ4CAC4BALoAAaECADAAAL4AALsBAL8AAL0AAaQCADECAacCADQAAaoCAMAAAa0AADUAAa4B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HzFOBg6pMPsCT1tKHoTZkgernZrQyQuV956BFfcF18Tonx+S+yDuC05KHoDZlAe2pZvJypp8b3EL+1wV9xH3Fvspiyz7FgUO+CEVyq+rzYYKdYOHC/eFB/S1y/cK8rhjJx77ogv3SeX7Sfc0IPs0+0gx90gL9y/RSftA+0BFSfsvH/taC0J4ma4fkz2AB0fDXfcKHgsW94oH9wC8w/cB8rVcLh4LFbLqk4uyLOb7YAX7oAYO/Fz3OvfqFfcv+xz7LwcL++MV+M35MiKL/M39MgUL+UYV+wn7Fvcbi+L3FgUL9xUF9xH7A/sRB6P7FQULWXqdrh6VPYAHQ8Zb4R4LMU7kBsetq768aatPH3YLFc9QB3KClZqXkpeYmx8LAAAAAAEAAgAOAAAAAAAAARQAAgArAAEAAQABAAsADAABABEAEQABABMAEwABAB0AHgABACMAJAABAC4ALgABADAAMAABADIAMgABADYANwABADwAPAABAEUARwABAEsASwABAFEAUQABAFQAVAABAF8AYAABAGUAZgABAGsAawABAG8AbwABAH0AfQABAIcAiAABAI0AjQABAI8AjwABAJkAmQABAKcApwABAKsAqwADAKwArAABAK4ArgABALkAuQABALsAuwABAL8AwAABAMUAxQABAM4A0AABANQA1AABANoA2gABAN0A3QABAOgA6QABAO4A7wABAPQA9AABAPsA+wABAWYBZwABAWkBagABAXgBnQADAAEAAgAAAAwAAAAYAAEABAGFAYYBlwGYAAIABQCrAKsAAAF4AXwAAQF+AYQABgGLAY8ADQGRAZYAEgAAAAEAAAAKADYAUgACREZMVAAObGF0bgASABQAAAAQAAJNT0wgABBST00gABAAAP//AAIAAAABAAJtYXJrAA5ta21rABQAAAABAAAAAAACAAEAAgADAAgGjgbwAAQAAAABAAgAAQAMABwABQCSAWYAAgACAKsAqwAAAXgBnQABAAEAOQABAAsADAARABMAHQAeACMAJAAuADAAMgA2ADcAPABFAEYARwBLAFEAVABfAGAAZQBmAGsAbwB9AIcAiACNAI8AmQCnAKwArgC5ALsAvwDAAMUAzgDPANAA1ADaAN0A6ADpAO4A7wD0APsBZgFnAWkBagAnAAAG6AAABu4AAAb0AAAG+gAABwAAAAcGAAEHDAAA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AkwAHgJMAB4CTAAeAkwAHgJMAB4CTAAeAkwAHgGAAA0D9wANAu8ADQVnAA0FXAANA8AADQPBAA0FMQANA8AADQPsAA0CUAANAlEADQPCAA0CUAANAnQAHgJ0AB4CdAAeAnQAHgJ0AB4CbAAyAmz/pgDQADIA1f+OANUAMgDV/6kA1f/aANX/xwDV/9YA1f/aANAACwDR/9AA0f+nAkIAMgJCADIA0AAyANAAMgDQ/8sBOgAyA9AAMgJnADICZwAyAmcAMgJnADICZwAyAmEAHAJhABwCYQAcAmEAHAJhABwCYQAcAmEAHAJhABwCYQAcAncAMgJ3ABkB+wAyAfsAMgH7/8wB+wAyAiEAHQIhAB0CIQAdAiEAHQIhAB0CIQAdAYoABQGKAAUBbQAFAmwAMQJsADECbAAxAmwAMQJsADECbAAxAmwAMQJsADECbAAxAmwAMQJsADECYAAFA3EABQNxAAUDcQAFA3EABQNxAAUCWQADAk8AAAJPAAACTwAAAk8AAAJPAAACMQAXAjEAFwIxABcCMQAXANoAHgDiAB4ChwAyA8kAGQPJABkCfAAFAmEAHAJhABwCcgAtApYAGQJ8//sBoQAyASwAMgFD//YCXQAtBA4AHAGKAAUCBP/2AsAAHgFMAAoCcwAhAosAHgKyABQClgAjArAAIgI5AAoCkwAXArAAIgLqABQDGAAUAy8AGQF8AAoBegAeAgQAHgNbAB4BLQAjAQsAMgExABQBBwAeAX8AHgFCABkBFwACATMAEQDEAB4BfwAeAPoAFADEAB4BfwAeAPoAHgDnAC8BSQAZA1EAFAMjABQCwQAPAKEAGQF1ABQAxAAeAMQAHgGv/+wAxAAeAMQAHgJTAAoDfgAPAbP/7ADPACMAzwAjAkkADwH8ABQB/AAUASgAGQKHACMEpwAUAeYAIwHhABwB5gAjAeEAIwDJADICMQA4AecAIwHbADIB8AAqANL/GAHmACMCCwAjAeYAIwHhAB4B4QAjAn8AHAJDAB4CjwAeAsAAAQHnABQAyAAyAg8AFQL+ABkBkgAUAOsAFQKxABQCKwAKAKsAAAJsADICrP/5AkwAHgJPAAAC5AANAuQABQLXAB4CxgAyApMADAJNAB4A1QA1ANH/0AGKAAUClgAZAnwARwGUABQA8QAHAXAAGgF7ABkBggAKAlgAHgHqABQB6gAeAKsAAAJYAAACWAAAApEACgJkACgBewAtALkAJwFp/9sBaQB5AgMAYgH0AMcB8AA4AfAAOAFoACQBDwAiAZ4ALQGMADICdAD1ATEAFgEUAHAA+wArApYAiwFXAAACUgAbAXsALQC5ACcBaf/ZAWkAegIDAFkCSwDiAfUAOAH1ADoBaAAkAQ8AFwGeACsBjAAyATEAHgEUAGQA+wAnAw8AsQMgAAoCiABtAvcAGwaaAFY=) format('opentype');
  }

  @font-face {
    font-family: 'Clash Display';
    font-weight: 600;
    font-style: normal;
    font-display: swap;
    src: url(data:font/opentype;base64,T1RUTwAMAIAAAwBAQ0ZGICvBEn8AAAsoAABKAUdERUYjliJOAABVLAAAAU5HUE9TRYdp/AAAVnwAAAk6R1NVQuHw44oAAF+4AAADuE9TLzJYpdE4AAABMAAAAGBjbWFwjgltPgAABrgAAARQaGVhZB0wPowAAADMAAAANmhoZWEJJgY8AAABBAAAACRobXR41YIjGAAAY3AAAAZ8bWF4cAGfUAAAAAEoAAAABm5hbWWCmakNAAABkAAABSZwb3N0/58AMgAACwgAAAAgAAEAAAABAEJWkMc1Xw889QADA+gAAAAA3DQr5QAAAADclc7u/xj/GwY3A3kAAAAGAAIAAAAAAAAAAQAAA3r/BgBaBn//GP8XBjcAAQAAAAAAAAAAAAAAAAAAAZ8AAFAAAZ8AAAAEAl0CWAAFAAACigJYAAAASwKKAlgAAAFeADIBLAAAAAAAAAAAAAAAAIAAAEcAAAAAAAAAAAAAAABJVEZPAMAADfsEA3r/BgBaA3oA+gAAAJMAAAAAAfUCngAAACAAAwAAAA8AugADAAEECQAAAHAAAAADAAEECQABACwAcAADAAEECQACAA4AnAADAAEECQADAEAAqgADAAEECQAEACwAcAADAAEECQAFABoA6gADAAEECQAGACoBBAADAAEECQAHAGABLgADAAEECQAIACYBjgADAAEECQALADoBtAADAAEECQAMAEIB7gADAAEECQANAdwCMAADAAEECQAOADYEDAADAAEECQAQABoEQgADAAEECQARABAEXABDAG8AcAB5AHIAaQBnAGgAdAAgADIAMAAyADEAIABJAG4AZABpAGEAbgAgAFQAeQBwAGUAIABGAG8AdQBuAGQAcgB5AC4AIABBAGwAbAAgAHIAaQBnAGgAdABzACAAcgBlAHMAZQByAHYAZQBkAC4AQwBsAGEAcwBoACAARABpAHMAcABsAGEAeQAgAFMAZQBtAGkAYgBvAGwAZABSAGUAZwB1AGwAYQByADEALgAwADAAMQA7AEkAVABGAE8AOwBDAGwAYQBzAGgARABpAHMAcABsAGEAeQAtAFMAZQBtAGkAYgBvAGwAZABWAGUAcgBzAGkAbwBuACAAMQAuADAAMAAxAEMAbABhAHMAaABEAGkAcwBwAGwAYQB5AC0AUwBlAG0AaQBiAG8AbABkAEMAbABhAHMAaAAgAGkAcwAgAGEAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG8AZgAgAHQAaABlACAASQBuAGQAaQBhAG4AIABUAHkAcABlACAARgBvAHUAbgBkAHIAeQAuAEkAbgBkAGkAYQBuACAAVAB5AHAAZQAgAEYAbwB1AG4AZAByAHkAaAB0AHQAcABzADoALwAvAGkAbgBkAGkAYQBuAHQAeQBwAGUAZgBvAHUAbgBkAHIAeQAuAGMAbwBtAGgAdAB0AHAAcwA6AC8ALwB3AHcAdwAuAGkAbgBkAGkAYQBuAHQAeQBwAGUAZgBvAHUAbgBkAHIAeQAuAGMAbwBtAFQAaABpAHMAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAaQBzACAAcAByAG8AdABlAGMAdABlAGQAIAB1AG4AZABlAHIAIABkAG8AbQBlAHMAdABpAGMAIABhAG4AZAAgAGkAbgB0AGUAcgBuAGEAdABpAG8AbgBhAGwAIAB0AHIAYQBkAGUAbQBhAHIAawAgAGEAbgBkACAAYwBvAHAAeQByAGkAZwBoAHQAIABsAGEAdwAuACAAWQBvAHUAIABhAGcAcgBlAGUAIAB0AG8AIABpAGQAZQBuAHQAaQBmAHkAIAB0AGgAZQAgAEkAVABGACAAZgBvAG4AdABzACAAYgB5ACAAbgBhAG0AZQAgAGEAbgBkACAAYwByAGUAZABpAHQAIAB0AGgAZQAgAEkAVABGACcAcwAgAG8AdwBuAGUAcgBzAGgAaQBwACAAbwBmACAAdABoAGUAIAB0AHIAYQBkAGUAbQBhAHIAawBzACAAYQBuAGQAIABjAG8AcAB5AHIAaQBnAGgAdABzACAAaQBuACAAYQBuAHkAIABkAGUAcwBpAGcAbgAgAG8AcgAgAHAAcgBvAGQAdQBjAHQAaQBvAG4AIABjAHIAZQBkAGkAdABzAC4AaAB0AHQAcABzADoALwAvAGYAbwBuAHQAcwBoAGEAcgBlAC4AYwBvAG0ALwB0AGUAcgBtAHMAQwBsAGEAcwBoACAARABpAHMAcABsAGEAeQBTAGUAbQBpAGIAbwBsAGQAAAAAAAIAAAADAAAAFAADAAEAAAAUAAQEPAAAAGAAQAAFACAADQAvADkAXwB+AKMApwCrAK4AswC3ATcBSAF+AZIB/wIbAjcDBAMIAwwDEgMo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YnJldmVPaHVuZ2FydW1sYXV0UmFjdXRlUmNvbW1hYWNjZW50UmNhcm9uU2FjdXRlU2NpcmN1bWZsZXhTY2VkaWxsYVNjb21tYWFjY2VudFRjb21tYWFjY2VudFRjYXJvblV0aWxkZVVtYWNyb25VYnJldmVVcmluZ1VodW5nYXJ1bWxhdXRVb2dvbmVrV2NpcmN1bWZsZXhXZ3JhdmVXYWN1dGVXZGllcmVzaXNZY2lyY3VtZmxleFlncmF2ZVphY3V0ZVpkb3RhY2NlbnRBRWFjdXRlT3NsYXNoYWN1dGVEY3JvYXRIYmFySUpMZG90RW5nVGJhcmFtYWNyb25hYnJldmVhb2dvbmVrY2FjdXRlY2RvdGFjY2VudGNjYXJvbmRjYXJvbmVtYWNyb25lYnJldmVlZG90YWNjZW50ZW9nb25la2VjYXJvbmZfYmZfZmZfZl9iZl9mX2hmX2ZfaWZfZl9qZl9mX2tmX2ZfbGZfaGZfamZfa2djaXJjdW1mbGV4Z2JyZXZlZ2RvdGFjY2VudGdjb21tYWFjY2VudGhjaXJjdW1mbGV4aXRpbGRlaW1hY3JvbmlicmV2ZWlvZ29uZWtqY2lyY3VtZmxleGtjb21tYWFjY2VudGxhY3V0ZWxjb21tYWFjY2VudGxjYXJvbm5hY3V0ZW5jb21tYWFjY2VudG5jYXJvbm9tYWNyb25vYnJldmVvaHVuZ2FydW1sYXV0cmFjdXRlcmNvbW1hYWNjZW50cmNhcm9uc2FjdXRlc2NpcmN1bWZsZXhzY2VkaWxsYXNjb21tYWFjY2VudHRjb21tYWFjY2VudHRjYXJvbnV0aWxkZXVtYWNyb251YnJldmV1cmluZ3VodW5nYXJ1bWxhdXR1b2dvbmVrd2NpcmN1bWZsZXh3Z3JhdmV3YWN1dGV3ZGllcmVzaXN5Y2lyY3VtZmxleHlncmF2ZXphY3V0ZXpkb3RhY2NlbnRhZWFjdXRlb3NsYXNoYWN1dGVkY3JvYXRoYmFyaWpsZG90ZW5ndGJhcmFwcHJveGVxdWFsbm90ZXF1YWxsZXNzZXF1YWxncmVhdGVyZXF1YWxFdGlsZGVZdGlsZGVldGlsZGV5dGlsZGVmX3R0X3RDY2lyY3VtZmxleEhjaXJjdW1mbGV4VGNlZGlsbGFjY2lyY3VtZmxleGRvdGxlc3NqdGNlZGlsbGFkLmNvbXBvbmVudGguY29tcG9uZW50emVyby5zdXBlcmlvcmZvdXIuc3VwZXJpb3Jzb2Z0aHlwaGVubmJzcGFjZUNSLm51bGxFdXJvaW5kaWFucnVwZWVkaWVyZXNpc2NvbWJkb3RhY2NlbnRjb21iZ3JhdmVjb21iYWN1dGVjb21iaHVuZ2FydW1sYXV0Y29tYmNhcm9uY29tYi5hbHRjaXJjdW1mbGV4Y29tYmNhcm9uY29tYmJyZXZlY29tYnJpbmdjb21idGlsZGVjb21ibWFjcm9uY29tYmNvbW1hdHVybmVkYWJvdmVjb21iY29tbWFhY2NlbnRjb21iY2VkaWxsYWNvbWJvZ29uZWtjb21ic3Ryb2tlc2hvcnRjb21ic2xhc2hzaG9ydGNvbWJzbGFzaGxvbmdjb21iZGllcmVzaXNjb21iLmNhc2Vkb3RhY2NlbnRjb21iLmNhc2VncmF2ZWNvbWIuY2FzZWFjdXRlY29tYi5jYXNlaHVuZ2FydW1sYXV0Y29tYi5jYXNlY2Fyb25jb21iLmFsdC5jYXNlY2lyY3VtZmxleGNvbWIuY2FzZWNhcm9uY29tYi5jYXNlYnJldmVjb21iLmNhc2VyaW5nY29tYi5jYXNldGlsZGVjb21iLmNhc2VtYWNyb25jb21iLmNhc2Vjb21tYWFjY2VudGNvbWIuY2FzZWNlZGlsbGFjb21iLmNhc2VvZ29uZWtjb21iLmNhc2VzdHJva2VzaG9ydGNvbWIuY2FzZXN0cm9rZWxvbmdjb21iLmNhc2VzbGFzaHNob3J0Y29tYi5jYXNlc2xhc2hsb25nY29tYi5jYXNlSVRGMS4xQ2xhc2ggaXMgYSB0cmFkZW1hcmsgb2YgdGhlIEluZGlhbiBUeXBlIEZvdW5kcnkuQ29weXJpZ2h0IDIwMjEgSW5kaWFuIFR5cGUgRm91bmRyeS4gQWxsIHJpZ2h0cyByZXNlcnZlZC5DbGFzaCBEaXNwbGF5IFNlbWlib2xkQ2xhc2ggRGlzcGxheVNlbWktYm9sZAAAAQAiAACuAACrAQCwAACtAACvAAGHAgAjAQCxAAGKAgAlAAGNAAAmAAC1AACyAgGOBAAnAQGTAwApAQC5AAC2AgGXBAArAAGcAAAsAAGdAAAtAAGeAgAuAQC6AAGhAgAwAAC+AAC7AQC/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95EH4qWv5uGobDge+5r3Kgvm5VIGfYWRlJOQk5SWH7fCC6r3JAX3Jfsw+yUHq/skBQ4HKJ3NWfcIG/cw4PH3Mvc0C/jEFfsW9xb7a4v3TPsWBQv3HMJk+zX7NVRk+xwf+0ELFbTzlou0I8r7JgX7bwYOBqqYhndyfIdYUn+TpB+SC/wy93P32xX3QvtV+0IHC/hGFcqvqs4fugoO9xb7AuH7NftA+wIm+zQL4L203x/3U/tW+0PgegcLfH5+kZN6Hm2YBZlrcJMLAAAAAAEAAgAOAAAAAAAAARQAAgArAAEAAQABAAsADAABABEAEQABABMAEwABAB0AHgABACMAJAABAC4ALgABADAAMAABADIAMgABADYANwABADwAPAABAEUARwABAEsASwABAFEAUQABAFQAVAABAF8AYAABAGUAZgABAGsAawABAG8AbwABAH0AfQABAIcAiAABAI0AjQABAI8AjwABAJkAmQABAKcApwABAKsAqwADAKwArAABAK4ArgABALkAuQABALsAuwABAL8AwAABAMUAxQABAM4A0AABANQA1AABANoA2gABAN0A3QABAOgA6QABAO4A7wABAPQA9AABAPsA+wABAWYBZwABAWkBagABAXgBnQADAAEAAgAAAAwAAAAYAAEABAGFAYYBlwGYAAIABQCrAKsAAAF4AXwAAQF+AYQABgGLAY8ADQGRAZYAEgAAAAEAAAAKADYAUgACREZMVAAObGF0bgASABQAAAAQAAJNT0wgABBST00gABAAAP//AAIAAAABAAJtYXJrAA5ta21rABQAAAABAAAAAAACAAEAAgADAAgGpgcIAAQAAAABAAgAAQAMABwABQCSAXIAAgACAKsAqwAAAXgBnQABAAEAOQABAAsADAARABMAHQAeACMAJAAuADAAMgA2ADcAPABFAEYARwBLAFEAVABfAGAAZQBmAGsAbwB9AIcAiACNAI8AmQCnAKwArgC5ALsAvwDAAMUAzgDPANAA1ADaAN0A6ADpAO4A7wD0APsBZgFnAWkBagAnAAAHAAAABwYAAAcMAAAHEgAABxgAAAceAAEAngAAByQAAAckAAAHKgAABzAAAAc2AAAHPAAAB0IAAgY4AAIGRAADAKQABACqAAQAsAAEALYAAAdIAAAHTgAAB1QAAAdaAAAHYAABALwAAAdmAAAHbAAA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Ap4AAQDnAp4AAQDbAp4AGAAyADgAPgBEAEoAUABWAFYAXABiAGgAbgB0AHoAgACGAIwAkgCYAJ4ApACqALAAtgABAT0CvQABANACtAABAGwCtAABAMwCsgABAM4CsgABASkCsgABAQMCsgABAMICswABAIcC0AABAOsCvQABANsCpwABAUsCsgABANADXgABAGwDXgABAMwDXQABAM0DXQABASkDXQABAQMDXAABAQQDXAABAMIDXwABAIcDeQABAOcDZwABANsDUwAAAAEAAAAKAHIA7gACREZMVAAObGF0bgASABQAAAAQAAJNT0wgACZST00gAD4AAP//AAgAAAABAAIAAwAEAAcACAAJAAD//wAJAAAAAQACAAMABAAFAAcACAAJAAD//wAJAAAAAQACAAMABAAGAAcACAAJAAphYWx0AD5jYXNlAEZkbGlnAExmcmFjAFJsaWdhAFhsb2NsAF5sb2NsAGRvcmRuAGpzYWx0AHBzdXBzAHYAAAACAAAAAQAAAAEACwAAAAEACQAAAAEABQAAAAEACgAAAAEAAgAAAAEAAwAAAAEABgAAAAEACAAAAAEABAAMABoAlACwALAA0gDqAUQBjAGuAdAB8AKEAAEAAAABAAgAAgA6ABoAUADZAWsBbAFtAW4BbwBSANsBiwGMAY0BjgGPAZEBkwGUAZUBlgGXAZgBmQGaAZwBnQGQAAEAGgBOANcBCgELAQwBDQEOAWQBaAF4AXkBegF7AXwBfgGAAYEBggGDAYUBhgGHAYgBiQGKAZIAAwAAAAEACAABAA4AAQAIAAIBfQGSAAEAAQF/AAEAAAABAAgAAgAOAAQAUADZAFIA2wABAAQATgDXAWQBaAABAAAAAQAIAAEABgBhAAIAAQEKAQ4AAAAEAAAAAQAIAAEASgACAAoANAAEAAoAEgAaACIBFAADAUkBDgEVAAMBSQEMARQAAwEyAQ4BFQADATIBDAACAAYADgEWAAMBSQEOARYAAwEyAQ4AAQACAQsBDQAGAAAAAgAKACQAAwABACwAAQASAAAAAQAAAAcAAQACAAEAfQADAAEAEgABABwAAAABAAAABwACAAEBCgETAAAAAQACADwAxQABAAAAAQAIAAIADgAEAPgA+QD4APkAAQAEAAEAPAB9AMUAAwAAAAEACAABABIAAgAKAA4AAQF9AAEBkAABAAIBfwGSAAQAAAABAAgAAQASAAEACAABAAQBYQACANoAAQABANoABAAAAAEACAABAIYAAQAIAA4AHgAmAC4ANgA+AEYATgBUAFoAYABmAGwAcgB4AJwAAwCZAIcAnQADAJkArACeAAMAmQCuAJ8AAwCZALcAoAADAJkAuQChAAMAmQC7AJoAAgCHAJsAAgCZAKIAAgCsAKMAAgCuAKQAAgC3AKUAAgC5AKYAAgC7AWAAAgDaAAEAAQCZAAEAAAABAAgAAgAoABEBiwGMAY0BjgGPAZEBkgGTAZQBlQGWAZcBmAGZAZoBnAGdAAIAAwF4AXwAAAF+AYMABQGFAYoACwL0AEEDGP/7Axj/+wMY//sDGP/7Axj/+wMY//sDGP/7Axj/+wMY//sDGP/7ArUAJQLuABkC7gAZAu4AGQLuABkC7gAZAusAMALrADACewAoAnsAKAJ7ACgCewAoAnsAKAJ7ACgCewAoAnsAKAJ7ACgCewAoAncAKAMGABkDBgAZAwYAGQMGABkDBgAZAtoAKADlACgA5f9qAOUAIgDl/5UA5f/BAOX/uQDl/88A5f/SAOUAEgDlACgCiAAPAogADwLJACgCyQAoAmEAKAJhACgCYQAoAmEAKAOiACgC1gAoAtYAKALWACgC1gAoAtYAKAMGABkDBgAZAwYAGQMGABkDBgAZAwYAGQMGABkDBgAZAwYAGQKSACgDBgAZArQAKAK0ACgCtAAoArQAKAKXABUClwAVApcAFQKXABUClwAVApcAFQKkAA4CpAAOAqQADgLZACMC2QAjAtkAIwLZACMC2QAjAtkAIwLZACMC2QAjAtkAIwLZACMC2QAjAvL/+ARFAAsERQALBEUACwRFAAsERQALAvr/+wLY//UC2P/1Atj/9QLY//UC2P/1Aq0AHQKtAB0CrQAdAq0AHQSZ//oEmf/6AywACgMGAAwDBgAMApkAKAMsAAoC2v/aA24AKAJhACgClgAKAtYAKARgABkCpAAOAkYAFQJGABUCRgAVAkYAFQJGABUCRgAVAkYAFQJGABUCRgAVAkYAFQKLACgCWwAZAlsAGQJbABkCWwAZAlsAGQKLABYDAgAWAlgAGQJYABkCWAAZAlgAGQJYABkCWAAZAlgAGQJYABkCWAAZAlgAGQGLAAkEFgAJAw4ACQWaAAkFjAAJA/QACQP0AAkFbAAJA/QACQQJAAkCcAAJAnEACQPpAAkCcAAJAoUAGQKFABkChQAZAoUAGQKFABkCfgAoAn7/kwDlACgA+P9yAPgALAD4/58A+P/LAPj/wgD4/9gA+P/bAOUAEgDm/9sA5v+VAl4AKAJeACgA5QAoAOUAKADl/7UBiQAoA94AKAJ2ACgCdgAoAnYAKAJ2ACgCdgAoAmYAFQJmABUCZgAVAmYAFQJmABUCZgAVAmYAFQJmABUCZgAVAosAKAKLABYCEAAoAhAAKAIQ/7UCEAAoAjIAFgIyABYCMgAWAjIAFgIyABYCMgAWAZkAAgGZAAIBbAACAn4AJwJ+ACcCfgAnAn4AJwJ+ACcCfgAnAn4AJwJ+ACcCfgAnAn4AJwJ+ACcCggAAA5AAAAOQAAADkAAAA5AAAAOQAAACcv/8Am3/+wJt//sCbf/7Am3/+wJt//sCOgATAjoAEwI6ABMCOgATAN8AGQDfABkCqwAyA80AFAPNABQCngANAmYAEAJmABACiQAlArIAFgKh//4BywAoAXQAKAFt//YCcQAlBAUAFQGZAAICI//2As8AGQF0AAoChAAXAp8AGQLCAA8CtwAgAsAAGgJPAAoCpgATAsAAGgMeABkDRAAZA2MAHAF8AAoBsQAeAj4AHgPfAB4BRgAbASsAKAFYABQBHQAeAfEAHgFoACEBPgAJAVwAFQD9AB4B8QAeAP8AGQD9AB4B8QAeAP8AHgEnADMBoQAWA2IAFAMuAA8C5QASAMgAFgGJAA8A/QAeAP0AHgHb/+wA/QAeAP0AHgJxAAoDjAASAeD/7AECACABAgAgAmwAEgIYABQCGAAUAU8AFgMTACAEswAPAf8AIAH9ABsB/wAgAf0AIADaACgCPAAqAgAAIAH0ACgCBAAmAPn/GAH/ACACKgAgAf8AIAH+AB4B/QAgApcAFQJWABkCrQAeAvcAAgH8ABkA7wAyAi4AFAMDABYBngAUAO0ADwLoABQCKgAPAJoAAAJ7ACgC2P/1AlgAGQJt//sC+wAJAvsAAgLuABkC2gAoAqQADgJbABkA+AAxAOb/2wGZAAICsgAWAqEATQGdABQA+gAJAXwAFwGGABYBhgAKAlgAHgHvABkB7wAeAJoAAAJYAAACWAAAApoACgJiACMBoAAeANcAIQGZ/8IBmQB9AlUAUgH0ALMCBAAlAgQAJQGFACEBDQAfAc4AMAG2ADcChQDcAWsAIQEyAHgBAAAnArIAngGBAAACWgAMAaAAHgDXACEBmf/DAZkAfQJVAEkCWgDNAgcAJQIHACYBhQAhAQ0ADQHOAC0BtgA3AWsAIQEyAG8BAAAhAyYAsAM6AAoCngBuAwYADAZ/AEg=) format('opentype');
  }

  @font-face {
    font-family: 'Clash Display';
    font-weight: 700;
    font-style: normal;
    font-display: swap;
    src: url(data:font/opentype;base64,T1RUTwAMAIAAAwBAQ0ZGIB+ZqQgAAArgAABDRUdERUYjliJOAABOKAAAAU5HUE9TOoBn/QAAT3gAAAkQR1NVQuHw44oAAFiIAAADuE9TLzJZCdExAAABMAAAAGBjbWFwjgltPgAABnAAAARQaGVhZB0lPoIAAADMAAAANmhoZWEJGgYjAAABBAAAACRobXR4+QcarAAAXEAAAAZ8bWF4cAGfUAAAAAEoAAAABm5hbWV035wQAAABkAAABOBwb3N0/58AMgAACsAAAAAgAAEAAAABAEJYve2zXw889QADA+gAAAAA3DQr5QAAAADclc7w/xj/DwYrA3kAAQAGAAIAAAAAAAAAAQAAA3r/BgBaBmf/GP8WBisAAQAAAAAAAAAAAAAAAAAAAZ8AAFAAAZ8AAAAEAnMCvAAFAAACigJYAAAASwKKAlgAAAFeADIBLAAAAAAAAAAAAAAAAIAAAEcAAAAAAAAAAAAAAABJVEZPAKAADfsEA3r/BgBaA3oA+gAAAJMAAAAAAfgCngAAACAAAwAAAA0AogADAAEECQAAAHAAAAADAAEECQABABoAcAADAAEECQACAAgAigADAAEECQADADgAkgADAAEECQAEACQAygADAAEECQAFABoA7gADAAEECQAGACIBCAADAAEECQAHAGABKgADAAEECQAIACYBigADAAEECQALADoBsAADAAEECQAMAEIB6gADAAEECQANAdwCLAADAAEECQAOADYECABDAG8AcAB5AHIAaQBnAGgAdAAgADIAMAAyADEAIABJAG4AZABpAGEAbgAgAFQAeQBwAGUAIABGAG8AdQBuAGQAcgB5AC4AIABBAGwAbAAgAHIAaQBnAGgAdABzACAAcgBlAHMAZQByAHYAZQBkAC4AQwBsAGEAcwBoACAARABpAHMAcABsAGEAeQBCAG8AbABkADEALgAwADAAMQA7AEkAVABGAE8AOwBDAGwAYQBzAGgARABpAHMAcABsAGEAeQAtAEIAbwBsAGQAQwBsAGEAcwBoACAARABpAHMAcABsAGEAeQAgAEIAbwBsAGQAVgBlAHIAcwBpAG8AbgAgADEALgAwADAAMQBDAGwAYQBzAGgARABpAHMAcABsAGEAeQAtAEIAbwBsAGQAQwBsAGEAcwBoACAAaQBzACAAYQAgAHQAcgBhAGQAZQBtAGEAcgBrACAAbwBmACAAdABoAGUAIABJAG4AZABpAGEAbgAgAFQAeQBwAGUAIABGAG8AdQBuAGQAcgB5AC4ASQBuAGQAaQBhAG4AIABUAHkAcABlACAARgBvAHUAbgBkAHIAeQBoAHQAdABwAHMAOgAvAC8AaQBuAGQAaQBhAG4AdAB5AHAAZQBmAG8AdQBuAGQAcgB5AC4AYwBvAG0AaAB0AHQAcABzADoALwAvAHcAdwB3AC4AaQBuAGQAaQBhAG4AdAB5AHAAZQBmAG8AdQBuAGQAcgB5AC4AYwBvAG0AVABoAGkAcwAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABpAHMAIABwAHIAbwB0AGUAYwB0AGUAZAAgAHUAbgBkAGUAcgAgAGQAbwBtAGUAcwB0AGkAYwAgAGEAbgBkACAAaQBuAHQAZQByAG4AYQB0AGkAbwBuAGEAbAAgAHQAcgBhAGQAZQBtAGEAcgBrACAAYQBuAGQAIABjAG8AcAB5AHIAaQBnAGgAdAAgAGwAYQB3AC4AIABZAG8AdQAgAGEAZwByAGUAZQAgAHQAbwAgAGkAZABlAG4AdABpAGYAeQAgAHQAaABlACAASQBUAEYAIABmAG8AbgB0AHMAIABiAHkAIABuAGEAbQBlACAAYQBuAGQAIABjAHIAZQBkAGkAdAAgAHQAaABlACAASQBUAEYAJwBzACAAbwB3AG4AZQByAHMAaABpAHAAIABvAGYAIAB0AGgAZQAgAHQAcgBhAGQAZQBtAGEAcgBrAHMAIABhAG4AZAAgAGMAbwBwAHkAcgBpAGcAaAB0AHMAIABpAG4AIABhAG4AeQAgAGQAZQBzAGkAZwBuACAAbwByACAAcAByAG8AZAB1AGMAdABpAG8AbgAgAGMAcgBlAGQAaQB0AHMALgBoAHQAdABwAHMAOgAvAC8AZgBvAG4AdABzAGgAYQByAGUALgBjAG8AbQAvAHQAZQByAG0AcwAAAAIAAAADAAAAFAADAAEAAAAUAAQEPAAAAGAAQAAFACAADQAvADkAXwB+AKMApwCrAK4AswC3ATcBSAF+AZIB/wIbAjcDBAMIAwwDEgMoAzUDOB6FHr0e8x75IBQgGiAeICIgJiAwIDogRCBwIHQgrCC5ISIiEiJIImAiZfsE//8AAAANACAAMAA6AGEAoAClAKkArQCw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dFRjb21tYWFjY2VudFRjYXJvblV0aWxkZVVtYWNyb25VYnJldmVVcmluZ1VodW5nYXJ1bWxhdXRVb2dvbmVrV2NpcmN1bWZsZXhXZ3JhdmVXYWN1dGVXZGllcmVzaXNZY2lyY3VtZmxleFlncmF2ZVphY3V0ZVpkb3RhY2NlbnRBRWFjdXRlT3NsYXNoYWN1dGVEY3JvYXRIYmFySUpMZG90RW5nVGJhcmFtYWNyb25hYnJldmVhb2dvbmVrY2FjdXRlY2RvdGFjY2VudGNjYXJvbmRjYXJvbmVtYWNyb25lYnJldmVlZG90YWNjZW50ZW9nb25la2VjYXJvbmZfYmZfZmZfZl9iZl9mX2hmX2ZfaWZfZl9qZl9mX2tmX2ZfbGZfaGZfamZfa2djaXJjdW1mbGV4Z2JyZXZlZ2RvdGFjY2VudGdjb21tYWFjY2VudGhjaXJjdW1mbGV4aXRpbGRlaW1hY3JvbmlicmV2ZWlvZ29uZWtqY2lyY3VtZmxleGtjb21tYWFjY2VudGxhY3V0ZWxjb21tYWFjY2VudGxjYXJvbm5hY3V0ZW5jb21tYWFjY2VudG5jYXJvbm9tYWNyb25vYnJldmVvaHVuZ2FydW1sYXV0cmFjdXRlcmNvbW1hYWNjZW50cmNhcm9uc2FjdXRlc2NpcmN1bWZsZXhzY2VkaWxsYXNjb21tYWFjY2VudHRjb21tYWFjY2VudHRjYXJvbnV0aWxkZXVtYWNyb251YnJldmV1cmluZ3VodW5nYXJ1bWxhdXR1b2dvbmVrd2NpcmN1bWZsZXh3Z3JhdmV3YWN1dGV3ZGllcmVzaXN5Y2lyY3VtZmxleHlncmF2ZXphY3V0ZXpkb3RhY2NlbnRhZWFjdXRlb3NsYXNoYWN1dGVkY3JvYXRoYmFyaWpsZG90ZW5ndGJhcmFwcHJveGVxdWFsbm90ZXF1YWxsZXNzZXF1YWxncmVhdGVyZXF1YWxFdGlsZGVZdGlsZGVldGlsZGV5dGlsZGVmX3R0X3RDY2lyY3VtZmxleEhjaXJjdW1mbGV4VGNlZGlsbGFjY2lyY3VtZmxleGRvdGxlc3NqdGNlZGlsbGFkLmNvbXBvbmVudGguY29tcG9uZW50emVyby5zdXBlcmlvcmZvdXIuc3VwZXJpb3Jzb2Z0aHlwaGVubmJzcGFjZUNSLm51bGxFdXJvaW5kaWFucnVwZWVkaWVyZXNpc2NvbWJkb3RhY2NlbnRjb21iZ3JhdmVjb21iYWN1dGVjb21iaHVuZ2FydW1sYXV0Y29tYmNhcm9uY29tYi5hbHRjaXJjdW1mbGV4Y29tYmNhcm9uY29tYmJyZXZlY29tYnJpbmdjb21idGlsZGVjb21ibWFjcm9uY29tYmNvbW1hdHVybmVkYWJvdmVjb21iY29tbWFhY2NlbnRjb21iY2VkaWxsYWNvbWJvZ29uZWtjb21ic3Ryb2tlc2hvcnRjb21ic2xhc2hzaG9ydGNvbWJzbGFzaGxvbmdjb21iZGllcmVzaXNjb21iLmNhc2Vkb3RhY2NlbnRjb21iLmNhc2VncmF2ZWNvbWIuY2FzZWFjdXRlY29tYi5jYXNlaHVuZ2FydW1sYXV0Y29tYi5jYXNlY2Fyb25jb21iLmFsdC5jYXNlY2lyY3VtZmxleGNvbWIuY2FzZWNhcm9uY29tYi5jYXNlYnJldmVjb21iLmNhc2VyaW5nY29tYi5jYXNldGlsZGVjb21iLmNhc2VtYWNyb25jb21iLmNhc2Vjb21tYWFjY2VudGNvbWIuY2FzZWNlZGlsbGFjb21iLmNhc2VvZ29uZWtjb21iLmNhc2VzdHJva2VzaG9ydGNvbWIuY2FzZXN0cm9rZWxvbmdjb21iLmNhc2VzbGFzaHNob3J0Y29tYi5jYXNlc2xhc2hsb25nY29tYi5jYXNlSVRGMS4xQ2xhc2ggaXMgYSB0cmFkZW1hcmsgb2YgdGhlIEluZGlhbiBUeXBlIEZvdW5kcnkuQ29weXJpZ2h0IDIwMjEgSW5kaWFuIFR5cGUgRm91bmRyeS4gQWxsIHJpZ2h0cyByZXNlcnZlZC5DbGFzaCBEaXNwbGF5IEJvbGRDbGFzaCBEaXNwbGF5AAABACIAAK4AAKsBALAAAK0AAK8AAYcCACMBALEAAYoCACUAAY0AACYAALUAALICAY4EACcBAZMDACkBALkAALYCAZcEACsAAZwAACwAAZ0AAC0AAZ4CAC4BALoAAaECADAAAL4AALsBAL8AAL0AAaQCADECAacCADQAAaoCAMAAAa0AADUAAa4BADYAAMQAAMECAbAFADcBAbYDADkBAMUAAboAAMYAAbsAADsAAbwBAMcAAIoAAb4AAJoAAI0AAb8AAJ0A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ApMAFAKNAB4Cjf+DAPgAHgEX/1oBFwAmARf/lQEX/70BF/++ARf/2gEX/9wA+AAYAPj/5gD4/4UCdgAeAnYAHgD4AB4A+AAeAPj/ogHPAB4D6gAeAoMAHgKDAB4CgwAeAoMAHgKDAB4CagAPAmoAAwJqAA8CagAPAmoADwJqAA8CagAPAmoADwJqAA8CnQAeAp0AFAIjAB4CIwAeAiP/oQIjAB4CQQAQAkEAEAJBABACQQAQAkEAEAJBABABpgAAAaYAAAFrAAACjQAeAo0AFgKNAB4CjQAeAo0AHgKNAB4CjQAeAo0AHgKNAB4CjQAeAo0AHgKg//sDq//7A6v/+wOr//sDq//7A6v/+wKJ//YCiP/2Aoj/9gKI//YCiP/2Aoj/9gJCAA8CQgAPAkIADwJCAA8A5AAUANwAFALKADID0AAPA9AADwK8ABQCagAEAmoABAKdAB4CywAUAsIAAAHwAB4BtAAeAZL/9gKDAB4D/QAPAaYAAAI+//YC3QAUAZcACgKUAA0CsAAUAtEACgLVAB4CzgASAmMACgK2AA8CzgASA00AHgNqAB4DkQAeAXwACgHhAB4CcgAeBFQAHgFdABQBRwAeAXsAFAEwAB4CVgAeAYkAKAFgAA8BgAAZATAAHgJWAB4BBAAeATAAHgJWAB4BBAAeAWAANgHvABQDcQAUAzcACgMFABQA6wAUAZoACgEwAB4BMAAeAgL/7AEwAB4BMAAeAowACgOZABQCCf/sATAAHgEwAB4CjAAUAjAAFAIwABQBcQAUA5AAHgS9AAoCFgAeAhYAGgIWAB4CFgAeAOkAHgJGAB4CFwAeAgoAHgIWACIBHP8YAhYAHgJFAB4CFgAeAhcAHgIWAB4CrAAPAmcAFALHAB4DJwADAg8AHgERADICSgAUAwgAFAGqABQA7gAKAxkAFAIpABQAjAAAAogAHgL+//ECZAAUAoj/9gMPAAUDEAAAAwIAFALsAB4CswAPAmcAFAEXAC4A+P/mAaYAAALLABQCwgBTAaYAFAECAAoBhgAUAZEAFAGKAAoCWAAeAfQAHgH0AB4AjAAAAlgAAAJYAAACogAKAmAAHgHCABIA8gAbAcT/rAHEAIACngBDAfQAoQIWABQCFgAUAZ4AHwEMABwB+QAzAdsAPAKTAMYBnwArAUwAfgEFACQCywCuAaYAAAJhAAABwgASAPIAGwHE/7ABxAB/Ap4APAJoALoCFgAUAhYAFAGeAB8BDAAFAfkALgHbADwBnwAjAUwAeQEFABsDOwCwA1EACgKxAG8DEv//BmcAPA==) format('opentype');
  }

`;

    /**
     * Styles - Scoped CSS for SDK components
     */
    const styles = `
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
    justify-content: space-between;
    margin-bottom: 60px;
    width: 100%;
  }

  .me-agent-step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
  }

  .me-agent-step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #D1D5DB;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 1;
  }

  .me-agent-step-circle.active {
    background: white;
    border-color: #0F0F0F;
  }

  .me-agent-step-circle.completed {
    background: #10B981;
    border-color: #10B981;
  }

  .me-agent-step-label {
    font-size: 14px;
    color: #9CA3AF;
    font-weight: 400;
  }

  .me-agent-step-label.active {
    color: #0F0F0F;
    font-weight: 500;
  }

  .me-agent-step-line {
    flex: 1;
    height: 2px;
    background: #E5E7EB;
    margin: 0 12px 24px 12px;
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
    background: #4CAF50;
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
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .me-agent-use-coupon-btn:hover {
    background: #45A049;
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
    function injectStyles() {
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

    /**
     * Development Helper
     * Provides keyboard shortcuts for testing SDK features in dev mode
     */
    class DevHelper {
        constructor(enabled, callbacks) {
            this.enabled = false;
            this.callbacks = {};
            this.helpVisible = false;
            this.helpOverlay = null;
            this.enabled = enabled;
            this.callbacks = callbacks;
            if (this.enabled) {
                this.initialize();
                console.log("🔧 Dev Mode Enabled - Press 'H' for shortcuts help");
            }
        }
        initialize() {
            document.addEventListener("keydown", (e) => this.handleKeyPress(e));
        }
        handleKeyPress(e) {
            // Ignore if user is typing in an input/textarea
            const target = e.target;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
                return;
            }
            // Toggle help with 'H'
            if (e.key === "h" || e.key === "H") {
                this.toggleHelp();
                return;
            }
            // Close help with Escape
            if (e.key === "Escape" && this.helpVisible) {
                this.hideHelp();
                return;
            }
            // Offer Detail - Press 'O'
            if (e.key === "o" || e.key === "O") {
                e.preventDefault();
                this.showTestOfferDetail();
                return;
            }
            // Brand List - Press 'B'
            if (e.key === "b" || e.key === "B") {
                e.preventDefault();
                this.showTestBrandList();
                return;
            }
            // Category Grid - Press 'C'
            if (e.key === "c" || e.key === "C") {
                e.preventDefault();
                this.showTestCategoryGrid();
                return;
            }
        }
        showTestOfferDetail() {
            if (this.callbacks.onShowOfferDetail) {
                console.log("🔧 Dev: Opening test offer details (930991_SPSW)");
                // Use a dummy session ID for dev testing
                this.callbacks.onShowOfferDetail("930991_SPSW", "dev-session-" + Date.now());
            }
        }
        showTestBrandList() {
            if (this.callbacks.onShowBrandList) {
                console.log("🔧 Dev: Opening test brand list");
                this.callbacks.onShowBrandList();
            }
        }
        showTestCategoryGrid() {
            if (this.callbacks.onShowCategoryGrid) {
                console.log("🔧 Dev: Opening test category grid");
                this.callbacks.onShowCategoryGrid();
            }
        }
        toggleHelp() {
            if (this.helpVisible) {
                this.hideHelp();
            }
            else {
                this.showHelp();
            }
        }
        showHelp() {
            if (this.helpOverlay)
                return;
            this.helpOverlay = document.createElement("div");
            this.helpOverlay.className = "me-agent-dev-help-overlay";
            this.helpOverlay.innerHTML = `
      <div class="me-agent-dev-help-modal">
        <div class="me-agent-dev-help-header">
          <h3>🔧 Dev Mode Shortcuts</h3>
          <button class="me-agent-dev-help-close">×</button>
        </div>
        <div class="me-agent-dev-help-content">
          <div class="me-agent-dev-shortcut">
            <kbd>H</kbd>
            <span>Toggle this help menu</span>
          </div>
          <div class="me-agent-dev-shortcut">
            <kbd>O</kbd>
            <span>Open test offer details (930991_SPSW)</span>
          </div>
          <div class="me-agent-dev-shortcut">
            <kbd>B</kbd>
            <span>Open brand list (signup earnings)</span>
          </div>
          <div class="me-agent-dev-shortcut">
            <kbd>C</kbd>
            <span>Open category grid (purchase earnings)</span>
          </div>
          <div class="me-agent-dev-shortcut">
            <kbd>ESC</kbd>
            <span>Close this help menu</span>
          </div>
        </div>
        <div class="me-agent-dev-help-footer">
          <small>Shortcuts only work when not typing in inputs</small>
        </div>
      </div>
    `;
            document.body.appendChild(this.helpOverlay);
            this.helpVisible = true;
            // Attach close button listener
            const closeBtn = this.helpOverlay.querySelector(".me-agent-dev-help-close");
            closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("click", () => this.hideHelp());
            // Close on overlay click
            this.helpOverlay.addEventListener("click", (e) => {
                if (e.target === this.helpOverlay) {
                    this.hideHelp();
                }
            });
        }
        hideHelp() {
            if (this.helpOverlay) {
                this.helpOverlay.remove();
                this.helpOverlay = null;
                this.helpVisible = false;
            }
        }
        /**
         * Clean up and remove event listeners
         */
        destroy() {
            this.hideHelp();
            // Note: Can't easily remove the keydown listener without storing a reference
            // but this is only for dev mode, so it's acceptable
        }
    }

    /**
     * Main SDK Class
     */
    class MeAgentSDK {
        constructor(config) {
            this.redemptionService = null;
            this.button = null;
            this.chat = null;
            this.devHelper = null;
            this.initialized = false;
            this.isOpen = false;
            this.validateConfig(config);
            this.config = Object.assign({ position: "bottom-right", environment: exports.Environment.DEV, network: exports.SupportedNetwork.SEPOLIA }, config);
            // Get environment configuration based on environment and network
            this.env = getEnv(this.config.environment, this.config.network);
            // Initialize API client
            this.apiClient = new APIClient(this.config, this.env);
            // Initialize services
            const sessionAPI = new SessionAPI(this.config, this.env);
            const chatAPI = new ChatAPI(this.config, this.env);
            const authAPI = new AuthAPI(this.config, this.env);
            const rewardAPI = new RewardAPI(this.config, this.env);
            this.sessionService = new SessionService(sessionAPI, chatAPI);
            this.messageParser = new MessageParser();
            // Initialize RedemptionService with network-specific configuration
            this.redemptionService = new RedemptionService(authAPI, rewardAPI, this.apiClient.redemptionAPI, {
                apiKey: this.env.MAGIC_PUBLISHABLE_API_KEY,
                chainId: this.env.CHAIN_ID,
                rpcUrl: this.env.RPC_URL,
            }, this.env.OPEN_REWARD_DIAMOND, parseInt(this.env.CHAIN_ID, 10), this.env.RPC_URL, this.env.RUNTIME_URL, this.env.ME_API_KEY, this.env.API_V1_URL, this.env.GELATO_API_KEY, this.config.brandId || "");
        }
        /**
         * Validate configuration
         */
        validateConfig(config) {
            // No required fields currently
        }
        /**
         * Initialize the SDK
         */
        init() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.initialized) {
                    console.warn("MeAgent SDK: Already initialized");
                    return;
                }
                try {
                    // Inject styles
                    injectStyles();
                    // Create session
                    const sessionId = yield this.sessionService.getOrCreateSession();
                    // Initialize UI components
                    this.button = new FloatingButton(this.config.position || "bottom-right", () => this.toggleChat());
                    this.chat = new ChatPopup(this.config.position || "bottom-right", (message) => this.sendMessage(message), () => this.toggleChat(), this.apiClient, sessionId, this.config, this.redemptionService || undefined);
                    // Mount components
                    this.button.mount();
                    this.chat.mount();
                    // Show welcome message
                    this.chat.showWelcome();
                    // Initialize dev helper if dev mode is enabled
                    if (this.config.devMode) {
                        this.devHelper = new DevHelper(true, {
                            onShowOfferDetail: (offerCode, sessionId) => {
                                var _a;
                                (_a = this.chat) === null || _a === void 0 ? void 0 : _a.devShowOfferDetail(offerCode, sessionId);
                            },
                            onShowBrandList: () => {
                                var _a;
                                (_a = this.chat) === null || _a === void 0 ? void 0 : _a.devShowBrandList();
                            },
                            onShowCategoryGrid: () => {
                                var _a;
                                (_a = this.chat) === null || _a === void 0 ? void 0 : _a.devShowCategoryGrid();
                            },
                        });
                    }
                    this.initialized = true;
                }
                catch (error) {
                    console.error("MeAgent SDK: Initialization failed", error);
                    throw error;
                }
            });
        }
        /**
         * Toggle chat open/closed
         */
        toggleChat() {
            var _a, _b, _c, _d;
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                (_a = this.chat) === null || _a === void 0 ? void 0 : _a.show();
                (_b = this.button) === null || _b === void 0 ? void 0 : _b.hide();
            }
            else {
                (_c = this.chat) === null || _c === void 0 ? void 0 : _c.hide();
                (_d = this.button) === null || _d === void 0 ? void 0 : _d.show();
            }
        }
        /**
         * Send a message
         */
        sendMessage(content) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const sessionId = this.sessionService.getSessionId();
                if (!sessionId) {
                    console.error("MeAgent SDK: No active session");
                    return;
                }
                // Add user message
                const userMessage = this.sessionService.createMessage("user", content);
                this.sessionService.addMessage(userMessage);
                (_a = this.chat) === null || _a === void 0 ? void 0 : _a.addMessage(userMessage);
                // Show loading
                (_b = this.chat) === null || _b === void 0 ? void 0 : _b.setLoading(true);
                (_c = this.chat) === null || _c === void 0 ? void 0 : _c.showLoading();
                let assistantMessage = this.sessionService.createMessage("assistant", "");
                let isFirstChunk = true;
                let parsedData = {
                    offers: [],
                    brands: [],
                    categories: [],
                    showWaysToEarn: false,
                };
                let hasFinalMessage = false;
                try {
                    yield this.apiClient.sendMessage(sessionId, content, (chunk, rawData) => {
                        var _a, _b, _c, _d, _e, _f, _g;
                        // Parse function calls and responses using MessageParser
                        if (rawData) {
                            const parsed = this.messageParser.parseMessageData(rawData);
                            if (parsed.offers.length > 0) {
                                parsedData.offers = parsed.offers;
                            }
                            if (parsed.brands.length > 0) {
                                parsedData.brands = parsed.brands;
                                console.log("[SDK] Detected signup earning brands:", parsed.brands.length);
                            }
                            if (parsed.categories.length > 0) {
                                parsedData.categories = parsed.categories;
                                console.log("[SDK] Detected purchase categories:", parsed.categories.length);
                            }
                            if (parsed.showWaysToEarn) {
                                parsedData.showWaysToEarn = true;
                                console.log("[SDK] Detected ways_to_earn function call");
                            }
                        }
                        // Create message container on first data, even if empty text
                        if (isFirstChunk) {
                            (_a = this.chat) === null || _a === void 0 ? void 0 : _a.removeLoading();
                            assistantMessage.content = chunk || "";
                            this.sessionService.addMessage(assistantMessage);
                            (_b = this.chat) === null || _b === void 0 ? void 0 : _b.addMessage(assistantMessage);
                            isFirstChunk = false;
                        }
                        else if (chunk) {
                            // Check if this is a partial/streaming chunk or final complete message
                            const isPartial = (rawData === null || rawData === void 0 ? void 0 : rawData.partial) === true;
                            if (isPartial) {
                                // Streaming chunk (delta) - append it for real-time display
                                assistantMessage.content += chunk;
                                this.sessionService.updateLastMessage(assistantMessage.content);
                                (_c = this.chat) === null || _c === void 0 ? void 0 : _c.updateLastMessage(assistantMessage.content);
                            }
                            else if ((_f = (_e = (_d = rawData === null || rawData === void 0 ? void 0 : rawData.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) {
                                // Final complete message
                                if (hasFinalMessage) {
                                    // We already have a final message, so this is additional text
                                    // after a function call - append it with spacing
                                    assistantMessage.content += "\n\n" + chunk;
                                }
                                else {
                                    // First final message - replace to ensure accuracy
                                    assistantMessage.content = chunk;
                                    hasFinalMessage = true;
                                }
                                this.sessionService.updateLastMessage(assistantMessage.content);
                                (_g = this.chat) === null || _g === void 0 ? void 0 : _g.updateLastMessage(assistantMessage.content);
                            }
                        }
                    }, () => {
                        var _a, _b, _c, _d, _e, _f;
                        // On complete
                        (_a = this.chat) === null || _a === void 0 ? void 0 : _a.setLoading(false);
                        (_b = this.chat) === null || _b === void 0 ? void 0 : _b.removeLoading();
                        // Show offer preview if offers were found
                        if (parsedData.offers.length > 0) {
                            (_c = this.chat) === null || _c === void 0 ? void 0 : _c.showOfferPreview(parsedData.offers);
                        }
                        // Show brand preview if brands were found
                        if (parsedData.brands.length > 0) {
                            (_d = this.chat) === null || _d === void 0 ? void 0 : _d.showBrandPreview(parsedData.brands);
                        }
                        // Show category preview if categories were found
                        if (parsedData.categories.length > 0) {
                            (_e = this.chat) === null || _e === void 0 ? void 0 : _e.showCategoryPreview(parsedData.categories);
                        }
                        // Show ways to earn quick actions if function was called
                        if (parsedData.showWaysToEarn) {
                            console.log("[SDK] Showing ways to earn actions");
                            (_f = this.chat) === null || _f === void 0 ? void 0 : _f.showWaysToEarnActions();
                        }
                    }, (error) => {
                        var _a, _b, _c;
                        // On error
                        console.error("MeAgent SDK: Error sending message", error);
                        (_a = this.chat) === null || _a === void 0 ? void 0 : _a.setLoading(false);
                        (_b = this.chat) === null || _b === void 0 ? void 0 : _b.removeLoading();
                        const errorMessage = this.sessionService.createMessage("assistant", "Sorry, something went wrong. Please try again.");
                        this.sessionService.addMessage(errorMessage);
                        (_c = this.chat) === null || _c === void 0 ? void 0 : _c.addMessage(errorMessage);
                    });
                }
                catch (error) {
                    console.error("MeAgent SDK: Error in sendMessage", error);
                    (_d = this.chat) === null || _d === void 0 ? void 0 : _d.setLoading(false);
                }
            });
        }
        /**
         * Destroy the SDK
         */
        destroy() {
            var _a, _b;
            (_a = this.button) === null || _a === void 0 ? void 0 : _a.unmount();
            (_b = this.chat) === null || _b === void 0 ? void 0 : _b.unmount();
            this.initialized = false;
        }
    }

    let sdkInstance = null;
    /**
     * Initialize the MeAgent SDK
     */
    function init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (sdkInstance) {
                console.warn("MeAgent: Instance already exists. Destroying previous instance.");
                destroy();
            }
            sdkInstance = new MeAgentSDK(config);
            yield sdkInstance.init();
        });
    }
    /**
     * Destroy the SDK instance
     */
    function destroy() {
        if (sdkInstance) {
            sdkInstance.destroy();
            sdkInstance = null;
        }
    }
    // Export for UMD build
    const MeAgent = {
        init,
        destroy,
        Network: exports.SupportedNetwork,
        Environment: exports.Environment,
    };
    // For UMD build - attach to window
    if (typeof window !== "undefined") {
        window.MeAgent = MeAgent;
    }

    exports.default = MeAgent;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=me-agent-sdk.js.map
