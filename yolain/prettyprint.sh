cd src
for x in `find . -name "*.yl"`
do
    echo Prettyprint $x 
    node ../dep/compiler/compiler.js prettyprint $x $x || exit 1
done
