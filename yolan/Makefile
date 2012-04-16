all: yolan.js syntax.js jsBackend.js
clean:
	rm *.js

compiler-test: all
	cd test; for x in *.yl; do node ../yolan.js compile $$x `echo $$x | sed -e s/yl$$/js/`; done
	cd test; for x in *.js; do diff $$x expected/$$x || exit 1; done
	cp *.yl test
	cp *.js test/expected
	cd test; for x in *.yl; do node ../yolan.js compile $$x `echo $$x | sed -e s/yl$$/js/`; done
	cd test; for x in *.js; do diff $$x expected/$$x || exit 1; done

compiler: compiler-test
	cd compiler; make

.SUFFIXES: .js .yl .yl-pretty

.yl.yl-pretty:
	node compiler/yolan.js prettyprint $*.yl $*.yl-pretty

.yl.js:
	node compiler/yolan.js compile $*.yl $*.js
