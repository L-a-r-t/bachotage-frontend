import { useDispatch, useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import type { RootState, AppDispatch } from "../store"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useTDispatch: () => AppDispatch = useDispatch
export const useTSelector: TypedUseSelectorHook<RootState> = useSelector
