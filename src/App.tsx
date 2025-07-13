import { useEffect } from 'react';
import { Container, Typography, Paper, Box, Fade, CircularProgress } from '@mui/material';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

import { useAtom, useSetAtom } from 'jotai';
import { LOADING_STATE } from './consts/loadingStates';
import { TodoList } from './components/todoList';
import { loadingStateAtom } from './state/globalAtoms';
import { loginInfoAtom } from './state/globalAtoms';
import { AddTodo } from './components/addTodo';
import { firebaseAuth } from './lib/firebase';

const App = () => {
    const setLoginInfo = useSetAtom(loginInfoAtom);
    const [loadingState, setLoadingState] = useAtom(loadingStateAtom);

    // Sign in anonymously on mount
    useEffect(() => {
        const login = async () => {
            try {
                const loginInfo = await signInAnonymously(firebaseAuth);

                setLoginInfo(loginInfo?.user);
                setLoadingState(LOADING_STATE.COMPLETE);
            } catch (error) {
                console.error(error);
                setLoadingState(LOADING_STATE.ERROR);
            }
        };

        login();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (loginInfo) => {
            if (loginInfo) {
                setLoginInfo(loginInfo);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (loadingState === LOADING_STATE.LOGGING_IN) {
        return (
            <Container
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9f9f9',
                }}
            >
                <Fade in={true} timeout={800}>
                    <Box textAlign="center">
                        <CircularProgress size={60} thickness={5} />
                        <Typography mt={2} fontWeight="medium">
                            Logging in and loading todos...
                        </Typography>
                    </Box>
                </Fade>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    📝 Collaborative Todo List
                </Typography>
                <AddTodo />
                <TodoList />
            </Paper>
        </Container>
    );
};

export { App };
