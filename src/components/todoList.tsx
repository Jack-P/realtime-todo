import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { todosAtom } from '../state/todoAtoms';
import { loadingStateAtom } from '../state/globalAtoms';
import { useAtom, useAtomValue } from 'jotai';
import { LOADING_STATE } from '../consts/loadingStates';
import { useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';

const TodoList = () => {
    const todos = useAtomValue(todosAtom);
    const [loadingState] = useAtom(loadingStateAtom);
    const { removeItem, getItems } = useFirebase();

    useEffect(() => {
        const unsubscribe = getItems();

        return () => {
            unsubscribe();
        };
    }, []);

    if (loadingState === LOADING_STATE.LOADING_TODOS) {
        return 'LOADING TODOS';
    }

    console.log('I GOT RENDERED');

    return (
        <List>
            {todos.map((todo) => (
                <ListItem
                    key={todo.id}
                    secondaryAction={
                        <IconButton edge="end" onClick={() => removeItem(todo.id)}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    }
                >
                    <ListItemText primary={todo.text} />
                </ListItem>
            ))}
        </List>
    );
};

export { TodoList };
