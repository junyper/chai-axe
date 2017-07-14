import { ReactWrapper } from 'enzyme'

ReactWrapper.prototype.getA11yViolations = function (options, callback) {
  a11yCheck(this.getDOMNode(), options, callback)
}

const Assertion = global.chai.Assertion
global.chai.use((chai, utils) => {
  utils.addMethod(Assertion.prototype, 'accessible', function (done, options = {}) {
    const obj = utils.flag(this, 'object')

    obj.getA11yViolations(options, (result) => {
      try {
        new Assertion(result.violations.length).to.equal(0)
        done()
      } catch (e) {
        done(result.error)
      }
    })
  })
})

function a11yCheck (node, options = {}, done) {
  const exclude = options.exclude || []
  const ignores = options.ignores || []
  const axeConfig = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'section508', 'best-practice']
    }
  }

  axe.a11yCheck({ include: [node], exclude }, axeConfig, (result) => {
    const violations = result.violations.filter((violation) => {
      return (ignores.indexOf(violation.id) < 0)
    })

    violations.forEach((violation) => {
      console.groupCollapsed(`[${violation.id}] ${violation.help}`)
      violation.nodes.forEach((node) => {
        const el = document.querySelector(node.target.toString())
        if (!el) {
          console.log(node.target.toString())
        } else {
          console.log(el)
        }
      })
      console.groupEnd()
    })

    done({
      violations,
      error: violations.length > 0 ? new Error(formatError(violations)) : null
    })
  })
}

function formatError (violations) {
  return violations.map((violation) => {
    return [
      `[${violation.id}] ${violation.help}`,
      violation.nodes.map((node) => {
        return node.target.toString()
      }).join('\n'),
      violation.description,
      `${violation.helpUrl}\n`
    ].join('\n')
  })
}
