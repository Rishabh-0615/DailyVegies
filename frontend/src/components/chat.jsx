import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import FarmerNavbar from "../pages/FarmerNavbar";

const FarmToTableChat = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;
    
    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");
    
    setChatHistory(prev => [...prev, { type: 'question', content: currentQuestion }]);
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDIxYLzYWYYRv_Me8ALPfxAYCo6GmU6d2I`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: question }] }],
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      setChatHistory(prev => [...prev, { type: 'answer', content: aiResponse }]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  // Helper function to format text with newlines
  const formatText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100">
        <FarmerNavbar />
        <div className="h-full max-w-4xl mx-auto flex flex-col p-4 md:p-6">
          
          <header className="text-center py-4 mb-2">
            <a href="https://github.com/Vishesh-Pandey/chat-ai" 
               target="_blank" 
               rel="noopener noreferrer"
               className="group inline-block transition-transform hover:scale-105">
              <h1 className="text-3xl md:text-4xl font-bold text-green-700 group-hover:text-green-800 transition-colors">
                Farm to Table Assistant
              </h1>
              <div className="h-1 w-0 bg-green-500 mx-auto mt-1 group-hover:w-full transition-all duration-300"></div>
            </a>
          </header>

          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto mb-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg p-4 md:p-6 transition-all"
          >
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 md:p-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 md:p-8 max-w-2xl shadow-sm border border-green-100">
                  <h2 className="text-2xl font-bold text-green-700 mb-6">Welcome to Your Farm to Table Guide! 🌱</h2>
                  <p className="text-gray-600 mb-6">
                    I'm here to help you with all your sustainable food and farming questions. Ask me about:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-green-100 transition-all hover:shadow-md hover:bg-white hover:border-green-200">
                      <span className="text-green-600 text-xl mr-2">🌿</span> Seasonal Produce
                    </div>
                    <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-green-100 transition-all hover:shadow-md hover:bg-white hover:border-green-200">
                      <span className="text-green-600 text-xl mr-2">👨‍🌾</span> Local Farmers
                    </div>
                    <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-green-100 transition-all hover:shadow-md hover:bg-white hover:border-green-200">
                      <span className="text-green-600 text-xl mr-2">🥗</span> Market Demand
                    </div>
                    <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-green-100 transition-all hover:shadow-md hover:bg-white hover:border-green-200">
                      <span className="text-green-600 text-xl mr-2">♻️</span> Sustainability
                    </div>
                  </div>
                  <p className="text-gray-500 mt-8 text-sm font-medium">
                    Start your sustainable food journey by asking a question below!
                  </p>
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`mb-6 ${chat.type === 'question' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-[85%] p-4 rounded-2xl whitespace-pre-wrap shadow-sm ${
                      chat.type === 'question' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-br-none'
                        : 'bg-gradient-to-r from-green-50 to-emerald-50 text-gray-800 rounded-bl-none border border-green-100'
                    }`}>
                      {formatText(chat.content)}
                    </div>
                  </div>
                ))}
              </>
            )}
            {generatingAnswer && (
              <div className="text-left">
                <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl shadow-sm border border-green-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse delay-300"></div>
                    <span>Growing response... 🌱</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={generateAnswer} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-green-100 transition-all">
            <div className="flex gap-3">
              <textarea
                required
                className="flex-1 border border-green-200 rounded-lg p-3 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 focus:outline-none resize-none shadow-sm transition-all"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about sustainable food, farming, or cooking..."
                rows="2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generateAnswer(e);
                  }
                }}
              />
              <button
                type="submit"
                className={`px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-sm transition-all hover:shadow-md ${
                  generatingAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-[-2px]'
                }`}
                disabled={generatingAnswer}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-right px-2">
              Press Enter to send, Shift+Enter for new line
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FarmToTableChat;