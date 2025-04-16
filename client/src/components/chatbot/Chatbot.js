import React from 'react';
import './Chatbot.css';

const Chatbot = () => {
  return (
    <div className="chatbot">
      <div className="chat-header">
        <h2>AI Study Assistant</h2>
        <p>Get help with your studies anytime</p>
      </div>
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/SOvz_qRN_7MEYJznHyQBK"
        width="100%"
        style={{ height: '100%', minHeight: '700px' }}
        frameBorder="0"
        title="AI Study Assistant Chat Interface"
      ></iframe>
    </div>
  );
};

export default Chatbot;