import React, { useEffect } from "react";
import { actions, asyncСalculatingCardSize } from "../../redux/actionCreators";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectors } from "../../redux/selectors";
import Preloader from "../Preloader";

interface TOwnProps {
    parentCardNumber: number,
    indexOfDepth: number
}
type dragEvent = React.DragEvent<HTMLHeadingElement>

export const Card: React.FC<TOwnProps> = ({parentCardNumber, indexOfDepth}) => {

    const dispatch = useAppDispatch();
    //* Эта версия не подошла из-за того, что в данном участке приложения наряду с компонентами обновляются и их родители, поэтому в данном случае EqualityFn в useSelector нам не поможет, вот что об этом пишется в документации: "However, unlike connect(), useSelector() does not prevent the component from re-rendering due to its parent re-rendering, even if the component's props did not change."
    const {mapOfNamesOfCards, mapOfSizesCards, mapOfSizesCardsInPixels} = useAppSelector(selectors.cardsContents(), (prev, next) => {
        if (typeof next.mapOfNamesOfCards[parentCardNumber] !== 'undefined') {
            const prevStateOfMapNames = prev.mapOfNamesOfCards[parentCardNumber];
            const nextStateOfMapNames = next.mapOfNamesOfCards[parentCardNumber];
    
            if (typeof prevStateOfMapNames[indexOfDepth+1] === 'string' && typeof nextStateOfMapNames[indexOfDepth+1] === 'undefined' || typeof prevStateOfMapNames[indexOfDepth+1] === 'undefined' && typeof nextStateOfMapNames[indexOfDepth+1] === 'string') {
                console.log('a', parentCardNumber, indexOfDepth);
                return false;
            } else if (next.mapOfNamesOfCards[parentCardNumber][indexOfDepth] !== prev.mapOfNamesOfCards[parentCardNumber][indexOfDepth] || next.mapOfSizesCards[parentCardNumber][indexOfDepth] !== prev.mapOfSizesCards[parentCardNumber][indexOfDepth] || next.mapOfSizesCardsInPixels[parentCardNumber][indexOfDepth] !== prev.mapOfSizesCardsInPixels[parentCardNumber][indexOfDepth]) {
                console.log('b', parentCardNumber, indexOfDepth);
                return false;
            } else {
                console.log('c', parentCardNumber, indexOfDepth);
                return true;
            }
        } else {
            console.log('d', parentCardNumber, indexOfDepth);
            return true;
        }
    })
    const cardSizing = mapOfSizesCardsInPixels[parentCardNumber][indexOfDepth];
    const currentCard = mapOfNamesOfCards[parentCardNumber];
    const existIndex = !!currentCard[indexOfDepth+1];
    console.log('render', parentCardNumber, indexOfDepth);
    

    const draggable = {
        draggable: true,
        onDragStart: (e: dragEvent) => {
            e.dataTransfer.setData('card', String(parentCardNumber));
        },
        onDragOver: (e: dragEvent) => {
            e.preventDefault();
        },
        onDrop: (e: dragEvent) => {
            e.preventDefault();
            const cardDrop = e.dataTransfer.getData("card");

            dispatch(actions.dragAndDropCard(Number(cardDrop), parentCardNumber))
        }
    }

    useEffect(() => {
        dispatch(asyncСalculatingCardSize(1, parentCardNumber, indexOfDepth));
    }, [mapOfSizesCards[parentCardNumber][indexOfDepth]]);

    return (
        cardSizing === 0 ? (
            <div className="loader">
                <h1 className="loader-text">Загрузка</h1>
                <Preloader />
            </div>
        ) : (
            <div 
                className={`card ${indexOfDepth === 0 ? 'card-parent': ''} card-background__${indexOfDepth}`}
                style={{'width': cardSizing}}
            >
                <div className="card-header">
                    <h1 className="card-header__title"
                        onClick={(e) => dispatch(actions.showFullTitleCard(e, [parentCardNumber, indexOfDepth]))}
                        {...!indexOfDepth ? {...draggable} : null}
                    >{currentCard[indexOfDepth]}</h1>
                    <div className="card-header__menu" onClick={(e) => dispatch(actions.showPopupMenuFromCard(e, [parentCardNumber, indexOfDepth]))}></div>
                </div>
                {existIndex && <Card  parentCardNumber={parentCardNumber} indexOfDepth={indexOfDepth+1} />}
            </div>
        )
    )
}