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
        newTaskReturn: [],
        newCardTitle: [],
        draggingCard: null,
        draggingColumnIndex: null,
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
            this.saveData()
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            return date.toLocaleString('ru-RU', options);
        },
        addCard(columnIndex) {
            if (this.newCardTitle[columnIndex].trim() === '') return;

            const newCard = {
                id: Date.now(),
                title: this.newCardTitle[columnIndex],
                items: [],
                completedItems: 0,
                createAt: new Date().toLocaleString(),
                completedAt: [],
                showInputs: false,
            };

            this.columns[columnIndex].cards.push(newCard);
            this.newCardTitle[columnIndex] = '';
            this.saveData();
        },
        addTask(card) {
            const taskDescription = this.newTaskDescription[this.columns.findIndex(column => column.cards.includes(card))];
            const taskDate = this.newTaskDate[this.columns.findIndex(column => column.cards.includes(card))];
            const taskReturn = this.newTaskReturn[this.columns.findIndex(column => column.cards.includes(card))];
            const title = this.newCardTitle[this.columns.findIndex(column => column.cards.includes(card))];

            if (title){
                if(card.newCardTitle > 0){
                    card.title = title
                }
                else {
                    card.newCardTitle.push(title)
                }
                this.newCardTitle[this.columns.findIndex(column => column.cards.includes(card))] = '';
                this.saveData();
            }

            if (taskDescription || taskDate) {

                if (card.items.length > 0) {
                    card.items[0].description = taskDescription;
                    card.items[0].deadline = taskDate ?? '';
                    card.items[0].taskReturn = taskReturn ?? '';
                } else {
                    card.items.push({
                        description: taskDescription,
                        deadline: taskDate,
                        taskReturn: taskReturn ?? '',
                        completed: false,
                        completedAt: null
                    });
                }
                this.newTaskDescription[this.columns.findIndex(column => column.cards.includes(card))] = '';
                this.newTaskDate[this.columns.findIndex(column => column.cards.includes(card))] = '';
                this.newTaskReturn[this.columns.findIndex(column => column.cards.includes(card))] = '';
                this.saveData();
            }
            let time = new Date().toLocaleString();
            card.completedAt.push({time: time})
        },
        returnCard(card) {
            const currentColumnIndex = this.columns.findIndex(column => column.cards.includes(card));

            if (currentColumnIndex > 0) {
                const reason = this.newTaskReturn[this.columns.findIndex(column => column.cards.includes(card))];
                if (reason) {
                    if (card.items.length > 0) {
                        card.items[0].taskReturn = reason;
                    } else {
                        card.items.push({ taskReturn: reason, completed: false });
                    }

                    this.newTaskReturn[this.columns.findIndex(column => column.cards.includes(card))] = '';
                    let time = new Date().toLocaleString();
                    card.completedAt.push({time: time})
                    this.columns[currentColumnIndex - 1].cards.push(card);
                    this.columns[currentColumnIndex].cards.splice(this.columns[currentColumnIndex].cards.indexOf(card), 1);
                    this.saveData();
                } else {
                    this.show(card.id)
                    alert("Пожалуйста, укажите причину возврата.");
                }
            }
        },
        updateCompletion(card) {
            const currentColumnIndex = this.columns.findIndex(column => column.cards.includes(card));

            if (currentColumnIndex === 0) {
                card.completedAt = new Date().toLocaleString();
                this.columns[currentColumnIndex + 1].cards.push(card);
                this.columns[currentColumnIndex].cards.splice(this.columns[currentColumnIndex].cards.indexOf(card), 1);
            }

            if (currentColumnIndex === 1) {
                card.completedAt = new Date().toLocaleString();
                this.columns[currentColumnIndex + 1].cards.push(card);
                this.columns[currentColumnIndex].cards.splice(this.columns[currentColumnIndex].cards.indexOf(card), 1);
            }

            if (currentColumnIndex === 2) {
                card.completedAt = new Date().toLocaleString();
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
        },
        startDrag(columnIndex, card) {
            const currentColumnIndex = this.columns.findIndex(column => column.cards.includes(card));
            if (currentColumnIndex < 3){
                this.draggingCard = card;
                this.draggingColumnIndex = columnIndex;
            }
        },
        onDrop(columnIndex, card) {
            if (this.draggingCard) {
                this.columns[this.draggingColumnIndex].cards.splice(this.columns[this.draggingColumnIndex].cards.indexOf(this.draggingCard), 1);
                this.columns[columnIndex].cards.push(this.draggingCard);
                this.draggingCard = null;
                this.draggingColumnIndex = null;
                this.saveData();
            }
        },
        onDragOver(event) {
            event.preventDefault();
        }
    },
    mounted() {
        const savedData = localStorage.getItem('taskManagerData');
        if (savedData) {
            this.columns = JSON.parse(savedData);
        }
    }
});