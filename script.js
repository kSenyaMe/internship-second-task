let todos = []
let currentFilter = 'all';

const template = document.getElementById("template");

const input = document.getElementById("new-todo");
input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        console.log(todos);
        createTodo();
        saveToLocalStorage();
        renderTodos();
        updateCounter();
        input.value = "";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateCounter();
});

let displayTodos = []

function applyFilter() {
    if (currentFilter === 'all') {
        displayTodos = [...todos]
    } else if (currentFilter === 'active') {
        displayTodos = todos.filter(t => !t.check)
    } else if (currentFilter === 'completed') {
        displayTodos = todos.filter(t => t.check)
    }
    renderTodos()
}

function showAll() {
    currentFilter = 'all'
    applyFilter()
}

function showActive() {
    currentFilter = 'active'
    applyFilter()
}

function showCompleted() {
    currentFilter = 'completed'
    applyFilter()
}

const createTodo = () => {
    const newTodo = {
        "id": Date.now(),
        "title": input.value,
        "check": false
    }
    todos.push(newTodo);
    saveToLocalStorage();
    applyFilter();
    updateCounter();
    input.value = "";
}

const getMaxId = () => {
    let max = 0;
    todos.forEach(todo => {
        if (todo.id > max) {
            max = todo.id;
        }
    });
}

const saveToLocalStorage = () => {
    const todosStr = JSON.stringify(todos);
    localStorage.setItem("todos", todosStr);
}

const loadFromLocalStorage = () => {
    todos = JSON.parse(localStorage.getItem("todos"));
    renderTodos();
    applyFilter();
}

const list = document.querySelector(".todolist");

const renderTodos = () => {
    list.innerHTML = "";
    displayTodos.forEach(todo => {
        const todoElement = createElement(todo);
        list.appendChild(todoElement);
    });
}

const updateCounter = () => {
    let count = 0;
    todos.forEach(todo => {
        if (!todo.check) {
            count++;
        }
    })
    const counter = document.querySelector(".js-counter");
    counter.textContent = count + ' tasks left';
}

const createElement = (todo) => {
    const todoElement = template.cloneNode(true);
    todoElement.removeAttribute('id');
    const cardText = todoElement.querySelector(".js-card-text");
    cardText.textContent = todo.title;

    cardText.addEventListener('dblclick', () => {
        const editInput = document.createElement('input');

        editInput.classList.add('edit-todo');
        editInput.value = todo.title;

        cardText.replaceWith(editInput);
        editInput.focus();

        const saveEdit = () => {
            const newTitle = editInput.value.trim();

            if (newTitle !== '') {
                editTodo(todo.id, newTitle);
            } else {
                applyFilter();
            }
        };

        editInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                saveEdit();
            }

            if (event.key === 'Escape') {
                applyFilter();
            }
        });

        editInput.addEventListener('blur', saveEdit);
    });

    const checkImg = todoElement.querySelector(".js-check");

    if (todo.check) {
        checkImg.src = 'cheked.svg';
        cardText.style.textDecoration = "line-through";
        cardText.style.color = "#d8bcbc";
        todoElement.classList.add('is-completed');
    } else {
        checkImg.src = "ellipse-red.svg";
        cardText.style.textDecoration = "none";
        cardText.style.color = "#A62121";
        todoElement.classList.remove('is-completed');
    }

    const checkBtn = todoElement.querySelector(".js-check");
    checkBtn.addEventListener("click", () => {
        toggleTodo(todo.id);
    });

    const clearBtn = todoElement.querySelector(".js-clear");
    clearBtn.addEventListener("click", () => {
        deleteTodo(todo.id);
    });
    return todoElement;
}

const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderTodos();
    applyFilter();
    updateCounter();
}

const clearCompleted = () => {
    todos = todos.filter(todo => !todo.check);
    saveToLocalStorage();
    applyFilter();
    updateCounter();
}

const toggleTodo = (id) => {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return {
                ...todo,
                check: !todo.check
            };
        }
        return todo;
    });
    saveToLocalStorage();
    renderTodos();
    applyFilter();
    updateCounter();
    updateToggleAllView();
}

const editTodo = (id, newTitle) => {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return {
                ...todo,
                title: newTitle
            };
        }

        return todo;
    });

    saveToLocalStorage();
    applyFilter();
};

const toggleAllTodos = () => {
    const shouldComplete = todos.some(todo => !todo.check);

    todos = todos.map(todo => {
        return {
            ...todo,
            check: shouldComplete
        };
    });

    saveToLocalStorage();
    applyFilter();
    updateCounter();
    updateToggleAllView();
}

const filterButtons = document.querySelectorAll('.js-all, .js-active, .js-completed');

function setActiveButton(activeButton) {
    filterButtons.forEach(button => {
        button.classList.remove('checked');
    });

    activeButton.classList.add('checked');
}

document.querySelector('.js-all').addEventListener('click', (event) => {
    showAll();
    setActiveButton(event.target);
});

document.querySelector('.js-active').addEventListener('click', (event) => {
    showActive();
    setActiveButton(event.target);
});

document.querySelector('.js-completed').addEventListener('click', (event) => {
    showCompleted();
    setActiveButton(event.target);
});
document.querySelector('.js-toggle-all').addEventListener('click', toggleAllTodos);

const toggleAllInput = document.querySelector('.js-toggle-all');
const toggleAllLabel = document.querySelector('.toggle-arrow');

const updateToggleAllView = () => {
    const allCompleted = todos.length > 0 && todos.every(todo => todo.check);

    toggleAllInput.checked = allCompleted;
    toggleAllLabel.classList.toggle('is-active', allCompleted);
};


const clearBtn = document.querySelector('.js-clear-completed');
if (clearBtn) {
    clearBtn.addEventListener('click', clearCompleted);
}

applyFilter()