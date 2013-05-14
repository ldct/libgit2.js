      var Module = {
        std_out: [],
        preRun: [],
        postRun: [function() {      
          general();
          branch("twig");
          checkout("twig");
          commit("twigglet");
          checkout("master");
          commit("hi");
          show_dir(ls());
          updateGraph();
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
      Module.setStatus('Downloading...');