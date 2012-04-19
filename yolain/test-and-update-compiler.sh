# test compiler
rm -rf test-tmp && install -d test-tmp
touch src/*
node build/yolain.js compile 
mv build/*.js test-tmp
node dep/yolain.js compile || exit 1
cd build
for x in *
do
    echo Diffing $x 
    diff $x ../test-tmp/$x || exit 1
done
cd ..
rm -fr test-tmp
cp build/*.js dep
