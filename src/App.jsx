import { useState } from "react";
import { requestToGroqAi } from "./utils/groq";
import {Light as SyntaxHighlight} from "react-syntax-highlighter";
import { a11yDark, darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
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
      <h1 className="text-4xl text-white font-bold">Bakol - Ai</h1>
      <p className="text-white text-start">Product by : bakol tugas</p>
      <div style={{marginTop: "20px"}} className="max-w-xl w-full mx-auto ">
        {data ? (
        <SyntaxHighlight language="javascript" style={a11yDark} wrapLongLines={true}>
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
        <button type="button" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
        <p className="text-white text-start p-0 opacity-50">versien 1.2</p>
      </form>
      <div className="bawah">
        <li><a href="https://wa.me/+6281333794278">Contact service</a></li>
        <li><a href="https://wa.me/+6281333794278">Developer</a></li>
      </div>
      <div style={{backgroundColor: "#2b2b2b", color: "#bababa", fontWeight: "400", textAlign: "start", padding: "15px"}} className="mt-10 text-white font-bold py-2 px-4 rounded w-full">
        <p>► Ai pintar gratis yang di develop oleh bakol tugas (bt)</p>
      </div>
      <div style={{backgroundColor: "#2b2b2b", color: "#bababa", fontWeight: "400", textAlign: "start", padding: "15px"}} className="mt-5 text-white font-bold py-2 px-4 rounded w-full">
        <p>► Ai Gratis yang lebih cepat untuk meresponse anda!</p>
      </div>
      <div style={{backgroundColor: "#2b2b2b", color: "#bababa", fontWeight: "400", textAlign: "start", padding: "15px"}} className="mt-5 text-white font-bold py-2 px-4 rounded w-full">
        <p>► Ai programming yang siap menjadi tools programmer!</p>
      </div>
      
    </main>
  );
}

export default App;
