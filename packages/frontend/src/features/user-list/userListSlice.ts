import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  Configuration,
  GetUsersRequest,
  User,
  UserApi,
} from "generated-api";
import { authHeaderMiddleware } from "../auth/Auth";

export interface UserListState {
  users: User[];
  loading: boolean;
}

const initialState: UserListState = {
  users: [],
  loading: false,
};

const api = () =>
  new UserApi(
    new Configuration({
      basePath: process.env.REACT_APP_API_URL || window.location.origin,
    })
  );

export const loadUsers = createAsyncThunk(
  "user-list/loadUsers",
  async (request: GetUsersRequest) => {
    return api().withPreMiddleware(authHeaderMiddleware).getUsers(request);
  }
);

export const userListSlice = createSlice({
  name: "userList",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      });
  },
});

export const selectUsers = (state: RootState) => state.userList.users;

export default userListSlice.reducer;
