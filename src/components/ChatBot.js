// src/components/ChatBot.js
import React, { useState } from "react";
import faqData from "../data/faqData";
import "./ChatBot.css";

const ChatBot = () => {
    const [messages, setMessages] = useState([
                                                 { sender: "bot", text: "Hello! I'm the Crustdata API Support Bot. How can I help you today?" }
                                             ]);
    const [userInput, setUserInput] = useState("");

    const handleSendMessage = () => {
        if (!userInput.trim()) return;

        // Add user's message to the conversation
        const userMessage = { sender: "user", text: userInput };
        setMessages((prev) => [...prev, userMessage]);

        // Bot replies
        const botReply = getBotReply(userInput);
        setMessages((prev) => [...prev, botReply]);

        // Clear input
        setUserInput("");
    };

    // Basic substring match
    const getBotReply = (question) => {
        const lowerQuestion = question.toLowerCase();

        // Find a matching FAQ
        const foundFaq = faqData.find((faq) =>
                                          lowerQuestion.includes(faq.question.toLowerCase())
        );

        if (foundFaq) {
            return { sender: "bot", text: foundFaq.answer };
        } else {
            return {
                sender: "bot",
                text: "I'm sorry, I don't have information on that topic. Please refer to the official Crustdata API documentation."
            };
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-bot">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div
                        className={`chat-message ${msg.sender === "user" ? "chat-user" : "chat-bot-message"}`}
                        key={index}
                    >
                        <strong>{msg.sender === "user" ? "You" : "Bot"}: </strong>
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    placeholder="Type your question about Crustdata APIs..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBot;
