#!/usr/bin/env node

// Config stuff
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const ctx = new chalk.Instance({level: 3})
const player = require('play-sound')(opts = {})

const args = {
    voice: false
}

// Parse Arguments
let loc = ''
for (const arg of process.argv.slice(2)) {
    if (arg.slice(0, 2) === '--') {
        args[arg.slice(2)] = true
    }
    else {
        loc = arg
    }
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

// When there is no file provided
if (!loc.length) {
    console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red('Bad Input'))
    console.log(chalk.red('\n\tReason:'), chalk.dim.red(`Please, provide path to testing file\n`))
    say('file')
    process.exit(-1)
}


// Get absolute path to the script
loc = path.join(process.env.PWD, loc)

// Spit error when script does not exist
if (!fs.existsSync(loc)) {
    console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red('Bad Input'))
    console.log(chalk.red('\n\tReason:'), chalk.dim.red(`Filepath does not exist`))
    console.log(chalk.dim.red(`	 ${loc}\n`))
    say('file')
    process.exit(-1)
}

// Run script
let script = fs.readFileSync(loc, 'utf-8')
console.log(ctx.hex('#000').bold.bgYellow('️ START '), chalk.yellow('Opening chamberlock...\n'))
start()

async function start() {

    eval(script)

    // --- API ---

    // Math results to be the same
    function equal(title, value, expected) {
        if (value === expected) {
            console.log(chalk.green(' ✔️'), chalk.dim.green(title))
        }
        else {
            console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red(title))
            console.log(chalk.red('\n\tReason:'), chalk.dim.red(`${value} is not the same as ${expected}\n`))
            say('error')
            process.exit(-1)
        }
    }

    // Math results to not be the same
    function nequal(title, value, expected) {
        if (value !== expected) {
            console.log(chalk.green(' ✔️'), chalk.dim.green(title))
        }
        else {
            console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red(title))
            console.log(chalk.red('\n\tReason:'), chalk.dim.red(`${value} is not the same as ${expected}\n`))
            say('error')
            process.exit(-1)
        }
    }

    // Test result to return true
    function test(title, callback) {
        const value = callback()
        if (value) {
            console.log(chalk.green(' ✔️'), chalk.dim.green(title))
        }
        else {
            console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red(title))
            console.log(chalk.red('\n\tReason:'), chalk.dim.red(`Test didn\'t return true value`))
            console.log(chalk.dim.red(`\tReturned: ${value}\n`))
            say('error')
            process.exit(-1)
        }
    }

    // If codeblock ran well
    function succeed(title, callback) {
        try {
            callback()
            console.log(chalk.green(' ✔️'), chalk.dim.green(title))
        }
        catch (e) {
            console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red(title))
            console.log(chalk.red('\n\tReason:'), chalk.dim.red(`Executed code didn\'t succeed\n`))
            say('error')
            process.exit(-1)
        }
    }

    // If codeblock failed with exception
    function fail(title, callback) {
        try {
            callback()
            console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red(title))
            console.log(chalk.red('\n\tReason:'), chalk.dim.red(`Executed code didn\'t fail\n`))
            say('error')
            process.exit(-1)
        }
        catch (e) {
            console.log(chalk.green(' ✔️'), chalk.dim.green(title))
        }
    }

    // Log information
    function log(value) {
        console.log(chalk.blue(' ℹ'), chalk.dim.blue(value))
    }

    // Prompt a warning
    function warn(value) {
        console.log(chalk.yellow(' ⚠'), chalk.yellow(value))
    }

    // On exit sum up success
    process.on('exit', (code) => {
        if (code === 0) {
            console.log(chalk.green('\nDone 🎉'))
            console.log(chalk.green('All tests passed\n'))
            say('success')
        }
    })

}