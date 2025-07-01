import React, { useState } from 'react';
import axios from 'axios';
import Loader from './../components/loader';
import Alert from './../components/alert';
import {apiUrl} from './../config';

function Summarize() {
const [prompt, setPrompt] = useState('');
const [loading, setLoading] = useState(false);
const [messages, setMessages] = useState([]);
const [response, setResponse] = useState('');
const [error, setError] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    setPrompt('');
    try{
      const res = await axios.post(`${apiUrl}summarize`, { prompt });
    
      setResponse(res.data.response);
      setMessages([...messages, {
        user: prompt,
        ai: res.data.response,
      }]?.reverse())
      setLoading(false);

      console.log(messages);
    }
     catch(error){
      setError(error?.message);
     }
  };
  return (
   
      <section className="p-4">
        <h1 className="text-2xl font-bold mb-4">💬 Text summarization with Lama3.1 or MistralAI</h1>
        <textarea
          className="w-full p-2 border"
          autoFocus={true}
          rows="4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Text to summarize..."
        />
         {error && <Alert type={`error`} message={error}/>}
        <button 
          disabled={loading} 
          onClick={handleSubmit} 
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          {loading && <Loader />}
          {!loading && <span>Summarize text</span>}
        </button>

        {/* <div className="whitespace-pre-line mt-4 p-4">{response}</div> */}
        { messages?.map( (message, index) => 
          <div key={index} className="mt-4">
            <div className="mb-3 whitespace-pre-line">
              <h4>User:</h4>
              {message?.user}
            </div>
            <div className='whitespace-pre-line'>
              <h4>AI:</h4>
              {message?.ai}
            </div>
          </div>
        )}
      </section>
  );
  
}

export default Summarize;