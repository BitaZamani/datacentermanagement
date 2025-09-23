import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { interactionReducer } from "./interactionSlice";
import { dbReducer } from "./dbSlice";
import { staticsReducer } from "./staticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interaction: interactionReducer,
    db: dbReducer,
    statics:staticsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
