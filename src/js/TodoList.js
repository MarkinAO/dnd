import { v4 as uuidv4 } from 'uuid';

export default class ListEditor {
    constructor() {
        this.element = null;
        this.offset = {};
        this.todoBoxes = [
            {
                title: 'Задачи 1',
                todo: [
                    'Задача 1.1',
                    'Задача 1.2',
                    'Задача 1.3'
                ]
            },
            {
                title: 'Задачи 2',
                todo: [
                    'Задача 2.1',
                    'Задача 2.2',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus beatae laboriosam, excepturi numquam sed quidem consequuntur voluptas magni non iure. Explicabo ratione quasi, ipsum ex maiores fugit. Magnam, sit recusandae?'
                ]
            },
            {
                title: 'Задачи 3',
                todo: [
                    'Задача 3.1',
                    'Задача 3.2',
                    'Задача 3.3'
                ]
            }
        ];
    }

    init() {
        const container = document.querySelector('.container');
        this.todoBoxes.forEach(el => {
            const box = document.createElement('div');
            box.classList.add('box');
            const id = uuidv4();
            box.setAttribute('data-id', id);
            container.appendChild(box);            

            const boxTitle = document.createElement('div');
            boxTitle.classList.add('box-title');
            boxTitle.textContent = el.title;
            box.appendChild(boxTitle);

            const items = document.createElement('div');
            items.classList.add('items');
            box.appendChild(items);

            el.todo.forEach(elem => {
                const todo = this.createTodo(elem);
                items.appendChild(todo);                
            })

            const addTodoForm = document.createElement('form');
            addTodoForm.classList.add('add-todo-form');
            addTodoForm.classList.add('hidden');
            box.appendChild(addTodoForm);

            const addTodoInput = document.createElement('input');
            addTodoInput.classList.add('add-todo-input');
            addTodoInput.setAttribute('type', 'text')
            addTodoForm.appendChild(addTodoInput);

            const todoBtnAdd = document.createElement('button');
            todoBtnAdd.classList.add('todo-btn-add');
            todoBtnAdd.classList.add('todo-btn');
            todoBtnAdd.textContent = 'Добавить карточку';
            addTodoForm.appendChild(todoBtnAdd);

            const todoBtnClose = document.createElement('button');
            todoBtnClose.classList.add('todo-btn-close');
            todoBtnClose.classList.add('todo-btn');
            todoBtnClose.innerHTML = '&#x2716;';
            addTodoForm.appendChild(todoBtnClose);

            const btnAddTodo = document.createElement('a');
            btnAddTodo.classList.add('box-add-button');
            btnAddTodo.textContent = '+ Добавить карточку';
            box.appendChild(btnAddTodo);            
        })

        container.addEventListener('click', (e) => {
            if(e.target.classList.contains('cross')) {
                alert('!!!');
                // this.deleteCard(e);
            }                
        })        
        
        document.documentElement.addEventListener('mouseup', (e) => {
            this.onMouseUp(e);
        });
        document.documentElement.addEventListener('mouseover', (e) => {
            this.onMouseOver(e);
        });        

        container.addEventListener('click', (e) => {
            this.showAddTodo(e);
        });

        this.showCross = this.showCross.bind(this);
        container.addEventListener('mouseover', this.showCross);

        container.addEventListener('mousedown', (e) => {
                this.onMouseDown(e);
        });
    }

    showAddTodo(e) {
        if(e.target.classList.contains('box-add-button')) {
            e.target.classList.add('hidden');
            const box = e.target.closest('.box');
            const form = box.querySelector('.add-todo-form');
            form.classList.remove('hidden');
        }
    }

    createPreviewCard() {
        this.removePreview();
        const preview = document.createElement('div');
        preview.classList.add('preview');
        preview.style.height = this.element.clientHeight + 'px';

        return preview;
    }

    removePreview() {
        const preview = document.querySelector('.preview');
        if(preview) preview.remove();
    }

    onMouseOver(e) {
        if(!this.element) return;
        const { top, left } = this.element.getBoundingClientRect();

        if(!this.offset.top) {
            this.offset.top = e.clientY - top;
            this.offset.left = e.clientX - left;
        }
        
        this.element.style.top = e.clientY - this.offset.top + 'px';
        this.element.style.left = e.clientX - this.offset.left + 'px';

        const item = e.target;
        const preview = this.createPreviewCard();
        if(item.closest('.items')) {
            const { top } = item.getBoundingClientRect();
            if(e.clientY < top + item.clientHeight / 2) {
                item.before(preview);
            } else {
                item.after(preview);
            }            
        }
    }

    onMouseDown(e) {
        e.preventDefault();
        this.element = e.target;
        if(!this.element.classList.contains('item')) return;
        
        const elementStyle = getComputedStyle(this.element);
        this.element.style.width = elementStyle.width;
        this.element.classList.add('dragged'); 
        document.body.classList.add('grabbing');
    }

    onMouseUp(e) {
        if(!this.element) return;
        this.removePreview();

        const mouseUpItem = e.target;        
        if(mouseUpItem.closest('.items')) {
            const { top } = mouseUpItem.getBoundingClientRect();
            if(e.clientY < top + mouseUpItem.clientHeight / 2) {
                mouseUpItem.before(this.element);
            } else {
                mouseUpItem.after(this.element);
            }            
        }

        this.element.removeAttribute('style');
        this.element.classList.remove('dragged');
        const replacementElement = document.querySelector('.replacement');        
        if(replacementElement) replacementElement.remove();
        document.body.classList.remove('grabbing');
        this.element = null;
        this.offset = {};
    }

    createTodo(text) {
        const todo = document.createElement('div');
        todo.classList.add('item');
        todo.textContent = text;                

        const cross = document.createElement('span');
        cross.innerHTML = "&#x2716;";
        cross.classList.add('cross');
        cross.classList.add('hidden');
        todo.appendChild(cross);

        return todo;
    }

    showCross(e) {
        const item = e.target;
        if(this.element || item.classList.contains('cross')) return;

        const cross = item.querySelector('.cross');
        if(item.classList.contains('item')) {            
            cross.classList.remove('hidden');
        } else {
            this.hiddenCross(); 
        }
    }

    hiddenCross() {
        const croses = [...document.querySelectorAll('.cross')];
        croses.forEach(el => el.classList.add('hidden'));
    }

    deleteCard(e) {
        alert('Уверен?')        
        const card = e.target.closest('item');
        card.remove();
    }

    
}