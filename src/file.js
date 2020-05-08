equal('Equal this', 1, 1, 1)
nequal('Nequal that', 1, 2, 3)
fail('Fail here', () => {throw ''})
succeed('Succeed there', () => {})

config({
    errorQuit: false
})

const gt = create((s, e, t) => {
    return (n1, n2) => {
        if (n1 > n2) s()
        else e(`Number ${n1} is smaller than ${n2}`)
    }
})

gt('Age', 12, 20)
gt('Age', 20, 12)

dev(false)
console.log('\n')

let variable = false


log(`Value returned: ${variable}`)
warn('Remember to run ./script.sh before testing!')
alert('This alert will show up no matter what (even with --production)')

console.log('\n')
dev(false)
