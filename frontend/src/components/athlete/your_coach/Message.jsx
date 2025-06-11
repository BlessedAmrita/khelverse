'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MessageSquare, Send, Check, CheckCheck, ChevronLeft } from 'lucide-react';
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
import { useSelector, useDispatch } from 'react-redux';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { monitorAuthState } from '@/firebase/auth';
import { fetchUserData } from '@/config/slices/userSlice';

const Message = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // This 'user' object should contain the athlete's UID

  const [selectedCoach, setSelectedCoach] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState('');
  const messagesEndRef = useRef(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const [athleteConnectedCoachId, setAthleteConnectedCoachId] = useState(null); // New state for connectedCoachId from Firestore

  // currentAthlete now uses data directly from the user (Redux) for basic info
  // but connectedCoachId will be fetched separately from the athlete's Firestore doc.
  const currentAthlete = user?.uid
    ? {
        uid: user.uid,
        name: user.name || user.displayName || 'Athlete',
        initials: (user.name || user.displayName || 'A').charAt(0).toUpperCase(),
      }
    : null;

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    monitorAuthState();
    if (user.uid && !user.name) {
      dispatch(fetchUserData(user.uid));
    }
  }, [user.uid, user.name, dispatch]);


  // 🎯 NEW LOGIC: Fetch the athlete's document to get the connectedCoachId
  useEffect(() => {
    if (!currentAthlete?.uid) {
      setAthleteConnectedCoachId(null);
      setSelectedCoach(null);
      return;
    }

    const fetchAthleteDoc = async () => {
      try {
        const athleteDocRef = doc(db, 'users', currentAthlete.uid);
        const athleteDocSnap = await getDoc(athleteDocRef);

        if (athleteDocSnap.exists()) {
          const athleteData = athleteDocSnap.data();
          const coachId = athleteData.connectedCoachId;
          console.log("Fetched athlete's connectedCoachId:", coachId); // For debugging
          setAthleteConnectedCoachId(coachId);
        } else {
          console.warn(`Athlete document with ID ${currentAthlete.uid} not found.`);
          setAthleteConnectedCoachId(null);
          setSelectedCoach(null);
        }
      } catch (err) {
        console.error('🔥 Error fetching athlete document:', err);
        setAthleteConnectedCoachId(null);
        setSelectedCoach(null);
      }
    };

    fetchAthleteDoc();
  }, [currentAthlete?.uid]); // Re-run when currentAthlete.uid changes

  // 🎯 NEW LOGIC: Fetch the connected coach details using the athleteConnectedCoachId
  useEffect(() => {
    if (!athleteConnectedCoachId) {
      setSelectedCoach(null);
      return;
    }

    const fetchConnectedCoachDetails = async () => {
      try {
        const coachRef = doc(db, 'users', athleteConnectedCoachId);
        const coachSnap = await getDoc(coachRef);

        if (coachSnap.exists()) {
          const coachData = coachSnap.data();
          console.log("Fetched connected coach data:", coachData); // For debugging
          setSelectedCoach({
            uid: athleteConnectedCoachId,
            name: coachData.name || 'Coach',
            initials: (coachData.name || 'C').charAt(0).toUpperCase(),
            photoURL: coachData.photoURL || '',
            status: coachData.status || '',
          });
        } else {
          console.warn(`Coach document with ID ${athleteConnectedCoachId} not found.`);
          setSelectedCoach(null);
        }
      } catch (err) {
        console.error('🔥 Error fetching connected coach details:', err);
        setSelectedCoach(null);
      }
    };

    fetchConnectedCoachDetails();
  }, [athleteConnectedCoachId]); // Re-run when athleteConnectedCoachId changes

  // 💬 Load messages
  useEffect(() => {
    if (!currentAthlete?.uid || !selectedCoach?.uid) return;

    const chatId = `chat_${[currentAthlete.uid, selectedCoach.uid].sort().join('_')}`;
    const chatDocRef = doc(db, 'chats', chatId);

    const unsubChat = onSnapshot(chatDocRef, (docSnap) => {
      const data = docSnap.data();
      if (data?.lastMessage) {
        setLastMessage(data.lastMessage);
        setLastMessageTime(
          data.lastMessageTimestamp?.toDate().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }) || ''
        );
      }
    });

    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp'));

    const unsubMsgs = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().timestamp?.toDate().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setMessages(msgs);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      snapshot.docs.forEach(async (docSnap) => {
        const msg = docSnap.data();
        if (!msg.seen && msg.senderId !== currentAthlete.uid) {
          await updateDoc(doc(db, 'chats', chatId, 'messages', docSnap.id), { seen: true });
        }
      });
    });

    return () => {
      unsubChat();
      unsubMsgs();
    };
  }, [currentAthlete?.uid, selectedCoach?.uid]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentAthlete?.uid || !selectedCoach?.uid) return;

    const chatId = `chat_${[currentAthlete.uid, selectedCoach.uid].sort().join('_')}`;
    const chatDocRef = doc(db, 'chats', chatId);

    try {
      await setDoc(chatDocRef, {
        participants: [currentAthlete.uid, selectedCoach.uid],
        lastMessage: newMessage,
        lastMessageTimestamp: serverTimestamp(),
      }, { merge: true });

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: currentAthlete.uid,
        senderName: currentAthlete.name,
        senderInitials: currentAthlete.initials,
        text: newMessage,
        timestamp: serverTimestamp(),
        seen: false,
      });

      setNewMessage('');
    } catch (e) {
      console.error('🔥 Error sending message:', e);
      alert('Failed to send message.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenChat = (coach) => {
    setSelectedCoach(coach);
    if (isMobileView) {
      setShowChatList(false);
    }
  };

  const handleBackToChatList = () => {
    setShowChatList(true);
  };

  return (
    <div className='glass-card bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-md rounded-xl p-4 border border-khelverse-purple/10 w-full'>
      <div className='flex justify-between mb-4'>
        <h3 className='text-lg font-sprintura text-white flex gap-2 items-center'>
          <MessageSquare size={20} className='text-khelverse-purple' />
          Messages
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant='outline'
              className='ml-4 text-khelverse-purple border-khelverse-purple/20 bg-black/30 hover:bg-apts-purple-light'
            >
              Open Messenger
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[1000px] w-full p-0 bg-black border-khelverse-purple/20'>
            <DialogTitle className='sr-only'>Messages</DialogTitle>
            <DialogDescription className='sr-only'>Chat interface</DialogDescription>

            <div className='flex flex-col md:flex-row h-[80vh] max-h-[700px] w-full overflow-hidden rounded-xl'>
              {/* Sidebar - Conditionally rendered based on isMobileView and showChatList */}
              {(isMobileView && showChatList) || !isMobileView ? (
                <div className='md:w-72 w-full flex-shrink-0 border-r border-khelverse-purple/10 bg-[#111111]'>
                  <div className='p-3 border-b border-khelverse-purple/10'>
                    <h3 className='text-white font-medium flex items-center gap-2 font-sprintura'>
                      <MessageSquare size={25} className='text-khelverse-purple' />
                      Messages
                    </h3>
                  </div>
                  <div className='p-3'>
                    {/* Displaying only the single selectedCoach */}
                    {selectedCoach ? (
                      <div
                        className='flex items-center gap-3 cursor-pointer hover:bg-khelverse-purple/10 p-2 rounded-lg transition-colors'
                        onClick={() => handleOpenChat(selectedCoach)}
                      >
                        <Avatar className='h-10 w-10 ring-1 ring-khelverse-purple/20'>
                          {selectedCoach.photoURL ? (
                            <img
                              src={selectedCoach.photoURL}
                              alt='Coach'
                              className='rounded-full object-cover h-full w-full'
                            />
                          ) : (
                            <AvatarFallback>{selectedCoach.initials}</AvatarFallback>
                          )}
                        </Avatar>

                        <div className='flex-1 min-w-0'>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm font-semibold text-white truncate'>
                              {selectedCoach.name}
                            </span>
                            <span className='text-xs text-muted-foreground'>{lastMessageTime}</span>
                          </div>
                          <p className='text-xs text-muted-foreground truncate w-full'>
                            {lastMessage || 'No messages yet.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className='text-sm text-gray-400'>No assigned coach found.</p>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Main Chat - Conditionally rendered based on isMobileView and showChatList */}
              {(!isMobileView || (isMobileView && !showChatList)) && selectedCoach && (
                <div className='flex-1 bg-black flex flex-col'>
                  {/* Chat Header */}
                  <div className='border-b border-khelverse-purple/30 p-3 flex items-center gap-2 bg-black'>
                    {isMobileView && (
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleBackToChatList}
                        className='text-white hover:bg-khelverse-purple/20'
                      >
                        <ChevronLeft size={24} />
                      </Button>
                    )}
                    <Avatar className='h-8 w-8 ring-1 ring-khelverse-purple/20'>
                      {selectedCoach.photoURL ? (
                        <img
                          src={selectedCoach.photoURL}
                          alt='Coach'
                          className='rounded-full object-cover h-full w-full'
                        />
                      ) : (
                        <AvatarFallback>{selectedCoach.initials}</AvatarFallback>
                      )}
                    </Avatar>

                    <div>
                      <h3 className='text-white text-sm font-medium'>{selectedCoach.name}</h3>
                      <span className='text-xs text-emerald-500'>{selectedCoach.status}</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className='overflow-y-auto flex-1 p-4 space-y-4'>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${msg.senderId === currentAthlete.uid ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.senderId !== currentAthlete.uid && (
                          <Avatar className='h-8 w-8 ring-1 ring-khelverse-purple/20'>
                            <AvatarFallback>{msg.senderInitials}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] p-3 text-sm rounded-2xl relative ${
                            msg.senderId === currentAthlete.uid
                              ? 'bg-gradient-to-r from-apts-purple-dark to-black/20 text-white rounded-br-none'
                              : 'bg-gradient-to-r from-black to-apts-purple-dark text-white rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                          <div className='flex justify-end items-center gap-1 mt-1 text-white/70 text-xs'>
                            {msg.time}
                            {msg.senderId === currentAthlete.uid &&
                              (msg.seen ? <CheckCheck size={14} /> : <Check size={14} />)}
                          </div>
                        </div>
                        {msg.senderId === currentAthlete.uid && (
                          <Avatar className='h-8 w-8 bg-khelverse-purple text-white'>
                            <AvatarFallback>{currentAthlete.initials}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className='p-3 bg-black'>
                    <div className='flex gap-2 items-center'>
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Type a message...'
                        className='bg-[#1a1a1a] border-khelverse-purple/10 text-white rounded-full'
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className='p-2 bg-khelverse-purple text-white rounded-full hover:opacity-90 disabled:opacity-50'
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Message for no coach selected on mobile when chat list is hidden */}
              {isMobileView && !selectedCoach && !showChatList && (
                <div className='flex-1 bg-black flex items-center justify-center text-gray-400'>
                  Select a chat to start messaging.
                </div>
              )}
              {/* Message for no coach found at all */}
              {!selectedCoach && !isMobileView && (
                <div className='flex-1 bg-black flex items-center justify-center text-gray-400'>
                  No assigned coach found.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Message;