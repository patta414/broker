//https://query1.finance.yahoo.com/v8/finance/chart/RHM.DE?interval=1m

var predata,pre;

params = {
	range:"1d",
	interval:"1m",
}

init = function(jsondata){
	document.querySelector(".json-formatter-container").style.display = "none"
	fmscript = document.createElement("style");
	fmscript.id = "pre";
	fmscript.innerHTML=`body { font-family: sans-serif; }
	    svg { background: #f4f4f4; border: 1px solid #ccc; }` 
			document.head.appendChild(fmscript);
	
	pre = document.body.querySelector("pre")
	predata = JSON.parse(pre.innerText)
	pre.style.display = "none"
	v_svg = funAddHtmlE(document.body,"div","","chart",{style:'display: block;width: '+window.innerHeight+'px;height: '+window.innerWidth+'px;'})
}

build = function(jsondata) {
	const timestamps = jsondata.chart.result[0].timestamp;
    const prices = jsondata.chart.result[0].indicators.quote[0].low

    // Kombiniere Zeit und Preis
    const data = timestamps.map((ts, i) => ({
      date: new Date(ts * 1000),
      price: prices[i]
    })).filter(d => d.price !== null); // filtere ungültige Werte

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 900 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
      .range([0, width]);
	
	//const x = d3.scalePoint()
	//	.domain(data.map(d => d.time)) // nur vorhandene Minuten
  	//	.range([0, width]);
      

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.price) * 0.995, d3.max(data, d => d.price) * 1.005])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x).ticks(10);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    svg.append("g").call(yAxis);

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", d3.line()
        .x(d => x(d.date))
        .y(d => y(d.price))
      );

    // Optional: Tooltip beim Hover
    const tooltip = d3.select("body").append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "white")
      //.style("border", "1px solid #ccc")
      .style("padding", "6px")
      .style("font-size", "12px");

    svg.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.price))
      .attr("r", 1)
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        tooltip.html(`Zeit: ${d.date.toLocaleTimeString()}<br>Preis: €${d.price.toFixed(2)}`)
          .style("visibility", "visible");
      })
      .on("mousemove", event => {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));
}


init()
//build(predata)

c={
    charts:{},
    new:"jetzt",
    container:{},
    active:false,
    minutes:15,
    liste:[],
};

c.initChartjs = function(){
    injectRemoteCode("https://cdn.jsdelivr.net/npm/chart.js@4.2.1/dist/chart.umd.min.js",()=>{
        injectRemoteCode("https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js",()=>{
            window.c.active=true;
            c.refreshAll();
        })
    })
}

c.buildContainer = async function(name,cont){
    cont=cont||document.querySelector("#main_layout > div > nav > div:nth-child(1) > div")
    cont.innerHTML = ""
    cont.removeAttribute("title")
    let heig = (name == "liste")?600:240;
    c.container[name] = await funAddHtmlE(cont,"canvas","",name+"chart",{style:'width:400px;height:'+heig+';display:block;'},null)

 
   
    
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
c.refreshAll = function(){
	c.buildContainer("test")
	c.buildChart("test")
}

c.buildContainer = async function(name,cont){
    cont=cont||document.querySelector("body")
    cont.innerHTML = ""
    cont.removeAttribute("title")
    let heig = (name == "liste")?600:240;
    c.container[name] = await funAddHtmlE(cont,"canvas","",name+"chart",{style:'width:400px;height:'+heig+';display:block;'},null)

	c.buildButtons()


}

c.buildButtons=function(){
    let miss = document.getElementById("Buttons")==null
	let ocont = miss?funAddHtmlE(document.body,"div","","Buttons"):document.getElementById("Buttons")
    ocont.innerHTML = ''
	cont = funAddHtmlE(ocont,"div")
names = ['Rheinmetall','RWE','Hensoldt','Renk'].forEach(n=>{
    funAddHtmlE(cont,"button",n,n,{onclick:"c.getPerName('"+n+"')"})
})
	cont = funAddHtmlE(ocont,"div")
    names = ['1m','1h','1d'].forEach(n=>{
    funAddHtmlE(cont,"button",n,n,{onclick:"params.range='"+n+"'"})
})
}
c.buildChart = function(name,data){
   jsondata = predata
    timestamps = jsondata.chart.result[0].timestamp;
    prices = jsondata.chart.result[0].indicators.quote[0].low
    data = timestamps.map((ts, i) => ({
      date: new Date(ts * 1000),
      price: prices[i]
    })).filter(d => d.price !== null);
    
    chartData = {
        labels: data.map(d => d.date.toLocaleTimeString()),
        datasets: [{
          label: 'Preis',
          data: data.map(d => d.price),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };

   const ctx = document.getElementById(name+'chart').getContext('2d');
  c.charts[name] = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: 'Zeit' }
        },
        y: {
          title: { display: true, text: 'Preis' }
        }
      }
    }
  });
}
c.update = function(name,jsondata){
    let timestamps = jsondata.chart.result[0].timestamp;
    let prices = jsondata.chart.result[0].indicators.quote[0].low
    let data = timestamps.map((ts, i) => ({
      date: new Date(ts * 1000),
      price: prices[i]
    })).filter(d => d.price !== null);
    
    const labels = data.map(d => d.date.toLocaleTimeString());
    const values = data.map(d => d.price);
    
    
    //let lineval = neueDaten.map(d => (tra.trades[name])?tra.trades[name].buyin:null)
    //let lineout = neueDaten.map(d => (tra.trades[name])?tra.trades[name].buyout:null)
    // Bestehende Daten im Chart ersetzen
    c.charts[name].data.labels = labels;
    c.charts[name].data.datasets[0].data = values;
    // Chart neu rendern
    c.charts[name].update();
}
c.getPerName = async function(name){
	sym = await fetch("https://query1.finance.yahoo.com/v1/finance/search?q="+name).then(d=>d.json()).then(d=>d.quotes.filter(el=>el.exchange=='GER')[0].symbol)
	c.link="https://query1.finance.yahoo.com/v8/finance/chart/"+sym+"?"
	for(n in params){
		c.link+=n+"="+params[n]+"&"
	}
	jsd = await fetch(c.link).then(d=>d.json())
	//c.buildContainer("test2",document.body)
	c.update("test",jsd)
}

