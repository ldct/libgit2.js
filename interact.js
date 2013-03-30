//build instructions

mkdir build
cd build
cmake ..
cmake --build .
~/emscripten/emcc -s LINKABLE=1 -o libgit.js libgit2.so

//bindings

var ls = Module.cwrap("ls", 'number', ['string']);
var general = Module.cwrap("general", 'number', []);
