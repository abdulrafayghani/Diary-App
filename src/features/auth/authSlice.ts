import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../interfaces/user.interface';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveToken: (state, { payload }: PayloadAction<string>) => {
      if (payload) {
        state.token = payload;
      }
    },
    clearToken: (state) => {
      state.token = null;
    },
    setAuthState: (state, { payload }: PayloadAction<boolean>) => {
      state.isAuthenticated = payload;
    },
    logout: (state) => {
      return{
        ...state,
        isAuthenticated: false,
        token: "",
        user: null
      }
    }
  },
});

export const { saveToken, clearToken, setAuthState, logout } = auth.actions;
export default auth.reducer;
