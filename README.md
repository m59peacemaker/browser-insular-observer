# insularify-observer

Efficiently reuse an observer instance (i.e `IntersectionObserver`) for multiple targets using pretty, simple code.

Takes an Observer (i.e. `IntersectionObserver`) and returns a factory for creating that Observer, but the `observe` and `unobserve` methods of its instances take a listener as the last argument. Listeners are only fired for their corresponding targets.

## Huh?

Something like `IntersectionObserver` is particularly lame to use because you get an array of events that may contain events for multiple targets - all in the same callback at the same time. It tempts you to make a new observer per target and just observe that single target with it, but it is more performant to reuse the observer and observe multiple targets (and so back to jerk-ugly-code). `insularify-observer` is how you reuse the observer and have nice code.

### jerk-ugly-code

```js
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.target === d1) { // wow, not fun!
      console.log('d1')
    } else {
      console.log('d2')
    }
  })
}, { threshold: [ 0 ]})
observer.observe(d1)
observer.observe(d2)
```

### nice-pretty-code

```js
const observer = new insularifyObserver(IntersectionObserver)({ threshold: [ 0 ]})

observer.observe(d1, e => { // I could be friends with this code
  console.log('d1')
})
observer.observe(d2, e => {
  console.log('d2')
})
```

### further reading

https://github.com/WICG/IntersectionObserver/issues/81

[`ResizeObserver`](https://wicg.github.io/ResizeObserver/)
[`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
[`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
[`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)

## API

### `insularifyObserver(ObserverClass)`

Takes an Observer class and returns something you can and should use instead of that Observer. Anything that works with that Observer should still work.

```js
const Observer = insularifyObserver(IntersectionObserver)
const observer = Observer()
```

### Observer

The constructor can be called with the same arguments as usual, but the callback is optional.

```js
const Observer = insularifyObserver(IntersectionObserver)

const observer = Observer()
const observer = Observer(entries => {})
const observer = Observer({ someOption: true })
const observer = Observer(entries => {}, { someOption: true })
```

### `observer.observe(target, [options], [listener])`

`observe` can be called with the same arguments as usual, but with an optional listener as the last argument.

### `observer.unobserve(target, [listener])`

If `target` is passed without a listener, all listeners for the target are removed. If `listener` is passed, only that listener is removed.

**You probably don't need to think about it, but in case you do:**
  - When there are no more listeners registered for the target, the original `observer.unobserve` is called.
  - `unobserve` is added to observers that don't have it, but does nothing more than remove the associated listener(s).
