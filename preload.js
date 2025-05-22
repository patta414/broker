verslog = new Date().getUTCMilliseconds()+Math.floor(Math.random()*1000)

fmscript = document.createElement("script");
fmscript.id = "d3js";
fmscript.src="https://d3js.org/d3.v7.min.js;"
fmscript.type="text/javascript";
document.head.appendChild(fmscript);

if(window.location.href.match(/ls-tc.de\/de\/aktie/)?true:false){ 
  console.log("ls-tc");
  fmscript = document.createElement("script");
  fmscript.id = "lsjs";
  fmscript.src= "https://patta414.github.io/broker/ls.js?v="+verslog
  fmscript.type="text/javascript";
  document.head.appendChild(fmscript);
}


if(window.location.href.match(/query1.finance.yahoo.com/)?true:false) {
  console.log("jahoo.finance")
  fmscript = document.createElement("script");
  fmscript.id = "jfjs";
  fmscript.src= "https://patta414.github.io/broker/jf.js?v="+verslog
  fmscript.type="text/javascript";
  document.head.appendChild(fmscript);
}
