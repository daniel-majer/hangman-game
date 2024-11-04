class Return {
  constructor() {
    /* SECTIONS */
    this.introSection = document.querySelector('.main-menu')
    this.introContainer = document.querySelector('.intro-container')
    this.instructionsSection = document.querySelector('.instructions')

    /* BUTTONS */
    this.howToPlayBtn = document.querySelector('.instructions-btn')
    this.backToMenuBtn = document.querySelector('.back-btn')

    /* EVENTS */
    this.howToPlayBtn.addEventListener(
      'click',
      this.onForward.bind(this, 'instructions')
    )
    this.backToMenuBtn.addEventListener('click', this.onBack.bind(this))
    document.addEventListener('DOMContentLoaded', this.load.bind(this))
  }

  onBack() {
    this.instructionsSection.classList.toggle('show-instructions')
    this.introSection.classList.toggle('show-menu')
    this.load()
  }

  onForward(page) {
    if (page === 'instructions') {
      this.instructionsSection.classList.toggle('show-instructions')
      this.introSection.classList.toggle('show-menu')
      this.instructionsSection.style.height = ''
      console.log(page)
    }
  }

  load() {
    const height = this.introSection.getBoundingClientRect().height - 1
    this.instructionsSection.style.height = height + 'px'
    console.log(this.a.a)
  }
  
}

const start = new Return()
