Since server side is not ready yet, best way to see confusion_ng in action is to use Atom or Brackets live preview.

If live preview is not available in your editor, please change directory to confusion_ng folder, and type in terminal <br>
% gulp <br>
% http-server <br>
and from browser, connect to <br>
localhost:8080/dist/index.html

If http-server is not installed, please install by typing <br>
% sudo npm install http-server -g


Another alternative is to change directory to confusion_ng/json-server folder, and type in terminal <br>
% gulp <br>
% json-server --watch db.json <br>
and from browser, connect to <br>
localhost:3000

If json-server is not installed, please install by typing <br>
% sudo npm install json-server -g

