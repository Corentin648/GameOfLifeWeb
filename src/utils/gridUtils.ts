/* Grid default values */
export const DEFAULT_WIDTH_TILES_COUNT = 30; // default tiles count in width
export const DEFAULT_HEIGHT_TILES_COUNT = 30; // default tiles count in height
export const DEFAULT_TILE_SIZE = 30; // default tile size

/* Count tile neighbors in a matrix */
const countNeighbors = (widthTilesCount, heightTilesCount, rowIndex, columnIndex, matrix) => {
    let neighborsCount = 0;

    if (rowIndex !== 0) {
        if (columnIndex !== 0) {
            if (matrix[rowIndex - 1][columnIndex - 1] === 1) {
                neighborsCount++;
            }
        }
        if (matrix[rowIndex - 1][columnIndex] === 1) {
            neighborsCount++;
        }
        if (columnIndex !== heightTilesCount - 1) {
            if (matrix[rowIndex - 1][columnIndex + 1] === 1) {
                neighborsCount++;
            }
        }
    }
    if (rowIndex !== widthTilesCount - 1) {
        if (columnIndex !== heightTilesCount - 1) {
            if (matrix[rowIndex + 1][columnIndex + 1] === 1) {
                neighborsCount++;
            }
        }
        if (matrix[rowIndex + 1][columnIndex] === 1) {
            neighborsCount++;
        }
        if (columnIndex !==  0) {
            if (matrix[rowIndex + 1][columnIndex - 1] === 1) {
                neighborsCount++;
            }
        }
    }
    if (columnIndex !== heightTilesCount - 1 && matrix[rowIndex][columnIndex + 1] === 1) {
        neighborsCount++;
    }
    if (columnIndex !== 0 && matrix[rowIndex][columnIndex-1] === 1){
        neighborsCount++;
    }
    return neighborsCount;
}

/* Make matrix evolve according to a rule */
export const evolve = (widthTilesCount, heightTilesCount, matrix, neighborsRangeStayAlive, neighborsRangeBorn) => {
    let neighborsCount;
    let stayAlive;
    let born;
    let  mat = Array(widthTilesCount).fill(0).map(() => new Array(heightTilesCount).fill(0));

    for (let i = 0; i < widthTilesCount; i++) {
        for (let j = 0; j < heightTilesCount; j++) {
            neighborsCount = countNeighbors(widthTilesCount, heightTilesCount, i,j, matrix);
            stayAlive = false;
            born = false;
            if (matrix[i][j] === 1) {
                for (let k in neighborsRangeStayAlive){
                    if (neighborsCount === neighborsRangeStayAlive[k]) {stayAlive = true}
                }
                if (stayAlive) {mat[i][j] = 1}
            }
            else if (matrix[i][j] === 0) {
                for (let k in neighborsRangeBorn){
                    if (neighborsCount === neighborsRangeBorn[k]) {born = true}
                }
                if (born) {mat[i][j] = 1}
            }
        }
    }
    return mat;
}