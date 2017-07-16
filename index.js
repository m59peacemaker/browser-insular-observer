const noop = require('nop')
const keyMaster = require('key-master')

const insularifyObserver = Observer => {
  function InsularObserver (callback, options) {
    const map = keyMaster(() => [], new WeakMap())

    if (typeof callback !== 'function') {
      options = callback
      callback = noop
    }

    const observer = new Observer(entries => {
      entries.forEach(entry => {
        const listeners = map.get(entry.target)
        listeners.forEach(listener => listener(entry))
      })
    }, options)

    const originalObserve = observer.observe.bind(observer)
    observer.observe = function (target, options, listener) {
      if (typeof options === 'function') {
        listener = options
        options = undefined
      }

      listener && map.get(target).push(listener)
      originalObserve(target, options)
    }

    const originalUnobserve = (observer.unobserve || noop).bind(observer)
    observer.unobserve = (target, listener) => {
      const listeners = map.get(target)

      if (listener) {
        const idx = listeners.indexOf(listener)
        if (idx !== -1) {
          listeners.splice(idx , 1)
        }
      }

      if (!listener || listeners.length === 0) {
        map.delete(target)
        return originalUnobserve(target)
      }
    }

    return observer
  }

  return InsularObserver
}

module.exports = insularifyObserver
