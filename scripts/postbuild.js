// const shell = require('shelljs')
// const chalk = require('chalk')
import shell from 'shelljs'
import chalk from 'chalk'

// prettier-ignore
const dirStructure = [
	'/my-repos        <-- Parent folder',
	'  /openad-gui    <-- This repository',
	'    /dist        <-- Build output folder',
	"  /openad        <-- Main repo named 'openad'",
	"    /openad-gui  <-- 'dist' was renamed and moved here",
]

// Rename the `dist` folder to `openad-gui` and move it to the sibling `openad` repository
if (shell.test('-d', '../openad')) {
	if (shell.test('-d', '../openad/openad-gui')) {
		const result = shell.rm('-rf', '../openad/openad-gui')
		console.log(33, result)
	}
	const result1 = shell.mv('dist', '../openad/openad-gui')
	console.log(34, result1)

	const sep = '******************************************************************'
	const msg = [
		"Your build's output folder 'dist' has been renamed to 'openad-gui'",
		"and was moved to the sibling 'openad' repository.",
	]
	const output = [
		chalk.yellow(sep),
		chalk.green(msg.join('\n')),
		chalk.gray(dirStructure.join('\n')),
		chalk.yellow(sep),
	].join('\n\n')

	console.log(output)
} else {
	const sep = '*********************************************************************'
	const msg = [
		"No 'openad' sibling repo not found, your dist folder was not moved.",
		'If you wish your dist folder to be copied automatically to the main',
		'OpenAD repo, please make sure it is available per instructions below.',
	]
	let output = [
		chalk.yellow(sep),
		chalk.red(msg.join('\n')),
		chalk.gray(dirStructure.join('\n').replace(/was renamed/, 'would be renamed')),
		chalk.yellow(sep),
	].join('\n\n')

	// output = output
	// 	.split('\n')
	// 	.map((line, i) => {
	// 		const prefix =
	// 			i === 0 || i == output.split('\n').length - 1
	// 				? chalk.yellow('**')
	// 				: chalk.yellow('  ')
	// 		return prefix + line
	// 	})
	// 	.join('\n')

	console.log(output)
}
