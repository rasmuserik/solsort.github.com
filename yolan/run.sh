# compile the new compiler
node yolan.js compile yolan.yl yolan.new.js
# compile the new compiler with itself
node yolan.new.js compile yolan.yl yolan.new.js
# compile testcases
node yolan.new.js compile test/yolan.yl test/yolan.js
# make sure the compiled code is as expected, or exit
diff -u test/yolan.js test/yolan.js.expected || exit 1
# install the new compiler
mv yolan.new.js yolan.js
# make the new version of the compiler become the testcase
cp yolan.yl test/yolan.yl
cp yolan.js test/yolan.js.expected
