Java.perform(function () {
    console.log("[+] Root detection bypass loaded");

    var System = Java.use("java.lang.System");
    System.exit.implementation = function (code) {
        console.log("[+] Blocked System.exit(" + code + ")");
    };

    var RootCheck = Java.use("sg.vantagepoint.a.c");

    RootCheck.a.implementation = function () {
        console.log("[+] Bypass root check a()");
        return false;
    };

    RootCheck.b.implementation = function () {
        console.log("[+] Bypass root check b()");
        return false;
    };

    RootCheck.c.implementation = function () {
        console.log("[+] Bypass root check c()");
        return false;
    };
});