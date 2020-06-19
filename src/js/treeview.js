(function() {

    var _root = window;

    if (!_root.eweeye) {
        _root.eweeye = {};
    }

    if (!_root.eweeye.TreeView) {
        _root.eweeye.TreeView = {
            Trees: {},
            Nodes: {}    
        };
    }

    var _control = _root.eweeye.TreeView;
    var _constants = _root.eweeye.Constants;

    var CreateNodeElement = function(node) {
        var li = document.createElement('li');
        li.id = node.Id;
        li.classList.add(_constants.NodeItem);
        var self = document.createElement('div');
        self.classList.add(_constants.NodeSelf);
        var button = document.createElement('button');
        button.classList.add(_constants.NodeButton);
        self.appendChild(button);
        var icon = document.createElement('div');
        icon.classList.add(_constants.NodeIcon);
        icon.appendChild(node.RenderIcon());
        icon.classList.add(_constants.NodeIcon);
        var label = document.createElement('div');
        label.classList.add(_constants.NodeLabel);
        label.appendChild(node.RenderContent());
        if (icon) {
            button.appendChild(icon);
        }
        if (label) {
            button.appendChild(label);
        }
        var options = document.createElement('div');
        options.classList.add(_constants.NodeOptions);
        li.appendChild(self);
        li.appendChild(options);
        if (node instanceof eweeye.Node.Type.Expandable) {
            CreateChildrenElement(li);
        }
        node.Rendered = true;
        //li.classList.add('hidden');
        return li;
    };

    var UpdateNodeElement = function(li, node) {
        var button = li.querySelector('button.' + _constants.NodeButton);
        if (button) {
            var icon = button.querySelector('div.' + _constants.NodeIcon);
            if (icon) {
                icon.innerHTML = '';
                icon.appendChild(node.RenderIcon());
            }
            var label = button .querySelector('div.' + _constants.NodeLabel);
            if (label) {
                label.innerHTML = '';
                label.appendChild(node.RenderContent());
            }
        }
        if (node instanceof eweeye.Node.Type.Expandable) {
            var children = li.querySelector('ul.' + _constants.NodeChildren);
            if (children) {
                if (node.Expanded) {
                    for (var prop in node.Children) {
                        if (node.Children.hasOwnProperty(prop)) {
                            var subnode = _control.Nodes[prop];
                            if (!subnode.Rendered) {
                                _control.Render(subnode);
                            }
                        }
                    }
                    children.classList.remove(_constants.Hidden);
                } else {
                    children.classList.add(_constants.Hidden);                    
                }
            }
        }
    };

    var CreateChildrenElement = function(li) {
        var ul = document.createElement('ul');
        ul.classList.add(_constants.NodeChildren);
        li.appendChild(ul);
    };

    var GetNodeContainerElement = function(node) {
        return (function(node){
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
        })(node);
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
                li = CreateNodeElement(node);
                ul.appendChild(li);
            }   
        } else {
            li = GetNodeElement(node);
            if (li) {
                UpdateNodeElement(li, node);
            }
        }
    };

    _root.eweeye.TreeView.Add = function(treeId, parentId, id, value, type) {
        if (!_control.Trees.hasOwnProperty(treeId)) {
            _control.Trees[treeId] = {
                Nodes: {}
            };
        }
        if (_control.Trees[treeId].Nodes.hasOwnProperty(id)) {
            console.error("Id already exists in tree");
            return;
        }
        if (_control.Nodes.hasOwnProperty(id)) {
            console.error("Id already exists in alternate tree");
            return;
        }                
        if (document.getElementById(id)) {
            console.error("Id already exists in DOM");
            return;
        }
        var render = true;
        if (parentId) {
            var tempParentId = parentId;
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
        var node = eweeye.Node.Create(type);
        node.Id = id;
        node.Tree = treeId;
        node.Parent = parentId;
        if (node instanceof eweeye.Node.Type.Primitive) {
            node.Value = value;
        }
        if (node instanceof eweeye.Node.Type.Expandable) {
            node.Children = {};
        }
        _control.Nodes[id] = node;
        _control.Trees[treeId].Nodes[id] = id;
        if (parentId && _control.Nodes.hasOwnProperty(parentId)) {
            var parentNode = _control.Nodes[parentId];
            if (parentNode instanceof eweeye.Node.Type.Expandable) {
                parentNode.Children[id] = id;
            }
        }
        if (render) {
            _control.Render(node);
        }
    };

})();