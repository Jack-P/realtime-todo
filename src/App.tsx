import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, remove } from 'firebase/database';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Firebase config (replace with your own project)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const App = () => {
    const [todos, setTodos] = useState<{ id: string; text: string }[]>([]);
    const [input, setInput] = useState('');
    // @ts-ignore
    const [user, setUser] = useState<null | object>(null);
    const auth = getAuth(app);

    // Sign in anonymously on mount
    useEffect(() => {
        const login = async () => {
            const test = await signInAnonymously(auth);

            console.log(test);
        };

        login();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user); // store user state
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const todosRef = ref(db, 'todos');
        const unsubscribe = onValue(todosRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsed = Object.entries(data).map(([id, val]) => ({
                    id,
                    // @ts-ignore
                    text: val.text,
                }));
                setTodos(parsed);
            } else {
                setTodos([]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleAddTodo = () => {
        if (!input.trim()) {
            return;
        }

        const newTodoRef = push(ref(db, 'todos'));
        set(newTodoRef, { text: input });
        setInput('');
    };

    const handleDelete = (id: string) => {
        const todoRef = ref(db, `todos/${id}`);
        remove(todoRef);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    📝 Collaborative Todo List
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <TextField
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        label="Add a todo"
                        variant="outlined"
                    />
                    <Button variant="contained" onClick={handleAddTodo}>
                        Add
                    </Button>
                </Box>
                <List>
                    {todos.map((todo) => (
                        <ListItem
                            key={todo.id}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => handleDelete(todo.id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={todo.text} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export { App };
