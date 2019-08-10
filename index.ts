import keyMaster = require('key-master')

interface Observer<Target, Options> {
  observe(target: Target, options?: Options): void
  unobserve?(target: Target): void
}

interface ObserverEntry<Target> {
  target: Target
}

type ObserverCallback<Target, Entry extends ObserverEntry<Target>> = (entries: Entry[]) => void

type ObserverClass<Target, Options, Entry extends ObserverEntry<Target>> = (
  new(callback: ObserverCallback<Target, Entry>, options?: Options) => Observer<Target, Options>
)

type TargetListener<Target, Entry extends ObserverEntry<Target>> = (entry: Entry) => void

interface ObserveCallback<
  Target,
  Options,
  Entry extends ObserverEntry<Target>,
  Listener extends TargetListener<Target, Entry>,
> {
  (target: Target, listener: Listener): UnobserveCallback
  (target: Target, options: Options, listener: Listener): UnobserveCallback
}
type UnobserveCallback = () => void

const InsularObserver = <
  Target extends object,
  Options,
  Entry extends ObserverEntry<Target>,
  Listener extends TargetListener<Target, Entry>,
>(
  ObserverConstructor: ObserverClass<Target, Options, Entry>,
  options?: Options,
): ObserveCallback<Target, Options, Entry, Listener> => {
  const listeners = keyMaster<Target, Listener[]>(() => [], new WeakMap<Target, Listener[]>())

  const callback = (entries: Entry[]) => {
    entries.forEach(entry => {
      const targetListeners = listeners.get(entry.target)
      targetListeners.forEach(listener => listener(entry))
    })
  }

  const observer = new ObserverConstructor(callback, options)

  function observe (
    target: Target,
    observeOptions: undefined | Options | Listener,
    listener?: Listener,
  ): UnobserveCallback {
    if (typeof observeOptions === 'function') {
      listener = observeOptions as Listener
      observeOptions = undefined
    }

    const targetListeners = listeners.get(target)
    targetListeners.push(listener as Listener)
    observer.observe(target, observeOptions)

    return function unobserve (): void {
      const idx = targetListeners.indexOf(listener as Listener)
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
