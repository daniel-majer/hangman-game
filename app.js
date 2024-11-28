function getElement(el) {
  const element = document.querySelector(el)
  if (element) return element
  throw new Error(`Please check "${el}" selector, no such element exists`)
}

class Gameplay {
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
    let leftTime = time || 60
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
    console.log(...words)
    let displayAnswer = words.map(word => {
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

class Navigation {
  constructor() {
    this.menuSection = getElement('.main-menu')
    this.instructionsSection = getElement('.instructions')
    this.categoriesSection = getElement('.categories')
    this.gamePlaySection = getElement('.gameplay')
    this.sections = document.querySelectorAll('section')
    this.buttons = document.querySelectorAll('button')

    this.forwardBtn = document.querySelectorAll('.forward-btn')
    this.modalPaused = getElement('.paused')

    /* EVENTS */
    this.forwardBtn.forEach(btn => {
      btn.addEventListener('click', this.onForward.bind(this))
    })
    this.buttons.forEach(btn => {
      btn.addEventListener('click', this.handleSection.bind(this))
    })
    this.modalPaused.addEventListener('click', this.unPaused.bind(this))

    this.setHeightSections()
  }

  unPaused(e) {
    const leftSeconds = Number(getElement('#timer').textContent.split(':')[1])
    this.targetInstance.startTimer(leftSeconds)

    if (
      e.target.classList.contains('continue') ||
      e.target.classList.contains('paused')
    )
      return this.modalPaused.classList.add('hidden')
  }

  hideCurrentSection(numb) {
    this.currentSec.style.transform = `translateX(${numb}%)`
    this.currentSec.dataset.set = ''
  }

  displayNewSection() {
    this.currentSec = Array.from(this.sections).find(
      sec => sec.dataset.set === 'current'
    )
    this.currentSec.style.transform = 'translateX(0)'
  }

  handleSection(e) {
    if (e.target.classList.contains('modal-btn')) {
      clearInterval(this.targetInstance.interval)
      return this.modalPaused.classList.remove('hidden')
    }

    if (e.target.classList.contains('step-back'))
      this.newSection = this.menuSection

    if (e.target.classList.contains('new-category')) {
      this.newSection = this.categoriesSection
      this.targetInstance.resetData()
      e.target.closest('.modal').classList.add('hidden')
    }

    if (e.target.classList.contains('quit-game')) {
      this.newSection = this.menuSection
      this.categoriesSection.style.transform = 'translateX(100%)'
      e.target.closest('.modal').classList.add('hidden')
    }

    if (e.target.classList.contains('again')) {
      e.target.closest('.modal').classList.add('hidden')
      this.targetInstance.resetData()
      this.targetInstance.setAnswer(this.category)
    }

    this.hideCurrentSection(100)
    this.newSection.dataset.set = 'current'
    this.displayNewSection()
  }

  onForward(e) {
    if (e.target.classList.contains('category')) {
      this.category = e.target.textContent.toLowerCase()
      this.targetInstance.setCategory(this.category)
    }

    this.hideCurrentSection(-100)

    this.newSection =
      (e.target.classList.contains('play') && this.categoriesSection) ||
      (e.target.classList.contains('how-to-play') &&
        this.instructionsSection) ||
      (e.target.classList.contains('category') && this.gamePlaySection)

    this.newSection.dataset.set = 'current'
    this.displayNewSection()
  }

  async createCategories() {
    const response = await fetch('./data/data.json')
    if (!response.ok) throw new Error('Network response was not ok')

    const { categories } = await response.json()
    this.targetInstance.setData(categories)

    const keys = Object.keys(categories)

    keys.forEach(category => {
      const html = `<li class='category'>${category.toUpperCase()}</li>`
      const container = getElement('.categories-container')
      container.insertAdjacentHTML('afterbegin', html)
    })

    const categoriesDom = document.querySelectorAll('.category')
    categoriesDom.forEach(category => {
      category.addEventListener('click', this.onForward.bind(this))
    })
  }

  setTargetInstance(instance) {
    this.targetInstance = instance
  }

  setHeightSections() {
    const elements = Array.from(this.sections)
    const heights = elements.map(
      element => element.getBoundingClientRect().height
    )

    const maxHeight = Math.max(...heights)

    elements.forEach(element => {
      element.style.height = `${maxHeight}px`
    })
  }
}

class App {
  static init() {
    const start = new Navigation()
    const gameplay = new Gameplay()

    start.displayNewSection()
    start.createCategories()
    start.setTargetInstance(gameplay)
  }
}

App.init()
