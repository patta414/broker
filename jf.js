var predata,pre;

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

    //const x = d3.scaleTime()
    const xScale = d3.scalePoint()
      .domain(d3.extent(data, d => d.date))
      .range([0, width]);

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
build(predata)
