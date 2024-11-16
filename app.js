function getElement(el) {
  const element = document.querySelector(el)
  if (element) return element
  throw new Error(`Please check "${el}" selector, no such element exists`)
}
const answer = 'Orange Is the New Black'

class Gameplay {
  constructor() {
    this.answerContainer = getElement('.answer-letters')

    this.generateAnswer()
  }

  generateAnswer() {
    const words = answer.split(' ')

    let displayAnswer = words.map(word => {
      return `<li>${word
        .split('')
        .map(w => {
          return `<span>${w.toUpperCase()}</span>`
        })
        .join('')}</li>`
    })
    displayAnswer = displayAnswer.join('')
    this.answerContainer.innerHTML = displayAnswer
  }
}

class Navigation {
  constructor() {
    /* SECTIONS */
    this.menuSection = getElement('.main-menu')
    this.instructionsSection = getElement('.instructions')
    this.categoriesSection = getElement('.categories')
    this.gameplaySection = getElement('.gameplay')

    /* BUTTONS */
    this.forwardBtn = document.querySelectorAll('.forward-btn')
    this.forwardBtn.forEach(btn => {
      btn.addEventListener('click', this.onForward.bind(this))
    })

    this.backBtn = document.querySelectorAll('.back-btn')
    this.backBtn.forEach(btn => {
      btn.addEventListener('click', this.onBack.bind(this))
    })

    this.modalOverlay = getElement('.modal-overlay')
    this.modalOverlay.addEventListener('click', this.closeModal.bind(this))

    this.modalBtn = getElement('.modal')
    this.modalBtn.addEventListener('click', this.openModal.bind(this))
  }

  closeModal(e) {
    if (
      e.target.classList.contains('continue') ||
      e.target.classList.contains('modal-overlay')
    )
      this.modalOverlay.classList.add('hidden')
  }

  openModal(e) {
    this.categoriesSection.style.transform = 'translateX(100%)'

    if (e.target.classList.contains('modal'))
      this.modalOverlay.classList.remove('hidden')
  }

  setPosition(numb) {
    this.currentSec.style.transform = `translateX(${numb}%)`
    this.currentSec.dataset.set = ''
  }

  setCurrent(nextSec) {
    nextSec.dataset.set = 'current'
    this.setSection()
  }

  onBack(e) {
    this.setPosition(100)

    if (e.target.classList.contains('modal')) return

    const nextSec = e.target.classList.contains('back-btn') && this.menuSection
    this.setCurrent(nextSec)
  }

  onForward(e) {
    this.setPosition(-100)

    const nextSec =
      (e.target.classList.contains('play') && this.categoriesSection) ||
      (e.target.classList.contains('how-to-play') &&
        this.instructionsSection) ||
      (e.target.classList.contains('category') && this.gameplaySection)

    this.setCurrent(nextSec)
    /*   this.currentSec.style.height = ''
    this.setViewportHeight() */
  }

  setSection() {
    const sections = document.querySelectorAll('section')
    this.currentSec = Array.from(sections).find(
      sec => sec.dataset.set === 'current'
    )
    this.currentSec.style.transform = 'translateX(0)'
  }

  async createCategories() {
    const response = await fetch('./data/data.json')
    if (!response.ok) throw new Error('Network response was not ok')

    const { categories } = await response.json()

    const keys = Object.keys(categories)

    keys.forEach(category => {
      const html = `<li class='category'>${category.toUpperCase()}</li>`
      const container = getElement('.categories-container')
      container.insertAdjacentHTML('afterbegin', html)

      const categoriesDom = document.querySelectorAll('.category')
      categoriesDom.forEach(category => {
        category.addEventListener('click', this.onForward.bind(this))
      })
    })
  }

  setViewportHeight() {
    const main = getElement('main') /* .getBoundingClientRect().height */
    const h = this.currentSec.getBoundingClientRect().height
    /* main.style.height = `${h}px ` */

    /*     document.querySelectorAll('section').forEach(s => {
      s.style.height = `  ${h}px`
    }) */
  }
}

class App {
  static init() {
    const start = new Navigation()
    const gameplay = new Gameplay()

    start.setSection()
    start.setViewportHeight()
    start.createCategories()
  }
}

App.init()
