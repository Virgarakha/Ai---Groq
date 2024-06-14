import { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";
import { requestToGroqAi } from "./utils/groq";
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./App.css";
import logo from "./assets/nova.png";
import share from "./assets/share.svg";
import copy from "./assets/copy.svg";
import check from "./assets/check (1).svg"; // Import the check image
import clock from "./assets/clock (1).svg";
import mic from "./assets/mic.svg"; // Import the microphone image
import micoff from "./assets/mic-off.svg"; // Import the microphone off image

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const chatBoxRef = useRef(null); // Add ref for chat box
  const recognitionRef = useRef(null); // Add ref for speech recognition

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "id-ID";

      recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        setInputValue((prev) => prev + transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  }, []);

  const handleSpeechToggle = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      return;
    }

    let newMessages = [...messages];
    let newInputValue = inputValue;
    const isContinuation = inputValue.startsWith("...");

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isContinuation && newMessages.length > 0) {
      newMessages[newMessages.length - 1].user += ` ${inputValue.slice(3).trim()}`;
      newInputValue = newMessages[newMessages.length - 1].user;
      newMessages[newMessages.length - 1].timestamp = timestamp;
    } else {
      if (newMessages.length > 0 && inputValue === newMessages[newMessages.length - 1].user) {
        alert("You can't ask the same question twice in a row");
        return;
      }

      newMessages = [
        ...newMessages,
        { user: inputValue, ai: null, copied: false, timestamp: timestamp },
      ];
    }

    setMessages(newMessages);
    setInputValue("");

    setIsTyping(true);
    const aiResponse = await requestToGroqAi(newInputValue);
    setIsTyping(false);

    const updatedMessages = newMessages.map((message, index) =>
      index === newMessages.length - 1
        ? { ...message, ai: parseResponse(aiResponse) }
        : message
    );
    setMessages(updatedMessages);
  };

  const parseResponse = (response) => {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const parts = response.split(codeBlockRegex);
    const codeBlocks = response.match(codeBlockRegex) || [];

    return parts.map((part, index) => ({
      explanation: part.trim(),
      code: codeBlocks[index] ? codeBlocks[index].replace(/```/g, "").trim() : null,
      copied: false, // Add copied state for each part
    }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  const toggleInputVisibility = () => {
    setIsInputVisible(!isInputVisible);
  };

  const handleCopy = (messageIndex, partIndex) => {
    const updatedMessages = [...messages];
    if (partIndex === null) {
      updatedMessages[messageIndex].copied = true;
    } else {
      updatedMessages[messageIndex].ai[partIndex].copied = true;
    }
    setMessages(updatedMessages);

    // Reset copied state after a short delay
    setTimeout(() => {
      if (partIndex === null) {
        updatedMessages[messageIndex].copied = false;
      } else {
        updatedMessages[messageIndex].ai[partIndex].copied = false;
      }
      setMessages([...updatedMessages]);
    }, 2000);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsImageProcessing(true);
      try {
        const { data: { text } } = await Tesseract.recognize(file, "eng", {
          logger: (m) => console.log(m),
        });
        setInputValue(text);
      } catch (error) {
        console.error("Error processing image:", error);
      }
      setIsImageProcessing(false);
    }
  };

  return (
    <main className="main-container">
      <nav className="navbar">
        <div className="navbox">
          <div className="logo2">
            <img src={logo} alt="Logo" className="logonova" />
          </div>
          <div className="link">
            <li>
              <a href="">Docs</a>
            </li>
            <li>
              <a href="">Dev</a>
            </li>
            <li>
              <a href="">Github</a>
            </li>
          </div>
        </div>
      </nav>

      <div className="chat-container">
        <div className="intro2">
          <h1>Introduce</h1>
          <p>BakolAi 2nd</p>
        </div>
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.ai ? "ai-message" : "user-message"}`}
            >
              <div className="userr">
                <p>{message.ai ? "You" : "You"}:</p>
                {message.user && (
                  <>
                    <p className={message.ai ? "user-input" : ""}>
                      {message.user}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} className="time">
                      <img style={{ width: '10px', height: '10px' }} src={clock} alt="" />
                      <span style={{ fontSize: '10px', color: 'gray' }} className="timestamp">{message.timestamp}</span>
                    </div>
                    {!message.user && (
                      <CopyToClipboard
                        text={message.user}
                        onCopy={() => handleCopy(index, null)}
                      >
                        <button className="copy-button">
                          <p style={{ fontSize: '10px' }}>Copied</p>
                        </button>
                      </CopyToClipboard>
                    )}
                  </>
                )}
              </div>
              <div className="kosongan"></div>
              {message.ai &&
                message.ai.map((part, i) => (
                  <div key={i} className="message-content">
                    <p style={{ marginBottom: '5px', backgroundColor: '#2e2e2e', color: 'white', padding: '5px', borderRadius: '5px' }}>{message.ai ? "👾 Nova Ai" : "👾 Nova Ai"}:</p>
                    {part.explanation && <p>{part.explanation}</p>}
                    {part.code && (
                      <div className="code-block">
                        <SyntaxHighlight
                          language="javascript"
                          wrapLongLines={true}
                          style={{
                            ...a11yDark,
                            'code[class*="language-"]': {
                              color: '#9c7a9d' // Ubah warna menjadi hijau
                            }
                          }}
                        >
                          {part.code}
                        </SyntaxHighlight>
                        <CopyToClipboard
                          text={part.code}
                          onCopy={() => handleCopy(index, i)}
                        >
                          <button className="copy-button">
                            <img
                              src={part.copied ? check : copy}
                              className="copy"
                              alt=""
                            />
                          </button>
                        </CopyToClipboard>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
          {isTyping && (
            <div className="message ai-message typing-indicator">
              <p>👾 Nova Ai :</p>
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </div>
          )}
          {isImageProcessing && (
            <div className="message ai-message typing-indicator">
              <p>Processing image...</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={toggleInputVisibility}
          className="toggle-button"
        >
          {isInputVisible ? "" : ""}
        </button>
        {isInputVisible && (
          <form style={{ display: 'flex', alignItems: 'center', width: '100%' }} className="input-form" onSubmit={(e) => e.preventDefault()}>
            <div style={{  backgroundColor: '#2e2e2e', color: 'white', padding: '5px', borderRadius: '5px',display: 'flex', alignItems: 'center', gap: '5px', marginRight: '10px' }} className="micc">
            <button type="button" onClick={handleSpeechToggle} className="speech-button">
              <img
                style={{ width: '20px' }}
                src={isListening ? mic : micoff}
                alt=""
              />
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload"
              style={{ width: '30px' }}
            />
            </div>
            <input
              id="content"
              type="text"
              placeholder="Enter text"
              className="input-field"
              name="content"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ width: '80%' }}
            />
            <button type="button" onClick={handleSubmit} className="submit-button">
              <img src={share} alt="" />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default App;
