import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css'; // Make sure this path is correct based on your project structure
import image from './assets/icons8-chatbot-24.png';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading
  const chatContainerRef = useRef(null); // Ref for the chat container

  // Effect to scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Effect to save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };

    setMessages([...messages, userMessage]);
    setLoading(true); // Set loading to true when message is sent

    const formData = new FormData();
    formData.append('message', input);
    if (file) {
      formData.append('file', file);
    }
    setInput(''); // Reset input field

    try {
      const response = await axios.post('http://localhost:5001/api/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const botMessage = { sender: 'bot', text: response.data.message };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setLoading(false); // Set loading to false when response is received
    setFile(null); // Reset file input
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="container">
      <div className='imageContainer'>
        <img src={image} alt="Chatbot Icon" />
      </div>
      <div className="chatContainer">
        <div className='box1' ref={chatContainerRef}> {/* Added ref to the box1 */}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="loading">Thinking...</div>} {/* Loading indicator */}
        </div>
        <div className="inputContainer">
          <div className='input'>
            <input 
              className='box2'
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
            <input
              className='box3'
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className='box4'>
          <h5>* Allowed files-.xls, .pdf, .csv, .xlsx, .doc, .docx, .jpg, .png, .jpeg</h5>
        </div>
      </div>
    </div>
  );
};

export default Chat;
