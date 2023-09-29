function addTaskAlert() {
    var value = document.getElementById('new-task').value;
    if (value && value.trim() !== '') {
        addTask(value);
        document.getElementById('new-task').value = '';
    }
};

function addTask(text) {
    var list = document.getElementById('task-list');

    var item = document.createElement('li');
    
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', completeTask);

    var taskText = document.createElement('span');
    taskText.innerText = text;
    taskText.addEventListener('dblclick', editTask);

    var date = new Date();
    var dateString = ' (' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + ')';

    var taskDate = document.createElement('span');
    taskDate.innerText = dateString;

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
  inputField.focus();
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
