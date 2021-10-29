import * as data from './files/hour_data.json';

export default function define(runtime, observer) {
  const main = runtime.module();

  main
    .variable(observer())
    .define(["Plot","width","data","formatDate","formatUsage","formatHour","formatDay","pge_height","d3"], function(Plot,width,data,formatDate,formatUsage,formatHour,formatDay,pge_height,d3) {
      return Plot.plot({ 
        width: width,
        height: pge_height,  
        padding: 0,
        x: {axis: "top", tickFormat: formatHour, round: false},
        y: {tickFormat: formatDay, round: false},
        color: {type: "diverging", scheme: "BuRd"},
        marks: [
          Plot.cell(
            data,
            {
              x: d => d.date.getHours(),
              y: d => d3.timeDay(d.date),
              fill: "usage",
              inset: 0.5,
              title: d => `${formatDate(d.date)}\n${formatUsage(d.usage)} kW`
            }
          )
        ]
      })
    });
    main.variable(observer("dateExtent")).define("dateExtent", ["d3","data"], function(d3,data){return(
      d3.extent(data, d => d.date)
      )});

    main.variable(observer("pge_height")).define("pge_height", ["d3","dateExtent"], function(d3,dateExtent){return(
      (d3.timeDay.count(...dateExtent) + 1) * 10
      )});
    main.variable(observer("formatUsage")).define("formatUsage", ["d3"], function(d3){return(
      d3.format(".2f")
      )});
        main.variable(observer("formatDate")).define("formatDate", ["d3"], function(d3){return(
      d3.timeFormat("%B %-d, %-I %p")
      )});
        main.variable(observer("formatDay")).define("formatDay", ["d3"], function(d3)
      {
        const formatMonth = d3.timeFormat("%b %-d");
        const formatDate = d3.timeFormat("%-d");
        return d => (d.getDate() === 1 ? formatMonth : formatDate)(d);
      }
      );
        main.variable(observer("formatHour")).define("formatHour", function()
      {
        return d => d === 0 ? "12 AM" : d === 12 ? "12 PM" : (d % 12) + "";
      }
      );
       
  main
    .variable(observer('data'))
    .define('data', ['ts2date'], function (ts2date) {
      if (!data.items) return data;
      data.items.forEach((d) => (d.date = ts2date(d.date)));
      return data.items;
    });

  main.variable(observer('ts2date')).define('ts2date', function () {
    return (ts) =>
      new Date(ts
      );
  });
  return main;
}
