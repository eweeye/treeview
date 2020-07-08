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
            var render = true;
            if (node.Parent) {
                var tempParentId = node.Parent;
                while (tempParentId) {
                    if (!_control.Nodes.hasOwnProperty(tempParentId)) {
                        console.error("Parent does not exist");
                        return;
                    } else {
                        var parent = _control.Nodes[tempParentId];
                        if (!(parent instanceof eweeye.Node.Type.Expandable)) {
                            console.error("Parent does not support children");
                            return;
                        }
                        if (parent.Rendered === false || parent.Visible === false || parent.Expanded === false) {
                            render = false;
                            break;
                        } else {
                            tempParentId = parent.Parent;
                        }
                    }
                }
            }
            _control.Nodes[node.Id] = node;
            _control.Trees[node.Tree].Add(node.Id);
            if (node.Parent && _control.Nodes.hasOwnProperty(node.Parent)) {
                var parentNode = _control.Nodes[node.Parent];
                if (parentNode instanceof eweeye.Node.Type.Expandable) {
                    parentNode.Children[node.Id] = node.Id;
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
                console.error("Empty node");
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
            Nodes: new _root.eweeye.TreeView.Type.Nodes()
        };
    }

    var _control = _root.eweeye.TreeView;
    _control._renderQueue = [];

})();