function  show_pattern()  {
    var  theBody = document.getElementById("theBody");
    var  topPosition = 25;
    var  leftPosition = 25;
    var  height = 300;
    var  width = 300;
    var  bgColors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

    while (width > 50)  {
        var  thisDiv = document.createElement("div");
        var  randomNum = Math.random() * 7;
        randomNum = Math.floor(randomNum);

        thisDiv.style.top = topPosition + "px";
        thisDiv.style.left = leftPosition + "px";
        thisDiv.style.height = height + "px";
        thisDiv.style.width = width + "px";
        thisDiv.style.background = bgColors[randomNum];
        theBody.appendChild(thisDiv);

        topPosition += 10;
        leftPosition += 10;
        height -= 20;
        width -= 20;
    }
}
