<div align="center">
    <img src="arts/glados.png" width="200">
</div>

# Glados Chamber

It's a tiny testing library that gives you the flexibility to quickly perform needed tests of your package, framework, library or app. This library is inspierd by jest which came out to be too overengineered for my needs. When I think of performing tests - I instantly imagine Glados. Hence the name

<div align="center">
 <img src="arts/ss1.png">
</div>

## Installation 🔧

```bash
npm install glados-chamber -g
```

## Usage ⚙️

```bash
glados path/to/file.js
```

**file.js**

```js
// If returned true - test passed
test('This is a title', () => {
    return 15 > 5
})

// Match values
equal('Matching...', typeof null, 'object')

// Not equal
nequal('These should be different', [], 0)

// Anticipate failure
fail('It must fail...', () => throw 'Failed!')

// Anticipate success
succeed('It must succeed...', () => 15)
```

Besides of the testing functions there are available helper functions that can help you in testing process.

```js
log(`Value returned: ${variable}`)
warn('Remember to run ./script.sh before testing!')
```

Here is some sample error case:

<div align="center">
 <img src="arts/ss.png">
</div>


