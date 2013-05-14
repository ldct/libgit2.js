var general = Module.cwrap("general", 'number', []);

function cd(dir) {
  var ret = Module.ccall("cd", 'number', ['string'], [dir]);
  show_dir(ls("."));
  return ret;
}

function touch(file, content) {
  ret = Module.ccall("touch", 'number', ['string', 'string'], [file, content]);
  show_dir(ls("."));
  return ret;
}

var stage = Module.cwrap("stage", 'number', ['string']);

function commit(message) {
  var ret = Module.ccall("commit", 'number', ['string'], [message]);
  return ret;
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
  for (var i in listing.dirs) {
    var entry = $("<span>", {'text': listing.dirs[i], 'class': "dirname_entry"});
    entry.click(function() {cd(this.innerText)});
    $("#directory_listing").append(entry);
  }
  for (var i in listing.files) {
    var entry = $("<span>", {'text': listing.files[i], 'class': "filename_entry"});
    entry.click(function() {load_text(this.innerText)});
    $("#directory_listing").append(entry);
  }

}
function list_refs(s) {
  Module.std_out = [];
  Module.ccall("list_refs_str", 'number', ['string'], [s]);
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
function revwalk_from_head(s) {
  function hex2a(hex) {
      var str = '';
      for (var i = 0; i < hex.length; i += 2)
          str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
  }
  Module.std_out = [];
  Module.ccall("revwalk_from_head_str", 'number', ['string'], [s]);
  var ret = [];
  for (var i in Module.std_out) {
    var commit = Module.std_out[i].split(" ");
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

var branch = Module.cwrap("branch", 'int', ['string']);

function checkout(branch_name) {
  ret = Module.ccall("set_HEAD_to_ref", 'int', ['string'], ["refs/heads/" + branch_name]);
  return ret;
}

$("#save").click(function() {
  if (typeof(current_file) == "undefined") {
    return;
  } else {
    touch(current_file, $("#text_editor").val());
  }
});