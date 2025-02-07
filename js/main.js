new Vue({
    el: '#app',
    data: {
        columns: [
            { title: 'Запланированные задачи', cards: [] },
            { title: 'Задачи в работе', cards: [] },
            { title: 'Тестирование', cards: [] },
            { title: 'Выполненые задачи', cards: [] },
        ],
        newTaskDate: [],
        newTaskDescription: [],
        newCardTitle: [],
    },
    methods: {
        removeCard(columnIndex, cardIndex) {
            this.columns[columnIndex].cards.splice(cardIndex, 1);
            this.saveData();
        },
        showCard(index) {
            let carts = document.querySelectorAll('.cart');
            for (let cart of carts){
                if(cart.style.display === "flex"){
                    cart.style.display = "none"
                }
                else cart.style.display = 'flex';
            }
        },
        show(cardId) {
            const card = this.columns
                .flatMap(column => column.cards)
                .find(card => card.id === cardId);

            if (card) {
                card.showInputs = !card.showInputs;
            }
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            return date.toLocaleString('ru-RU', options);
        },
        isEditable(index, card) {
            return index === 0 ? card.items.length >= 1 : true;
        },
        isEditable2(index) {
            return index === 0 ? this.columns[1].cards.length < 5 : true;
        },
        addCard(columnIndex, card) {
            if (this.newCardTitle[columnIndex].trim() === '') return;

            const newCard = {
                id: Date.now(),
                title: this.newCardTitle[columnIndex],
                items: [],
                completedItems: 0,
                createAt: new Date().toLocaleString(),
                completedAt: null,
                showInputs: false,
            };

            this.columns[columnIndex].cards.push(newCard);
            this.newCardTitle[columnIndex] = '';
            this.saveData();
        },
        addTask(card) {
            const taskDescription = this.newTaskDescription[this.columns.findIndex(column => column.cards.includes(card))];
            const taskDate = this.newTaskDate[this.columns.findIndex(column => column.cards.includes(card))];

            if (taskDescription && taskDate){
                card.items.push({description: taskDescription ,deadline: taskDate, completed: false, completedAt: null });
                if(card.items.length > 1){
                    card.items.splice(card.items[0], 1)
                }
                card.completedAt = new Date().toLocaleString();
                this.newTaskDescription[this.columns.findIndex(column => column.cards.includes(card))] = '';
                this.newTaskDate[this.columns.findIndex(column => column.cards.includes(card))] = '';
                this.saveData();
            }
        },
        updateCompletion(card) {
            const currentColumnIndex = this.columns.findIndex(column => column.cards.includes(card));

            if (currentColumnIndex === 0) {
                this.columns[currentColumnIndex + 1].cards.push(card);
                this.columns[currentColumnIndex].cards.splice(this.columns[currentColumnIndex].cards.indexOf(card), 1);
            }

            this.saveData();
        },
        saveData() {
            localStorage.setItem('taskManagerData', JSON.stringify(this.columns));
        },
        clearStorage() {
            localStorage.removeItem('taskManagerData');
            this.columns = [
                { title: 'Запланированные задачи', cards: [] },
                { title: 'Задачи в работе', cards: [] },
                { title: 'Тестирование', cards: [] },
                { title: 'Выполненые задачи', cards: [] },
            ];
        }
    },
    mounted() {
        const savedData = localStorage.getItem('taskManagerData');
        if (savedData) {
            this.columns = JSON.parse(savedData);
        }
    }
});