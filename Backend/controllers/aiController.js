const { askGemini } = require("../services/aiService");

const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await askGemini(message);

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chatWithAssistant };