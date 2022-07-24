export const HelpMenu = () => {
    return (
        <>
            <h3 className="helpMenu-title">Подсказки</h3>
            <div className="helpMenu-elem icon-plus">- добавление новой карточки</div>
            <div className="helpMenu-elem icon-cardMenu">- редактирование карточки</div>
            <div className="helpMenu-elem icon-fullName"> - полное название (ЛКМ по нему)</div>
            <div className="helpMenu-elem icon-dragAndDrop"> - перетаскивание карточки за название</div>
        </>
    )
}