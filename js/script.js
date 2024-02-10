let choiceAnswer = null

function chooseAnswer(indexQuestion) {
    choiceAnswer = {
        isCorrect: document.getElementById('answers').value,
        indexQuestion,
    }
}

function giveAnswer() {
    if(choiceAnswer) {
        let selectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'))

        selectedAnswers.selectedAnswers.push(choiceAnswer)

        localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers))
        localStorage.setItem('lastQuestion', `${Number(localStorage.getItem('lastQuestion')) + 1}`)

        loadQuestion()
    } else {
        alert('Ответьте на вопрос!')
    }
}

function currentDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

function getResults() {
    return JSON.parse(localStorage.getItem('results'))['results']
}

function showResults() {
    let results = getResults()
    let content = `
        <div class="row">
            <div class="col">
                <p class="fs-4">Дата теста</p>
            </div>
            <div class="col">
                <p class="fs-4">%</p>
            </div>
        </div>
        <hr class="mt-0"/>
        <br/>
    `

    results.forEach(result => {
        content += `
            <div class="row">
                <div class="col">
                    <p class="fs-5">${result.date}</p>
                </div>
                <div class="col">
                    <p class="fs-5">${result.percentagePassing}</p>
                </div>
            </div>
        `
    })

    document.getElementById('results').innerHTML = content
}

function writeResult(percentagePassing) {
    let results = getResults()

    results.push({
        date: currentDate(),
        percentagePassing,
    })

    localStorage.setItem('results', JSON.stringify({results}))
}

function showResultTest() {
    let selectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'))['selectedAnswers']
    let questions = JSON.parse(localStorage.getItem('questions'))['questions']

    finishTest()

    let content = `<div class="border border-success rounded p-3"><h2 class="text-center">Результаты тестирования</h2><br/>`

    let counterCorrectAnswers = 0

    selectedAnswers.forEach(selectedAnswer => {
        let isCorrect = JSON.parse(selectedAnswer.isCorrect)

        if(isCorrect) counterCorrectAnswers++

        content += `
            <div class="row">
                <div class="col">
                    <p class="fs-3">${questions[selectedAnswer.indexQuestion].title}</p>
                </div>
                <div class="col">
                    ${isCorrect ? '<p class="fs-3 text-success">Правильно</p>' : '<p class="fs-3 text-danger">Неправильно</p>'}
                </div>
            </div>
        `
    })

    let percentagePassing = counterCorrectAnswers / (questions.length / 100)

    content += `
        <br/>
        <p class="fs-3 text-center">Вы прошли тест на ${percentagePassing} %</p>
        </div>
    `

    document.getElementById('test').innerHTML = content

    writeResult(percentagePassing)
}

function loadQuestion() {
    let indexLastQuestion = Number(localStorage.getItem('lastQuestion'))
    let questions = JSON.parse(localStorage.getItem('questions'))['questions']

    if(indexLastQuestion === questions.length) {
        showResultTest()
    } else {
        let question = questions[indexLastQuestion]

        let content = `<div class="border border-success rounded p-3"><h2 class="text-center">${question.title}</h2><br/><select id="answers" onclick="chooseAnswer(${indexLastQuestion})" class="form-select form-select-lg mb-3">`

        question.answers.forEach((answer, index) => {
            content += `
            <option value="${answer.isCorrect}">${answer.title}</option>
         `
        })

        content += '</select><button class="btn btn-success btn-lg" type="button" onclick="giveAnswer()">Ответить</button></div>'

        document.getElementById('test').innerHTML = content
    }
}

function startTest() {
    let buttonStart = document.querySelector('#start_test')
    buttonStart.innerText = 'Закончить тест'
    buttonStart.classList.replace('btn-success', 'btn-danger')
    buttonStart.onclick = () => finishTest()

    loadQuestion()
}

function finishTest() {
    let buttonStart = document.querySelector('#start_test')
    buttonStart.innerText = 'Начать тест'
    buttonStart.classList.replace('btn-danger', 'btn-success')
    buttonStart.onclick = () => startTest()
    document.getElementById('test').innerHTML = ''
    localStorage.setItem('lastQuestion', '0')
    localStorage.setItem('selectedAnswers', JSON.stringify({selectedAnswers: []}))
    choiceAnswer = null
}

function loadApp() {
    if(!localStorage.getItem('questions')) {
        localStorage.setItem('questions', JSON.stringify({
            questions: [
                {
                    title: 'Какую типизацию имеет язык программирования PHP?',
                    answers: [
                        {
                            title: 'Динамическую слабую типизацию',
                            isCorrect: true
                        },
                        {
                            title: 'Статическую сильную типизация',
                            isCorrect: false
                        },
                        {
                            title: 'Что такое типизация?',
                            isCorrect: false
                        }
                    ]
                },
                {
                    title: 'Каким является язык программирования PHP?',
                    answers: [
                        {
                            title: 'Сценарным',
                            isCorrect: true
                        },
                        {
                            title: 'Встроенным',
                            isCorrect: false
                        },
                        {
                            title: 'Что такое язык программирования?',
                            isCorrect: false
                        }
                    ]
                }
            ]
        }))
    }

    if(!localStorage.getItem('lastQuestion')) localStorage.setItem('lastQuestion', '0')

    if(!localStorage.getItem('selectedAnswers')) localStorage.setItem('selectedAnswers', JSON.stringify({selectedAnswers: []}))

    if(!localStorage.getItem('results')) localStorage.setItem('results', JSON.stringify({results: []}))
}

loadApp()
