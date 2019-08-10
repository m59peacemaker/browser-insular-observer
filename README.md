# insular-observer

![TypeScript supported](https://img.shields.io/npm/types/insular-observer.svg)

Efficiently use an Observer (i.e. IntersectionObserver) without the ugly observer callback. `insular-observer` gives you a simple, per-target `observe/unobserve` API that uses the same observer instance internally.

## Huh?

Something like `IntersectionObserver` is particularly lame to use because you get an array of events that may contain events for multiple targets - all in the same callback at the same time. It tempts you to make a new observer per target and just observe that single target with it, but it is more performant to reuse the observer and observe multiple targets (and so back to jerk-ugly-code). You can use `insular-observer` to solve these issues.

## install

```sh
$ npm install insular-observer
```

## API

### `InsularObserver(Observer, [options])`

Pass the Observer class and constructor options (if applicable), get back a nice `observe` function.

```js
const observeIntersection = InsularObserver(IntersectionObserver, { threshold: [ 0 ] })

observeIntersection(fooTarget, entry => {
  assert(fooTarget === entry.target) // true
})
observeIntersection(barTarget, entry => {
  assert(barTarget === entry.target) // true
})
```

### `observe(target, [options], listener)`

Takes a target and a listener that only pertains to that target. Returns an `unobserve` function you can call to stop listening.

The optional `options` argument is to support Observers that take options in their `observe` call (i.e. MutationObserver).

```js
const observeIntersection = InsularObserver(IntersectionObserver, { threshold: [ 0 ] })

const unobserve = observe(someTarget, entry => { // do stuff })
```

### `unobserve()`

Returned from `observe(target, listener)`. Stops listening to that listener.

```js
const observeIntersection = InsularObserver(IntersectionObserver, { threshold: [ 0 ] })
const unobserve = observe(someTarget, entry => {
  // do stuff

  unobserve() // stop listening
})
```
