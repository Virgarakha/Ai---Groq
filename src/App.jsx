import { useState } from "react";
import { requestToGroqAi } from "./utils/groq";
import {Light as SyntaxHighlight} from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import './App.css';

function App() {
  const [data, setData] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async () => {
    const ai = await requestToGroqAi(inputValue);
    setData(ai);
  };

  return (
    <main className="flex flex-col min-h-[80vh] justify-center items-center max-w-xl w-full mx-auto">
      <h1 className="text-4xl text-white font-bold">Bakol Ai</h1>
      <p className="text-white">Ai e bakol tugas boss</p>
      <div className="max-w-xl w-full mx-auto">
        {data ? (
        <SyntaxHighlight language="swift" style={darcula} wrapLongLines={true}>
        {data}
        </SyntaxHighlight>
         ) : null}
      </div>
      <form className="flex flex-col gap-4 py-4 w-full" onSubmit={(e) => e.preventDefault()}>
        <input 
          id="content" 
          type="text" 
          placeholder="Masukan kata" 
          className="py-2 px-4 text-md rounded-md" 
          name="content"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="button" onClick={handleSubmit} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>
      
    </main>
  );
}

export default App;
