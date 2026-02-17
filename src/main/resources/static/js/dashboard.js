document.addEventListener('DOMContentLoaded', () => {
    // === Initialization ===
    const token = getToken();
    const username = getUsername();

    if (!token) {
        window.location.href = '/login';
        return;
    }

    document.getElementById('username').textContent = username;

    // === State ===
    let todos = [];
    let categories = [];
    let currentView = 'list';

    // === Modals ===
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));

    // === Event Listeners ===

    // View Toggles
    const viewListRadio = document.getElementById('viewList');
    const viewCategoryRadio = document.getElementById('viewCategory');

    if (viewListRadio) {
        viewListRadio.addEventListener('change', () => toggleView('list'));
    }

    if (viewCategoryRadio) {
        viewCategoryRadio.addEventListener('change', () => toggleView('category'));
    }

    // Add Todo Form
    const addTodoForm = document.getElementById('addTodoForm');
    if (addTodoForm) {
        addTodoForm.addEventListener('submit', handleAddTodo);
    }

    // Edit Todo Form
    const editTodoForm = document.getElementById('editTodoForm');
    if (editTodoForm) {
        editTodoForm.addEventListener('submit', handleUpdateTodo);
    }

    // Add Category Form
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', handleAddCategory);
    }

    // Category Button
    const categoryBtn = document.getElementById('categoryBtn');
    if (categoryBtn) {
        categoryBtn.addEventListener('click', openCategoryModal);
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Initial Load
    loadTodos();


    // === Functions ===

    async function loadTodos() {
        try {
            const fetchedTodos = await api.getTodos();
            if (Array.isArray(fetchedTodos)) {
                todos = fetchedTodos;
                renderTodos();
            } else {
                console.error("Expected array of todos but got:", fetchedTodos);
            }
            loadCategories(); // Load categories after todos or concurrent
        } catch (error) {
            console.error(error);
            showToast('error', 'Failed to load tasks');
        }
    }

    async function loadCategories() {
        try {
            const fetchedCategories = await api.getCategories();
            if (Array.isArray(fetchedCategories)) {
                categories = fetchedCategories;
                populateCategorySelects();
                renderCategoriesInModal();
            }
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    }

    function toggleView(mode) {
        currentView = mode;
        renderTodos();
    }

    function renderTodos() {
        const todoList = document.getElementById('todoList');
        if (!todoList) return;

        if (todos.length === 0) {
            renderEmptyState(todoList);
            return;
        }

        if (currentView === 'list') {
            renderListView(todoList);
        } else {
            renderCategoryView(todoList);
        }
    }

    function renderEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <h4>No tasks yet</h4>
                <p>Add your first task to get started!</p>
            </div>
        `;
    }

    function renderListView(container) {
        container.innerHTML = todos.map(todo => createTodoItemHtml(todo)).join('');
    }

    function renderCategoryView(container) {
        // Group todos by category ID
        const grouped = {};
        const uncategorized = [];

        todos.forEach(todo => {
            if (todo.category) {
                const catId = todo.category.id;
                if (!grouped[catId]) {
                    grouped[catId] = {
                        category: todo.category,
                        todos: []
                    };
                }
                grouped[catId].todos.push(todo);
            } else {
                uncategorized.push(todo);
            }
        });

        let html = '';

        if (uncategorized.length > 0) {
            html += createCategoryGroupHtml('Uncategorized', '#6c757d', uncategorized);
        }

        Object.values(grouped).forEach(group => {
            html += createCategoryGroupHtml(group.category.name, group.category.color, group.todos);
        });

        container.innerHTML = html;
    }

    function createCategoryGroupHtml(name, color, groupTodos) {
        const safeName = escapeHtml(name);
        const groupId = 'group-' + Math.random().toString(36).substr(2, 9);
        const todosHtml = groupTodos.map(todo => createTodoItemHtml(todo)).join('');

        return `
            <div class="category-group">
                <div class="category-header" data-bs-toggle="collapse" data-bs-target="#${groupId}" aria-expanded="true">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-chevron-down me-2"></i>
                        <span class="badge me-2" style="background-color: ${color}">&nbsp;</span>
                        <strong>${safeName}</strong>
                        <span class="badge bg-secondary ms-2 rounded-pill">${groupTodos.length}</span>
                    </div>
                </div>
                <div class="collapse show" id="${groupId}">
                    <div class="ps-3 border-start">
                        ${todosHtml}
                    </div>
                </div>
            </div>
        `;
    }

    function createTodoItemHtml(todo) {
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-title">
                    ${escapeHtml(todo.title)}
                    ${currentView === 'list' && todo.category ?
                `<span class="badge" style="background-color: ${todo.category.color}">${escapeHtml(todo.category.name)}</span>`
                : ''}
                </div>
                ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ''}
                ${todo.deadline ? `<div class="todo-deadline"><i class="bi bi-calendar-event"></i> ${formatDate(todo.deadline)}</div>` : ''}
                <div class="todo-actions">
                    <button class="btn btn-complete btn-sm" onclick="handleToggleComplete(${todo.id})">
                        <i class="bi bi-${todo.completed ? 'arrow-counterclockwise' : 'check2'}"></i>
                        ${todo.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="btn btn-edit btn-sm" onclick="handleOpenEditModal(${todo.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-delete btn-sm" onclick="handleDeleteTodo(${todo.id})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    // === Handlers ===

    async function handleAddTodo(e) {
        e.preventDefault();
        const title = document.getElementById('todoTitle').value;
        const description = document.getElementById('todoDescription').value;
        const deadline = document.getElementById('todoDeadline').value;
        const categoryId = document.getElementById('todoCategory').value;

        try {
            const newTodo = await api.createTodo({
                title,
                description: description || null,
                deadline: deadline || null,
                categoryId: categoryId || null
            });

            if (newTodo && newTodo.id) { // Check if valid response
                showToast('success', 'Task added successfully');
                addTodoForm.reset();
                loadTodos(); // Reload list
            } else {
                showToast('error', 'Failed to add task');
            }
        } catch (error) {
            showToast('error', 'An error occurred');
        }
    }

    async function handleUpdateTodo(e) {
        e.preventDefault();
        const id = document.getElementById('editTodoId').value;
        const title = document.getElementById('editTodoTitle').value;
        const description = document.getElementById('editTodoDescription').value;
        const deadline = document.getElementById('editTodoDeadline').value;
        const categoryId = document.getElementById('editTodoCategory').value;

        try {
            const updatedTodo = await api.updateTodo(id, {
                title,
                description: description || null,
                deadline: deadline || null,
                categoryId: categoryId || null
            });

            if (updatedTodo && updatedTodo.id) {
                showToast('success', 'Task updated successfully');
                editModal.hide();
                loadTodos();
            } else {
                showToast('error', 'Failed to update task');
            }
        } catch (error) {
            showToast('error', 'An error occurred');
        }
    }

    async function handleToggleComplete(id) {
        try {
            const success = await api.toggleTodo(id);
            if (success) {
                showToast('success', 'Task status updated');
                loadTodos();
            } else {
                showToast('error', 'Failed to update task');
            }
        } catch (error) {
            showToast('error', 'An error occurred');
        }
    }

    async function handleDeleteTodo(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            const success = await api.deleteTodo(id);
            if (success) {
                showToast('success', 'Task deleted successfully');
                loadTodos();
            } else {
                showToast('error', 'Failed to delete task');
            }
        } catch (error) {
            showToast('error', 'An error occurred');
        }
    }

    async function handleOpenEditModal(id) {
        try {
            const todo = await api.getTodoById(id);
            if (todo) {
                document.getElementById('editTodoId').value = todo.id;
                document.getElementById('editTodoTitle').value = todo.title;
                document.getElementById('editTodoDescription').value = todo.description || '';
                document.getElementById('editTodoDeadline').value = todo.deadline || '';
                document.getElementById('editTodoCategory').value = todo.category ? todo.category.id : '';
                editModal.show();
            }
        } catch (error) {
            showToast('error', 'Failed to load task details');
        }
    }

    // === Category Management Handlers ===

    function openCategoryModal() {
        loadCategoriesInsideModal(); // Defined below or in same scope? Let's keep it here.
        categoryModal.show();
    }

    async function loadCategoriesInsideModal() {
        renderCategoriesInModal(); // Re-render what we have
    }

    function renderCategoriesInModal() {
        const list = document.getElementById('categoryList');
        if (!list) return;

        list.innerHTML = categories.map(cat => `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <span class="badge me-2" style="background-color: ${cat.color}">&nbsp;</span>
                    ${escapeHtml(cat.name)}
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="handleDeleteCategory(${cat.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');
    }

    async function handleAddCategory(e) {
        e.preventDefault();
        const name = document.getElementById('newCategoryName').value;
        const color = document.getElementById('newCategoryColor').value;

        try {
            const newCat = await api.createCategory({ name, color });
            if (newCat && newCat.id) {
                document.getElementById('newCategoryName').value = '';
                await loadCategories(); // Refresh all category data (dropdowns + modal list)
                showToast('success', 'Category added');
            } else {
                showToast('error', 'Failed to add category');
            }
        } catch (error) {
            showToast('error', 'Error adding category');
        }
    }

    async function handleDeleteCategory(id) {
        if (!confirm('Delete this category?')) return;
        try {
            const success = await api.deleteCategory(id);
            if (success) {
                await loadCategories();
                showToast('success', 'Category deleted');
            } else {
                showToast('error', 'Failed to delete category');
            }
        } catch (error) {
            showToast('error', 'Error deleting category');
        }
    }

    function populateCategorySelects() {
        const selects = ['todoCategory', 'editTodoCategory'];
        selects.forEach(id => {
            const select = document.getElementById(id);
            if (!select) return;

            const currentVal = select.value;
            select.innerHTML = '<option value="">Select Category</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            });
            if (currentVal) select.value = currentVal;
        });
    }

    // Expose functions globally needed for inline onclick (if any remain)
    // Ideally we shouldn't use inline onclick="handleToggleComplete(...)" in generated HTML.
    // Instead we should attach event listeners or use delegation.
    // But for simplicity and to match the generated HTML strings above, we must expose them to window.
    window.handleToggleComplete = handleToggleComplete;
    window.handleOpenEditModal = handleOpenEditModal;
    window.handleDeleteTodo = handleDeleteTodo;
    window.handleDeleteCategory = handleDeleteCategory;
    window.toggleView = toggleView; // Used in radio inputs
    window.openCategoryModal = openCategoryModal; // Used in button
    window.logout = logout; // Used in button
});
