window.onload = function(){
    FlexMasonry.init('.grid', options= {
        responsive: true,
        /*
		 * A list of how many columns should be shown at different responsive
		 * breakpoints, defined by media queries.
		 */
        breakpointCols: {
            'min-width: 3500px': 5,
            'min-width: 2500px': 4,
            'min-width: 1500px': 3,
            'min-width: 950px': 2,
            'min-width: 590px': 1,
        },
    });
    showGal(".all")

}
window.onresize = function(){

}

function showGal(className){

    const grid = document.querySelector('.grid');
    const storageGrid = document.querySelector('#storageGrid');
    //hide all photo elements by moving all of them to the hidden storage grid
    moveChildNodes(grid, storageGrid);
    const selectedGallery = Array.from(document.querySelectorAll(className));
    //move only selected photos back into the visible grid
    shuffleArray(selectedGallery);
    selectedGallery.forEach(function(photo) {
        grid.appendChild(photo);
    });
    //set the background photo for the main page
    document.getElementById("backgroundImage").src = "styles/"+className.substring(1) + ".jpg";
    FlexMasonry.refreshAll(options= {
        responsive: true,
        /*
		 * A list of how many columns should be shown at different responsive
		 * breakpoints, defined by media queries.
		 */
        breakpointCols: {
            'min-width: 3500px': 5,
            'min-width: 2500px': 4,
            'min-width: 1500px': 3,
            'min-width: 950px': 2,
            'min-width: 590px': 1,
        },
    });
};
function moveChildNodes(parent, newParent) {
    while (parent.firstChild) {
        newParent.appendChild(parent.firstChild);
    }
}
function shuffleArray(arr) {
    arr.sort(() => Math.random() - 0.5);
}