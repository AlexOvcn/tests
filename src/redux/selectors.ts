import { InterfacesOfInitialSlicesStates } from "./initialSlicesStates"
import { AppState } from "./store"

interface ISelectors {
    cardsContents: () => (state: AppState) => InterfacesOfInitialSlicesStates.ICardsSlice,
    popupMenu: () => (state: AppState) => InterfacesOfInitialSlicesStates.IPopupMenuSlice
}

//* все селекторы приложения
export const selectors: ISelectors = {
    //* селектор содержимого карт
    cardsContents: () => (state) => state.cardsContents,
    //* селектор контекстного меню
    popupMenu: () => (state) => state.popupMenu
}