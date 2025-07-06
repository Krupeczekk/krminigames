let points = 0
let currQuestIndex = -1
let lastQuestIndex = -1
let inDotGame = false

const generateDot = (() => {
    const field = $('.game-field')
    const dotSize = 5 * (window.innerHeight / 100)
    const maxLeft = field.width() - dotSize
    const maxTop = field.height() - dotSize

    const top = Math.random() * maxTop
    const left = Math.random() * maxLeft
    let $newDot = $(`<div class="dot" style="top: ${top}px; left: ${left}px"></div>`)
    field.append($newDot)
    $newDot.on('click', () => {
        points++
        $newDot.remove()
        generateDot()
    })
})

$('.startgame').on('click', () => {
    if (!inDotGame) {
        points = 0
        generateDot()
        inDotGame = true
    }
})

function GetRandomQuestIndex() {
    let index
    do {
        index = Math.floor(Math.random() * questions.length)
    } while (index == lastQuestIndex)
    lastQuestIndex = index
    return index
}

function RandomQuestion() {
    currQuestIndex = GetRandomQuestIndex()
    const question = questions[currQuestIndex]
    $('.question-title').text(question.quest)
    $('.questions-answers').empty()
    question.answers.forEach((answer) => {
        const answerDiv = $(`<div>`).addClass('questions-answer').text(answer.title).data('isCorrect', answer.isCorrect)
        $('.questions-answers').append(answerDiv)
    })
}

$(function () {
    RandomQuestion()

    $('.questions-answers').on('click', '.questions-answer', function () {
        const isCorrect = $(this).data('isCorrect')
        $('.questions-answer').removeClass('correct incorrect')
        if (isCorrect) {
            $(this).addClass('correct')
        } else {
            $(this).addClass('incorrect')
        }

        setTimeout(() => {
            RandomQuestion()
        }, 500)
    })
})

//squares

let targetColor = '';
let moveIntervals = [];

function getRandomPosition(containerWidth, containerHeight) {
    const size = window.innerHeight * 0.05; // 5vh
    const maxLeft = containerWidth - size;
    const maxTop = containerHeight - size;
    return {
        left: Math.random() * maxLeft,
        top: Math.random() * maxTop
    };
}

function addAlphaToHex(hex, alpha = '8a') {
    if (hex.length === 7) {
        return hex + alpha;
    }
    return hex;
}

function setRandomPosition($el, containerWidth, containerHeight) {
    const size = window.innerHeight * 0.05;
    const maxLeft = containerWidth - size;
    const maxTop = containerHeight - size;
    const left = Math.random() * maxLeft;
    const top = Math.random() * maxTop;
    $el.css({ top, left });
}

function moveSquare($square) {
    const $field = $('.game-field');
    const width = $field.width();
    const height = $field.height();

    const interval = setInterval(() => {
        const { top, left } = getRandomPosition(width, height);
        $square.animate({ top, left }, 3000); // wolniejsze poruszanie
    }, 500);

    moveIntervals.push(interval);
}

function stopMovement() {
    moveIntervals.forEach(clearInterval);
    moveIntervals = [];
}

function startqGame() {
    stopMovement();
    $('.game-field').empty();

    const $instruction = $('#square-click');
    $instruction.css('color', '#ffffff');

    const randomIndex = Math.floor(Math.random() * squares.length);
    targetColor = squares[randomIndex].color;

    $instruction.html(`Kliknij w <strong>${squares[randomIndex].title.toLowerCase()}</strong> kwadrat`);

    const $field = $('.game-field');
    const width = $field.width();
    const height = $field.height();

    squares.forEach(sq => {
        const backgroundWithAlpha = addAlphaToHex(sq.color);

        const $sq = $('<div>')
            .addClass('square')
            .css({
                'background-color': backgroundWithAlpha,
                'border': `1px solid ${sq.color}`
            })
            .data('color', sq.color);

        $field.append($sq);
        setRandomPosition($sq, width, height);
        moveSquare($sq);
    });
}

$(function () {
    startqGame();

    $('.game-field').on('click', '.square', function () {
        const clickedColor = $(this).data('color');
        const $instruction = $('#square-click');

        if (clickedColor === targetColor) {
            $instruction.css('color', 'lime');
        } else {
            $instruction.css('color', 'red');
        }

        setTimeout(() => {
            let newTarget;
            do {
                newTarget = squares[Math.floor(Math.random() * squares.length)];
            } while (newTarget.color === targetColor);

            targetColor = newTarget.color;
            $instruction.html(`Kliknij w <strong>${newTarget.title.toLowerCase()}</strong> kwadrat`);
            $instruction.css('color', '#ffffff');
        }, 800);
    });

});


//numbers

const time = 6500
let targetNumber = ''
let isEnded = false

function GenerateNumberUnique(count, target) {
    const numbers = new Set()
    numbers.add(target)
    while (numbers.size < count) {
        const num = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
        numbers.add(num)
    }
    return [...numbers].sort(() => Math.random() - 0.5)
}

function StartNumbersGame() {
    isEnded = false
    targetNumber = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
    $('.number-find-title').text(targetNumber).css('color', '')
    const numbers = GenerateNumberUnique(20, targetNumber)
    const $list = $('.numbers-list')
    $list.empty()

    numbers.forEach(num => {
        const $div = $(`<div class="numbers-number"></div>`).text(num)
        $div.on('click', function () {
            if (!isEnded) {
                if ($(this).text() === targetNumber) {
                    $('.number-find-title').css('color', '#0fc22d')
                } else {
                    $('.number-find-title').css('color', '#c20f0f')
                }

                isEnded = true

                $('.bar').stop(true).css('width', '0%')

                setTimeout(() => {
                    StartNumbersGame()
                }, 1000)
            }
        })
        $list.append($div)
    })

    $('.bar').stop(true).css('width', '100%').animate({
        width: '0%'
    }, time, () => {
        if (!isEnded) {
            $('.number-find-title').css('color', '#c20f0f')
            isEnded = true
            setTimeout(() => {
                StartNumbersGame()
            }, 1000)
        }
    })
}

$('#startnumbersgame').on('click', function () {
    StartNumbersGame()
})