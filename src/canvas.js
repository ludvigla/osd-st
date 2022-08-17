import React, { useRef, useEffect } from 'react';
import Paper from 'paper';
import draw1 from './draw';
import "./canvas.css"

const Canvas = (props) => {

  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current;
    Paper.setup(canvas);
    draw1(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return <canvas 
            ref={canvasRef} 
            id="canvas" 
            className='item-grid-overlay'
            resize="true" 
            style={{
                height: "800px",
                width: "1200px",
            
            }}
        />
}

export default Canvas;