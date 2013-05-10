function id(sha) {
  return "sha" + sha;
}

function updateGraph(graph) {
  $("#commit_graph_container").empty();

  var out = "";
  out += "digraph {\n";

  for (var i in graph) {
    var c = graph[i];
    out += "  " + id(c.sha) + " [label = \"" + c.sha.substr(0,10) + "\"];\n";
    for (var j in c.parents) {
      out += "  " + id(c.parents[j]) + " -> " + id(c.sha);
    }
  }

  out += "}";

  $("#inputGraph").val(out);
}