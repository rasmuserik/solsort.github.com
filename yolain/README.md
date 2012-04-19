# Yolain - YOcto LAnguage INfrastructure

# Next TODO

- general
    - main.yl
        - build system in yolan
        - single runner, for both web and local
        - js-compat-lib across platforms
    - move to separate repository
- app
    - webapp, replace solsort.com
    - benchmarks from the shootout
- language
    - macros
    - type/class system 
- java backend
    - get bootstrapped via rhino (remove dependency when done)
    - code-gen via ow2-asm





# Why a new language?  
I want the following when developing:

- Suitable for doing development directly on mobile phones. Normal programming language syntax does not scale to this kind of screen size and input methods.
- Expressive language - support for functional programming, metaprogramming, ...
- Same code should run on low-end(j2me) as well as highend(html5+JS) phones, embedded systems (memory limitations) and servers with decent performance(optional static typing).

and no programming language have these features yet

## Intended features:

- Simple homoiconic lisp-like syntax for easy metaprogramming
    - Comments are a part of the AST and the AST can be prettyprinted to support editing the source text by hand and editing the AST programmatically, interchangeably.
    - Designed to be editable on mobile phones and similar devices
- Optional typing
- Object oriented
- Anonymous function and support for functional programming
- Ultra portable, eith the following backends:
    - JavaScript - running on node.js and on the web
    - JVM - running on android/j2me/...
    - LLVM - running on embedded systems with 20+KB of ram
- Good host-language integration: 
    - Virtual machine semantics and builtin libraries are taken directly from JavaScript and Java where applicable.
    - The Dynamic type has semantics as JavaScript objects and on the JavaScript platform it gives direct access to the whole host invironment
    - Java classes maps directly to Yolan types, and can be used directly
    - Virtual machine on llvm implemented in the language itself

## Status version 2.0.0 

### Features here
- Compilation to JavaScript
    - Good integration with JavaScript host machine
- Self-hosted compiler
- Pretty-printer for going from AST to source code

### Features not implemented yet
- Type system
    - type analysis
- JVM backend
- LLVM backend
    - Virtual machine/garbage collector (simple stop-the-world generational copycollector + mark-and-compact (sw-for compatibility + inplace for minimal memory usage))

### Changelog
- 120416 New syntax for strings/quoting instead of JS-hack, fewer-macros-more-methods, sample webapp + server, code transformation and cleanup, yl->xml transformation tool
- 120415 Prettyprinter for yolan implemented
- 120414 Bootstrapped the compiler on JavaScript
- Version 1 was a part of my master thesis, and source code has been scrapped while the syntax lives on.


## Language

### Syntax

Code is written as an explicit AST a la lisp, though using square brackets instead of parentheses. Lisp-like quotes are also implemented. Strings are just quoted atoms. Spaces, and newlines, backslashes, quotes and brackets can be escaped with backslash. Example:

    [def helloFunction
        [fn []
            [console log 'hello 'world]]]

    [\'foo bar\n '[\\baz \['quux\] 'hello\ world]]

maps to the following JSON ASTs:

    ["def", "helloFunction", 
        ["fn", [], 
            ["console", "log", ["quote", "hello"], ["quote", "world"]]]]

    ["'foo", "bar\n", ["quote", ["\\baz", "['quux]", ["quote", "hello world"]]]]


### Semantics

Lists are executed with the following semantics

- if the first element in the list is a macro name
    - run the macro - this may even happen on compile-time
- else
    - evaluate the first element in the list (names are looked up as variables, lists are evaluated) to a object
    - the second element of the list is the name of a method on the object (or optionally (TO BE IMPLEMENTED) dispatched to dynamic-method)
    - run the method on the object with the evaluated remainder of list as parameters

### Builtins

- macros
    - `#` - comment
    - `while`
    - `do` 
    - `def` 
    - `set` 
    - `new object` 
    - `new array` 
    - `fn` 
    - `return` 
    - `quote`
    - `if` 
- types
    - JSObject
        - methods are done using dynamic lookup a la javascript method invocation
        - additional methods added to javascript object
            - `[a` get `b]` -> `a[b]`
            - `[a` set `b c]` -> `a[b] = c`
            - `+`
            - `-`
            - `<`
            - `==`
            - `and`
            - `or`
            - `fails`
            - `jsType`
