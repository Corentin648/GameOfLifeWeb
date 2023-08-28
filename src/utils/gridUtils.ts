/* Grid default values */
import * as math from "mathjs";
import {Matrix} from "mathjs";

export const DEFAULT_WIDTH_TILES_COUNT = 30; // default tiles count in width
export const DEFAULT_HEIGHT_TILES_COUNT = 30; // default tiles count in height
export const DEFAULT_TILE_SIZE = 20; // default tile size

/* Count tile neighbors in a matrix */
const countNeighbors = (widthTilesCount : number, heightTilesCount : number, rowIndex : number, columnIndex : number, matrix : Matrix) => {

    let neighborsCount = 0;

    if (rowIndex !== 0 && columnIndex !== 0 && matrix.get([rowIndex - 1, columnIndex - 1]) === 1) neighborsCount++;
    if (columnIndex !== 0 && matrix.get([rowIndex, columnIndex - 1]) === 1) neighborsCount++;
    if (rowIndex !== widthTilesCount - 1 && columnIndex !== 0 && matrix.get([rowIndex + 1, columnIndex - 1]) === 1) neighborsCount++;
    if (rowIndex !== widthTilesCount - 1 && matrix.get([rowIndex + 1, columnIndex]) === 1) neighborsCount++;
    if (rowIndex !== widthTilesCount - 1 && columnIndex !== heightTilesCount - 1 && matrix.get([rowIndex + 1, columnIndex + 1]) === 1) neighborsCount++;
    if (columnIndex !== heightTilesCount - 1 && matrix.get([rowIndex, columnIndex + 1]) === 1) neighborsCount++;
    if (rowIndex !== 0 && columnIndex !== heightTilesCount - 1 && matrix.get([rowIndex - 1, columnIndex + 1]) === 1) neighborsCount++;
    if (rowIndex !== 0 && matrix.get([rowIndex - 1, columnIndex]) === 1) neighborsCount++;

    return neighborsCount;
}

/* Make matrix evolve according to a rule */
export const evolve = (widthTilesCount : number, heightTilesCount : number, matrix : Matrix, neighborsRangeStayAlive : number[], neighborsRangeBorn : number[]) => {
    let neighborsCount : number;
    let stayAlive : boolean;
    let born : boolean;
    let  matrixUpdated = math.zeros(widthTilesCount, heightTilesCount) as Matrix;

    for (let i = 0; i < widthTilesCount; i++) {
        for (let j = 0; j < heightTilesCount; j++) {
            neighborsCount = countNeighbors(widthTilesCount, heightTilesCount, i,j, matrix);
            stayAlive = false;
            born = false;
            if (matrix.get([i, j]) === 1) {
                if (neighborsRangeStayAlive.includes(neighborsCount)) stayAlive = true;
                if (stayAlive) {matrixUpdated.set([i, j], 1)}
            }
            else if (matrix.get([i, j]) === 0) {
                if (neighborsRangeBorn.includes(neighborsCount)) born = true;
                if (born) {matrixUpdated.set([i, j], 1)}
            }
        }
    }
    return matrixUpdated;
}