// ===== CONFIGURATION =====
const API_BASE_URL = 'http://localhost:8080/api/tasks';

// ===== DOM ELEMENTS =====
const elements = {
    // Forms
    taskForm: document.getElementById('task-form'),
    editForm: document.getElementById('edit-form'),
    
    // Form inputs - Add Task
    taskTitle: document.getElementById('task-title'),
    taskDescription: document.getElementById('task-description'),
    taskPriority: document.getElementById('task-priority'),
    taskDueDate: document.getElementById('task-due-date'),
    taskCategory: document.getElementById('task-category'),
    
    // Form inputs - Edit Task
    editTaskId: document.getElementById('edit-task-id'),
    editTitle: document.getElementById('edit-title'),
    editDescription: document.getElementById('edit-description'),
    editPriority: document.getElementById('edit-priority'),
    editDueDate: document.getElementById('edit-due-date'),
    editCategory: document.getElementById('edit-category'),
    
    // Display containers
    tasksContainer: document.getElementById('tasks-container'),
    loading: document.getElementById('loading'),
    emptyState: document.getElementById('empty-state'),
    
    // Statistics
    totalTasks: document.getElementById('total-tasks'),
    completedTasks: document.getElementById('completed-tasks'),
    pendingTasks: document.getElementById('pending-tasks'),
    
    // Search and filters
    searchInput: document.getElementById('search-input'),
    statusFilter: document.getElementById('status-filter'),
    priorityFilter: document.getElementById('priority-filter'),
    clearFilters: document.getElementById('clear-filters'),
    
    // Modal elements
    editModal: document.getElementById('edit-modal'),
    closeEditModal: document.getElementById('close-edit-modal'),
    cancelEdit: document.getElementById('cancel-edit'),
    
    // Toast notifications
    toastContainer: document.getElementById('toast-container')
};

// ===== STATE MANAGEMENT =====
let tasks = [];
let filteredTasks = [];

// ===== UTILITY FUNCTIONS =====

/**
 * Show or hide loading indicator
 * @param {boolean} show - Whether to show loading indicator
 */
function showLoading(show = true) {
    if (elements.loading) {
        elements.loading.classList.toggle('hidden', !show);
    }
}

/**
 * Show or hide empty state message
 * @param {boolean} show - Whether to show empty state
 */
function showEmptyState(show = true) {
    if (elements.emptyState) {
        elements.emptyState.classList.toggle('hidden', !show);
    }
}

/**
 * Display toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info)
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${iconClass[type]} toast-icon"></i>
            <span>${message}</span>
        </div>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 4000);
}

/**
 * Format date string to readable format
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Check if a date is overdue
 * @param {string} dueDate - Due date to check
 * @returns {boolean} Whether the date is overdue
 */
function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
}

/**
 * Update statistics display
 */
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    // Animate counter updates
    animateCounter(elements.totalTasks, total);
    animateCounter(elements.completedTasks, completed);
    animateCounter(elements.pendingTasks, pending);
}

/**
 * Animate counter with smooth transition
 * @param {HTMLElement} element - Element to animate
 * @param {number} target - Target number
 */
function animateCounter(element, target) {
    const current = parseInt(element.textContent) || 0;
    const increment = target > current ? 1 : -1;
    const duration = Math.abs(target - current) * 50;
    
    if (current !== target) {
        const timer = setInterval(() => {
            const currentVal = parseInt(element.textContent);
            if ((increment > 0 && currentVal < target) || (increment < 0 && currentVal > target)) {
                element.textContent = currentVal + increment;
            } else {
                element.textContent = target;
                clearInterval(timer);
            }
        }, duration / Math.abs(target - current));
    }
}

// ===== API FUNCTIONS =====

/**
 * Fetch all tasks from the backend
 */
async function fetchTasks() {
    try {
        showLoading(true);
        
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Ensure all tasks have required properties with defaults
        tasks = data.map(task => ({
            id: task.id,
            title: task.title || 'Untitled Task',
            description: task.description || '',
            completed: task.completed || false,
            priority: task.priority || 'medium',
            dueDate: task.dueDate || null,
            category: task.category || '',
            createdAt: task.createdAt || new Date().toISOString()
        }));
        
        applyFilters();
        updateStats();
        showLoading(false);
        
        if (tasks.length === 0) {
            showEmptyState(true);
        }
        
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showToast('Failed to load tasks. Please ensure your backend is running.', 'error');
        showLoading(false);
        showEmptyState(true);
    }
}

/**
 * Create a new task
 * @param {Object} taskData - Task data to create
 */
async function createTask(taskData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
        }
        
        const newTask = await response.json();
        showToast('Task created successfully!', 'success');
        await fetchTasks(); // Refresh the task list
        
        return newTask;
        
    } catch (error) {
        console.error('Error creating task:', error);
        showToast('Failed to create task. Please try again.', 'error');
        throw error;
    }
}

