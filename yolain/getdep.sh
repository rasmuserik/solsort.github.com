export CLASSPATH=dep/java
install -d $CLASSPATH
wget http://download.forge.objectweb.org/asm/asm-4.0.jar
yes | unzip asm-4.0.jar -d $CLASSPATH 
rm asm-4.0.jar
wget ftp://ftp.mozilla.org/pub/mozilla.org/js/rhino1_7R3.zip; 
yes | unzip rhino1_7R3.zip
yes | unzip rhino1_7R3/js.jar -d $CLASSPATH
rm -rf rhino1_7R3*

