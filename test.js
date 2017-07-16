const test = require('tape')
const insularify = require('./')
const Div = () => document.createElement('div')

test('returned value (InsularObserver) is constructor like', t => {
  const InsularObserver = insularify(IntersectionObserver)
  try {
    new InsularObserver(() => {})
    t.pass()
  } catch (e) {
    t.fail(e)
  }
  t.end()
})

test('InsularObserver() returns an instance (insularObserver) of the given Observer', t => {
  const InsularObserver = insularify(IntersectionObserver)
  const insularObserver = new InsularObserver(() => {})
  t.true(insularObserver instanceof IntersectionObserver)
  t.end()
})

test('InsularObserver works with the same API as the given Observer', t => {
  const InsularObserver = insularify(IntersectionObserver)

  const d1 = Div()
  const d2 = Div()
  const threshold = [ 0, 0.5, 1 ]

  const insularObserver = new InsularObserver((entries, observer) => {
    t.deepEqual(entries.map(e => e.target), [ d1, d2 ], 'observer callback works and has entries')
    t.equal(insularObserver, observer, 'observer callback receives observer')
  }, { threshold })

  t.deepEqual(insularObserver.thresholds, threshold, 'options argument works')
  insularObserver.observe(d1)
  insularObserver.observe(d2)

  t.end()
})

test('InsularObserver constructor does not require a callback', t => {
  const InsularObserver = insularify(IntersectionObserver)
  try {
    new InsularObserver()
    t.pass()
  } catch (e) {
    t.fail(e)
  }

  t.end()
})

test('InsularObserver constructor uses first argument as options when no callback', t => {
  const InsularObserver = insularify(IntersectionObserver)
  const threshold = [ 0.5, 1 ]
  const insularObserver = new InsularObserver({ threshold })
  t.deepEqual(insularObserver.thresholds, threshold)

  t.end()
})

test('insularObserver.observe(target, listener)', t => {
  const InsularObserver = insularify(IntersectionObserver)
  const insularObserver = new InsularObserver()

  const d1 = Div()
  const d2 = Div()
  insularObserver.observe(d1, e => t.equal(e.target, d1))
  insularObserver.observe(d2, e => t.equal(e.target, d2))

  t.end()
})

test('insularObserver.observe(target, options, listener)', t => {
  const InsularObserver = insularify(MutationObserver)
  const insularObserver = InsularObserver()

  const div = Div()
  insularObserver.observe(div, { attributes: true }, mutation => {
    t.equal(mutation.type, 'attributes')
    t.equal(mutation.attributeName, 'contenteditable')
  })
  div.contenteditable = true

  t.end()
})

test('insularObserver.unobserve(target, listener) removes listener', t => {
  t.plan(1)
  const InsularObserver = insularify(MutationObserver)
  const insularObserver = InsularObserver()

  const div = Div()
  const listener = mutation => {
    t.fail('This should not be called. `unobserve()` did not work.')
  }
  insularObserver.observe(div, { attributes: true }, listener)
  insularObserver.unobserve(div, listener)
  div.contentEditable = true

  setTimeout(() => t.pass('listener was removed'))
})

test('insularObserver.unobserve(target, listener) - other listeners still work', t => {
  t.plan(1)
  const InsularObserver = insularify(IntersectionObserver)
  const insularObserver = InsularObserver()

  const div = Div()
  const listener = e => {
    t.fail('This should not be called. `unobserve()` did not work.')
  }
  insularObserver.observe(div, listener)
  let worked = false
  insularObserver.observe(div, e => worked = true)
  insularObserver.unobserve(div, listener)
  setTimeout(() => {
    worked ? t.pass() : t.fail('other listener not called')
  }, 200)
})

test('insularObserver.unobserve(target) removes all listeners', t => {
  t.plan(1)
  const InsularObserver = insularify(MutationObserver)
  const insularObserver = InsularObserver()

  const div = Div()
  insularObserver.observe(div, { attributes: true }, () => t.fail())
  insularObserver.observe(div, { attributes: true }, () => t.fail())
  insularObserver.observe(div, { attributes: true }, t.fail)
  insularObserver.unobserve(div)
  div.contentEditable = true

  setTimeout(t.pass)
})
