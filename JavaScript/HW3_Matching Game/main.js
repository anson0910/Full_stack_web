var  numberOfFaces = 5;     // num of faces to create at first

function  do_game() {
    generateFaces();
}

function  generateFaces()   {
    for (var i = 0; i < numberOfFaces; ++i) {
        var  theBody = document.getElementsByTagName("body")[0];
        var  faceImage = document.createElement("img");
        faceImage.src = "smile.png";
        faceImage.style.width = "100px";
        faceImage.style.height = "100px";
        var  smileWidth = parseInt(faceImage.style.width);
        var  smileHeight = parseInt(faceImage.style.height);    // smile size should be 100

        var  clientHeight = document.getElementById("leftSide").clientHeight;
        var  clientWidth = document.getElementById("leftSide").clientWidth; // both should be 500

        var  topPosition = Math.random() * (clientHeight - smileHeight);
        topPosition = Math.floor(topPosition);
        var  leftPosition = Math.random() * (clientWidth - smileWidth);
        leftPosition = Math.floor(leftPosition);
        faceImage.style.top = topPosition + "px";
        faceImage.style.left = leftPosition + "px";

        var  theLeftSide = document.getElementById("leftSide");
        theLeftSide.appendChild(faceImage);
    }

    var  theRightSide = document.getElementById("rightSide");
    // copy all left side images, but delete one for guessing
    var  leftSideImages = theLeftSide.cloneNode(true);
    leftSideImages.removeChild(leftSideImages.lastChild);
    theRightSide.appendChild(leftSideImages);   // div under div
    theLeftSide.lastChild.onclick= nextLevel;
    theBody.onclick = gameOver;
    // theBody.addEventListener("click", gameOver);
}

function  nextLevel()    {
    event.stopPropagation();
    numberOfFaces += 5;
    removeFaces();  // remove all faces before next level
    generateFaces();
}

function  removeFaces() {
    var  theLeftSide = document.getElementById("leftSide");
    var  theRightSide = document.getElementById("rightSide");

    while (theLeftSide.firstChild)
        theLeftSide.removeChild(theLeftSide.firstChild);

    while (theRightSide.firstChild)
        theRightSide.removeChild(theRightSide.firstChild);
}

function  gameOver() {
    var  theBody = document.getElementsByTagName("body")[0];
    var  theLeftSide = document.getElementById("leftSide");
    alert("Game Over!");
    // theBody.removeEventListener("click", gameOver);
    theBody.onclick = null;
    theLeftSide.lastChild.onclick = null;
}
