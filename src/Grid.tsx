import { useEffect, useRef, useState } from 'react';
import './Quadrillage.css';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { DEFAULT_WIDTH_TILES_COUNT, DEFAULT_HEIGHT_TILES_COUNT, DEFAULT_TILE_SIZE } from './shared/utils/gridUtils';
import { drawSquares, initDrawing, manuallyUpdateSquare } from './shared/utils/drawingUtils';
import { evolve, initPattern } from './shared/utils/matrixUtils';
import { ChangeRulesModal } from './ChangeRulesModal';
import { ChangeGridParamsForm } from './ChangeGridParamsForm';
import * as math from 'mathjs';
import { Matrix } from 'mathjs';
import type { GridParams } from './shared/models/GridParams.ts';
import { BounceButton } from './components/button/bounce-button/BounceButton.tsx';

const Grid = () => {
    const [gameIsRunning, setGameIsRunning] = useState(false);

    const [addSquaresActivated, setAddSquaresActivated] = useState(false);

    const [gridParams, setGridParams] = useState<GridParams>({
        widthTilesCount: DEFAULT_WIDTH_TILES_COUNT,
        heightTilesCount: DEFAULT_HEIGHT_TILES_COUNT,
        tileSize: DEFAULT_TILE_SIZE,
    });

    const [rules, setRules] = useState({
        neighborsRangeStayAlive: [2, 3],
        neighborsRangeBorn: [3],
    });

    const [showChangeRulesModal, setShowChangeRulesModal] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const brushRef = useRef<CanvasRenderingContext2D>(null);
    const canvasMatrix = useRef<Matrix>(null);

    useEffect(() => {
        canvasMatrix.current = math.zeros(gridParams.widthTilesCount, gridParams.heightTilesCount) as Matrix;
        initPattern(canvasMatrix.current);

        brushRef.current = canvasRef.current.getContext('2d');

        initDrawing(brushRef.current, gridParams.tileSize);
        drawSquares(brushRef.current, gridParams, canvasMatrix.current);
    }, [gridParams]);

    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current;

        const canvasClickListener = (event: MouseEvent) => {
            event.stopPropagation();
            if (addSquaresActivated) {
                const input = event;
                const canvasPosition = canvas.getBoundingClientRect();

                const inputX = input.pageX - (canvasPosition.left + window.scrollX);
                const inputY = input.pageY - (canvasPosition.top + window.scrollY);

                const [row, column] = [Math.floor(inputX / gridParams.tileSize), Math.floor(inputY / gridParams.tileSize)];

                canvasMatrix.current = manuallyUpdateSquare(brushRef.current, gridParams, canvasMatrix.current, row, column);
            }
        };

        /* Adding a listener to the grid for clicking to tiles */
        canvas.addEventListener('click', canvasClickListener);

        return () => canvas.removeEventListener('click', canvasClickListener);
    }, [gridParams, addSquaresActivated]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (gameIsRunning) {
                canvasMatrix.current = evolve(canvasMatrix.current, rules.neighborsRangeStayAlive, rules.neighborsRangeBorn);
                drawSquares(brushRef.current, gridParams, canvasMatrix.current);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [gridParams, gameIsRunning, rules]);

    const handleClickOneStep = () => {
        if (!gameIsRunning) {
            canvasMatrix.current = evolve(canvasMatrix.current, rules.neighborsRangeStayAlive, rules.neighborsRangeBorn);
            drawSquares(brushRef.current, gridParams, canvasMatrix.current);
        }
    };
    const handleClickRestart = () => {
        if (gameIsRunning) {
            alert('Le jeu doit être en pause !');
        } else {
            canvasMatrix.current = math.zeros(gridParams.widthTilesCount, gridParams.heightTilesCount) as Matrix;
            initPattern(canvasMatrix.current);
            drawSquares(brushRef.current, gridParams, canvasMatrix.current);
        }
    };

    const getCanvasWidth = (widthTilesCount: number, tileSize: number) => widthTilesCount * tileSize;
    const getCanvasHeight = (heightTilesCount: number, tileSize: number) => heightTilesCount * tileSize;

    return (
        <div className={'h-max relative flex flex-col items-center'}>
            {/* Form to update grid params */}
            <ChangeGridParamsForm
                setGridParams={setGridParams}
                setShowChangeRulesModal={setShowChangeRulesModal}
                setGameIsRunning={setGameIsRunning}
            />

            {/* Actions on grid */}
            <div className={'flex flex-col w-max space-y-4'}>
                <h3 className={'text-2xl text-center'}>Actions sur la grille</h3>
                <div className={'flex justify-center items-center space-x-8'}>
                    <BounceButton icon={!gameIsRunning ? faPlay : faPause} onClick={() => setGameIsRunning(!gameIsRunning)}/>
                    <BounceButton label={'One step'} onClick={handleClickOneStep}/>
                    <BounceButton label={'Restart'} onClick={handleClickRestart}/>
                    <BounceButton label={`Add Squares ${addSquaresActivated ? '(on)' : '(off)'}`} onClick={() => {
                        setAddSquaresActivated(!addSquaresActivated);}}/>
                </div>
            </div>

            {/* Grid */}
            <canvas
                style={{
                    width: `${getCanvasWidth(gridParams.widthTilesCount, gridParams.tileSize)}px`,
                    height: `${getCanvasHeight(gridParams.heightTilesCount, gridParams.tileSize)}px`,
                }}
                className={'inline mt-8 border-[1px] border-black'}
                ref={canvasRef}
                width={`${getCanvasWidth(gridParams.widthTilesCount, gridParams.tileSize)}px`}
                height={`${getCanvasHeight(gridParams.heightTilesCount, gridParams.tileSize)}px`}
            />

            {/* Changing rules modal*/}
            <ChangeRulesModal setRules={setRules} setShowModal={setShowChangeRulesModal} showModal={showChangeRulesModal} />
        </div>
    );
};

export default Grid;
