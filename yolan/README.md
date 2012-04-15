
test:

mkdir new
compile.js: compile.yl -> new/compile.js
new/compile.js: compile.yl -> test/new/compile.js
new/compile.js: test/*.yl -> test/*.js

VERIFY: test/*.js === test/*.js.expected 

cp *.yl test
mv new/compile.js compile.js
rmdir new
compile.js: test/*.yl -> test/*.js.expected

