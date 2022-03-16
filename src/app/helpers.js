export function getCssVariable(cssVariableName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${cssVariableName}`);
}

export function htmlToDFragment(html) {
  return document.createRange().createContextualFragment(html);
}

export function htmlToElement(html) {
  return document.createRange().createContextualFragment(html).firstElementChild;
}

export function addClassToElement(element, css_class) {
  element.classList.add(css_class);
}

export function removeClassFromElement(element, css_class) {
  element.classList.remove(css_class);
}

export function random(min, max) {
  const randomNumberUpperLimit = 1;

  return Math.floor(Math.random() * (max - min + randomNumberUpperLimit) + min);
}

