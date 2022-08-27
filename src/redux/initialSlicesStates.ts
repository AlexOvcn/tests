//* все интерфейсы начальных состояний срезов
export namespace InterfacesOfInitialSlicesStates {
    export interface ICardsSlice {
        mapOfNamesOfCards: string[][],
        mapOfSizesCards: number[][],
        mapOfSizesCardsInPixels: number[][]
    };
    export interface IPopupMenuSlice {
        active: boolean,
        contentName: string,
        width: number,
        height: number|'auto',
        coordinates: {
            left: number,
            top: number
        }
        cardCoordinates?: [number|null, number|null],
    };
    export interface IOtherParameters {
        lastWidthOfWindow?: number
    }
}

//* интрефейс для initialSlicesStates
interface IInitialSlicesStates {
    cardsSlice: InterfacesOfInitialSlicesStates.ICardsSlice,
    popupMenuSlice: InterfacesOfInitialSlicesStates.IPopupMenuSlice,
    otherParameters: InterfacesOfInitialSlicesStates.IOtherParameters
}

//* начальные состояния для всех срезов в redux
export const initialSlicesStates: IInitialSlicesStates = {
    cardsSlice: {
        mapOfNamesOfCards: [['Карточка 2-1', 'Карточка 2-2'],['Карточка 1-1', 'Карточка 1-2', 'Карточка 1-3']],
        mapOfSizesCards: [[2, 2], [2, 2, 2]],
        mapOfSizesCardsInPixels: [[0, 0], [0, 0, 0]]
    },
    popupMenuSlice: {
        active: false,
        contentName: '',
        width: 0,
        height: 0,
        coordinates: {
            left: 0,
            top: 0
        },
        cardCoordinates: [null, null]
    },
    otherParameters: {
        lastWidthOfWindow: 0
    }
}