import { useState } from "react";
import { requestToGroqAi } from "./utils/groq";
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import './App.css';

function App() {
  const [data, setData] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async () => {
    const ai = await requestToGroqAi(inputValue);
    setData(ai);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-900">
      <nav className="bg-gray-800 w-full p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Bakol - Ai</h1>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-gray-400">Home</a>
            <a href="#" className="text-white hover:text-gray-400">About</a>
            <a href="#" className="text-white hover:text-gray-400">Contact</a>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <h1 className="text-4xl text-white font-bold mb-4">Bakol - Ai</h1>
        <p className="text-white text-start mb-4">Product by: bakol tugas</p>
        <div className="flex flex-col w-full max-w-2xl mx-auto">
          <div className="flex flex-col bg-gray-800 rounded-lg p-4 space-y-4 mb-4">
            <div className="bg-gray-700 p-4 rounded-lg text-white">
              ► Ai pintar gratis yang di develop oleh bakol tugas (bt)
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-white">
              ► Ai Gratis yang lebih cepat untuk meresponse anda!
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-white">
              ► Ai programming yang siap menjadi tools programmer!
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            {data && (
              <div>
                <h2 className="text-lg text-start text-white font-bold mb-2">Bakol Ai :</h2>
                <SyntaxHighlight language="javascript" style={a11yDark} wrapLongLines={true}>
                  {data}
                </SyntaxHighlight>
              </div>
            )}
          </div>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              id="content"
              type="text"
              placeholder="Masukan kata"
              className="py-2 px-4 text-md rounded-md"
              name="content"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
          <p className="text-white text-start p-0 opacity-50 mt-4">versien 1.2</p>
          <div className="flex justify-between mt-4">
            <a href="https://wa.me/+6281333794278" className="text-blue-400">Service</a>
            <a href="https://wa.me/+6281333794278" className="text-blue-400">Developer</a>
            <a href="https://wa.me/+6281333794278" className="text-blue-400">Docs</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
