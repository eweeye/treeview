eweeye.TreeView = (function() {
    {   
        var _constLibrary = "eweeye";
        var _constTree = "tr";
        var _constId = "id";
        var _constChildren = "ch";
        var ui = {
            Trees: {},
            Types: {
                "string" : function(item) { 
                    return item.toString();
                }
            },
            Views: {

            },

            Add: function(treeId, type, id, path, value) {
                if (!ui.Trees.hasOwnProperty(treeId)) {
                    ui.Trees[treeId] = {
                        Structure: {},
                        Types: {}
                    };
                }
                var typeRenderFunc;
                if (ui.Types.hasOwnProperty(type)) {
                    typeRenderFunc = ui.Types[type].Renderer;
                }
                if (ui.Trees[treeId].Types.hasOwnProperty(type)) {
                    typeRenderFunc = ui.Trees[treeId].Types[type].Renderer;
                }
                var render = true;
                var parentId = null;
                var position = ui.Trees[treeId].Structure;
                if (path) {
                    var pathArr = path.split('.');
                    var pathPos;
                    while (pathArr.length > 0) {
                        pathPos = pathArr.shift();
                        if (!position.hasOwnProperty(pathPos)) {
                            console.error("Path does not exist");
                            return;    
                        }
                        if (render && !position[pathPos].Expanded) {
                            render = !render;
                        }
                        parentId = pathPos;
                        position = position[pathPos].Children;
                    }
                }
                if (position.hasOwnProperty(id)) {
                    console.error("Id already exists");
                    return;
                }
                var node  = {
                    Tree: treeId,
                    Parent: parentId,
                    Children: {},
                    Rendered: false,
                    Expanded: false,
                    Type: type,
                    Value: value
                }; 
                position[id] = node;
                if (parent === null || render) {
                    ui.Render(node);
                }
            },

            Render: function(node) {
                var parentId = node.Tree;
                if (node.parentId) {
                    parentId = _constLibrary + _constTree + node.Tree + _constId + node.id + _constChildren;
                }
                var parentUL = document.getElementById(parentId);
                if (!parentUL) {
                    console.error("Parent not found");
                    return;
                }
                var nodeLI = document.createElement('li');
                nodeLI.id = _constLibrary + _constTree + node.Tree + _constId + node.id;
                nodeLI.appendChild(document.createTextNode(node.Value));
                var nodeUL = document.createElement('ul');
                nodeUL.id =  nodeLI.id + _constChildren;
                nodeLI.appendChild(nodeUL);
                parentUL.appendChild(nodeLI);                
            }
        };
        return ui;
    }
})();