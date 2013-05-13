//build instructions

mkdir build
cd build
cmake ..
cmake --build .
~/gits/emscripten/emcc -s LINKABLE=1 -O2 -o libgit.js libgit2.so
