import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './Components/Header';
import Footer from './Components/Footer';

const ChatbotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding-top: 70px; /* Adjusted padding to accommodate the header */
`;

const ChatContainer = styled.div`
  width: 1100px;
  height: 550px; /* Increased height */
  border: 1px solid #ccc;
  overflow-y: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px;
`;

const Message = styled.div`
  background-color: #F5D2D2;
  padding: 10px;
  margin: 8px;
  border-radius: 8px;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  max-width: 75%;
  word-wrap: break-word;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ImageMessage = styled.img`
  max-width: 250px;
  max-height: 250px;
  border-radius: 8px;
  margin: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 50%;
  margin-top: 10px;
`;

const InputField = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
`;

const Button = styled.button`
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 10px;
`;

const SendButton = styled(Button)`
  background-color: #EF6968;
`;

const ListenButton = styled(Button)`
  background-color: #4CAF50;
`;

const StopButton = styled(Button)`
  background-color: #f44336;
`;

const SignLanguageButton = styled(Button)`
  background-color: #008CBA;
`;

const UploadButton = styled(Button)`
  background-color: #008CBA; /* Change color if needed */
`;

const Doubts = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  const handleSendMessage = async () => {
    if (inputText.trim() !== '') {
      // Display the user's message immediately
      setMessages((prevMessages) => [...prevMessages, { text: inputText, user: 'user' }]);

      // Make an API call to the Flask backend
      const response = await fetch('http://localhost:5000/api/ask-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputText }),
      });

      const responseData = await response.json();

      // Display Gemini's response in the chat
      setMessages((prevMessages) => [...prevMessages, { text: responseData.answer, user: 'assistant' }]);
      setInputText('');
    }
  };

  const handleListen = () => {
    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(messages[messages.length - 1].text);
      speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  };

  const handleSignLanguage = () => {
    // Implement sign language functionality
    // You can use a library or API for sign language translation
    // Example: Call a sign language translation API with the last message
    console.log('Implement Sign Language functionality here');
  };

  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];

    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);

      // Display the uploaded image and text in the chat immediately
      const textMessage = inputText.trim();
      setMessages((prevMessages) => [
        ...prevMessages,
        { image: imageUrl, text: textMessage, user: 'user' },
      ]);

      // Make an API call to analyze the image along with the text message
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('text', textMessage);

      try {
        const response = await fetch('http://localhost:5000/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        const responseData = await response.json();

        // Display Gemini's response in the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: responseData.answer, user: 'assistant' },
        ]);
      } catch (error) {
        console.error('Error uploading image:', error);
      }

      // Clear the text input
      setInputText('');
    }
  };

  useEffect(() => {
    // Initialize speechSynthesis on component mount
    setSpeechSynthesis(window.speechSynthesis);

    // Cleanup speechSynthesis on component unmount
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <>
      <Header />
      <ChatbotWrapper>
        <ChatContainer>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {message.text && (
                <Message key={index} isUser={message.user === 'user'}>
                  {message.text}
                </Message>
              )}
              {message.image && (
                <ImageContainer key={index}>
                  <ImageMessage src={message.image} alt="Uploaded" />
                </ImageContainer>
              )}
            </React.Fragment>
          ))}
        </ChatContainer>
        <InputContainer>
          <InputField
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <SendButton onClick={handleSendMessage}>Send</SendButton>
          <ListenButton onClick={handleListen}>Listen</ListenButton>
          <StopButton onClick={handleStop}>Stop</StopButton>
          <SignLanguageButton onClick={handleSignLanguage}>Sign Language</SignLanguageButton>
          <ListenButton onClick={handleListen}>Mic</ListenButton>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          <UploadButton onClick={() => document.querySelector('input[type="file"]').click()}>
            Upload
          </UploadButton>
        </InputContainer>
      </ChatbotWrapper>
      <Footer />
    </>
  );
};

export default Doubts;
