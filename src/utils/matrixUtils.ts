/* Initialize matrix with a given pattern */
import {Matrix} from "mathjs";

export const initPattern = (matrix : Matrix) => {
    matrix.set([10,10], 1);
    matrix.set([11,10], 1);
    matrix.set([12,10], 1);
    matrix.set([12,9], 1);
    matrix.set([11,8], 1);
}