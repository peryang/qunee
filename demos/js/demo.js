/**
* This file is part of Qunee for HTML5.
* Copyright (c) 2015 by qunee.com
**/
$(function () {
    var Colors = {
        blue: "#2898E0",
        yellow: "#fcfb9b",
        red: "#E21667",
        dark: "#1D4876",
        gray: "#888"
    }

    var Styles = Q.Styles;
    var Defaults = Q.Defaults;
    Defaults.FONT_FAMILY = "Verdana, sans-serif";
    Defaults.FONT_STYLE = "lighter";
    Defaults.ANIMATION_MAXTIME = 1500;
    if (Q.isIE) {
        Defaults.ZOOM_ANIMATE = false;
    }
    Defaults.SELECTION_TOLERANCE = 1;
    var version = Q.version;
    //Q.DefaultStyles[Q.Styles.SHAPE_FILL_COLOR] = null;
    Q.DefaultStyles[Q.Styles.SHAPE_FILL_COLOR] = Q.toColor(0xCCCCCCCC);

    Q.addCSSRule(".maximize", "position: fixed;top: 0px;bottom: 0px;right: 0px;left: 0px;z-index: 1030;height: auto !important;");
//utils
    function byId(id) {
        return document.getElementById(id);
    }

//demos
    var demos = {
        "Basic Demos": [
            {
                name: "Hello Qunee",
                jsfile: "./basic/hello.js"
            }
        ]
    }

    var currentDemo;
    var lastHash;

    var canvas = byId("canvas");
    var demoTree = new Q.DemoTree(demos);
    var demoMap = demoTree.itemMap;

    Object.defineProperties(window, {
        currentDemo: {
            get: function () {
                return currentDemo;
            }
        },
        graph: {
            get: function () {
                return currentDemo && currentDemo.demoInstance
                    && currentDemo.demoInstance.graph;
            }
        }
    });

    var toolbar = Q.createToolbar(window.graph, byId("toolbar"));

    showDemo();
    
//load demo
    var menu = new Q.PopupMenu();

    function runCode(code) {
        if (!currentDemo) {
            return;
        }
        try {
            currentDemo.demoInstance = eval("new function(canvas, Q){\n"
            + code
            + "\ntry{if(graph){this.graph = graph; this.graph.name=currentDemo.name;}\nif(destroy){this.destroy=destroy;}\n}catch(error){}\n"
            + "}(canvas, Q || Qunee);");
            var graph = window.graph;
            if (graph) {
                graph.onkeydown = function (evt) {
                    if (Q.isMetaKey(evt) && evt.keyCode == 70) {
                        Q.stopEvent(evt);
                    }
                }
                graph.popupmenu = menu;
                toolbar.setGraph(graph);
            }
        } catch (error) {
            showError(error);
        }
    }
    
    function loadDemo(callBack) {
        if (Q.isArray(currentDemo)) {
            currentDemo.jsfile = "./js/list-demo.js";
        }
        if (!currentDemo.jsfile) {
            callBack();
            return;
        }
        if (currentDemo.code) {
            // runCode(currentDemo.code);
            callBack();
            return;
        }
        var demo = currentDemo;
        if (demo.jsfile) {
            Q.loadURL(demo.jsfile + "?v=" + version + (Q.isIE ? Q.randomInt(1000) : ''), function (req) {
                var code = req.responseText;
                if (!code) {
                    return;
                }
                demo.code = code;
                if (demo != currentDemo) {
                    return;
                }
                loadDemo(callBack);
            }, showError, null, false);
            return;
        }
    }

    function showDemo(name) {
        debugger
        var demo = demoMap[name];
        if (!demo) {
            name = "Hello Qunee";
            demo = demoMap[name];
        }

        var oldDemo = currentDemo;
        currentDemo = demo;

        var parent = currentDemo.parent;
        for (var n in demoMap) {
            $(demoMap[n].dom).removeClass("active");
        }
        if (currentDemo) {
            $(currentDemo.dom).addClass("active");
            if (parent && parent.dom) {
                $(parent.dom).addClass("active");
            }
        }
        if (!currentDemo) {
            return false;
        }
        setTimeout(function () {
            var afterLoad = function () {
            }
            loadDemo(function () {
                if (window.graph) {
                    window.graph.callLater(afterLoad, this, 100);
                } else {
                    afterLoad();
                }
            });
        }, 100);
    }

//dialog
    function showError(error) {
        if (Q.isString(error)) {
            showDialog("Error", error);
            return;
        }
        if (error.stack) {
            showDialog(error.message, error.stack);
        }
    }
});