# test compiler
rm -rf test-tmp && install -d test-tmp
node build/yolain.js compile
mv build/* test-tmp
node dep/yolain.js compile
cd test-tmp
for x in *
do
    echo Diffing code from $x old compiler with code from new compiler
    diff $x ../build/$x || exit 1
done
