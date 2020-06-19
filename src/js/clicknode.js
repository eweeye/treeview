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
        if (button.matches('.node')) {
            var li = GetClosest(button, 'li');
            var nodeId = li.id;
            var result = eweeye.TreeView.Nodes[nodeId].Trigger();
            if (result) {
                eweeye.TreeView.Render(result);
            }
        }
    }
});