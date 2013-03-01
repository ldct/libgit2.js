//build instructions

mkdir build
cd build
cmake ..
cmake --build .
~/emscripten/emcc -s LINKABLE=1 -o libgit.html libgit2.so

//example
var ls = Module.cwrap("ls", 'number', ['string']);
var general = Module.cwrap("general", 'number', []);

signature_new(1, 'Xuanji Li', 'xuanji@gmail.com', 100, 0)
gri(10001, "gitteh", 0)
touch("gitteh/readme")
repository_index(20001, 10001)
index_add_bypath(index, "readme")
