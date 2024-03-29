import { createSlice } from '@reduxjs/toolkit'

export interface isUpdate {
  value: boolean
}

const initialState: isUpdate = {
  value: false,
}

export const authUpdate = createSlice({
  name: 'update',
  initialState,
  reducers: {
    update: (state) => {
      state.value = !state.value
    },
  },
})

export const { update } = authUpdate.actions
export default authUpdate.reducer
