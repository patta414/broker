list = {};
c={
    charts:{},
    new:"jetzt",
    container:{},
    active:false,
    minutes:window.localStorage.getItem("minutes")||15,
    liste:[],
    percent:window.localStorage.getItem("percent")||0.2,
    allActive:false,
    deviPercVal:window.localStorage.getItem("deviPercVal")||0.5,
    storeMinutes:60,
};
console.log("17") // =======================================
cl = false
checkLogic = function(wkn){
    let alrt = function(a,b,c){
        funAlert(b,a)
        console.log(a+"\n",b,c)
    }
    if(!(cl)) return
    let msg="",title,send=false,dev_min,dev_max,mind;
    let l = list[wkn]||[{}]
    let t = tra.trades[wkn]||{}
    let a = archiv[wkn] || false
    
    if(!(a)) return
    if(!(l)) return
    if(!(t)) return
    
    let minL = a.findLast(e=>e.bid==(Math.min(...a.map(el=>el.bid))))
    let maxL = a.findLast(e=>e.bid==(Math.max(...a.map(el=>el.bid))))

    
    let dev_help = t.linehelp
        dev_help = (l.bid-dev_help)/dev_help*100
    
    
    if(t.buyin){
        //cl = false
        dev_min = t.buyin
        dev_min = ((minL.bid-dev_min)/dev_min*100).toFixed(2)
        t_min = (new Date(new Date() - minL.timestamp)/1000/60).toFixed()
        if(t_min < 10) send = true
        msg += "+++ seit " + t_min +" min um "+dev_min+" %"
        
        dev_max = t.buyin
        dev_max = ((maxL.bid-dev_max)/dev_max*100).toFixed(2)
        t_max = (new Date(new Date()-maxL.timestamp)/1000/60).toFixed()
        if(t_max > 5) send = true 
        msg += "\n--- Die aktie fällt seit " + t_max +" min um "+dev_max+" %"
    
        
    
    }

    if(t.buyin){
        let ind = a.length-1 
        if(t.buyin>=a[ind].bid && t.buyin<a[ind-1].bid && t.buyin<a[ind-2].bid && t.buyin<a[ind-3].bid && t.buyin<a[ind-4].bid) alrt(l.name,"Hat gerade den Einstiegskurs erreicht")   
        //arr = l
    }

    if(t.linehelp){
        let ind = a.length-1
        let comp = t.linehelp
        if(comp>=a[ind].bid && comp<a[ind-1].bid && comp<a[ind-2].bid && comp<a[ind-3].bid) alrt(l.name," --- Hat gerade die Hilfslinie UNTERSCHRITTEN")
        if(comp<=a[ind].bid && comp>a[ind-1].bid && comp>a[ind-2].bid && comp>a[ind-3].bid) alrt(l.name," +++ Hat gerade die Hilfslinie überschritten")
        comp = t.linehelp*1.02
            if(comp>=a[ind].bid && comp<a[ind-1].bid && comp<a[ind-2].bid && comp<a[ind-3].bid) alrt(l.name,"Hat gerade +++ 2% Hilfslinie")
            //if(comp<=a[ind].bid && comp>a[ind-1].bid && comp>a[ind-2].bid && comp>a[ind-3].bid) alrt(l.name,"Hat gerade --- 2% Hilfslinie")
    }
    
    let base = t.linehelp||t.buyin||l.bid
    let dev = (l.bid-base)/base*100
    if(t.buyin>0) {
        if(dev < -0.3){
            //send=true
            msg += "unter hilfslinie gefallen um "+dev.toFixed(2)+" %"
        }
        mind = (l.bid-base)/base*100
        
        //msg += "\n"+mind
    }
    
    //console.log(minL,maxL)
    title = l.name 
    //if(send) console.log(title+"\n",msg)
    //console.log(title,minL.bid,dev_min,t_min,minL)
    //if(send) funAlert(title,msg)
    
}



