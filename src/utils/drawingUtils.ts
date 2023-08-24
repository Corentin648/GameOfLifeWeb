/* Drawing grid */
export const initDrawing = (brush : CanvasRenderingContext2D, tileSize : number) => {
    const canvasHeight = brush.canvas.height;
    const canvasWidth = brush.canvas.width;

    brush.clearRect(0, 0, canvasWidth, canvasHeight);
    brush.fillStyle = '#000000';

    /* Drawing grid */
    for (let h = tileSize; h < canvasHeight; h += tileSize) {
        brush.moveTo(0, h);
        brush.lineTo(canvasWidth, h);
        brush.stroke();
    }
    for (let l = tileSize; l < canvasWidth; l += tileSize) {
        brush.moveTo(l, 0);
        brush.lineTo(l, canvasHeight);
        brush.stroke();
    }
    brush.lineTo(canvasWidth - tileSize, canvasHeight);
    brush.lineTo(canvasWidth - tileSize, 0);
    brush.lineTo(canvasWidth - tileSize, canvasHeight);
    brush.stroke();
}

/* Drawing grid squares according to a given matrix */
export const drawSquares = (brush, widthTilesCount, heightTilesCount, tileSize, matrix) => {
    for (let i = 0; i < widthTilesCount; i++){
        for (let j = 0 ; j < heightTilesCount ; j++){
            drawOneSquare(brush, widthTilesCount, heightTilesCount, tileSize, matrix, i, j);
        }
    }
}

/* Drawing one square */
const drawOneSquare = (brush, widthTilesCount, heightTilesCount, tileSize, matrix, row, column) => {
    const canvasHeight = brush.canvas.height;
    const canvasWidth = brush.canvas.width;

    brush.clearRect(row * tileSize + 1, column * tileSize + 1, canvasWidth / widthTilesCount - 2, canvasHeight / heightTilesCount - 2);
    if (matrix[row][column] === 1){
        brush.fillStyle = '#000000';
        brush.fillRect(row * tileSize + 1, column * tileSize + 1, canvasWidth / widthTilesCount - 2, canvasHeight / heightTilesCount - 2);
    } else if (matrix[row][column] === 0) {
        brush.fillStyle = '#FFFFFF';
        brush.fillRect(row * tileSize + 1, column * tileSize + 1, canvasWidth / widthTilesCount - 2, canvasHeight / heightTilesCount - 2);
    }
}

/* Manually update square and associated matrix */
export const manuallyUpdateSquare = (brush, widthTilesCount, heightTilesCount, tileSize, matrix, row, column) => {
    const canvasHeight = brush.canvas.height;
    const canvasWidth = brush.canvas.width;

    let matrixUpdated = matrix;

    brush.clearRect(row * tileSize + 1, column * tileSize + 1, canvasWidth / widthTilesCount - 2, canvasHeight / heightTilesCount - 2);
    if (matrix[row][column] === 0){
        brush.fillStyle = '#000000';
        brush.fillRect(row * tileSize + 1, column * tileSize + 1, canvasWidth / widthTilesCount - 2, canvasHeight / heightTilesCount - 2);
        matrixUpdated[row][column] = 1;
    } else if (matrix[row][column] === 1) {
        brush.fillStyle = '#FFFFFF';
        brush.fillRect(row * tileSize + 1, column * tileSize + 1, canvasWidth / widthTilesCount - 2, canvasHeight / heightTilesCount - 2);
        matrixUpdated[row][column] = 0;
    }

    return matrixUpdated;
}