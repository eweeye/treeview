document.addEventListener('click', function(event) {
    // Only react to treeview node click
    if (!event.target.matches('.node')) return;
    // The id of the node is on the LI tag, two levels up: LI > DIV > BUTTON
    var nodeId = (event.target).parentElement.parentElement.id;
    eweeye.Node(nodeId).Click();
});