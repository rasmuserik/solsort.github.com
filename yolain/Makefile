CODE=$(shell ls *.yl)

CLASSPATH=build/dep

all: $(CODE:.yl=.js)
test-clean:
	rm -rf *.il *.js out test/*.js test/expected/*.js
clean:
	rm -rf *.il *.js out

$(CLASSPATH)/org/mozilla/javascript/tools/shell/Main.class: 
	install -d $(CLASSPATH)
	wget http://download.forge.objectweb.org/asm/asm-4.0.jar
	yes | unzip asm-4.0.jar -d $(CLASSPATH) 
	rm asm-4.0.jar
	wget ftp://ftp.mozilla.org/pub/mozilla.org/js/rhino1_7R3.zip; 
	yes | unzip rhino1_7R3.zip
	yes | unzip rhino1_7R3/js.jar -d $(CLASSPATH)
	rm -rf rhino1_7R3*

compiler-test: all
	# cd test; for x in *.yl; do node ../compiler.js compile $$x `echo $$x | sed -e s/yl$$/js/`; done
	# cd test; for x in *.js; do diff $$x expected/$$x || exit 1; done
	install -d test/expected
	cp *.yl test
	cp *.js test/expected
	cd test; for x in *.yl; do node ../compiler.js toJavaScript $$x `echo $$x | sed -e s/yl$$/js/`; done
	cd test/expected; for x in *.js; do diff $$x ../$$x || exit 1; done

test: compiler-test

run-server: all
	node server.js

prettyprint: all $(CODE:.yl=.yl-pretty)
	for x in *.yl-pretty; do mv $$x `echo $$x | sed -e s/-pretty$$//`; done

transform: all $(CODE:.yl=.yl-transformed)
	for x in *.yl; do mv $$x-transformed $$x; done


compiler: compiler-test
	cd compiler; make

java: fib-compile-example.il
	javac com/solsort/yolain/Main.java
	java com.solsort.yolain.Main run fib-compile-example.il

fib-compile-example.il: all


.SUFFIXES: .js .yl .yil .yl-pretty .yl-transformed .il

.yl.yl-pretty: all
	node compiler.js prettyprint $*.yl $*.yl-pretty

.yl.yl-transformed: all
	node compiler.js transform $*.yl $*.yl-transformed

.yl.js:
	node compiler/compiler.js toJavaScript $*.yl $*.js

.yl.il: all
	node compiler.js toIntermediateLanguage $*.yl $*.il
