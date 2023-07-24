export default class LocalStorageManager {
    constructor(context) {
        this.context = context;
        this.startData = JSON.stringify([
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
        ]);

        localStorage.setItem('data', this.startData);
    }

    saveData(data) {
        data = JSON.stringify(data);
        localStorage.setItem('data', data);
    }

    getData() {
        return JSON.parse(localStorage.data);
    }
}