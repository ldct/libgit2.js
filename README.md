# libgit2.js - real git in your browser

Welcome to libgit2.js!

![screenshot](https://raw.github.com/zodiac/libgit2.js/development/libgit2-js-ss.png)

libgit2.js is a port of the libgit2 library (<http://libgit2.github.com>) to javascript. 

I used the emscripten C-to-javascript compiler to compile libgit to javascript.

## Dependencies

Much thanks to the following projects

* libgit2 <http://libgit2.github.com/>
* emscripten <https://github.com/kripken/emscripten/wiki>
* dagre <https://github.com/cpettitt/dagre>

## Features

Here are the features currently supported by libgit2.js. Help us make it better!

* Interact with the filesystem via a simple shell; ``ls``, ``cd``, ``cat``, ``echo``, ``touch``, etc
* Rudimentary gui filesystem explorer

* Create git repository
* ``git log``
* ``git show-ref``
* ``git ls-files``
* ``git add``
* ``git commit``
* ``git checkout``
* ``git branch``

I'd particularly like to know if there's a js library that would be suited for parsing the git commands.

## Building

libgit.js is built using a custom ``CMakeLists.txt`` file that replaces ``gcc`` and related tools with the drop-in replacements provided by emscripten. Check out the ``interact.js`` file for the commands to use it.

Before building, replace this line

``set(EMSCRIPTEN_ROOT_PATH "/home/xuanji/tools/emscripten")``

in ``CMakeLists.txt`` with the path to your emscripten. Also make sure your emscripten supports compressing downloads (<https://github.com/kripken/emscripten/wiki/Compressing-Downloads>)
