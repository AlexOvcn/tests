import { configureStore, Middleware } from "@reduxjs/toolkit";
import { cardsReducer } from "./slices/cardsSlice";
import { popupMenuReducer } from "./slices/popupMenuSlice";
import { otherParametersReducer } from "./slices/otherParametersSlice";

const logger: Middleware = (store) => (next) => (action) => {
    console.groupCollapsed("Диспетчеризация действия: ", action.type);
    console.log('%cПредыдущий state ', 'color: yellow', store.getState());
    next(action);
    console.log('%cAction ', 'color: lightblue', action);
    console.log('%cТекущий state ', 'color: lightgreen', store.getState());
    console.groupEnd();
}

export const setupStore = () => {
    return configureStore({
        reducer: {
            cardsContents: cardsReducer,
            popupMenu: popupMenuReducer,
            otherParameters: otherParametersReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
    });
};

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<AppStore['getState']>;
