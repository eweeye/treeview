(function() {

    var _root = window;

    if (!_root.eweeye) {
        _root.eweeye = {};
    }

    var Node = function Node() {};
    Node.prototype.GetContainerElement = function(node) {
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
    };
    Node.prototype.GetElement = function(node) {
        return (function(node){
            var found = document.getElementById(node.Id);
            if (!found) {
                console.error("Unable to find in DOM");
                return;
            }                
            return found;
        })(node);
    };

    if (!_root.eweeye.Node) {
        _root.eweeye.Node = new Node();
    }

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
    // Function to render a node into the DOM
    _node.Type.Base.prototype.Render = function() {
        var _node = window.eweeye.Node;
        var li;
        if (!this.Rendered) {
            var ul = _node.GetContainerElement(this);
            if (ul) {
                li = this.CreateElement();
                ul.appendChild(li);
            }   
        } else {
            li = _node.GetElement(this);
            if (li) {
                this.UpdateElement(li);
            }
        }
    };
    _node.Type.Base.prototype.RenderContent = function() {
        var span = document.createElement('span');
        var text = "";
        span.appendChild(document.createTextNode(text));
        return span;
    };
    _node.Type.Base.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        var theme = 'far';
        if (this.hasOwnProperty("Theme")) {
            switch (this.Theme.toLowerCase()) {
                case "solid":
                    theme = "fas";
                    break;
                case "light":
                    theme = "fal";
                    break;
                case "duotone":
                    theme = "fad";
                    break;
                case "solid":
                default:
                    break;
            }
        }
        span.classList.add(theme);
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

    _node.Type.Primitive = function Primitive(node) { 
        this.Tree = node.Tree;
        this.Parent = node.Parent;
        this.Id = node.Id;
        this.Value = node.Value;
        if (node.hasOwnProperty("Icon")) {
            this.Icon = node.Icon;
        } else {
            if (this.Value === null) 
            this.Icon = "ban";
            if (this.Value || this.Value === false || this.Value === 0) {
                switch (typeof this.Value) {
                    case "undefined":
                        this.Icon = "ban";
                        break;
                    case "boolean":
                        if (this.Value) 
                            this.Icon = "check";
                        else
                            this.Icon = "times";
                        break;
                    case "number":
                        this.Icon = "hashtag";
                        break;
                    case "string":
                        this.Icon = "text";
                        break;
                    case "object":
                        this.Icon = "cube";
                        break;
                    case "function":
                        this.Icon = "rocket";
                        break;
                }
            }
        }
    };
    Inherit(_node.Type.Primitive, _node.Type.Base);
    _node.Type.Primitive.prototype.Value = null;
    _node.Type.Primitive.prototype.Icon = "circle";
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
        var theme = 'far';
        if (this.hasOwnProperty("Theme")) {
            switch (this.Theme.toLowerCase()) {
                case "solid":
                    theme = "fas";
                    break;
                case "light":
                    theme = "fal";
                    break;
                case "duotone":
                    theme = "fad";
                    break;
                case "solid":
                default:
                    break;
            }
        }
        span.classList.add(theme);
        if (this.Value === null) 
        span.classList.add('fa-ban');
        span.classList.add('fa-' + this.Icon);
        return span;
    };

    _node.Type.Toggle = function Toggle(node) { 
        this.Tree = node.Tree;
        this.Parent = node.Parent;
        this.Id = node.Id;
        this.Value = node.Value;
        if (node.hasOwnProperty("IconTrue")) {
            this.IconTrue = node.IconTrue;
        }
        if (node.hasOwnProperty("IconFalse")) {
            this.IconFalse = node.IconFalse;
        }
    };
    Inherit(_node.Type.Toggle, _node.Type.Base);
    _node.Type.Toggle.prototype.Value = false;
    _node.Type.Toggle.prototype.IconTrue = "dot-circle";
    _node.Type.Toggle.prototype.IconFalse = "circle";    
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
        var theme = 'far';
        if (this.hasOwnProperty("Theme")) {
            switch (this.Theme.toLowerCase()) {
                case "solid":
                    theme = "fas";
                    break;
                case "light":
                    theme = "fal";
                    break;
                case "duotone":
                    theme = "fad";
                    break;
                case "solid":
                default:
                    break;
            }
        }
        span.classList.add(theme);
        if (this.Value) 
            span.classList.add('fa-' + this.IconTrue);
        else
            span.classList.add('fa-' + this.IconFalse);
        return span;
    };
    _node.Type.Toggle.prototype.Reactions = {
        "click": function (actor) {
            this.Value = !this.Value;
            this.Render();
        }
    };

    _node.Type.Expandable = function Expandable(node) { 
        this.Id = node.Id;
        this.Tree = node.Tree;
        this.Value = node.Value;
        this.Parent = node.hasOwnProperty("Parent") ? node.Parent : null;
        if (node.hasOwnProperty("IconOpen")) {
            this.IconOpen = node.IconOpen;
        }
        if (node.hasOwnProperty("IconClosed")) {
            this.IconClosed = node.IconClosed;
        }
        this.Children = {};
    };
    Inherit(_node.Type.Expandable, _node.Type.Primitive);
    _node.Type.Expandable.prototype.Children = {};
    _node.Type.Expandable.prototype.Expanded = false;
    _node.Type.Expandable.prototype.IconOpen = "minus-square";
    _node.Type.Expandable.prototype.IconClosed = "plus-square";
    _node.Type.Expandable.prototype.Reactions = {
        "click": function (actor) {
            this.Expanded = !this.Expanded;
            this.Render();
        }
    };  
    _node.Type.Expandable.prototype.RenderIcon = function() {
        var span = document.createElement('span');
        var theme = 'far';
        if (this.hasOwnProperty("Theme")) {
            switch (this.Theme.toLowerCase()) {
                case "solid":
                    theme = "fas";
                    break;
                case "light":
                    theme = "fal";
                    break;
                case "duotone":
                    theme = "fad";
                    break;
                case "solid":
                default:
                    break;
            }
        }
        span.classList.add(theme);        
        if (this.Expanded) {
            if (this.IconOpen && typeof this.IconOpen === 'string') {
                span.classList.add('fa-' + this.IconOpen);
            }
        } else {
            if (this.IconClosed && typeof this.IconClosed === 'string') {
                span.classList.add('fa-' + this.IconClosed);
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
                            subnode.Render();
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

    _node.Create = function(node) {
        if (node.hasOwnProperty("Type")) {
            switch (node.Type.toLowerCase()) {
                case "expandable":
                    return new eweeye.Node.Type.Expandable(node);
                case "toggle":
                    return new eweeye.Node.Type.Toggle(node);
                default:
                    return new eweeye.Node.Type.Primitive(node);
            }
        }
    };
})();