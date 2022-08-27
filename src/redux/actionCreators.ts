import React, { RefObject } from "react";
import { cardsActions } from "./slices/cardsSlice";
import { popupMenuActions } from "./slices/popupMenuSlice";
import { otherParametersActions } from "./slices/otherParametersSlice";
import { AppDispatch, AppStore } from "./store";

//* интерфейс ключей для формы из настройки карточки
type InputType = HTMLInputElement;
type SelectType = HTMLSelectElement;
type ButtonType = HTMLButtonElement;
export interface IKeysOfForm {
    rename: InputType
    changeSize: SelectType
    addChildCard?: InputType
    delete: InputType
    acceptСhanges: ButtonType
}
type heightChangeType = 'cardBeenAdded' | 'cardWillBeRemove' | 'cardBeenRemove' | 'clearCardStyle';

//* функция для изменения высоты (на уже отрендерившихся элементах)
export function heightChange(parentCardNumberOrCardElem: number): (action: heightChangeType) => void;
export function heightChange(parentCardNumberOrCardElem: HTMLDivElement): (action: heightChangeType) => void;
export function heightChange(parentCardNumberOrCardElem: number | HTMLDivElement) {
    function returnFunction(nodeWhichBeDelete: HTMLDivElement) {
        return (action: heightChangeType) => {
            switch (action) {
                case 'cardBeenAdded':
                    nodeWhichBeDelete.style.height = '250px';
                    return;
                case 'cardWillBeRemove':
                    nodeWhichBeDelete.classList.add('cardWillDelete');
                    nodeWhichBeDelete.style.height = '0px';
                    return;
                case 'cardBeenRemove':
                    nodeWhichBeDelete.classList.remove('cardWillDelete');
                    nodeWhichBeDelete.style.height = '250px';
                    nodeWhichBeDelete.style.transition = 'none';
                    return;
                case 'clearCardStyle':
                    nodeWhichBeDelete.style.transition = 'none';
                    nodeWhichBeDelete.style.removeProperty('transition');
                    return;
                default:
                    return;
            }
        }
    }
    if (typeof parentCardNumberOrCardElem === 'number') {
        const mainNode = document.querySelector('.main-content');
        const cardsNodes: NodeListOf<HTMLDivElement> | undefined = mainNode?.querySelectorAll('.card-parent');
        if (cardsNodes && cardsNodes.length) {
            const nodeWhichBeDelete = [...cardsNodes].reverse()[parentCardNumberOrCardElem];
            return returnFunction(nodeWhichBeDelete);
        } else {
            return () => void 0
        }
    } else {
        return returnFunction(parentCardNumberOrCardElem);
    }
}

//* синхронные события
export const actions = {
    //* расчет ширин карточек без входящих значений (обновление всех ширин карточек)
    calculatingCardsSizes() {
        return cardsActions.calculatingCardsSizes();
    },

    //* расчет ширины карточки с входящими указателями на карточку (точечное обновление ширины карточки)
    calculatingCardSize(parentCardNumber: number, indexOfDepth: number) {
        return cardsActions.calculatingCardSize({parentCardNumber, indexOfDepth});
    },

    //* настройка параметров контекстного меню и активация его показа по нажатию на кнопку help в header
    showPopupMenuFromHeader(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        return popupMenuActions.showAndSettingsPopupMenu({
            active: true,
            contentName: 'help',
            width: 400,
            height: 200,
            coordinates: {
                left: event.pageX,
                top: event.pageY
            }
        })
    },

    //* настройка параметров контекстного меню и активация его показа по нажатию на кнопку "гамбургер меню" в карточке
    showPopupMenuFromCard(event: React.MouseEvent<HTMLDivElement, MouseEvent>, [parentCardNumber, indexOfDepth]: [number, number]) {
        return popupMenuActions.showAndSettingsPopupMenu({
            active: true,
            contentName: 'card',
            width: 400,
            height: 235,
            coordinates: {
                left: event.pageX,
                top: event.pageY - 5
            },
            cardCoordinates: [parentCardNumber, indexOfDepth]
        })
    },

    //* сброс параметров контекстного меню и деактивация его показа
    hideAndCleanPopupMenu() {
        return popupMenuActions.hideAndCleanPopupMenu({
            active: false,
            contentName: '',
            width: 0,
            height: 0,
            coordinates: {
                left: 0,
                top: 0,
            },
            cardCoordinates: [null, null]
        })
    },

    //* добавление новой родительской карточки
    addParentCard() {
        return cardsActions.addNewCard(null);
    },

    //* показ полного названия у карточки
    showFullTitleCard(event: React.MouseEvent<HTMLHeadingElement, MouseEvent>, [parentCardNumber, indexOfDepth]: [number, number]) {
        return popupMenuActions.showAndSettingsPopupMenu({
            active: true,
            contentName: 'fullNameCard',
            width: 300,
            height: 'auto',
            coordinates: {
                left: event.pageX,
                top: event.pageY
            },
            cardCoordinates: [parentCardNumber, indexOfDepth]
        })
    },

    //* смена карт местами при перемещении (drag and drop)
    dragAndDropCard(cardDrop: number, cardReplace: number) {
        return cardsActions.dragAndDropCard({cardDrop, cardReplace});
    },

    //*  проверка изменения высоты окна браузера
    changeWindowHeight(windowWidth: number) {
        return otherParametersActions.changeWindowWidth({lastWidthOfWindow: windowWidth});
    }
}

