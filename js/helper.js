export function getElement(el) {
  const element = document.querySelector(el)
  if (element) return element
  throw new Error(`Please check "${el}" selector, no such element exists`)
}