/**
 * Update an existing task
 * @param {number} id - Task ID to update
 * @param {Object} taskData - Updated task data
 */
async function updateTask(id, taskData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
        }
        
        const updatedTask = await response.json();
        showToast('Task updated successfully!', 'success');
        await fetchTasks(); // Refresh the task list
        
        return updatedTask;
        
    } catch (error) {
        console.error('Error updating task:', error);
        showToast('Failed to update task. Please try again.', 'error');
        throw error;
    }
}

/**
 * Delete a task
 * @param {number} id - Task ID to delete
 */
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
        }
        
        showToast('Task deleted successfully!', 'success');
        await fetchTasks(); // Refresh the task list
        
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Failed to delete task. Please try again.', 'error');
        throw error;
    }
}

// ===== UI RENDERING FUNCTIONS =====

/**
 * Render a single task item
 * @param {Object} task - Task object to render
 * @returns {string} HTML string for the task
 */
function renderTask(task) {
    const dueDate = task.dueDate ? formatDate(task.dueDate) : null;
    const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && !task.completed;
    
    return `
        <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-header">
                <div class="task-info">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    <div class="task-meta">
                        <span class="task-priority ${task.priority}">
                            ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </span>
                        ${task.category ? `<span class="task-category">${escapeHtml(task.category)}</span>` : ''}
                        ${dueDate ? `<span class="task-due-date ${isTaskOverdue ? 'overdue' : ''}">
                            ${isTaskOverdue ? '<i class="fas fa-exclamation-triangle"></i> ' : ''}${dueDate}
                        </span>` : ''}
                    </div>
                    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                </div>
                <div class="task-actions">
                    <input type="checkbox" 
                           class="task-checkbox" 
                           ${task.completed ? 'checked' : ''} 
                           onchange="toggleTaskCompletion(${task.id}, this.checked)"
                           title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                    <button class="btn-edit" 
                            onclick="openEditModal(${task.id})"
                            title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-danger" 
                            onclick="confirmDeleteTask(${task.id})"
                            title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render all filtered tasks
 */
function renderTasks() {
    if (filteredTasks.length === 0) {
        showEmptyState(true);
        elements.tasksContainer.innerHTML = '';
        return;
    }
    
    showEmptyState(false);
    
    // Sort tasks: incomplete tasks first, then by priority, then by due date
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        // Completed tasks go to bottom
        if (a.completed !== b.completed) {
            return a.completed - b.completed;
        }
        
        // Priority order: high, medium, low
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Due date order: overdue first, then by date
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        
        return 0;
    });
    
    elements.tasksContainer.innerHTML = sortedTasks.map(renderTask).join('');
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== FILTERING AND SEARCHING =====

/**
 * Apply current filters to tasks
 */
function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const statusFilter = elements.statusFilter.value;
    const priorityFilter = elements.priorityFilter.value;
    
    filteredTasks = tasks.filter(task => {
        // Search filter - check title, description, and category
        const matchesSearch = !searchTerm || 
            task.title.toLowerCase().includes(searchTerm) ||
            (task.description && task.description.toLowerCase().includes(searchTerm)) ||
            (task.category && task.category.toLowerCase().includes(searchTerm));
        
        // Status filter
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'completed' && task.completed) ||
            (statusFilter === 'pending' && !task.completed);
        
        // Priority filter
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesPriority;
    });
    
    renderTasks();
    
    // Update empty state message based on filters
    if (filteredTasks.length === 0 && tasks.length > 0) {
        elements.emptyState.querySelector('h3').textContent = 'No tasks match your filters';
        elements.emptyState.querySelector('p').textContent = 'Try adjusting your search or filter criteria.';
    } else if (tasks.length === 0) {
        elements.emptyState.querySelector('h3').textContent = 'No tasks found';
        elements.emptyState.querySelector('p').textContent = 'Add your first task above to get started organizing your work!';
    }
}

/**
 * Clear all filters
 */
function clearFilters() {
    elements.searchInput.value = '';
    elements.statusFilter.value = 'all';
    elements.priorityFilter.value = 'all';
    applyFilters();
    showToast('Filters cleared', 'info');
}

// ===== TASK OPERATIONS =====

/**
 * Toggle task completion status
 * @param {number} taskId - ID of task to toggle
 * @param {boolean} completed - New completion status
 */
async function toggleTaskCompletion(taskId, completed) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        showToast('Task not found', 'error');
        return;
    }
    
    try {
        // Optimistically update UI
        task.completed = completed;
        renderTasks();
        updateStats();
        
        // Update backend
        await updateTask(taskId, { ...task, completed });
        
    } catch (error) {
        // Revert on error
        task.completed = !completed;
        renderTasks();
        updateStats();
    }
}

/**
 * Confirm and delete a task
 * @param {number} taskId - ID of task to delete
 */
function confirmDeleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        showToast('Task not found', 'error');
        return;
    }
    
    const confirmMessage = `Are you sure you want to delete "${task.title}"?\n\nThis action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        deleteTask(taskId);
    }
}

