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
    this.modalLose = getElement('.lose')

    this.health = 8

    this.letters.forEach(l => {
      l.addEventListener('click', this.onClickLetter.bind(this))
    })
  }

  handleProgressBar(clicked) {
    if (this.progressBar.value <= 0) this.modalLose.classList.remove('hidden')
    if (!this.answer.includes(clicked)) this.progressBar.value -= 10
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
  }

  onClickLetter(e) {
    if (e.target.classList.contains('clicked')) return

    const clickedLetter = e.target.innerText.toLowerCase()
    const wordElement =
      this.answerContainers.querySelectorAll('.answer-letters li')

    this.handleProgressBar(clickedLetter)

    wordElement.forEach(word => {
      this.checkMatchLetter(word, clickedLetter)
    })

    e.target.classList.add('clicked')
  }

  data(data) {
    this.categories = data
  }

  chooseCategory(category) {
    const cat = Object.entries(this.categories)
    this.letters.forEach(letter =>
      letter.classList.contains('clicked')
        ? letter.classList.remove('clicked')
        : ''
    )

    let answer = []
    for (const c of cat) {
      if (c[0].toLowerCase() === category.toLowerCase()) answer = c
    }

    const random = Math.floor(Math.random() * answer[1].length)

    answer = answer[1][random].name.toLowerCase()
    this.answer = answer
    this.generateAnswer(answer)
  }

  generateAnswer(answer) {
    const words = answer.split(' ')
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
  }
}

class Navigation {
  constructor() {
    /* SECTIONS */
    this.menuSection = getElement('.main-menu')
    this.instructionsSection = getElement('.instructions')
    this.categoriesSection = getElement('.categories')
    this.gamePlaySection = getElement('.gameplay')

    /* BUTTONS */
    this.forwardBtn = document.querySelectorAll('.forward-btn')
    this.moveBack = document.querySelectorAll('.back-btn')
    this.openModalBtn = getElement('.modal-btn')
    this.modalPaused = getElement('.paused')
    this.modalLose = getElement('.lose')

    /* EVENTS */
    this.forwardBtn.forEach(btn => {
      btn.addEventListener('click', this.onForward.bind(this))
    })
    this.moveBack.forEach(btn => {
      btn.addEventListener('click', this.onBack.bind(this))
    })
    /*   this.modalPaused.addEventListener('click', this.closeModal.bind(this))
    this.modalLose.addEventListener('click', this.closeModal.bind(this)) */
    this.openModalBtn.addEventListener('click', this.openModal.bind(this))

    /*     this.modal = document.querySelectorAll('.modal')
    this.modal.forEach(mod => {
      mod.addEventListener('click', this.handleModal.bind(this))
    }) */
  }

  /*   closeModal(e) {
    const targetClasses = ['continue', 'paused', 'lose', 'new', 'quit']

    if (targetClasses.some(cls => e.target.classList.contains(cls))) {
      this.modalPaused.classList.add('hidden')
    }
  } */

  /*   handleModal(e) {
    if (e.target.classList.contains('new')) {
      this.newSection = this.categoriesSection
      e.currentTarget.classList.add('hidden')

      this.newSection.dataset.set = 'current'
      this.displayNewSection()
    }

    console.log('hey')
  } */

  openModal() {
    this.modalPaused.classList.remove('hidden')
  }

  hideCurrentSection(numb) {
    this.currentSec.style.transform = `translateX(${numb}%)`
    this.currentSec.dataset.set = ''
  }

  displayNewSection() {
    const sections = document.querySelectorAll('section')

    this.currentSec = Array.from(sections).find(
      sec => sec.dataset.set === 'current'
    )
    this.currentSec.style.transform = 'translateX(0)'
  }

  onBack(e) {
    this.hideCurrentSection(100)

    if (e.target.classList.contains('move-back'))
      this.newSection = this.menuSection

    if (e.target.classList.contains('new')) {
      this.newSection = this.categoriesSection
      e.target.closest('.modal').classList.add('hidden')
    }

    if (e.target.classList.contains('quit')) {
      this.categoriesSection.style.transform = 'translateX(100%)'
      this.modalPaused.classList.add('hidden')
    }

    /*    if (e.target.classList.contains('modal')) return
     */

    this.newSection.dataset.set = 'current'

    this.displayNewSection()
  }

  onForward(e) {
    if (e.target.classList.contains('category')) {
      this.targetInstance.chooseCategory(e.target.textContent.toLowerCase())
    }

    this.hideCurrentSection(-100)

    const newSection =
      (e.target.classList.contains('play') && this.categoriesSection) ||
      (e.target.classList.contains('how-to-play') &&
        this.instructionsSection) ||
      (e.target.classList.contains('category') && this.gamePlaySection)

    newSection.dataset.set = 'current'
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
