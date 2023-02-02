import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { apiEndpoint } from "../../utils/constants";
import type { RootState } from "../../app/store";
import {
  removeAuthToken,
  removeUser,
  setAuthToken,
  setUser,
} from "../../utils/api/authToken";

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  authToken: string;
}

interface ApiSuccess {
  msg: string;
}

export type RequestStatus = "idle" | "resolved" | "rejected" | "pending";

interface UserSliceState {
  user: User | null;
  status: RequestStatus;
  error: string;
}

const initialState: Partial<UserSliceState> = {
  user: null,
  error: "",
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut: (state) => {
      removeAuthToken();
      removeUser();
      state.user = null;
    },
    autoSignIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload || JSON.stringify(action.error);
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = "resolved";
      })
      .addCase(signIn.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(signIn.rejected, (state, { payload }) => {
        state.status = "rejected";
        state.error = payload;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.status = "resolved";
        setAuthToken(payload.authToken);
        setUser(payload);
        state.user = payload;
      });
  },
});

export const signUp = createAsyncThunk<
  string,
  Partial<User> & { password: string },
  {
    rejectValue: string;
  }
>(
  "users/signup",
  async ({ name, surname, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ApiSuccess>(
        `${apiEndpoint}/users/register`,
        { name, surname, email, password }
      );
      return data.msg;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("Unknown error occured");
      }
    }
  }
);

export const signIn = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("users/signin", async (credentials, { rejectWithValue }) => {
  try {
    const { data: user } = await axios.post<User>(
      `${apiEndpoint}/users/login`,
      credentials
    );
    return user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    } else {
      console.log(error);
      return rejectWithValue("Unknown error occured");
    }
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectUserState = (state: RootState) => state.user;

export const { signOut, autoSignIn } = userSlice.actions;

export default userSlice.reducer;
