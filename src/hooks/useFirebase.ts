import { onValue, push, ref, remove, set } from "firebase/database";
import { firebaseDb } from "../lib/firebase";
import { useAtomValue, useSetAtom } from "jotai";
import { todosAtom } from "../state/todoAtoms";
import { loadingStateAtom, userIdDerived } from "../state/globalAtoms";
import { LOADING_STATE } from "../consts/loadingStates";
import type { TodoItemSchema } from "../types/todoTypes";

const useFirebase = () => {
    const userId = useAtomValue(userIdDerived);
    const setTodos = useSetAtom(todosAtom);
    const setLoadingState = useSetAtom(loadingStateAtom);
    const listPath = ref(firebaseDb, `todos/${userId}`);

    const getItems = () => {
        setLoadingState(LOADING_STATE.LOADING_TODOS);
         const unsubscribe = onValue(listPath, (snapshot) => {
            const data: Record<string, TodoItemSchema> = snapshot.val();

            if (data) {
                const parsed = Object.entries(data).map(([id, val]) => ({
                    id,
                    text: val.text,
                }));
                setTodos(parsed);
            } else {
                setTodos([]);
            }
            setLoadingState(LOADING_STATE.COMPLETE);
        });

        return unsubscribe;
    }

    const addItem = (input: string) => {

        return set(push(listPath), { text: input })
    }

    const removeItem = (id: string) => {
        const itemPath = ref(firebaseDb, `todos/${userId}/${id}`);
        
        remove(itemPath);
    }

    return {
        addItem,
        getItems,
        removeItem
    }
}

export {
    useFirebase,
}