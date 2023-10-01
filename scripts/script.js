class TodoItem {
    constructor(task) {
        this.task = task;
        this.date = new Date();
    }


    getTaskDate() {
        return ' (' + this.date.toLocaleDateString() + ' ' + this.date.toLocaleTimeString() + ')';
    }
}

class TodoItemPremium extends TodoItem {
    constructor(task, image) {
        super(task);
        this.image = image;
    }

    getTaskImage() {
        return this.image;
    }
}

function addTaskAlert() {
    var value = document.getElementById('new-task').value;
    var image = document.getElementById('new-image').value;
    if (value && value.trim() !== '') {
        addTask(value, image);
        document.getElementById('new-task').value = '';
        document.getElementById('new-image').value = '';
    }
};

function addTask(text, image) {
    var list = document.getElementById('task-list');

    var item = document.createElement('li');
    
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', completeTask);

    var taskText = document.createElement('span');
    
    var todoItem;
    
    if (image) { 
        todoItem = new TodoItemPremium(text, image);
        taskText.innerText = todoItem.task;

        var img = document.createElement('img');
        img.src = todoItem.getTaskImage();
        img.style.width = '30px';
        img.style.height = '30px';
        
        item.appendChild(img);
    } else { 
        todoItem = new TodoItem(text);
        taskText.innerText = todoItem.task;
    }
    
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

    list.insertBefore(item, list.childNodes[0]);
}



function removeTask(e) {
    var item = e.target.parentNode.parentNode;
    var parent = item.parentNode;
    
    parent.removeChild(item);
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
}

function editTask(e) {
  var item = e.target;
  var originalText = item.innerText;

  var inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.value = originalText;
  inputField.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
          saveTask(item, this, originalText);
      } else if (event.key === 'Escape') {
          cancelEdit(item, this, originalText);
      }
  });

  item.innerText = '';
  item.appendChild(inputField);
}

function saveTask(item, inputField, originalText) {
  var newText = inputField.value;

  if (newText && newText.trim() !== '') {
      item.innerText = newText;

      var date = new Date();
      var dateString = ' (' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ')';
      item.nextSibling.innerText = dateString;
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

  for (var i=0; i<listItems.length; i++) {
      if (listItems[i].firstChild.checked) {
          listItems[i].parentNode.removeChild(listItems[i]);
      }
  }
}

function removeAllTasks() {
    var listItems = document.querySelectorAll('#task-list li');
    var uncompletedExists = false;
  
    for (var i=0; i<listItems.length; i++) {
        if (!listItems[i].firstChild.checked) {
            uncompletedExists = true;
            break;
        }
    }
  
    if (uncompletedExists && !confirm("Are you sure you want to delete all tasks?")) {
        return;
    } else {
        for (var i=0; i<listItems.length; i++) {
        listItems[i].parentNode.removeChild(listItems[i]);
        }
    }
  }
  
