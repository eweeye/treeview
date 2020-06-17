eweeye.TreeView = (function() {
    {   
        var _constLibrary = "eweeye";
        var _constTree = "tr";
        var _constId = "id";
        var _constChildren = "ch";
        var ui = {
            Trees: {},
            Nodes: {},
            Types: {
                "Primitive" : {
                    "Content" : function(item) {
                        var span = document.createElement('span');
                        var text = "";
                        if (item === null) 
                            text = "null";
                        switch (typeof item) {
                            case "undefined": 
                                text = "undefined";
                                break;
                            case "boolean":
                                if (item)
                                    text = "true";
                                else
                                    text = "false";
                                break;
                            case "number":
                                text = item.toString();
                                break;
                            case "string":
                                text = item;
                                break;
                            case "object":
                                text = JSON.stringify(item);
                                break;
                            case "function":
                                text = JSON.stringify(item);
                                break;
                        } 
                        span.appendChild(document.createTextNode(text));
                        return span;
                    },
                    "Icon" : function(item) {
                        var span = document.createElement('span');
                        span.classList.add('fas');
                        if (item === null) 
                            span.classList.add('fa-ban');
                        switch (typeof item) {
                            case "undefined":
                                span.classList.add('fa-ban');
                                break;
                            case "boolean":
                                if (item) 
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
                        return span;
                    }
                }
            },
            Views: {

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
                    var count = 0;
                    while (tempParentId) {
                        console.log(count);
                        if (!ui.Nodes.hasOwnProperty(tempParentId)) {
                            render = false;
                        } else {
                            var parent = ui.Nodes[tempParentId];                             
                            if (parent.Rendered === false || parent.Visible === false || parent.Expanded === false) {
                                render = false;
                                break;
                            } else {
                                tempParentId = parent.Parent;
                            }
                        }
                    }
                }
                var node  = {
                    Id: id,
                    Tree: treeId,
                    Parent: parentId,
                    Children: {},
                    Rendered: false,
                    Expanded: false,
                    Visible: false,
                    Type: type,
                    Value: value
                }; 
                ui.Nodes[id] = node;
                ui.Trees[treeId].Nodes[id] = id;
                if (parentId) {
                    ui.Nodes[parentId].Children[id] = id;
                }
                if (render) {
                    ui.Render(node);
                }
            },

            Render: function(node) {
                var parentId = node.Tree;
                if (node.Parent) {
                    parentId = node.Parent;
                }
                var parentUL;
                var selectedElement = document.getElementById(parentId);
                if (!selectedElement) {
                    console.error("Parent not found in DOM");
                    return;
                }
                if (selectedElement instanceof HTMLUListElement) {
                    parentUL = selectedElement;
                } else {
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
                var type = ui.Types.Primitive;
                if (node.Type) {
                    if (ui.Types.hasOwnProperty(node.Type)) {
                        type = ui.Types[node.Type];
                    }
                    if (ui.Trees[treeId].Types.hasOwnProperty(node.Type)) {
                        type = ui.Trees[treeId].Types[node.Type];
                    }
                }
                var nodeLI = document.createElement('li');
                nodeLI.id = node.Id;
                var contentDIV = document.createElement('div');
                var contentButton = document.createElement('button');
                contentDIV.appendChild(contentButton);
                var icon = type? type.Icon? type.Icon(node.Value) : null : null;
                var content = type? type.Content? type.Content(node.Value) : null : null;
                if (icon) {
                    contentButton.appendChild(icon);
                }
                if (content) {
                    contentButton.appendChild(content);
                }
                var optionDIV = document.createElement('div');
                nodeLI.appendChild(contentDIV);
                nodeLI.appendChild(optionDIV);
                var nodeUL = document.createElement('ul');
                nodeLI.appendChild(nodeUL);
                parentUL.appendChild(nodeLI);   
                node.Rendered = true;
                node.Visible = true;  
                node.Expanded = true;           
            }
        };
        return ui;
    }
})();