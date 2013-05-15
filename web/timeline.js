function id(sha) {
  return "sha" + sha;
}

function ref_id(ref) {
  return ref.replace(/\//g, "__");
}

function updateGraph() {
  $("#commit_graph_container").empty();

  var commits = revwalk_from_head("/zit");
  var refs = list_refs("/zit");

  var out = "";
  out += "digraph {\n";

  for (var i in commits) {
    var c = commits[i];
    out += "  " + id(c.sha) + " [label = \"" + c.sha.substr(0,10) + "\"];\n";
    for (var j in c.parents) {
      out += "  " + id(c.parents[j]) + " -> " + id(c.sha) +";\n";
    }
  }

  for (var i in refs) {
    var r = refs[i];
    out += "  " + ref_id(r.ref) + " [label = \"" + r.ref + "\"];\n";
    out += "  " + ref_id(r.ref) + "->" + id(r.sha) + ";\n";
  }

  out += "}";
  console.log(out);
  try {
    tryDraw(out);
  } catch(e) {
    console.log("");
  }
}