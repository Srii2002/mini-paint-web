const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color-picker");
const sizeSlider = document.getElementById("size-slider");
const fillColorCheckbox = document.getElementById("fill-color");
const clearButton = document.querySelector(".clear-canvas");
const saveButton = document.querySelector(".save-img");

let currentColor = colorPicker.value;
let currentTool = "brush";
let drawing = false;
let brushSize = 5;
let startX, startY;

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

const updateCanvasSize = () => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
};

window.addEventListener("resize", updateCanvasSize);

const startDrawing = (e) => {
    drawing = true;
    [startX, startY] = [e.offsetX, e.offsetY];
};

const stopDrawing = () => {
    drawing = false;
    ctx.beginPath(); // End the current path
};

const draw = (e) => {
    if (!drawing) return;

    switch (currentTool) {
        case "brush":
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = brushSize;
            ctx.lineCap = "round";
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            break;
        case "eraser":
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = brushSize;
            ctx.lineCap = "round";
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
            break;
        case "rectangle":
        case "circle":
        case "triangle":
            // Do nothing here to avoid drawing shapes in the drawing phase
            break;
    }
};

const drawShape = (x, y) => {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.fillStyle = currentColor;
    
    switch (currentTool) {
        case "rectangle":
            const rectWidth = x - startX;
            const rectHeight = y - startY;
            ctx.strokeRect(startX, startY, rectWidth, rectHeight);
            if (fillColorCheckbox.checked) {
                ctx.fillRect(startX, startY, rectWidth, rectHeight);
            }
            break;
        case "circle":
            const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
            if (fillColorCheckbox.checked) {
                ctx.fill();
            }
            break;
        case "triangle":
            const width = x - startX;
            const height = y - startY;
            const midX = startX + width / 2;
            ctx.beginPath();
            ctx.moveTo(midX, startY);
            ctx.lineTo(startX, y);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
            if (fillColorCheckbox.checked) {
                ctx.fill();
            }
            break;
    }
};

const changeColor = (color) => {
    currentColor = color;
    colorPicker.value = color;
};

const changeTool = (tool) => {
    currentTool = tool;
};

document.querySelectorAll(".tools-board .option[data-tool]").forEach((option) => {
    option.addEventListener("click", () => {
        document.querySelector(".tools-board .option.active")?.classList.remove("active");
        option.classList.add("active");
        changeTool(option.getAttribute("data-tool"));
    });
});

document.querySelectorAll(".colors .option").forEach((colorOption) => {
    colorOption.addEventListener("click", () => {
        const color = colorOption.getAttribute("data-color");
        changeColor(color);
        document.querySelector(".colors .option.selected")?.classList.remove("selected");
        colorOption.classList.add("selected");
    });
});

colorPicker.addEventListener("input", (e) => {
    changeColor(e.target.value);
});

sizeSlider.addEventListener("input", (e) => {
    brushSize = e.target.value;
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("mouseup", (e) => {
    if (currentTool !== "brush" && currentTool !== "eraser") {
        drawShape(e.offsetX, e.offsetY);
    }
});

clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveButton.addEventListener("click", () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'drawing.png';
    link.click();
});
