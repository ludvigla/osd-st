import React, { useRef, useEffect, useState } from 'react';
import Paper from 'paper';
import "./canvasAnnotate.css"
import { project } from 'paper/dist/paper-core';

const CanvasAnnotate = (props) => {

  const canvasRefAnnotate = useRef(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('items'));
    if (items) {
     setItems(items);
    }
  }, []);

  useEffect(() => {
    var allitems = items ? items : [];

    const canvas = canvasRefAnnotate.current;
    Paper.setup(canvas);

    var myPath;

    allitems.map((item) => {
      myPath = new Paper.Path();
      myPath.strokeColor = item.color;
      myPath.fillColor = item.color; 
      myPath.strokewidth = 5;
      myPath.opacity = item.opacity; 
      item.arr.map((xy) => {
        myPath.add([xy.x, xy.y]);
      });
    })

    Paper.view.onMouseDown = (event) => {
      myPath = new Paper.Path();
      myPath.strokeColor = props.objectColor;
      myPath.fillColor = props.objectColor; 
      myPath.strokewidth = 5;
      myPath.opacity = props.objectOpacityValue;
    };

    Paper.view.onMouseDrag = (event) => {
      myPath.add(event.point);
    };

    Paper.view.onMouseUp = (event) => {
      var tmpArray = myPath.segments.map((item) => {
        return {x: item._point.x, y: item._point.y};
      });
      allitems.push({arr: tmpArray, color: props.objectColor, opacity: props.objectOpacityValue});
    };

    Paper.view.draw();

    return () => {
      localStorage.setItem('items', JSON.stringify(allitems));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [items, props.objectColor, props.objectOpacityValue]);
  
  return <canvas 
            ref={canvasRefAnnotate} 
            id="canvas-annotate" 
            className='item-grid-overlay'
            resize="true" 
            style={{
                height: "800px",
                width: "1200px",
            
            }}
        />
}

export default CanvasAnnotate;