#!/usr/bin/env node

// Config stuff
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const ctx = new chalk.Instance({level: 3})

// When there is no file provided
if (!process.argv[2]) {
    console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red('Bad Input'))
    console.log(chalk.red('\n\tReason:'), chalk.dim.red(`Please, provide path to testing file\n`))
    process.exit(-1)
}

// Get absolute path to the script
const loc = path.join(process.env.PWD, process.argv[2])

// Spit error when script does not exist
if (!fs.existsSync(loc)) {
    console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red('Bad Input'))
    console.log(chalk.red('\n\tReason:'), chalk.dim.red(`Filepath does not exist`))
    console.log(chalk.dim.red(`	 ${loc}\n`))
    process.exit(-1)
}

// Run script
let script = fs.readFileSync(loc, 'utf-8')
console.log(ctx.hex('#000').bold.bgYellow('️ START '), chalk.yellow('Opening chamberlock...\n'))
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
        process.exit(-1)
    }
}

// If codeblock failed with exception
function fail(title, callback) {
    try {
        callback()
        console.log(ctx.hex('#000').bold.bgRed('️ ERROR '), chalk.dim.red(title))
        console.log(chalk.red('\n\tReason:'), chalk.dim.red(`Executed code didn\'t fail\n`))
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
    }
})
