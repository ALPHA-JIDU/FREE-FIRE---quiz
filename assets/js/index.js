const levelUrls = {
    easy: "page1.html",
    medium: "page1.html", // Keep same quiz for now
    hard: "page1.html",
    hardcore: "page1.html"
};

let currentLevel = 'easy';

document.addEventListener('DOMContentLoaded', function() {
    // Preloader handling
    setTimeout(() => {
        document.querySelector('main').style.opacity = '1';
        document.querySelector('.preloader').style.display = 'none';
    }, 1500);

    // Sticky ad
    setTimeout(() => {
        document.getElementById('stickyAd').style.bottom = '0px';
    }, 3000);

    // Event Listeners
    document.getElementById('startQuizBtn').addEventListener('click', triggerQuiz);
    document.getElementById('closeStickyBtn').addEventListener('click', closeSticky);
    
    // Difficulty selector
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.addEventListener('click', () => selectDifficulty(card));
    });
});

function selectDifficulty(card) {
    document.querySelectorAll('.difficulty-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    currentLevel = card.dataset.level;
    document.getElementById('selectedLevelDisplay').textContent = card.textContent + ' Selected';
}

function triggerQuiz() {
    const token = Math.random().toString(36).substr(2) + '_' + Date.now();
    const expiry = Date.now() + 30000; // 30 seconds
    
    sessionStorage.setItem('elite_quiz_token', token);
    sessionStorage.setItem('token_expiry', expiry);
    sessionStorage.setItem('quiz_level', currentLevel);
    
    const overlay = document.getElementById('redirectLayer');
    overlay.style.display = 'flex';
    
    const messages = ['Connecting...', 'Preparing Secure Session...', 'Loading...'];
    let index = 0;
    const interval = setInterval(() => {
        index++;
        if (index < messages.length) {
            document.getElementById('popupTitle').textContent = messages[index];
        } else {
            clearInterval(interval);
        }
    }, 500);
    
    setTimeout(() => {
        window.location.href = 'page1.html';
    }, 1000);
}

function closeSticky() {
    document.getElementById('stickyAd').style.display = 'none';
}
