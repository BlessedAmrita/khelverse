'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Send, Check, CheckCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  orderBy,
  onSnapshot,
  setDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';

const ChatInterface = React.memo(({
  currentCoach,
  selectedAthlete,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleKeyDown,
  messagesEndRef,
}) => (
  <div className="flex h-[80vh] max-h-[700px] overflow-hidden rounded-xl bg-black shadow-lg">
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-khelverse-purple/10 p-3 flex items-center gap-2 bg-black">
        <Avatar className="h-8 w-8 ring-1 ring-khelverse-purple/20">
          {selectedAthlete?.photoURL ? (
            <img src={selectedAthlete.photoURL} alt={selectedAthlete.name} className="rounded-full" />
          ) : (
            <AvatarFallback>{selectedAthlete?.initials}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="text-white text-sm font-medium">{selectedAthlete?.name}</h3>
          <span className="text-xs text-emerald-500">{selectedAthlete?.status}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="overflow-y-auto flex-1 p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.senderId === currentCoach.uid ? 'justify-end' : 'justify-start'}`}>
            {msg.senderId !== currentCoach.uid && (
              <Avatar className="h-8 w-8 ring-1 ring-khelverse-purple/20">
                <AvatarFallback>{msg.senderInitials}</AvatarFallback>
              </Avatar>
            )}
            <div className={`max-w-[70%] p-3 text-sm rounded-2xl relative ${msg.senderId === currentCoach.uid
              ? 'bg-gradient-to-r from-apts-purple-dark to-black/20 text-white rounded-br-none'
              : 'bg-gradient-to-r from-black to-apts-purple-dark text-white rounded-bl-none'}`}>
              {msg.text}
              <div className="flex justify-end items-center gap-1 mt-1 text-white/70 text-xs">
                {msg.time}
                {msg.senderId === currentCoach.uid && (
                  msg.seen ? <CheckCheck size={14} /> : <Check size={14} />
                )}
              </div>
            </div>
            {msg.senderId === currentCoach.uid && (
              <Avatar className="h-8 w-8 bg-khelverse-purple text-white" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 bg-black">
        <div className="flex gap-2 items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="bg-[#1a1a1a] border-khelverse-purple/10 text-white rounded-full"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-khelverse-purple text-white rounded-full hover:opacity-90 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
));
ChatInterface.displayName = 'ChatInterface';

const MessagingOverview = () => {
  const currentCoach = useSelector((state) => state.user);
  const [chatSummaries, setChatSummaries] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
  if (!currentCoach?.uid) return;

  const q = query(collection(db, 'requests'), where('toId', '==', currentCoach.uid), where('status', '==', 'accepted'));

  let unsubscribers = [];

  const fetchChats = async () => {
    const snapshot = await getDocs(q);
    const seen = new Set();

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const athleteId = data.fromId;
      if (!athleteId || seen.has(athleteId)) continue;
      seen.add(athleteId);

      const userSnap = await getDoc(doc(db, 'users', athleteId));
      if (!userSnap.exists()) continue;
      const userData = userSnap.data();

      const chatId = `chat_${[athleteId, currentCoach.uid].sort().join('_')}`;
      const chatDocRef = doc(db, 'chats', chatId);

      // Setup listener for each chat
      const unsub = onSnapshot(chatDocRef, (chatSnap) => {
        const chatData = chatSnap.exists() ? chatSnap.data() : {};

        setChatSummaries((prev) => {
          const others = prev.filter(c => c.id !== athleteId);
          return [
            ...others,
            {
              id: athleteId,
              name: userData.name,
              initials: userData.name?.charAt(0) || 'A',
              photoURL: userData.photoURL || '',
              lastMessage: chatData.lastMessage || '',
              time: chatData.lastMessageTimestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '',
              status: userData.status || '',
            }
          ].sort((a, b) => a.name.localeCompare(b.name)); // optional sort
        });

        // Auto-select first athlete if none selected
        setSelectedAthlete((prev) => prev || {
          id: athleteId,
          name: userData.name,
          initials: userData.name?.charAt(0) || 'A',
          photoURL: userData.photoURL || '',
          status: userData.status || '',
        });
      });

      unsubscribers.push(unsub);
    }
  };

  fetchChats();

  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
}, [currentCoach?.uid]);


  useEffect(() => {
    if (!currentCoach?.uid || !selectedAthlete?.id) return;

    const chatId = `chat_${[currentCoach.uid, selectedAthlete.id].sort().join('_')}`;
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp'));

    const unsub = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '',
      }));
      setMessages(msgs);

      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      // Mark all messages as seen when viewing the chat
      snapshot.docs.forEach(async (docSnap) => {
        const data = docSnap.data();
        if (!data.seen && data.senderId !== currentCoach.uid) {
          await updateDoc(doc(db, 'chats', chatId, 'messages', docSnap.id), { seen: true });
        }
      });
    });

    return () => unsub();
  }, [currentCoach?.uid, selectedAthlete?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentCoach?.uid || !selectedAthlete?.id) return;

    const chatId = `chat_${[currentCoach.uid, selectedAthlete.id].sort().join('_')}`;
    const chatDocRef = doc(db, 'chats', chatId);

    try {
      await setDoc(chatDocRef, {
        participants: [currentCoach.uid, selectedAthlete.id],
        lastMessage: newMessage,
        lastMessageTimestamp: serverTimestamp(),
      }, { merge: true });

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: currentCoach.uid,
        senderName: currentCoach.name,
        senderInitials: currentCoach.name?.charAt(0).toUpperCase() || 'C',
        text: newMessage,
        timestamp: serverTimestamp(),
        seen: false,
      });

      setNewMessage('');
    } catch (e) {
      console.error('🔥 Message send failed:', e);
      alert('Failed to send message.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className='glass-card bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl p-4 border border-khelverse-purple/10'>
      <div className='flex justify-between mb-4'>
        <h3 className='text-lg font-sprintura text-white flex gap-2 items-center'>
          <MessageSquare size={20} className='text-khelverse-purple' />
          Messages
        </h3>
        <Dialog modal={false}>
          <DialogTrigger asChild>
            <Button variant='outline' className='text-khelverse-purple border-khelverse-purple/20 bg-black/30 hover:bg-black/40'>
              Open Messenger
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[1000px] w-full p-0 bg-transparent border-khelverse-purple/20'>
            <DialogTitle className='sr-only'>Coach Messaging</DialogTitle>
            <DialogDescription className='sr-only'>Coach chat with assigned athletes</DialogDescription>

            <div className='flex flex-col md:flex-row h-[80vh] max-h-[700px] w-full overflow-hidden rounded-xl'>
              {/* Sidebar */}
              <div className="md:w-72 w-full md:max-w-sm flex-shrink-0 border-r border-khelverse-purple/10 bg-[#111111] flex flex-col">
                <div className='p-3 border-b border-khelverse-purple/10'>
                  <h3 className='text-white font-medium flex items-center gap-2 font-sprintura'>
                    <MessageSquare size={25} className='text-khelverse-purple' />
                    Messages
                  </h3>
                </div>
                <div className='flex-1'>
                  {chatSummaries.map((chat) => (
                    <div
                      key={`chat_${chat.id}`}
                      onClick={() => {
                        if (selectedAthlete?.id !== chat.id) setSelectedAthlete(chat);
                      }}
                      className={`p-3 border-b border-khelverse-purple/10 cursor-pointer hover:bg-[#1a1a1a] transition-all ${
                        selectedAthlete?.id === chat.id ? 'bg-[#1f1f1f]' : ''
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10 ring-1 ring-khelverse-purple/20'>
                          {chat.photoURL ? (
                            <img src={chat.photoURL} alt={chat.name} className='rounded-full' />
                          ) : (
                            <AvatarFallback>{chat.initials}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm font-semibold text-white truncate'>{chat.name}</span>
                            <span className='text-xs text-muted-foreground'>{chat.time}</span>
                          </div>
                          <p className='text-xs text-muted-foreground truncate w-full'>{chat.lastMessage || 'No messages yet.'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Interface */}
              <div className='flex-1'>
                {selectedAthlete && (
                  <ChatInterface
                    currentCoach={currentCoach}
                    selectedAthlete={selectedAthlete}
                    messages={messages}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                    handleKeyDown={handleKeyDown}
                    messagesEndRef={messagesEndRef}
                  />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MessagingOverview;
