// const screen = document.querySelector(".screen");

// Variable defining if the mouse is pressed or not
let mouseDown;

let drawingPixels;

const pixelColourInp = document.querySelector("#pixelColour");
const bgColourInp = document.querySelector("#bgColour");

const setPixelColourBtn = document.querySelector("#setPixelColour");
const setBgColourBtn = document.querySelector("#setBgColour");

const drawingContainer = document.querySelector("drawing-container");

const columnInput = document.querySelector("#columns");
const rowInput = document.querySelector("#rows");

const lockAspectRatioBtn = document.querySelector("#lockRatio");

const setSizeBtn = document.querySelector("#setGridSize");
const clearGridBtn = document.querySelector("#clearGrid");

class DrawingPixel extends HTMLElement {
  constructor() {
  
    super();
    
    this.onmousedown = function () {
      this.paint();
    }
    
    this.onmouseenter = function () {
      if (mouseDown == true) {
        this.paint();
      }
    }
    
  }
  paint() {
    this.classList.add("entered");
  }
  clear() {
    this.classList.remove("entered");
  }
}

customElements.define("drawing-pixel", DrawingPixel);

class DrawingContainer extends HTMLElement {
  constructor() {
  
    super();
    this.rows = this.getAttribute("rows");
    this.columns = this.getAttribute("columns");
    
    this.onmousedown = function () {
      mouseDown = true;
    }
    
    this.onmouseup = function () {
      mouseDown = false;
    }
    
  }

  static get observedAttributes() {
    return ["rows", "columns"];
  }

  attributeChangedCallback(attr, oldValue, newValue) {
  
    if (attr == "rows" && oldValue != newValue) {
      this.rows = newValue;
      this.updateInterface();
    }
    
    if (attr == "columns" && oldValue != newValue) {
      this.columns = newValue;
      this.updateInterface();
    }
    
  }

  updateInterface() {
  
    document.documentElement.style.setProperty("--columns", this.columns);
    document.documentElement.style.setProperty("--rows", this.rows);

    this.innerHTML = "";

    for (let i = 0; i < this.rows * this.columns; i++) {
      let drawingPixel = document.createElement("drawing-pixel");
      this.append(drawingPixel);
    }
    
    drawingPixels = drawingContainer.querySelectorAll("drawing-pixel");
    
  }
}

customElements.define("drawing-container", DrawingContainer);

let columns = columnInput.value;
let rows = rowInput.value;

function setSameValues(direction) {
  if (direction == "column") {
    rowInput.value = columnInput.value;
  } else {
    columnInput.value = rowInput.value;
  }
}

// Before click, check status of ratio checkbox
if (lockAspectRatioBtn.checked) {
  columnInput.onchange = function () {
    setSameValues("column");
  };
  rowInput.onchange = function () {
    setSameValues("row");
  };
}

// Whenever ratio button is clicked
lockAspectRatioBtn.addEventListener("click", () => {
  // If it is checked, make the values scale together
  if (lockAspectRatioBtn.checked) {
    // Set them to the same value when checked firstly
    setSameValues("column");
    columnInput.onchange = function () {
      setSameValues("column");
    };
    rowInput.onchange = function () {
      setSameValues("row");
    };
    // Otherwise remove the event listeners and make them scale individually
  } else {
    columnInput.onchange = undefined;
    rowInput.onchange = undefined;
  }
});

// Initial grid setup with the values from the inputs
drawingContainer.setAttribute("columns", columns);
drawingContainer.setAttribute("rows", rows);

setSizeBtn.addEventListener("click", () => {
  columns = columnInput.value;
  rows = rowInput.value;
  drawingContainer.setAttribute("columns", columns);
  drawingContainer.setAttribute("rows", rows);
});


clearGridBtn.addEventListener("click", () => {
  drawingPixels.forEach(pixel => {
    pixel.clear();
  });
});

setPixelColourBtn.addEventListener("click", () => {
  document.documentElement.style.setProperty("--pixelColour", pixelColourInp.value);
})

setBgColourBtn.addEventListener("click", () => {
  document.documentElement.style.setProperty("--bgColour", bgColourInp.value);
})

