# test compiler
install -d test-tmp
./compile.sh
cd src
for x in `find . -name "*.yl"`
do
    y=`echo $x|sed -e s/yl$/js/`
    echo Compiling $x with new compiler
    node ../build/compiler.js toJavaScript $x ../test-tmp/$y || exit 1
    echo Diffing code from $x old compiler with code from new compiler
    diff ../build/$y ../test-tmp/$y || exit 1
done
