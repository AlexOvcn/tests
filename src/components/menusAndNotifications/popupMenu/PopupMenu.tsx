import { useEffect, useRef } from "react";
import { actionsOnTheClickEventForPopupMenu } from "../../../redux/actionCreators";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import PopupMenuBody from "./PopupMenuBody"

export const PopupMenu = () => {
    const dispatch = useAppDispatch();
    const refPopupMenuBody = useRef<HTMLDivElement>(null);
    const active = useAppSelector(state => state.popupMenu.active);

    useEffect(() => {
        if (active) {
            dispatch(actionsOnTheClickEventForPopupMenu(refPopupMenuBody));
        }
    })
    return(
        <>
            {active && <PopupMenuBody ref={refPopupMenuBody} />}
        </>
    )
}