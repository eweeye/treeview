(function () {    
    var _id = 1;
    var processTrees = function() {
        var found = document.getElementsByClassName("eweeye-treeview");
        if (found) {
            for (var i = 0, ilen = found.length; i < ilen; i++) {
                var tree = found[i];
                var items = [];
                // Each tree must have an id, assign one if one doesn't exist
                if (!tree.id) {
                    tree.id = _id.toString();
                    _id++;
                }
                // Each tree's child LI elements are nodes, anything else is to be disposed
                for (var j = 0, jlen = tree.children.length; j < jlen; j++) {
                    if (tree.children[j].matches("li")) {
                        items.push(tree.children[j]);
                    }
                }
                tree.innerHTML = "";
                // Iterate through each LI and convert it to nodes
                for (var k = 0, klen = items.length; k <  klen; k++) {
                    processItem(tree.id, null, items[k]);
                }
            }
            console.log(JSON.stringify(found));
            return;
        }               
    };
    var processItem = function(tree, parent, item) {
        var id;
        var lists = [];
        var contents = [];
        var content = document.createElement("div");
        // Each node must have an id, assign one if one doesn't exist for item
        if (!item.id) {
            id = _id.toString();
            _id++;
        } else {
            id = item.id;
        }
        // Each item's child UL elements are child node containers, anything else is content
        for (var j = 0, jlen = item.children.length; j < jlen; j++) {
            if (item.children[j].matches("ul") || item.children[j].matches("ol")) {
                lists.push(item.children[j]);
            }
        }
        for (var m = 0, mlen = lists.length; m < mlen; m++) {
            item.removeChild(lists[m]);
        }
        // Each item's child UL elements are child node containers, anything else is content
        while (item.childNodes.length > 0) {
            content.appendChild(item.childNodes[0]);
        }
        item.innerHTML = "";
        if (lists.length > 0) {
            window.eweeye.TreeView.Add(tree, parent, id, content, "PlusMinus");
        } else {
            window.eweeye.TreeView.Add(tree, parent, id, content, "Element");
        }
        // Iterate through each UL/OL and convert it to nodes
        for (var k = 0, klen = lists.length; k <  klen; k++) {
            processList(tree, id, lists[k]);
        }
    };
    var processList = function(tree, parent, item) {
        var id;
        var items = [];
        // Each item's child UL elements are child node containers, anything else is content
        for (var j = 0, jlen = item.children.length; j < jlen; j++) {
            if (item.children[j].matches("li")) {
                items.push(item.children[j]);
            }
        }
        // Iterate through each LI and convert it to nodes
        for (var k = 0, klen = items.length; k <  klen; k++) {
            processItem(tree, parent, items[k]);
        }
    };    
    if (
        document.readyState === "complete" ||
            (document.readyState !== "loading" && !document.documentElement.doScroll)
    ) {
        processTrees();
    } else {
        document.addEventListener("DOMContentLoaded", processTrees);
    }
})();