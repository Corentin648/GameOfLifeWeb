import React, {useEffect, useRef, useState} from 'react';
import {Button} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import "./Quadrillage.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faPause} from "@fortawesome/free-solid-svg-icons";
import {evolve} from "./utils/gridUtils";
import {drawSquares, initDrawing, manuallyUpdateSquare} from "./utils/drawingUtils";
import {initPattern} from "./utils/matrixUtils";
import {ChangeRulesModal} from "./ChangeRulesModal";


const Grid = () => {

    const [gameIsRunning, setGameIsRunning] = useState(false);

    const [addSquaresActivated, setAddSquaresActivated] = useState(false);

    const [gridParams, setGridParams] = useState({
        widthTilesCount : 30,    // tiles count in width
        heightTilesCount : 30,   // tiles count in height
        tileSize : 20,   // tile size
    });

    const [updateGridParams, setUpdateGridParams] = useState({
        widthTilesCount : 30,    // tiles count in width
        heightTilesCount : 30,   // tiles count in height
        tileSize : 20,   // tile size
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

    const handleClickShowModal = () => {
        setShowChangeRulesModal(true);
    }

    const handleSubmitGridParamsUpdate = (event) => {
        if (!isNaN(updateGridParams.widthTilesCount) && !isNaN(updateGridParams.heightTilesCount) && !isNaN(updateGridParams.tileSize)) {
            setGridParams({
                ...updateGridParams
            })
            setGameIsRunning(false);
        } else {
            alert('Il faut entrer des nombres entiers !');
        }
        //this.saveStateToLocalStorage();
        event.preventDefault();
    }

    const handleUpdateGridWidth = (event) => {
        setUpdateGridParams({
            ...updateGridParams,
            widthTilesCount: parseInt(event.target.value)
        })
    }

    const handleUpdateGridHeight = (event) => {
        setUpdateGridParams({
            ...updateGridParams,
            heightTilesCount: parseInt(event.target.value)
        })
    }

    const handleUpdateGridTileSize = (event) => {
        setUpdateGridParams({
            ...updateGridParams,
            tileSize: parseInt(event.target.value)
        })
    }

    const handlerRestaurerDefaut = () => {
        localStorage.clear();
        window.location.reload();
        return false;
    }

    return(
        <div>
            {/* Affichage du formulaire permettant de mettre à jour les paramètres du jeu */}
            <div style={{display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between"}}>
                <h1 style={{marginRight: "5%", fontSize: "5vw"}}>Jeu de la Vie</h1>
                <div style={{border: "1px solid black", marginLeft: "5%", display: "flex", flexDirection: "column", width: "400px", padding: "20px"}}>
                    <h3>Choix des différents paramètres</h3>
                    <button style={{width: "200px", marginBottom: "20px"}} onClick={handleClickShowModal}>Changer les règles</button>
                    <Form onSubmit={(event) => {handleSubmitGridParamsUpdate(event); return false}}>
                        <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center"}} controlId={"formChangerLargeur"}>
                            <Form.Label style={{paddingRight: "10px"}}>Nombre de cases en largeur :</Form.Label>
                            <input style={{width:"50px"}} type="text" value={updateGridParams.widthTilesCount} onChange={handleUpdateGridWidth} />
                        </Form.Group>
                        <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center", paddingTop: "20px"}} controlId={"formChangerHauteur"}>
                            <Form.Label style={{paddingRight: "10px"}}>Nombre de cases en hauteur :</Form.Label>
                            <input style={{width:"50px"}} type="text" value={updateGridParams.heightTilesCount} onChange={handleUpdateGridHeight} />
                        </Form.Group>
                        <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center", paddingTop: "20px"}} controlId={"formChangerTailleCase"}>
                            <Form.Label style={{paddingRight: "10px"}}>Taille d'une case :</Form.Label>
                            <input style={{width:"50px"}} type="text" value={updateGridParams.tileSize} onChange={handleUpdateGridTileSize} />
                        </Form.Group>
                        <Button style={{marginTop: "20px"}} type="submit" variant="primary">Mettre à jour</Button>
                    </Form>
                    <Button onClick={() => handlerRestaurerDefaut()} style={{marginTop: "20px"}} type="submit" variant="primary">Restaurer valeurs par défaut</Button>
                </div>
            </div>

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