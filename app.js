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

    this.health = 8

    this.letters.forEach(l => {
      l.addEventListener('click', this.onClickLetter.bind(this))
    })
  }

  handleProgressBar() {
    this.progressBar.value -= 10
    if (this.progressBar.value <= 0) {
      this.modalLoseWin.classList.remove('hidden')
      this.modalTitle.textContent = 'You Lose'
      this.modalTitle.setAttribute('stroke-text', 'You Lose')
    }
  }

  checkMatchLetter(wordEl, clicked) {
    const word = wordEl.dataset.set

    if (word.includes(clicked)) {
      let indexAnswerLetter = []

      for (const [i, char] of [...word].entries()) {
        if (char === clicked) indexAnswerLetter.push(i)
      }

      let cards = Array.from(wordEl.querySelectorAll('.card')).filter((_, i) =>
        indexAnswerLetter.includes(i)
      )

      cards.forEach(letter => {
        letter.classList.add('turn')
      })
    }

    const isComplete = [...this.cards].every(card =>
      card.classList.contains('turn')
    )

    if (isComplete) {
      this.modalLoseWin.classList.remove('hidden')
      this.modalTitle.textContent = 'You Win'
      this.modalTitle.setAttribute('stroke-text', 'You Win')
    }
  }

  onClickLetter(e) {
    if (e.target.classList.contains('clicked')) return

    const clickedLetter = e.target.innerText.toLowerCase()
    /*     console.log(clickedLetter, this.answer)
     */ const wordElement =
      this.answerContainers.querySelectorAll('.answer-letters li')

    if (!this.answer.includes(clickedLetter)) this.handleProgressBar()

    wordElement.forEach(word => {
      this.checkMatchLetter(word, clickedLetter)
    })

    e.target.classList.add('clicked')
  }

  data(data) {
    this.categories = data
  }

  resetData() {
    this.letters.forEach(letter =>
      letter.classList.contains('clicked')
        ? letter.classList.remove('clicked')
        : ''
    )

    this.progressBar.value = '80'
  }

  chooseCategory(category) {
    const cat = Object.entries(this.categories)

    this.letters.forEach(l =>
      l.classList.contains('clicked') ? this.resetData() : ''
    )

    /* let answer = [] */
    for (const c of cat) {
      if (c[0].toLowerCase() === category.toLowerCase()) this.answer = c
    }

    this.categoryHeader.textContent = this.answer[0]

    const random = Math.floor(Math.random() * this.answer[1].length)

    this.answer = this.answer[1][random].name.toLowerCase()
    this.generateAnswer()
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
  }
}

class Navigation {
  constructor() {
    this.menuSection = getElement('.main-menu')
    this.instructionsSection = getElement('.instructions')
    this.categoriesSection = getElement('.categories')
    this.gamePlaySection = getElement('.gameplay')
    this.sections = document.querySelectorAll('section')

    this.forwardBtn = document.querySelectorAll('.forward-btn')
    this.modalPaused = getElement('.paused')

    /* EVENTS */
    this.forwardBtn.forEach(btn => {
      btn.addEventListener('click', this.onForward.bind(this))
    })
    this.sections.forEach(btn => {
      btn.addEventListener('click', this.handleSection.bind(this))
    })
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
    const arrSections = ['main-menu', 'instructions', 'categories', 'gameplay']
    if (arrSections.some(sec => e.target.classList.contains(sec))) return

    if (e.target.classList.contains('modal-btn'))
      this.modalPaused.classList.remove('hidden')

    if (e.target.classList.contains('step-back'))
      this.newSection = this.menuSection

    if (e.target.classList.contains('new-category')) {
      this.newSection = this.categoriesSection
      e.target.closest('.modal').classList.add('hidden')
    }

    if (e.target.classList.contains('quit-game')) {
      this.newSection = this.menuSection
      this.categoriesSection.style.transform = 'translateX(100%)'
      e.target.closest('.modal').classList.add('hidden')
    }

    if (e.target.classList.contains('again')) {
      e.target.closest('.modal').classList.add('hidden')
      this.targetInstance.chooseCategory(this.category)
    }

    if (
      e.target.classList.contains('continue') ||
      e.target.classList.contains('paused')
    )
      e.target.closest('.modal').classList.add('hidden')

    this.hideCurrentSection(100)
    this.newSection.dataset.set = 'current'

    this.displayNewSection()
  }

  onForward(e) {
    if (e.target.classList.contains('category')) {
      this.category = e.target.textContent.toLowerCase()
      this.targetInstance.chooseCategory(this.category)
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
    this.targetInstance.data(categories)

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

App.init() /* main.style.height = `${h}px ` */

/* .getBoundingClientRect().height

*/

/*  setViewportHeight() {
    const main = getElement('main')  */
/*     const h = this.currentSec.getBoundingClientRect().height
 */

/*     document.querySelectorAll('section').forEach(s => {
      s.style.height = `  ${h}px`
    }) */
/*   }
} */
