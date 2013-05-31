function cd(dir) {
  return Module.ccall("cd", 'number', ['string'], [dir]);
}

function touch(file, content) {
  return Module.ccall("touch", 'number', ['string', 'string'], [file, content]);
}

function stage(file) {
  return Module.ccall("stage", 'number', ['string'], [file]);
}

function commit(message) {
  return Module.ccall("commit", 'number', ['string'], [message]);
}

function ls(dir) {
  if (typeof(dir) === 'undefined') {
    dir = ".";
  }
  Module.std_out = [];
  Module.ccall("ls", 'number', ['string'], [dir]);
  var files = [];
  var dirs = [];
  for (var i in Module.std_out) {
    f = Module.std_out[i];
    if ((f == "/.") || (f.length == 0)) {
      continue;
    }
    if (f[0] == "/") {
      dirs.push(f.substr(1));
    } else {
      files.push(f);
    }
  }
  return {'files': files, 'dirs': dirs};
}

function show_dir(listing) {
  $("#directory_listing").empty();
  var index = show_index("/hello-world-app");
  for (var i in listing.dirs) {
    var entry = $("<span>", {
      'text': listing.dirs[i], 
      'class': "dirname_entry"
    });
    entry.click(function() {cd(this.innerText); show_dir(ls("."))});
    $("#directory_listing").append(entry);
  }
  for (var i in listing.files) {
    var f = listing.files[i];
    var entry = $("<span>", {
      'text': f,
      'class': ((index.indexOf(f) >= 0) ? "filename_entry" : "filename_entry_untracked")
    });
    entry.click(function() {load_text(this.innerText)});
    $("#directory_listing").append(entry);
  }

}
function list_refs() {
  Module.std_out = [];
  Module.ccall("list_refs_str", 'number', ['string'], ["/hello-world-app"]);
  var ret = [];
  for (i in Module.std_out) {
    pair = Module.std_out[i].split(" ");
    ret.push({'sha': pair[0], 'ref': pair[1]});
  }
  return ret;
}

function cat(filename) {
  Module.std_out = [];
  Module.ccall("cat", 'number', ['string'], [filename]);
  return Module.std_out.join("\n");
}

function load_text(filename) {
  current_file = filename;
  $("#text_editor").val(cat(filename));
}

function show_index(s) {
  Module.std_out = [];
  Module.ccall("show_index_str", 'number', ['string'], [s]);
  return Module.std_out.slice();
}

function parse_revwalk_output(std_out) {  var ret = [];
  function hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2)
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
  }
  for (var i in std_out) {
    var commit = std_out[i].split(" ");
    var sha = commit.shift();
    var p_count = commit.shift();
    var parents = [];
    for (var i = 0; i < p_count; i++) {
      parents.push(commit.shift());
    }
    var message = commit.shift();
    ret.push({sha: sha, parents: parents, message: hex2a(message)});
  }
  return ret;
}
//not callable from command line
function revwalk_all() {
  Module.std_out = [];
  Module.ccall("revwalk_all", 'number', ['string'], ["/hello-world-app"]);
  return parse_revwalk_output(Module.std_out);
}

function revwalk_from_sha(sha) {
  Module.std_out = [];
  Module.ccall("revwalk_from_sha", 'number', ['string', 'string'], ["/hello-world-app", sha]);
  return parse_revwalk_output(Module.std_out);
}

function make_branch(branch_name) {
  return Module.ccall("branch", 'int', ['string'], [branch_name]);
}

function checkout(target) {
  var checkout_ref = Module.cwrap("checkout_ref", 'int', ['string']);
  var checkout_sha_prefix = Module.cwrap("checkout_sha_prefix", 'int', ['string']);
  if (checkout_ref("refs/heads/" + target) == 0) {
    updateGraph();
    return 0;
  } else {
    ret = checkout_sha_prefix(target);
    updateGraph();
    return ret;
  }
}

$("#save").click(function() {
  if (typeof(current_file) == "undefined") {
    return;
  } else {
    touch(current_file, $("#text_editor").val());
  }
});

function get_head_name() {
  Module.ccall("get_head_name", 'string', [], []);
  return Module.ccall("get_head_name", 'string', [], []);
}

function repository_head_detached() {
  return Module.ccall("repository_head_detached", 'int', [], []);
}

function diff_head_workdir() {
  Module.std_out = [];
  Module.ccall("diff_head_workdir_str", 'int', ['string'], ['/hello-world-app']);
  return Module.std_out.join('\n');
}

function diff_head_index() {
  Module.std_out = [];
  Module.ccall("diff_head_index_str", 'int', ['string'], ['/hello-world-app']);
  return Module.std_out.join('\n');
}

function diff_index_workdir() {
  Module.std_out = [];
  Module.ccall("diff_index_workdir_str", 'int', ['string'], ['/hello-world-app']);
  return Module.std_out.join('\n');
}

function diff_all() {
  console.log("head-index:", diff_head_index());
  console.log("head-workdir:", diff_head_workdir());
  console.log("index-workdir:", diff_index_workdir());
}