c={
    charts:{},
    new:"jetzt",
    container:{},
    active:false,
    minutes:35,
};
c.initChartjs = function(){
    injectRemoteCode("https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.umd.min.js",()=>{
        injectRemoteCode("https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js",()=>{
            window.c.active=true
        })
    })
}
console.log("17") // =======================================
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
}

c.buildContainer = async function(name,cont){
    cont=cont||document.querySelector("#main_layout > div > nav > div:nth-child(1) > div")
    cont.innerHTML = ""
    c.container[name] = await funAddHtmlE(cont,"canvas","",name+"chart",{style:'width:400px;height:240px;display:block;'},null)
    
}

c.data = function(name,duration){
    rawData = archiv[name]||[{}];
    //rawData.map(d => new Date(d.timestamp));
    rawData = rawData.filter(el=>new Date(el.timestamp) >= funDatum.addHours(-(duration/60)));
    return rawData
}

c.buildChart = function(name,duration){
    //rawData = archiv[name]
    //rawData = c.data(name,duration)
    rawData = [];
    const labels = rawData.map(d => new Date(d.timestamp));
    const values = rawData.map(d => d.bid);
    const ctx = document.getElementById(name+'chart').getContext('2d');
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
                display: false
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
    
    // Bestehende Daten im Chart ersetzen
    c.charts[name].data.labels = labels;
    c.charts[name].data.datasets[0].data = values;
    
    // Chart neu rendern
    c.charts[name].update();
}


window.archiv = window.archiv||{};
classRow = class {
    //this.row = null;
    fields={};
    archivieren = async function(){
        window.archiv[this.key] = window.archiv[this.key] || this.get_store()
        window.archiv[this.key].forEach(el=>el.timestamp = new Date(el.timestamp))
        //console.log(this.key,window.archiv[this.key].length)
        window.archiv[this.key] = window.archiv[this.key].filter(el=>el.timestamp >= funDatum.addHours(-(1)));
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
        let ad = function(str,name){
            funAddHtmlE(fld,"p",str,"",{class:"valueField",title:name})
        }
        fld.innerHTML = ""
        let v = this[name];
        v = (this.bid - this.ask)/this.ask*100
        
        ad(v.toFixed(3)+" %","spread")
        ad((this.bid - this.ask).toFixed(3)+" €","spread")
        ad(this.ask+" €","ask")
        ad(this.bid+" €","bid")
    };
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
            this.fields.test.innerHTML += ((new Date()-field.timestamp)/1000/60).toFixed(0) + "|"
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
        window.localStorage.setItem(this.key,JSON.stringify(window.archiv[this.key]))
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
             this[n] = this[n].replace("&nbsp;€","").replace(" %","").replace(".","").replace(",",".")
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
    if(window.merkinitWatchlist == true) return
    //window.archiv = window.archiv || {}
    table = document.querySelector("tbody")
    rows = table.querySelectorAll("tr")
    rows.forEach(row=>{
        fields = row.querySelectorAll("td")
        id="_"+fields[0].children[0].innerHTML
        get_store(id)
        console.log(fields)
        arr = [0,2,3,4,5,7]
        arr.forEach(n=>{fields[n].style.display = "none"})
       
        newFields.forEach(n=>{let td=funAddHtmlE(row,"td");funAddHtmlE(td,"span",n,n,{title:n})})
        elementToObserve = fields[6].querySelector("div > span")
        observer = new MutationObserver(function(mutationsList, observer) {observeFunction(mutationsList, observer)});
        observer.observe(elementToObserve, {characterData: false, childList: true, attributes: true});
        //c.buildContainer(id)
        //c.buildChart(id)

        
        
        //new classRow({target:elementToObserve})
        
    })
    window.merkinitWatchlist = true;
    
 }

initWatchlist()
