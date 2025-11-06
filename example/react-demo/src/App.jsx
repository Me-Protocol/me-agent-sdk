import { useState, useEffect } from "react";
import { MeAgentSDK } from "me-agent-sdk";

function App() {
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [sdkInstance, setSdkInstance] = useState(null);

  useEffect(() => {
    // Initialize MeAgent SDK when component mounts
    const initSDK = async () => {
      try {
        const sdk = new MeAgentSDK({
          emailAddress: "react-demo@example.com",
          brandId: "demo-brand",
          userId: "react-user-001",
          position: "bottom-right",
          primaryColor: "#667eea",
          apiUrl: "https://api.meprotocol.io/api/v1",
        });

        await sdk.init();
        setSdkInstance(sdk);
        setSdkInitialized(true);
        console.log("✅ MeAgent SDK initialized in React app!");
      } catch (err) {
        setError(err.message);
        console.error("❌ Failed to initialize MeAgent SDK:", err);
      }
    };

    initSDK();

    // Cleanup on unmount
    return () => {
      console.log("🧹 Component unmounting");
    };
  }, []);

  // Handler to programmatically open the chat
  const handleOpenChat = () => {
    if (sdkInstance) {
      sdkInstance.open();
    }
  };

  // Handler to close the chat
  const handleCloseChat = () => {
    if (sdkInstance) {
      sdkInstance.close();
    }
  };

  // Handler to toggle the chat
  const handleToggleChat = () => {
    if (sdkInstance) {
      sdkInstance.toggle();
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚛️ MeAgent SDK + React</h1>
        <p style={styles.subtitle}>NPM Package Integration</p>
      </header>

      <main style={styles.content}>
        <section style={styles.section}>
          <h2>React Integration via NPM</h2>
          <p>
            This demo shows how to integrate the MeAgent SDK into a React
            application using the npm package. The SDK is imported and
            initialized in a useEffect hook.
          </p>

          {sdkInitialized && (
            <div style={styles.successBadge}>
              ✅ SDK Initialized Successfully
            </div>
          )}

          {error && <div style={styles.errorBadge}>❌ Error: {error}</div>}
        </section>

        {sdkInitialized && (
          <section style={styles.section}>
            <h3>🎮 Programmatic Control</h3>
            <p>
              You can control the chat widget programmatically using SDK
              methods:
            </p>
            <div style={styles.buttonGroup}>
              <button style={styles.demoButton} onClick={handleOpenChat}>
                📖 Open Chat
              </button>
              <button style={styles.demoButton} onClick={handleCloseChat}>
                ❌ Close Chat
              </button>
              <button style={styles.demoButton} onClick={handleToggleChat}>
                🔄 Toggle Chat
              </button>
            </div>
          </section>
        )}

        <section style={styles.section}>
          <h3>Installation Steps</h3>
          <ol style={styles.list}>
            <li>Install the package via npm or yarn</li>
            <li>Import MeAgentSDK in your React component</li>
            <li>Initialize in useEffect with your configuration</li>
            <li>The chat widget works seamlessly with your React app!</li>
            <li>Try asking about offers, rewards, and redemption!</li>
          </ol>
        </section>

        <section style={styles.codeSection}>
          <h3>1. Install via NPM</h3>
          <pre style={styles.code}>{`# Install from npm
npm install me-agent-sdk

# Or with yarn
yarn add me-agent-sdk`}</pre>
        </section>

        <section style={styles.codeSection}>
          <h3>2. Import and Initialize</h3>
          <pre
            style={styles.code}
          >{`import { useState, useEffect } from 'react';
import { MeAgentSDK } from 'me-agent-sdk';

function App() {
  const [sdkInitialized, setSdkInitialized] = useState(false);

  useEffect(() => {
    const initSDK = async () => {
      try {
        const sdk = new MeAgentSDK({
          emailAddress: 'user@example.com',
          brandId: 'demo-brand',
          userId: 'user-123',
          position: 'bottom-right',
          primaryColor: '#667eea',
          apiUrl: 'https://api.meprotocol.io/api/v1'
        });

        await sdk.init();
        setSdkInitialized(true);
        console.log('SDK initialized!');
      } catch (err) {
        console.error('SDK init failed:', err);
      }
    };

    initSDK();
  }, []);

  return <div>Your App Content</div>;
}

export default App;`}</pre>
        </section>

        <section style={styles.codeSection}>
          <h3>3. Programmatic Control</h3>
          <pre style={styles.code}>{`// Store SDK instance in state
const [sdkInstance, setSdkInstance] = useState(null);

useEffect(() => {
  const sdk = new MeAgentSDK({ ... });
  await sdk.init();
  setSdkInstance(sdk); // Save instance
}, []);

// Use methods to control the chat
const openChat = () => sdkInstance.open();
const closeChat = () => sdkInstance.close();
const toggleChat = () => sdkInstance.toggle();`}</pre>
        </section>

        <section style={styles.section}>
          <h3>SDK Features</h3>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>💬</span>
              <h4>AI Chat Assistant</h4>
              <p>Natural language conversations with streaming responses</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🎁</span>
              <h4>Offer Discovery</h4>
              <p>Browse and search available offers and rewards</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>💰</span>
              <h4>Reward Redemption</h4>
              <p>Complete redemption flow with Magic wallet integration</p>
            </div>
            <div style={styles.featureCard}>
              <span style={styles.featureIcon}>🔄</span>
              <h4>Cross-Brand Swaps</h4>
              <p>Exchange rewards across different brands seamlessly</p>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h3>Try It Out!</h3>
          <p>
            Click the floating button in the bottom-right corner to start
            chatting with the AI assistant. Try asking:
          </p>
          <ul style={styles.list}>
            <li>"Show me available offers"</li>
            <li>"What rewards do I have?"</li>
            <li>"I want to redeem a coupon"</li>
            <li>"Tell me about cross-brand redemption"</li>
          </ul>
        </section>

        <section style={styles.codeSection}>
          <h3>Configuration Options</h3>
          <pre style={styles.code}>{`{
  // Required
  emailAddress: string,    // User's email
  brandId: string,         // Your brand ID
  userId: string,          // Unique user identifier
  
  // Optional
  position: 'bottom-right' | 'bottom-left',
  primaryColor: string,    // Brand color (hex)
  apiUrl: string,          // API endpoint
  magicApiKey: string,     // Magic.link API key
}`}</pre>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>© 2025 MeAgent SDK - React NPM Integration Demo</p>
        <p style={{ fontSize: "0.9em", marginTop: "8px" }}>
          Built with React + Vite
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  header: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2.5em",
    marginBottom: "10px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "1.2em",
    color: "#666",
  },
  content: {
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
    maxWidth: "1200px",
    margin: "0 auto 30px",
  },
  section: {
    marginBottom: "40px",
  },
  list: {
    marginLeft: "30px",
    fontSize: "1.1em",
    color: "#4b5563",
    lineHeight: "1.8",
  },
  codeSection: {
    marginBottom: "40px",
  },
  code: {
    background: "#1f2937",
    color: "#f9fafb",
    padding: "20px",
    borderRadius: "8px",
    overflow: "auto",
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.9em",
    lineHeight: "1.6",
  },
  successBadge: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "12px 20px",
    borderRadius: "8px",
    marginTop: "15px",
    fontWeight: "500",
  },
  errorBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 20px",
    borderRadius: "8px",
    marginTop: "15px",
    fontWeight: "500",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  featureCard: {
    background: "#f9fafb",
    padding: "24px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    textAlign: "center",
  },
  featureIcon: {
    fontSize: "2.5em",
    display: "block",
    marginBottom: "12px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  demoButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "1em",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
  },
  footer: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    color: "#6b7280",
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

export default App;
