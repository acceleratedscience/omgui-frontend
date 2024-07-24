/**
 * This script is run after the build process.
 * If the sibling `openad` repository exists,
 * it moves the build folders `gui-build` and
 * `gui-build-proxy` there.
 */

import shell from 'shelljs'
import chalk from 'chalk'

// prettier-ignore
const dirStructure1 = [
	'/my-repos              <-- Parent folder',
	'  /openad-gui          <-- Current repository',
	'    /gui-build         <-- Build output folder #1',
	'    /gui-build-proxy   <-- Build output folder #2',
	"  /openad              <-- Main OpenAD repo",
	"    /openad            <-- Application folder",
	"      /gui-build       <-- Final destination",
	"      /gui-build-proxy <-- Final destination",
]

const dirStructure2 = [
	'/openad                <-- Main OpenAD repo',
	'  /openad              <-- Application folder',
	'    /gui-build         <-- Build folders should be placed here',
	'    /gui-build-proxy   <-- Build folders should be placed here',
]

// Check if destination exists.
if (shell.test('-d', '../openad')) {
	// Remove previous build folders if they exist.
	if (shell.test('-d', '../openad/openad/gui-build')) {
		shell.rm('-rf', '../openad/openad/gui-build')
	}
	if (shell.test('-d', '../openad/openad/gui-build-proxy')) {
		shell.rm('-rf', '../openad/openad/gui-build-proxy')
	}
	// Move new build folders.
	shell.mv('gui-build', '../openad/openad/gui-build')
	shell.mv('gui-build-proxy', '../openad/openad/gui-build-proxy')

	// Construct output SUCCESS message.
	const sep = '******************************************************************'
	const msg = ["Your build's output folders 'gui-build' & 'gui-build-dist' have", "been moved to the sibling 'openad' repository."]
	const output = [chalk.yellow(sep), chalk.green(msg.join('\n')), chalk.gray(dirStructure1.join('\n')), chalk.yellow(sep)].join('\n\n')

	console.log(output)
} else {
	// Construct output FAIL message.
	const sep = '*********************************************************************'
	const msg1 = [
		chalk.red('WARNING') + " - No 'openad' sibling repo found, your build folders have not",
		"been moved. You can manually move the 'gui-build' & 'gui-build-dist'",
		"folders to the main OpenAD repo, placing them in the 'openad' directory.",
	]
	const msg2 = [
		'If you wish your build folders to be moved automatically to the main',
		'OpenAD repo, please make sure to place them in the same directory and',
		"name them 'openad' and 'openad-gui' per the instructions below.",
	]
	let output = [
		chalk.yellow(sep),
		chalk.yellow(msg1.join('\n')),
		chalk.gray(dirStructure2.join('\n')),
		chalk.white(msg2.join('\n')),
		chalk.gray(dirStructure1.join('\n')),
		chalk.yellow(sep),
	].join('\n\n')

	console.log(output)
}
