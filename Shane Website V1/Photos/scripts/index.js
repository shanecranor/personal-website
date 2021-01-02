// external js: masonry.pkgd.js, imagesloaded.pkgd.js

// init Masonry
window.onload = function(){
    var grid = document.querySelector('.grid');

    var msnry = new Masonry( grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        gutter: '.gutter-sizer',
        transitionDuration: 0
    });

    imagesLoaded( grid ).on( 'progress', function() {
        // layout Masonry after each image loads
        msnry.layout();
    });

}
