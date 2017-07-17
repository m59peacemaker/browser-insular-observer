const keyMaster = require('key-master')

const InsularObserver = (Observer, options) => {
  const listeners = keyMaster(() => [], new WeakMap())

  const callback = entries => {
    entries.forEach(entry => {
      const targetListeners = listeners.get(entry.target)
      targetListeners.forEach(listener => listener(entry))
    })
  }

  const observer = new Observer(callback, options)

  function observe (target, options, listener) {
    if (typeof options === 'function') {
      listener = options
      options = undefined
    }

    const targetListeners = listeners.get(target)
    targetListeners.push(listener)
    observer.observe(target, options)

    return function unobserve () {
      const idx = targetListeners.indexOf(listener)
      targetListeners.splice(idx , 1)

      if (targetListeners.length === 0) {
        listeners.delete(target)
        return observer.unobserve && observer.unobserve(target)
      }
    }
  }

  return observe
}

module.exports = InsularObserver
