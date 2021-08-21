import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userListReducer from "../features/user-list/userListSlice";

export const store = configureStore({
  reducer: {
    userList: userListReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
