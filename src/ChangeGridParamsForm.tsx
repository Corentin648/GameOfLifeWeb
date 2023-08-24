import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import React, {useState} from "react";

export const ChangeGridParamsForm = ({setShowChangeRulesModal, setGridParams, setGameIsRunning}) => {

    const [updateGridParams, setUpdateGridParams] = useState({
        widthTilesCount : 30,    // tiles count in width
        heightTilesCount : 30,   // tiles count in height
        tileSize : 20,   // tile size
    });

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

    const handleRestoreDefaultParams = () => {
        //localStorage.clear();
        window.location.reload();
    }

    return(
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
                <Button onClick={handleRestoreDefaultParams} style={{marginTop: "20px"}} type="submit" variant="primary">Restaurer valeurs par défaut</Button>
            </div>
        </div>
    )
}