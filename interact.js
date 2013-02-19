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

//use this to inspect memory
for (i = 0; i < 100000; i++) {if (Pointer_stringify(i)) {console.log(i, Pointer_stringify(i))}}

//libcore
//ls, cd - directory to list / cd into
var ls = Module.cwrap("ls", 'number', ['string']);
var cd = Module.cwrap("cd", 'number', ['string']);
var touch = Module.cwrap("touch", 'number', ['string']);

/*
//SHA1 converson
//oid_fromstr - oid* out, string str
//oid_fmt - char* out, oid* id
var hex = "fd6e612585290339ea8bf39c692a7ff6a29cb7c3";
var oid_fromstr = Module.cwrap("git_oid_fromstr", 'number', ['number', 'string']);
var oid_fmt = Module.cwrap("git_oid_fmt", 'number', ['number', 'number']);

oid_fromstr(42, hex)
oid_fmt(1, 42)
Pointer_stringify(1) //should print fd6...
*/

//signature
//git_signature_new - signature** out, string name, string email, time_t time, int offset
var signature_new = Module.cwrap("git_signature_new", 'number', ['number', 'string', 'string', 'number', 'number'])
signature_new(1, 'Xuanji Li', 'xuanj@gmail.com', 100, 0)

//commit
//git_repository_init - repository** out, string path, unsigned is_bare
var gri = Module.cwrap("git_repository_init", 'number', ['number', 'string', 'number']);
var grb = Module.cwrap("git_repository_is_bare", 'number', ['number']);
var gro = Module.cwrap("git_repository_open", 'number', ['number', 'string']);
var gre = Module.cwrap("git_repository_is_empty", 'number', ['number']);

//index
//index_add_bypath - index* index, string path
var index_add_bypath = Module.cwrap("git_index_add_bypath", 'number', ['number', 'string']);

//example
var ls = Module.cwrap("ls", 'number', ['string']);
var gri = Module.cwrap("git_repository_init", 'number', ['number', 'string', 'number']);
var signature_new = Module.cwrap("git_signature_new", 'number', ['number', 'string', 'string', 'number', 'number'])
var index_add_bypath = Module.cwrap("git_index_add_bypath", 'number', ['number', 'string']);

signature_new(1, 'Xuanji Li', 'xuanji@gmail.com', 100, 0)
gri(10001, "git", 0)


