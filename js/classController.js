import { getElement } from './helper.js'
import data from '../public/data/data.json' assert { type: 'json' }

export class Controller {
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

    if (
      e.target.classList.contains('continue') ||
      e.target.classList.contains('paused')
    ) {
      this.targetInstance.startTimer(leftSeconds)
      this.modalPaused.classList.add('hidden')
    }
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
    const { categories } = data

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
