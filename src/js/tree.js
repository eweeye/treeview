(function() {

    var _root = window;

    if (!_root.eweeye) {
        _root.eweeye = {};
    }

    if (!_root.eweeye.Tree) {
        _root.eweeye.Tree = {};
    }

    var _tree = _root.eweeye.Tree;
    var _constants = _root.eweeye.Constants;

    // Add base tree type constructor functions
    _tree.Type = {};

    // https://stackoverflow.com/questions/7509831/alternative-for-the-deprecated-proto
    var Inherit = function(child, parent){
        var f = function() {}; // defining temp empty function
        f.prototype = parent.prototype;
        f.prototype.constructor = f; 
        child.prototype = new f(); 
        child.prototype.constructor = child; // restoring proper constructor for child class
        parent.prototype.constructor = parent; // restoring proper constructor for parent class    
    };

    _tree.Type.Base = function Base(id, theme) {
        this.Id = id;
        this.Nodes = {};
        if (theme) {
            this.Theme = theme;
        }
    };
    _tree.Type.Base.prototype.Nodes = {};
    _tree.Type.Base.prototype.Theme = "";
    _tree.Type.Base.prototype.Add = function(node) {
        var _control = window.eweeye.TreeView;       
        if (!node) {
            return;
        }
        if (typeof node === "string") {
            if (!_control.Nodes.hasOwnProperty(node)) {
                console.error("Unknown Node");
                return;
            }
            this.Nodes[node] = node;
            if (this.Theme) {
                _control.Nodes[node].Theme = this.Theme;
            }
        }
    };
    _tree.Type.Base.prototype.Has = function(node) {
        if (!node) {
            return false;
        }
        if (typeof node === "string") {
            return this.Nodes.hasOwnProperty(node);
        }
        if (node.hasOwnProperty("Id")) {
            return this.Nodes.hasOwnProperty(node.Id);
        }
        return false;
    };    

    _tree.Create = function(id, theme) {
        return new eweeye.Tree.Type.Base(id, theme);
    };
})();