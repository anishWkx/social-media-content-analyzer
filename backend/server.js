const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const Tesseract = require("tesseract.js");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

app.get("/", (req, res) => {
  res.json({
    message: "Social Media Content Analyzer API is running",
  });
});
function analyzeContent(text) {
  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/) : [];

  const wordCount = words.length;
  const characterCount = cleanText.length;

  const hashtags = cleanText.match(/#[a-zA-Z0-9_]+/g) || [];
  const questions = cleanText.match(/\?/g) || [];

  const emojiMatches =
    cleanText.match(
      /[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
    ) || [];

  const ctaWords = [
    "comment",
    "share",
    "follow",
    "like",
    "subscribe",
    "click",
    "learn more",
    "check out",
    "tell us",
    "let me know",
    "save this",
  ];

  const lowerText = cleanText.toLowerCase();

  const hasCTA = ctaWords.some((word) =>
    lowerText.includes(word)
  );

  let score = 50;
  const suggestions = [];

  // Length
  if (wordCount >= 10 && wordCount <= 100) {
    score += 10;
  } else if (wordCount < 10) {
    suggestions.push(
      "Add a little more context so your audience understands the message."
    );
  } else {
    suggestions.push(
      "Consider making the post shorter and easier to scan."
    );
  }

  // Hashtags
  if (hashtags.length >= 2 && hashtags.length <= 8) {
    score += 10;
  } else if (hashtags.length === 0) {
    suggestions.push(
      "Add 2–5 relevant hashtags to improve content discoverability."
    );
  } else if (hashtags.length > 8) {
    suggestions.push(
      "Reduce the number of hashtags and keep only the most relevant ones."
    );
  }

  // Questions
  if (questions.length > 0) {
    score += 10;
  } else {
    suggestions.push(
      "Add a question to encourage your audience to comment."
    );
  }

  // CTA
  if (hasCTA) {
    score += 10;
  } else {
    suggestions.push(
      "Add a clear call-to-action such as 'comment below', 'save this', or 'share'."
    );
  }

  // Emojis
  if (emojiMatches.length > 0) {
    score += 5;
  } else {
    suggestions.push(
      "Consider using a few relevant emojis to make the post more visually engaging."
    );
  }

  // Basic hook detection
  const firstSentence =
    cleanText.split(/[.!?\n]/)[0]?.trim() || "";

  if (firstSentence.length > 0 && firstSentence.length <= 80) {
    score += 5;
  } else {
    suggestions.push(
      "Strengthen the opening line with a short, attention-grabbing hook."
    );
  }

  score = Math.min(score, 100);

  return {
    wordCount,
    characterCount,
    hashtagCount: hashtags.length,
    questionCount: questions.length,
    emojiCount: emojiMatches.length,
    hasCTA,
    engagementScore: score,
    suggestions,
  };
}
app.post("/api/extract", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload a PDF or image file.",
      });
    }

    const { mimetype, originalname, buffer } = req.file;

    let extractedText = "";

    // PDF extraction
   if (mimetype === "application/pdf") {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();

  extractedText = result.text;

  await parser.destroy();
}

    // Image OCR
    else if (mimetype.startsWith("image/")) {
      const result = await Tesseract.recognize(buffer, "eng");
      extractedText = result.data.text;
    }

    else {
      return res.status(400).json({
        error: "Only PDF and image files are supported.",
      });
    }

   const cleanedText = extractedText.trim();
   const analysis = analyzeContent(cleanedText);

 res.json({
  success: true,
  filename: originalname,
  text: cleanedText,
  analysis,
});

  } catch (error) {
    console.error("Extraction error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to extract text from the file.",
    });
  }
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});