echo NOT HERE YET
exit 1
cd src
for x in `find . -name "*.yl"`
do
    echo Compiling $x 
    node ../dep/compiler/compiler.js toJavaScript $x `echo ../build/$x |sed -e s/yl$/js/` || exit 1
done
