import { useState } from "react";
import { requestToGroqAi } from "./utils/groq";
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import './App.css';

function App() {
  const [data, setData] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [submissionCount, setSubmissionCount] = useState(0);
  const [lastSubmittedInput, setLastSubmittedInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async () => {
    if (inputValue === lastSubmittedInput && submissionCount >= 2) {
      alert("Kamu tidak bisa menanyakan hal yang sama sebanyak 3x");
      return;
    }

    if (inputValue === lastSubmittedInput) {
      setSubmissionCount(submissionCount + 1);
    } else {
      setLastSubmittedInput(inputValue);
      setSubmissionCount(1);
    }

    setIsTyping(true);
    const ai = await requestToGroqAi(inputValue);
    setIsTyping(false);
    setData(ai);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="flex flex-col min-h-screen text-white">
      <nav className="navbar">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Bakol - Ai</h1>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-gray-400">Home</a>
            <a href="#" className="text-white hover:text-gray-400">About</a>
            <a href="https://github.com/Virgarakha/bakolai" className="text-white hover:text-gray-400">Github</a>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <h1 className="text-4xl text-white font-bold mb-4">Bakol - Ai</h1>
        <p className="text-white text-start mb-4">Product by: bakol tugas</p>
        <div className="flex flex-col w-full max-w-2xl mx-auto">
          <div className="flex flex-col rounded-lg p-4 space-y-4 mb-4">
            <div className="bg-gray-200 p-4 rounded-lg text-black">
              ►😎 Ai pintar gratis yang di develop oleh bakol tugas (bt)
            </div>
            <div className="bg-gray-200 p-4 rounded-lg text-black">
              ► 😉 Ai Gratis yang lebih cepat untuk meresponse anda!
            </div>
            <div className="bg-gray-200 p-4 rounded-lg text-black">
              ► 👌 Ai programming yang siap menjadi tools programmer!
            </div>
          </div>
          <div className="px-4">
          <div className="bg-black p-4 rounded-lg mb-4">
            {isTyping ? (
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            ) : (
              data && (
                <div>
                  <h2 className="bg-black border-b border-r border-l rounded-tl-lg rounded-tr-lg border-black p-2  text-lg text-start text-white font-bold mb-2"> 👾 Bakol Ai :</h2>
                  <SyntaxHighlight language="javascript" style={a11yDark} wrapLongLines={true}>
                    {data}
                  </SyntaxHighlight>
                </div>
              )
            )}
          </div>
          </div>
          <form className="flex flex-col gap-4 p-4" onSubmit={(e) => e.preventDefault()}>
            <input
              id="content"
              type="text"
              placeholder="Masukan kata"
              className="py-2 px-4 text-md rounded-md bg-gray-200 text-black"
              name="content"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-gray-200 hover:bg-gray-100 text-black font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
          <div className="px-4">
          <p className="text-white text-start p-0 opacity-50 mt-4">version 3.4</p>
          <div className="flex justify-between mt-4">
            <a href="https://wa.me/+6281333794278" className="text-white">Service</a>
            <a href="https://wa.me/+6281333794278" className="text-white">Developer</a>
            <a href="https://wa.me/+6281333794278" className="text-white">Docs</a>
          </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
