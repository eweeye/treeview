(function() {

    var _root = window;

    if (!_root.eweeye) {
        _root.eweeye = {};
    }

    if (!_root.eweeye.TreeView) {
        _root.eweeye.TreeView = {};
        _root.eweeye.TreeView.Type = {};
        _root.eweeye.TreeView.Type.Nodes = function Nodes() {};
        _root.eweeye.TreeView.Type.Nodes.prototype.Has = function(node) {
            if (typeof node === "string") {
                return this.hasOwnProperty(node);
            } else {
                if (node.hasOwnProperty("Id")) {
                    return this.hasOwnPropery(node.Id);
                }
            }
            return false;
        };
        _root.eweeye.TreeView.Type.Nodes.prototype.Get = function(node) {
            if (this.Has(node)) {
                if (typeof node === "string") {
                    return this[node];
                } else {
                    if (node.hasOwnProperty("Id")) {
                        return this[node.Id];
                    }
                }    
            }
            return null;
        };
        _root.eweeye.TreeView.Type.Nodes.prototype.Add = function(node) {
            var _control = window.eweeye.TreeView;
            if (!node) {
                console.error("Empty node");
                return;
            }
            if (!_control.Trees.Has(node.Tree)) {
                console.error("Unknown tree");
                return;
            }
            if (_control.Trees[node.Tree].Has(node.Id)) {
                console.error("Node already exists in tree");
                return;
            }
            if (_control.Nodes.Has(node.Id)) {
                console.error("Node already exists in alternate tree");
                return;
            }                
            if (document.getElementById(node.Id)) {
                console.error("Id already exists in DOM");
                return;
            }
            // Add node to treeview/tree
            _control.Nodes[node.Id] = node;
            _control.Trees[node.Tree].Add(node.Id);
            // If node is expandable and orphans exist, then check orphans
            if (_control.Orphans.length > 0 && node instanceof eweeye.Node.Type.Expandable) {
                for (var o = 0, olen = _control.Orphans.length; o < olen; o++) {
                    // If orphan has new node as it's parent, then reparent
                    if (_control.Nodes[_control.Orphans[o]].Parent === node.Id) {
                        var id = _control.Nodes[_control.Orphans[o]].Id;
                        node.Children[id] = id;
                        _control.Orphans.splice(o,1);
                        olen--;
                        o--;
                    }
                }
            }                         
            var render = true;
            // Check if it has a parent
            if (node.Parent) {
                // If parent doesn't exist, then node is orphaned
                if (!_control.Nodes.Has(node.Parent)) {
                    _control.Orphans.push(node.Id);
                    render = false;
                    return;
                }
                // If parent does exist, then update parent's children
                var parentNode = _control.Nodes[node.Parent];
                if (!(parentNode instanceof eweeye.Node.Type.Expandable)) {
                    render = false;
                    return;
                }
                parentNode.Children[node.Id] = node.Id;
                // Check if node needs to be rendered immediately
                var tempParentId = node.Parent;
                var parent = _control.Nodes[tempParentId];
                if (parent.Rendered === false || parent.Expanded === false) {
                    render = false;
                }                
            }
            if (render) {
                node.Render();
            }
        }; 

        _root.eweeye.TreeView.Type.Trees = function Trees() {};
        _root.eweeye.TreeView.Type.Trees.prototype.Has = function(tree) {
            if (typeof tree !== "string" || !window.eweeye.TreeView.Trees.hasOwnProperty(tree)) {
                return false;
            }
            return true;
        };
        _root.eweeye.TreeView.Type.Trees.prototype.Add = function(tree) {
            var _control = window.eweeye.TreeView;
            if (!tree) {
                console.error("Empty tree");
                return;
            }
            if (typeof tree === "string") {
                if (_control.Trees.Has(tree)) {
                    console.error("Tree already exists");
                    return;
                }
                _control.Trees[tree] = new _root.eweeye.Tree.Type.Base(tree);
            } else if (tree instanceof _root.eweeye.Tree.Type.Base) {
                if (_control.Trees.Has(tree.Id)) {
                    console.error("Tree already exists");
                    return;
                }
                _control.Trees[tree.Id] = tree;
            }
        };

        _root.eweeye.TreeView = {
            Trees: new _root.eweeye.TreeView.Type.Trees(),
            Nodes: new _root.eweeye.TreeView.Type.Nodes(),
            Orphans: []
        };
    }

    var _control = _root.eweeye.TreeView;
    _control._renderQueue = [];

})();