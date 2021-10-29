import * as data from './files/year_data.json';

export default function define(runtime, observer) {
  const main = runtime.module();
  main
    .variable(observer())
    .define(['Plot', 'data', 'd3', 'width'], function (Plot, data, d3, width) {
      return Plot.plot({
        facet: { data, y: (d) => d.date.getUTCFullYear() },
        fy: { tickPadding: 0, reverse: true },
        x: { label: 'Week of year' },
        y: { tickFormat: Plot.formatWeekday() },
        color: { scheme: 'gnbu', type: 'log' },
        marks: [
          Plot.cell(data, {
            x: (d) => d3.utcWeek.count(d3.utcYear(d.date), d.date),
            y: (d) => d3.utcDay.count(d3.utcWeek(d.date), d.date),
            title: (d) => `${d.views} page views on ${d.date}`,
            fill: 'views',
          }),
        ],
        width,
        marginTop: 0,
        marginRight: 50,
        marginBottom: 35,
        style: { background: '#fff' },
      });
    });
  main
    .variable(observer('data'))
    .define('data', ['ts2date'], function (ts2date) {
      if (!data.items) return data;
      data.items.forEach((d) => (d.date = ts2date(d.timestamp)));
      return data.items;
    });

  main.variable(observer('ts2date')).define('ts2date', function () {
    return (ts) =>
      new Date(
        Date.UTC(
          +ts.slice(0, 4),
          +ts.slice(4, 6) - 1,
          +ts.slice(6, 8),
          +ts.slice(8, 10)
        )
      );
  });
  return main;
}