tra ={
    funAddFromSearch:function(){
        console.log("funAddFromSearch",localStorage.locationSearch)
        let obj = funLocSearch()||{}
        let {wkn,buyin,qty,helpline,watchlist} = obj
        if(buyin && qty) {this.buyin(wkn,buyin,qty);console.log("buyin")}
        if(buyin && qty==0) {this.buyout(wkn,buyin);console.log("out")}
        if(helpline) {this.linehelp(wkn,helpline);console.log("linehelp")}
        
        if(watchlist) {
            function getCookiesObject() {
              return document.cookie.split(';').reduce((cookies, cookieStr) => {
                const [name, value] = cookieStr.trim().split('=');
                cookies[name] = decodeURIComponent(value);
                return cookies;
              }, {});
            }
            
            watchlist = ((getCookiesObject()||{}).watchlist||"") + watchlist
            document.cookie = `watchlist=${watchlist}; path=/;`;
        }
        //tra.funAddFromSearch()
        if(localStorage.locationSearch){
            localStorage.locationSearch=''
            location.href = location.href.split("?")[0]
        }
    },
    store:function(name){
        window.list = window.list||{}
        window.list[name] = window.list[name]||{}
        tra.trades[name].name = list[name].name
        window.localStorage.setItem("trades",JSON.stringify(tra.trades))
    },
    init:function(){
        this.trades = window.localStorage.getItem("trades")||"{}"
        this.trades = JSON.parse(this.trades)
    },
    buyin:function(name,buyin,pcs){
        this.trades[name]=this.trades[name]||{}
    	this.trades[name].buyin=buyin;
        this.trades[name].pcs=pcs;
        this.trades[name].buyout=null;
        
        this.store(name)
        //window.localStorage.setItem(wkn,JSON.stringify(trades[wkn]))
    	//t.get()
    },
    input:function(name,type="buyin"){
        let value = (this.trades[name])?this.trades[name][type]:""
        if(type=="linehelp") value = list[name].bid
        buyin = window.prompt(archiv[name][0].name+" - "+type,value)
        buyin = (buyin)?buyin.replace(",","."):null
        this[type](name,buyin)
    },
    input:function(name,type="buyin"){
        let value = (this.trades[name])?this.trades[name][type]:""
        if(type=="linehelp") value = list[name].bid
        
        const form = formular.standard()
        const vf = funAddHtmlE(form,"input","",type,{value,type:"number"})
        const ty = type;
        const n = name
        const fun = ()=>{
            this[ty](n,vf.value)
        }
        //buyin = window.prompt(archiv[name][0].name+" - "+type,value)
        //buyin = (buyin)?buyin.replace(",","."):null
        const but = funAddHtmlE(form,"button","bestätigen","",{},{"click":fun})
    },
    inputPercent:function(){
        let prc = window.prompt("Percent")
        prc = (prc)?prc.replace(",","."):0.2
        window.localStorage.setItem("percent",prc)
        c.percent = prc
    },
    inputdeviPercVal:function(){
        let prc = window.prompt("deviPercVal")
        prc = (prc)?prc.replace(",","."):0.5
        prc=prc*1
        window.localStorage.setItem("deviPercVal",prc)
        c.deviPercVal = prc
    },
    setHelpLine:function(value){
        for(n in list){
            let l = list[n];
            this.linehelp(l.key,value||l.bid)
        }
    },
    buyout:function(name,buyout){
        this.trades[name]=this.trades[name]||{}
        this.trades[name].buyout=buyout
        this.trades[name].buyin=null
        this.store(name)
    },
    del:function(name){
        this.trades[name] = {
            buyin:null,
            buyout:null,
            linehelp:null,
        }
        this.store(name)
    },
    linehelp:function(name,linehelp){
        this.trades[name] =  this.trades[name] || {}
        this.trades[name].linehelp = linehelp
        this.store(name)
    },
}
tra.init()

c.initChartjs = function(){
    injectRemoteCode("https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.umd.min.js",()=>{
        injectRemoteCode("https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js",()=>{
            window.c.active=true;
            c.refreshAll();
            c.refreshAll();
        })
    })
}

