//build instructions

mkdir build
cd build
cmake ..
cmake --build .
~/emscripten/emcc -s LINKABLE=1 -o libgit.js libgit2.soh