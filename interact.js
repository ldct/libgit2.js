//build instructions

mkdir build
cd build
cmake ..
cmake --build .
~/tools/emscripten/emcc -s LINKABLE=1 -o libgit.html --compression /home/xuanji/tools/emscripten/third_party/lzma.js/lzma-native,/home/xuanji/tools/emscripten/third_party/lzma.js/lzma-decoder.js,LZMA.decompress libgit2.so