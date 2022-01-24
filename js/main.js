// Импортируем JSON 
import {BASE} from '../BASE.js';

// Допустим этот JSON с сервера
let obj = JSON.parse(BASE);

// Функционал таблицы
class TableFunctions {
    // приватное свойство текущего, общего состояния
    #currentState = {};
    // количество страниц
    pageCount;
    // текущая страница
    currentPage = 1;
    // сортируемое поле
    sortableField = '';
    // сортируемое слово
    sortableWord = '';
    // показ отдельных колонок
    firstName = true;
    lastName = true;
    about = true;
    eyeColor = true;

    // инициализация первичного состояния
    constructor(state) {
        if (state !== null && !Array.isArray(state) && typeof state === 'object') {
            this.#currentState = state;

            // округляем кол-во страниц в большую сторону и задаем это значение в контексте
            this.pageCount = Math.ceil(state[0].length / 10);

            // первичный рендер тела таблицы
            this.render();
        }
    }

    // получение текущего состояния (выдается порционно, по 10 записей)
    getState(page = 1) {

        // отмечаем текущую страницу
        this.currentPage = page;

        // функция с условием сортировки по страницам
        function sortingCondition(index) {
            
            // условие нахождения диапазона записей
            if (index < (page*10) && index >= (page*10-10)) {
                return true;
            }
        }

        // если параметры сортировки не пусты, сортировка сначала проходит от общего состояния обьекта в соостветсвии параметрам сортировки, а далее отсортированный массив сортируется по заданной странице
        if (this.sortableWord !== '' && this.sortableField !== '') {
            let filteredArray = this.#currentState[0].filter((item) => {

                if (item[this.sortableField] === this.sortableWord || (item['name'] && item['name'][this.sortableField] === this.sortableWord)) {
                    return true;
                }

            })

            // задаем общее кол-во стр. относительно отфильтрованного массива
            this.pageCount = Math.ceil(filteredArray.length / 10);

