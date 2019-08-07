import keyMaster = require('key-master')

interface Observer<T, O> {
  observe(target: T, options?: O): void
  unobserve?(target: T): void
}

interface ObserverEntry<T> {
  target: T
}

type ObserverCallback<T, E extends ObserverEntry<T>> = (entries: E[]) => void

type ObserverClass<T, O, E extends ObserverEntry<T>> = (
  new(callback: ObserverCallback<T, E>, options?: O) => Observer<T, O>
)

type TargetListener<T, E extends ObserverEntry<T>> = (entry: E) => void

interface ObserveCallback<T, O, E extends ObserverEntry<T>, L extends TargetListener<T, E>> {
  (target: T, listener: L): UnobserveCallback
  (target: T, options: O, listener: L): UnobserveCallback
}
type UnobserveCallback = () => void

const InsularObserver = <T extends object, O, E extends ObserverEntry<T>, L extends TargetListener<T, E>>(
  ObserverConstructor: ObserverClass<T, O, E>,
  options?: O,
): ObserveCallback<T, O, E, L> => {
  const listeners = keyMaster<T, L[]>(() => [], new WeakMap<T, L[]>())

  const callback = (entries: E[]) => {
    entries.forEach(entry => {
      const targetListeners = listeners.get(entry.target)
      targetListeners.forEach(listener => listener(entry))
    })
  }

  const observer = new ObserverConstructor(callback, options)

  function observe (target: T, observeOptions: undefined | O | L, listener?: L): UnobserveCallback {
    if (typeof observeOptions === 'function') {
      listener = observeOptions as L
      observeOptions = undefined
    }

    const targetListeners = listeners.get(target)
    targetListeners.push(listener as L)
    observer.observe(target, observeOptions)

    return function unobserve (): void {
      const idx = targetListeners.indexOf(listener as L)
      targetListeners.splice(idx , 1)

      if (targetListeners.length === 0) {
        listeners.delete(target)
        return observer.unobserve && observer.unobserve(target)
      }
    }
  }

  return observe
}

export = InsularObserver
