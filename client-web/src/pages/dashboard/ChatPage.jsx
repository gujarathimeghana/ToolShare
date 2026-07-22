import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import UserAvatar from '../../components/UserAvatar';
import api from '../../services/api';
import { FiSend, FiImage, FiMapPin } from 'react-icons/fi';

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const recipientParam = searchParams.get('recipient');
  const { user } = useAuth();
  const { socket } = useSocket();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  // Initialize or fetch chats
  useEffect(() => {
    const initChat = async () => {
      try {
        const chatsRes = await api.get('/chats');
        setChats(chatsRes.data);

        if (recipientParam) {
          const res = await api.post('/chats/init', { recipientId: recipientParam });
          setActiveChat(res.data);
        } else if (chatsRes.data.length > 0) {
          setActiveChat(chatsRes.data[0]);
        }
      } catch (err) {
        console.error('Chat init error:', err);
      }
    };
    initChat();
  }, [recipientParam]);

  // Load active chat messages & join socket room
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chats/${activeChat._id}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error('Fetch messages error:', err);
      }
    };
    fetchMessages();

    if (socket) {
      socket.emit('join_chat', activeChat._id);
      socket.on('new_message', (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });
    }

    return () => {
      if (socket) socket.off('new_message');
    };
  }, [activeChat, socket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeChat) return;

    const recipient = activeChat.participants.find((p) => p._id !== user._id);
    try {
      const res = await api.post('/chats/message', {
        chatId: activeChat._id,
        recipientId: recipient._id,
        text
      });
      setMessages((prev) => [...prev, res.data]);
      setText('');

      if (socket) {
        socket.emit('send_message', {
          chatId: activeChat._id,
          senderId: user._id,
          recipientId: recipient._id,
          text
        });
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const activeRecipient = activeChat?.participants.find((p) => p._id !== user._id);

  return (
    <div className="h-[650px] rounded-3xl glassmorphism border border-slate-200/80 dark:border-slate-800/80 overflow-hidden flex shadow-2xl">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white/50 dark:bg-slate-900/50">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-black text-lg text-slate-900 dark:text-white">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {chats.map((c) => {
            const partner = c.participants.find((p) => p._id !== user._id);
            const isSelected = activeChat?._id === c._id;
            return (
              <button
                key={c._id}
                onClick={() => setActiveChat(c)}
                className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                  isSelected ? 'bg-indigo-500/10 border-l-4 border-indigo-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <UserAvatar name={partner?.name || 'User'} avatarUrl="" size="md" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{partner?.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{c.lastMessage || 'No messages yet'}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Chat Window */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <UserAvatar name={activeRecipient?.name || 'User'} avatarUrl="" size="md" />
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white">{activeRecipient?.name}</h3>
                <span className="text-xs text-emerald-500 font-bold">● Active Now</span>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m, idx) => {
                const isMine = m.sender._id === user._id || m.sender === user._id;
                return (
                  <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-sm font-medium ${
                        isMine
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className={`text-[10px] block mt-1 ${isMine ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none text-slate-900 dark:text-white font-medium"
              />
              <button type="submit" className="p-3.5 rounded-xl text-white btn-gradient shadow-md hover:scale-105 transition-transform">
                <FiSend className="text-lg" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-semibold">
            Select a conversation to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
