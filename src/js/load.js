(function () {    
    var _id = 1;
    var processTrees = function() {
        var _control = window.eweeye.TreeView;
        var found = document.getElementsByClassName("eweeye-treeview");
        if (found) {
            for (var i = 0, ilen = found.length; i < ilen; i++) {
                var tree = found[i];
                var items = [];
                // Each tree must have an id, assign one if one doesn't exist
                if (!tree.id) {
                    tree.id = _id.toString();
                    _id++;
                    while (_control.Trees.Has(tree.id)) {
                        tree.id = _id.toString();
                        _id++;
                    }
                }
                // Add tree item if it doesn't exist
                if (!_control.Trees.Has(tree.id)) {
                    _control.Trees.Add(tree.id);
                }
                // Each tree's child LI elements are nodes, anything else is to be disposed
                for (var j = 0, jlen = tree.children.length; j < jlen; j++) {
                    if (tree.children[j].matches("li")) {
                        items.push(tree.children[j]);
                    }
                }
                // Iterate through each LI and convert it to nodes
                for (var k = 0, klen = items.length; k <  klen; k++) {
                    if (!items[k].id || (items[k].id && !window.eweeye.TreeView.Nodes.Has(items[k].id))) {                    
                        processItem(tree.id, null, items[k]);
                        tree.removeChild(items[k]);
                    }
                }
            }
            return;
        }               
    };
    var processItem = function(tree, parent, item) {
        var _control = window.eweeye.TreeView;
        var _node = window.eweeye.Node;
        var node = {
            Id: (Math.floor((Math.random() * 9007199254740990) + 1)).toString(),
            Tree: tree,
            Parent: parent,
            Value: document.createElement("div")
        };
        var lists = [];
        // Each node must have an id, assign one if one doesn't exist for item
        while (document.getElementById(node.Id)) {
            node.Id =(Math.floor((Math.random() * 9007199254740990) + 1)).toString();
        }
        // Check for icon on LI
        if (item.getAttribute('Icon')) {
            node.Icon = item.getAttribute('Icon');
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
            node.Value.appendChild(item.childNodes[0]);
        }
        if (lists.length > 0) {
            node.Type = "Expandable";
        } else {
            node.Type = "Primitive";
            if (!node.hasOwnProperty("Icon")) {
                node.Icon = "circle";
            }
        }
        _control.Nodes.Add(_node.Create(node));
        // Iterate through each UL/OL and convert it to nodes
        for (var k = 0, klen = lists.length; k <  klen; k++) {
            processList(tree, node.Id, lists[k]);
        }
    };
    var processList = function(tree, parent, item) {
        var items = [];
        // Each item's child UL elements are child node containers, anything else is content
        for (var j = 0, jlen = item.children.length; j < jlen; j++) {
            if (item.children[j].matches("li")) {
                items.push(item.children[j]);
            }
        }
        // Iterate through each LI and convert it to nodes
        for (var k = 0, klen = items.length; k <  klen; k++) {
            if (!items[k].id || (items[k].id && !window.eweeye.TreeView.Nodes.Has(items[k].id))) {                    
                processItem(tree, parent, items[k]);
                item.removeChild(items[k]);
            }
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