            return filteredArray.filter((item, index) => {

                // сортируем и возвращаем новый массив в котором находятся записи в соотв. с переданным номером страницы
                return sortingCondition(index);
            });
        } else {
            return this.#currentState[0].filter((item, index) => {

                // сортируем и возвращаем новый массив в котором находятся записи в соотв. с переданным номером страницы
                return sortingCondition(index);
            });
        }
    }

    // обновление текущего состояния поля у одной из строк
    setFieldState(id, field, value) {

        // находим нужный нам обьект по id и изменяем определенное поле у него 
        if (this.#currentState[0] && this.#currentState[0].length) {
            let foundRow = this.#currentState[0].find(item => {

                if(id === item.id) {
                    return true;
                }
            });
            
            // в случае если ищем поля firstName или lastName
            if (foundRow[field] === undefined) {
                foundRow.name[field] = value;
            } else {
                foundRow[field] = value;
            }

            return `Состояние поля ${field} из строки c id = ${id} изменено!`;
        } else {
            return 'Обьект состояния пуст!';
        }
    }

    // задаем параметры сортировки
    setSortingRows() {

        // берем значение элемента с выбором поля
        let valueOfSelect = document.querySelector('#sortSelect').value;

        // берем значение input элемента 
        let valueOfInput = document.querySelector('#sortInput').value;

        this.sortableField = !valueOfInput.trim() ? '' : valueOfSelect;
        this.sortableWord = valueOfInput;
        this.currentPage = 1;
        this.render();
    }

    // очищаем параметры сортировки
    recoveryAfterSorting() {

        // очищаем значение элемента с выбором поля
        document.querySelector('#sortSelect').value = 'firstName';

        // очищаем значение input элемента 
        document.querySelector('#sortInput').value = '';

        // восстанавливаем общее кол-во страниц
        this.pageCount = Math.ceil(this.#currentState[0].length / 10);

        this.sortableField = '';
        this.sortableWord = '';
        this.currentPage = 1;
        this.render();
    }

    // эта функция отвечает за событие над изменением поля
    changeField(e) {

        // обозначаем родителя элемента события
        let parentElement = e.target.parentElement;

        // берем содержимое параграфа
        let contentOfParagraph = e.target.textContent;

        // берем тип изменяемого поля
        let fieldType = e.target.dataset.fieldType;

        // получаем класс родительской строки (в нем имеется id записи)
        let rowId = parentElement.closest('.table-body__row').className.split(' ')[1];

        // удаляем элемент параграфа из HTML
        parentElement.removeChild(e.target);

        // заменяем его на элемент textarea
        let textarea = document.createElement('textarea');
        textarea.className = 'activeTextarea';
        textarea.textContent = contentOfParagraph;
        parentElement.append(textarea);
        textarea.focus();

        // сохраняем изменения и делаем перерисовку таблицы после потери фокуса у textarea
        textarea.onblur = () => {
            let valueTextarea = document.querySelector('.activeTextarea').value;
            this.setFieldState(rowId, fieldType, valueTextarea);
            this.render(this.currentPage);
        };
    }

    // эта функция проверяет отмеченные чекбоксы для показа колонок в таблице
    columnCheckboxes(num) {

        switch (num) {
            case 1:
                let columnCheck1 = document.querySelector('#column_check1');
                columnCheck1.checked ? this.firstName = true : this.firstName = false;
                break;
            case 2:
                let columnCheck2 = document.querySelector('#column_check2');
                columnCheck2.checked ? this.lastName = true : this.lastName = false;
                break;
            case 3:
                let columnCheck3 = document.querySelector('#column_check3');
                columnCheck3.checked ? this.about = true : this.about = false;
                break;
            case 4:
                let columnCheck4 = document.querySelector('#column_check4');
                columnCheck4.checked ? this.eyeColor = true : this.eyeColor = false;
                break;
            
            default:
                break;
        }
        this.render();
    }

    // эта функция отрисовывает тело таблицы
    render(page = 1, topOfPage = false) {
        
        // находим верхушку, тело таблицы, div для пагинации и вспомогательный div для оповещения
        let tableHead = document.querySelector('#table_head'),
            tableBody = document.querySelector('#table_body'),
            tableEmpty = document.querySelector('.table-empty'),
            pagination = document.querySelector('.pagination');

        // чистим тело таблицы, пагинацию и сообщение о пустой таблице
        tableBody.innerHTML = '';
        tableEmpty.innerHTML = '';
        pagination.innerHTML = '';

        // подстраиваем под конфигурацию верхнюю часть таблицы
        tableHead.innerHTML = `<tr class="table-head__row">${(this.firstName || this.lastName || this.about || this.eyeColor) ? "<th>№</th>" : ''}${this.firstName ? "<th>Имя</th>" : ''}${this.lastName ? "<th>Фамилия</th>": ''}${this.about ? "<th>Описание</th>" : ''}${this.eyeColor ? "<th>Цвет глаз</th>" : ''}</tr>`;

        // отрисовка строки в таблице
        let rowRender = (obj, pos) => {
            
            // создаем строку таблицы
            let tableRow = document.createElement('tr');

            // дадим этой строке классы
            tableRow.className = `table-body__row ${obj.id}`;

            // заполняем строку
            tableRow.innerHTML = `${(this.firstName || this.lastName || this.about || this.eyeColor) ? `<td><p>${(page*10-10)+pos+1}</p></td>` : ''}${this.firstName ? `<td><p data-field-type='firstName' onclick='changeField(event)'>${obj.name.firstName}</p></td>` : ''}${this.lastName ? `<td><p data-field-type='lastName' onclick='changeField(event)'>${obj.name.lastName}</p></td>` : ''}${this.about ? `<td><p data-field-type='about' onclick='changeField(event)'>${obj.about}</p></td>` : ''}${this.eyeColor ? `<td><p style='color:${obj.eyeColor}' data-field-type='eyeColor' onclick='changeField(event)'>${obj.eyeColor}</p></td>` : ''}`;

            // вставляем строку в тело таблицы
            tableBody.append(tableRow);
        }

        // отрисовываем таблицу циклом по массиву из полученных элементов или если элементов нет отображаем это
        let tableState = this.getState(page);

        // переведем значения поля на русский язык
        let fieldTranslationToRussian;
        switch (this.sortableField) {
            case 'firstName':
                fieldTranslationToRussian = 'Имя';
                break;
            case 'lastName':
                fieldTranslationToRussian = 'Фамилия';
                break;
            case 'about':
                fieldTranslationToRussian = 'Описание';
                break;
            case 'eyeColor':
                fieldTranslationToRussian = 'Цвет глаз';
                break;

            default:
                break;
        }

        // вывод сообщения, если таблица отрисовывается без значений
        if (!tableState.length) {
            tableEmpty.innerHTML = `<hr><h2 class="table-hasNotRows">Эта таблица пуста!</h2><p class="table-hasNotRows">Поиск по полю '${fieldTranslationToRussian}' со значением '${this.sortableWord}' не дал результата</p><hr>`;
        } else if (!(this.firstName || this.lastName || this.about || this.eyeColor)) {
            tableEmpty.innerHTML = `<hr><h2 class="table-hasNotRows">Эта таблица пуста!</h2><p class="table-hasNotRows">Для отображения выберите хотя бы одну колонку!</p><hr>`;
        }

        // отрисовка таблицы
        tableState.map((object, index) => {
            rowRender(object, index);
        });

        // отрисовка пагинации
        for(let i = 1; i <= this.pageCount; i++) {

            // создаем элемент пагинации
            let paginationElem = document.createElement('button');

            // дадим этому элементу класс, событие и содержимое
            paginationElem.className = `pagination-item`;
            paginationElem.setAttribute('onpointerdown', `render(${i}, true)`);
            paginationElem.innerHTML = i;

            // вставляем элемент
            pagination.append(paginationElem);

            // добавление класса для текущей страницы
            if (this.currentPage === i) {
                paginationElem.className += ' current-page';
            }
        }

        // добавляем плавную прокрутку к началу страницы, если нам это нужно
        if (topOfPage) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        }
    }
}

// Получение экземпляра состояния (передаем первичный вид обьекта)
let state = new TableFunctions(obj);

// Область видимости переменных из модульных скриптов ограничена локальным окружением скрипта, поэтому для вызова из HTML мы передаем функции в глобальный обьект (передавая функциям контекст обьекта)
window.changeField = state.changeField.bind(state);
window.setSortingRows = state.setSortingRows.bind(state);
window.recoveryAfterSorting = state.recoveryAfterSorting.bind(state);
window.columnCheckboxes = state.columnCheckboxes.bind(state);
window.render = state.render.bind(state);


