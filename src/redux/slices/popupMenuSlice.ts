import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialSlicesStates, InterfacesOfInitialSlicesStates } from "../initialSlicesStates";

type TypePayloadActionMenuSettings = PayloadAction<InterfacesOfInitialSlicesStates.IPopupMenuSlice>
const popupMenuSlice = createSlice({
    name: 'popupMenu',
    initialState: initialSlicesStates.popupMenuSlice,
    reducers: {
        //* настройка и отображение контекстного меню
        showAndSettingsPopupMenu(state, action: TypePayloadActionMenuSettings) {
            let {active, contentName, height, width, cardCoordinates} = action.payload;
            let {left, top} = action.payload.coordinates;
            const windowWidth = document.documentElement.clientWidth;
            const windowHeight = document.documentElement.clientHeight;
            const topWithoutScroll = top - window.pageYOffset;

            state.coordinates.left = left + 20;
            state.coordinates.top = top + 20;

            (function(height) {
                if (typeof height !== 'number') height = 50;

                if (((left + 20) + width > windowWidth) && (left - width >= 0)) {
                    state.coordinates.left = left - width - 20;
                } else if (((left + 20) + width > windowWidth) && (left - width < 0)) {
                    state.coordinates.left = 20;
                }

                if (((topWithoutScroll + 20) + height > windowHeight) && (topWithoutScroll - height > 0)) {
                    state.coordinates.top = top - height - 20;
                } else if (((topWithoutScroll + 20) + height > windowHeight) && (topWithoutScroll - height <= 0)) {
                    state.coordinates.top = window.pageYOffset + 20;
                }
            }(height))

            state.active = active;
            state.contentName = contentName;
            state.height = height;
            state.width = width;
            if (cardCoordinates) state.cardCoordinates = cardCoordinates;
        },
        //* очистка и скрытие контекстного меню
        hideAndCleanPopupMenu(state, action: TypePayloadActionMenuSettings) {
            state.active = false;
            state.contentName = '';
            state.coordinates = action.payload.coordinates;
            state.height = 0;
            state.width = 0;
        }
    }
});

export const popupMenuReducer = popupMenuSlice.reducer;
export const popupMenuActions = popupMenuSlice.actions;