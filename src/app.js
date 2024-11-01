class Return {
  constructor() {
    this.introSection = document.querySelector('.intro')
    this.introContainer = document.querySelector('.intro-container')
    this.instructionsSection = document.querySelector('.instructions')

    this.showBtn = document.querySelector('.instructions-btn')
    this.backBtn = document.querySelector('.back-btn')

    this.showBtn.addEventListener('click', this.showInstructions.bind(this))
    this.backBtn.addEventListener('click', this.showInstructions.bind(this))
  }

  showInstructions() {
    this.instructionsSection.classList.toggle('show-instructions')
    this.introSection.classList.toggle('show-intro')
  }
}

const start = new Return()
