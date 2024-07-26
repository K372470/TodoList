export const storageSource = {
  TASKS_KEY: 'tasks',
  tasks: [],
  addTask(task) {
    this.tasks.push({
      name: task,
      completed: false,
      priority: this.tasks.length,
    });
  },
  removeTask(index) {
    this.tasks.splice(index, 1);
  },
  setTaskState(id, state) {
    this.tasks[id].completed = state;
  },
  setTaskPriority(id, state) {
    const previousState = this.tasks[id].priority;
    this.tasks[id].priority = state;
    this.tasks[id + state - previousState].priority = previousState;
    this.tasks.sort((task1, task2) => task1.priority - task2.priority);
  },
  clearTasks() {
    this.tasks = [];
  },
  load() {
    this.tasks = JSON.parse(localStorage.getItem(this.TASKS_KEY)) ?? [];
  },
  save() {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(this.tasks));
  },
};
