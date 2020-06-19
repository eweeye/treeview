(function() {

    if (!this.eweeye) {
        this.eweeye = {};
    }

    if (!this.eweeye.Node) {
        this.eweeye.Node = {};
    }

    // Add base node type constructor functions
    this.eweeye.Node.Type = {};

    // https://stackoverflow.com/questions/7509831/alternative-for-the-deprecated-proto
    var Inherit = function(child, parent){
        var f = function() {}; // defining temp empty function
        f.prototype = parent.prototype;
        f.prototype.constructor = f; 
        child.prototype = new f(); 
        child.prototype.constructor = child; // restoring proper constructor for child class
        parent.prototype.constructor = parent; // restoring proper constructor for parent class    
    };

    this.eweeye.Node.Type.Base = function Base() { };
    this.eweeye.Node.Type.Base.prototype.Tree = "";
    this.eweeye.Node.Type.Base.prototype.Parent = "";
    this.eweeye.Node.Type.Base.prototype.Id = "";
    this.eweeye.Node.Type.Base.prototype.Rendered = false;            
    this.eweeye.Node.Type.Base.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "";
        span.appendChild(document.createTextNode(text));
        return span;
    };
    this.eweeye.Node.Type.Base.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        span.classList.add('fas');
        span.classList.add('fa-question');
        return span;
    };
    this.eweeye.Node.Type.Base.prototype.Trigger = function() {
        console.log("Node [" + this.Id + "] triggered");
    };

    this.eweeye.Node.Type.Primitive = function Primitive() { };
    Inherit(this.eweeye.Node.Type.Primitive, this.eweeye.Node.Type.Base);
    this.eweeye.Node.Type.Primitive.prototype.Value = null;
    this.eweeye.Node.Type.Primitive.prototype.RenderContent = function() {
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
    this.eweeye.Node.Type.Primitive.prototype.RenderIcon = function() {
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

    this.eweeye.Node.Type.Toggle = function Toggle() { };
    Inherit(this.eweeye.Node.Type.Toggle, this.eweeye.Node.Type.Base);
    this.eweeye.Node.Type.Toggle.prototype.Value = false;
    this.eweeye.Node.Type.Toggle.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "false";
        if (this.Value) 
            text = "true";
        span.appendChild(document.createTextNode(text));
        return span;
    };
    this.eweeye.Node.Type.Toggle.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        span.classList.add('fas');
        if (this.Value) 
            span.classList.add('fa-dot-circle');
        else
            span.classList.add('fa-circle');
        return span;
    };
    this.eweeye.Node.Type.Toggle.prototype.Trigger = function() {
        this.Value = !this.Value;
        return this;
    };

    this.eweeye.Node.Type.Expandable = function Expandable() { };
    Inherit(this.eweeye.Node.Type.Expandable, this.eweeye.Node.Type.Primitive);
    this.eweeye.Node.Type.Expandable.prototype.Children = {};
    this.eweeye.Node.Type.Expandable.prototype.Expanded = false;
    this.eweeye.Node.Type.Expandable.prototype.IconOpen = null;
    this.eweeye.Node.Type.Expandable.prototype.IconClosed = null;
    this.eweeye.Node.Type.Expandable.prototype.Trigger = function() {
        this.Expanded = !this.Expanded;
        return this;
    };
  
    this.eweeye.Node.Type.Expandable.prototype.RenderIcon = function() {
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

    this.eweeye.Node.Type.Folder = function Folder() { 
        this.IconOpen = 'folder-open';
        this.IconClosed = 'folder';
    };
    Inherit(this.eweeye.Node.Type.Folder, this.eweeye.Node.Type.Expandable);

    this.eweeye.Node.Type.PlusMinus = function PlusMinus() {
        this.IconOpen = 'minus-square';
        this.IconClosed = 'plus-square';
    };
    Inherit(this.eweeye.Node.Type.PlusMinus, this.eweeye.Node.Type.Expandable);

    this.eweeye.Node.Type.Chevron = function PlusMinus() {
        this.IconOpen = 'chevron-down';
        this.IconClosed = 'chevron-right';
    };
    Inherit(this.eweeye.Node.Type.Chevron, this.eweeye.Node.Type.Expandable);

    this.eweeye.Node.Type.Caret = function PlusMinus() {
        this.IconOpen = 'caret-down';
        this.IconClosed = 'caret-right';
    };
    Inherit(this.eweeye.Node.Type.Caret, this.eweeye.Node.Type.Expandable);

    this.eweeye.Node.Type.Arrow = function PlusMinus() {
        this.IconOpen = 'arrow-down';
        this.IconClosed = 'arrow-right';
    };
    Inherit(this.eweeye.Node.Type.Arrow, this.eweeye.Node.Type.Expandable);

    this.eweeye.Node.Type.Angle = function PlusMinus() {
        this.IconOpen = 'angle-down';
        this.IconClosed = 'angle-right';
    };
    Inherit(this.eweeye.Node.Type.Angle, this.eweeye.Node.Type.Expandable);

    this.eweeye.Node.Create = function(name) {
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