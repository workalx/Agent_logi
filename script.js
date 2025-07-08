// Глобальні змінні гри
let gameState = {
    currentLevel: 1,
    score: 0,
    timer: 30,
    timerInterval: null,
    gameStartTime: null,
    isPaused: false,
    totalLevels: 10
};

// Типи головоломок
const puzzleTypes = {
    SEQUENCE: 'sequence',
    PATTERN: 'pattern',
    MATH: 'math',
    LOGIC: 'logic'
};

// База даних головоломок
const puzzles = [
    // Рівень 1 - Послідовність
    {
        type: puzzleTypes.SEQUENCE,
        question: "Знайдіть наступний елемент послідовності: 2, 4, 8, 16, ?",
        answer: "32",
        options: ["24", "30", "32", "36"],
        explanation: "Кожне число множиться на 2"
    },
    // Рівень 2 - Патерн
    {
        type: puzzleTypes.PATTERN,
        question: "Який символ повинен бути замість ?: A, C, E, G, ?",
        answer: "I",
        options: ["H", "I", "J", "K"],
        explanation: "Пропускаємо одну літеру алфавіту"
    },
    // Рівень 3 - Математика
    {
        type: puzzleTypes.MATH,
        question: "Скільки буде 15 + 27 × 2?",
        answer: "69",
        options: ["84", "69", "54", "42"],
        explanation: "Спочатку множення: 27 × 2 = 54, потім додавання: 15 + 54 = 69"
    },
    // Рівень 4 - Логіка
    {
        type: puzzleTypes.LOGIC,
        question: "Якщо всі квіти червоні, а троянди - це квіти, то троянди...",
        answer: "червоні",
        options: ["червоні", "не червоні", "можуть бути різних кольорів", "не квіти"],
        explanation: "Логічний висновок: якщо всі квіти червоні, то троянди (які є квітами) теж червоні"
    },
    // Рівень 5 - Послідовність
    {
        type: puzzleTypes.SEQUENCE,
        question: "Знайдіть наступний елемент: 1, 3, 6, 10, ?",
        answer: "15",
        options: ["12", "15", "18", "20"],
        explanation: "Додаємо 2, потім 3, потім 4, потім 5"
    },
    // Рівень 6 - Патерн
    {
        type: puzzleTypes.PATTERN,
        question: "Який символ замість ?: 1, 4, 9, 16, ?",
        answer: "25",
        options: ["20", "25", "30", "36"],
        explanation: "Квадрати чисел: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25"
    },
    // Рівень 7 - Математика
    {
        type: puzzleTypes.MATH,
        question: "Скільки буде 100 ÷ 4 + 7 × 3?",
        answer: "46",
        options: ["46", "52", "38", "61"],
        explanation: "100 ÷ 4 = 25, 7 × 3 = 21, 25 + 21 = 46"
    },
    // Рівень 8 - Логіка
    {
        type: puzzleTypes.LOGIC,
        question: "Якщо завтра буде вчора, то сьогодні буде...",
        answer: "п'ятниця",
        options: ["четвер", "п'ятниця", "субота", "неділя"],
        explanation: "Логічна головоломка з днями тижня"
    },
    // Рівень 9 - Послідовність
    {
        type: puzzleTypes.SEQUENCE,
        question: "Знайдіть наступний елемент: 1, 1, 2, 3, 5, ?",
        answer: "8",
        options: ["6", "7", "8", "9"],
        explanation: "Послідовність Фібоначчі: кожне число = сума двох попередніх"
    },
    // Рівень 10 - Фінальна головоломка
    {
        type: puzzleTypes.LOGIC,
        question: "Код доступу: скільки разів цифра 7 зустрічається від 1 до 100?",
        answer: "20",
        options: ["18", "19", "20", "21"],
        explanation: "7, 17, 27, 37, 47, 57, 67, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 87, 97"
    }
];

// Місії для кожного рівня
const missions = [
    "ОБХІД СИСТЕМИ БЕЗПЕКИ",
    "ДЕШИФРУВАННЯ КОДУ",
    "МАТЕМАТИЧНА ПЕРЕВІРКА",
    "ЛОГІЧНА ВАЛІДАЦІЯ",
    "АНАЛІЗ ПОСЛІДОВНОСТІ",
    "ПАТЕРН РОЗПІЗНАВАННЯ",
    "ВИЧИСЛЕННЯ БЕЗПЕКИ",
    "ЛОГІЧНА ДЕДУКЦІЯ",
    "АЛГОРИТМ ФІБОНАЧЧІ",
    "ФІНАЛЬНИЙ КОД ДОСТУПУ"
];

// Ініціалізація гри
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
    startLoadingScreen();
});

// Ініціалізація гри
function initializeGame() {
    gameState.currentLevel = 1;
    gameState.score = 0;
    gameState.timer = 30;
    gameState.isPaused = false;
    updateDisplay();
}