// ===== MODAL FUNCTIONS =====

/**
 * Open edit modal for a specific task
 * @param {number} taskId - ID of task to edit
 */
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        showToast('Task not found', 'error');
        return;
    }
    
    // Populate form fields
    elements.editTaskId.value = task.id;
    elements.editTitle.value = task.title;
    elements.editDescription.value = task.description || '';
    elements.editPriority.value = task.priority || 'medium';
    elements.editDueDate.value = task.dueDate || '';
    elements.editCategory.value = task.category || '';
    
    // Show modal
    elements.editModal.classList.remove('hidden');
    
    // Focus on title field
    setTimeout(() => {
        elements.editTitle.focus();
        elements.editTitle.select();
    }, 100);
}

/**
 * Close edit modal
 */
function closeEditModal() {
    elements.editModal.classList.add('hidden');
    elements.editForm.reset();
}

// ===== EVENT LISTENERS =====

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Task creation form
    elements.taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const taskData = {
            title: elements.taskTitle.value.trim(),
            description: elements.taskDescription.value.trim(),
            priority: elements.taskPriority.value,
            dueDate: elements.taskDueDate.value || null,
            category: elements.taskCategory.value.trim(),
            completed: false
        };
        
        if (!taskData.title) {
            showToast('Please enter a task title', 'error');
            elements.taskTitle.focus();
            return;
        }
        
        try {
            await createTask(taskData);
            elements.taskForm.reset();
            elements.taskPriority.value = 'medium'; // Reset to default
            elements.taskTitle.focus(); // Ready for next task
        } catch (error) {
            // Error already handled in createTask function
        }
    });
    
    // Edit task form
    elements.editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const taskId = parseInt(elements.editTaskId.value);
        const originalTask = tasks.find(t => t.id === taskId);
        
        if (!originalTask) {
            showToast('Task not found', 'error');
            closeEditModal();
            return;
        }
        
        const taskData = {
            ...originalTask, // Keep all existing properties
            title: elements.editTitle.value.trim(),
            description: elements.editDescription.value.trim(),
            priority: elements.editPriority.value,
            dueDate: elements.editDueDate.value || null,
            category: elements.editCategory.value.trim()
        };
        
        if (!taskData.title) {
            showToast('Please enter a task title', 'error');
            elements.editTitle.focus();
            return;
        }
        
        try {
            await updateTask(taskId, taskData);
            closeEditModal();
        } catch (error) {
            // Error already handled in updateTask function
        }
    });
    
    // Search and filter events
    elements.searchInput.addEventListener('input', debounce(applyFilters, 300));
    elements.statusFilter.addEventListener('change', applyFilters);
    elements.priorityFilter.addEventListener('change', applyFilters);
    elements.clearFilters.addEventListener('click', clearFilters);
    
    // Modal events
    elements.closeEditModal.addEventListener('click', closeEditModal);
    elements.cancelEdit.addEventListener('click', closeEditModal);
    
    // Close modal when clicking outside
    elements.editModal.addEventListener('click', (e) => {
        if (e.target === elements.editModal) {
            closeEditModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Close modal with Escape key
        if (e.key === 'Escape' && !elements.editModal.classList.contains('hidden')) {
            closeEditModal();
        }
        
        // Quick add task with Ctrl+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (document.activeElement === elements.taskTitle || 
                document.activeElement === elements.taskDescription) {
                elements.taskForm.dispatchEvent(new Event('submit'));
            }
        }
    });
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== INITIALIZATION =====

/**
 * Initialize the application
 */
async function initializeApp() {
    try {
        // Check if all required elements exist
        const requiredElements = Object.keys(elements);
        const missingElements = requiredElements.filter(key => !elements[key]);
        
        if (missingElements.length > 0) {
            console.error('Missing required elements:', missingElements);
            showToast('Application initialization failed. Please refresh the page.', 'error');
            return;
        }
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Load tasks from backend
        await fetchTasks();
        
        // Set focus on task title for immediate use
        elements.taskTitle.focus();
        
        console.log('TaskSync application initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showToast('Failed to initialize application. Please refresh the page.', 'error');
    }
}

// ===== GLOBAL FUNCTIONS (for HTML onclick attributes) =====
window.toggleTaskCompletion = toggleTaskCompletion;
window.openEditModal = openEditModal;
window.confirmDeleteTask = confirmDeleteTask;

// ===== START APPLICATION =====
document.addEventListener('DOMContentLoaded', initializeApp);

// Add some additional CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .task-item {
        animation: fadeInUp 0.3s ease;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);