import React, { useEffect, useState } from "react";
import OpenSeaDragon from "openseadragon";
import "./opensea-dragon-svg-overlay";
import * as Paper from "paper";
import * as d3 from "d3";
import "./OSG.css";
import Canvas from "./canvas";
import CanvasAnnotate from "./canvasAnnotate";

// TODO: read spots data from json, currently using a dummy dataset with 50*50 spots
var dataset = [];
for (let i = 0; i < 51; i++) {
  for (let j = 0; j < 51; j++) {
    dataset.push({ x: i / 50, y: j / 50, selected: false , opacity: 1});
  }
};

// Convert between two coordinate systems given two ranges of limits
const convertRange = ( value, r1, r2 ) => { 
  return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
};

// Get osd viewer propoerties used for converting between coordinate systems
const getViewerProps = (viewer) => {
  var curBounds = viewer.viewport.getBounds(); 
  var prps = {};
  prps.x = curBounds.x;
  prps.y = curBounds.y;
  prps.width = curBounds.width;
  prps.height = curBounds.height;
  return prps;
};

const OSG = (props) => {
  // Create state variable for the current selected path (lasso tool)
  // and pass data from the canvas to the OSD viewer
  const [curPath, setCurPath] = useState(false);
  const passData = (data) => {
    setCurPath(data);
  };

  // Create state variable for the current selected path to erase (lasso tool)
  // and pass data from the canvas to the OSD viewer
  const [curErasePath, setCurErasePath] = useState(false);
  const passEraseData = (data) => {
    setCurErasePath(data);
  };

  // Create state variables for viewer, overlay and d3 nodes (svg)
  const [viewer, setViewer] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [d3Node, setd3Node] = useState(null);

  // Hold data
  const [data, setData] = useState(dataset);

  // Function to initiate the OpenSeaDragon viewer
  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    setViewer(
      OpenSeaDragon({
        id: "openseadragon",
        toolbar: "toolbarDiv",
        zoomInButton: "zoom-in",
        zoomOutButton: "zoom-out",
        fullPageButton: "maximize",
        homeButton: "home",
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: [
          "https://openseadragon.github.io/example-images/highsmith/highsmith.dzi",
        ],
        defaultZoomLevel: 0,
        minZoomLevel: 0,
        visibilityRatio: 1.0,
        minZoomImageRatio: 1.0,
      })
    );
  };

  // Initiate a new osd viewer on render
  useEffect(() => {
    InitOpenseadragon();
    return () => {
      viewer && viewer.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a svg overlay to the osd viewer after the viewer is initialized
  useEffect(() => {
    if (viewer) {
      setOverlay(viewer.svgOverlay(OpenSeaDragon.Rect(0, 0, 1, 1)));
    }
  }, [viewer]);

  // Create d3 nodes for the overlay
  useEffect(() => {
    if (overlay) {
      setd3Node(d3.select(overlay.node()));
    }
  }, [overlay]);

  // Draw spots on the svg overlay
  useEffect(() => {
    if (d3Node) {
      // draw circles for each spot
      d3Node
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        })
        .attr("r", 0.005)
        .style("fill", "white")
        .attr("opacity", function (d) {
          return d.opacity;
        });
    }
  }, [d3Node]);

  // Select spots
  useEffect(() => {
    if (curPath) {
      var prps = getViewerProps(viewer);

      setData((data) =>
        data.map((d) => {
          var newPoint = new Paper.Point(
            convertRange(d.x, [prps.x, prps.width + prps.x], [0, 1200]),
            convertRange(d.y, [prps.y, prps.height + prps.y], [0, 800])
          );
          d.selected = curPath.contains(newPoint) ? true : d.selected;
          return d;
        })
      );
    }
  }, [curPath]);

  // Deselect spots
  useEffect(() => {
    if (curErasePath) {
      var prps = getViewerProps(viewer);

      setData((data) =>
        data.map((d) => {
          var newPoint = new Paper.Point(
            convertRange(d.x, [prps.x, prps.width + prps.x], [0, 1200]),
            convertRange(d.y, [prps.y, prps.height + prps.y], [0, 800])
          );
          d.selected = curErasePath.contains(newPoint) ? false : d.selected;
          return d;
        })
      );
    }
  }, [curErasePath]);

  // Update the opacity of the selected spots when the opacity slider is changed
  useEffect(() => {
    setData((data) =>
      data.map((d) => {
        d.opacity = props.opacityValue;
        return d;
      })
    );
  }, [props.opacityValue]);

  // Update spots when slection or deselection is triggered
  useEffect(() => {
    if (d3Node) {
      d3Node
        .selectAll("circle")
        .data(data)
        .style("fill", function (d) {
          return d.selected ? "#117777" : "white";
        })
        .attr("opacity", function (d) {
          return d.opacity;
        });
    }
  }, [data, d3Node]);

  let isLasso = props.isLasso;
  let isDraw = props.isDraw;

  if (isLasso || isDraw) {
    return (
      <div>
        <div
          id="openseadragon"
          className="grid-container"
          style={{
            height: "800px",
            width: "1200px",
          }}
        >
          {isLasso ? (
            <Canvas
              //className="item-grid-overlay"
              passData={passData}
              passEraseData={passEraseData}
            />
          ) : (
            <CanvasAnnotate 
              //className="item-grid-overlay" 
              objectColor={props.objectColor}
              objectOpacityValue={props.objectOpacityValue}
              viewer={viewer}
            />
          )}
        </div>
      </div>
    ); 
  } else {
    return (
      <div>
          <div
            id="openseadragon"
            style={{
              height: "800px",
              width: "1200px",
            }}
          >
          </div>
      </div>
     );
  }

};

export { OSG };
