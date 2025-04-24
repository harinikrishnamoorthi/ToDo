document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const completedCountEl = document.getElementById('completed-count');
    const totalCountEl = document.getElementById('total-count');
    const progressFill = document.getElementById('progress-fill');
    
    let tasks = [];
    const badges = ['badge-blue', 'badge-green', 'badge-purple', 'badge-pink'];
    
    // Load tasks from localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    }
    
    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Update progress
    function updateProgress() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        
        totalCountEl.textContent = total;
        completedCountEl.textContent = completed;
        
        const percentage = total === 0 ? 0 : (completed / total) * 100;
        progressFill.style.width = `${percentage}%`;
    }
    
    // Create a new task
    function createTask(text) {
        if (text.trim() === '') {
            taskInput.classList.add('shake');
            setTimeout(() => {
                taskInput.classList.remove('shake');
            }, 400);
            return;
        }
        
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            badge: badges[Math.floor(Math.random() * badges.length)]
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);
        updateProgress();
        
        taskInput.value = '';
    }
    
    // Render a single task
    function renderTask(task) {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item`;
        taskItem.dataset.id = task.id;
        
        const taskCheckbox = document.createElement('div');
        taskCheckbox.className = `task-checkbox ${task.completed ? 'completed' : ''}`;
        taskCheckbox.innerHTML = task.completed ? '✓' : '';
        
        const taskText = document.createElement('div');
        taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
        taskText.textContent = task.text;
        
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        const editButton = document.createElement('button');
        editButton.className = 'action-button edit-button';
        editButton.innerHTML = '✎';
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-button delete-button';
        deleteButton.innerHTML = '✕';
        
        const taskTag = document.createElement('div');
        taskTag.className = `task-tag ${task.badge}`;
        
        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);
        
        taskItem.appendChild(taskTag);
        taskItem.appendChild(taskCheckbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(taskActions);
        
        taskList.appendChild(taskItem);
        
        // Event listeners
        taskCheckbox.addEventListener('click', () => toggleComplete(task.id));
        
        editButton.addEventListener('click', () => {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                editTask(task.id, newText);
            }
        });
        
        deleteButton.addEventListener('click', () => {
            taskItem.classList.add('deleting');
            setTimeout(() => {
                deleteTask(task.id);
            }, 300);
        });
    }
    
    // Render all tasks
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            renderTask(task);
        });
        updateProgress();
    }
    
    // Toggle task completion
    function toggleComplete(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
        }
    }
    
    // Edit task
    function editTask(id, newText) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = newText;
            saveTasks();
            renderTasks();
        }
    }
    
    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
    // Event listeners
    addTaskBtn.addEventListener('click', () => {
        createTask(taskInput.value);
    });
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createTask(taskInput.value);
        }
    });
    
    // Initialize
    loadTasks();
});