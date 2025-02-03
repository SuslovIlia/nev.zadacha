// window.onbeforeunload = function (e) {
//     return false;
// };

const addZadacha = document.querySelector('.add-zadacha');
const form = document.querySelector('.form');
const date = document.querySelector('.date');
const nevZadacha = document.querySelector('.nev-zadacha');
const closeForm = document.querySelector('.close-form');
const checkList = document.querySelector('.check_list');
const otmena = document.querySelector('.dont_close-form');

// Загрузка задач из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

// Функция для отображения/скрытия формы
function addComentariy() {
    addZadacha.classList.toggle('hidden');
    form.classList.toggle('hidden');
}

addZadacha.onclick = () => {
    addComentariy();
};

otmena.onclick = (e) => {
    e.preventDefault();
    form.classList.add('hidden');
    addZadacha.classList.remove('hidden');
};

// Создание новой задачи и сохранение её в localStorage
closeForm.onclick = (event) => {
    event.preventDefault();

    if (date.value.length >= 3 && nevZadacha.value.length >= 5) {
        const task = {
            id: Date.now(), // Уникальный ID задачи
            date: date.value,
            text: nevZadacha.value,
            status: 'pending', // Возможные статусы: 'pending', 'completed', 'failed'
        };

        saveTaskToLocalStorage(task);
        renderTask(task);

        nevZadacha.value = date.value = '';
        addComentariy();
    } else {
        alert('Введите больше данных!');
    }
};

// Рендеринг задачи в список
function renderTask(task) {
    const statusClass = task.status === 'completed'
        ? 'task-completed'
        : task.status === 'failed'
            ? 'task-failed'
            : '';

    checkList.insertAdjacentHTML(
        'afterbegin',
        `
        <div class="check_list-box ${statusClass}" data-id="${task.id}">
            <h3 class="h3-zadacha">${task.date} <button class="delite">🗑️</button></h3>
            <p class="p-zadacha">${task.text}</p>
            ${task.status === 'pending' ? `
                <button class="good">Выполнил &#10004;</button>
                <button class="notGood">Не осилил &#10006;</button>
            ` : ''}
        </div>
        `
    );
}

// Сохранение задачи в localStorage
function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Загрузка задач из localStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(renderTask);
}

// Удаление задачи из localStorage
function deleteTaskFromLocalStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Обновление статуса задачи в localStorage
function updateTaskStatusInLocalStorage(taskId, status) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.status = status;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Обработка событий на checkList
checkList.addEventListener('click', (event) => {
    const box = event.target.closest('.check_list-box');
    if (!box) return;

    const taskId = Number(box.dataset.id);

    if (event.target.classList.contains('delite')) {
        box.remove();
        deleteTaskFromLocalStorage(taskId);
    } else if (event.target.classList.contains('good')) {
        box.classList.add('task-completed');
        box.classList.remove('task-failed');
        box.querySelectorAll('.good, .notGood').forEach((btn) => btn.remove());
        updateTaskStatusInLocalStorage(taskId, 'completed');
    } else if (event.target.classList.contains('notGood')) {
        box.classList.add('task-failed');
        box.classList.remove('task-completed');
        box.querySelectorAll('.good, .notGood').forEach((btn) => btn.remove());
        updateTaskStatusInLocalStorage(taskId, 'failed');
    }
});
















