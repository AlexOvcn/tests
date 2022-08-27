import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialSlicesStates, InterfacesOfInitialSlicesStates } from "../initialSlicesStates";

type TypePayloadActionOtherParameters = PayloadAction<InterfacesOfInitialSlicesStates.IOtherParameters>
const otherParametersSlice = createSlice({
    name: 'otherParameters',
    initialState: initialSlicesStates.otherParameters,
    reducers: {
        //* очистка и скрытие контекстного меню
        changeWindowWidth(state, action: TypePayloadActionOtherParameters) {
            state.lastWidthOfWindow = action.payload.lastWidthOfWindow;
        }
    }
});

export const otherParametersReducer = otherParametersSlice.reducer;
export const otherParametersActions = otherParametersSlice.actions;