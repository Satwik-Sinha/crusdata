// server.js
const express = require('express');
const cors = require('cors');
const { addDocumentationEntry } = require('../data/documentationManager');

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
    res.send('Crustdata Support Bot Server is running...');
});

// Route to add new Q&A to knowledgeBase or FAQ
// Expects a JSON POST with shape: { question, answer, toKnowledgeBase: true/false }
app.post('/api/documentation', async (req, res) => {
    const { question, answer, toKnowledgeBase } = req.body;
    try {
        const result = await addDocumentationEntry(question, answer, toKnowledgeBase);
        return res.json(result);
    } catch (err) {
        console.error('Error updating documentation:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
