import React, { useEffect, useRef } from "react";
import { connect, MapDispatchToPropsParam, MapStateToPropsParam, MergeProps } from "react-redux";
import { actions, asyncСalculatingCardSize, heightChange } from "../../redux/actionCreators";
import { InterfacesOfInitialSlicesStates } from "../../redux/initialSlicesStates";
import { AppDispatch, AppState } from "../../redux/store";
import Preloader from "../Preloader";

interface TStateProps {
    cardsContents: InterfacesOfInitialSlicesStates.ICardsSlice
}
interface TDispatchProps {
    asyncСalculatingCardSize(timeout_second: number): void,
    showFullTitleCard(e: React.MouseEvent<HTMLHeadingElement, MouseEvent>): void,
    showPopupMenuFromCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void,
    dragAndDropCard(cardDrop: number, parentCardNumber: number): void
}
interface TOwnProps {
    parentCardNumber: number,
    indexOfDepth: number
}
type TMergedProps = TStateProps & TDispatchProps & TOwnProps;
type dragEvent = React.DragEvent<HTMLHeadingElement>

const Card: React.FC<TMergedProps> = ({parentCardNumber, indexOfDepth, asyncСalculatingCardSize, showFullTitleCard, showPopupMenuFromCard, cardsContents, dragAndDropCard}) => {

    const {mapOfNamesOfCards, mapOfSizesCards, mapOfSizesCardsInPixels} = cardsContents
    const cardSizing = mapOfSizesCardsInPixels[parentCardNumber][indexOfDepth];
    const currentCard = mapOfNamesOfCards[parentCardNumber];
    const existIndex = !!currentCard[indexOfDepth+1];
    const cardRef = useRef<HTMLDivElement>(null);

    const dragEvnets = {
        draggable: true,
        onDragStart(e: dragEvent) {
            const cardElem = e.currentTarget.closest<HTMLElement>('.card-parent');
            e.dataTransfer.setData('card', String(parentCardNumber));
            Object.getPrototypeOf(e.dataTransfer).currentDraggableCard = cardElem;
            cardElem!.classList.add('currentDraggableCard');
            cardElem!.style.zIndex = '999';
        },
        onDragOver(e: dragEvent) {
            e.preventDefault();
        },
        onDragEnter(e: dragEvent) {
            // @ts-ignore
            const currentDraggableCard: HTMLElement | null = e.dataTransfer.currentDraggableCard;
            const cardUnderCursor = e.currentTarget.closest<HTMLElement>('.card-parent');
            
            if (currentDraggableCard && cardUnderCursor && cardUnderCursor !== currentDraggableCard) {
                cardUnderCursor!.classList.add('hoverDropCard');
            }
        },
        onDragLeave(e: dragEvent) {
            // @ts-ignore
            const currentDraggableCard: HTMLElement | null = e.dataTransfer.currentDraggableCard;
            const cardUnderCursor = e.currentTarget.closest<HTMLElement>('.card-parent');
            
            if (currentDraggableCard && cardUnderCursor && cardUnderCursor !== currentDraggableCard && cardUnderCursor.classList.contains('hoverDropCard')) {
                cardUnderCursor.classList.remove('hoverDropCard');
            }
        },
        onDrop(e: dragEvent) {
            e.preventDefault();
            const cardDropNumber = e.dataTransfer.getData("card");
            const cardDrop = e.currentTarget.closest<HTMLElement>('.card-parent');
            if (cardDrop && cardDrop.classList.contains('hoverDropCard')) cardDrop.classList.remove('hoverDropCard');
            
            dragAndDropCard(Number(cardDropNumber), parentCardNumber);
        },
        onDragEnd(e: dragEvent) {
            Object.getPrototypeOf(e.dataTransfer).currentDraggableCard = null;
            const cardElem = e.currentTarget.closest<HTMLElement>('.card-parent');
            
            if (cardElem?.classList.contains('currentDraggableCard')) cardElem.classList.remove('currentDraggableCard');
            setTimeout(() => {
                cardElem!.style.removeProperty('z-index');
            }, 800);
        }
    }

    useEffect(() => {
        asyncСalculatingCardSize(1);
    }, [mapOfSizesCards[parentCardNumber][indexOfDepth]]);

    useEffect(() => {
        if (!indexOfDepth && cardRef.current) {
            const cardHeightSet = heightChange(cardRef.current);
            setTimeout(() => {
                cardHeightSet('cardBeenAdded');
            }, 20);
        }
    }, [mapOfSizesCardsInPixels[parentCardNumber][indexOfDepth]])

    return (
        cardSizing === 0 ? (
            <div className="loader">
                <h1 className="loader-text">Загрузка</h1>
                <Preloader />
            </div>
        ) : (
            <div 
                className={`card${indexOfDepth === 0 ? ' card-parent': ''} card-background__${indexOfDepth}`}
                style={{'width': cardSizing}}
                ref= {cardRef}
            >
                <div className="card-header">
                    <h1 className="card-header__title"
                        onClick={(e) => showFullTitleCard(e)} 
                        {...!indexOfDepth ? {...dragEvnets} : null}
                    >{currentCard[indexOfDepth]}</h1>
                    <div className="card-header__menu" onClick={(e) => showPopupMenuFromCard(e)}></div>
                </div>
                {existIndex && <CardWithConnect  parentCardNumber={parentCardNumber} indexOfDepth={indexOfDepth+1} />}
            </div>
        )
    )
}

const mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, AppState> = (state, ownProps) => ({cardsContents: state.cardsContents});

const mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TOwnProps> = (dispatch: AppDispatch, ownProps) => ({
    asyncСalculatingCardSize(timeout_second: number) {
        dispatch(asyncСalculatingCardSize(timeout_second, ownProps.parentCardNumber, ownProps.indexOfDepth));
    },
    showFullTitleCard(e: React.MouseEvent<HTMLHeadingElement, MouseEvent>) {
        dispatch(actions.showFullTitleCard(e, [ownProps.parentCardNumber, ownProps.indexOfDepth]));
    },
    showPopupMenuFromCard(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        dispatch(actions.showPopupMenuFromCard(e, [ownProps.parentCardNumber, ownProps.indexOfDepth]));
    },
    dragAndDropCard(cardDrop, parentCardNumber) {
        dispatch(actions.dragAndDropCard(cardDrop, parentCardNumber))
    }
});

//* попытка немного оптимизировать нагрузку
//* условия рендера карточек: 1) если присутствует родительская карточка; 2) если дочерняя карточка только что появилась или была удалена; 3) если состояние конкретной карточки изменилось
const areMergedPropsEqual = (next: TMergedProps, prev: TMergedProps) => {
    if (typeof next.cardsContents.mapOfNamesOfCards[next.parentCardNumber] !== 'undefined') {
        const prevStateOfMapNames = prev.cardsContents.mapOfNamesOfCards[prev.parentCardNumber];
        const nextStateOfMapNames = next.cardsContents.mapOfNamesOfCards[next.parentCardNumber];

        if (typeof prevStateOfMapNames[prev.indexOfDepth+1] === 'string' && typeof nextStateOfMapNames[next.indexOfDepth+1] === 'undefined' || typeof prevStateOfMapNames[prev.indexOfDepth+1] === 'undefined' && typeof nextStateOfMapNames[next.indexOfDepth+1] === 'string') {
            return false;
        } else if (next.cardsContents.mapOfNamesOfCards[next.parentCardNumber][next.indexOfDepth] !== prev.cardsContents.mapOfNamesOfCards[prev.parentCardNumber][prev.indexOfDepth] || next.cardsContents.mapOfSizesCards[next.parentCardNumber][next.indexOfDepth] !== prev.cardsContents.mapOfSizesCards[prev.parentCardNumber][prev.indexOfDepth] || next.cardsContents.mapOfSizesCardsInPixels[next.parentCardNumber][next.indexOfDepth] !== prev.cardsContents.mapOfSizesCardsInPixels[prev.parentCardNumber][prev.indexOfDepth]) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
};
const mergeProps: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps> = (stateProps, dispatchProps, ownProps) => ({ ...ownProps, ...stateProps, ...dispatchProps });

const CardWithConnect = connect<TStateProps, TDispatchProps, TOwnProps, TMergedProps, AppState>(mapStateToProps, mapDispatchToProps,  mergeProps, {areMergedPropsEqual})(Card);

export {CardWithConnect as Card};