import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialSlicesStates } from "../initialSlicesStates";

const cardsSlice = createSlice({
    name: 'cards',
    initialState: initialSlicesStates.cardsSlice,
    reducers: {
        //* расчет ширин у всех карточек
        calculatingCardsSizes(state) {
            var newMapOfSizesCardsInPixels = [];
            for (let parentCardNumber = 0; parentCardNumber < state.mapOfSizesCards.length; parentCardNumber++) {
                newMapOfSizesCardsInPixels.push(state.mapOfSizesCards[parentCardNumber].map((item, indexOfDepth) => {
                    if (state.mapOfSizesCardsInPixels[parentCardNumber][indexOfDepth] === 0) {
                        return 0;
                    }
                    return document.documentElement.clientWidth / 6 * (item) - (indexOfDepth * 20) - 10;
                }))
            }
            state.mapOfSizesCardsInPixels = newMapOfSizesCardsInPixels;
        },
        //* расчитывание ширины у определенной карточки
        calculatingCardSize(state, action: PayloadAction<{parentCardNumber: number, indexOfDepth: number}>) {
            let parentCardNumber = action.payload.parentCardNumber;
            let indexOfDepth = action.payload.indexOfDepth;

            if (!state.mapOfSizesCards[parentCardNumber] || !state.mapOfSizesCards[parentCardNumber][indexOfDepth]) {
                console.log('Карточка не найдена!');
                return;
            }
            
            state.mapOfSizesCardsInPixels[parentCardNumber][indexOfDepth] = document.documentElement.clientWidth / 6 * (state.mapOfSizesCards[parentCardNumber][indexOfDepth]) - (indexOfDepth * 20) - 10;
        },
        //* редактирование имени карточки 
        renameCard(state, action: PayloadAction<{parentCardNumber: number, indexOfDepth: number, rename: string}>) {
            const {parentCardNumber, indexOfDepth, rename} = action.payload;

            state.mapOfNamesOfCards[parentCardNumber][indexOfDepth] = rename;
        },
        //* добавление любой карточки (полиморфная функция, добавляет как родительскую карточку, так и дочернюю)
        addNewCard(state, action: PayloadAction<{parentCardNumber: number} | null>) {
            if (action.payload) {
                const {parentCardNumber} = action.payload;
                state.mapOfNamesOfCards[parentCardNumber].push('Новая подкарточка');
                state.mapOfSizesCards[parentCardNumber].push(1);
                state.mapOfSizesCardsInPixels[parentCardNumber].push(0);
            } else {
                state.mapOfNamesOfCards.push(['Новая карточка']);
                state.mapOfSizesCards.push([1]);
                state.mapOfSizesCardsInPixels.push([0]);
            }
        },
        //* удаление карточки и всех ее дочерних элементов
        removeCard(state, action: PayloadAction<{parentCardNumber: number, indexOfDepth: number}>) {
            const {parentCardNumber, indexOfDepth} = action.payload;
            
            if (indexOfDepth) {
                state.mapOfNamesOfCards[parentCardNumber] = state.mapOfNamesOfCards[parentCardNumber].slice(0, indexOfDepth);
                state.mapOfSizesCards[parentCardNumber] = state.mapOfSizesCards[parentCardNumber].slice(0, indexOfDepth);
                state.mapOfSizesCardsInPixels[parentCardNumber] = state.mapOfSizesCardsInPixels[parentCardNumber].slice(0, indexOfDepth);
            } else {
                state.mapOfNamesOfCards.splice(parentCardNumber, 1);
                state.mapOfSizesCards.splice(parentCardNumber, 1);
                state.mapOfSizesCardsInPixels.splice(parentCardNumber, 1);
            }
        },
        //* изменение размеров карточки
        changeSize(state, action: PayloadAction<{parentCardNumber: number, indexOfDepth: number, size: string}>) {
            let {parentCardNumber, indexOfDepth, size} = action.payload;
            let parentCardSize= state.mapOfSizesCards[parentCardNumber][indexOfDepth-1];
            let childCardSize = state.mapOfSizesCards[parentCardNumber][indexOfDepth+1];
            let sizeNumber = parseInt(size);

            if (!parentCardSize) parentCardSize = 6;
            if (!childCardSize) childCardSize = 1;

            if (parentCardSize >= sizeNumber && childCardSize <= sizeNumber) {
                state.mapOfSizesCards[parentCardNumber][indexOfDepth] = sizeNumber;
            } else if (parentCardSize < sizeNumber) {
                state.mapOfSizesCards[parentCardNumber][indexOfDepth] = parentCardSize;
            } else if (childCardSize > sizeNumber) {
                state.mapOfSizesCards[parentCardNumber][indexOfDepth] = childCardSize;
            }
        },
        //* смена карт местами при перемещении (drag and drop)
        dragAndDropCard(state, action: PayloadAction<{cardDrop: number, cardReplace: number}>) {
            const {cardDrop, cardReplace} = action.payload;

            if (cardDrop !== cardReplace) {
                const replacedName = state.mapOfNamesOfCards.splice(cardDrop, 1, state.mapOfNamesOfCards[cardReplace]);
                state.mapOfNamesOfCards.splice(cardReplace, 1, replacedName[0]);

                const replacedSize = state.mapOfSizesCards.splice(cardDrop, 1, state.mapOfSizesCards[cardReplace]);
                state.mapOfSizesCards.splice(cardReplace, 1, replacedSize[0]);

                const replacedSizePX = state.mapOfSizesCardsInPixels.splice(cardDrop, 1, state.mapOfSizesCardsInPixels[cardReplace]);
                state.mapOfSizesCardsInPixels.splice(cardReplace, 1, replacedSizePX[0]);
            }
        }
    }
});

export const cardsReducer = cardsSlice.reducer;
export const cardsActions = cardsSlice.actions;