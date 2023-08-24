import React, {useEffect, useRef, useState} from 'react';
import "./Quadrillage.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faPause} from "@fortawesome/free-solid-svg-icons";
import {evolve, DEFAULT_WIDTH_TILES_COUNT, DEFAULT_HEIGHT_TILES_COUNT, DEFAULT_TILE_SIZE} from "./utils/gridUtils";
import {drawSquares, initDrawing, manuallyUpdateSquare} from "./utils/drawingUtils";
import {initPattern} from "./utils/matrixUtils";
import {ChangeRulesModal} from "./ChangeRulesModal";
import {ChangeGridParamsForm} from "./ChangeGridParamsForm";


const Grid = () => {

    const [gameIsRunning, setGameIsRunning] = useState(false);

    const [addSquaresActivated, setAddSquaresActivated] = useState(false);

    const [gridParams, setGridParams] = useState({
        widthTilesCount : DEFAULT_WIDTH_TILES_COUNT,
        heightTilesCount : DEFAULT_HEIGHT_TILES_COUNT,
        tileSize : DEFAULT_TILE_SIZE,
    });

    const [rules, setRules] = useState({
        neighborsRangeStayAlive: [2, 3],
        neighborsRangeBorn: [3]
    });

    const [showChangeRulesModal, setShowChangeRulesModal] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const brushRef = useRef<CanvasRenderingContext2D>(null);
    const canvasMatrix = useRef([[]]);


    useEffect(() => {
        canvasMatrix.current = Array(gridParams.widthTilesCount).fill(0).map(() => new Array(gridParams.heightTilesCount).fill(0));
        initPattern(canvasMatrix.current);

        brushRef.current = canvasRef.current.getContext("2d");

        initDrawing(brushRef.current, gridParams.tileSize);
        drawSquares(brushRef.current, gridParams.widthTilesCount, gridParams.heightTilesCount, gridParams.tileSize, canvasMatrix.current);
    }, [gridParams]);


    useEffect(() => {
        const canvas : HTMLCanvasElement = canvasRef.current;

        const canvasClickListener = (event) => {
            event.stopPropagation();
            if (addSquaresActivated) {
                let input = event;
                let canvasPosition = canvas.getBoundingClientRect();

                let inputX = input.pageX - (canvasPosition.left + window.scrollX);
                let inputY = input.pageY - (canvasPosition.top + window.scrollY);

                let [row, column] = [Math.floor(inputX / gridParams.tileSize), Math.floor(inputY / gridParams.tileSize)];

                canvasMatrix.current = manuallyUpdateSquare(brushRef.current, gridParams.widthTilesCount, gridParams.heightTilesCount, gridParams.tileSize, canvasMatrix.current, row, column);
            }
        }

        /* Adding a listener to the grid for clicking to tiles */
        canvas.addEventListener('click', canvasClickListener);

        return () => canvas.removeEventListener('click', canvasClickListener);
    }, [gridParams, addSquaresActivated]);


    useEffect(() => {
        let interval = setInterval(() => {
            if (gameIsRunning) {
                canvasMatrix.current = evolve(gridParams.widthTilesCount, gridParams.heightTilesCount, canvasMatrix.current, rules.neighborsRangeStayAlive, rules.neighborsRangeBorn);
                drawSquares(brushRef.current, gridParams.widthTilesCount, gridParams.heightTilesCount, gridParams.tileSize, canvasMatrix.current);
            }
        }, 100);

        return () => clearInterval(interval);

    }, [gridParams, gameIsRunning, rules]);


    const handleClickOneStep = () => {
        if (!gameIsRunning){
            canvasMatrix.current = evolve(gridParams.widthTilesCount, gridParams.heightTilesCount, canvasMatrix.current, rules.neighborsRangeStayAlive, rules.neighborsRangeBorn);
            drawSquares(brushRef.current, gridParams.widthTilesCount, gridParams.heightTilesCount, gridParams.tileSize, canvasMatrix.current);
        }
    }
    const handleClickRestart = () => {
        if (gameIsRunning){
            alert("Le jeu doit être en pause !");
        } else {
            canvasMatrix.current = Array(gridParams.widthTilesCount).fill(0).map(() => new Array(gridParams.heightTilesCount).fill(0));
            initPattern(canvasMatrix.current);
            drawSquares(brushRef.current, gridParams.widthTilesCount, gridParams.heightTilesCount, gridParams.tileSize, canvasMatrix.current);
        }
    }

    return(
        <div>
            {/* Form to update grid params */}
            <ChangeGridParamsForm setGridParams={setGridParams} setShowChangeRulesModal={setShowChangeRulesModal} setGameIsRunning={setGameIsRunning}/>

            {/* Actions on grid */}
            <h3>Actions sur la grille</h3>
            <div style={{display: "flex", justifyContent: "center"}}>
                <button
                    onClick={
                        () => setGameIsRunning(!gameIsRunning)}>
                    <FontAwesomeIcon id={"iconPlayButton"} icon={!gameIsRunning ? faPlay : faPause} width={"32px"} height={"32px"}/>
                </button>
                <button style={{marginLeft: "30px"}} onClick={handleClickOneStep}>One Step</button>
                <button style={{marginLeft: "30px"}} onClick={handleClickRestart}>Restart</button>
                <button style={{marginLeft: "30px"}} onClick={() => {setAddSquaresActivated(!addSquaresActivated)}}>{`Add Squares ${addSquaresActivated ? '(on)' : '(off)'}`}</button>
            </div>

            {/* Grid */}
            <canvas style={{display:" inline", marginTop: '30px', border: "1px solid black"}} ref={canvasRef} width={gridParams.widthTilesCount * gridParams.tileSize} height={gridParams.heightTilesCount * gridParams.tileSize} />

            {/* Changing rules modal*/}
            <ChangeRulesModal setRules={setRules} setShowModal={setShowChangeRulesModal} showModal={showChangeRulesModal}/>
        </div>
    )
}

export default Grid;