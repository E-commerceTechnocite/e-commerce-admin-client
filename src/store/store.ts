import { configureStore } from '@reduxjs/toolkit'
import exampleReducer from './reducer/exampleReducer'
import authUpdate from './reducer/authUpdate'

export const store = configureStore({
  reducer: {
    counter: exampleReducer,
    update: authUpdate,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
