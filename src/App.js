import * as d3 from "d3";
import {useState, useEffect} from 'react';
import './App.scss';

function App() {
 const [cyclistData, setCyclistData] = useState("initialState")

 useEffect(() => {
  async function fetchData(){
    const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
    const data = await response.json();
    console.log(data);
    setCyclistData(data);
  }
  fetchData()
 }, [])
 
 let xScale, yScale;

 let width = 800;
 let height = 600;
 let padding = 90;

 let svg = d3.select("svg")
 let tooltip = d3.select("#tooltip")
      
 const drawCanvas = () => {
   svg.attr("width", width)
      .attr("height", height)
 }

 const generateScales = () => {
  xScale = d3.scaleLinear()
             .domain([d3.min(cyclistData, (d) => d["Year"])- 1, d3.max(cyclistData, (d) => d["Year"]) +1])
             .range([padding, width - padding])
  
  yScale = d3.scaleTime()
             .domain([d3.min(cyclistData, (d) => new Date(d["Seconds"] * 1000)),
                      d3.max(cyclistData, (d) => new Date(d["Seconds"] * 1000))])
             .range([padding, height - padding])
  

 }

 const drawPoints = () => {
  svg.selectAll("circle")
     .data(cyclistData)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("r", 6)
     .attr("data-xvalue", (d) => d["Year"])
     .attr("data-yvalue", (d) =>  new Date(d["Seconds"] * 1000))
     .attr("cx", (d) => xScale(d["Year"]))
     .attr("cy", (d) => yScale(new Date(d["Seconds"] * 1000)))
     .attr("fill", (d) => {
       return d["Doping"] !== "" ? "#47FF63" : "#FEFF47";
     })
     .on("mouseover", (d) => {
       tooltip.style("visibility", "visible")
       tooltip.html(d["Name"] + ": " 
                    + d["Nationality"] 
                    + "<br/>Year: " 
                    + d["Year"] + ", Time: " 
                    + d["Time"] 
                    + (d["Doping"] ? "<br/><br/>" + d["Doping"] : '')
                    )
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY - 28 + "px")
              .style("background-color", d["Doping"] ? "rgba(71, 255, 99, 0.8)" : "rgba(254, 255, 71, 0.8)")
      
      tooltip.attr("data-year", d["Year"])
     })
     .on("mouseout", (d) => {
       tooltip.style("visibility", "hidden")
     })

 }

 const generateAxes = () => {
   let xAxis = d3.axisBottom(xScale) 
                 .tickFormat(d3.format('d'))
   let yAxis = d3.axisLeft(yScale)
                 .tickFormat(d3.timeFormat("%M:%S"))
               
                 
   svg.append('g')
      .call(xAxis)
      .attr("id", "x-axis")
      .attr('transform', 'translate(0, ' + (height - padding) + ')')

  svg.append('g')
     .call(yAxis)
     .attr("id", "y-axis")
     .attr('transform', 'translate(' + padding + ', 0)')
    

 }

useEffect(() => {
  drawCanvas()
  generateScales()
  drawPoints()
  generateAxes()
})

  return (
    <div className="App">
      <svg id="canvas">
        <text id="title" x="50%" y="5%" dominantBaseline="middle" textAnchor="middle" >Doping in Professional Bicycle Racing</text>
        <text id="sub-title" x="50%" y="9%" dominantBaseline="middle" textAnchor="middle" >35 Fastest times up Alpe d'Huez</text>
        <g id="legend">
          <text x="75%" y="45%">No doping allegations</text>
          <rect width="18" height="18" fill="#FEFF47" x="72%" y="42.6%"></rect>
          <text x="75%" y="49%">Riders with doping allegations</text>
          <rect width="18" height="18" fill="#47FF63" x="72%" y="46.7%"></rect>
        </g>
      </svg>
      <div id="tooltip"></div>
      <br/>
      <br/>
      <span id="da3ker">by da3ker</span>
    </div>
  );
}

export default App;
