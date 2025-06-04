import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });
const GEMINI_CONTEXT = `
A complete, transparent and scalable Web3 solution for tokenization of future harvests, carbon credit issuance, and decentralized financing for small producers built on the NERO Chain with Account Abstraction and Paymaster support that offers a 100% gasless experience for the end user oriented towards social, economic, and environmental impact. The platform allows producers to create their Smart Account without technical knowledge or gas payment to register future harvests defining type, quantity, delivery date, and price, notifying the auditor who validates sustainable practices and simultaneously authorizes the issuance of an ERC-1155 token for the harvest and an ERC-20 token for carbon credits. Next, the producer lists the harvest on the marketplace and receives funds for each sale, while the auditor logs in with AUDITOR_ROLE to analyze practices, call authorizeHarvest, and release token minting. The investor accesses gasless via Smart Account, buys harvest tokens in the marketplace, receives a ComboNFT with harvest and carbon metadata, and monitors the status of total, partial, or total failure delivery with automatic reimbursement via guarantee fund or debt NFT issuance. The management team defines the global fee in the CustomPaymaster to keep the Paymaster funded, manages onboarding with educational chatbot and Web2-like UX, and ensures fee transparency. The system includes smart contracts such as FutureHarvestToken.sol (ERC-1155), TCO2Token.sol (ERC-20), CarbonVerifier.sol, Marketplace.sol, GuaranteeFund.sol, ComboNFT.sol (ERC-721), Reputation.sol, and CustomPaymaster.sol, plus Smart Accounts, custom Paymaster, front-end in React with Tailwind and Vite, integration via Ethers.js, and metadata storage in IPFS and nft.storage. This integrated flow on the NERO Chain ensures complete traceability and ESG impact, covering scenarios of total, partial, total loss delivery, or rewards for sustainable practices, making the solution modular, scalable, and socially conscious with gasless experience for mass adoption.
`;


const ChatMessage = ({ content, sender, isTyping }) => {
  if (isTyping) {
    return (
      <div className="bg-white border-l-4 border-green-700 rounded-md p-3 max-w-[80%] self-start flex gap-1 items-center">
        {[0, 0.2, 0.4].map(delay => (
          <span
            key={delay}
            className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    );
  }

  const classes = sender === 'bot'
    ? 'bg-white border-l-4 border-green-700 self-start'
    : 'bg-green-600 text-white self-end';
  return <div className={`${classes} rounded-md p-3 max-w-[80%] shadow-sm`}>{content}</div>;
};

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { content: 'Hello! I am AgroBot, SeedSafe\'s assistant. How can I help?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  const keywords = {
    token: ['token', 'harvest', 'future', 'erc-1155', 'erc1155', 'tokenization'],
    carbon: ['carbon', 'tco2', 'tco₂', 'credit', 'environmental', 'green'],
    wallet: ['wallet', 'smart account', 'connect'],
    invest: ['invest', 'buy', 'acquire', 'support'],
    gasless: ['gas', 'fee', 'free', 'no fee', 'gasless']
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    // Add user message
    setMessages(m => [...m, { content: text, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    // Pause briefly to show typing
    setTimeout(async () => {
      const lower = text.toLowerCase();
      let reply = null;


      // if no keyword, call Gemini
      if (!reply) {
        try {
          const res = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `${GEMINI_CONTEXT}, don't use any markdown elements, just plain text, Answer only about the SeedSafe platform that I presented here: ${text}`
          });
          reply = res.text;
        } catch (err) {
          console.error('Gemini error', err);
          reply = 'Sorry, an error occurred. Please try again in a moment.';
        }
      }

      // add bot response
      setIsTyping(false);
      setMessages(m => [...m, { content: reply, sender: 'bot' }]);
    }, 800);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden h-[500px] border border-gray-200 flex flex-col">
      <div className="bg-green-700 text-white p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700">
          <i className="fas fa-robot" />
        </div>
        <h4 className="font-bold">AgroBot</h4>
      </div>
      <div className="flex-grow p-3 overflow-y-auto flex flex-col gap-3 bg-gray-50">
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
        {isTyping && <ChatMessage isTyping={true} sender="bot" />}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex p-2 border-t border-gray-200">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type your question..."
          className="flex-grow p-3 border border-gray-200 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center">
          <i className="fas fa-paper-plane" />
        </button>
      </form>
    </div>
  );
};

const ChatbotFeature = () => (
  <section className="py-12 px-8 bg-white">
    <div className="max-w-6xl mx-auto flex flex-wrap gap-12 items-center">
      <div className="flex-1 min-w-[300px]">
        <h2 className="text-3xl font-bold mb-4">
          Questions? <span className="text-green-700">Our virtual assistant can help</span>
        </h2>
        <p className="mb-6">
          Meet AgroBot, our educational chatbot that will guide you through the world of blockchain, tokens, and sustainable agriculture.
        </p>
        <ul className="mb-6">
          <li className="mb-2 flex items-center gap-2"><i className="fas fa-graduation-cap text-green-700" /> Learn about Web3 and tokenization</li>
          <li className="mb-2 flex items-center gap-2"><i className="fas fa-hands-helping text-green-700" /> Support for onboarding</li>
          <li className="mb-2 flex items-center gap-2"><i className="fas fa-question-circle text-green-700" /> Get answers about the process</li>
        </ul>
        <button className="py-3 px-6 rounded-md font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-all">
          Chat with AgroBot
        </button>
      </div>
      <div className="flex-1 min-w-[350px]">
        <ChatWindow />
      </div>
    </div>
  </section>
);

export default ChatbotFeature;