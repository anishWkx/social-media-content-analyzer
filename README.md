# Social Media Content Analyzer

## 🚀 Live Demo

**Working Application:** https://social-media-content-analyzer-nine-xi.vercel.app/

**Backend API:** https://social-media-content-analyzer-vsnb.onrender.com

**GitHub Repository:** https://github.com/anishWkx/social-media-content-analyzer

A web application that extracts text from uploaded PDF and image files and analyzes social media content to provide engagement-focused improvement suggestions.

## Features

* Upload PDF and image files
* Drag-and-drop file upload
* PDF text extraction
* OCR-based text extraction from images
* Content analysis and engagement scoring
* Word, hashtag, question, and emoji metrics
* Call-to-action detection
* Engagement improvement suggestions
* File validation and error handling
* Loading states during text extraction and analysis
* Responsive user interface

## Tech Stack

### Frontend

* React.js
* Vite
* Axios
* CSS

### Backend

* Node.js
* Express.js
* Multer
* pdf-parse
* Tesseract.js
* CORS

## Project Structure

```text
social-media-content-analyzer/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
└── backend/
    ├── server.js
    ├── package.json
    └── package-lock.json
```

## How It Works

1. The user uploads a PDF or image through the React interface.
2. The file is sent to the Express backend using a multipart form request.
3. PDF files are processed using PDF text extraction.
4. Image files are processed using Tesseract.js OCR.
5. The extracted text is analyzed for basic engagement characteristics.
6. The application calculates an engagement score based on content elements such as hashtags, questions, emojis, content length, and calls-to-action.
7. The application displays the extracted content, analysis metrics, engagement score, and improvement suggestions.

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd social-media-content-analyzer
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Start the backend:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5001
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API

### Extract and Analyze Content

**POST**

```text
/api/extract
```

The endpoint accepts a PDF or image file using the `file` form field.

The response contains:

* Extracted text
* Word count
* Character count
* Hashtag count
* Question count
* Emoji count
* Call-to-action detection
* Engagement score
* Improvement suggestions

## Error Handling

The application handles:

* Missing file uploads
* Unsupported file formats
* Files larger than 10 MB
* Text extraction failures
* OCR failures
* Backend processing errors

## Workflow

The application follows a simple processing pipeline:

```text
File Upload
     ↓
PDF Parser / OCR
     ↓
Text Extraction
     ↓
Content Analysis
     ↓
Engagement Score
     ↓
Improvement Suggestions
```

The implementation focuses on a lightweight and explainable analysis approach rather than requiring a trained machine-learning model.

## 🌐 Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Repository:** GitHub

## 🧠 Approach

I developed the Social Media Content Analyzer as a React and Node.js web application designed to extract and analyze content from uploaded social media documents.
The application provides a simple drag-and-drop and file-picker interface supporting PDF and image files. Uploaded files are sent to an Express.js backend using Multer. PDF files are processed using PDF text extraction, while image files are processed using Tesseract.js OCR to extract readable text.
The extracted content is then analyzed using a lightweight, rule-based approach. The analyzer evaluates word count, content length, hashtags, questions, emojis, calls-to-action, and the opening hook. These factors are used to calculate an engagement score and generate actionable suggestions to improve audience interaction and content quality.
For better usability, the application includes file-type validation, a 10 MB file-size limit, loading states, and basic error handling for invalid uploads and extraction failures.
The implementation focuses on keeping the solution lightweight, explainable, maintainable, and practical while satisfying the core requirements of document upload, PDF parsing, OCR, content analysis, and engagement improvement recommendations.


## Future Improvements

* AI-powered content recommendations
* Platform-specific optimization for Instagram, LinkedIn, and X
* Sentiment analysis
* Readability scoring
* Content comparison
* Exportable analysis reports
* User authentication and saved analyses

## Project Status

Completed as a technical assessment project with PDF/image upload, text extraction, OCR, content analysis, engagement scoring, and improvement suggestions.
