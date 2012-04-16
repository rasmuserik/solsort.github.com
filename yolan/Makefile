CODE=$(shell ls *.yl)
all: $(CODE:.yl=.js)
clean:
	rm *.js

compiler-test: all
	cd test; for x in *.yl; do node ../compiler.js compile $$x `echo $$x | sed -e s/yl$$/js/`; done
	cd test; for x in *.js; do diff $$x expected/$$x || exit 1; done
	cp *.yl test
	cp *.js test/expected
	cd test; for x in *.yl; do node ../compiler.js compile $$x `echo $$x | sed -e s/yl$$/js/`; done
	cd test; for x in *.js; do diff $$x expected/$$x || exit 1; done

test: compiler-test

prettyprint-all: $(CODE:.yl=.yl-pretty)
	for x in *.yl-pretty; do mv $$x `echo $$x | sed -e s/-pretty$$//`; done

compiler: compiler-test
	cd compiler; make

.SUFFIXES: .js .yl .yl-pretty

.yl.yl-pretty:
	node compiler/compiler.js prettyprint $*.yl $*.yl-pretty

.yl.js:
	node compiler/compiler.js compile $*.yl $*.js
