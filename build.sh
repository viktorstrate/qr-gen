#!/bin/sh

set -e

build_dir="build"

js="$build_dir/elm.js"
min="$build_dir/elm.min.js"

mkdir -p $build_dir
cp index.html $build_dir

elm make --optimize --output=$js src/Main.elm

npx uglify-js $js --compress 'pure_funcs=[F2,F3,F4,F5,F6,F7,F8,F9,A2,A3,A4,A5,A6,A7,A8,A9],pure_getters,keep_fargs=false,unsafe_comps,unsafe' | npx uglify-js --mangle --output $min

echo "Compiled size:$(wc -c $js) bytes  ($js)"
echo "Minified size:$(wc -c $min) bytes  ($min)"
echo "Gzipped size: $(gzip -c $min | wc -c) bytes"