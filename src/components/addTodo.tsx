import { useAtom } from 'jotai';
import { inputAtom } from '../state/todoAtoms';
import { Box, Button, TextField } from '@mui/material';
import { useFirebase } from '../hooks/useFirebase';

const AddTodo = () => {
    const [input, setInput] = useAtom(inputAtom);
    const { addItem } = useFirebase();

    const handleAddTodo = () => {
        if (!input.trim()) {
            return;
        }

        addItem(input);
        setInput('');
    };

    return (
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
    );
};

export { AddTodo };
