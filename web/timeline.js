String.prototype.format = function () {
    var o = Array.prototype.slice.call(arguments);
    return this.replace(/{([^{}]*)}/g,
        function (match, capture) {
            var r = o[capture];
            return (typeof r === 'string' || typeof r === 'number') ? r : match;
        }
    );
};

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
  var HEAD = get_head_name();

  var out = "";
  out += "digraph {\n";

  for (var i in commits) {
    var c = commits[i];
    out += "  {0} [label = \"<div class='node_label' title='{1}\n{2}'>{3}</div>\"];\n".format(id(c.sha), c.sha, c.message, c.sha.substr(0,10));
    for (var j in c.parents) {
      out += '  {0} -> {1};\n'.format(id(c.parents[j]), id(c.sha));
    }
  }

  for (var i in refs) {
    var r = refs[i];
    out += "  " + ref_id(r.ref) + " [label = \"" + r.ref + "\"];\n";
    out += "  " + ref_id(r.ref) + "->" + id(r.sha) + ";\n";
  }

  out += "  " + "HEAD" + "->" + ref_id(HEAD) + ";\n";

  out += "}";
  console.log(out);
  try {
    tryDraw(out);
  } catch(e) {
    console.log("");
  }
}