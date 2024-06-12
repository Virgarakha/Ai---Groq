import { useState } from "react";
import { requestToGroqAi } from "./utils/groq";
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./App.css";
import logo from "./assets/nova.png";
import share from "./assets/share.svg";
import copy from "./assets/copy.svg";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(true);

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      return;
    }

    const lastInput =
      messages.length > 0 ? messages[messages.length - 1].user : "";
    if (inputValue === lastInput) {
      alert("You can't ask the same question twice in a row");
      return;
    }

    const newMessages = [
      ...messages,
      { user: inputValue, ai: null },
    ];
    setMessages(newMessages);
    setInputValue("");
    
    setIsTyping(true);
    const aiResponse = await requestToGroqAi(inputValue);
    setIsTyping(false);

    const updatedMessages = newMessages.map((message, index) => 
      index === newMessages.length - 1
        ? { user: inputValue, ai: parseResponse(aiResponse) }
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
      code: codeBlocks[index]
        ? codeBlocks[index].replace(/```/g, "").trim()
        : null,
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
        <div className="chat-box">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.ai ? "user-message" : "ai-message"
              }`}
            >
              <div className="userr">
              <p>{message.ai ? "You " : "You "}:</p>
              {message.user && <p className={message.ai ? "user-input" : ""}>{message.user}</p>}
              </div>
              <div className="kosongan"></div>
              {message.ai &&
                message.ai.map((part, i) => (
                  <div key={i} className="message-content">
                    <p>{message.ai ? "👾 Nova Ai" : "👾 Nova Ai"}:</p>
                    {part.explanation && <p>{part.explanation}</p>}
                    {part.code && (
                      <div className="code-block">
                        <SyntaxHighlight
                          language="javascript"
                          style={a11yDark}
                          wrapLongLines={true}
                        >
                          {part.code}
                        </SyntaxHighlight>
                        <CopyToClipboard text={part.code}>
                          <button className="copy-button">
                            <img src={copy} className="copy" alt="" />
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
        </div>
        <button
          type="button"
          onClick={toggleInputVisibility}
          className="toggle-button"
        >
          {isInputVisible ? "" : ""}
        </button>
        {isInputVisible && (
          <form className="input-form" onSubmit={(e) => e.preventDefault()}>
            <input
              id="content"
              type="text"
              placeholder="Enter text"
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
