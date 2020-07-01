(function() {

    var _root = window;

    if (!_root.eweeye) {
        _root.eweeye = {};
    }

    if (!_root.eweeye.Node) {
        _root.eweeye.Node = {};
    }

    var _treeview = _root.eweeye.TreeView;
    var _node = _root.eweeye.Node;
    var _constants = _root.eweeye.Constants;

    // Add base node type constructor functions
    _node.Type = {};

    // https://stackoverflow.com/questions/7509831/alternative-for-the-deprecated-proto
    var Inherit = function(child, parent){
        var f = function() {}; // defining temp empty function
        f.prototype = parent.prototype;
        f.prototype.constructor = f; 
        child.prototype = new f(); 
        child.prototype.constructor = child; // restoring proper constructor for child class
        parent.prototype.constructor = parent; // restoring proper constructor for parent class    
    };

    _node.Type.Base = function Base(tree, parent, id) {
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
    };
    _node.Type.Base.prototype.Tree = "";
    _node.Type.Base.prototype.Parent = "";
    _node.Type.Base.prototype.Id = "";
    _node.Type.Base.prototype.Reactions = {};
    _node.Type.Base.prototype.Rendered = false;
    _node.Type.Base.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "";
        span.appendChild(document.createTextNode(text));
        return span;
    };
    _node.Type.Base.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        span.classList.add('fas');
        span.classList.add('fa-question');
        return span;
    };
    _node.Type.Base.prototype.CreateElement = function() {
        var li = document.createElement('li');
        li.id = this.Id;
        li.classList.add(_constants.NodeItem);
        var self = document.createElement('div');
        self.classList.add(_constants.NodeSelf);
        var button = document.createElement('button');
        button.classList.add(_constants.NodeButton);
        self.appendChild(button);
        var icon = document.createElement('div');
        icon.classList.add(_constants.NodeIcon);
        icon.appendChild(this.RenderIcon());
        icon.classList.add(_constants.NodeIcon);
        var label = document.createElement('div');
        label.classList.add(_constants.NodeLabel);
        label.appendChild(this.RenderContent());
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
        this.Rendered = true;
        return li;
    };    
    _node.Type.Base.prototype.UpdateElement = function(li) {
        var button = li.querySelector('button.' + _constants.NodeButton);
        if (button) {
            var icon = button.querySelector('div.' + _constants.NodeIcon);
            if (icon) {
                icon.innerHTML = '';
                icon.appendChild(this.RenderIcon());
            }
            var label = button .querySelector('div.' + _constants.NodeLabel);
            if (label) {
                label.innerHTML = '';
                label.appendChild(this.RenderContent());
            }
        }
    };
    _node.Type.Base.prototype.Trigger = function(action, node, message) {
        if (action === "click") {
            console.log("Node [" + this.Id + "] clicked.");
            this.TriggerParent("poke", "Message from son!");
            this.TriggerSiblings("poke", "Message from bro!");
            if (this.TriggerChildren) {
                this.TriggerChildren("poke", "Message from dad!");
            }
        } else if (action === "poke") {
            console.log("Node [" + this.Id + "] poked by node [" + node.Id + "] with message [" + JSON.stringify(message) + "]");
        }
        if (this.Reactions.hasOwnProperty(action)) {
            this.Reactions[action].call(this, node);
        }
    };
    _node.Type.Base.prototype.TriggerParent = function(action, message) {
        if (!this.Parent) {
            console.log("Node [" + this.Id + "] has no parent.");
            return;
        }
        if (window.eweeye.TreeView.Nodes.hasOwnProperty(this.Parent)) {
            window.eweeye.TreeView.Nodes[this.Parent].Trigger(action, this, message);
        }
    };
    _node.Type.Base.prototype.TriggerSiblings = function(action, message) {
        // If the parent is falsey, the sibilings are the root nodes
        if (!this.Parent) {
            for (var prop1 in window.eweeye.TreeView.Nodes) {
                if (window.eweeye.TreeView.Nodes.hasOwnProperty(prop1) && prop1 !== this.Id) {
                    if (!window.eweeye.TreeView.Nodes[prop1].Parent) {
                        window.eweeye.TreeView.Nodes[prop1].Trigger(action, this, message);
                    }
                }
            }
        } else {
            if (window.eweeye.TreeView.Nodes.hasOwnProperty(this.Parent)) {
                var node = window.eweeye.TreeView.Nodes[this.Parent];
                if (node instanceof window.eweeye.Node.Type.Expandable) {
                    for (var prop2 in node.Children) {
                        if (window.eweeye.TreeView.Nodes.hasOwnProperty(prop2) && prop2 !== this.Id) {
                            window.eweeye.TreeView.Nodes[prop2].Trigger(action, this, message);
                        }
                    }    
                }
            }
        }
    };     

    _node.Type.Primitive = function Primitive(tree, parent, id, value) { 
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
        this.Value = value;
    };
    Inherit(_node.Type.Primitive, _node.Type.Base);
    _node.Type.Primitive.prototype.Value = null;
    _node.Type.Primitive.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "";
        var element = null;
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
                    try {
                    if (this.Value instanceof HTMLElement)
                        element = this.Value;
                    } catch (e) {
                        text = JSON.stringify(this.Value);
                    }
                    break;
                case "function":
                    text = JSON.stringify(this.Value);
                    break;
            }
        }
        if (!element) {
            span.appendChild(document.createTextNode(text));
        } else {
            span.appendChild(element);
        }
        return span;
    };
    _node.Type.Primitive.prototype.RenderIcon = function() {
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

    _node.Type.Toggle = function Toggle(tree, parent, id, value) { 
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
        this.Value = value;
    };
    Inherit(_node.Type.Toggle, _node.Type.Base);
    _node.Type.Toggle.prototype.Value = false;
    _node.Type.Toggle.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "false";
        if (this.Value) 
            text = "true";
        span.appendChild(document.createTextNode(text));
        return span;
    };
    _node.Type.Toggle.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        span.classList.add('fas');
        if (this.Value) 
            span.classList.add('fa-dot-circle');
        else
            span.classList.add('fa-circle');
        return span;
    };
    _node.Type.Toggle.prototype.Reactions = {
        "click": function (actor) {
            this.Value = !this.Value;
            window.eweeye.TreeView.Render(this);
        }
    };

    _node.Type.Expandable = function Expandable(tree, parent, id, value) { 
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
        this.Value = value;
        this.Children = {};
    };
    Inherit(_node.Type.Expandable, _node.Type.Primitive);
    _node.Type.Expandable.prototype.Children = {};
    _node.Type.Expandable.prototype.Expanded = false;
    _node.Type.Expandable.prototype.IconOpen = null;
    _node.Type.Expandable.prototype.IconClosed = null;
    _node.Type.Expandable.prototype.Reactions = {
        "click": function (actor) {
            this.Expanded = !this.Expanded;
            window.eweeye.TreeView.Render(this);
        }
    };  
    _node.Type.Expandable.prototype.RenderIcon = function() {
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
    _node.Type.Expandable.prototype.CreateElement = function() {
        var li = document.createElement('li');
        li.id = this.Id;
        li.classList.add(_constants.NodeItem);
        var self = document.createElement('div');
        self.classList.add(_constants.NodeSelf);
        var button = document.createElement('button');
        button.classList.add(_constants.NodeButton);
        self.appendChild(button);
        var icon = document.createElement('div');
        icon.classList.add(_constants.NodeIcon);
        icon.appendChild(this.RenderIcon());
        icon.classList.add(_constants.NodeIcon);
        var label = document.createElement('div');
        label.classList.add(_constants.NodeLabel);
        label.appendChild(this.RenderContent());
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
        var ul = document.createElement('ul');
        ul.classList.add(_constants.NodeChildren);
        li.appendChild(ul);
        this.Rendered = true;
        return li;
    };
    _node.Type.Expandable.prototype.UpdateElement = function(li) {
        var button = li.querySelector('button.' + _constants.NodeButton);
        if (button) {
            var icon = button.querySelector('div.' + _constants.NodeIcon);
            if (icon) {
                icon.innerHTML = '';
                icon.appendChild(this.RenderIcon());
            }
            var label = button .querySelector('div.' + _constants.NodeLabel);
            if (label) {
                label.innerHTML = '';
                label.appendChild(this.RenderContent());
            }
        }
        var children = li.querySelector('ul.' + _constants.NodeChildren);
        if (children) {
            if (this.Expanded) {
                for (var prop in this.Children) {
                    if (this.Children.hasOwnProperty(prop)) {
                        var subnode = _root.eweeye.TreeView.Nodes.Get(prop);
                        if (!subnode.Rendered) {
                            _root.eweeye.TreeView.Render(subnode);
                        }
                    }
                }
                children.classList.remove(_constants.Hidden);
            } else {
                children.classList.add(_constants.Hidden);                    
            }
        }
    };
    _node.Type.Expandable.prototype.TriggerChildren = function(action, message) {
        for (var prop in this.Children) {
            if (window.eweeye.TreeView.Nodes.hasOwnProperty(prop)) {
                window.eweeye.TreeView.Nodes[prop].Trigger(action, this, message);
            }
        }    
    };     

    _node.Type.Folder = function Folder(tree, parent, id, value) { 
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
        this.Value = value;
        this.IconOpen = 'folder-open';
        this.IconClosed = 'folder';
        this.Children = {};
    };
    Inherit(_node.Type.Folder, _node.Type.Expandable);

    _node.Type.PlusMinus = function PlusMinus(tree, parent, id, value) { 
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
        this.Value = value;
        this.IconOpen = 'minus-square';
        this.IconClosed = 'plus-square';
        this.Children = {};
    };
    Inherit(_node.Type.PlusMinus, _node.Type.Expandable);

    _node.Type.Chevron = function PlusMinus(tree, parent, id, value) { 
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
        this.Value = value;
        this.IconOpen = 'chevron-down';
        this.IconClosed = 'chevron-right';
        this.Children = {};
    };
    Inherit(_node.Type.Chevron, _node.Type.Expandable);

    _node.Type.Caret = function PlusMinus(tree, parent, id, value) { 
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
        this.Value = value;
        this.IconOpen = 'caret-down';
        this.IconClosed = 'caret-right';
        this.Children = {};
    };
    Inherit(_node.Type.Caret, _node.Type.Expandable);

    _node.Type.Arrow = function PlusMinus(tree, parent, id, value) { 
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
        this.Value = value;
        this.IconOpen = 'arrow-down';
        this.IconClosed = 'arrow-right';
        this.Children = {};
    };
    Inherit(_node.Type.Arrow, _node.Type.Expandable);

    _node.Type.Angle = function PlusMinus(tree, parent, id, value) { 
        this.Tree = tree;
        this.Parent = parent;
        this.Id = id;
        this.Value = value;
        this.IconOpen = 'angle-down';
        this.IconClosed = 'angle-right';
        this.Children = {};
    };
    Inherit(_node.Type.Angle, _node.Type.Expandable);

    _node.Create = function(type, tree, parent, id, value) { 
        if (typeof type !== "string") 
            type = "";
        type = type.toLowerCase();
        switch (type) {
            case "expandable":
                return new eweeye.Node.Type.Expandable(tree, parent, id, value);
            case "folder":
                return new eweeye.Node.Type.Folder(tree, parent, id, value);
            case "toggle":
                return new eweeye.Node.Type.Toggle(tree, parent, id, value);
            case "plusminus":
                return new eweeye.Node.Type.PlusMinus(tree, parent, id, value);
            case "chevron":
                return new eweeye.Node.Type.Chevron(tree, parent, id, value);
            case "caret":
                return new eweeye.Node.Type.Caret(tree, parent, id, value);
            case "arrow":
                return new eweeye.Node.Type.Arrow(tree, parent, id, value);
            case "angle":
                return new eweeye.Node.Type.Angle(tree, parent, id, value);
            default:
                return new eweeye.Node.Type.Primitive(tree, parent, id, value);
        }
    };
})();