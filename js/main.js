new Vue({
    el: '#app',
    data: {
        columns: [
            { title: 'Новые задачи', cards: [] },
            { title: 'Ну вот почти-почти', cards: [] },
            { title: 'Выполненые задачи', cards: [] },
        ],
        newTaskText: [],
        newCardTitle: [],
        priorityCard: null,
    },
    methods: {
        setPriority(card) {
            const columnIndex = this.columns.findIndex(column => column.cards.includes(card));

            if (columnIndex === 2) {
                this.priorityCard = null;
            } else {
                if (this.priorityCard === card) {
                    this.priorityCard = null;
                } else {
                    this.priorityCard = card;
                }
            }
            this.saveData();
        },
        show(){
            let carts = document.querySelectorAll('.cart');
            for (let cart of carts){
                if(cart.style.display === "flex"){
                    cart.style.display = "none"
                }
                else cart.style.display = 'flex';
            }
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            return date.toLocaleString('ru-RU', options);
        },
        isEditable(index) {
            return index === 0 ? this.columns[0].cards.length < 3 : true;
        },
        isEditable2(index) {
            return index === 0 ? this.columns[1].cards.length < 5 : true;
        },
        addCard(columnIndex) {
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
            this.saveData();
        },
        addTask(card) {
            const taskText = this.newTaskText[this.columns.findIndex(column => column.cards.includes(card))];

            if (taskText && taskText.trim() !== '') {
                if (card.items.length < 5){
                    card.items.push({ text: taskText, completed: false, completedAt: null });
                    this.newTaskText[this.columns.findIndex(column => column.cards.includes(card))] = '';
                    this.saveData();
                }
                else {
                    document.getElementById('error').innerHTML = "Максимум 5 задач"
                }
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
            localStorage.setItem('priorityCardId', this.priorityCard ? this.priorityCard.id : null);
        },
        clearStorage() {
            localStorage.removeItem('taskManagerData');
            localStorage.removeItem('priorityCard');
            this.columns = [
                { title: 'Новые задачи', cards: [] },
                { title: 'Ну вот почти-почти', cards: [] },
                { title: 'Выполненые задачи', cards: [] },
            ];
            this.priorityCard = null;
        }
    },
    mounted() {
        const savedData = localStorage.getItem('taskManagerData');
        const savedPriorityCardId = localStorage.getItem('priorityCardId');
        if (savedData) {
            this.columns = JSON.parse(savedData);
        }
        if (savedPriorityCardId) {
            const cardId = parseInt(savedPriorityCardId, 10);
            for (const column of this.columns) {
                const card = column.cards.find(card => card.id === cardId);
                if (card) {
                    this.priorityCard = card;
                }
            }
        }
    }
});