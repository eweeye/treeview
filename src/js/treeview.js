eweeye.TreeView = (function() {
    var _constTreeView = "treeview";
    var _constNode = "node";
    var ui = {
        Trees: {},
        Nodes: {},

        GetType: function(name, treeId) {
            var type = ui.Types.Primitive;
            if (name) {
                if (ui.Types.hasOwnProperty(name)) {
                    type = ui.Types[name];
                }
                if (treeId && ui.Trees[treeId].Types.hasOwnProperty(name)) {
                    type = ui.Trees[treeId].Types[node.Type];
                }
            }
            return type;
        },

        Add: function(treeId, parentId, id, value, type) {
            if (!ui.Trees.hasOwnProperty(treeId)) {
                ui.Trees[treeId] = {
                    Nodes: {}
                };
            }
            if (ui.Trees[treeId].Nodes.hasOwnProperty(id)) {
                console.error("Id already exists in tree");
                return;
            }
            if (ui.Nodes.hasOwnProperty(id)) {
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
                    if (!ui.Nodes.hasOwnProperty(tempParentId)) {
                        console.error("Parent does not exist");
                        return;
                    } else {
                        var parent = ui.Nodes[tempParentId];
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
            ui.Nodes[id] = node;
            ui.Trees[treeId].Nodes[id] = id;
            if (parentId && ui.Nodes.hasOwnProperty(parentId)) {
                var parentNode = ui.Nodes[parentId];
                if (parentNode instanceof eweeye.Node.Type.Expandable) {
                    parentNode.Children[id] = id;
                }
            }
            if (render) {
                ui.Render(node);
            }
        },

        CreateNodeElement: function(node) {
            var li = document.createElement('li');
            li.id = node.Id;
            var contentDIV = document.createElement('div');
            var contentButton = document.createElement('button');
            contentButton.classList.add(_constNode);
            contentDIV.appendChild(contentButton);
            var icon = node.RenderIcon();
            var content = node.RenderContent();
            if (icon) {
                contentButton.appendChild(icon);
            }
            if (content) {
                contentButton.appendChild(content);
            }
            var optionDIV = document.createElement('div');
            li.appendChild(contentDIV);
            li.appendChild(optionDIV);
            if (node instanceof eweeye.Node.Type.Expandable) {
                this.CreateChildrenElement(li);
            }
            node.Rendered = true;
            //li.classList.add('hidden');
            return li;
        },

        UpdateNodeElement: function(li, node) {
            var button = li.querySelector('button.node');
            if (button) {
                button.innerHTML = '';
                var icon = node.RenderIcon();
                var content = node.RenderContent();
                if (icon) {
                    button.appendChild(icon);
                }
                if (content) {
                    button.appendChild(content);
                }
            }
            if (node instanceof eweeye.Node.Type.Expandable) {
                for (var prop in node.Children) {
                    if (node.Children.hasOwnProperty(prop)) {
                        var subnode = this.Nodes[prop];
                        if (!subnode.Rendered) {
                            this.Render(subnode);
                        }
                    }
                }
            }
        },

        CreateChildrenElement: function(li) {
            var nodeUL = document.createElement('ul');
            li.appendChild(nodeUL);
        },

        GetNodeContainerElement: function(node) {
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
        },

        GetNodeElement: function(node) {
            return (function(node){
                var found = document.getElementById(node.Id);
                if (!found) {
                    console.error("Unable to find in DOM");
                    return;
                }                
                return found;
            })(node);
        },

        // Function to render a node into the DOM
        Render: function(node) {            
            if (!(node instanceof eweeye.Node.Type.Base)) {
                console.error("Node not supported");
                return;
            }
            var li;
            if (!node.Rendered) {
                var ul = this.GetNodeContainerElement(node);
                if (ul) {
                    li = this.CreateNodeElement(node);
                    ul.appendChild(li);
                }   
            } else {
                li = this.GetNodeElement(node);
                if (li) {
                    this.UpdateNodeElement(li, node);
                }
            }
        }
    };
    return ui;
})();