/**
 * This script is run after the build process.
 * If the sibling `openad` repository exists,
 * it renames the `dist` folder to `openad-gui` and
 * moves it to the sibling `openad` repository.
 */

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

// Check if destination exists.
if (shell.test('-d', '../openad')) {
	if (shell.test('-d', '../openad/openad-gui')) {
		// Remove previous build if it exists.
		shell.rm('-rf', '../openad/openad-gui')
	}
	// Move new build.
	shell.mv('dist', '../openad/openad-gui')

	// Construct output SUCCESS message.
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
	// Construct output FAIL message.
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

	console.log(output)
}
