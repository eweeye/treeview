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

        _root.eweeye.TreeView.Type.Trees = function Trees() {};
        _root.eweeye.TreeView.Type.Trees.prototype.Has = function(tree, node) {
            if (typeof tree !== "string" || !this.hasOwnProperty(tree)) {
                return false;
            }
            if (typeof node === "string") {
                return this[tree].Nodes.hasOwnProperty(node);
            } else {
                if (node.hasOwnProperty("Id")) {
                    return this[tree].Nodes.hasOwnPropery(node.Id);
                }
            }
            return false;
        };
            
        _root.eweeye.TreeView = {
            Trees: new _root.eweeye.TreeView.Type.Trees(),
            Nodes: new _root.eweeye.TreeView.Type.Nodes()    
        };
    }

    var _control = _root.eweeye.TreeView;
    _control._renderQueue = [];
    var _constants = _root.eweeye.Constants;

    var GetNodeContainerElement = function(node) {
        // Determine the UL that the node should be added under
        // Default: Root of the tree
        var id = node.Tree;
        // Alternate: Parent within the tree
        if (node.Parent) {
            id = node.Parent;
        }
        // Verify the containing UL exists in the DOM already
        var found = document.getElementById(id);
        if (!found) {
            console.error("Unable to add to DOM");
            return null;
        }
        // If the selected element is not a UL, the child UL needs to be found
        if (!(found instanceof HTMLUListElement)) {
            // If the selected element is a LI, it is a list item that may have a UL for children
            if (found instanceof HTMLLIElement) {
                found = Array.prototype.filter.call(found.children,
                    function (found) {
                        return found instanceof HTMLUListElement;
                    });
                if (found && found.length > 0) {
                    found = found[0];
                }
            }
        }
        if (!found) {
            console.error("Unable to add to DOM");
            return;
        }                
        return found;
    };

    var GetNodeElement = function(node) {
        return (function(node){
            var found = document.getElementById(node.Id);
            if (!found) {
                console.error("Unable to find in DOM");
                return;
            }                
            return found;
        })(node);
    };

    // Function to render a node into the DOM
    _root.eweeye.TreeView.Render = function(node) {
        if (!(node instanceof eweeye.Node.Type.Base)) {
            console.error("Node not supported");
            return;
        }
        var li;
        if (!node.Rendered) {
            var ul = GetNodeContainerElement(node);
            if (ul) {
                li = node.CreateElement();
                ul.appendChild(li);
            }   
        } else {
            li = GetNodeElement(node);
            if (li) {
                node.UpdateElement(li);
            }
        }
    };

    _root.eweeye.TreeView.Add = function(node) {
        if (!_control.Trees.hasOwnProperty(node.Tree)) {
            _control.Trees[node.Tree] = {
                Nodes: {}
            };
        }
        if (_control.Trees[node.Tree].Nodes.hasOwnProperty(node.Id)) {
            console.error("Id already exists in tree");
            return;
        }
        if (_control.Nodes.hasOwnProperty(node.Id)) {
            console.error("Id already exists in alternate tree");
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
        _control.Trees[node.Tree].Nodes[node.Id] = node.Id;
        if (node.Parent && _control.Nodes.hasOwnProperty(node.Parent)) {
            var parentNode = _control.Nodes[node.Parent];
            if (parentNode instanceof eweeye.Node.Type.Expandable) {
                parentNode.Children[node.Id] = node.Id;
            }
        }
        if (render) {
            _control.Render(node);
        }
    };

})();