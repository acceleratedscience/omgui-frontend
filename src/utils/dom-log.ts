export default function domLog(msg: string) {
	// Find logger element or create it.
	let log = document.getElementById('dom-log') as HTMLTextAreaElement
	if (!log) {
		log = document.createElement('textarea') as HTMLTextAreaElement
		log.id = 'dom-log'
		log.style.cssText = 'position:fixed;top:10px;left:10px;right:10px;z-index:100;height:100px;background-color:#333;color:#fff;overflow-y:scroll'
		document.body.appendChild(log)
	}

	// Log message
	if (log.value.length) msg = '\n' + msg
	log.value += msg
}
