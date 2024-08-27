'use client'

import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import { Container, Box, Typography, Paper, TextField, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        }).then((res) => res.json()).then((data) => setFlashcards(data));
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    return (
        <Container maxWidth="false" sx={{ backgroundColor: "#1e1e1e", minHeight: "100vh", color: "#c5c6c7", display: "flex", flexDirection: "column", padding: "0" }}>
            <Navbar />
            <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontFamily: "monospace", color: "#61dafb", textAlign: 'center' }}>
                    Generate Flashcards
                </Typography>
                <Paper sx={{ p: 4, width: '100%', maxWidth: 'md', backgroundColor: "#282c34", color: "#c5c6c7", mt: 4 }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter Text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 2, backgroundColor: "#1e1e1e", color: "#c5c6c7", '& .MuiInputBase-root': { color: "#c5c6c7" }, '& .MuiInputLabel-root': { color: "#61dafb" } }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{ mt: 2, backgroundColor: "#61dafb", color: "#1e1e1e" }}
                    >
                        Submit
                    </Button>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant='h5' sx={{ fontFamily: "monospace", color: "#61dafb", mb: 2, textAlign: 'center' }}>
                        Flashcards Preview
                    </Typography>
                    <Grid container spacing={2} sx={{ px: 2 }}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card sx={{ backgroundColor: "#282c34", color: "#c5c6c7" }}>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    perspective: '1000px',
                                                    '& > div': {
                                                        transition: 'transform 0.6s',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box'
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)'
                                                    },
                                                }}>
                                                <div>
                                                    <div>
                                                        <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained' color='secondary' onClick={handleOpen} sx={{ backgroundColor: "#61dafb", color: "#1e1e1e" }}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ backgroundColor: "#282c34", color: "#61dafb" }}>Save Flashcards</DialogTitle>
                <DialogContent sx={{ backgroundColor: "#1e1e1e", color: "#c5c6c7" }}>
                    <DialogContentText sx={{ color: "#c5c6c7" }}>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        sx={{
                            backgroundColor: "#282c34",
                            color: "#c5c6c7",
                            '& .MuiInputBase-root': { color: "#c5c6c7" },
                            '& .MuiInputLabel-root': { color: "#61dafb" }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "#282c34" }}>
                    <Button onClick={handleClose} sx={{ color: "#61dafb" }}>
                        Cancel
                    </Button>
                    <Button onClick={saveFlashcards} sx={{ color: "#61dafb" }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}