//! асинхронные события

//* событие для расчета ширины карточки с задержкой в секундах
export const asyncСalculatingCardSize = (timeout_second: number, parentCardNumber: number, indexOfDepth: number) => (dispatch: AppDispatch) => {
    setTimeout(() => {
        dispatch(actions.calculatingCardSize(parentCardNumber, indexOfDepth));
    }, timeout_second * 1000);
}

//* события при изменении размеров экрана
export const actionsOnTheResizeEvent = () => (dispatch: AppDispatch, getState: AppStore['getState']) => {
    window.addEventListener("resize", function() {
        if (document.documentElement.clientWidth !== getState().otherParameters.lastWidthOfWindow) {
            dispatch(actions.changeWindowHeight(document.documentElement.clientWidth))
            dispatch(actions.calculatingCardsSizes());
            if (getState().popupMenu.active) {
                dispatch(actions.hideAndCleanPopupMenu());
            }
        }
    });
}

//* события при изменении скроле мыши
export const actionsOnTheScrollEvent = () => (dispatch: AppDispatch, getState: AppStore['getState']) => {
    window.addEventListener("scroll", function() {
        if (getState().popupMenu.active) {
            dispatch(actions.hideAndCleanPopupMenu());
        }
    });
}

//* обработка события клика по документу для контекстного меню
export const actionsOnTheClickEventForPopupMenu = (refPopupMenuBody: React.RefObject<HTMLDivElement>) => (dispatch: AppDispatch) => {
    let crossElem = refPopupMenuBody.current?.querySelector('#popup-menu__cross');
    
    let handler = (e: MouseEvent) => {
        if ((e.target as HTMLElement)?.closest('#popup-menu') !== refPopupMenuBody.current || e.target === crossElem) {
            dispatch(actions.hideAndCleanPopupMenu());
        } else {
            window.addEventListener('click', handler, {capture: true, once: true});
        }
    }
    window.addEventListener('click', handler, {capture: true, once: true});
}

//* обработка события по принятию изменений к карточке
export const actionOfCardSetting = (refForm: RefObject<HTMLFormElement & IKeysOfForm>, [parentCardNumber, indexOfDepth]: [number, number]) => (dispatch: AppDispatch) => {

    function formHandler(e: SubmitEvent) {
        e.preventDefault();

        dispatch(actions.hideAndCleanPopupMenu());
        
        if (refForm.current!.delete.checked) {
            const cardHeightSet = heightChange(parentCardNumber);
            cardHeightSet('cardWillBeRemove');
            setTimeout(() => {
                cardHeightSet('cardBeenRemove');
                dispatch(cardsActions.removeCard({parentCardNumber, indexOfDepth}));
                setTimeout(() => {
                    cardHeightSet('clearCardStyle');
                }, 50);
            }, indexOfDepth ? 0 : 800);
        } else {
            dispatch(cardsActions.renameCard({parentCardNumber, indexOfDepth, rename: refForm.current!.rename.value}));

            if (refForm.current?.addChildCard && refForm.current?.addChildCard.checked) dispatch(cardsActions.addNewCard({parentCardNumber}));

            dispatch(cardsActions.changeSize({parentCardNumber, indexOfDepth, size: refForm.current?.changeSize.value as string}))
        }
        refForm.current!.removeEventListener('submit', formHandler);
    }
    refForm.current!.addEventListener('submit', formHandler);
}