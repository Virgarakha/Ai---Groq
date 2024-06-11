import { useState } from "react";
import { requestToGroqAi } from "./utils/groq";
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import './App.css';
import logo from './assets/nova.png'; // Pastikan path ke file nova.png benar
import share from './assets/share.svg'; // Pastikan path ke file nova.png benar

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(true);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    // Mengambil input terakhir dari array messages
    const lastInput = messages.length > 0 ? messages[messages.length - 1].user : "";
    // Membandingkan input saat ini dengan input terakhir
    if (inputValue === lastInput) {
      alert("Kamu tidak bisa menanyakan hal yang sama sebanyak 2x");
      return;
    }

    setIsTyping(true);
    const aiResponse = await requestToGroqAi(inputValue);
    setIsTyping(false);

    const newMessages = [...messages, { user: inputValue, ai: aiResponse }];
    setMessages(newMessages);
    setInputValue("");
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

  return (
    <main className="main-container">
      <nav className="navbar">
        <div className="navbox">
          <div className="logo2">
            <img src={logo} alt="Logo" className="logonova" />
          </div>
          <div className="link">
            <li><a href="">Docs</a></li>
            <li><a href="">Dev</a></li>
            <li><a href="">Github</a></li>
          </div>
        </div>
      </nav>

      <div className="chat-container">
        <div className="intro2">
          <h1>Introduce</h1>
          <p>BakolAi 2nd</p>
        </div>
        <div className="chat-box">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.ai ? 'ai-message' : 'user-message'}`}>
              <p>{message.ai ? '👾 Bakol Ai' : 'You'}:</p>
              <SyntaxHighlight language="javascript" style={a11yDark} wrapLongLines={true}>
                {message.ai ? message.ai : message.user}
              </SyntaxHighlight>
            </div>
          ))}
          {isTyping && (
            <div className="message ai-message typing-indicator">
              <p>👾 Bakol Ai:</p>
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={toggleInputVisibility}
          className="toggle-button"
        >
          {isInputVisible ? '' : ''}
        </button>
        {isInputVisible && (
          <form className="input-form" onSubmit={(e) => e.preventDefault()}>
            <input
              id="content"
              type="text"
              placeholder="Masukan kata"
              className="input-field"
              name="content"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="submit-button"
            >
              <img src={share} alt="" />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default App;