c.initChartjs()
c.init = function(name){
    if(!(this.active)) return
    let list = window.list 
    let n = name
    //for(n in list){
        if(c.charts[n]==undefined){
            c.buildContainer(n,list[n].fields.cha)
            c.buildChart(n)
        }else{
            c.update(n,c.minutes)
        }
    //}
    c.all([n])
}
c.all = function(list){
    if(!(c.allActive)) return
    if(c.last>=funDatum.addHours(-10/60/60)) return
    c.last = new Date()
    c.allfunadd = function(){
        place = document.querySelector("#main_layout > div > div:nth-child(7) > div")
        place.style = "width: 80%; height: 800px;"
        c.allfunadd = ()=>{}
        c.buildContainer("liste",place)
        c.buildChart("liste")
    
    }
    c.allfunadd()
    let cliste = c.liste//['_RENK73','_703000','_HAG000'] 
    name = "liste"
    cliste.forEach((n,i)=>{
        let arr = c.data(n,c.minutes)
        let actu = arr[arr.length-1]
        let firs = arr[0]//arr.length-1]
        act={
            min:Math.min(...arr.map(el=>el.bid)),
            max:Math.max(...arr.map(el=>el.bid))
        }
        act.bid = act.min//(act.max+act.min)/2
        if(actu) act.bid = (tra.trades[n])?tra.trades[n].buyin:(actu.bid-actu.diffE)
        //console.log(act)
        arr.map(el=>el.bidPerc = (el.bid-act.bid)/act.bid)
        let neueDaten = arr
        // Labels (Zeitstempel) und Werte (bid) extrahieren
        labels = neueDaten.map(d => new Date(d.timestamp));
        values = neueDaten.map(d => d.bidPerc);
            
            // Bestehende Daten im Chart ersetzen
        
        c.charts[name].data.datasets[i]={...c.charts[name].data.datasets[0]}
        c.charts[name].data.datasets[i].data = values;
        c.charts[name].data.datasets[i].label = (arr[0])?arr[0].name:"nix"
        c.charts[name].data.datasets[i].borderColor = colors.get(i)
    })
    c.charts[name].data.labels = labels;
            // Chart neu rendern
    c.charts[name].update();
}
c.buildContainer = async function(name,cont){
    cont=cont||document.querySelector("#main_layout > div > nav > div:nth-child(1) > div")
    cont.innerHTML = ""
    cont.removeAttribute("title")
    let heig = (name == "liste")?600:240;
    c.container[name] = await funAddHtmlE(cont,"canvas","",name+"chart",{style:'width:400px;height:'+heig+';display:block;'},null)
    
}

c.data = function(name,duration){
    rawData = archiv[name]||[{}];
    //rawData.map(d => new Date(d.timestamp));
    rawData = rawData.filter(el=>new Date(el.timestamp) >= funDatum.addHours(-(duration/60)));
    return rawData
}

c.refreshAll=function(minutes){
    c.minutes = minutes||c.minutes
    table = document.querySelector("tbody")
    rows = table.querySelectorAll("tr")
    rows.forEach(row=>{
        fields = row.querySelectorAll("td")
        observeFunction([{target:fields[6].querySelector("div > span")}])
        //id="_"+fields[0].children[0].innerHTML
        //c.update(id,c.minutes)
    })
}

c.buildChart = function(name,duration){
    //rawData = archiv[name]
    //rawData = c.data(name,duration)
    rawData = [];
    const labels = rawData.map(d => new Date(d.timestamp));
    const values = rawData.map(d => d.bid);
    const ctx = document.getElementById(name+'chart').getContext('2d');
    const leg = (name=='liste')?true:false;
    c.charts[name] = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Bid Preis',
              data: values,
              borderColor: 'steelblue',
              pointRadius: 0,
              backgroundColor: 'rgba(70,130,180,0.1)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            animation: false,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'minute',
                  tooltipFormat: 'HH:mm:ss'
                },
                title: {
                  display: false,
                  text: 'Zeit'
                }
              },
              y: {
                title: {
                  display: false,
                  text: 'Bid (€)'
                }
              }
            },
            plugins: {
              legend: {
                display: leg
              }
            }
          }
        });
}

