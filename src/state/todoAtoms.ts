import { atom } from "jotai";
import type { TodoList } from "../types/todoTypes";

const todosAtom = atom<TodoList | []>([]);

const inputAtom = atom<string>('');

export {
    todosAtom,
    inputAtom,
};