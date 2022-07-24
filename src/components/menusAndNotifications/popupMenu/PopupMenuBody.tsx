import { forwardRef } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { selectors } from "../../../redux/selectors";
import { CardSettings } from "./popupMenuContents/CardSettings";
import { FullNameCard } from "./popupMenuContents/FullNameCard";
import { HelpMenu } from "./popupMenuContents/HelpMenu";

export default forwardRef((_, ref: React.ForwardedRef<HTMLDivElement>) => {
    const {contentName, width, height, coordinates} = useAppSelector(selectors.popupMenu());

    function switchFunction() {
        switch (contentName) {
            case 'help':
                return <HelpMenu />;
            case 'card':
                return <CardSettings />;
            case 'fullNameCard':
                return <FullNameCard />;
            default:
                return null;
        }
    }

    return (
        <div ref={ref} className="popup-menu" id="popup-menu" style={{'width': width, 'height': height, 'left': coordinates.left, 'top': coordinates.top}}>
            <div className="popup-menu__cross" id="popup-menu__cross"></div>
            {switchFunction()}
        </div>
    )
});