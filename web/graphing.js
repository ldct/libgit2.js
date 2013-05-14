function tryDraw(digraph) {
  var result;

  result = dagre.dot.toObjects(digraph);
  result.edges.forEach(function(e) { if (!e.label) { e.label = ""; } });

  result.nodes.forEach(function(node) {
    node.inEdges = [];
    node.outEdges = [];
  });
  result.edges.forEach(function(edge) {
    edge.source.outEdges.push(edge);
    edge.target.inEdges.push(edge);
  });

  draw(result.nodes, result.edges);


}

var svg = d3.select("svg");
var svgGroup = svg.append("g").attr("transform", "translate(5, 5)");
var nodes, edges;
function draw(nodeData, edgeData) {
  // D3 doesn't appear to like rebinding with the same id but a new object,
  // so for now we remove everything.
  svgGroup.selectAll("*").remove();

  nodes = svgGroup
    .selectAll("g .node")
    .data(nodeData, function(d) { return d.id; });

  var nodeEnter = nodes
    .enter()
    .append("g")
      .attr("class", "node")
      .attr("id", function(d) { return "node-" + d.id; })
      .each(function(d) { d.nodePadding = 10; });
  nodeEnter.append("rect");
  addLabels(nodeEnter);
  nodes.exit().remove();

  edges = svgGroup
    .selectAll("g .edge")
    .data(edgeData, function(d) { return d.id; });

  var edgeEnter = edges
    .enter()
    .append("g")
      .attr("class", "edge")
      .attr("id", function(d) { return "edge-" + d.id; })
      .each(function(d) { d.nodePadding = 0; })
  edgeEnter
    .append("path")
      .attr("marker-end", "url(#arrowhead)");
  addLabels(edgeEnter);
  edges.exit().remove();

  recalcLabels();

  // Add zoom behavior to the SVG canvas
  svg.call(d3.behavior.zoom().on("zoom", function redraw() {
    svgGroup.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
  }));

  // Run the actual layout
  dagre.layout()
    .nodes(nodeData)
    .edges(edgeData)
    .debugLevel(2)
    .run();

  // Ensure that we have at least two points between source and target
  edges.each(function(d) { ensureTwoControlPoints(d); });

  nodes.call(d3.behavior.drag()
    .origin(function(d) { return {x: d.dagre.x, y: d.dagre.y}; })
    .on('drag', function (d, i) {
      d.dagre.x = d3.event.x;
      d.dagre.y = d3.event.y;
      d.outEdges.forEach(function(e) {
        var points = e.dagre.points;
        if (points[0].y === points[1].y) {
          points[1].y += d3.event.dy;
        }
        points[0].y += d3.event.dy;
        if (points[1].y < points[0].y) {
          points[0].y = points[1].y;
        }
        translateEdge(e, d3.event.dx, 0);
      });
      d.inEdges.forEach(function(e) {
        var points = e.dagre.points;
        if (points[1].y === points[0].y) {
          points[0].y += d3.event.dy;
        }
        points[1].y += d3.event.dy;
        if (points[0].y > points[1].y) {
          points[1].y = points[0].y;
        }
        translateEdge(e, d3.event.dx, 0);
      });
      update();
    }));

  edges
    .call(d3.behavior.drag()
    .on('drag', function (d, i) {
      translateEdge(d, d3.event.dx, d3.event.dy);
      update();
    }));

  edgeEnter
    .selectAll("circle.cp")
    .data(function(d) {
      d.dagre.points.forEach(function(p) { p.parent = d; });
      return d.dagre.points.slice(0).reverse();
    })
    .enter()
    .append("circle")
      .attr("class", "cp")
      .call(d3.behavior.drag()
        .on("drag", function(d) {
          d.y += d3.event.dy;
          translateEdge(d.parent, d3.event.dx, 0);
          update();
        }));

  // Re-render
  update();
}

function addLabels(selection) {
  var labelGroup = selection
    .append("g")
      .attr("class", "label");
  labelGroup.append("rect");

  var foLabel = labelGroup
    .filter(function(d) { return d.label[0] === "<"; })
    .append("foreignObject")
      .attr("class", "htmllabel");

  foLabel
    .append("xhtml:div")
      .style("float", "left");

  labelGroup
    .filter(function(d) { return d.label[0] !== "<"; })
    .append("text")
}

function recalcLabels() {
  var labelGroup = svgGroup.selectAll("g.label");

  var foLabel = labelGroup
    .selectAll(".htmllabel")
    // TODO find a better way to get the dimensions for foriegnObjects
    .attr("width", "100000");

  foLabel
    .select("div")
      .html(function(d) { return d.label; })
      .each(function(d) {
        d.width = this.clientWidth;
        d.height = this.clientHeight;
        d.nodePadding = 0;
      });

  foLabel
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; });

  var textLabel = labelGroup
    .filter(function(d) { return d.label[0] !== "<"; });

  textLabel
    .select("text")
      .attr("text-anchor", "left")
        .append("tspan")
        .attr("dy", "1em")
        .text(function(d) { return d.label; });

  labelGroup
    .each(function(d) {
      var bbox = this.getBBox();
      d.bbox = bbox;
      if (d.label.length) {
        d.width = bbox.width + 2 * d.nodePadding;
        d.height = bbox.height + 2 * d.nodePadding;
      } else {
        d.width = d.height = 0;
      }
    });
}

function ensureTwoControlPoints(d) {
  var points = d.dagre.points;
  if (!points.length) {
    var s = e.source.dagre;
    var t = e.target.dagre;
    points.push({ x: Math.abs(s.x - t.x) / 2, y: Math.abs(s.y + t.y) / 2 });
  }

  if (points.length === 1) {
    points.push({ x: points[0].x, y: points[0].y });
  }
}

// Translates all points in the edge using `dx` and `dy`.
function translateEdge(e, dx, dy) {
  e.dagre.points.forEach(function(p) {
    p.x += dx;
    p.y += dy;
  });
}

function update() {
  nodes
    .attr("transform", function(d) {
      return "translate(" + d.dagre.x + "," + d.dagre.y +")"; })
    .selectAll("g.node rect")
      .attr("x", function(d) { return -(d.bbox.width / 2 + d.nodePadding); })
      .attr("y", function(d) { return -(d.bbox.height / 2 + d.nodePadding); })
      .attr("width", function(d) { return d.width; })
      .attr("height", function(d) { return d.height; });

  edges
    .selectAll("path")
    .attr("d", function(d) {
      var points = d.dagre.points.slice(0);
      var source = dagre.util.intersectRect(d.source.dagre, points[0]);
      var target = dagre.util.intersectRect(d.target.dagre, points[points.length - 1]);
      points.unshift(source);
      points.push(target);
      return d3.svg.line()
        .x(function(e) { return e.x; })
        .y(function(e) { return e.y; })
        .interpolate("linear")
        (points);
    });

  edges
    .selectAll("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

  svgGroup
    .selectAll("g.label rect")
    .attr("x", function(d) { return -d.nodePadding; })
    .attr("y", function(d) { return -d.nodePadding; })
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; });

  nodes
    .selectAll("g.label")
    .attr("transform", function(d) { return "translate(" + (-d.bbox.width / 2) + "," + (-d.bbox.height / 2) + ")"; })

  edges
    .selectAll("g.label")
    .attr("transform", function(d) {
      var points = d.dagre.points;
      var x = (points[0].x + points[1].x) / 2;
      var y = (points[0].y + points[1].y) / 2;
      return "translate(" + (-d.bbox.width / 2 + x) + "," + (-d.bbox.height / 2 + y) + ")";
    });
}