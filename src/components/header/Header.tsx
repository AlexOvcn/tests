import { actions } from "../../redux/actionCreators";
import { useAppDispatch } from "../../redux/hooks";

export default () => {
    const dispatch = useAppDispatch();
    
    return (
        <header className="container">
            <div className="header-controlPanel">
                <div className="header-controlPanel__addCard" onClick={() => dispatch(actions.addParentCard())}></div>
                <div className="header-controlPanel__help" onClick={(e) => dispatch(actions.showPopupMenuFromHeader(e))}></div>
            </div>
        </header>
    )
}