import React, { useState } from 'react';
import { validateCurlCommand, sendRequest } from '../utils/apiValidator';
import { faqData } from '../data/faqData';
import { knowledgeBase } from '../data/knowledgeBase';
import './AgenticChatBot.css';

const AgenticChatBot = () => {
    // Basic chat messages
    const [messages, setMessages] = useState([
                                                 { sender: 'bot', text: "Hello! I'm the Crustdata API Support Bot. Ask me something about Crustdata’s API, or type a cURL command to have it validated." }
                                             ]);
    const [userInput, setUserInput] = useState('');

    // For the "Add Documentation" form
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [addToKB, setAddToKB] = useState(true); // if false => add to FAQ
    const [docUpdateMessage, setDocUpdateMessage] = useState('');

    const appendBotMessage = (text) => {
        setMessages((prev) => [...prev, { sender: 'bot', text }]);
    };

    // Utility: tries to find an answer in a Q&A array by substring
    const findQAMatch = (userText, qnaArray) => qnaArray.find((item) => userText.toLowerCase().includes(item.question.toLowerCase()));

    // Handle sending message in the chat
    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        // Add the user message to the chat
        setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);

        // 1) Check knowledgeBase
        let match = findQAMatch(userInput, knowledgeBase);
        if (match) {
            appendBotMessage(match.answer);
        }
        // 2) Else check FAQ
        else if ((match = findQAMatch(userInput, faqData))) {
            appendBotMessage(match.answer);
        }
        // 3) Else if it starts with cURL
        else if (userInput.trim().toLowerCase().startsWith('curl')) {
            const result = validateCurlCommand(userInput);
            if (!result || !result.valid) {
                if (!result) {
                    appendBotMessage("I couldn't parse that as a valid cURL command. Make sure it starts with 'curl' and includes an API endpoint.");
                } else {
                    // Show error details
                    const errorMsg = `I found issues:\n` + result.errors.map((err) => `• ${err}`).join('\n') + `\nTry these fixes:\n` + result.fixes.map((fx) => `• ${fx}`).join('\n');
                    appendBotMessage(errorMsg);
                }
            } else {
                // Valid cURL command -> try sending
                try {
                    const response = await sendRequest(result.parsedRequest);
                    if (response.success) {
                        appendBotMessage(`✓ Call successful (status ${response.statusCode}):\n` + JSON.stringify(response.data, null, 2));
                    } else {
                        appendBotMessage(`API call failed:\n${response.logs}`);
                    }
                } catch (e) {
                    appendBotMessage(`Error making request: ${e.message}`);
                }
            }
        } else {
            // 4) Generic fallback
            appendBotMessage("I'm not sure I have that in my docs. Try referencing the additional knowledge base or an FAQ, or provide a cURL command for validation.");
        }
        setUserInput('');
    };

    // Handle doc submission
    const handleAddDoc = async () => {
        if (!newQuestion.trim() || !newAnswer.trim()) {
            setDocUpdateMessage('❌ Question and answer cannot be empty.');
            return;
        }

        try {
            // Post to Node server
            const response = await fetch('http://localhost:4003/api/documentation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                                         question: newQuestion,
                                         answer: newAnswer,
                                         toKnowledgeBase: addToKB
                                     })
            });
            const data = await response.json();

            if (data.success) {
                setDocUpdateMessage(`✅ ${data.message}`);
                setNewQuestion('');
                setNewAnswer('');
            } else {
                setDocUpdateMessage(`❌ ${data.message || 'Failed to update docs'}`);
            }
        } catch (err) {
            console.error(err);
            setDocUpdateMessage(`❌ Error: ${err.message}`);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-title">Crustdata Support Agent (Level 2)</div>
            <div className="chat-box">
                {/* Chat messages */}
                <div className="messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-row ${msg.sender === 'bot' ? 'bot' : 'user'}`}>
                            <div className="message-bubble">{msg.text}</div>
                        </div>
                    ))}
                </div>
                {/* Input area for the chat */}
                <div className="input-area">
                    <input
                        placeholder="Ask about Crustdata's API or paste a cURL..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
            <div className="doc-update-section">
                <h3>Add or Update Documentation</h3>
                <p>
                    Here you can add a new Q&A to the official doc.
                    It will physically modify <code>faqData.js</code> or <code>knowledgeBase.js</code>.
                </p>

                <label>Question:</label>
                <textarea
                    rows="2"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                />
                <label>Answer:</label>
                <textarea
                    rows="4"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                />

                <div>
                    <label>
                        <input
                            type="radio"
                            name="docDestination"
                            checked={addToKB}
                            onChange={() => setAddToKB(true)}
                        />
                        Knowledge Base
                    </label>
                    <label style={{ marginLeft: '1rem' }}>
                        <input
                            type="radio"
                            name="docDestination"
                            checked={!addToKB}
                            onChange={() => setAddToKB(false)}
                        />
                        FAQ
                    </label>
                </div>

                <button onClick={handleAddDoc}>Add Documentation</button>
                {docUpdateMessage && <div>{docUpdateMessage}</div>}
            </div>
            {/* Footer Section */}
            <div className="footer">
                <div className="social-icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TW</a>
                    <a href="https://www.linkedin.com/company/crustdata/" target="_blank" rel="noopener noreferrer">LI</a>
                </div>
                <div className="contact-info">
                    <p>Contact us: <a href="mailto:support@crustdata.com">support@crustdata.com</a></p>
                </div>
                <p>&copy; 2025 Crustdata. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AgenticChatBot;
