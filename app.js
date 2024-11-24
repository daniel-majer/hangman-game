function getElement(el) {
  const element = document.querySelector(el)
  if (element) return element
  throw new Error(`Please check "${el}" selector, no such element exists`)
}

class Gameplay {
  constructor() {
    this.answerContainers = getElement('.answer-letters')
    /*     this.words = document.querySelectorAll('.answer-letters li')
     */ this.letters = document.querySelectorAll('.alphabet-letters li')

    this.health = 8
    this.answer
    this.categories

    this.letters.forEach(l => {
      l.addEventListener('click', this.guessLetter.bind(this))
    })
  }

  guessLetter(e) {
    const clickedLetter = e.target.innerText.toLowerCase()
    const answerBox =
      this.answerContainers.querySelectorAll('.answer-letters li')

    answerBox.forEach(li => {
      const word = li.dataset.set

      if (word.includes(clickedLetter)) {
        let indexAnswerLetter = []

        for (const [i, char] of [...word].entries()) {
          if (char === clickedLetter) indexAnswerLetter.push(i)
        }

        let cards = Array.from(li.querySelectorAll('.card')).filter((_, i) =>
          indexAnswerLetter.includes(i)
        )

        cards.forEach(letter => {
          letter.classList.add('turn')
        })
        e.target.style.backgroundColor = '#ffffff50'

        console.log(indexAnswerLetter, cards)
      }
    })

    e.target.style.backgroundColor = '#ffffff50'
  }

  data(data) {
    this.categories = data
  }

  chooseCategory(category) {
    const cat = Object.entries(this.categories)
    this.answer = []
    for (const c of cat) {
      if (c[0].toLocaleLowerCase() === category) this.answer = c
    }

    const random = Math.floor(Math.random() * this.answer[1].length)
    this.answer = this.answer[1][random].name /* 'RetUrn n of returnO' */
    this.letters.forEach(l => (l.style.backgroundColor = '#fff'))
    this.generateAnswer()
  }

  generateAnswer() {
    const words = this.answer.split(' ')
    console.log(words)
    let displayAnswer = words.map(word => {
      return `<li data-set='${word.toLowerCase()}'>${word
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
    this.backBtn = document.querySelectorAll('.back-btn')
    this.modalOverlay = getElement('.modal-overlay')
    this.modalBtn = getElement('.modal')

    /* EVENTS */
    this.forwardBtn.forEach(btn => {
      btn.addEventListener('click', this.onForward.bind(this))
    })
    this.backBtn.forEach(btn => {
      btn.addEventListener('click', this.onBack.bind(this))
    })
    this.modalOverlay.addEventListener('click', this.closeModal.bind(this))
    this.modalBtn.addEventListener('click', this.openModal.bind(this))
  }

  closeModal(e) {
    const targetClasses = ['continue', 'modal-overlay', 'new', 'quit']

    if (targetClasses.some(cls => e.target.classList.contains(cls))) {
      this.modalOverlay.classList.add('hidden')
    }
  }

  openModal() {
    this.modalOverlay.classList.remove('hidden')
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
    let newSection
    this.hideCurrentSection(100)

    if (e.target.classList.contains('back-btn')) newSection = this.menuSection
    if (e.target.classList.contains('new')) newSection = this.categoriesSection
    if (e.target.classList.contains('modal')) return
    if (e.target.classList.contains('quit'))
      this.categoriesSection.style.transform = 'translateX(100%)'

    newSection.dataset.set = 'current'

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
