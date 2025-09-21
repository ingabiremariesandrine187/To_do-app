(
function(){
    'use strict';
      const STORAGE_KEY = 'todo.tasks.v1';
  const THEME_KEY = 'todo.theme.v1';
  const taskForm= document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
     const categoryInput = document.getElementById('categoryInput');
      const tasksList = document.getElementById('tasksList');
       const emptyState = document.getElementById('emptyState');
        const searchInput = document.getElementById('searchInput');
          const filterSelect = document.getElementById('filterSelect');
          const clearAllBtn = document.getElementById('clearAll');
           const darkToggle = document.getElementById('darkToggle');
let tasks= loadTasks();
 let filters = { search: '', filter: 'all' };
   applySavedTheme();
  renderTasks();
  attachListeners();





}


)