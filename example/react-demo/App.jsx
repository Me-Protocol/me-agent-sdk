const { useState, useEffect } = React;

function App() {
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize MeAgent SDK when component mounts
    const initSDK = async () => {
      try {
        await MeAgent.init({
          emailAddress: 'react-demo@example.com',
          brandId: 'react-demo-brand',
          userId: 'react-user-001',
          position: 'bottom-right'
        });
        setSdkInitialized(true);
        console.log('MeAgent SDK initialized in React app!');
      } catch (err) {
        setError(err.message);
        console.error('Failed to initialize MeAgent SDK:', err);
      }
    };

    initSDK();

    // Cleanup on unmount
    return () => {
      MeAgent.destroy();
    };
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚛️ MeAgent SDK + React</h1>
        <p style={styles.subtitle}>Integration Example</p>
      </header>

      <main style={styles.content}>
        <section style={styles.section}>
          <h2>React Integration</h2>
          <p>
            This demo shows how to integrate the MeAgent SDK into a React application.
            The SDK is initialized in a useEffect hook and cleaned up on unmount.
          </p>

          {sdkInitialized && (
            <div style={styles.successBadge}>
              ✅ SDK Initialized Successfully
            </div>
          )}

          {error && (
            <div style={styles.errorBadge}>
              ❌ Error: {error}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <h3>How It Works</h3>
          <ol style={styles.list}>
            <li>Load the MeAgent SDK script in your HTML</li>
            <li>Initialize the SDK in a useEffect hook</li>
            <li>Clean up on component unmount</li>
            <li>The chat widget works seamlessly with your React app!</li>
          </ol>
        </section>

        <section style={styles.codeSection}>
          <h3>Code Example</h3>
          <pre style={styles.code}>{`useEffect(() => {
  const initSDK = async () => {
    await MeAgent.init({
      emailAddress: 'user@example.com',
      brandId: 'your-brand',
      userId: 'user-id',
      position: 'bottom-right'
    });
  };

  initSDK();

  return () => {
    MeAgent.destroy();
  };
}, []);`}</pre>
        </section>

        <section style={styles.section}>
          <h3>Try It Out!</h3>
          <p>
            Click the floating button in the bottom-right corner to start chatting
            with the AI assistant. The SDK works perfectly alongside your React components!
          </p>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>© 2025 MeAgent SDK - React Demo</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  header: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5em',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.2em',
    color: '#666',
  },
  content: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    maxWidth: '1200px',
    margin: '0 auto 30px',
  },
  section: {
    marginBottom: '40px',
  },
  list: {
    marginLeft: '30px',
    fontSize: '1.1em',
    color: '#4b5563',
  },
  codeSection: {
    marginBottom: '40px',
  },
  code: {
    background: '#1f2937',
    color: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    overflow: 'auto',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '0.95em',
    lineHeight: '1.5',
  },
  successBadge: {
    background: '#d1fae5',
    color: '#065f46',
    padding: '12px 20px',
    borderRadius: '8px',
    marginTop: '15px',
    fontWeight: '500',
  },
  errorBadge: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px 20px',
    borderRadius: '8px',
    marginTop: '15px',
    fontWeight: '500',
  },
  footer: {
    background: 'white',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    color: '#6b7280',
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

