document.addEventListener('click', function(event) {
    var GetClosest = function (elem, selector) {
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( elem.matches( selector ) ) return elem;
        }
        return null;
    };
    // look for the containing button
    var button = GetClosest(event.target, 'button');
    if (button) {
        // check for main button of node
        if (button.matches('.' + window.eweeye.Constants.NodeButton)) {
            var li = GetClosest(button, 'li');
            if (li.matches('.' + window.eweeye.Constants.NodeItem)) {
                var nodeId = li.id;
                var result = eweeye.TreeView.Nodes[nodeId].Trigger();
                if (result) {
                    eweeye.TreeView.Render(result);
                }
            }
        }
    }
});