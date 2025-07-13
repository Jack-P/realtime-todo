import {  type User } from "firebase/auth";

import { atom } from "jotai";

import { LOADING_STATE } from "../consts/loadingStates";
import type { LoadingState } from "../types/todoTypes";

const loadingStateAtom = atom<LoadingState>(LOADING_STATE.LOGGING_IN);

// Setup some default atoms for global usage.
const loginInfoAtom = atom<User | null>(null);

const userIdDerived = atom((get) => get(loginInfoAtom)?.uid)

export {
    loginInfoAtom,
    loadingStateAtom,
    userIdDerived,
}