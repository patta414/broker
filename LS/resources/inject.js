console.log("inject")
async function injectRemoteCode(url,followupFunction) {
	  try {
		const followupF = followupFunction || function(){}
		const response = await fetch(url);
		const code = await response.text();

		const script = document.createElement("script");
		script.textContent = code;
		(document.head || document.documentElement).appendChild(script);
		
		script.remove();
		
		followupF()

		console.log("Script erfolgreich injiziert");
	  } catch (err) {
		console.error("Fehler beim Laden des Scripts:", err);
	  }
	}



window.onload = function () {
	console.log('inject - Dokument geladen');
	injectRemoteCode("https://patta414.github.io/broker/functionsOA.js");
	injectRemoteCode("https://patta414.github.io/broker/preload.js");
	
	
}