// Налаштування обробників подій
function setupEventListeners() {
    // Кнопки меню
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('instructions').addEventListener('click', showInstructions);
    document.getElementById('back-to-menu').addEventListener('click', showMainMenu);
    
    // Ігрові кнопки
    document.getElementById('submit-answer').addEventListener('click', submitAnswer);
    document.getElementById('skip-puzzle').addEventListener('click', skipPuzzle);
    document.getElementById('pause-game').addEventListener('click', pauseGame);
    
    // Кнопки паузи
    document.getElementById('resume-game').addEventListener('click', resumeGame);
    document.getElementById('restart-game').addEventListener('click', restartGame);
    document.getElementById('quit-to-menu').addEventListener('click', quitToMenu);
    
    // Кнопки завершення
    document.getElementById('retry-game').addEventListener('click', restartGame);
    document.getElementById('back-to-main').addEventListener('click', quitToMenu);
    
    // Кнопки перемоги
    document.getElementById('play-again').addEventListener('click', restartGame);
    document.getElementById('victory-to-menu').addEventListener('click', quitToMenu);
    
    // Обробка Enter в полі вводу
    document.getElementById('answer-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
}

// Екран завантаження
function startLoadingScreen() {
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    const loadingTexts = [
        'Ініціалізація систем безпеки...',
        'Підключення до серверу...',
        'Завантаження головоломок...',
        'Підготовка агента...',
        'Система готова!'
    ];
    
    let progress = 0;
    let textIndex = 0;
    
    const loadingInterval = setInterval(() => {
        progress += 2;
        loadingProgress.style.width = progress + '%';
        
        if (progress % 20 === 0 && textIndex < loadingTexts.length - 1) {
            textIndex++;
            loadingText.textContent = loadingTexts[textIndex];
        }
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                showMainMenu();
            }, 500);
        }
    }, 50);
}

// Показати головне меню
function showMainMenu() {
    hideAllScreens();
    document.getElementById('main-menu').classList.add('active');
}

// Показати інструкції
function showInstructions() {
    hideAllScreens();
    document.getElementById('instructions-screen').classList.add('active');
}

// Почати гру
function startGame() {
    hideAllScreens();
    document.getElementById('game-screen').classList.add('active');
    gameState.gameStartTime = Date.now();
    loadPuzzle();
    startTimer();
}

// Приховувати всі екрани
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
}

// Завантажити головоломку
function loadPuzzle() {
    const puzzle = puzzles[gameState.currentLevel - 1];
    const mission = missions[gameState.currentLevel - 1];
    
    // Оновити інформацію про місію
    document.getElementById('mission-title').textContent = `МІСІЯ ${gameState.currentLevel}: ${mission}`;
    document.getElementById('mission-description').textContent = puzzle.explanation;
    
    // Показати питання
    document.getElementById('puzzle-display').innerHTML = `
        <div class="puzzle-question">
            <h3>${puzzle.question}</h3>
        </div>
    `;
    
    // Показати варіанти відповідей
    const answerOptions = document.getElementById('answer-options');
    answerOptions.innerHTML = '';
    
    puzzle.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'answer-option';
        optionElement.textContent = option;
        optionElement.dataset.answer = option;
        optionElement.addEventListener('click', () => selectAnswer(option));
        answerOptions.appendChild(optionElement);
    });
    
    // Очистити поле вводу
    document.getElementById('answer-input').value = '';
    
    // Оновити відображення
    updateDisplay();
}

// Вибрати відповідь
function selectAnswer(answer) {
    // Зняти виділення з усіх варіантів
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Виділити вибраний варіант
    event.target.classList.add('selected');
    
    // Встановити значення в поле вводу
    document.getElementById('answer-input').value = answer;
}

// Відправити відповідь
function submitAnswer() {
    const userAnswer = document.getElementById('answer-input').value.trim();
    const puzzle = puzzles[gameState.currentLevel - 1];
    
    if (!userAnswer) {
        showMessage('Введіть відповідь!', 'error');
        return;
    }
    
    // Перевірити відповідь
    if (userAnswer.toLowerCase() === puzzle.answer.toLowerCase()) {
        correctAnswer();
    } else {
        incorrectAnswer();
    }
}

// Правильна відповідь
function correctAnswer() {
    const puzzle = puzzles[gameState.currentLevel - 1];
    const timeBonus = Math.floor(gameState.timer * 10);
    const levelBonus = gameState.currentLevel * 50;
    const totalBonus = timeBonus + levelBonus;
    
    gameState.score += totalBonus;
    
    // Показати анімацію правильної відповіді
    showMessage(`Правильно! +${totalBonus} балів`, 'success');
    
    // Підсвітити правильну відповідь
    document.querySelectorAll('.answer-option').forEach(option => {
        if (option.dataset.answer === puzzle.answer) {
            option.classList.add('correct');
        }
    });
    
    setTimeout(() => {
        nextLevel();
    }, 1500);
}

