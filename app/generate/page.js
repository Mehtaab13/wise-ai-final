'use client';
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import { Container, Box, Button, TextField, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import logo from '../components/logo.png'; 
import Navbar from "../components/Navbar";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey I am a social advice bot! Do you need any advice on any social problem you may have?",
    }
  ]);

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [chatName, setChatName] = useState('');

  useEffect(() => {
    if (user) {
      const fetchMessages = async () => {
        const docRef = doc(db, "chats", user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMessages(docSnap.data().messages);
        } else {
          console.log("No chat history found");
        }
      };
      fetchMessages();
    } else {
      setMessages([
        {
          role: 'assistant',
          content: "Hey I am a social advice bot! Do you need any advice on any social problem you may have?",
        }
      ]);
    }
  }, [user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    const newMessages = [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ];

    setMessage('');
    setMessages(newMessages);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessages),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let finalMessages = [...newMessages];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        finalMessages = finalMessages.map((msg, index) => {
          if (index === finalMessages.length - 1) {
            return { ...msg, content: msg.content + text };
          }
          return msg;
        });

        setMessages(finalMessages);
      }

      if (user) {
        const docRef = doc(db, "chats", user.id);
        await setDoc(docRef, { messages: finalMessages });
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSaveChat = () => {
    if (user) {
      setOpenDialog(true);
    } else {
      alert("User not authenticated. Unable to save chat history.");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    if (!chatName.trim()) {
      alert("Please enter a chat name.");
      return;
    }
    try {
      const docRef = doc(db, "chats", user.id);
      await setDoc(docRef, { name: chatName, messages: messages });
      alert("Chat history saved successfully!");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving chat history:", error);
      alert("Failed to save chat history.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', bgcolor: "#fff5f7", display: 'flex', flexDirection: 'column', border: '1px solid #ff99aa', borderRadius: '1px'}}>
      <Navbar />
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        p={2}
        mt={8}
        sx={{ overflowY: "hidden" }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pr: 2,
            pb: 12,
            wordWrap: "break-word",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              mb={1}
              p={2}
              borderRadius={2}
              sx={{
                display: 'flex',
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                alignItems: 'center', // This ensures vertical centering of the logo with the text
              }}
            >
              {msg.role === "assistant" && (
                <Image
                  src={logo}
                  alt="AI Logo"
                  width={30}
                  height={30}
                  style={{ marginRight: 8 }}
                />
              )}
              <Box
                sx={{
                  bgcolor: msg.role === "user" ? "#BC61F5" : "#ff99aa",
                  p: 2,
                  borderRadius: 2,
                  color: "#fff",
                  maxWidth: "80%",
                  overflowWrap: "break-word",
                  textOverflow: "ellipsis",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
          <Box ref={messagesEndRef} />
        </Box>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: '#ff99aa',
          p: 2,
          borderTop: '1px solid #ff99aa',
          zIndex: 10,
          maxWidth: 'lg',
          m: 'auto'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              bgcolor: "#ffe6e9",
              color: "#000",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ff99aa",
                },
                "&:hover fieldset": {
                  borderColor: "#ff6699",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff6699",
                },
                "& input, & textarea": {
                  color: "#696969",
                },
              },
            }}
          />

          <Button
            variant="contained"
            sx={{
              bgcolor: "#ffe6e9",
              "&:hover": {
                bgcolor: "#ff99aa",
              },
              color: "#696969"
            }}
            onClick={sendMessage}
            disabled={isLoading}
          >
            Send
          </Button>
        </Stack>
      </Box>

      {/* Dialog for saving chat */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Save Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chat Name"
            fullWidth
            variant="outlined"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ff99aa",
                },
                "&:hover fieldset": {
                  borderColor: "#ff6699",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ff6699",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} sx={{ color: "#ff6699" }}>Cancel</Button>
          <Button onClick={handleSave} sx={{ color: "#ff6699" }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
