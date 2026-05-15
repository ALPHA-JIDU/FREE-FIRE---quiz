const questions = [
    {q:"Which character has the highest HP in Free Fire?",o:["Alok","K","Chrono","Skyler"],a:1},
    {q:"What is the max squad size?",o:["3","4","5","6"],a:1},
    {q:"Best weapon for close range?",o:["M4A1","MP40","SCAR","AWM"],a:1},
    {q:"What does Gloo Wall do?",o:["Heal","Shield","Damage","Speed"],a:1},
    {q:"Which skill revives teammates?",o:["Alok","K","Clu","Hayato"],a:1},
    {q:"Fastest vehicle?",o:["Monster Truck","Sports Car","Motorcycle","Jet Ski"],a:1},
    {q:"Character with wall penetration?",o:["Xayne","Laura","Luqueta","Wukong"],a:0},
    {q:"Max grenades per slot?",o:["2","3","4","5"],a:1},
    {q:"What heals over time?",o:["Medkit","First Aid","Painkiller","Bandage"],a:2},
    {q:"What blocks bullets?",o:["Gloo Wall","Vest","Helmet","Shield"],a:0}
];

let currentQuestions = [];
let currentQ = 0;
let score = 0;
let timeLeft = 60;
let selectedAnswer = -1;
let timerInterval;

// DOM Elements
const elements = {
    preloader: document.getElementById('preloader'),
    quizContainer: document.getElementById('quizContainer'),
    question: document.getElementById('question'),
    options: document.getElementById('options'),
    progressFill: document.getElementById('progressFill'),
    timerNumber: document.getElementById('timerNumber'),
    nextBtn: document.getElementById('nextBtn'),
    errorText: document.getElementById('errorText'),
    successPopup: document.getElementById('successPopup'),
    errorPopup: document.getElementById('errorPopup'),
    timeoutPopup: document.getElementById('timeoutPopup'),
    restartAdPopup: document.getElementById('restartAdPopup'),
    finalScore: document.getElementById('finalScore'),
    rankBadge: document.getElementById('rankBadge'),
    beatPercentage: document.getElementById('beatPercentage'),
    restartBtn: document.getElementById('restartBtn'),
    retryBtn: document.getElementById('retryBtn'),
    continueBtn: document.getElementById('continueBtn')
};

document.addEventListener('DOMContentLoaded', init);

function init() {
    const token = sessionStorage.getItem('elite_quiz_token');
    const expiry = parseInt(sessionStorage.getItem('token_expiry'));

    if (!token || !expiry || Date.now() > expiry) {
        showError();
        return;
    }

    elements.nextBtn.onclick = nextQuestion;
    setTimeout(showQuiz, 2000);
}

function showError() {
    elements.preloader.classList.remove('active');
    elements.errorPopup.classList.add('active');
    window.errorPopup = elements.errorPopup;
}

function showQuiz() {
    elements.preloader.classList.remove('active');
    elements.quizContainer.classList.add('active');

    currentQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    if (currentQ >= 10) {
        endQuiz();
        return;
    }

    selectedAnswer = -1;
    const q = currentQuestions[currentQ];
    elements.question.textContent = q.q;
    elements.options.innerHTML = '';

    q.o.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'option';
        const labels = ['➊', '➋', '➌', '➍'];
        
        div.innerHTML = `
            <span class="label ${i % 2 === 0 ? 'bronze' : 'cream'}">${labels[i]}</span>
            <span>${opt}</span>
        `;
        div.onclick = () => selectAnswer(i);
        elements.options.appendChild(div);
    });

    elements.progressFill.style.width = `${currentQ * 10}%`;
    elements.errorText.classList.remove('show');
}

function selectAnswer(index) {
    if (selectedAnswer !== -1) return;
    selectedAnswer = index;

    const optionEls = document.querySelectorAll('.option');
    const correct = currentQuestions[currentQ].a;

    optionEls.forEach(el => el.classList.add('disabled'));

    if (index === correct) {
        optionEls[index].classList.add('correct');
        score++;
    } else {
        optionEls[index].classList.add('wrong');
        optionEls[correct].classList.add('correct');
    }
}

function nextQuestion() {
    if (selectedAnswer === -1) {
        elements.errorText.classList.add('show');
        setTimeout(() => elements.errorText.classList.remove('show'), 1500);
        return;
    }

    currentQ++;
    loadQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    elements.timerNumber.textContent = '60s';

    timerInterval = setInterval(() => {
        timeLeft--;
        elements.timerNumber.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showTimeout();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerInterval);
    elements.finalScore.textContent = `${score}/10`;
    const rank = getRank(score);
    elements.rankBadge.textContent = rank.name;
    elements.rankBadge.className = `rank-badge ${rank.class}`;
    elements.beatPercentage.textContent = `${getBeat(score)}%`;

    elements.quizContainer.classList.remove('active');
    elements.successPopup.classList.add('active');
}

function showTimeout() {
    clearInterval(timerInterval);
    elements.quizContainer.classList.remove('active');
    elements.timeoutPopup.classList.add('active');
}

function getRank(score) {
    if (score >= 9) return { name: 'LEGENDARY', class: 'rank-legendary' };
    if (score >= 7) return { name: 'ELITE', class: 'rank-elite' };
    if (score >= 4) return { name: 'VETERAN', class: 'rank-veteran' };
    return { name: 'ROOKIE', class: 'rank-rookie' };
}

function getBeat(score) {
    if (score >= 9) return 93;
    if (score >= 6) return 75;
    if (score >= 4) return 55;
    return 30;
}

// Event Listeners for Popups
elements.restartBtn?.addEventListener('click', showRestartAd);
elements.retryBtn?.addEventListener('click', showRestartAd);
elements.continueBtn?.addEventListener('click', restartQuizFromAd);

function showRestartAd() {
    elements.successPopup?.classList.remove('active');
    elements.timeoutPopup?.classList.remove('active');
    elements.restartAdPopup.classList.add('active');
}

function restartQuizFromAd() {
    elements.restartAdPopup.classList.remove('active');
    currentQ = 0;
    score = 0;
    elements.quizContainer.classList.add('active');
    currentQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
    loadQuestion();
    startTimer();
}
