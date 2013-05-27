var Module = {
  std_out: [],
  preRun: [],
  postRun: [function() {      
    Module.ccall("general", 'number', [] ,[]);
    make_branch("twig");
    checkout("twig");
    commit("twigglet");
    checkout("master");
    commit("hi");
    show_dir(ls());
    updateGraph();
    $("#terminal_drag").show();
    
  }],
  print: function(text) {
    Module.std_out.push(text);
  },
  printErr: function(text) {
    console.log("error: ", text);
  },
  setStatus: function(text) {
    if (Module.setStatus.interval) clearInterval(Module.setStatus.interval);
    var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
    var statusElement = document.getElementById('status');
    var progressElement = document.getElementById('progress');
    if (m) {
      text = m[1];
      progressElement.value = parseInt(m[2])*100;
      progressElement.max = parseInt(m[4])*100;
      progressElement.hidden = false;
    } else {
      progressElement.value = null;
      progressElement.max = null;
      progressElement.hidden = true;
    }
    statusElement.innerHTML = text;
  },
  totalDependencies: 0,
  monitorRunDependencies: function(left) {
    this.totalDependencies = Math.max(this.totalDependencies, left);
    Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
  }
};
Module.setStatus('Downloading...(~2 MB)');

var decompressWorker = new Worker('decompress.js');
var decompressCallbacks = [];
var decompressions = 0;
Module["decompress"] = function(data, callback) {
  var id = decompressCallbacks.length;
  decompressCallbacks.push(callback);
  decompressWorker.postMessage({ data: data, id: id });
  if (Module['setStatus']) {
    decompressions++;
    Module['setStatus']('Decompressing...');
  }
};
decompressWorker.onmessage = function(event) {
  decompressCallbacks[event.data.id](event.data.data);
  decompressCallbacks[event.data.id] = null;
  if (Module['setStatus']) {
    decompressions--;
    if (decompressions == 0) {
      Module['setStatus']('');
      FS.checkStreams = function() {return;};//TODO: file bug report against too many FS.streams
    }
  }
};
var compiledCodeXHR = new XMLHttpRequest();
compiledCodeXHR.open('GET', 'libgit.js.compress', true);
compiledCodeXHR.responseType = 'arraybuffer';
compiledCodeXHR.onload = function() {
  var arrayBuffer = compiledCodeXHR.response;
  if (!arrayBuffer) throw('Loading compressed code failed.');
  var byteArray = new Uint8Array(arrayBuffer);
  Module.decompress(byteArray, function(decompressed) {
    var source = Array.prototype.slice.apply(decompressed).map(function(x) { return String.fromCharCode(x) }).join(''); // createObjectURL instead?
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.innerHTML = source;
    document.body.appendChild(scriptTag);
  });
};
compiledCodeXHR.send(null);