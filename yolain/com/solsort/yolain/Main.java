package com.solsort.yolain;
import java.io.*;
import java.util.*;

class YolanObject {
}

class YolanFunction {
    String name;
    Object [] argNames;
    Object [] args;
    Object [] localNames;
    Object [] locals;
    Object [] globalNames;
    Object [] globals;
    Object [] code;
    int[] labels;
    YolanFunction(String name, Object[] code) {
        this.name = name;
        if(code[0] instanceof String) {
            Object[] codes = (Object[])code[4];
            Stack s = new Stack();
            int i;
            int pos = 0;
            int[] buffer = new int[codes.length];
            for(i = 0; i < codes.length; ++i) {
                Object[] op = (Object[]) codes[i];
                String opName = op[0].toString();
                if(opName.equals("num")) {
                    op[1] = new Integer((String)op[1]);
                }
                if(opName.equals("label")) {
                    op[1] = new Integer((String)op[1]);
                    buffer[((Integer)op[1]).intValue()] = i;
                    ++pos;
                }
            }
            labels = new int[pos];
            for(i = 0; i < labels.length; ++i) {
                labels[i] = buffer[i];
            }
            args = new Object[argNames.length];
            code[0] = labels;
        }
        labels = (int[]) code[0];
        argNames = (Object[]) code[1];
        localNames = (Object[]) code[2];
        globalNames = (Object[]) code[3];
        this.code = (Object[]) code[4];
    }
    public Object call(Object self, Object[] args) {
        Stack stack = new Stack();
        int pos = 0;
        while(pos < code.length) {
            Object[] op = (Object[])code[pos];
            String opname = (String)op[0];
            if(opname.equals("num")) {
                stack.push(op[1]);
            } else {
                System.out.println("UNKNOWN OP: " + opname);

            }
            System.out.println(opname + " "+ stack);
            ++pos;
        }
        return null;
    }
    public String toString() {
        return "YolanFunction " + name + Arrays.toString(argNames);
    }
}

class YolanModule {
    Hashtable fns;
    YolanModule(Object []code) {
        fns = new Hashtable();
        for(int i = 0; i < code.length; ++i) {
            fns.put(((Object[])code[i])[0], new YolanFunction(((Object[])code[i])[0].toString(), (Object[])code[i]));
        }
        System.out.println(fns.toString());
    }
    void run() {
        ((YolanFunction)fns.get("entry")).call(null, new Object[0]);
    }
}
class Main {
    static Object parse(InputStreamReader is) throws Exception{
        int len = is.read();
        int type = is.read();
        if(type == '{') {
            Object result[] = new Object[len];
            for(int i = 0; i < len; ++i) {
                result[i] = parse(is);
            }
            return result;
        } 
        if(type == '"') {
            char buf[] = new char[len];
            is.read(buf, 0, len);
            return String.valueOf(buf);
        }
        throw new Error("unexpected type:" + String.valueOf(type) + " with length:" + len);
    }
    public static void main(String args[]) throws Exception {
        if(args[0].equals("run")) {
            Object o = parse(new InputStreamReader(new FileInputStream(args[1]), "UTF8"));
            //System.out.println(java.util.Arrays.deepToString((Object [])o));
            YolanModule yl = new YolanModule((Object [])o);
            yl.run();
        }
    }
}

