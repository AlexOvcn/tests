import { useAppSelector } from "../../../../redux/hooks";
import { selectors } from "../../../../redux/selectors";

export const FullNameCard = () => {
    const {cardCoordinates} = useAppSelector(selectors.popupMenu());
    const {mapOfNamesOfCards} = useAppSelector(selectors.cardsContents());
    const [parentCardNumber, indexOfDepth] = cardCoordinates as [number, number];

    return (
        <>
            <p className="fullNameCard-text">{mapOfNamesOfCards[parentCardNumber][indexOfDepth]}</p>
        </>
    )
}
