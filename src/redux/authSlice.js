// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const savedAuth = JSON.parse(localStorage.getItem("auth"));

const getOrganizationId = (user) =>
  user?.organizationId ||
  user?.organization?._id ||
  user?.organization?.id ||
  (typeof user?.organization === "string" ? user.organization : "") ||
  "";

const getOrganizationName = (user) =>
  user?.organizationName ||
  user?.organization?.orgName ||
  user?.organization?.name ||
  (typeof user?.organization === "string" ? user.organization : "") ||
  "";

const normalizeAuthPayload = (payload) => {
  const authData = payload?.data || payload;
  const authEntity = authData?.data || authData;
  const rawUser = authEntity?.user || authEntity;
  const permissions =
    rawUser?.permissions ||
    authEntity?.permissions ||
    [];

  return {
    user: {
      ...rawUser,
      organizationId: getOrganizationId(rawUser),
      organizationName: getOrganizationName(rawUser)
    },
    permissions
  };
};

const initialState = {
  user: savedAuth?.user || null,
  permissions: savedAuth?.permissions || []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, permissions } = normalizeAuthPayload(action.payload);

      state.user = user;
      state.permissions = permissions || [];

      localStorage.setItem(
        "auth",
        JSON.stringify({ user, permissions })
      );
    },

    logout: (state) => {
      state.user = null;
      state.permissions = [];

      localStorage.removeItem("auth");
      localStorage.removeItem("token");
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
