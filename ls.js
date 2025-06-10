trades = window.localStorage.getItem("trades")||"{}"
trades = JSON.parse(trades)
geld = 10000
t={}
window.trades = trades;
window.geld = geld;

window.t=t;

getlastmin = function(minutes=30,param){
	arr = val.achive.filter(el=>el.timestamp>=funDatum.addHours(-(minutes/60)))
	if(arr.length==0) return {duration:0,value:0,percent:0}
	name = val.parN
	mini = Math.min(...arr.map(obj=>obj[name]))
	let line = arr.filter(obj=>obj[name] = min) || [{}]
	line = line[0]
	let duration = (new Date() - line.timestamp) /1000/60
	let value = val[name]-line[name]
	let percent = value / line[name]
	ret = {duration,value,percent}
	return ret
}


t.add = function(buyin,pcs,wkn){
    wkn = wkn||val.wkn
	trades[wkn] = {
        buyin:buyin,
        pcs:pcs
    }
    window.localStorage.setItem("trades",JSON.stringify(trades))
    window.localStorage.setItem(wkn,JSON.stringify(trades[wkn]))
	t.get()
}

t.del = function(out,wkn){
	wkn = wkn||val.wkn
    let t = trades[wkn]||{};
    if(!(t)) return console.log("gibts nicht")
    t.prof = out - t.buyin;
    t.out = out

    t.buyin = false;
    window.localStorage.setItem("trades",JSON.stringify(trades))
    window.localStorage.setItem(wkn,JSON.stringify(trades))
}

t.get = function (wkn) {
    wkn = wkn || val.wkn
    let b = trades[wkn].buyin
    console.table({
        "-2%":(0.98*b).toFixed(3),
        "-1,5%":(0.985*b).toFixed(3),
        "-1%":(0.99*b).toFixed(3),
        "-0,5%":(0.995*b).toFixed(3),
        "buyin":(b).toFixed(2),
        "+0,2%":(1.002*b).toFixed(3),
        "+0,4%":(1.004*b).toFixed(3),
        "+0,5%":(1.005*b).toFixed(3),
        "+0,75%":(1.0075*b).toFixed(3),
        "+1,0%":(1.01*b).toFixed(3),
        "+1,5%":(1.015*b).toFixed(3),
        "+2,0%":(1.02*b).toFixed(3),
    })
}

val=typeof(val)!='undefined'?val:{achive:[]}
window.val = val



observeFunction=function(mutationsList, observer){
    val.wkn = ((document.querySelectorAll("div[class^=mpe_bootstrapgrid")[4].innerHTML).split("WKN: ")[1]).split(" ")[0]
	let tra = window.localStorage.getItem(val.wkn)||"{}"
		tra = JSON.parse(tra)
	trades[val.wkn] = tra
	let ac = {...val}
	delete ac.archive
    	val.achive.push(ac);
	try{
		val.start = Math.max(document.querySelector("svg > text").innerHTML.split("g ")[1].replace(".","").replace(",","."))
		}catch(err){console.log(err)}
    val.tra = trades[val.wkn]||{}
    val.bid = gV(document.querySelector("span[field=bid"));
    val.mid = gV(document.querySelector("span[field=mid"));
    val.ask = gV(document.querySelector("span[field=ask"));
    val.timestamp = new Date();
    val.spr = (((val.bid)-(val.ask))/(val.bid)*100).toFixed(3)
	window.contSpread.innerHTML = val.spr
    val.time = elementToObserveOA.innerHTML
    let out = null;
    if(val.tra.buyin) {
	val.parN = "bid"
	
        val.devE = (val[val.parN] - val.tra.buyin).toFixed(2)
        val.devP = (val.devE / val.bid * 100).toFixed(2)
        val.prof = (val.devE * val.tra.pcs).toFixed(2)
        out = val.devE + "€ | " + val.devP + " % | " + val.prof + " €"
    }else{
	val.parN = "mid"
	
        val.pcs = (geld / val.ask).toFixed(1)
        val.dst = (val[val.parN] - val.start)
        val.perc = (val.dst / val.start * 100).toFixed(2)
	
        out = val.spr + " | " + val.pcs + " pcs | " + val.perc + " % | " + val.dst.toFixed(3) // + " | " + val.duration.toFixed(0) + " min"
    }

    val.lastMin30 = getlastmin(30,val.parN)
	srtLast = " | " + val.lastMin30.duration.toFixed(1) + " min" + " | " + val.lastMin30.percent.toFixed(3)
    console.log(out,srtLast,val)
}
if(window.observerActive != true) {window.observerActive = true;
    elem = document.querySelector("div[class^=container")
    elem.parentElement.removeChild(elem)
    elem = document.querySelector("div[class^=row")
    elem.parentElement.removeChild(elem)
   document.querySelector("image").style.display = 'none'
    arr = document.querySelectorAll("g[class^=highcharts-axis-labels")[1]
arr = (arr)?arr.childNodes:[]
//arr.forEach(el=>el.style.display = 'none')
funChangeDisplayObject(document.querySelector("input").parentElement,"none")
    window.elementToObserveOA = document.querySelector("#page_content > div > div:nth-child(1) > div > div.mpe_bootstrapgrid.col-md-8 > div > div:nth-child(5) > div > span:nth-child(4) > span");
				   cont = document.querySelector("#page_content > div > div:nth-child(1) > div > div.mpe_bootstrapgrid.col-sm-12.informerhead.informerhead-half.row.col-md-4")
	window.contSpread = funAddHtmlE(cont,"span","spread","spread")

function funAddHtmlE (targetQueryOrObj,typ,innerhtml,id,param_val,event_func,insertFirst){
	try{
        t=(typeof(targetQueryOrObj)=='string')?document.querySelector(targetQueryOrObj):targetQueryOrObj
        let r = document.createElement(typ)
        if(innerhtml) r.innerHTML=innerhtml
        if(id) r.id=id
        for(p in param_val){r.setAttribute(p,param_val[p])}
        for(e in event_func){r.addEventListener(e,eval(event_func[e]))}
        if(insertFirst){t.insertBefore(r, t.firstChild);}else{t.appendChild(r)}
        return r
	}catch(err){console.log(err)}
    };

gV = function(field){
    return Math.max(field.innerHTML.replace(".","").replace(",",".")) 
}                                    
                                   
    observer = new MutationObserver(function(mutationsList, observer) {observeFunction(mutationsList, observer)});
    observer.observe(elementToObserveOA, {characterData: false, childList: true, attributes: true});
}

observeFunction()
window.scrollTo(0, 215);
