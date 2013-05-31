if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

function git_eval(command) {
	if (command === "help") {
		var help = "";
		help += "explorer\n";
		help += "ls [<directory>]\n";
		help += "cd <directory>\n";
		help += "cat <filename>\n";
		help += "echo \"<ontent>\"\n";
		help += "echo \"<content>\" > <filename>\n";
		help += "touch <filename>\n";
		help += "git log [<committish>]\n";
		help += "git show-ref\n";
		help += "git ls-files\n";
		help += "git add <file>\n";
		help += "git commit -m \"<message>\"\n";
		help += "git checkout <branch name>\n";
		help += "git branch <branch name>";
		return help;
	}

	if (command === "explorer") {
		$("#explorer_drag").show();
		return;
	}
	if (command.startsWith("ls ") || command === "ls") {
		var directory = (command === "ls") ? "." : command.split("ls ")[1];
		var out = "";
		var l = ls(directory);
		for (var i in l.dirs) {
			out += l.dirs[i] + " ";
		}
		for (var j in l.files) {
			out += l.files[j] + " ";
		}
		out = out.substr(0, out.length - 1);
		return out;
	}
	if (command.startsWith("cd ")) {
		var directory = command.split("cd ")[1];
		cd(directory);
		show_dir(ls("."));
		return;
	}
	if (command.startsWith("echo ")) {
		function stripString(s) {
			console.log("stripping", s)
			if (s[0] == "\"" && s[s.length - 1] == "\"") {
				return s.substr(1, s.length - 2);
			} else {
				return s;
			}
		}
		var rest = command.substr(5);
		var args = rest.split(" > ");
		if (args.length < 2) {
			return stripString(rest);
		}
		touch(args[1], stripString(args[0]));
		return;
	}
	if (command.startsWith("touch ")) {
		var args = command.split("touch ")[1];
		args = args.split(" ");
		var filename = args[0];
		args.shift();
		var contents = args.join(" ");
		touch(filename, contents);
		show_dir(ls("."));
		return;
	}
	if (command === "git log") {
		var res = revwalk_all();
		var out = "";
		for (var i = 0; i < res.length; i++) {
			out += "commit " + res[i].sha;
			out += "\n";
			out += "\t" + res[i].message.replace(/\n/g, "\n\t");
			if (i + 1 != res.length) {out += "\n";}
		}
		return out;
	}
	if (command.startsWith("cat ")) {
		var filename = command.split("cat ")[1];
		return cat(filename);
	}
	if (command.startsWith("git add ")) {
		var filename = command.split("git add ")[1];
		stage(filename);
		return;
	}
	if (command.startsWith("git commit -m ")) {
		var message = command.split("git commit -m ")[1];
		message = message.slice(1, message.length - 1);
		commit(message.replace(/\\n/g, '\n'));
		updateGraph();
		return;
	}
	if (command == "git show-ref") {
		var out = "";
		var refs = list_refs(".");
		for (var i in refs) {
			r = refs[i];
			out += r.sha + " " + r.ref + "\n";
		}
		out = out.substr(0, out.length - 1);
		return out;
	}
	if (command == "git ls-files") {
		var index = show_index(".");
		return index.join("\n");
	}
	if (command.startsWith("git checkout ")) {
		var branch_name = command.split("git checkout ")[1];
		checkout(branch_name);
		return "checked out " + branch_name;
	}
	if (command.startsWith("git branch ")) {
		var branch_name = command.split("git branch ")[1];
		console.log(branch_name);
		make_branch(branch_name);
		updateGraph();
		return "created new branch " + branch_name;
	}
	return "command not recognised";
}