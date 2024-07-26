import { storageSource } from './storage.js';
import { elements } from './elements.js';
import { AUDIO } from './sounds.js';

const playSoundFromStart = (Audio) => {
  Audio.currentTime = 0;
  Audio.play();
};

const storage = new Proxy(storageSource, {
  get(target, prop) {
    if (typeof target[prop] === 'function') {
      setTimeout(renderTable, 10); //FIXME: ну это пиздец же
    }
    return target[prop];
  },
});

const onLoadedPage = () => {
  elements.clearTableButton.addEventListener('click', clearTaskList);
  elements.form.addEventListener('submit', handleCreateNewTask);
  elements.form.addEventListener('reset', () =>
    playSoundFromStart(AUDIO.click)
  );
  storage.load();
};

const onClosingPage = () => {
  storage.save();
};

const handleCreateNewTask = (event) => {
  event.preventDefault();
  const task = elements.taskNameInput.value;
  if (task) {
    storage.addTask(task);
  }
  event.target.reset();
};

const clearTaskList = () => {
  if (storage.tasks.length > 0) {
    storage.clearTasks();
    playSoundFromStart(AUDIO.reset);
  }
};

const removeTask = (id) => {
  storage.removeTask(id);
  playSoundFromStart(AUDIO.pop);
};

const setTaskState = (id, success) => {
  storage.setTaskState(id, success);
  if (success) {
    playSoundFromStart(AUDIO.success);
  }
};

const addTaskPriority = (id, value = 1) => {
  const state = storage.tasks[id].priority + value;
  storage.setTaskPriority(
    id,
    state > 0
      ? state < storage.tasks.length
        ? state
        : storage.tasks.length - 1
      : 0
  );
  playSoundFromStart(AUDIO.click);
};

const renderTable = async () => {
  elements.tableBody.innerHTML = '';
  storage.tasks
    .map((task, id) => {
      const taskRow = createTableRow();
      if (task.completed) {
        taskRow.className = 'completed';
      }
      taskRow.appendChild(
        createCheckboxCell(task.completed, (ev) =>
          setTaskState(id, ev.target.checked)
        )
      );
      taskRow.appendChild(
        createButtonCell(
          '↑',
          () => addTaskPriority(id, -1),
          'btn-outline-success btn-sm'
        )
      );
      taskRow.appendChild(
        createButtonCell(
          '↓',
          () => addTaskPriority(id, 1),
          'btn-outline-danger btn-sm'
        )
      );
      taskRow.appendChild(createTextCell(task.name));
      taskRow.appendChild(createButtonCell('X', () => removeTask(id)));
      return taskRow;
    })
    .forEach(elements.tableBody.appendChild.bind(elements.tableBody));
};

const createTableRow = () => document.createElement('tr');

const createTextCell = (text) => {
  const cell = document.createElement('td');
  cell.textContent = text;
  cell.className = 'align-middle';
  return cell;
};

const createCheckboxCell = (value, handler) => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = value;
  checkbox.className = 'form-check-input align-middle';
  checkbox.addEventListener('input', handler);
  const cell = document.createElement('td');
  cell.appendChild(checkbox);
  return cell;
};

const createButtonCell = (
  label,
  handler,
  styleClass = 'btn-outline-danger'
) => {
  const button = document.createElement('button');
  button.textContent = label;
  button.className = 'btn ' + styleClass;
  button.addEventListener('click', handler);
  const cell = document.createElement('td');
  cell.appendChild(button);
  return cell;
};

window.addEventListener('DOMContentLoaded', onLoadedPage);
window.addEventListener('beforeunload', onClosingPage);
