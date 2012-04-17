package com.solsort.yolain;
import java.io.*;
import java.util.Arrays;

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
            System.out.println(java.util.Arrays.deepToString((Object [])o));
        }
    }
}

