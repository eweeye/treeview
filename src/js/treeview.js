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
            var nodeLI = document.createElement('li');
            nodeLI.id = node.Id;
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
            nodeLI.appendChild(contentDIV);
            nodeLI.appendChild(optionDIV);
            node.Rendered = true;
            if (node instanceof eweeye.Node.Type.Expandable) {
                this.CreateChildrenElement(nodeLI);
            }    
            return nodeLI;
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
        },

        CreateChildrenElement: function(li) {
            var nodeUL = document.createElement('ul');
            li.appendChild(nodeUL);
        },

        RenderPermitted: function(node) {
            var permit = true;
            
        },

        // Function to render a node into the DOM
        Render: function(node) {            
            if (!(node instanceof eweeye.Node.Type.Base)) {
                console.error("Node not supported");
                return;
            }
            if (!node.Rendered) {
                // Determine the UL that the node should be added under
                // Default: Root of the tree
                var parentId = node.Tree;
                // Alternate: Parent within the tree
                if (node.Parent) {
                    parentId = node.Parent;
                }
                // Verify the containing UL exists in the DOM already
                var parentUL;
                var selectedElement = document.getElementById(parentId);
                if (!selectedElement) {
                    console.error("Parent not found in DOM");
                    return;
                }
                // If the selected element is a UL, it is where the node is to be added
                if (selectedElement instanceof HTMLUListElement) {
                    parentUL = selectedElement;
                } else {
                    // If the selected element is a LI, it is a list item that may have a UL for children
                    if (selectedElement instanceof HTMLLIElement) {
                        selectedElement = Array.prototype.filter.call(selectedElement.children,
                            function (element) {
                                return element instanceof HTMLUListElement;
                            });
                        if (selectedElement && selectedElement.length > 0) {
                            parentUL = selectedElement[0];
                        }
                    }
                }
                if (!parentUL) {
                    console.error("Parent's children not found in DOM");
                    return;
                }
                var li = this.CreateNodeElement(node);
                parentUL.appendChild(li);   
            } else {
                var li2 = document.getElementById(node.Id);
                if (!li2) {
                    console.error("Node not found in DOM");
                    return;
                }
                this.UpdateNodeElement(li2, node);
            }
        }
    };
    return ui;
})();