c.update = function(name,duration){
    //const neueDaten = archiv[name]
    const neueDaten = c.data(name,duration)
    // Labels (Zeitstempel) und Werte (bid) extrahieren
    const labels = neueDaten.map(d => new Date(d.timestamp));
    const values = neueDaten.map(d => d.bid);
    const asks = neueDaten.map(d => d.ask);
    let lineval = neueDaten.map(d => (tra.trades[name])?tra.trades[name].buyin:null)
    let lineout = neueDaten.map(d => (tra.trades[name])?tra.trades[name].buyout:null)
    let linehelp = neueDaten.map(d => (tra.trades[name])?tra.trades[name].linehelp:null)
    let perc =(tra.trades[name])?tra.trades[name].percent:null
        perc = perc|| c.percent
        perc = perc*1
    let base = (tra.trades[name])?tra.trades[name].buyin:null
        base = base||values[values.length-1]
    let percVal = values[values.length-1] / base
    let devi = percVal > (100+c.deviPercVal*1)/100 || percVal < (100-c.deviPercVal*1)/100
    let color = (percVal < 1) ?"red":"steelblue"
    if(percVal>1) color = "green"
    if(devi){
        lineval = lineval.map(d=>null)
        
        base = values[values.length-1]
    }

    lineout = lineout.map(d=>null)
    
    let tolP = (name != '_LUSDAX')?neueDaten.map(d => base * (100+perc)/100):neueDaten.map(d =>null)
    let tolM = (name != '_LUSDAX')?neueDaten.map(d => base * (100-perc)/100):neueDaten.map(d =>null)
    //console.log(tolP)
    // Bestehende Daten im Chart ersetzen
    let ind = 0;
    c.charts[name].data.labels = labels;
    c.charts[name].data.datasets[ind].data = values;
    c.charts[name].data.datasets[ind].borderColor = color
    
    c.charts[name].data.datasets[++ind] = {...c.charts[name].data.datasets[0]}
    c.charts[name].data.datasets[ind].data = lineval;
    c.charts[name].data.datasets[ind].borderColor = "black"
    if(c.asks) {
        c.charts[name].data.datasets[++ind] = {...c.charts[name].data.datasets[0]}
        c.charts[name].data.datasets[ind].data = asks;
        c.charts[name].data.datasets[ind].label = "ask";
        c.charts[name].data.datasets[ind].borderColor = "black"
        c.charts[name].data.datasets[ind].borderWidth = "1"
    }
    
    c.charts[name].data.datasets[++ind] = {...c.charts[name].data.datasets[0]}
    c.charts[name].data.datasets[ind].data = lineout;
    c.charts[name].data.datasets[ind].borderColor = "lightgrey"
    c.charts[name].data.datasets[++ind] = {...c.charts[name].data.datasets[0]}
    c.charts[name].data.datasets[ind].data = tolP;
    c.charts[name].data.datasets[ind].label = base + " + " + perc
    c.charts[name].data.datasets[ind].borderColor = "lightgrey"
    c.charts[name].data.datasets[++ind] = {...c.charts[name].data.datasets[0]}
    c.charts[name].data.datasets[ind].data = tolM;
    c.charts[name].data.datasets[ind].label = base + " - " + perc
    c.charts[name].data.datasets[ind].borderColor = "lightgrey"
    
    c.charts[name].data.datasets[++ind] = {...c.charts[name].data.datasets[0]}
    c.charts[name].data.datasets[ind].data = linehelp;
    c.charts[name].data.datasets[ind].label = linehelp[0];
    c.charts[name].data.datasets[ind].borderColor = "black"
    c.charts[name].data.datasets[ind].borderWidth = "1"

    
    
    // Chart neu rendern
    c.charts[name].update();
}
window.followFunctionTest=function(el){
    
}

