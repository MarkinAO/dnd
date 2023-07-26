import LocalStorageManager from "./LocalStorageManager";

export default class ListEditor {
    constructor() {
        this.element = null;
        this.offset = {};
        this.localStorage = new LocalStorageManager();
        this.todoBoxes = this.localStorage.getData();
        this.currentMouseOver = null;
    }

    init() {
        const container = document.querySelector('.container');
        container.innerHTML ='';
        
        this.todoBoxes.forEach(el => {
            const box = document.createElement('div');
            box.classList.add('box');
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
            addTodoForm.classList.add('todo-creator-form');
            addTodoForm.classList.add('hidden');
            box.appendChild(addTodoForm);

            const addTodoInput = document.createElement('input');
            addTodoInput.classList.add('todo-creator-input');
            addTodoInput.setAttribute('type', 'text');
            addTodoInput.setAttribute('name', 'text');
            addTodoForm.appendChild(addTodoInput);

            const todoBtnAdd = document.createElement('button');
            todoBtnAdd.classList.add('todo-creator-btn-add');
            todoBtnAdd.classList.add('todo-creator-btn');
            todoBtnAdd.textContent = 'Добавить карточку';
            addTodoForm.appendChild(todoBtnAdd);
            todoBtnAdd.addEventListener('click', this.addTodo.bind(this));

            const todoBtnClose = document.createElement('button');
            todoBtnClose.classList.add('todo-creator-btn-close');
            todoBtnClose.classList.add('todo-creator-btn');
            todoBtnClose.innerHTML = '&#x2716;';
            addTodoForm.appendChild(todoBtnClose);
            todoBtnClose.addEventListener('click', this.closeTodoCreator.bind(this));

            const btnAddTodo = document.createElement('a');
            btnAddTodo.classList.add('box-add-button');
            btnAddTodo.textContent = '+ Добавить карточку';
            box.appendChild(btnAddTodo);            
        })

        container.addEventListener('mouseup', (e) => {
            if(e.target.classList.contains('cross')) {
                this.deleteCard(e);
            }                
        })
        
        document.documentElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.documentElement.addEventListener('mouseover', this.onMouseOver.bind(this));

        container.addEventListener('click', this.showTodoCreator.bind(this));

        container.addEventListener('mouseover', this.showCross.bind(this));        
    }

    showTodoCreator(e) {
        if(e.target.classList.contains('box-add-button')) {
            e.target.classList.add('hidden');
            const box = e.target.closest('.box');
            const form = box.querySelector('.todo-creator-form');
            form.classList.remove('hidden');
        }
    }

    addTodo(e) {
        e.preventDefault();
        const form = e.target.closest('.todo-creator-form');
        const formData = new FormData(form);
        const items = e.target.closest('.box').querySelector('.items');
        const text = formData.get('text');
        const newTodo = this.createTodo(text);
        items.appendChild(newTodo);
        this.closeTodoCreator(e);
        form.reset();
        this.updateBox();        
    }

    closeTodoCreator(e) {
        e.preventDefault();
        const form = e.target.closest('.todo-creator-form');
        form.classList.add('hidden');
        const box = e.target.closest('.box');
        const addButton = box.querySelector('.box-add-button');
        addButton.classList.remove('hidden');
    }

    createPreviewCard(startPreview) {
        this.removePreview();
        
        if(document.querySelector('startPreview')) return;
        const typePreview = startPreview ? 'startPreview' : 'preview';
        const preview = document.createElement('div');
        preview.classList.add(typePreview);
        preview.style.height = this.element.clientHeight + 'px';

        return preview;        
    }

    removePreview(allPreview = false) {
        const startPreview = document.querySelector('.startPreview');
        if(allPreview && startPreview) startPreview.remove();
        const preview = [...document.querySelectorAll('.preview')];
        if(preview) preview.forEach(el => el.remove());
    }

    onMouseOver(e) {
        if(!this.element || this.element === e.target) return;

        if(this.currentMouseOver && this.currentMouseOver === e.target) return
        this.currentMouseOver = e.target;
        
        this.removePreview();
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
        
        const startPreview = this.createPreviewCard('startPreview');
        this.element.after(startPreview);

        const elementStyle = getComputedStyle(this.element);
        this.element.style.width = elementStyle.width;
        this.element.classList.add('dragged');
        document.body.classList.add('grabbing');
    }

    onMouseUp(e) {
        if(!this.element) return;
        this.removePreview(true);

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
        this.updateBox();
        this.init();
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

        todo.addEventListener('mousedown', this.onMouseDown.bind(this));        

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
        const card = e.target.closest('.item');
        card.remove();
        this.updateBox();
    }

    updateBox() {
        const boxes = [...document.querySelectorAll('.box')];        
        this.todoBoxes = boxes.map(box => {
            const el = {};
            el.todo = [];
            el.title = box.querySelector('.box-title').textContent;
            const items = box.querySelectorAll('.item');
            
            items.forEach(todo => {
                el.todo.push(todo.textContent.slice(0, todo.textContent.length - 1));
            });
            return el;
        });
        this.localStorage.saveData(this.todoBoxes);
    }
}