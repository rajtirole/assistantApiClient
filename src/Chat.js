import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';
import image from './assets/icons8-chatbot-24.png';
import { useAuth } from './AuthContext';
import apiClient from './api';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = () => {
  const { auth } = useAuth();
  const { id } = useParams(); // Get the threadid from the URL
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };

    setMessages([...messages, userMessage]);
    setLoading(true);

    const formData = new FormData();
    formData.append('message', input);
    for (const file of files) {
      formData.append('files', file); // Use 'files' if your backend expects it
    }
    setInput('');

    try {
      const response = await apiClient.post(`/chat/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': auth.token,
        },
      });

      if (id !== response?.data?.threadId) {
        navigate(`/chat/${response?.data?.threadId}`);
      }
      const botMessage = { sender: 'bot', text: response.data.message };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setLoading(false);
    setFiles([]);
    fileInputRef.current.value = ''; // Clear file input
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  return (
    <div className="container">
      <div className='imageContainer'>
        <img src={image} alt="Chatbot Icon" />
      </div>
      <div className="chatContainer">
        <div className='box1' ref={chatContainerRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="loading">Thinking...</div>}
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
              multiple
              ref={fileInputRef}
            />
          </div>
          <button onClick={sendMessage}>Send</button>
        </div>
        <div className='box4'>
          <h5>* Allowed files - .xls, .pdf, .xlsx, .doc, .docx</h5>
        </div>
      </div>
    </div>
  );
};

export default Chat;
