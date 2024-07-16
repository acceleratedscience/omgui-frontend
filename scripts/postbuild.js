/**
 * This script is run after the build process.
 * If the sibling `openad` repository exists,
 * it renames the `dist` folder to `openad-gui` and
 * moves it to the sibling `openad` repository.
 */

import shell from 'shelljs'
import chalk from 'chalk'

// prettier-ignore
const dirStructure1 = [
	'/my-repos         <-- Parent folder',
	'  /openad-gui     <-- Current repository',
	'    /dist         <-- Build output folder',
	"  /openad         <-- Main OpenAD repo",
	"    /openad       <-- Application folder (pip installable)",
	"      /gui-build  <-- 'dist' was renamed and moved here",
]

const dirStructure2 = [
	'/openad           <-- Main OpenAD repo',
	'  /openad         <-- Application folder (pip installable)',
	"    /gui-build    <-- 'dist' should be renamed 'gui-build' and placed here",
]

// Check if destination exists.
if (shell.test('-d', '../openad')) {
	if (shell.test('-d', '../openad/openad/gui-build')) {
		// Remove previous build if it exists.
		shell.rm('-rf', '../openad/openad/gui-build')
	}
	// Move new build.
	shell.mv('dist', '../openad/openad/gui-build')

	// Construct output SUCCESS message.
	const sep = '******************************************************************'
	const msg = ["Your build's output folder 'dist' has been renamed to 'gui-build'", "and was moved to the sibling 'openad' repository."]
	const output = [chalk.yellow(sep), chalk.green(msg.join('\n')), chalk.gray(dirStructure1.join('\n')), chalk.yellow(sep)].join('\n\n')

	console.log(output)
} else {
	// Construct output FAIL message.
	const sep = '*********************************************************************'
	const msg1 = [
		"No 'openad' sibling repo found, your dist folder was not moved.",
		"You can manually move the 'dist' folder to the main OpenAD repo,",
		"by renaming it to 'gui-build' and placing it in the 'openad' folder.",
	]
	const msg2 = [
		'If you wish your dist folder to be copied automatically to the main',
		'OpenAD repo, please make sure it is available per instructions below.',
	]
	let output = [
		chalk.yellow(sep),
		chalk.red(msg1.join('\n')),
		chalk.gray(dirStructure2.join('\n')),
		chalk.white(msg2.join('\n')),
		chalk.gray(dirStructure1.join('\n').replace(/was renamed/, 'would be renamed')),
		chalk.yellow(sep),
	].join('\n\n')

	console.log(output)
}
