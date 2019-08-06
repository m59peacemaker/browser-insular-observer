import insularObserverFactory = require('.')

const observe = insularObserverFactory(IntersectionObserver, {threshold: [0, 0.5]})
type EntryCallback = (entry: IntersectionObserverEntry) => void
const observeTypeCheck1: (target: Element, callback: EntryCallback) => void = observe
const observeTypeCheck2: (target: Element, options: IntersectionObserverInit, callback: EntryCallback) => void = observe
const unobserve = observe(document.body, (entry: IntersectionObserverEntry) => void 0)
const unobserveTypeCheck: () => void = unobserve

const observe2 = insularObserverFactory(IntersectionObserver)
observe2(document.body, {rootMargin: '15px'}, () => void 0)
