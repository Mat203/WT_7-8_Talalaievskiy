class TodoItem {
    constructor(task, date) {
        this.task = task;
        this.date = date ? new Date(date) : new Date();
    }


    getTaskDate() {
        return ' (' + this.date.toLocaleDateString() + ' ' + this.date.toLocaleTimeString() + ')';
    }
}

class TodoItemPremium extends TodoItem {
    constructor(task, image, date) {
        super(task, date);
        this.image = image;
    }

    getTaskImage() {
        return this.image;
    }
}

function addTaskAlert() {
    var value = document.getElementById('new-task').value;
    var image = document.getElementById('new-image').files[0];
    if (value && value.trim() !== '') {
        addTask(value, image);
        document.getElementById('new-task').value = '';
        document.getElementById('new-image').value = '';
    }
};

function addTask(text, imageFile, date) {
    var list = document.getElementById('task-list');

    var item = document.createElement('li');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', completeTask);

    var taskText = document.createElement('span');

    var todoItem;

    if (imageFile) {
        var reader = new FileReader();
        reader.onloadend = function() {
            var base64Image = reader.result;
            todoItem = new TodoItemPremium(text, base64Image, date);
            taskText.innerText = todoItem.task;

            var img = document.createElement('img');
            img.src = todoItem.getTaskImage();
            img.style.width = '30px';
            img.style.height = '30px';

            item.appendChild(img);

            appendTask();
        }
        reader.readAsDataURL(imageFile);
    } else {
        todoItem = new TodoItem(text, date);
        taskText.innerText = todoItem.task;
        appendTask();
    }

    function appendTask() {
        taskText.addEventListener('dblclick', editTask);

        var taskDate = document.createElement('span');
        taskDate.innerText = todoItem.getTaskDate();

        var buttons = document.createElement('div');

        var remove = document.createElement('button');
        remove.innerText = 'Remove';
        remove.addEventListener('click', removeTask);

        buttons.appendChild(remove);

        item.appendChild(checkbox);
        item.appendChild(taskText);
        item.appendChild(taskDate);
        item.appendChild(buttons);

        item.todoItem = todoItem;

        list.insertBefore(item, list.childNodes[0]);
        saveTasks();
    }
}




function removeTask(e) {
    var item = e.target.parentNode.parentNode;
    var parent = item.parentNode;

    parent.removeChild(item);
    saveTasks();
}

function completeTask(e) {
    var item = e.target.parentNode;

    if (item.style.textDecoration == 'line-through') {
        item.style.textDecoration = 'none';
        item.firstChild.checked = false;
    } else {
        item.style.textDecoration = 'line-through';
        item.firstChild.checked = true;
    }
    saveTasks();
}

function editTask(e) {
    var item = e.target;
    var originalText = item.innerText;

    var inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = originalText;
    inputField.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            saveTask(item, this, originalText);
        } else if (event.key === 'Escape') {
            cancelEdit(item, this, originalText);
        }
    });

    item.innerText = '';
    item.appendChild(inputField);
    saveTasks();
}

function saveTask(item, inputField, originalText) {
    var newText = inputField.value;

    if (newText && newText.trim() !== '') {
        item.innerText = newText;

        var date = new Date();
        var dateString = ' (' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ')';
        item.nextSibling.innerText = dateString;
        var list = document.getElementById('task-list');
        list.insertBefore(item.parentNode, list.childNodes[0]);
    } else {
        cancelEdit(item, inputField, originalText);
    }
}

function cancelEdit(item, inputField, originalText) {
    item.removeChild(inputField);
    item.innerText = originalText;
}

function removeCompletedTasks() {
    var listItems = document.querySelectorAll('#task-list li');

    for (var i = 0; i < listItems.length; i++) {
        if (listItems[i].firstChild.checked) {
            listItems[i].parentNode.removeChild(listItems[i]);
        }
    }
}

function removeAllTasks() {
    var listItems = document.querySelectorAll('#task-list li');
    var uncompletedExists = false;

    for (var i = 0; i < listItems.length; i++) {
        if (!listItems[i].firstChild.checked) {
            uncompletedExists = true;
            break;
        }
    }

    if (uncompletedExists && !confirm("Are you sure you want to delete all tasks?")) {
        return;
    } else {
        for (var i = 0; i < listItems.length; i++) {
            listItems[i].parentNode.removeChild(listItems[i]);
        }
    }
    saveTasks();
}

function sortTasksAsc() {
    var list = document.getElementById('task-list');
    Array.from(list.getElementsByTagName("li"))
        .sort((a, b) => b.todoItem.date - a.todoItem.date)
        .forEach(li => list.appendChild(li));
    document.getElementById('sort-asc').classList.add('active');
    document.getElementById('sort-desc').classList.remove('active');
    saveTasks();
    localStorage.setItem('sortOrder', 'asc');
}

function sortTasksDesc() {
    var list = document.getElementById('task-list');
    Array.from(list.getElementsByTagName("li"))
        .sort((a, b) => a.todoItem.date - b.todoItem.date)
        .forEach(li => list.appendChild(li));

    document.getElementById('sort-desc').classList.add('active');
    document.getElementById('sort-asc').classList.remove('active');
    saveTasks();
    localStorage.setItem('sortOrder', 'desc');
}

function saveTasks() {
    var list = document.getElementById('task-list');
    var tasks = Array.from(list.getElementsByTagName("li")).map(li => li.todoItem);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTask(task.task, task.image, task.date));
    var sortOrder = localStorage.getItem('sortOrder');
    if (sortOrder === 'asc') {
        sortTasksAsc();
    } else if (sortOrder === 'desc') {
        sortTasksDesc();
    }
}

function clearStorage() {
    localStorage.clear();
    location.reload();
}

function pickTodo() {
    var list = document.getElementById('task-list');
    var tasks = Array.from(list.getElementsByTagName("li"));
    if (tasks.length > 0) {
        tasks.forEach(task => task.classList.remove('active'));

        var randomIndex = Math.floor(Math.random() * tasks.length);
        var randomTask = tasks[randomIndex];

        randomTask.classList.add('active');
    }
}
