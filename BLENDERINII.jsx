// NOTE: This JSX expects the Photoshop action "blenderini" to exist
// Prompt the user to select the parent folder
var parentFolder = Folder.selectDialog("Select Parent Folder -> BACKGROUND LAYER");

if (parentFolder) {
    // Prompt the user to select the first child folder
    var childFolder1 = Folder.selectDialog("Select 1st stacked Child folder -> MIDDLE LAYER");

    if (childFolder1) {
        // Prompt the user to select the second child folder
        var childFolder2 = Folder.selectDialog("Select 2nd stacked Child folder -> TOP LAYER");

        if (childFolder2) {
            // Function to process a single parent PNG
            function processParentPNG(parentPath) {
                // Open the parent PNG
                var parentDoc = app.open(new File(parentPath));

                // Get the parent file name without extension
                var parentFileName = parentDoc.name.replace(/\.[^\.]+$/, '');

                // Open and place the first child PNG as a new layer
                var childFile1 = new File(childFolder1 + "/" + parentFileName + ".png");
                placePNGasLayer(childFile1);

                // Open and place the second child PNG as a new layer
                var childFile2 = new File(childFolder2 + "/" + parentFileName + ".png");
                placePNGasLayer(childFile2);

                // Run the specified action from the "ERIC" action set
                app.doAction("blenderini", "ERIC");

                // Close the parent document without saving changes
                parentDoc.close(SaveOptions.DONOTSAVECHANGES);

                // NOW WITH CLEANUP 
                parentDoc = null;
                childFile1 = null;
                childFile2 = null;
            }

            // Function to place a PNG file as a new layer in the active document
            function placePNGasLayer(pngFile) {
                var desc = new ActionDescriptor();
                desc.putPath(charIDToTypeID('null'), pngFile);
                desc.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), charIDToTypeID('Qcsa'));
                desc.putUnitDouble( charIDToTypeID( "Wdth" ),charIDToTypeID( "#Prc" ), 100 );
                desc.putUnitDouble( charIDToTypeID( "Hght" ), charIDToTypeID( "#Prc" ), 100 );
                executeAction( charIDToTypeID( "Plc " ), desc, DialogModes.NO );

// Resize layer to fit canvas
var layer = app.activeDocument.activeLayer;

// Get the current dimensions of the layer
var layerWidth = layer.bounds[2].value - layer.bounds[0].value;
var layerHeight = layer.bounds[3].value - layer.bounds[1].value;

// Get the dimensions of the canvas
var canvasWidth = app.activeDocument.width;
var canvasHeight = app.activeDocument.height;

// Calculate the scaling factors
var scaleX = canvasWidth / layerWidth;
var scaleY = canvasHeight / layerHeight;

// Choose the smaller scaling factor to maintain aspect ratio
var scale = Math.min(scaleX, scaleY);

// Resize the layer proportionally to fit the canvas
layer.resize(scale * 100, scale * 100); // multiplying by 100 to convert percentage to pixels
// layer.resize(app.activeDocument.width, app.activeDocument.height);

                // NOW WITH CLEANUP 
                desc = null;
            }

            // Function to process all parent PNGs in a folder
            function processAllParents() {
                var parentFiles = parentFolder.getFiles("*.png");

                for (var i = 0; i < parentFiles.length; i++) {
                    processParentPNG(parentFiles[i]);
                }

                //  NOW WITH CLEANUP
                parentFiles = null;
            }

            // Run the script
            processAllParents();

            // NOW WITH CLEANUP
            parentFolder = null;
            childFolder1 = null;
            childFolder2 = null;

        } else {
            alert("Operation canceled. Please select the second Child Folder.");
        }
    } else {
        alert("Operation canceled. Please select the first Child Folder.");
    }
} else {
    alert("Operation canceled. Please select the Parent Folder.");
}
