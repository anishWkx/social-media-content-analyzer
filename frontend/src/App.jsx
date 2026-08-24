import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (selectedFile) => {
    setError("");
    setText("");
    setAnalysis(null);

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF or image file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setText("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/extract",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setText(response.data.text);
      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Something went wrong while processing the file."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="badge">AI CONTENT TOOL</div>

        <h1>Social Media Content Analyzer</h1>

        <p>
          Upload your content, extract the text and discover ways to
          improve engagement.
        </p>
      </header>

      <main>
        <div
          className="upload-box"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📄</div>

          <h2>Upload your content</h2>

          <p>Drag & drop a PDF or image here</p>
          <span>or</span>

          <label className="file-button">
            Choose File
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
              hidden
            />
          </label>

          {file && (
            <div className="selected-file">
              📎 <strong>{file.name}</strong>
            </div>
          )}

          <small>
            PDF, PNG, JPG, JPEG or WEBP · Maximum 10 MB
          </small>
        </div>

        {error && <div className="error">{error}</div>}

        <button
          className="analyze-button"
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? "Analyzing content..." : "Analyze Content"}
        </button>

        {text && (
          <section className="result-section">
            <div className="section-heading">
              <span>01</span>
              <h2>Extracted Content</h2>
            </div>

            <div className="text-box">
              {text}
            </div>
          </section>
        )}

        {analysis && (
          <section className="analysis-section">
            <div className="section-heading">
              <span>02</span>
              <h2>Content Analysis</h2>
            </div>

            <div className="score-card">
              <div>
                <p>Engagement Score</p>
                <h3>{analysis.engagementScore}<small>/100</small></h3>
              </div>

              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${analysis.engagementScore}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <span>📝</span>
                <p>Words</p>
                <strong>{analysis.wordCount}</strong>
              </div>

              <div className="metric-card">
                <span>#️⃣</span>
                <p>Hashtags</p>
                <strong>{analysis.hashtagCount}</strong>
              </div>

              <div className="metric-card">
                <span>❓</span>
                <p>Questions</p>
                <strong>{analysis.questionCount}</strong>
              </div>

              <div className="metric-card">
                <span>😊</span>
                <p>Emojis</p>
                <strong>{analysis.emojiCount}</strong>
              </div>
            </div>

            <div className="cta-card">
              <div>
                <h3>Call-to-Action</h3>
                <p>
                  {analysis.hasCTA
                    ? "Your content includes a call-to-action."
                    : "Your content could use a stronger call-to-action."}
                </p>
              </div>

              <strong className={analysis.hasCTA ? "yes" : "no"}>
                {analysis.hasCTA ? "✓ Detected" : "✕ Missing"}
              </strong>
            </div>

            <div className="suggestions-card">
              <h3>💡 Engagement Suggestions</h3>

              {analysis.suggestions.length === 0 ? (
                <p>
                  Great job! Your content already has strong
                  engagement elements.
                </p>
              ) : (
                <ul>
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
