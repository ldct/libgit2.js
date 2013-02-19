/*
build instructions

mkdir build
cd build
cmake ..
cmake --build .
~/emscripten/emcc -s LINKABLE=1 -o libgit.html libgit2.so

git_repository_init
Creates a new Git repository in the given folder.

git_repository **	out	pointer to the repo which will be created or reinitialized
const char *	path	the path to the repository
unsigned	is_bare	if true, a Git repository without a working directory is created at the pointed path. If false, provided path will be considered as the working directory into which the .git directory will be created.
*/


//libcore
var ls = Module.cwrap("ls", 'number', ['string']);
var cd = Module.cwrap("cd", 'number', ['string']);
var touch = Module.cwrap("touch", 'number', ['string']);


//SHA1 converson
var hex = "fd6e612585290339ea8bf39c692a7ff6a29cb7c3";
var oid_fromstr = Module.cwrap("git_oid_fromstr", 'number', ['number', 'string']);
var oid_fmt = Module.cwrap("git_oid_fmt", 'number', ['number', 'number']);

oid_fromstr(42, hex)
oid_fmt(1, 42)
Pointer_stringify(1) //should print fd6...

//signature
var signature_new = Module.cwrap("git_signature_new", 'number', ['number', 'string', 'string', 'number', 'number'])
signature_new(1, 'Xuanji Li', 'xuanj@gmail.com', 100, 0)

//commit

//use this to inspect memory
for (i = 0; i < 400; i++) {console.log(i, Pointer_stringify(i))}


var gri = Module.cwrap("git_repository_init", 'number', ['number', 'string', 'number']);
gri(1, "git", 0)
var grb = Module.cwrap("git_repository_is_bare", 'number', ['number']);
var gro = Module.cwrap("git_repository_open", 'number', ['number', 'string']);
var gre = Module.cwrap("git_repository_is_empty", 'number', ['number']);
