document.addEventListener('DOMContentLoaded', () => {
    console.log('Personal OS Dashboard initialized.');
    
    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl + K for Search
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder*="Search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl + N for Quick Add
        if (e.ctrlKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            triggerQuickAdd();
        }
    });

    // Quick Add FAB Click handler
    const quickAddBtn = document.getElementById('quick-add-btn');
    if (quickAddBtn) {
        quickAddBtn.addEventListener('click', (e) => {
            e.preventDefault();
            triggerQuickAdd();
        });
    }

    // Example logic for task checkbox interaction
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            const textElement = e.target.closest('li').querySelector('p');
            if (e.target.checked) {
                textElement.classList.add('line-through', 'text-gray-400');
                textElement.classList.remove('text-primary');
            } else {
                textElement.classList.remove('line-through', 'text-gray-400');
                textElement.classList.add('text-primary');
            }
        });
    });
});

function triggerQuickAdd() {
    console.log('Quick Add triggered');
    
    const icon = document.querySelector('#quick-add-btn svg');
    if (icon) {
        // Visual feedback
        icon.classList.add('rotate-45');
        setTimeout(() => {
            icon.classList.remove('rotate-45');
        }, 300);
    }
    
    // Redirect to tasks page for quick adding
    setTimeout(() => { window.location.href = 'tasks.html'; }, 300);
}
