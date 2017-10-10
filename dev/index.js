import * as d3 from 'd3';
require('./css/index.scss');



// variables
var margin = { top: 60, right: 145, bottom: 100, left: 60},
    width  = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    x      = d3.scaleTime().range([0,width]),
                
    y      = d3.scaleLinear().range([height, 0]);
    
// draw axis

var xAxis = d3.axisBottom(x);
                
var yAxis = d3.axisLeft(y);
                
                
var svg   = d3.select('.chart')
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height',height + margin.top + margin.bottom)
                .append('g')
                .attr('class','chart')
                .attr('transform','translate('+margin.left + ',' + margin.top + ')');

                
                
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(data){
    var parseDate = d3.timeParse('%Y-%m-%d');
        
         
         data.data.map(function(date){
           date[0] = parseDate(date[0]);
            
        });
        
    var formatCurrency = d3.format('$,.2f');
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    
    x.domain([d3.min(data.data,function(d){ return d[0]}), d3.max(data.data,function(d){return d[0]})]);
    
    y.domain([0,d3.max(data.data,function(d){
        return d[1];
    })]);
    
    var info = d3.select('.info')
                .append('text')
                .text(data.description);
    
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,'+height+')')
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor','end')
        .attr('dx','-0.5em')
        .attr('dy','-0.55em')
        .attr('y',30);
        
    svg.append('g')
        .attr('class','y axis')
        .call(yAxis);
        
    svg.append('text')
        .attr('transform','rotate(-90)')
        .attr('dx','-2em')
        .attr('dy','2em')
        .attr('font-size','15')
        .attr('text-anchor','end')
        .text(' US Gross Domestic Product');
        
    svg.selectAll('rect')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('fill','#71b0e8')
        .attr('x',function(d){
            return x(d[0]);
        })
        .attr('width', function(){ return width/(data.data.length)})
        .attr('y',function(d){
            return y(d[1]);
        })
        .attr('height',function(d){
            return height - y(d[1]);
        })
        .on('mouseover',function(){
                tooltip.style('display',null);
            })
        .on('mouseout',function(){
                tooltip.style('display','none');
                d3.select(this).attr('fill','#71b0e8');
                
            })
        .on('mousemove',function(d){
                var xPos = d3.mouse(this)[0] + 15;
                var yPos = d3.mouse(this)[1] - 100;
                d3.select(this).attr('fill','#c8ceca');
                tooltip.style('opacity','1');
               
                tooltip.attr('transform','translate('+xPos+','+yPos+')');
               
                var currency = formatCurrency(d[1]);
                var year = d[0].getFullYear();
                var month = d[0].getMonth();
                
               tooltip.html('<span class="amount">'+currency + '&nbsp;Billion</span><br/><span class="date">'+year+'-'+months[month]+'</span>') ;
             
            
            });
            
        var tooltip = svg.append('foreignObject')
                            .attr('class', 'tooltip')
                            .attr('display', 'none')
                            .attr('width','130')
                            .attr('height','50')
            tooltip.append('xhtml:span');
     
});