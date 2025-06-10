import React, { useState } from 'react';
import './App.css';

function App() {
  const [postUrl, setPostUrl] = useState('');
  const [sentimentResults, setSentimentResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleTheme = () => setDarkMode(!darkMode);

  const getSentimentEmoji = (sentimentValue) => {
    if (typeof sentimentValue === 'number') {
      if (sentimentValue > 0.7) return '😃 Very Positive';
      if (sentimentValue > 0.4) return '😊 Positive';
      if (sentimentValue > 0.1) return '🙂 Slightly Positive';
      if (sentimentValue > -0.1) return '😐 Neutral';
      if (sentimentValue > -0.4) return '😕 Slightly Negative';
      if (sentimentValue > -0.7) return '😠 Negative';
      return '😡 Very Negative';
    }
    return '😐 Neutral';
  };

  const handleAnalyzeLink = async () => {
    if (!postUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }
  
    setLoading(true);
    setError(null);
    setSentimentResults([]);
    setSummary(null);
  
    let endpoint = '';
    if (postUrl.includes('youtube.com') || postUrl.includes('youtu.be')) {
      endpoint = 'https://server-sense.onrender.com/insta/ytcomment';
    } else if (postUrl.includes('instagram.com')) {
      endpoint = 'https://server-sense.onrender.com/insta/scrape';
    } else {
      setError('Unsupported URL. Please enter a valid Instagram or YouTube post link.');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: postUrl,
        }),
      });
  
      const data = await response.json();
      setSentimentResults(data.results);
      setSummary(data.summary);
    } catch (err) {
      console.error('Error analyzing link:', err);
      setError('Failed to analyze the post. Please try again later.');
    }
  
    setLoading(false);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* Animated background */}
      <div className="background-animation">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      
      {/* Header */}
      <header className="header">
        <div className="header-glass">
          <div className="header-content">
            <div className="brand">
              <div className="brand-icon">✨</div>
              <div>
                <h1>Sentiment Sense</h1>
                <p>Advanced Social Media Analytics</p>
              </div>
            </div>
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="toggle-icon">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Input Section */}
        <section className="input-section">
          <div className="glass-card">
            <div className="section-header">
              <h2>Analyze Content Sentiment</h2>
              <p>Discover how your audience truly feels about your content</p>
            </div>
            
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  type="url"
                  placeholder="https://instagram.com/p/example"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  className="premium-input"
                />
                <div className="input-glow"></div>
              </div>
              
              <button 
                onClick={handleAnalyzeLink} 
                disabled={loading}
                className="premium-button"
              >
                <span className="button-content">
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Sentiment</span>
                      <div className="button-arrow">→</div>
                    </>
                  )}
                </span>
                <div className="button-glow"></div>
              </button>
            </div>
            
            {error && (
              <div className="error-notification">
                <div className="error-icon"></div>
                <span>{error}</span>
              </div>
            )}
          </div>
        </section>

        {/* Summary Section */}
        {summary && (
          <section className="summary-section">
            <div className="glass-card summary-card">
              <div className="summary-header">
                <div className="summary-icon">
                  <span className="large-emoji">{summary.emoji}</span>
                </div>
                <div className="summary-details">
                  <h3>{summary.overallSentiment}</h3>
                  <div className="score-display">
                    <span className="score-label">Sentiment Score</span>
                    <span className="score-value">{summary.averageScore}</span>
                  </div>
                </div>
              </div>
              
              <div className="summary-description">
                <p>{summary.marketingComment}</p>
              </div>
              
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-number">{summary.totalComments}</div>
                  <div className="stat-label">Total Comments</div>
                </div>
                <div className="stat-item positive">
                  <div className="stat-number">{summary.positiveCount}</div>
                  <div className="stat-label">Positive</div>
                </div>
                <div className="stat-item neutral">
                  <div className="stat-number">{summary.neutralCount}</div>
                  <div className="stat-label">Neutral</div>
                </div>
                <div className="stat-item negative">
                  <div className="stat-number">{summary.negativeCount}</div>
                  <div className="stat-label">Negative</div>
                </div>
              </div>
            </div>
          </section>
        )}

       {sentimentResults && sentimentResults.length > 0 && (
  <div>
    <h3>Individual Comment Analysis</h3>
    
    <div className="sentiment-legend">
      <span className="positive">Positive</span>
      <span className="neutral">Neutral</span>
      <span className="negative">Negative</span>
    </div>
    
    <div className="results-container">
      {sentimentResults.map((item, index) => {
        // Add safety checks for item properties
        const sentimentValue = (typeof item?.sentiment === 'number') ? item.sentiment : 0;
        const sentimentLabel = sentimentValue > 0.1 ? 'positive' : sentimentValue < -0.1 ? 'negative' : 'neutral';
        const commentText = item?.text || 'No text available';
        
        return (
          <div key={index} className={`result-item ${sentimentLabel}`}>
            <div className="sentiment-info">
              <div className="sentiment-emoji-label">
                <span className="emoji">{getSentimentEmoji(sentimentValue).split(' ')[0]}</span>
                <span className="label">{getSentimentEmoji(sentimentValue).split(' ').slice(1).join(' ')}</span>
              </div>
              <div className="sentiment-score">
                {sentimentValue.toFixed(2)}
              </div>
            </div>
            
            <div className="comment-text">
              {commentText.length > 150 
                ? `${commentText.slice(0, 150)}...` 
                : commentText
              }
            </div>
            
            <div className="result-actions">
              {/* Add any action buttons here if needed */}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

{/* Optional: Show loading or empty state */}
{!sentimentResults && (
  <div className="loading-state">
    Loading sentiment analysis...
  </div>
)}

{sentimentResults && sentimentResults.length === 0 && (
  <div className="empty-state">
    No sentiment data available.
  </div>
)}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-glass">
          <div className="footer-content">
            <p>Sentiment Sense © 2025 - Advanced Analytics Platform</p>
            <div className="footer-links">
             
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;