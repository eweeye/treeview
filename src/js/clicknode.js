document.addEventListener('click', function(event) {
    // Only react to treeview node click
    if (!event.target.matches('.node')) return;
    // The id of the node is on the LI tag, two levels up: LI > DIV > BUTTON
    var nodeID = (event.target).parentElement.parentElement;
});