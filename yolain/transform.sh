cd src
for x in `find . -name "*.yl"`
do
    echo Transforming $x 
    node ../build/compiler.js transform $x $x || exit 1
done
