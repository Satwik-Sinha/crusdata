// src/App.js
import React from "react";
import "./App.css";
// import ChatBot from "./components/ChatBot"; // old
import AgenticChatBot from "./components/AgenticChatBot"; // new

function App() {
    return (
        <div className="App">
            <header className="app-header">
                <h1>Crustdata Agentic API Support</h1>
            </header>
            <div className="chat-container">
                <AgenticChatBot />
            </div>
        </div>
    );
}

export default App;
