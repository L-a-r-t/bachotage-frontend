import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { ReactNode } from "react"

// Define a type for the slice state
export type Modal =
  | "addQuestion"
  | "deleteDraft"
  | "login"
  | "publishQuiz"
  | "submitAnswer"
  | "onboarding"

export type SideModal = "discussQuestion" | "header"

type ModalState = {
  modal: null | Modal
  props: any
  sideProps: any
  sideModal: null | SideModal
  alert: null | { message: string; error?: boolean }
}

// Define the initial state using that type
const initialState: ModalState = {
  modal: null,
  props: {},
  sideProps: {},
  sideModal: null,
  alert: null,
}

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal: (
      state,
      action: PayloadAction<{ modal: Modal | null; props?: any }>
    ) => {
      state.props = action.payload.props ?? null
      state.modal = action.payload.modal
    },
    setSideModal: (
      state,
      action: PayloadAction<{ modal: SideModal | null; props?: any }>
    ) => {
      state.sideProps = action.payload.props ?? null
      state.sideModal = action.payload.modal
    },
    setAlert: (
      state,
      action: PayloadAction<{
        message: string
        error?: boolean
        dontOverride?: boolean
      } | null>
    ) => {
      if (action.payload?.dontOverride && state.alert) return
      state.alert = action.payload
    },
  },
})

export const { setModal, setAlert, setSideModal } = modalSlice.actions

export default modalSlice.reducer
