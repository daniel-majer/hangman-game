function getElement(el) {
  const element = document.querySelector(el)
  if (element) return element
  throw new Error(`Please check "${el}" selector, no such element exists`)
}

class Navigation {
  constructor() {
    /* SECTIONS */
    this.menuSection = getElement('.main-menu')
    this.instructionsSection = getElement('.instructions')
    this.categoriesSection = getElement('.categories')
    this.allSections = document.querySelectorAll('.page')
    this.pickCategory = getElement('.categories-container')

    /* BUTTONS */
    this.playBtn = getElement('.categories-btn')
    this.instructionsBtn = getElement('.instructions-btn')
    this.backBtn = document.querySelectorAll('.menu-btn')

    /* OTHERS */
    this.current = 'current'

    /* EVENTS */
    this.createCategories()

    /* FORWARD */
    this.instructionsBtn.addEventListener('click', this.onForward.bind(this))
    this.playBtn.addEventListener('click', this.onForward.bind(this))
    /* BACK */
    this.backBtn.forEach(btn => {
      btn.addEventListener('click', this.onBack.bind(this))
    })
    /* LOAD */
    /*     document.addEventListener('DOMContentLoaded', this.onLoad.bind(this))
     */
  }

  async createCategories() {
    const response = await fetch('./data/data.json')
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()

    const keys = Object.keys(data.categories)
    let displayCategories = keys.map(category => {
      return `<li>${category}</li>`
    })
    displayCategories = displayCategories.join('')
    this.pickCategory.innerHTML = displayCategories
  }

  nextStep(side, func) {
    if (this.btn) {
      this[`${this.btn}Section`].dataset.set = this.current
      this[`${this.btn}Section`].classList[func](`swipe-${side}`)
    }
  }

  findCurrentSection(e) {
    this.btn = e.target?.classList[0]?.split('-')[0]

    let sections = document.querySelectorAll('section')
    sections = [...sections]

    this.currentSection = sections.find(
      section => section.dataset.set === 'current'
    )
    this.currentSection.dataset.set = ''
    /*     this.currentSection.style.height = ''
     */
  }

  onBack(e) {
    this.findCurrentSection(e)
    this.currentSection.classList.remove('swipe-right')
    this.nextStep('left', 'remove')
  }

  onForward(e) {
    this.findCurrentSection(e)
    this.currentSection.classList.add('swipe-left')
    this.nextStep('right', 'add')
  }

  /*   onLoad() {
    const height = this.menuSection.getBoundingClientRect().height - 1
    this.allSections.forEach(function (section) {
      section.style.height = height + 'px'
    })
  } */
}

class App {
  static init() {
    const start = new Navigation()
  }
}

App.init()
