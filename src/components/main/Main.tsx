import { useAppSelector } from "../../redux/hooks";
import { selectors } from "../../redux/selectors";
import { Card } from "./Card";
// @ts-ignore
import plus from '../../img/plus.svg';

export default () => {
    const {mapOfNamesOfCards} = useAppSelector(selectors.cardsContents());
    
    return (
        <section className="main-content">
            {mapOfNamesOfCards.length ? mapOfNamesOfCards.map((_, i) => {
                return <Card parentCardNumber={i} indexOfDepth={0} key={i} />
            }).reverse() : (
                <div>
                    <h1>Список карточек пуст</h1>
                    <h4>Чтобы добавить новую, нажмите на значок: <img src={plus} width={17}/></h4>
                </div>
            )}
        </section>
    )
}