init = function(){
    v_svg = funAddHtmlE(document.body,"svg")
    const svg = d3.select("svg");
    const width = +svg.attr("width");
    let data = JSON.parse(document.body.querySelector("pre").innerText)    
    
    height = +svg.attr("height");
    margin = { top: 20, right: 30, bottom: 30, left: 50 };
    
        d3.json("data").then(data => {
          const timestamps = data.chart.result[0].timestamp;
          const closes = data.chart.result[0].indicators.quote[0].close;
    
          const dataset = timestamps.map((t, i) => ({
            date: new Date(t * 1000),
            close: closes[i]
          }));
    
          const x = d3.scaleTime()
            .domain(d3.extent(dataset, d => d.date))
            .range([margin.left, width - margin.right]);
    
          const y = d3.scaleLinear()
            .domain([d3.min(dataset, d => d.close) - 5, d3.max(dataset, d => d.close) + 5])
            .nice()
            .range([height - margin.bottom, margin.top]);
    
          const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.close));
    
          svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(10));
    
          svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));
    
          svg.append("path")
            .datum(dataset)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);
            });
}