window.archiv = window.archiv||{};
classRow = class {
    //this.row = null;
    fields={};
    archivieren = async function(){
        window.archiv[this.key] = window.archiv[this.key] || this.get_store()
        window.archiv[this.key].forEach(el=>el.timestamp = new Date(el.timestamp))
        //console.log(this.key,window.archiv[this.key].length)
        window.archiv[this.key] = window.archiv[this.key].filter(el=>el.timestamp >= funDatum.addHours(-(c.storeMinutes/60)));
        this.archiv = window.archiv[this.key]
        //console.log(this,this.archiv)
        //this.archiv = this.archiv.filter(el=>el.timestamp >= funDatum.addHours(-(1/60)));
        let el= {}
        this.fieldNames.forEach((n,i)=>{
            el[n] = this[n]
        })
        el.timestamp=new Date()
        window.archiv[this.key].push({...el})
        this.store()
        //console.log(this.archiv.length)
    }
    set = function(name){
        let v = this[name];
        v = this.ask - this.bid
        this.fields[name].innerHTML=v
    };
    set_spread = function(){
        let name = "spread"
        let fld = this.fields[name]
        let ad = function(str,name,sty=""){
            funAddHtmlE(fld,"p",str,"",{class:"valueField",title:name,style:sty})
        }
        fld.innerHTML = ""
        let v = this[name];
        v = (this.bid - this.ask)/this.ask*100
        
        ad(v.toFixed(3)+" %","spread")
        ad((this.bid - this.ask).toFixed(3)+" €","spread")
        ad(this.ask+" €","ask")
        ad(this.bid+" €","bid")
        let lineval = (tra.trades[this.key])?tra.trades[this.key].buyin:null;
        let lineout = (tra.trades[this.key])?tra.trades[this.key].buyout:null;
        let linehelp = (tra.trades[this.key])?tra.trades[this.key].linehelp:null;
        if(lineval) ad(((this.bid-lineval)/this.bid*100).toFixed(2)+" %","IN","background: lightgrey;")
        if(lineout) ad(((this.bid-lineout)/this.bid*100).toFixed(2)+" %","OUT","background: lightgrey;")
        if(linehelp) ad(((this.bid-linehelp)/this.bid*100).toFixed(2)+" %","help","border: 1px solid black;")
        checkLogic("_"+this.wkn)
        followFunctionTest(this)
    };
    add=function(){
        name = this.key
        buyin = window.prompt(archiv[name][0].name+" buyin")
        tra.add(name,buyin)
    }
    get_last=function(was="bid"){
        let place = this.fields.updown
        this.fields.test.innerHTML = ""
        place.innerHTML = ''
        let arr = []//20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];
        for(i=10;i>0;i=i-0.5){arr.push(i)}
        arr.forEach(el=>{
            let field = this.get_last_per_min(el)
            print = (field[was]-this[was]) + "<br>"
            print = field.len +" | "+ field.timestamp+ "<br>"
            print = (field[was]-this[was]<0)?"^":"."
            place.innerHTML += print
            //this.fields.test.innerHTML += ((new Date()-field.timestamp)/1000/60).toFixed(0) + "|"
        })
    };
    get_last_per_min=function(min){
        let diff = 0.5
        let arr = this.archiv.filter(el=>el.timestamp >= funDatum.addHours(-(min/60)));
        let field = arr.sort((a,b)=>{return a.timestamp - b.timestamp})[0]
        field.len = arr.length
        this["last_"+funDatum.fuehrNull(min)] = field
        return field
    };
    store = function(){
        let obj = [...window.archiv[this.key]]
        obj = obj.map(el=>{
            newFields.forEach(n=>{
                delete el[n]
            })
            //delete el.cha;
            //delete el.spread;
            //delete el.test;
            return el})
        try{window.localStorage.setItem(this.key,JSON.stringify(obj))}catch(err){c.storeMinutes=30;}
        
        //window.localStorage.setItem("keysObj",JSON.stringify(window.keysObj))
    };
    get_store = async function(){
        let str = window.localStorage.getItem(this.key)||"[]";
        return JSON.parse(str)
    };
    constructor(mutation){
        this.row = mutation.target.parentElement.parentElement.parentElement;
        this.fieldsArr = this.row.querySelectorAll("td");
        this.valueFields = ["bid","ask","diffE","diffP"]
        this.fieldNames = [...["wkn" ,"name"],...this.valueFields,"time","a","a",...newFields];
        this.fieldNames.forEach((n,i)=>{
            if (i === 7 || i === 8) return;
            let selector = "div > span"
            if (n == "wkn") selector = "div"
            if (n == "name") selector = "div > a"
            if (newFields.indexOf(n)>-1) selector = "span"
            let elem = this.fieldsArr[i].querySelector(selector)
            this[n] = elem.innerHTML
            this.fields[n] = elem
        })
         this.valueFields.forEach(n=>{
             this[n] = this[n].replace("&nbsp;€","").replace("&nbsp;Pkt.","").replace(" %","").replace(".","").replace(",",".")
             this[n] = Math.min(this[n])
         })
        this.fields["name"].title = this.wkn
        this.key = "_"+this.wkn
        //console.log(this)
        this.archivieren()
        window.list = window.list||{}
        window.list[this.key] = this

        this.set_spread()
        this.get_last()
        c.init(this.key)
        return this
    }
} 

observeFunction=function(mutationsList, observer){
    window.lastrefresh = new Date()
    let r = new classRow(mutationsList[0])
    //console.log(r.wkn)
    //window.l=window.l||{}
    //window.l[r.wkn] = r
    cons(r)
}

get_store = function(key){
    let str = window.localStorage.getItem(key)||"[]";
    window.archiv[key]=JSON.parse(str)
    return window.archiv[key]
};

