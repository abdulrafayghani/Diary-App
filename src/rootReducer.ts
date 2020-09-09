import { combineReducers } from "@reduxjs/toolkit"; 
import authReducer from './features/auth/authSlice';
import userReducer from './features/auth/userSlice';
import diairesReducer from './features/diary/diarySlice';
import entriesReducer from './features/entry/entrySlice';
import editorReducer from './features/entry/editorSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    diaries: diairesReducer,
    entries: entriesReducer,
    editor: editorReducer
});

export type rootState = ReturnType<typeof rootReducer>
export default rootReducer