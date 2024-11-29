import { getElement } from './helper.js'

export class Gameplay {
  constructor() {
    this.answerContainers = getElement('.answer-letters')
    this.progressBar = getElement('progress')
    this.letters = document.querySelectorAll('.alphabet-letters li')
    this.modalLoseWin = getElement('.lose')
    this.modalTitle = getElement('.lose h1')
    this.categoryHeader = getElement('.gameplay h1')
    this.timer = getElement('#timer')
    this.answers = []
    this.categories
    this.playerStats = {
      level: 1,
      maxLevel: 3,
      time: 60,
      health: '80',
    }

    this.letters.forEach(l => {
      l.addEventListener('click', this.onClickLetter.bind(this))
    })
  }

  endGame(state) {
    this.modalLoseWin.classList.remove('hidden')
    this.modalTitle.textContent = state
    this.modalTitle.setAttribute('stroke-text', state)
    clearInterval(this.interval)
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  startTimer(time) {
    let leftTime = time || this.playerStats.time
    this.timer.textContent = this.formatTime(leftTime)

    if (this.interval) clearInterval(this.interval)

    this.interval = setInterval(() => {
      leftTime--
      this.timer.textContent = this.formatTime(leftTime)

      if (leftTime <= 0) {
        clearInterval(this.interval)
        this.endGame('You Lose')
      }
    }, 1000)
  }

  handleProgressBar() {
    this.progressBar.value -= 10
    if (this.progressBar.value <= 0) {
      this.endGame('You Lose')
    }
  }

  setData(data) {
    this.categories = data
  }

  setProgressBar() {
    this.progressBar.value = this.playerStats.health
    this.progressBar.max = this.playerStats.health
  }

  resetData() {
    this.letters.forEach(letter =>
      letter.classList.contains('clicked')
        ? letter.classList.remove('clicked')
        : ''
    )
    this.setProgressBar()
    this.playerStats.level = 1
  }

  checkFinish(complete) {
    if (complete) {
      this.playerStats.level += 1

      if (this.playerStats.level === this.playerStats.maxLevel + 1)
        return this.endGame('You Win')

      setTimeout(() => {
        this.setAnswer(this.category)

        this.letters.forEach(letter =>
          letter.classList.contains('clicked')
            ? letter.classList.remove('clicked')
            : ''
        )
      }, 1000)
    }
  }

  checkMatchLetter(wordEl, clicked) {
    const word = wordEl.dataset.set

    if (word.includes(clicked)) {
      let indexAnswerLetter = []

      for (const [i, char] of [...word].entries()) {
        if (char === clicked) indexAnswerLetter.push(i)
      }

      let rightCards = Array.from(wordEl.querySelectorAll('.card')).filter(
        (_, i) => indexAnswerLetter.includes(i)
      )
      rightCards.forEach(letter => {
        letter.classList.add('turn')
      })
    }

    const isFinish = [...this.cards].every(card =>
      card.classList.contains('turn')
    )
    this.checkFinish(isFinish)
  }

  onClickLetter(e) {
    if (e.target.classList.contains('clicked')) return
    e.target.classList.add('clicked')

    const clickedLetter = e.target.innerText.toLowerCase()
    if (!this.answer.includes(clickedLetter)) this.handleProgressBar()

    this.words.forEach(word => {
      this.checkMatchLetter(word, clickedLetter)
    })
  }

  generateAnswer() {
    const words = this.answer.split(' ')
    /*     console.log(...words)
     */ let displayAnswer = words.map(word => {
      return `<li data-set='${word}'>${word
        .split('')
        .map(w => {
          return `<div class="card-container">
                    <div class="card">
                              <span class="front"></span>
                              <span class="back">${w.toUpperCase()}</span>
                    </div>
                  </div>`
        })
        .join('')}</li>`
    })
    displayAnswer = displayAnswer.join('')
    this.answerContainers.innerHTML = displayAnswer
    this.cards = document.querySelectorAll('.card')
    this.words = this.answerContainers.querySelectorAll('.answer-letters li')
  }
  setTitle() {
    this.categoryHeader.textContent = `${this.category} ${this.playerStats.level}/${this.playerStats.maxLevel}`
  }

  setAnswer(category) {
    const categories = Object.entries(this.categories)

    for (const c of categories) {
      if (c[0].toLowerCase() === category.toLowerCase())
        [this.category, this.answers] = c
    }

    const randomNumb = Math.floor(Math.random() * this.answers.length)
    this.answer = this.answers[randomNumb].name.toLowerCase()

    this.setTitle()
    this.generateAnswer()
    this.startTimer()
  }

  setCategory(category) {
    this.setProgressBar()
    this.setAnswer(category)
  }
}
