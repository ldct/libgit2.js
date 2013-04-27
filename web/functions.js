var general = Module.cwrap("general", 'number', []);

function cd(dir) {
  var ret = Module.ccall("cd", 'number', ['string'], [dir]);
  show_dir(ls("."));
  return ret;
}

function touch(file, content) {
  return Module.ccall("touch", 'number', ['string', 'string'], [file, content]);
}

var stage = Module.cwrap("stage", 'number', ['string']);

function commit(message) {
  var ret = Module.ccall("commit", 'number', ['string'], [message]);
  readTimeline(revwalk_from_head("/zit"));
  return ret;
}

function ls(s) {
  if (typeof(s) === 'undefined') {
    s = ".";
  }
  Module.std_out = [];
  Module.ccall("ls", 'number', ['string'], [s]);
  var ret = [];
  splitted = Module.std_out[0].split(" ")
  for (i in splitted) {
    f = splitted[i];
    if ((f.length > 0) & (f !== ".") & (f != "..")) {
      ret.push(f);
    }
  }
  return ret;
}

function show_dir(dir) {
  $("#directory_listing").empty();
  for (var i in dir) {
    $("#directory_listing").append($("<span>" + dir[i] + " </span>"));
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