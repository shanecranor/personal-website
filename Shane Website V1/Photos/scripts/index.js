window.onload = function(){
    FlexMasonry.init('.grid', options= {
        responsive: true,
        /*
		 * A list of how many columns should be shown at different responsive
		 * breakpoints, defined by media queries.
		 */
        breakpointCols: {
            'min-width: 3000px': 5,
            'min-width: 2000px': 4,
            'min-width: 1000px': 3,
            'min-width: 750px': 2,
            'min-width: 590px': 1,
        },
    });


}
window.onresize = function(){

}

function showGal(querySelectorStr){
    const grid = document.querySelector('.grid');
    const storageGrid = document.querySelector('#storageGrid');
    //hide all photo elements by moving all of them to the hidden storage grid
    moveChildNodes(grid, storageGrid);
    const selectedGallery = document.querySelectorAll(querySelectorStr);
    //move only selected photos back into the visible grid
    selectedGallery.forEach(function(photo) {
        grid.appendChild(photo);
    });
    FlexMasonry.refreshAll(options= {
        responsive: true,
        /*
		 * A list of how many columns should be shown at different responsive
		 * breakpoints, defined by media queries.
		 */
        breakpointCols: {
            'min-width: 3000px': 5,
            'min-width: 2000px': 4,
            'min-width: 1000px': 3,
            'min-width: 750px': 2,
            'min-width: 590px': 1,
        },
    });
};
function moveChildNodes(parent, newParent) {
    while (parent.firstChild) {
        newParent.appendChild(parent.firstChild);
    }
}