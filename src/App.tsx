import React, { useState, useRef, useEffect } from 'react';
import { Settings, MessageCircle, Home, BarChart2, Newspaper, ArrowLeft, Megaphone, Dribbble, ImagePlus, Mic, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

type PlayerId = 'lebron' | 'curry' | 'durant';

interface PlayerData {
  id: PlayerId;
  name: string;
  englishName: string;
  team: string;
  ppg: string;
  rpg: string;
  apg: string;
  avatarUrl: string;
  chatAvatarUrl?: string;
  actionUrl: string;
  teamBadgeColor: string;
  buttonClass: string;
}

const PLAYERS: PlayerData[] = [
  {
    id: 'lebron',
    name: '勒布朗·詹姆斯',
    englishName: 'LeBron James',
    team: '洛杉矶湖人',
    ppg: '20.9',
    rpg: '6.1',
    apg: '7.2',
    avatarUrl: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    chatAvatarUrl: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    actionUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDbCdX2vKg5LmAUO2NJrJnCeYLXnjiv5Eape2RIIipUjBDBaSE99aUpF7eNiQinpjTNVz9PCEwb2BiKnLU50jplXOi_r8eCJSSX7Dk3FV1mB1LYF0SvFSDVgcNRRLQwIYwTHm6puzDSqB2cFa47BLVLXs4AXa_SNSf689p-bICw5WTgI4_7R0pH7CDoX6QQpRHiRZ2aHQRtNuba9tUiVLcKUD26zsCvYBZA47atIZVK_UL_eM8WJcBmO36sL-q2Gtb6nfTEzRrYJY',
    teamBadgeColor: 'bg-surface-variant text-on-surface-variant',
    buttonClass: 'bg-surface-variant/20 backdrop-blur-md border border-outline-variant/30 text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300',
  },
  {
    id: 'curry',
    name: '斯蒂芬·库里',
    englishName: 'Stephen Curry',
    team: '金州勇士',
    ppg: '26.6',
    rpg: '3.6',
    apg: '4.7',
    avatarUrl: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
    chatAvatarUrl: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
    actionUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5MQdPSFnFQMwgNWHRsuj6oWW3YlCsIR1zu_EAHuIRFejJ_zcL8SUz0F8ep5JDhKiw0DHvhg3rAikhauE1XVAdRoYNmyssXlwKOt899aYluAMIifXhGRrjVF9xCVlcLeNmswYUmNdozolO-6VXEkZmxuRcoh91Q5ubYUuldhqop9BgjLgU4BzEAdxrtAXiWH9PIW23Xj46SsBPgkOgnX7UqLiC984Gsr5_ZSIJ4-E5wpJKOs8Cw1SSF6M2V-yf46m1kaT1Upa8h-0',
    teamBadgeColor: 'bg-surface-variant text-on-surface-variant',
    buttonClass: 'bg-surface-variant/20 backdrop-blur-md border border-outline-variant/30 text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300',
  },
  {
    id: 'durant',
    name: '凯文·杜兰特',
    englishName: 'Kevin Durant',
    team: '菲尼克斯太阳',
    ppg: '26.0',
    rpg: '5.5',
    apg: '4.8',
    avatarUrl: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png',
    chatAvatarUrl: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png',
    actionUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdGTHo9wr2qApDzCUSlqMGxgYEE4ErTd3b6NyqJYkYjf4Vdtnjnb9cQWSYj2ZXliFO_aB29FJZwNReFDe9h2UpyCoZAZSJnnzlfkC4g00SMBl8CCUl63--KMjyakMiadYQTznk_vYpYYIXeTD1Hur4DO4EZrWyf1o3DlkTK5bpfhDduEXNHbadLGwBkHZKL4cvk9PmtrSwsHUe3yZxTbaj6flhIylC_p8Kgl2sBdgvd-eiWyO02UDrvFDv3325WDQD6P0lDiU67A8',
    teamBadgeColor: 'bg-surface-variant text-on-surface-variant',
    buttonClass: 'bg-surface-variant/20 backdrop-blur-md border border-outline-variant/30 text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300',
  }
];

const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuC7QC8S8PG8e9LeSlL_iizMsEAi0-iufoztDGrXFqD6gLqNUNdOEZBhRZ3vmocJhFiOzCS2BYJcNjR2UVe7uqM-JWtozxP5R7k0hXbr61goDKVfG3ZYtYnrhbjfxTJDTiVP75SZnXHmk2MqMNheB-PL0N9jgcqNelxA2x2O_ohcGx7gBYYnQeG46XHMWXcw5aVYWn1ZJW-VXW8xLjVOCIDItp4Pwk5brNd7pQCDPECDow6YfwfGVrURLpN8CuTu5EPRIKezhXFIYz0";

export default function App() {
  const [view, setView] = useState<'home' | 'chat'>('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<PlayerId | null>(null);

  const handleStartChat = (id: PlayerId) => {
    setSelectedPlayerId(id);
    setView('chat');
  };

  const handleBack = () => {
    setView('home');
    setSelectedPlayerId(null);
  };

  return (
    <div className="bg-surface text-on-surface font-body overflow-x-hidden min-h-screen">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pb-24 md:pb-0"
          >
            <HomeView onStartChat={handleStartChat} />
          </motion.div>
        )}
        {view === 'chat' && selectedPlayerId && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-screen overflow-hidden"
          >
            <ChatView player={PLAYERS.find(p => p.id === selectedPlayerId)!} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HomeView({ onStartChat }: { onStartChat: (id: PlayerId) => void }) {
  return (
    <>
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-[#111318]/80 backdrop-blur-xl bg-gradient-to-b from-[#111318] to-transparent">
        <div className="flex items-center gap-3">
          <img
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-outline-variant"
            src={USER_AVATAR}
          />
        </div>
        <h1 className="font-headline font-black tracking-tighter uppercase text-xl text-white dark:text-[#b1c6ff] scale-95 active:scale-90 transition-transform cursor-pointer">
          THE ARENA
        </h1>
        <button className="hover:opacity-80 transition-opacity p-2 text-[#b1c6ff] dark:text-[#1d428a]">
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 px-4 max-w-7xl mx-auto flex flex-col gap-8 pb-32">
        <section className="flex flex-col gap-2">
          <h2 className="font-headline text-4xl font-black text-on-surface tracking-tighter uppercase">球星对阵</h2>
          <p className="font-body text-outline text-sm">选择一位超级巨星，开启属于你的场上对话。</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLAYERS.map((player) => (
            <div key={player.id} className="relative bg-surface-container-low rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] group border border-outline-variant/15 flex flex-col justify-end min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent z-10 pointer-events-none"></div>
              <img
                alt={player.name}
                className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-700"
                src={player.actionUrl}
              />
              <div className="relative z-20 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <img
                    alt="Avatar"
                    className="w-16 h-16 rounded-full border-2 border-primary object-cover"
                    src={player.avatarUrl}
                  />
                  <div className="flex flex-col items-start pt-1">
                    <h3 className="font-headline text-3xl font-black text-on-surface uppercase tracking-tight leading-none mb-1">{player.name}</h3>
                    <span className="font-headline text-[11px] font-bold text-outline uppercase tracking-widest mb-1.5">{player.englishName}</span>
                    <span className={`inline-block font-label text-[10px] font-bold px-2 py-0.5 rounded tracking-widest ${player.teamBadgeColor}`}>
                      {player.team}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 font-label text-sm text-on-surface-variant">
                  <div className="flex flex-col">
                    <span className="text-outline text-[10px] uppercase">PPG</span>
                    <span className="font-bold text-on-surface text-lg">{player.ppg}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-outline text-[10px] uppercase">RPG</span>
                    <span className="font-bold text-on-surface text-lg">{player.rpg}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-outline text-[10px] uppercase">APG</span>
                    <span className="font-bold text-on-surface text-lg">{player.apg}</span>
                  </div>
                </div>
                <button
                  onClick={() => onStartChat(player.id)}
                  className={`w-full font-body font-bold py-3 rounded-lg flex items-center justify-center gap-2 active:scale-98 transition-all ${player.buttonClass}`}
                >
                  <MessageCircle className="w-5 h-5" />
                  开始对话
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-4 bg-[#111318]/70 backdrop-blur-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.5)] z-50 rounded-t-[2rem]">
        <a className="flex flex-col items-center justify-center bg-gradient-to-br from-[#1d428a] to-[#111318] text-white rounded-xl px-5 py-2 scale-110 duration-300 ease-out transition-colors cursor-pointer" href="#">
          <Home className="w-6 h-6 mb-1" />
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-gray-500 py-2 hover:text-white transition-colors cursor-pointer" href="#">
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">Chat</span>
        </a>
        <a className="flex flex-col items-center justify-center text-gray-500 py-2 hover:text-white transition-colors cursor-pointer" href="#">
          <BarChart2 className="w-6 h-6 mb-1" />
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">Stats</span>
        </a>
        <a className="flex flex-col items-center justify-center text-gray-500 py-2 hover:text-white transition-colors cursor-pointer" href="#">
          <Newspaper className="w-6 h-6 mb-1" />
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">News</span>
        </a>
      </nav>
    </>
  );
}

function ChatView({ player, onBack }: { player: PlayerData; onBack: () => void }) {
  const avatarToUse = player.chatAvatarUrl || player.avatarUrl;
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<{id: string, role: 'user' | 'model', text: string, isStreaming?: boolean, time: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in the environment.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      chatRef.current = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are ${player.name} (${player.englishName}), playing for ${player.team}.
The current season is 2025-2026. Your 2025-2026 regular season stats are: ${player.ppg} PPG, ${player.rpg} RPG, ${player.apg} APG.
You MUST adopt the persona of this real-world NBA player. You will answer truthfully according to your stats and career factually. When discussing your stats, rely on the provided numbers and use https://sports.qq.com/nba as your primary data reference source. Respond conversationally, in character, usually in Chinese (unless the user uses English). Be confident, humble, and professional. Use natural spoken style, not robotic. When asked about your current stats, confidently state your 2025-2026 stats provided here.
IMPORTANT: Keep your answers CONCISE, brief, and to the point. Do not give overly detailed or long-winded responses.`,
        }
      });
      
      const nowMs = new Date();
      setMessages([
        {
          id: "init",
          role: 'model',
          text: `Hey! 我是${player.name}。很高兴和你聊天。有什么想问我的吗？`,
          time: nowMs.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e: any) {
      console.error("Failed to initialize AI:", e);
      const nowMs = new Date();
      setMessages([
        {
          id: "init_err",
          role: 'model',
          text: `[系统提示: 聊天模块初始化失败 - ${e?.message || JSON.stringify(e)}]`,
          time: nowMs.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [player]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || !chatRef.current) return;
    
    const userText = input.trim();
    setInput('');
    const userMsgId = Date.now().toString();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText, time: timeNow }]);
    setIsTyping(true);
    
    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', isStreaming: true, time: timeNow }]);
    
    let fullText = "";
    try {
      const responseStream = await chatRef.current.sendMessageStream({ message: userText });
      for await (const chunk of responseStream) {
         fullText += chunk.text || "";
         setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.message || "Unknown error";
      fullText += `\n[发送失败，请稍后重试 | 错误详情: ${errorMessage}]`;
    } finally {
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText, isStreaming: false } : m));
      setIsTyping(false);
    }
  };

  return (
    <>
      <header className="flex justify-between items-center w-full px-6 py-4 bg-[#111318]/80 backdrop-blur-xl z-50 bg-gradient-to-b from-[#111318] to-transparent shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:opacity-80 transition-opacity scale-95 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
               <img alt={player.name} className="object-cover w-full h-full" src={avatarToUse} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-headline font-bold tracking-tight uppercase text-[#b1c6ff] dark:text-[#1d428a] text-lg leading-tight">{player.name}</h1>
              <span className="font-headline text-[10px] font-bold text-[#b1c6ff]/70 dark:text-[#1d428a]/70 uppercase tracking-wider">{player.englishName}</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                <span className="font-label text-xs text-on-surface-variant">在线 (Online)</span>
              </div>
            </div>
          </div>
        </div>
        <button className="p-2 hover:opacity-80 transition-opacity scale-95 active:scale-90 transition-transform">
          <Settings className="w-6 h-6 text-white" />
        </button>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6 w-full max-w-2xl mx-auto pb-32 scroll-smooth">
        <div className="flex justify-center w-full">
           <p className="font-body text-xs text-outline text-center max-w-xs bg-surface-container p-3 rounded-lg border border-surface-variant">
             You are now chatting with {player.name}. The AI will respond in-character based on real 2025-26 data.
           </p>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full group gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-surface-variant mt-auto mb-5">
                <img alt="Avatar" className="object-cover w-full h-full" src={avatarToUse} />
              </div>
            )}
            
            <div className={`flex flex-col max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-3 shadow-md relative overflow-hidden font-body text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary-container text-on-primary-container rounded-tr-sm font-bold' 
                  : 'bg-surface-container-high text-on-surface rounded-tl-sm border border-outline-variant/20 whitespace-pre-wrap'
              }`}>
                {msg.role === 'user' && <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>}
                
                {msg.isStreaming && !msg.text ? (
                  <div className="flex gap-1 items-center h-5 w-8 justify-center">
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
              <span className={`font-label text-[10px] text-outline mt-1 ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                {msg.time} {msg.role === 'user' && '· Sent'}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && !messages.find(m => m.isStreaming) && (
          <div className="flex justify-start w-full group gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-surface-variant mt-auto mb-5 opacity-50">
              <img alt="Avatar" className="object-cover w-full h-full" src={avatarToUse} />
            </div>
            <div className="bg-surface-container-high text-on-surface rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-outline-variant/20 flex gap-1 items-center h-10 w-16 justify-center">
              <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-surface-container-lowest z-50 p-4 shrink-0">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <button className="p-2.5 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors flex-shrink-0">
            <Dribbble className="w-5 h-5" />
          </button>
          
          <div className="flex-1 bg-surface-container-low rounded-2xl border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all flex items-center min-h-[44px]">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-body text-on-surface resize-none py-3 px-4 max-h-32 rounded-2xl outline-none"
              placeholder="输入消息 (Type a message)..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{ scrollbarWidth: 'none' }}
            />
            <button className="p-2 mr-1 text-on-surface-variant hover:text-tertiary transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-colors flex-shrink-0 shadow-lg scale-95 active:scale-90 flex items-center justify-center h-11 w-11 disabled:opacity-50 disabled:active:scale-95"
          >
            <Send className="w-5 h-5" fill="currentColor" />
          </button>
        </div>
      </div>
    </>
  );
}
