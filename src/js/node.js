(function() {

    var _root = window;

    if (!_root.eweeye) {
        _root.eweeye = {};
    }

    if (!_root.eweeye.Node) {
        _root.eweeye.Node = {};
    }

    var _control = _root.eweeye.TreeView;
    var _constants = _root.eweeye.Constants;

    // Add base node type constructor functions
    _root.eweeye.Node.Type = {};

    // https://stackoverflow.com/questions/7509831/alternative-for-the-deprecated-proto
    var Inherit = function(child, parent){
        var f = function() {}; // defining temp empty function
        f.prototype = parent.prototype;
        f.prototype.constructor = f; 
        child.prototype = new f(); 
        child.prototype.constructor = child; // restoring proper constructor for child class
        parent.prototype.constructor = parent; // restoring proper constructor for parent class    
    };

    _root.eweeye.Node.Type.Base = function Base() {};
    _root.eweeye.Node.Type.Base.prototype.Tree = "";
    _root.eweeye.Node.Type.Base.prototype.Parent = "";
    _root.eweeye.Node.Type.Base.prototype.Id = "";
    _root.eweeye.Node.Type.Base.prototype.Reactions = {};
    _root.eweeye.Node.Type.Base.prototype.Rendered = false;            
    _root.eweeye.Node.Type.Base.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "";
        span.appendChild(document.createTextNode(text));
        return span;
    };
    _root.eweeye.Node.Type.Base.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        span.classList.add('fas');
        span.classList.add('fa-question');
        return span;
    };
    _root.eweeye.Node.Type.Base.prototype.Trigger = function(action, node, message) {
        if (action === "click") {
            console.log("Node [" + this.Id + "] clicked.");
            this.TriggerParent("poke", "Poked!");
        } else if (action === "poke") {
            console.log("Node [" + this.Id + "] poked by node [" + node.Id + "] with message [" + JSON.stringify(message) + "]");
        }
        if (this.Reactions.hasOwnProperty(action)) {
            this.Reactions[action].call(this, node);
        }
    };
    _root.eweeye.Node.Type.Base.prototype.TriggerParent = function(action, message) {
        if (!this.Parent) {
            console.log("Node [" + this.Id + "] has no parent.");
            return;
        }
        if (window.eweeye.TreeView.Nodes.hasOwnProperty(this.Parent)) {
            window.eweeye.TreeView.Nodes[this.Parent].Trigger(action, this, message);
        }
    };    

    _root.eweeye.Node.Type.Primitive = function Primitive() { };
    Inherit(_root.eweeye.Node.Type.Primitive, _root.eweeye.Node.Type.Base);
    _root.eweeye.Node.Type.Primitive.prototype.Value = null;
    _root.eweeye.Node.Type.Primitive.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "";
        if (this.Value === null) 
            text = "null";
        if (this.Value || this.Value === false || this.Value === 0) {
            switch (typeof this.Value) {
                case "undefined": 
                    text = "undefined";
                    break;
                case "boolean":
                    if (this.Value)
                        text = "true";
                    else
                        text = "false";
                    break;
                case "number":
                    text = this.Value.toString();
                    break;
                case "string":
                    text = this.Value;
                    break;
                case "object":
                    text = JSON.stringify(this.Value);
                    break;
                case "function":
                    text = JSON.stringify(this.Value);
                    break;
            }
        } 
        span.appendChild(document.createTextNode(text));
        return span;
    };
    _root.eweeye.Node.Type.Primitive.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        span.classList.add('fas');
        if (this.Value === null) 
            span.classList.add('fa-ban');
        if (this.Value || this.Value === false || this.Value === 0) {
            switch (typeof this.Value) {
                case "undefined":
                    span.classList.add('fa-ban');
                    break;
                case "boolean":
                    if (this.Value) 
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
    };

    _root.eweeye.Node.Type.Toggle = function Toggle() { };
    Inherit(_root.eweeye.Node.Type.Toggle, _root.eweeye.Node.Type.Base);
    _root.eweeye.Node.Type.Toggle.prototype.Value = false;
    _root.eweeye.Node.Type.Toggle.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "false";
        if (this.Value) 
            text = "true";
        span.appendChild(document.createTextNode(text));
        return span;
    };
    _root.eweeye.Node.Type.Toggle.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        span.classList.add('fas');
        if (this.Value) 
            span.classList.add('fa-dot-circle');
        else
            span.classList.add('fa-circle');
        return span;
    };
    _root.eweeye.Node.Type.Toggle.prototype.Reactions = {
        "click": function (actor) {
            this.Value = !this.Value;
            window.eweeye.TreeView.Render(this);
        }
    };

    _root.eweeye.Node.Type.Expandable = function Expandable() { };
    Inherit(_root.eweeye.Node.Type.Expandable, _root.eweeye.Node.Type.Primitive);
    _root.eweeye.Node.Type.Expandable.prototype.Children = {};
    _root.eweeye.Node.Type.Expandable.prototype.Expanded = false;
    _root.eweeye.Node.Type.Expandable.prototype.IconOpen = null;
    _root.eweeye.Node.Type.Expandable.prototype.IconClosed = null;
    _root.eweeye.Node.Type.Expandable.prototype.Reactions = {
        "click": function (actor) {
            this.Expanded = !this.Expanded;
            window.eweeye.TreeView.Render(this);
        }
    };
  
    _root.eweeye.Node.Type.Expandable.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        if (this.Expanded) {
            if (this.IconOpen && typeof this.IconOpen === 'string') {
                span.classList.add('fas', 'fa-' + this.IconOpen);
            }
        } else {
            if (this.IconClosed && typeof this.IconClosed === 'string') {
                span.classList.add('fas', 'fa-' + this.IconClosed);
            }
        }
        return span;
    };    

    _root.eweeye.Node.Type.Folder = function Folder() { 
        this.IconOpen = 'folder-open';
        this.IconClosed = 'folder';
    };
    Inherit(_root.eweeye.Node.Type.Folder, _root.eweeye.Node.Type.Expandable);

    _root.eweeye.Node.Type.PlusMinus = function PlusMinus() {
        this.IconOpen = 'minus-square';
        this.IconClosed = 'plus-square';
    };
    Inherit(_root.eweeye.Node.Type.PlusMinus, _root.eweeye.Node.Type.Expandable);

    _root.eweeye.Node.Type.Chevron = function PlusMinus() {
        this.IconOpen = 'chevron-down';
        this.IconClosed = 'chevron-right';
    };
    Inherit(_root.eweeye.Node.Type.Chevron, _root.eweeye.Node.Type.Expandable);

    _root.eweeye.Node.Type.Caret = function PlusMinus() {
        this.IconOpen = 'caret-down';
        this.IconClosed = 'caret-right';
    };
    Inherit(_root.eweeye.Node.Type.Caret, _root.eweeye.Node.Type.Expandable);

    _root.eweeye.Node.Type.Arrow = function PlusMinus() {
        this.IconOpen = 'arrow-down';
        this.IconClosed = 'arrow-right';
    };
    Inherit(_root.eweeye.Node.Type.Arrow, _root.eweeye.Node.Type.Expandable);

    _root.eweeye.Node.Type.Angle = function PlusMinus() {
        this.IconOpen = 'angle-down';
        this.IconClosed = 'angle-right';
    };
    Inherit(_root.eweeye.Node.Type.Angle, _root.eweeye.Node.Type.Expandable);

    _root.eweeye.Node.Create = function(name) {
        if (typeof name !== "string") 
            name = "";
        name = name.toLowerCase();
        switch (name) {
            case "expandable":
                return new eweeye.Node.Type.Expandable();
            case "folder":
                return new eweeye.Node.Type.Folder();
            case "toggle":
                return new eweeye.Node.Type.Toggle();
            case "plusminus":
                return new eweeye.Node.Type.PlusMinus();
            case "chevron":
                return new eweeye.Node.Type.Chevron();
            case "caret":
                return new eweeye.Node.Type.Caret();
            case "arrow":
                return new eweeye.Node.Type.Arrow();
            case "angle":
                return new eweeye.Node.Type.Angle();
            default:
                return new eweeye.Node.Type.Primitive();
        }
    };
})();