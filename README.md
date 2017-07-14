[npm]: https://img.shields.io/npm/v/chai-enzyme-axe.svg
[npm-url]: https://npmjs.com/package/chai-enzyme-axe

[![npm][npm]][npm-url]

# chai-enzyme-axe
A [chai]() assertion that runs [axe-core]() on an [enzyme]() object to test
for a11y violations.

## Installation

```sh
npm install chai-enzyme-axe
```

## Usage

```js
import {mount, render, shallow} from 'enzyme'

class Fixture extends React.Component {
  render () {
    return (
      <div>
        <label for="name">Name</label>
        <input type="text" id="name" />
      </div>
    )
  }
}

const wrapper = mount(<Fixture />)

wrapper.should.be.accessible(done)
```

## License

[MIT](LICENSE)
