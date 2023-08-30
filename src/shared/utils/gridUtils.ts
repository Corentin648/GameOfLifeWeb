/* Grid default values */
import { GridParams } from '../models/GridParams.ts';

export const DEFAULT_WIDTH_TILES_COUNT = 30; // default tiles count in width
export const DEFAULT_HEIGHT_TILES_COUNT = 30; // default tiles count in height
export const DEFAULT_TILE_SIZE = 20; // default tile size

export const DEFAULT_GRID_PARAMS =  {
    widthTilesCount: DEFAULT_WIDTH_TILES_COUNT,
    heightTilesCount: DEFAULT_HEIGHT_TILES_COUNT,
    tileSize: DEFAULT_TILE_SIZE
} as GridParams;
