// load CSV content using the queue.js library
queue()
    // call the defer method which takes two arguments
    // the format of the data, in this case CSV
    // the second is the path to the file
    .defer(d3.csv, 'static/data/tourism-arrivals.csv')
    // then call the await method which takes one argument
    // the name of the function to call once the data is downloaded
    .await(makeGraphs);
    
// then create the function, which takes two arguments
// the first is error
// the second is a variable that the data from queue.js
// will be passed in to.
function makeGraphs(error, tourismData) {
    // first create a crossfilter, one per site
    // load the data in to the crossfilter
    var ndx = crossfilter(tourismData);
    
    // pass the crossfilter variable (ndx)
    // to the function that's going to draw the graph
    select_destination(ndx);
    show_paris_tourism(ndx);
    show_santorini_tourism(ndx);
    show_rome_tourism(ndx);
    
    // render graphs
    dc.renderAll();
}

function select_destination(ndx) {
    var destination_dim = ndx.dimension(dc.pluck('destination'));
    var destination_group = destination_dim.group();
    
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.open-popup-link')) return;
            
        e.preventDefault();
            
        var destination = e.target.getAttribute('data-destination').toString();
        d3.select('#select-destination').property('display', 'none');
        d3.select('#select-destination').property('value', destination);
        
        menu.replaceFilter(destination);
        dc.events.trigger(function() {
            menu.redrawGroup();
        });
    });
    
    var menu = dc.selectMenu('#select-destination')
        .dimension(destination_dim)
        .group(destination_group);
}

function show_paris_tourism(ndx) {
    // inside the function use the crossfilter to
    // create our dimension, in this case
    // i pluck the year column of the CSV
    var year_dim = ndx.dimension(dc.pluck('year'));
    var favourite_foods_dim = ndx.dimension(dc.pluck('favourite.foods'));
    // group the data on tourist.arrivals dim
    var arrivals_per_year = year_dim.group().reduceSum(dc.pluck('tourist.arrivals'));
    var favourite_foods_votes = favourite_foods_dim.group().reduceSum(dc.pluck('favourite.foods.votes'));
    
    
    // use dc.barChart to create bar chart
    dc.barChart('#paris-tourism')
        .width(322)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(year_dim)
        .group(arrivals_per_year)
        .transitionDuration(250)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        // .xAxisLabel('Arrivals Per Year')
        .elasticY(true)
        .yAxis().ticks(4);
        
    dc.pieChart('#paris-foods')
        .width(322)
        .radius(90)
        .dimension(favourite_foods_dim)
        .group(favourite_foods_votes);
}

function show_santorini_tourism(ndx) {
    // inside the function use the crossfilter to
    // create our dimension, in this case
    // i pluck the destination column of the CSV
    var year_dim = ndx.dimension(dc.pluck('year'));
    var favourite_foods_dim = ndx.dimension(dc.pluck('favourite.foods'));
    // group the data on tourist.arrivals dim
    var arrivals_per_year = year_dim.group().reduceSum(dc.pluck('tourist.arrivals'));
    var favourite_foods_votes = favourite_foods_dim.group().reduceSum(dc.pluck('favourite.foods.votes'));
    
    // use dc.barChart to create bar chart
    dc.barChart('#santorini-tourism')
        .width(322)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(year_dim)
        .group(arrivals_per_year)
        .transitionDuration(250)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        // .xAxisLabel('Arrivals Per Year')
        .elasticY(true)
        .yAxis().ticks(4);
    
    dc.pieChart('#santorini-foods')
        .width(322)
        .radius(90)
        .dimension(favourite_foods_dim)
        .group(favourite_foods_votes);
}

function show_rome_tourism(ndx) {
    // inside the function use the crossfilter to
    // create our dimension, in this case
    // i pluck the destination column of the CSV
    var year_dim = ndx.dimension(dc.pluck('year'));
    var favourite_foods_dim = ndx.dimension(dc.pluck('favourite.foods'));
    // group the data on tourist.arrivals dim
    var arrivals_per_year = year_dim.group().reduceSum(dc.pluck('tourist.arrivals'));
    var favourite_foods_votes = favourite_foods_dim.group().reduceSum(dc.pluck('favourite.foods.votes'));
    
    // use dc.barChart to create bar chart
    dc.barChart('#rome-tourism')
        .width(322)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(year_dim)
        .group(arrivals_per_year)
        .transitionDuration(250)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        // .xAxisLabel('Arrivals Per Year')
        .elasticY(true)
        .yAxis().ticks(4);
    
    dc.pieChart('#rome-foods')
        .width(322)
        .radius(90)
        .dimension(favourite_foods_dim)
        .group(favourite_foods_votes);
}