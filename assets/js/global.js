// Global Anti-Cheat & Security
document.addEventListener('DOMContentLoaded', function() {
    // Anti-right-click, devtools, etc.
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || 
            (e.ctrlKey && e.key === 'u') || (e.ctrlKey && e.key === 'a')) {
            e.preventDefault();
            return false;
        }
    }, false);
});

// Utility Functions
window.showErrorPopup = function() {
    if (window.errorPopup) {
        document.querySelector('.preloader')?.classList.remove('active');
        window.errorPopup.classList.add('active');
    }
};
