export const elements = {
  get table() {
    return document.querySelector('table');
  },
  get tableBody() {
    return this.table.children[1];
  },
  get form() {
    return document.querySelector('form');
  },
  get clearTableButton() {
    return document.querySelector('.clear-table-btn');
  },
  get taskNameInput() {
    return document.querySelector('input[name=taskName]');
  },
};
