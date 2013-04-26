  function readTimeline(timeline) {
    while(commit_graph_container.firstChild){
        commit_graph_container.removeChild(commit_graph_container.firstChild);
    }
    window.t = timeline;
    var i, il, v;
    var hashes = {};
    var targetRows = Math.min(200, timeline.length);

    function compare(a, b) {
      return a.date - b.date;
    }

    // create hashes
    for (i = 0; i < timeline.length; i++) {
      v = timeline[i];
      v.children = [];
      hashes[v.sha] = v;
    }
    
    var parents, hash;

    // create reverse references
    for (i=0;i<il;i++) {
      v = timeline[i];
      parents = v.parents;
      for (j=0;j<parents.length;j++) {
        hash = parents[j];
        hashes[hash].children.push(v);
      }
    }

    var canvas = document.createElement('canvas');
    canvas.id = 'graph';
    canvas.width = 120;
    canvas.height = targetRows * 25;
    commit_graph_container.appendChild(canvas);

    // Graphing strategies
    // 1. pending parents first (gitk, jetbrains, git log --graph)
    // 2. Current node first, pending parents, remaining parents (sourcetree, gitx)
    // 3. Current parent, remaining parents, pending parents. (soucetree)
    // 4. force layout (github)

    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'violet'; // lime

    var colors = ['black', 'red', 'green', 'blue'];

    var e;
    var pendingParents = [];
    var nodeTrack = 0;
    var p;
    var LINK_PORTION = 0.28;

    console.time('draw');

    var nodeTracks = [];

    for (i=0;i<targetRows;i++) {
      v = timeline[i];
      e = document.createElement('div');
      e.className = 'log';
      e.innerHTML =  '<span class="sha">' + v.sha.substr(0,10) + '</span> ' + v.message;
      commit_graph_container.appendChild(e);
    }

    for (i=0;i<targetRows;i++) {
      v = timeline[i];

      var pendingParents2 = [];
      for (j=0;j<v.parents.length;j++) {
        pendingParents2.push({targetHash: v.parents[j],
          row: i, length: 0, color: colors[~~(Math.random()*colors.length)]});
      }

      nodeTrack = null;
      var merges = 0;
      for (j=0;j<pendingParents.length;j++) {
        p = pendingParents[j];


        var middleTrack;
        var endTrack;
        var first;
        var tmp;

        middleTrack = p.track;

        if (p.targetHash==v.sha) {
          first = nodeTrack===null;
          if (first) nodeTrack = j;

          endTrack = nodeTrack;

          if (first && pendingParents2.length) {

            tmp= pendingParents2.shift()
            tmp.track = j;
            tmp.color = pendingParents[j].color;
            pendingParents[j] = tmp;

          } else {

            if (p.length==0 && p.prevTrack!=p.track) {
              middleTrack = p.prevTrack;
            }
            pendingParents.splice(j, 1);
            merges++;
            j--;
          }

        } else {
          p.track -= merges;
          endTrack = p.track;
          p.length++;
        }


        // Draw connecting lines
        ctx.strokeStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(getTrackX(p.prevTrack), getRowY(p.row));

        // if (middleTrack!==null)
        ctx.lineTo(getTrackX(middleTrack), getRowY(p.row + LINK_PORTION));
        ctx.lineTo(getTrackX(endTrack), getRowY(i-LINK_PORTION));
        ctx.lineTo(getTrackX(endTrack), getRowY(i));

        ctx.stroke();

        p.row = i;

      }
      if (nodeTrack===null) {
        nodeTrack = 0;
      }

      // TODO
      // Bezier
      // Keep graph in memory?
      // Mouse over interactivity

      for (j=0;j<pendingParents2.length;j++) {
        p = pendingParents2[j];

        p.track = pendingParents.length;
        pendingParents.push(p);
      }

      ctx.stroke();

      // Draw 1/4 -> 1/3 portions of lines
      for (j=0;j<pendingParents.length;j++) {
        p = pendingParents[j];

        // Draw connecting lines
        if (p.length==0) {
          p.prevTrack = nodeTrack;
        } else {
          p.prevTrack = p.track;
        }

      }

      nodeTracks.push(nodeTrack);
    }

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#000';
    for (i=0;i<targetRows;i++) {
      // Draw nodes

      nodeTrack = nodeTracks[i];

      ctx.beginPath();
      ctx.arc(getTrackX(nodeTrack), getRowY(i), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    console.timeEnd('draw');

    function getTrackX(t) {
      return ~~(t * 16 + 8)+0.5;
    }

    function getRowY(t) {
      return t * 25 + 10;
    }

  }

    var cd = Module.cwrap("cd", 'number', ['string']);

    var general = Module.cwrap("general", 'number', []);
    function touch(file, content) {
      Module.ccall("touch", 'number', ['string', 'string'], (file, content));
    }
    var stage = Module.cwrap("stage", 'number', ['string']);
    var commit = Module.cwrap("commit", 'number', ['string']);

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
      for (var i in dir) {
        e = document.createElement('div');
        e.innerHTML =  '<span>' + dir[i] + '</span>';
        directory_listing.appendChild(e);
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
        commit = Module.std_out[i].split(" ");
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