console.log("ja")
cons = function(el){
    console.log(el)
    cons=function(){}
}
newFields = ['cha','spread','updown','test']
initWatchlist = function(){
    if(typeof(funAddHtmlE)=='undefined') window.location.reload()
    if(window.merkinitWatchlist == true) return
    //window.archiv = window.archiv || {}
    table = document.querySelector("tbody")
    rows = table.querySelectorAll("tr")
    rows.forEach(row=>{
        fields = row.querySelectorAll("td")
        id="_"+fields[0].children[0].innerHTML
        funAddHtmlE(fields[8],"button","buyIn","",{onclick:"tra.input('"+id+"')"})
        funAddHtmlE(fields[8],"button","out","",{onclick:"tra.input('"+id+"','buyout')"})
        funAddHtmlE(fields[8],"button","del","",{onclick:"tra.del('"+id+"')"})
        funAddHtmlE(fields[8],"button","help","",{onclick:"tra.input('"+id+"','linehelp')"})
        funAddHtmlE(fields[8],"button","%","",{onclick:"formPercent('"+id+"')"})
        get_store(id)
        c.liste.push(id)
        //console.log(fields)
        arr = [0,2,3,4,5,7]
        arr.forEach(n=>{fields[n].style.display = "none"})
       
        newFields.forEach(n=>{let td=funAddHtmlE(row,"td");funAddHtmlE(td,"span",n,n,{title:n})})
        elementToObserve = fields[6].querySelector("div > span")
        observer = new MutationObserver(function(mutationsList, observer) {observeFunction(mutationsList, observer)});
        observer.observe(elementToObserve, {characterData: false, childList: true, attributes: true});
        //c.buildContainer(id)
        //c.buildChart(id)
    
        
        
        //new classRow({target:elementToObserve})
        setTimeout(funTimeCheck, 5000);
    })
    let place = document.querySelector("#main_layout > div > nav > div:nth-child(1) > div")
    funAddHtmlE(place,"br")
    funAddHtmlE(place,"button","clear","",{},{click:()=>{c.storeMinutes=30;}})
    funAddHtmlE(place,"button","asks","",{},{click:()=>{c.asks=true;}})
    funAddHtmlE(place,"button","Per","",{},{click:()=>{tra.inputPercent();}})
    funAddHtmlE(place,"button","Dev","",{},{click:()=>{tra.inputdeviPercVal();}})
    funAddHtmlE(place,"button","setHelpL","",{},{click:()=>{tra.setHelpLine();}})
    funAddHtmlE(place,"button","OBJ","",{onclick:"obj = {};for(n in tra.trades){el = tra.trades[n];if(el.buyin>0) obj[n] = el;};console.log(obj)"})
    funAddHtmlE(place,"button","check","",{onclick:"cl=!cl"})
    //funAddHtmlE(place,"button","10","",{},{click:()=>{c.minutes=10;}})
    //funAddHtmlE(place,"button","15","",{onclick:()=>{c.minutes=15;}})
    //funAddHtmlE(place,"button","20","",{},{click:()=>{c.minutes=20;}})
    for(i=1;i<=61;i=i+2){
        const min = i
        funAddHtmlE(place,"button",min,"",{},{click:()=>{window.localStorage.setItem("minutes",min);c.refreshAll(min);}})
    }
    tra.funAddFromSearch()
    window.merkinitWatchlist = true;
 }

formPercent = function(id){
    let wkn = id
    let l = list[wkn]||[{}]
    let t = tra.trades[wkn]||{}
    if(!(t.buyin)) return
    place = formular.standard()
    funAddHtmlE(place,"div","buyin= "+t.buyin)
    place = funAddHtmlE(place,"div")
    let arr = []
    for(ii=0;ii<=9;ii++){
        let line = {base:ii}
        for(i=6;i>=-6;i--){
        //    line.base=ii
            line[" * "+i+",x"] = (t.buyin*1+(t.buyin*(i+(ii/10))/100)).toFixed(2)+" | "
        }
        arr.push(line)
    }
    funAddTableArrObj(place,arr)
    
}
window.lastrefresh = new Date()
funTimeCheck=function(){
    let lastsec = (new Date() - window.lastrefresh)/1000
    //console.log(lastsec)
    if(lastsec>10 && (new Date().getHours()>=8))  window.location.reload()
    setTimeout(funTimeCheck, 5000);
};


initWatchlist()
