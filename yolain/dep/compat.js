if (!typeof console) {
    console = {};
} else {}

if (!console["log"]) {
    console["log"] = function() {
        return true;
    };
} else {}

if (!console["error"]) {
    console["error"] = console["log"];
} else {}

if (!console["info"]) {
    console["info"] = console["log"];
} else {}

if (!console["warn"]) {
    console["warn"] = console["log"];
} else {}