/* Drawing grid */
import {Matrix} from "mathjs";
import type {GridParams} from "../models/GridParams.ts";

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
export const drawSquares = (brush : CanvasRenderingContext2D, gridParams : GridParams, matrix : Matrix) => {
    for (let i = 0; i < gridParams.widthTilesCount; i++){
        for (let j = 0 ; j < gridParams.heightTilesCount ; j++){
            drawOneSquare(brush, gridParams, matrix, i, j);
        }
    }
}

/* Drawing one square */
const drawOneSquare = (brush : CanvasRenderingContext2D, gridParams : GridParams, matrix : Matrix, row : number, column : number) => {
    const canvasHeight = brush.canvas.height;
    const canvasWidth = brush.canvas.width;

    brush.clearRect(row * gridParams.tileSize, column * gridParams.tileSize, canvasWidth / gridParams.widthTilesCount - 1, canvasHeight / gridParams.heightTilesCount - 1);
    if (matrix.get([row, column]) === 1){
        brush.fillStyle = '#000000';
        brush.fillRect(row * gridParams.tileSize, column * gridParams.tileSize, canvasWidth / gridParams.widthTilesCount - 1, canvasHeight / gridParams.heightTilesCount - 1);
    } else if (matrix.get([row, column]) === 0) {
        brush.fillStyle = '#FFFFFF';
        brush.fillRect(row * gridParams.tileSize, column * gridParams.tileSize, canvasWidth / gridParams.widthTilesCount - 1, canvasHeight / gridParams.heightTilesCount - 1);
    }
}

/* Manually update square and associated matrix */
export const manuallyUpdateSquare = (brush : CanvasRenderingContext2D, gridParams : GridParams, matrix : Matrix, row : number, column : number) => {
    const canvasHeight = brush.canvas.height;
    const canvasWidth = brush.canvas.width;

    let matrixUpdated = matrix;

    brush.clearRect(row * gridParams.tileSize, column * gridParams.tileSize, canvasWidth / gridParams.widthTilesCount - 1, canvasHeight / gridParams.heightTilesCount - 1);
    if (matrix.get([row, column]) === 0){
        brush.fillStyle = '#000000';
        brush.fillRect(row * gridParams.tileSize, column * gridParams.tileSize, canvasWidth / gridParams.widthTilesCount - 1, canvasHeight / gridParams.heightTilesCount - 1);
        matrix.set([row, column], 1);
    } else if (matrix.get([row, column]) === 1) {
        brush.fillStyle = '#FFFFFF';
        brush.fillRect(row * gridParams.tileSize, column * gridParams.tileSize, canvasWidth / gridParams.widthTilesCount - 1, canvasHeight / gridParams.heightTilesCount - 1);
        matrix.set([row, column], 0);
    }

    return matrixUpdated;
}