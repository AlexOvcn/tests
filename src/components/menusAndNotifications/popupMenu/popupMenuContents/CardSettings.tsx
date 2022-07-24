import { RefObject, useEffect, useRef } from "react";
import { actionOfCardSetting, IKeysOfForm } from "../../../../redux/actionCreators";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { selectors } from "../../../../redux/selectors";

export const CardSettings = () => {
    const refForm: RefObject<HTMLFormElement & IKeysOfForm> = useRef(null);
    const dispatch = useAppDispatch();
    const {cardCoordinates} = useAppSelector(selectors.popupMenu());
    const {mapOfNamesOfCards, mapOfSizesCards} = useAppSelector(selectors.cardsContents());
    const [parentCardNumber, indexOfDepth] = cardCoordinates as [number, number];

    useEffect(() => {
        dispatch(actionOfCardSetting(refForm, [parentCardNumber, indexOfDepth]));
    }, [])

    return (
        <>
            <form ref={refForm} className='settingsCardMenu'>
                <h3 className="settingsCardMenu-title">Параметры карточки</h3>
                <label className="settingsCardMenu-item">
                    <p className="settingsCardMenu-item__title">Изменить название:</p>
                    <input type="text" name="rename" className="settingsCardMenu-item__body input" autoComplete="off" maxLength={25} defaultValue={mapOfNamesOfCards[parentCardNumber][indexOfDepth]}/>
                </label>
                <label className="settingsCardMenu-item">
                    <p className="settingsCardMenu-item__title">Изменить размер:</p>
                    <select name="changeSize" className="settingsCardMenu-item__body select" defaultValue={mapOfSizesCards[parentCardNumber][indexOfDepth]}>
                        {[...Array(6)].map((_, iter) => {
                            return <option value={iter+1} key={iter}>{iter+1}</option>;
                        })}
                    </select>
                </label>
                {!mapOfNamesOfCards[parentCardNumber][indexOfDepth+1] && indexOfDepth < 2 ? (
                    <label className="settingsCardMenu-item">
                    <p className="settingsCardMenu-item__title">Добавить внутреннюю карточку:</p>
                    <div className="customCheckbox" tabIndex={-1}>
                        <input type="checkbox" name="addChildCard"/>
                        <span></span>
                    </div>
                </label>
                ): null}
                <label className="settingsCardMenu-item">
                    <p className="settingsCardMenu-item__title">Удалить эту карточку:</p>
                    <div className="customCheckbox" tabIndex={-1}>
                        <input type="checkbox" name="delete"/>
                        <span></span>
                    </div>
                </label>
                <button type="submit" name="acceptСhanges" className="settingsCardMenu-acceptButton button">Применить изменения</button>
            </form>
        </>
    )
}