// Неправильна відповідь
function incorrectAnswer() {
    const puzzle = puzzles[gameState.currentLevel - 1];
    
    // Підсвітити правильну та неправильну відповіді
    document.querySelectorAll('.answer-option').forEach(option => {
        if (option.dataset.answer === puzzle.answer) {
            option.classList.add('correct');
        } else if (option.classList.contains('selected')) {
            option.classList.add('incorrect');
        }
    });
    
    showMessage(`Неправильно! Правильна відповідь: ${puzzle.answer}`, 'error');
    
    setTimeout(() => {
        gameOver();
    }, 2000);
}

// Наступний рівень
function nextLevel() {
    gameState.currentLevel++;
    
    if (gameState.currentLevel > gameState.totalLevels) {
        victory();
    } else {
        gameState.timer = 30;
        loadPuzzle();
        startTimer();
    }
}

// Пропустити головоломку
function skipPuzzle() {
    gameState.score -= 100;
    if (gameState.score < 0) gameState.score = 0;
    
    showMessage('Головоломку пропущено! -100 балів', 'warning');
    nextLevel();
}

// Таймер
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        if (!gameState.isPaused) {
            gameState.timer--;
            updateTimerDisplay();
            
            if (gameState.timer <= 0) {
                clearInterval(gameState.timerInterval);
                gameOver();
            }
        }
    }, 1000);
}

// Оновити відображення таймера
function updateTimerDisplay() {
    const timerText = document.getElementById('timer-text');
    const timerProgress = document.getElementById('timer-progress');
    
    timerText.textContent = gameState.timer;
    
    const progressPercent = (gameState.timer / 30) * 100;
    timerProgress.style.width = progressPercent + '%';
    
    // Зміна кольору при низькому часі
    if (gameState.timer <= 10) {
        timerProgress.style.background = 'linear-gradient(90deg, #ff0000, #ff6600)';
        timerText.style.color = '#ff0000';
    } else if (gameState.timer <= 20) {
        timerProgress.style.background = 'linear-gradient(90deg, #ff6600, #ffff00)';
        timerText.style.color = '#ff6600';
    }
}

// Пауза гри
function pauseGame() {
    gameState.isPaused = true;
    hideAllScreens();
    document.getElementById('pause-screen').classList.add('active');
    
    // Оновити статистику в паузі
    document.getElementById('pause-level').textContent = gameState.currentLevel;
    document.getElementById('pause-score').textContent = gameState.score;
}

// Продовжити гру
function resumeGame() {
    gameState.isPaused = false;
    hideAllScreens();
    document.getElementById('game-screen').classList.add('active');
}

// Перезапустити гру
function restartGame() {
    initializeGame();
    startGame();
}

// Вийти в меню
function quitToMenu() {
    initializeGame();
    showMainMenu();
}

// Кінець гри
function gameOver() {
    clearInterval(gameState.timerInterval);
    hideAllScreens();
    document.getElementById('game-over-screen').classList.add('active');
    
    // Оновити статистику
    document.getElementById('final-level').textContent = gameState.currentLevel;
    document.getElementById('final-score').textContent = gameState.score;
}

// Перемога
function victory() {
    clearInterval(gameState.timerInterval);
    hideAllScreens();
    document.getElementById('victory-screen').classList.add('active');
    
    // Розрахувати час виконання
    const completionTime = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
    const minutes = Math.floor(completionTime / 60);
    const seconds = completionTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Оновити статистику
    document.getElementById('victory-score').textContent = gameState.score;
    document.getElementById('completion-time').textContent = timeString;
}

// Оновити відображення
function updateDisplay() {
    document.getElementById('current-level').textContent = gameState.currentLevel;
    document.getElementById('current-score').textContent = gameState.score;
}

// Показати повідомлення
function showMessage(message, type) {
    // Створити елемент повідомлення
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff0000' : '#ff6600'};
        color: #000;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 700;
        z-index: 1000;
        animation: messageShow 0.3s ease;
    `;
    
    document.body.appendChild(messageElement);
    
    // Видалити повідомлення через 2 секунди
    setTimeout(() => {
        messageElement.style.animation = 'messageHide 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 300);
    }, 2000);
}

// Додати CSS анімації для повідомлень
const style = document.createElement('style');
style.textContent = `
    @keyframes messageShow {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes messageHide {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .answer-option.selected {
        background: linear-gradient(45deg, #ffff00, #ffcc00) !important;
        color: #000 !important;
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// Створити матричний фон
function createMatrixBackground() {
    const matrixBg = document.createElement('div');
    matrixBg.className = 'matrix-bg';
    
    for (let i = 0; i < 50; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = String.fromCharCode(0x30A0 + Math.random() * 96);
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDelay = Math.random() * 3 + 's';
        matrixBg.appendChild(char);
    }
    
    document.body.appendChild(matrixBg);
}

// Запустити матричний фон
createMatrixBackground(); 