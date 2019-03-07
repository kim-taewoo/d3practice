// select the svg container first
const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', 600)
    .attr('height', 600);

// create margins & dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// create axes groups
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)

const yAxisGroup = graph.append('g');

// y 축에서의 scale
const y = d3
.scaleLinear()
.range([graphHeight, 0]);

// const min = d3.min(data, d => d.orders);
// const max = d3.max(data, d => d.orders);
// const extent = d3.extent(data, d=>d.orders); // min, max 를 한 번에

// console.log(min, max, extent)

const x = d3
.scaleBand()
.range([0, graphWidth])
.paddingInner(0.2) // bar 사이의 것들
.paddingOuter(0.2); // 그래프 최외각 양쪽


const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
  .ticks(3) // ticks(3) 으로 3개로 해달라고 해서 무조건 3 개만 나오는 게 아니다. 적당히 맞춰줌..말안드러
  .tickFormat(d => d + ' orders') 


const t = d3.transition().duration(1500);
  
const update = (data) => {
  
  
  
  y.domain([0, d3.max(data, d=>d.orders)]);
  
  x.domain(data.map(item => item.name))
  const rects = graph.selectAll("rect")
  .data(data);
  
  rects.exit().remove();
  
  // update current shapes in dom
  rects.attr('width', x.bandwidth)
  .attr('fill', 'orange')
  .attr('x', d => x(d.name))
  // .transition(t)
  //   .attr('height', d => graphHeight - y(d.orders))
  //   .attr('y', d => y(d.orders))

  // append the enter selection to the DOM
  rects
  .enter()
  .append("rect")
    // .attr("width", x.bandwidth)
    // .attr("width", 0)
    .attr("fill", "orange")
    .attr('height', 0)
    // .attr("x", (d, i) => i * 70);
    .attr("x", d => x(d.name))
    .attr("y", d=> graphHeight)
    .merge(rects) // 이걸로 enter selection 과 현재 dom 의 rects 를 한꺼번에 묶어서 이 아래 함수를 함께 적용.
    .transition(t)
      // 시작 설정 이후에 들여쓰기로 transition 부분 따로보이게 하면 좋다.
      .attrTween('width',widthTween)
      .attr('y', d => y(d.orders))
      .attr('height', d => graphHeight - y(d.orders))

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);
    
  xAxisGroup.selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'orange')
}

// d3.json("menu.json").then(data => {
// db.collection('dishes').get().then(res => {
//   var data = [];
//   res.docs.forEach(doc => {
//     data.push(doc.data());
//   })
  
//   update(data);

//   d3.interval(()=>{
//     data.pop()
//     update(data);
//   },3000)
// });
var data = [];
db.collection('dishes').onSnapshot(res=>{
  // console.log(res.docChanges())
  res.docChanges().forEach(change => {
    console.log(change.doc.data());
    const doc = {...change.doc.data(), id: change.doc.id}
    switch (change.type) {
      case 'added':
        data.push(doc)
        break
      case 'modified':
        const index = data.findIndex(item => item.id == doc.id);
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !==doc.id);
      default:
        break;
    }
  });
  update(data);
})


// TWEENS

const widthTween = (d) => {
  // define interpolation
  // d3.interpolate returns a function which we call 'i'
  let i = d3.interpolate(0, x.bandwidth());



  // return a function which takes in a time ticker 't'
  // 그니까 i 는 위치비례 t 는 duration 동안의 시간비례
  return function(t) {
    
    // return the value from passing the ticker into the interpolation
    return i(t);
  }
}