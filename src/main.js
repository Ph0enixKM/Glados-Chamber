#!/usr/bin/env node

// Config stuff
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const ctx = new chalk.Instance({level: 3})
const player = require('play-sound')(opts = {})
const stackTrace = require('stack-trace')

let loc = ''

let backup = {}

let args = {
    voice: false,
    applause: true,
    'error-quit': true,
    production: false,
    silent: false
}

let devMode = false
let cliMode = false


// --- API ---


// Match results to be the same
const equal = create((success, error) => {
    return (...args) => {
        let item = args[0]
        for (const arg of args) {
            if (arg === item) item = arg
            else return error(`Given values don't match: ${args.join(', ')}`)
        }
        success()
    }
})

// Match results to not be the same
const nequal = create((success, error) => {
    return (...args) => {
        let item = null
        if (args[0] === null) item = undefined
        for (const arg of args) {
            if (arg !== item) item = arg
            else return error(`Given values do match: ${args.join(', ')}`)
        }
        success()
    }
})

// // Test result to return true
const test = create((success, error) => {
    return callback => {
        const value = callback()
        if (value)
            success()
        else
            error('Test didn\'t return true value')
    }
})

// If codeblock ran well
const succeed = create((success, error) => {
    return callback => {
        try {
            callback()
            success()
        }
        catch (e) {
            error('Executed code didn\'t succeed')
        }
    }
})

// If codeblock failed with exception
const fail = create((success, error) => {
    return callback => {
        try {
            callback()
            error('Executed code didn\'t fail')
        }
        catch (e) {
            success()
        }
    }
})


// --- CLI ---

if (require.main === module) {
    // Parse Arguments
    for (const arg of process.argv.slice(2)) {
        if (arg.slice(0, 2) === '--') {
            if (arg.slice(2, 5) === 'no-'){
                args[arg.slice(5)] = false
            }
            else {
                args[arg.slice(2)] = true
            }
        }
        else {
            loc = arg
        }
    }
    cliMode = true
    cli()
}

// --- STD ---

// Show error when something is wrong
function error({title, reason, text, code}) {
    console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red(title || 'Something went wrong'))
    if (reason)
        console.log(chalk.red('\n\tReason:'), chalk.dim.red(reason), (text) ? '': '\n')
    if (text)
        console.log(chalk.dim.red(`\t${text}\n`))
    if (code == null) code = 1
    process.exitCode = code
    if (args['error-quit'])
        process.exit(code)
}

// Show success when something succeeded
function success({title}) {
    if (args.silent && !devMode) return null
    console.log(chalk.green(' ✓'), chalk.dim.green(title || 'Done'))
}

// Create a new testing schema
function create(exec) {
    return (title, ...argv) => {
        if (args.production) return null
        const suc = (arg = {}) => success(Object.assign({title}, arg))
        const err = (arg = {}, text) => {
            if (typeof arg === 'string') {
                arg = { reason: arg }
            }
            if (typeof text === 'string') {
                arg.text = text
            }
            error(Object.assign({title}, arg))
        }
        const func = exec(suc, err, title)
        if (devMode) console.log(`\n${trace(true)}`)
        return func(...argv)
    }
}


// --- DEV ---


// Trace location
function trace(style = false) {
    let pathreg = /[\\\/]([^\\\/]+)$/
    let filename = ''
    let line = 0
    if (cliMode) {
        filename = pathreg.exec(loc)[1]
        line = stackTrace.get()[2].getLineNumber()
    }
    else {
        filename = pathreg.exec(stackTrace.get()[2].getFileName())[1]
        line = stackTrace.get()[2].getLineNumber()

    }
    if (style) return chalk.gray(`(${filename}:${line})${(cliMode) ? ' [cli]': ''}`)
    return [filename, line]
}

// Toggle dev mode
function dev(bool) {
    if (bool == null)
        throw 'Bad parameter passed when trying to toggle dev mode (Glados)'
    if (bool) {
        console.log(chalk.gray(`Started Dev Mode ${trace(true)}`))
        devMode = true
    }
    else {
        console.log(chalk.gray(`Stopped Dev Mode ${trace(true)}`))
        devMode = false
    }
}

// Run this in CLI
function cli() {

    // Module resolution
    const req = require
    require = (module) => {
        if (module[0] === '.') {
            return req(path.join(process.env.PWD, module))
        }
        else return req(module)
    }

    // When there is no file provided
    if (!loc.length) {
        error({
            title: 'Bad Input',
            reason: 'Please, provide path to testing file\n',
            code: 2
        })
    }


    // Get absolute path to the script
    loc = path.join(process.env.PWD, loc)

    // Spit error when script does not exist
    if (!fs.existsSync(loc)) {
        error({
            title: 'Bad Input',
            reason: 'Filepath does not exist',
            text: loc,
            code: 2
        })
    }

    // Run script
    let script = fs.readFileSync(loc, 'utf-8')
    console.log(ctx.hex('#000').bold.bgYellow('️ START '), chalk.yellow('Opening chamberlock...\n'))

    if (args.production) {
        alert('Production flag is on - no tests are going to perform\n')
    }

    eval(script)
}

// Play Glados voiceline
function say(type) {
    if (!args.voice) return null
    // Proceed to saying something
    if (type === 'start') {
        const index = Math.floor(Math.random() * 5) + 1
        player.play(path.join(__dirname, `/audio/start/start${index}.wav`), () => {})
    }
    else if (type === 'success') {
        const index = Math.floor(Math.random() * 5) + 1
        player.play(path.join(__dirname, `/audio/success/success${index}.wav`), () => {})
    }
    else if (type === 'error') {
        const index = Math.floor(Math.random() * 5) + 1
        player.play(path.join(__dirname, `/audio/error/error${index}.wav`), () => {})
    }
    else if (type === 'file') {
        player.play(path.join(__dirname, `/audio/error/file.wav`), () => {})
    }
}




// Log information
function log(value) {
    if (args.production || args.silent) return null
    if (devMode) console.log(`\n${trace(true)}`)
    console.log(chalk.blue(' ℹ'), chalk.dim.blue(value))
}

// Prompt a warning
function warn(value) {
    if (args.production || args.silent) return null
    if (devMode) console.log(`\n${trace(true)}`)
    console.log(chalk.yellow(' ⚠'), chalk.yellow(value))
}

// Prompt a warning
function alert(value) {
    if (devMode) console.log(`\n${trace(true)}`)
    console.log(ctx.hex('#000').bold.bgKeyword('orange')('️ ALERT '), ctx.keyword('orange')(value))
}

// Change confguration of glados
function config(obj) {
    let prox = new Proxy(args, {
        get(obj, prop) {
            prop = prop.replace(/([A-Z])/g, (match, group) => {
                return '-' + group.toLowerCase()
            })
            return obj[prop]
        },
        set(obj, prop, value) {
            prop = prop.replace(/([A-Z])/g, (match, group) => {
                return '-' + group.toLowerCase()
            })
            obj[prop] = value
            return true
        }
    })
    Object.assign(prox, obj)
    return prox
}

// On exit sum up success
process.on('exit', (code) => {
    if (code === 0) {
        if (!args.applause) return null
        if (args.silent) return null
        if (args.production) return null
        say('success')
        console.log(chalk.green('\nDone 🎉'))
        console.log(chalk.green('All tests passed\n'))    
    }
    if (code == 1) say('error')
    if (code == 2) say('file')
})

module.exports = {
    equal,
    nequal,
    test,
    succeed,
    fail,
    log,
    warn,
    alert,
    config,
    create,
    dev
}