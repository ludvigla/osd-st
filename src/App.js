import React, {useState} from 'react';
import { OSG } from './OSG';
import "./App.css";
import { makeStyles, createTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Slider from '@material-ui/core/Slider';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { styles } from "./styles";
import images from "./images";
import { HexColorPicker } from "react-colorful";


function App() {

  // Make styles from drawer
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  // Keep track of drawer open/closed
  const [isOpened, setIsOpened] = useState(false);

  // Keep track of lasso tool
  const [isLasso, setIsLasso] = useState(false);

  // Keep track of draw tool
  const [isDraw, setIsDraw] = useState(false);

  // Keep track of opacity slider
  const [opacity, setOpacity] = useState(1);

  // Keep track of object opacity slider
  const [objectOpacity, setObjectOpacity] = useState(1);
  
  // Event handler for lasso tool button
  const handleLassoButtonClick = event => {
    setIsLasso(!isLasso);
    setIsDraw(false);
  };

  // Keep track of color
  const [color, setColor] = useState("#ff0000");

  // Event handler for draw tool button
  const handleDrawButtonClick = event => {
    setIsDraw(!isDraw);
    setIsLasso(false);
  };

  // Event handler for spot opacity slider
  const handleOpacitySlider = (event, newValue) => {
    setOpacity(newValue);
  };

  // Event handler for object opacity slider
  const handleObjectOpacitySlider = (event, newValue) => {
    setObjectOpacity(newValue);
  };


  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setIsOpened(!isOpened)}
            className={classes.icon}
          >
            {isOpened ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Header
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <div className={classes.container}>
        <Drawer
          id="drawer"
          variant="permanent"
          classes={{
            paper: clsx(classes.drawer, {
              [classes.closed]: !isOpened,
              [classes.opened]: isOpened,
            }),
          }}
        >
          <div id="toolbarDiv" className="toolbar">
            <table id="menu-bar" className="menu-bar">
              <tbody>
                <tr>
                  <th>
                    <a id="zoom-in" href="#zoom-in">
                      <button>
                        <img
                          className="drawer-icon"
                          src={images.ZoomInImage}
                          alt="zoom-in button"
                        ></img>
                      </button>
                    </a>
                  </th>
                  <th>
                    <a id="zoom-out" href="#zoom-out">
                      <button>
                        <img
                          className="drawer-icon"
                          src={images.ZoomOutImage}
                          alt="zoom-out button"
                        ></img>
                      </button>
                    </a>
                  </th>
                </tr>
                <tr>
                  <th>
                    <a id="maximize" href="#maximize">
                      <button className="drawer-button">
                        <img
                          src={images.MaximizeImage}
                          className="drawer-icon"
                          alt="maximize button"
                        ></img>
                      </button>
                    </a>
                  </th>
                  <th>
                    <a id="home" href="#home">
                      <button className="drawer-button">
                        <img
                          src={images.HomeImage}
                          className="drawer-icon"
                          alt="home button"
                        ></img>
                      </button>
                    </a>
                  </th>
                </tr>
                <tr>
                  <th>
                    <button
                      className="drawer-button"
                      style={{ backgroundColor: isLasso ? "#117777" : null }}
                    >
                      <img
                        src={images.LassoImage}
                        className="drawer-icon"
                        alt="lasso tool"
                        onClick={handleLassoButtonClick}
                      ></img>
                    </button>
                  </th>
                  <th>
                    <button
                      className="drawer-button"
                      style={{ backgroundColor: isDraw ? "#117777" : null }}
                    >
                      <img
                        src={images.PaintBrushImage}
                        className="drawer-icon"
                        alt="drawing tool"
                        onClick={handleDrawButtonClick}
                      ></img>
                    </button>
                  </th>
                </tr>
              </tbody>
            </table>
            {isDraw ? (
              <>
                <section className="color-picker">
                  <HexColorPicker color={color} onChange={setColor} />
                </section>
                <h5 className="drawer-header">Object opacity</h5>
                <Slider
                  style={{ width: 100 }}
                  defaultValue={1}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={handleObjectOpacitySlider}
                />
              </>
            ) : null}
            <h5 className="drawer-header">Spot opacity</h5>
            <Slider
              style={{ width: 100 }}
              defaultValue={1}
              min={0}
              max={1}
              step={0.01}
              onChange={handleOpacitySlider}
            />
          </div>
        </Drawer>
        <main className={classes.main}>
          <OSG
            isLasso={isLasso}
            isDraw={isDraw}
            opacityValue={opacity}
            objectOpacityValue={objectOpacity}
            objectColor={color}
          />
        </main>
      </div>
      <div className={classes.footer}>
        <Typography variant="h6">Footer</Typography>
      </div>
    </div>
  );
}

export default App;
