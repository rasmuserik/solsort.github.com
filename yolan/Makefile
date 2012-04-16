CODE=$(shell ls *.yl)
all: $(CODE:.yl=.js)
test-clean:
	rm -rf *.js out test/*.js test/expected/*.js
clean:
	rm -rf *.js out

compiler-test: all
	# cd test; for x in *.yl; do node ../compiler.js compile $$x `echo $$x | sed -e s/yl$$/js/`; done
	# cd test; for x in *.js; do diff $$x expected/$$x || exit 1; done
	install -d test/expected
	cp *.yl test
	cp *.js test/expected
	cd test; for x in *.yl; do node ../compiler.js compile $$x `echo $$x | sed -e s/yl$$/js/`; done
	cd test/expected; for x in *.js; do diff $$x ../$$x || exit 1; done

test: compiler-test

run-server: all
	node server.js

prettyprint: all $(CODE:.yl=.yl-pretty)
	for x in *.yl-pretty; do mv $$x `echo $$x | sed -e s/-pretty$$//`; done

transform: all $(CODE:.yl=.yl-transformed)
	install -d out
	for x in *.yl; do mv $$x-transformed out/$$x; done


compiler: compiler-test
	cd compiler; make

.SUFFIXES: .js .yl .yl-pretty .yl-transformed

.yl.yl-pretty:
	node compiler.js prettyprint $*.yl $*.yl-pretty

.yl.yl-transformed:
	node compiler.js transform $*.yl $*.yl-transformed

.yl.js:
	node compiler/compiler.js compile $*.yl $*.js
