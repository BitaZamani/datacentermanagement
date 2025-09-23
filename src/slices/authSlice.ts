import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../server/firebase";
import type {
  AuthInitialState,
  LoginProps,
  RegisterProps,
} from "../types/types";

import { notify } from "../components/notify";

const initialState: AuthInitialState = {
  loading: false,
  user: { email: null, name: null, uid: null },
  loginError: "",
  registerError: "",
  logoutError: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, name }: RegisterProps, { rejectWithValue }) => {
    if (!name || !password || !email) {
      notify("error", "اطلاعات را کامل وارد کنید.");
      return rejectWithValue("error");
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      notify("success", "حساب کاربری ایجاد شد.");
      return {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        name,
      };
    } catch (error) {
      if (error instanceof Error) {
        notify("error", error.message);
        return rejectWithValue("error");
      } else {
        notify("error", "خطا در برقراری ارتباط");
        return rejectWithValue("error");
      }
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginProps, { rejectWithValue }) => {
    if (!password || !email) {
      notify("error", "اطلاعات را کامل وارد کنید.");
      return rejectWithValue("error");
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      notify("success", "ورود موفق");
      return {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        name: userCredential.user.displayName,
      };
    } catch (error) {
      if (error instanceof Error) {
        notify("error", error.message);
        return rejectWithValue("error");
      } else {
        notify("error", "خطا در برقراری ارتباط");
        return rejectWithValue("error");
      }
    }
  }
);

export const logOut = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);

      notify("success", "خروج موفق");
    } catch (error) {
      if (error instanceof Error) {
        notify("error", error.message);
        return rejectWithValue("error");
      } else {
        notify("error", "خطا در برقراری ارتباط");
        return rejectWithValue("error");
      }
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ email: string; uid: string; name: string }>
    ) => {
      const { email, uid, name } = action.payload;
      state.user.email = email;
      state.user.name = name;
      state.user.uid = uid;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.registerError = "";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = {
          email: action.payload.email,
          name: action.payload.name,
          uid: action.payload.uid,
        };
        state.loading = false;
        state.registerError = "";
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
        state.registerError = "error";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.loginError = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = {
          email: action.payload.email,
          name: action.payload.name,
          uid: action.payload.uid,
        };
        state.loading = false;
        state.loginError = "";
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;

        state.loginError = "";
      })
      .addCase(logOut.pending, (state) => {
        state.loading = true;
        state.logoutError = "";
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = {
          email: "",
          name: "",
          uid: "",
        };
        state.loading = false;
        state.logoutError = "";
      })
      .addCase(logOut.rejected, (state) => {
        state.loading = false;
        state.logoutError = "error";
      });
  },
});
export const authReducer = authSlice.reducer;
export const { setUser } = authSlice.actions;
