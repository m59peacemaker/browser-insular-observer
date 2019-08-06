import keyMaster = require('key-master')

interface IObserver<T, O> {
  observe(target: T, options?: O): void
  unobserve?(target: T): void
}

interface IObserverEntry<T> {
  target: T
}

type ObserverCallback<T, E extends IObserverEntry<T>> = (entries: E[]) => void

type ObserverClass<T, O, E extends IObserverEntry<T>> = (
  new(callback: ObserverCallback<T, E>, options?: O) => IObserver<T, O>
)

type TargetListener<T, E extends IObserverEntry<T>> = (entry: E) => void

interface IObserveCallback<T, O, E extends IObserverEntry<T>, L extends TargetListener<T, E>> {
  (target: T, listener: L): UnobserveCallback
  (target: T, options: O, listener: L): UnobserveCallback
}
type UnobserveCallback = () => void

const InsularObserver = <T extends object, O, E extends IObserverEntry<T>, L extends TargetListener<T, E>>(
  Observer: ObserverClass<T, O, E>,
  options?: O,
): IObserveCallback<T, O, E, L> => {
  const listeners = keyMaster<T, L[]>(() => [], new WeakMap<T, L[]>())

  const callback = (entries: E[]) => {
    entries.forEach(entry => {
      const targetListeners = listeners.get(entry.target)
      targetListeners.forEach(listener => listener(entry))
    })
  }

  const observer = new Observer(callback, options)

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
