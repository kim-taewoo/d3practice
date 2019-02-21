// const data = [
//   { width: 200, height: 100, fill: "purple" },
//   { width: 100, height: 60, fill: "red" },
//   { width: 50, height: 30, fill: "yellow" }
// ];

const svg = d3.select("svg");

d3.json('planets.json')
  .then(data => {
    const circles = svg.selectAll('circle')
      .data(data);

    // add attrs to circles already in DOM
    circles
      .attr('cy',200)
      .attr('cx', d=>d.distance)
      .attr('r', d=>d.radius)
      .attr('fill', d=>d.fill)

    // append the enter selection to the DOM
    circles.enter()
      .append('circle')
      .attr('cy',200)
      .attr('cx', d=>d.distance)
      .attr('r', d=>d.radius)
      .attr('fill', d=>d.fill)
  })

// const rects = svg.selectAll("rect");

// rects
//   .data(data)
//   .enter()
//   .append('rect')
//   .attr("width", (d, i, n) => {
//     console.log(n[i]); // 이렇게 하면 arrow functions 에서도 원래 this 를 구현 가능
//     return d.width;
//   })
//   .attr("height", function(d) {
//     console.log(this);
//     return d.height;
//   })
//   .attr("fill", d => d.fill);
