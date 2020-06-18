eweeye.TreeView = (function() {
    var _constTreeView = "treeview";
    var _constNode = "node";
    var ui = {
        Trees: {},
        Nodes: {},
        Types: {
            "Folder" : {
                "Options" : {
                    IsExpandable: true
                },
                "Content" : function(node) {
                    var span = document.createElement('span');
                    var text = "";
                    if (node && node.Value) {
                        switch (typeof node.Value) {
                            case "string":
                                text = node.Value;
                                break;
                            default:
                                text = "";
                                break;
                        }
                    } 
                    span.appendChild(document.createTextNode(text));
                    return span;
                },
                "Icon" : function(node) {
                    var span = document.createElement('span');
                    span.classList.add('fas');
                    if (node.Expanded) {
                        span.classList.add('fa-folder-open');
                    } else {
                        span.classList.add('fa-folder');
                    }
                    return span;
                }
            },
            "Primitive" : {
                "Options" : {
                    IsExpandable: false
                },
                "Content" : function(node) {
                    var span = document.createElement('span');
                    var text = "";
                    if (!node && node.Value === null) 
                        text = "null";
                    if (node && (node.Value || node.Value === false || node.Value === 0)) {
                        switch (typeof node.Value) {
                            case "undefined": 
                                text = "undefined";
                                break;
                            case "boolean":
                                if (node.Value)
                                    text = "true";
                                else
                                    text = "false";
                                break;
                            case "number":
                                text = node.Value.toString();
                                break;
                            case "string":
                                text = node.Value;
                                break;
                            case "object":
                                text = JSON.stringify(node.Value);
                                break;
                            case "function":
                                text = JSON.stringify(node.Value);
                                break;
                        }
                    } 
                    span.appendChild(document.createTextNode(text));
                    return span;
                },
                "Icon" : function(node) {
                    var span = document.createElement('span');
                    span.classList.add('fas');
                    if (node && node.Value === null) 
                        span.classList.add('fa-ban');
                    if (node && (node.Value || node.Value === false || node.Value === 0)) {
                        switch (typeof node.Value) {
                            case "undefined":
                                span.classList.add('fa-ban');
                                break;
                            case "boolean":
                                if (node.Value) 
                                    span.classList.add('fa-dot-circle');
                                else
                                    span.classList.add('fa-circle');
                                break;
                            case "number":
                                span.classList.add('fa-hashtag');
                                break;
                            case "string":
                                span.classList.add('fa-keyboard');
                                break;
                            case "object":
                                span.classList.add('fa-cube');
                                break;
                            case "function":
                                span.classList.add('fa-rocket');
                                break;
                        }
                    }
                    return span;
                }
            }
        },
        Views: {

        },

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
                    Nodes: {},
                    Types: {}
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

        // Function to render a node into the DOM
        Render: function(node) {
            if (!(node instanceof eweeye.Node.Type.Base)) {
                console.error("Node not supported");
                return;
            }
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
            if (node instanceof eweeye.Node.Type.Expandable) {
                var nodeUL = document.createElement('ul');
                nodeLI.appendChild(nodeUL);
            }
            parentUL.appendChild(nodeLI);   
            node.Rendered = true;
            node.Visible = true;         
        }
    };
    return ui;
})();