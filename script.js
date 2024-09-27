const sentences = [


    // Medium length sentences (2-3 lines)
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "You are never too old to set another goal or to dream a new dream.",
    "The way to get started is to quit talking and begin doing.",
    "In the end, it's not the years in your life that count. It's the life in your years.",
    "Life is what happens when you're busy making other plans.",
    "Your time is limited, so don't waste it living someone else's life.",
    "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    "It is our choices that show what we truly are, far more than our abilities.",
    "You have brains in your head. You have feet in your shoes. You can steer yourself in any direction you choose.",
    "Happiness is not something ready made. It comes from your own actions.",
    "The only impossible journey is the one you never begin.",
    "The best way to predict your future is to create it.",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "Don't let yesterday take up too much of today.",
    "We may encounter many defeats but we must not be defeated.",

    // Longer sentences (3+ lines)
    "There is no passion to be found in playing small, in settling for a life that is less than the one you are capable of living.",
    "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
    "Our greatest glory is not in never falling, but in rising every time we fall.",
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle."
    
];

let sentenceElement = document.getElementById('sentence');
let inputArea = document.getElementById('input-area');
let timerElement = document.getElementById('timer');
let speedElement = document.getElementById('speed');
let resetButton = document.getElementById('reset-btn');
let leaderboardButton = document.getElementById('leaderboard-btn');
let darkModeToggle = document.getElementById('dark-mode-toggle');
let timer = 0;
let timerInterval = null;
let currentSentence = '';
let typingStartTime = null;
let timerStarted = false; // NEW: To track if the timer has already started

// Sound for mistakes
const mistakeSound = new Audio('error.mp3');

// Progress bar
let progressBarFill = document.getElementById('progress-bar-fill');

// Get a random sentence
function getRandomSentence() {
    return sentences[Math.floor(Math.random() * sentences.length)];
}

// Start the typing test
function startTypingTest() {
    inputArea.value = '';
    currentSentence = getRandomSentence();
    sentenceElement.innerHTML = currentSentence;
    inputArea.removeAttribute('disabled');
    inputArea.focus();

    if (timerInterval) clearInterval(timerInterval); // Clear previous timer
    timerElement.innerText = 'Time: 0s'; // Reset timer display
    timerStarted = false; // NEW: Reset timer started flag
    progressBarFill.style.width = '0%'; // Reset progress bar
}

// Start the timer only when user types the first character
function startTimer() {
    if (!timerStarted) {
        typingStartTime = new Date().getTime();
        timerStarted = true; // NEW: Mark that the timer has started

        // Start the interval for updating the timer every second
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Update the timer
function updateTimer() {
    let currentTime = new Date().getTime();
    timer = Math.floor((currentTime - typingStartTime) / 1000);
    timerElement.innerText = `Time: ${timer}s`;
}

// Calculate Words Per Minute (WPM)
function calculateWPM() {
    let typedText = inputArea.value.trim();
    let wordsTyped = typedText.split(' ').filter(word => word.length > 0).length;
    let minutes = timer / 60;
    let wpm = Math.floor(wordsTyped / minutes);
    return wpm || 0;
}

// Update progress bar in real-time
function updateProgressBar() {
    const progress = (inputArea.value.length / currentSentence.length) * 100;
    progressBarFill.style.width = progress + '%';
}

// Highlight mistakes and play sound
function highlightMistakes() {
    let typedText = inputArea.value;
    let currentSentenceArray = currentSentence.split('');
    let typedTextArray = typedText.split('');

    let formattedText = '';

    typedTextArray.forEach((char, index) => {
        if (char === currentSentenceArray[index]) {
            formattedText += `<span class="correct-text">${char}</span>`;
        } else {
            formattedText += `<span class="incorrect-text">${char}</span>`;
            mistakeSound.play(); // Play sound on error
        }
    });

    sentenceElement.innerHTML = formattedText + currentSentence.slice(typedText.length);

    if (typedText === currentSentence) {
        clearInterval(timerInterval);
        let wpm = calculateWPM();
        speedElement.innerText = `Speed: ${wpm} WPM`;
        inputArea.setAttribute('disabled', 'true');
        saveScore(wpm); // Save WPM score to leaderboard
        showSummary(wpm); // Show session summary
    }
}

// Save score in localStorage
function saveScore(wpm) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(wpm);
    localStorage.setItem('scores', JSON.stringify(scores));
}

// Show leaderboard
function showLeaderboard() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.sort((a, b) => b - a); // Highest WPM first
    alert('Top Scores: ' + scores.slice(0, 5).join(', '));
}

// Show summary after typing
function showSummary(wpm) {
    let totalTime = timer;
    let accuracy = ((currentSentence.length - inputArea.value.length) / currentSentence.length) * 100;
    alert(`Summary:\nTime: ${totalTime}s\nWPM: ${wpm}\nAccuracy: ${accuracy.toFixed(2)}%`);
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    inputArea.classList.toggle('dark-mode');
});

// Event listeners
inputArea.addEventListener('input', () => {
    startTimer(); // NEW: Start the timer when typing begins
    highlightMistakes();
    updateProgressBar();
    let wpm = calculateWPM();
    speedElement.innerText = `Speed: ${wpm} WPM`; // Real-time WPM update
});

resetButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timer = 0;
    timerElement.innerText = 'Time: 0s';
    speedElement.innerText = 'Speed: 0 WPM';
    progressBarFill.style.width = '0%';
    startTypingTest();
});

leaderboardButton.addEventListener('click', showLeaderboard);

// Initialize the test
startTypingTest();
