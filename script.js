document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const emptyState = document.getElementById('emptyState');
    const tabs = document.querySelectorAll('.tab');

    let todos = JSON.parse(localStorage.getItem('aurora-todos')) || [];
    let currentFilter = 'all';

    const saveTodos = () => {
        localStorage.setItem('aurora-todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }

        filteredTodos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="checkbox" onclick="toggleTodo(${todo.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `;
            todoList.appendChild(li);

            // Entry animation
            anime({
                targets: li,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 400,
                easing: 'easeOutExpo',
                delay: index * 50
            });
        });
    };

    const addTodo = () => {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.unshift(newTodo);
            todoInput.value = '';
            saveTodos();
            renderTodos();

            // Button pop animation
            anime({
                targets: addBtn,
                scale: [1, 1.2, 1],
                duration: 300
            });
        }
    };

    window.toggleTodo = (id) => {
        todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveTodos();
        renderTodos();
    };

    window.deleteTodo = (id) => {
        const item = document.querySelector(`[onclick="deleteTodo(${id})"]`).parentElement;
        anime({
            targets: item,
            opacity: 0,
            translateX: 50,
            duration: 300,
            easing: 'easeInExpo',
            complete: () => {
                todos = todos.filter(t => t.id !== id);
                saveTodos();
                renderTodos();
            }
        });
    };

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderTodos();
        });
    });

    renderTodos();
});
