import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { User, AuthState } from "../../types/user";

// Define the initial state using that type

const initialState: AuthState = {
  user: localStorage.getItem("current_user") ? JSON.parse(localStorage.getItem("current_user") || '{}') : null,
  accessToken: localStorage.getItem("access_token") ?? "",
  refreshToken: localStorage.getItem("refresh_token") ?? "",
  isAuthenticated: Boolean(localStorage.getItem("access_token")),
  loading: false, // Set loading to false for immediate access
};

const _setTokens = (
  state: AuthState,
  data: { accessToken: string; refreshToken: string; user?: User }
) => {
  localStorage.setItem("access_token", data.accessToken);
  localStorage.setItem("refresh_token", data.refreshToken);
  
  // Handle case where user data is provided
  if (data.user) {
    localStorage.setItem("current_user", JSON.stringify(data.user));
    state.user = data.user;
  } else {
    // If no user data provided, use a default user for testing
    const defaultUser = {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("current_user", JSON.stringify(defaultUser));
    state.user = defaultUser;
  }
  
  state.accessToken = data.accessToken;
  state.refreshToken = data.refreshToken;
  state.isAuthenticated = true;
  state.loading = false;
  return state;
};

const _resetTokens = (state: AuthState) => {
  localStorage.setItem("access_token", "");
  localStorage.setItem("refresh_token", "");
  localStorage.removeItem("current_user");
  state.accessToken = "";
  state.refreshToken = "";
  state.user = null;
  state.isAuthenticated = false;
  state.loading = false;
  return state;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: User }>
    ) => {
      return _setTokens(state, action.payload);
    },
    resetTokens: (state) => {
      return _resetTokens(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          api.endpoints.login.matchPending,
          api.endpoints.loginByApple.matchPending,
          api.endpoints.loginByFacebook.matchPending,
          api.endpoints.loginByGoogle.matchPending,
          api.endpoints.loginByLinkedIn.matchPending
        ),
        (state) => {
          state.loading = true;
          return state;
        }
      )
      .addMatcher(
        isAnyOf(
          api.endpoints.login.matchFulfilled,
          api.endpoints.loginByApple.matchFulfilled,
          api.endpoints.loginByFacebook.matchFulfilled,
          api.endpoints.loginByGoogle.matchFulfilled,
          api.endpoints.loginByLinkedIn.matchFulfilled
        ),
        (state, action) => {
          return _setTokens(state, {
            accessToken: action.payload.data.accessToken,
            refreshToken: action.payload.data.refreshToken
          });
        }
      )
      .addMatcher(
        isAnyOf(
          api.endpoints.login.matchRejected,
          api.endpoints.loginByApple.matchRejected,
          api.endpoints.loginByFacebook.matchRejected,
          api.endpoints.loginByGoogle.matchRejected,
          api.endpoints.loginByLinkedIn.matchRejected,
          api.endpoints.logout.matchFulfilled,
          api.endpoints.logout.matchRejected
        ),
        (state) => {
          return _resetTokens(state);
        }
      );
  },
});

export const { setLoading, setTokens, resetTokens } = authSlice.actions;

export default authSlice.reducer;
