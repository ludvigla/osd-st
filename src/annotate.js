import Paper from "paper";

const draw2 = function (props) {

  var myPath;

  Paper.view.onMouseDown = (event) => {
    console.log(myPath);
    myPath = new Paper.Path();
    myPath.strokeColor = props.objectColor;
    myPath.fillColor = props.objectColor; 
    myPath.strokewidth = 5;
    myPath.opacity = props.objectOpacityValue;
  };

  Paper.view.onMouseDrag = (event) => {
    myPath.add(event.point);
  };

  Paper.view.draw();
};

export default draw2;