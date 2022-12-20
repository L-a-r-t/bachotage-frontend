import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { AppUser } from "types/user"

// Define a type for the slice state
type AuthState = {
  user: AppUser | null
  status: "idle" | "pending"
}

// Define the initial state using that type
const initialState: AuthState = {
  user: null,
  status: "idle",
}

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AppUser | null>) => {
      state.user = action.payload
      state.status = "idle"
    },
    waitForEmail: (state) => {
      state.status = "pending"
    },
  },
})

export const { setAuth, waitForEmail } = authSlice.actions

export default authSlice.reducer
