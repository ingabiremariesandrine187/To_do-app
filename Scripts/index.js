// scripts/index.js

const STORAGE_KEY = 'tasks';

// Grab HTML elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const categoryInput = document.getElementById('categoryInput');
const tasksList = document.getElementById('tasksList');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const clearAllBtn = document.getElementById('clearAll');
const darkToggle = document.getElementById('darkToggle');
const emptyState = document.getElementById('emptyState');

// Load tasks from localStorage
let tasks = loadTasks();

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  tasksList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    const searchMatch = task.title.toLowerCase().includes(searchInput.value.toLowerCase());
    const filterValue = filterSelect.value;

    if (filterValue === 'all') return searchMatch;
    if (filterValue === 'active') return !task.completed && searchMatch;
    if (filterValue === 'completed') return task.completed && searchMatch;
    if (filterValue === 'high') return task.priority === 'high' && searchMatch;
    if (filterValue === 'medium') return task.priority === 'medium' && searchMatch;
    if (filterValue === 'low') return task.priority === 'low' && searchMatch;
    return searchMatch;
  });

  emptyState.style.display = filteredTasks.length === 0 ? 'block' : 'none';

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `
      flex justify-between items-center p-3 rounded shadow mb-2
      ${task.completed ? 'bg-gray-200 dark:bg-gray-700 line-through text-gray-500 dark:text-gray-300' 
                       : 'bg-white dark:bg-gray-800 text-black dark:text-white'}
      ${task.priority === 'high' ? 'border-l-4 border-red-500' :
        task.priority === 'medium' ? 'border-l-4 border-yellow-400' :
        'border-l-4 border-green-400'}
    `;

    // Inner HTML with tooltip
    li.innerHTML = `
      <span>${task.title} ${task.category ? `[${task.category}]` : ''}</span>
      <div class="flex items-center gap-2">
        <input type="checkbox" ${task.completed ? 'checked' : ''} 
               title="Mark as completed" class="w-5 h-5 cursor-pointer"/>
        <button class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300" title="Delete task">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M6 18L18 6M6 6l12 12"/>
  </svg>
</button>
      </div>
    `;

    // Toggle complete
    li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
      toggleComplete(task.id);
    });

    // Delete task
    li.querySelector('button').addEventListener('click', () => {
      deleteTask(task.id);
    });

    tasksList.appendChild(li);
  });
}

// Add a new task
function addTask(title, priority = 'medium', category = '') {
  tasks.unshift({
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    priority,
    category: category.trim(),
    createdAt: new Date().toISOString(),
  });
  saveTasks();
  renderTasks();
}

// Toggle task completion
function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

// Clear all tasks
function clearAll() {
  if (confirm('Clear ALL tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Event: Form submit
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!taskInput.value.trim()) return;
  addTask(taskInput.value, prioritySelect.value, categoryInput.value);
  taskForm.reset();
});

// Event: Search & filter
searchInput.addEventListener('input', renderTasks);
filterSelect.addEventListener('change', renderTasks);


clearAllBtn.addEventListener('click', clearAll);

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
  darkToggle.checked = true;
}

darkToggle.addEventListener('change', () => {
  if (darkToggle.checked) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});


renderTasks();
