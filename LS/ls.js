(function(){
	
	
	console.log("Hello world");
	const baseUrl = chrome.runtime.getURL("resources/");
		
	function loadScriptSequential(file) {
	  return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = baseUrl + file;
		script.type = "text/javascript";
		script.onload = () => {
		  console.log(`Geladen: ${file}`);
		  resolve();
		};
		script.onerror = () => {
		  console.error(`Fehler bei: ${file}`);
		  reject(new Error(`Fehler beim Laden von ${file}`));
		};
		(document.head || document.documentElement).appendChild(script);
	  });
	}
	
	loadScriptSequential("inject.js")
	

	
	async function injectRemoteCode(url) {
	  try {
		const response = await fetch(url);
		const code = await response.text();

		const script = document.createElement("script");
		script.textContent = code;
		(document.head || document.documentElement).appendChild(script);
		script.remove();

		console.log("Script erfolgreich injiziert");
	  } catch (err) {
		console.error("Fehler beim Laden des Scripts:", err);
	  }
	}

	//injectRemoteCode("https://patta414.github.io/broker/functionsOA.js");
	//injectRemoteCode("https://patta414.github.io/broker/preload.js");
	
	document.addEventListener("DOMContentLoaded", function() {
		console.log("Das DOM wurde vollständig geladen.");
				const script = document.createElement("script");
		script.textContent = code;
		(document.head || document.documentElement).appendChild(script);
		
		});

}())



