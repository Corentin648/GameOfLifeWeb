/* Initialize matrix with a given pattern */
import {Matrix} from "mathjs";
import * as math from "mathjs";


export const initPattern = (matrix : Matrix) => {
    matrix.set([10,10], 1);
    matrix.set([11,10], 1);
    matrix.set([12,10], 1);
    matrix.set([12,9], 1);
    matrix.set([11,8], 1);
}

/* Count element neighbors in a matrix */
const countNeighbors = (rowIndex : number, columnIndex : number, matrix : Matrix) => {

    let neighborsCount = 0;

    if (rowIndex !== 0 && columnIndex !== 0 && matrix.get([rowIndex - 1, columnIndex - 1]) === 1) neighborsCount++;
    if (columnIndex !== 0 && matrix.get([rowIndex, columnIndex - 1]) === 1) neighborsCount++;
    if (rowIndex !== matrix.size()[0] - 1 && columnIndex !== 0 && matrix.get([rowIndex + 1, columnIndex - 1]) === 1) neighborsCount++;
    if (rowIndex !== matrix.size()[0] - 1 && matrix.get([rowIndex + 1, columnIndex]) === 1) neighborsCount++;
    if (rowIndex !== matrix.size()[0] - 1 && columnIndex !== matrix.size()[1] - 1 && matrix.get([rowIndex + 1, columnIndex + 1]) === 1) neighborsCount++;
    if (columnIndex !== matrix.size()[1] - 1 && matrix.get([rowIndex, columnIndex + 1]) === 1) neighborsCount++;
    if (rowIndex !== 0 && columnIndex !== matrix.size()[1] - 1 && matrix.get([rowIndex - 1, columnIndex + 1]) === 1) neighborsCount++;
    if (rowIndex !== 0 && matrix.get([rowIndex - 1, columnIndex]) === 1) neighborsCount++;

    return neighborsCount;
}

/* Make matrix evolve according to a rule */
export const evolve = (matrix : Matrix, neighborsRangeStayAlive : number[], neighborsRangeBorn : number[]) => {
    let neighborsCount : number;
    let stayAlive : boolean;
    let born : boolean;

    const matrixWidth = matrix.size()[0];
    const matrixHeight = matrix.size()[1];

    let  matrixUpdated = math.zeros(matrixWidth, matrixHeight) as Matrix;

    for (let i = 0; i < matrixWidth; i++) {
        for (let j = 0; j < matrixHeight; j++) {
            neighborsCount = countNeighbors(i,j, matrix);
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