import { Gameplay } from './classGameplay.js'
import { Controller } from './classController.js'

class App {
  static init() {
    const start = new Controller()
    const gameplay = new Gameplay()

    start.displayNewSection()
    start.createCategories()
    start.setTargetInstance(gameplay)
  }
}

App.init()
