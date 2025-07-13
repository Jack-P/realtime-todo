import type { LOADING_STATE } from "../consts/loadingStates";
import type { ValueOf } from "./shared";

type LoadingState = ValueOf<typeof LOADING_STATE>;

interface TodoItemSchema {
    id: string; 
    text: string 
}

type TodoList = TodoItemSchema[] 

export type {
    LoadingState,
    TodoItemSchema,
    TodoList,
}