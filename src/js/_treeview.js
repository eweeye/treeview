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
                "primitive" : function(item) {
                    if (item === null) 
                        return "null";
                    if (typeof item === "undefined")
                        return "undefined";
                    if (typeof item === "boolean")
                        if (item) 
                            return "true";
                        else
                            return "false";
                    if (typeof item === "number")
                        return item.toString();
                    if (typeof item === "string")
                        return item;
                    if (typeof item === "object")
                        return JSON.stringify(item);
                    if (typeof item === "function")
                        return JSON.stringify(item);
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
                var funcTypeRender = ui.Types.primitive;
                if (node.Type) {
                    if (ui.Types.hasOwnProperty(node.Type)) {
                        funcTypeRender = ui.Types[node.Type].Renderer;
                    }
                    if (ui.Trees[treeId].Types.hasOwnProperty(node.Type)) {
                        funcTypeRender = ui.Trees[treeId].Types[node.Type].Renderer;
                    }
                }                
                var nodeLI = document.createElement('li');
                nodeLI.id = node.Id;
                var iconDIV = document.createElement('div');
                var contentDIV = document.createElement('div');
                contentDIV.appendChild(document.createTextNode(funcTypeRender(node.Value)));
                var optionDIV = document.createElement('div');
                nodeLI.appendChild(iconDIV);
                nodeLI.appendChild(contentDIV);
                nodeLI.appendChild(optionDIV);
                var nodeUL = document.createElement('ul');
                nodeLI.appendChild(nodeUL);
                parentUL.appendChild(nodeLI);   
                node.Rendered = true;
                node.Visible = true;             
            }
        };
        return ui;
    }
})();