
// Global toggle for profile dropdown
window.toggleProfileMenu = function(event) {
    const dropdown = document.getElementById('profile-dropdown');
    if(dropdown) {
        dropdown.classList.toggle('opacity-0');
        dropdown.classList.toggle('invisible');
        dropdown.classList.toggle('scale-95');
        dropdown.classList.toggle('scale-100');
    }
    if(event) event.stopPropagation();
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Personal OS Dashboard initialized.');
    
    // Global Keyboard Shortcuts — handled by command_palette.js if loaded
    // These are fallbacks in case command_palette.js is not available
    document.addEventListener('keydown', (e) => {
        // Ctrl + K for Command Palette
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (typeof openCommandPalette === 'function') {
                openCommandPalette();
            }
        }
        
        // Ctrl + N for Quick Add
        if (e.ctrlKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            if (typeof openQuickAdd === 'function') {
                openQuickAdd('task');
            }
        }
    });

    // Quick Add FAB Click handler
    const quickAddBtn = document.getElementById('quick-add-btn');
    if (quickAddBtn) {
        quickAddBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof openQuickAdd === 'function') {
                openQuickAdd('task');
            }
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

// =============================================
// Review Notifications (Daily & Weekly)
// =============================================
function checkReviews() {
    if ("Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }

    const now = new Date();
    const todayStr = now.toLocaleDateString('id-ID');
    
    // Daily Review at 21:00 or later
    if (now.getHours() >= 21) {
        const lastDaily = localStorage.getItem('last_daily_review');
        if (lastDaily !== todayStr) {
            triggerNotification('Daily Review 🌙', 'Saatnya mereview hari Anda. Mari catat pengeluaran dan evaluasi tugas hari ini.');
            localStorage.setItem('last_daily_review', todayStr);
        }
    }
    
    // Weekly Review on Sunday (0)
    if (now.getDay() === 0) {
        const lastWeekly = localStorage.getItem('last_weekly_review');
        if (lastWeekly !== todayStr) {
            triggerNotification('Weekly Review 📈', 'Saatnya merencanakan minggu depan dan mengevaluasi pencapaian minggu ini.');
            localStorage.setItem('last_weekly_review', todayStr);
        }
    }
}

function triggerNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
            body: body,
            icon: 'icon-192.png'
        });
    } else {
        // Fallback to in-app toast
        if (window.showToast) {
            window.showToast(`${title}: ${body}`, 'brand');
        } else {
            console.log(`Notification Fallback: ${title} - ${body}`);
            alert(`${title}\n${body}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkReviews();
    setInterval(checkReviews, 60000); // Check every minute
    
    // Load and apply profile globally
    loadProfileGlobally();
});

// =============================================
// Profile Management (Global)
// =============================================
function loadProfileGlobally() {
    const defaultProfile = {
        firstName: 'Felix',
        lastName: 'Doe',
        email: 'felix@example.com',
        job: 'UI/UX Designer',
        bio: 'Saya adalah seorang desainer antarmuka yang antusias dengan minimalisme dan pengalaman pengguna yang mulus.',
        photoUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F8FAFC'
    };

    let profile = localStorage.getItem('user_profile');
    if (profile) {
        try {
            profile = JSON.parse(profile);
        } catch(e) {
            profile = defaultProfile;
        }
    } else {
        profile = defaultProfile;
    }

    // Update Header Dropdown
    const profileDropdowns = document.querySelectorAll('#profile-dropdown');
    profileDropdowns.forEach(dropdown => {
        const nameEl = dropdown.querySelector('p.font-bold');
        if (nameEl) nameEl.innerText = (profile.firstName || '') + ' ' + (profile.lastName || '');
        
        const ps = dropdown.querySelectorAll('p');
        if (ps.length > 1) {
            ps[1].innerText = profile.email || '';
        }
    });
    
    // Update all avatars
    if (profile.photoUrl) {
        const avatars = document.querySelectorAll('img[alt="Avatar"], img[alt="Profile"]');
        avatars.forEach(img => img.src = profile.photoUrl);
    }
}
