const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Константы для игры
let NUM_OBJECTS = 33;
const SIZE = 15;
const ICONS = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂️"
};
let speedMultiplier = 1.0; // Множитель скорости

// Массивы объектов
let rocks = [];
let papers = [];
let scissors = [];

// Функция для создания объектов
// function createObjects(array, type) {
//     for (let i = 0; i < NUM_OBJECTS; i++) {
//         array.push({
//             x: Math.random() * canvas.width,
//             y: Math.random() * canvas.height,
//             type: type,
//             dx: (Math.random() - 0.5) * 2.5 * speedMultiplier,
//             dy: (Math.random() - 0.5) * 2.5 * speedMultiplier
//         });
//     }
// }

// Функция создания объектов с начальными позициями ближе к середине краёв
function createObjects(array, type) {
    let startX, startY;

    // Определяем стартовые позиции ближе к середине краёв
    if (type === "rock") { // Камни — верхний левый край (центр по горизонтали верхней границы)
        startX = canvas.width / 4; // Четверть ширины от левого края
        startY = 25; // Небольшой отступ сверху
    } else if (type === "paper") { // Бумага — верхний правый край
        startX = (canvas.width * 3) / 4; // Три четверти ширины
        startY = 25;
    } else if (type === "scissors") { // Ножницы — нижний центр
        startX = canvas.width / 2; // Центр по горизонтали
        startY = canvas.height - SIZE - 25; // Небольшой отступ снизу
    }

    for (let i = 0; i < NUM_OBJECTS; i++) {
        array.push({
            x: startX + Math.random() * 50 - 25, // Небольшой разброс вокруг центра
            y: startY + Math.random() * 50 - 25,
            type: type,
            dx: (Math.random() - 0.5) * 2.5 * speedMultiplier, // Скорость
            dy: (Math.random() - 0.5) * 2.5 * speedMultiplier
        });
    }
}


// Инициализация игры
function initializeGame() {
    rocks = [];
    papers = [];
    scissors = [];
    createObjects(rocks, "rock");
    createObjects(papers, "paper");
    createObjects(scissors, "scissors");
}

// Рисование объектов
function drawObjects(objects, icon) {
    objects.forEach(obj => {
        ctx.font = `${SIZE}px Arial`;
        ctx.fillText(icon, obj.x, obj.y);
    });
}

// Обновление позиций
function updatePositions(objects) {
    objects.forEach(obj => {
        obj.x += obj.dx;
        obj.y += obj.dy;

        // Отскок от стен
        if (obj.x < 0 || obj.x > canvas.width - SIZE) obj.dx *= -1;
        if (obj.y < 0 || obj.y > canvas.height - SIZE) obj.dy *= -1;
    });
}

// Проверка столкновений
function checkCollisions() {
    // Rock vs Paper: Rock disappears, Paper stays
    papers.forEach((paper, index) => {
        rocks = rocks.filter(rock => {
            const hit = distance(paper, rock) < SIZE;
            if (hit) {
                // Удаляем камень, но не удаляем бумагу
                return false;
            }
            return true;
        });
    });

    // Paper vs Scissors: Scissors disappear, Paper stays
    scissors.forEach((scissor, index) => {
        papers = papers.filter(paper => {
            const hit = distance(scissor, paper) < SIZE;
            if (hit) {
                // Удаляем ножницы, но не удаляем бумагу
                return false;
            }
            return true;
        });
    });

    // Scissors vs Rock: Scissors disappear, Rock stays
    rocks.forEach((rock, index) => {
        scissors = scissors.filter(scissor => {
            const hit = distance(rock, scissor) < SIZE;
            if (hit) {
                // Удаляем ножницы, но не удаляем камень
                return false;
            }
            return true;
        });
    });
}

function announceWinner() {
    if (rocks.length > papers.length && rocks.length > scissors.length) {
        console.log("Победили камни! 🪨");
    } else if (papers.length > rocks.length && papers.length > scissors.length) {
        console.log("Победила бумага! 📄");
    } else if (scissors.length > rocks.length && scissors.length > papers.length) {
        console.log("Победили ножницы! ✂️");
    } else {
        console.log("Нет победителя, ничья!");
    }
}


// Расчет расстояния
function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

// Главный цикл игры
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePositions(rocks);
    updatePositions(papers);
    updatePositions(scissors);
    checkCollisions();

    drawObjects(rocks, ICONS.rock);
    drawObjects(papers, ICONS.paper);
    drawObjects(scissors, ICONS.scissors);

    ctx.fillStyle = "#FFF";
    ctx.font = "20px Arial";
    ctx.fillText(`🪨 ${rocks.length}   📄 ${papers.length}   ✂️ ${scissors.length}`, 10, 30);

    // Объявление победителя, если все объекты исчезли
    if (rocks.length === 0 && scissors.length === 0) {
        announceWinner();
    } else if (rocks.length === 0 && papers.length === 0) {
        announceWinner();
    } else if (scissors.length === 0 && papers.length === 0) {
        announceWinner();
    }
    requestAnimationFrame(gameLoop);
}

// Увеличение скорости объектов без перезапуска игры
document.getElementById("increaseSpeed").addEventListener("click", () => {
    increaseSpeed(1.2); // Увеличиваем скорость на 20%
});

function increaseSpeed(multiplier) {
    // Применяем множитель к скорости каждого объекта
    [...rocks, ...papers, ...scissors].forEach(obj => {
        obj.dx *= multiplier;
        obj.dy *= multiplier;
    });
}

document.getElementById("restartGame").addEventListener("click", () => {
    speedMultiplier = 1.0; // Сбрасываем скорость
    initializeGame(); // Возобновляем игру
});

document.getElementById("setObjectCount").addEventListener("click", () => {
    const inputCount = parseInt(document.getElementById("objectCount").value);
    if (inputCount >= 10) {
        NUM_OBJECTS = inputCount; // Устанавливаем новое количество объектов
        initializeGame();
    } else {
        alert("Введите число больше или равное 10.");
    }
});

// Запуск игры
initializeGame();
gameLoop();