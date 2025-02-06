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
        show(index){
            if (index === 0){
                let descriptions = document.querySelectorAll('.description');
                for (let description of descriptions){
                    if(description.style.display === "flex"){
                        description.style.display = "none"
                    }
                    else description.style.display = 'flex';
                }
            }
            else {
                let carts = document.querySelectorAll('.cart');
                for (let cart of carts){
                    if(cart.style.display === "flex"){
                        cart.style.display = "none"
                    }
                    else cart.style.display = 'flex';
                }
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
                completedAt: null
            };

            this.columns[columnIndex].cards.push(newCard);
            this.newCardTitle[columnIndex] = '';
            card.completedAt = new Date().toLocaleString();
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
            const completedCount = card.items.filter(item => item.completed).length;
            card.completedItems = completedCount;

            const totalTasks = card.items.length;
            const rate = (completedCount / totalTasks) * 100;

            const currentColumnIndex = this.columns.findIndex(column => column.cards.includes(card));

            if (rate > 50 && rate < 100 && currentColumnIndex < this.columns.length - 1) {
                this.columns[currentColumnIndex + 1].cards.push(card);
                this.columns[currentColumnIndex].cards.splice(this.columns[currentColumnIndex].cards.indexOf(card), 1);
            }

            if (rate <= 50 && currentColumnIndex > 0) {
                this.columns[currentColumnIndex - 1].cards.push(card);
                this.columns[currentColumnIndex].cards.splice(this.columns[currentColumnIndex].cards.indexOf(card), 1);
            }

            if (rate === 100 && currentColumnIndex < this.columns.length - 1) {
                card.completedAt = new Date().toLocaleString();
                this.columns[this.columns.length - 1].cards.push(card);
                this.columns[currentColumnIndex].cards.splice(this.columns[currentColumnIndex].cards.indexOf(card), 1);
            }

            if (rate === 100) {
                this.priorityCard = null;
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