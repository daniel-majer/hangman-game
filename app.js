function getElement(el) {
  const element = document.querySelector(el)
  if (element) return element
  throw new Error(`Please check "${el}" selector, no such element exists`)
}

class Gameplay {
  constructor() {
    this.answerContainer = getElement('.answer-letters')
    this.points = {
      health: 8,
    }
  }

  randomQuestion(count) {
    return Math.floor(Math.random() * count)
  }

  data(data) {
    this.data = data
    console.log(this.data)
  }

  chooseQuestion(category) {
    const cat = Object.entries(this.data)
    let quest = []
    for (const c of cat) {
      if (c[0].toLocaleLowerCase() === category) quest = c
    }

    const randomQuest = this.randomQuestion(quest[1].length)
    this.generateAnswer(quest[1][randomQuest].name)
  }

  generateAnswer(answer) {
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
      this.targetInstance.chooseQuestion(e.target.textContent.toLowerCase())
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

/* .getBoundingClientRect().height */

/*  setViewportHeight() {
    const main = getElement('main')  */
/*     const h = this.currentSec.getBoundingClientRect().height
 */

/*     document.querySelectorAll('section').forEach(s => {
      s.style.height = `  ${h}px`
    }) */
/*   }
} */
