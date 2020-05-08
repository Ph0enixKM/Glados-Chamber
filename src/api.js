const glad = require('./main')

glad.config({
    silent: true,
    applause: false
})

glad.dev(1)

glad.equal('Equal', 1, 1, 1, 1, 1, 1)
glad.nequal('Not Equal', [], 0, false)

glad.dev(0)

glad.test('Test', () => true)
glad.succeed('Test', () => {})
glad.fail('Test', () => {throw ''})


