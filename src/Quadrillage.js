import React, {Component, useState} from 'react';
import {Button, Image} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Modal from "react-bootstrap/Modal";
import "./Quadrillage.css";

/* Ordre d'appel des fonctions :
Appel du composant par le parent --> état initial par le constructor --> appel de render() --> le composant est mis en place --> appel de componentDidMount() --> mise à jour du composant --> appel de render()
 */

class Quadrillage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,   // afficher le modal pour changer les règles

            casesLargeur : 30,    // nombre de cases en largeur
            casesHauteur : 30,   // nombre de cases en hauteur
            tailleCase : 20,   // taille d'une case

            changerCasesLargeur : '',   // nouveau nombre de cases en largeur
            changerCasesHauteur : '',   // nouveau nombre de cases en hauteur
            changerTailleCases : '',    // nouvelle taille de case

            tailleChangee: false, // indique si la taille de la grille vient d'être changée

            start : false,   // la partie n'est pas lancée au départ
            addSquares: false   // indique si l'ajout de cases est activé
        }

        //localStorage.clear();
        const state = localStorage.getItem('state');
        if (state) {
            this.state = JSON.parse(state);
        }

        this.canvasRef = new React.createRef();

        /* La méthode fill remplie l'array avec des 0 */
        /* La méthode map applique à chaque élément la méthode en argument */

        this.matrice = Array(this.state.casesLargeur).fill(0).map(() => new Array(this.state.casesHauteur).fill(0));
        this.backupMatrice = Array(this.state.casesLargeur).fill(0).map(() => new Array(this.state.casesHauteur).fill(0));

        this.canvas ='';
        this.pinceau='';
    }

    saveStateToLocalStorage = () => {
        localStorage.setItem('state', JSON.stringify(this.state));
    }

    /* Fonction qui permet de compter les voisines d'une case de la matrice */
    compterVoisines = (i, j) => {
        let voisines = 0;
        if (i !== 0) {
            if (j !== 0) {
                if (this.matrice[i - 1][j - 1] === 1) {
                    voisines++;
                }
            }
            if (this.matrice[i - 1][j] === 1) {
                voisines++;
            }
            if (j !== this.state.casesHauteur - 1) {
                if (this.matrice[i - 1][j + 1] === 1) {
                    voisines++;
                }
            }
        }
        if (i !== this.state.casesLargeur - 1) {
            if (j !== this.state.casesHauteur - 1) {
                if (this.matrice[i + 1][j + 1] === 1) {
                    voisines++;
                }
            }
            if (this.matrice[i + 1][j] === 1) {
                voisines++;
            }
            if (j !==  0) {
                if (this.matrice[i + 1][j - 1] === 1) {
                    voisines++;
                }
            }
        }
        if (j !== this.state.casesHauteur - 1 && this.matrice[i][j + 1] === 1) {
            voisines++;
        }
        if (j !== 0 && this.matrice[i][j-1] === 1){
            voisines++;
        }
        return voisines;
    }

    /* Fonction qui fait évoluer la matrice en fonction de la règle choisie */
    evoluer = () => {
        this.backupMatrice = this.matrice;
        let voisines;
        let  mat = Array(this.state.casesLargeur).fill(0).map(() => new Array(this.state.casesHauteur).fill(0));
        for (let i = 0; i < this.state.casesLargeur; i++) {
            for (let j = 0; j < this.state.casesHauteur; j++) {
                voisines = this.compterVoisines(i,j);
                if (this.matrice[i][j] === 1) {
                    if (voisines === 3 || voisines === 2) {
                        mat[i][j] = 1;
                    }
                }
                else if (this.matrice[i][j] === 0) {
                    if (voisines === 3) {
                        mat[i][j] = 1;
                    }
                }
            }
        }
        this.matrice = mat;
    }

    /* Fonction qui initialise la matrice avec le pattern voulu */
    initPattern = () => {
        this.matrice[10][10] = 1;
        this.matrice[11][10] = 1;
        this.matrice[12][10] = 1;
        this.matrice[12][9] = 1;
        this.matrice[11][8] = 1;
    }

    /* Fonction qui trace le quadrillage */
    initDessin = (pinceau, canvas) => {
        pinceau.clearRect(0, 0, canvas.width, canvas.height);
        pinceau.fillStyle = '#000000';
        /* On dessine ici la grille */
        for (let h = this.state.tailleCase; h < canvas.height; h += this.state.tailleCase) {
            pinceau.moveTo(0, h);
            pinceau.lineTo(canvas.width, h);
            pinceau.stroke();
        }
        for (let l = this.state.tailleCase; l < canvas.width; l += this.state.tailleCase) {
            pinceau.moveTo(l, 0);
            pinceau.lineTo(l, canvas.height);
            pinceau.stroke();
        }
        pinceau.lineTo(canvas.width - this.state.tailleCase, canvas.height);
        pinceau.lineTo(canvas.width - this.state.tailleCase, 0);
        pinceau.lineTo(canvas.width - this.state.tailleCase, canvas.height);
        pinceau.stroke();
    }

    /* Fonction qui dessine en noir les cases "vivantes" et en blanc les cases "mortes" */
    dessinerRectangles = (pinceau) => {
        for (let i = 0;i<this.state.casesLargeur;i++){
            for (let j = 0;j<this.state.casesHauteur;j++){
                pinceau.clearRect(i*this.state.tailleCase + 1, j*this.state.tailleCase + 1, pinceau.canvas.width / this.state.casesLargeur - 2, pinceau.canvas.height / this.state.casesHauteur - 2);
                if (this.matrice[i][j] === 1){
                    pinceau.fillStyle = '#000000';
                    pinceau.fillRect(i*this.state.tailleCase + 1, j*this.state.tailleCase + 1, pinceau.canvas.width / this.state.casesLargeur - 2, pinceau.canvas.height / this.state.casesHauteur - 2);
                } else if (this.matrice[i][j] === 0) {
                    pinceau.fillStyle = '#FFFFFF';
                    pinceau.fillRect(i * this.state.tailleCase + 1, j * this.state.tailleCase + 1, pinceau.canvas.width / this.state.casesLargeur - 2, pinceau.canvas.height / this.state.casesHauteur - 2);
                }
            }
        }
    }


    /* Cette fonction est appelée une fois que tous les éléments du DOM ont été mis en place */
    componentDidMount() {

        /* On récupère la référence puis le contexte effectif du canvas */
        this.canvas = this.canvasRef.current;
        this.pinceau = this.canvas.getContext("2d");

        /* On initialise la matrice et on trace la grille */
        //this.initPattern();
        this.initDessin(this.pinceau, this.canvas);
        this.dessinerRectangles(this.pinceau);

        /* On ajoute le listener à la grille pour cliquer sur les cases */
        this.canvas.addEventListener('click', (event) => {
            event.stopPropagation();
            if (this.state.addSquares) {
                let input = event;
                let canvasPosition = this.canvas.getBoundingClientRect();
                let inputX = input.pageX - (canvasPosition.left + window.scrollX);
                let inputY = input.pageY - (canvasPosition.top + window.scrollY);
                let [i, j] = [Math.floor(inputX / this.state.tailleCase), Math.floor(inputY / this.state.tailleCase)];
                if (this.matrice[i][j] === 0) {
                    this.pinceau.fillStyle = '#000000';
                    this.pinceau.fillRect(i * this.state.tailleCase + 1, j * this.state.tailleCase + 1, this.pinceau.canvas.width / this.state.casesLargeur - 2, this.pinceau.canvas.height / this.state.casesHauteur - 2);
                    this.matrice[i][j] = 1;
                } else if (this.matrice[i][j] === 1) {
                    this.pinceau.fillStyle = '#FFFFFF';
                    this.pinceau.fillRect(i * this.state.tailleCase + 1, j * this.state.tailleCase + 1, this.pinceau.canvas.width / this.state.casesLargeur - 2, this.pinceau.canvas.height / this.state.casesHauteur - 2);
                    this.matrice[i][j] = 0;
                }
            }
        }, false);

        /* Variables pour la fonction render() */
        let animationFrameId;
        const FPS = 10;
        const delay = 1000/FPS;
        let previous = 0;

        /* Fonction qui va être appelée à chaque frame avec le pas de temps choisi */
        const render = () => {

            if (this.state.tailleChangee){
                this.initDessin(this.pinceau, this.canvas);
                this.matrice = Array(this.state.casesLargeur).fill(0).map(() => new Array(this.state.casesHauteur).fill(0));
                this.setState({
                    tailleChangee: false
                })
                this.saveStateToLocalStorage();
            }
            if (this.state.start) {
                animationFrameId = window.requestAnimationFrame(render);
                const now = Date.now();
                if (now - previous < delay) {
                    return;
                }
                previous = now;

                this.dessinerRectangles(this.pinceau);
                this.evoluer();
            } else {
                animationFrameId = window.requestAnimationFrame(render);
                const now = Date.now();
                if (now - previous < delay) {
                    return;
                }
                previous = now;
            }
        }

        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }

    handlerBoutonStart = () => {
        let image = document.getElementById("imagePlayButton");
        if (this.state.start){
            image.setAttribute("src", require('./images/play_button.svg'));
        } else {
            image.setAttribute("src", require('./images/pause_button.svg'));
        }
        this.setState({
            start: !this.state.start
        })
    }

    handlerBoutonOneStep = () => {
        if (!this.state.start){
            this.evoluer();
            this.dessinerRectangles(this.pinceau);
        }
    }

    // TODO : à terme il faudra pouvoir step back autant de fois que l'on veut
    handlerBoutonStepBack = () => {
        if (!this.state.start){
            this.matrice = this.backupMatrice;
            this.dessinerRectangles(this.pinceau);
        }
    }

    handlerBoutonRestart = () => {
        if (this.state.start){
            alert("Le jeu doit être en pause !");
        } else {
            this.matrice = Array(this.state.casesLargeur).fill(0).map(() => new Array(this.state.casesHauteur).fill(0));
            this.backupMatrice = Array(this.state.casesLargeur).fill(0).map(() => new Array(this.state.casesHauteur).fill(0));
            this.dessinerRectangles(this.pinceau);
        }
    }

    handlerBoutonAddSquares = () => {
        const bouton = document.getElementById("boutonAddSquares");
        if (this.state.addSquares){
            this.setState({
                addSquares: false
            })
            bouton.textContent = "Add Squares (off)";
        } else {
            this.setState({
                addSquares: true
            })
            bouton.textContent = "Add Squares (on)";
        }
    }

    handlerChangerRegles = () => {
        this.setState({
            showModal: true
        })
    }

    handlerFermerModal = () => {
        this.setState({
            showModal: false
        })
    }

    handlerChangerTailleEcran = (event) => {
        const nouvelleLargeur = parseInt(this.state.changerCasesLargeur);
        const nouvelleHauteur = parseInt(this.state.changerCasesHauteur);
        const nouvelleTailleCase = parseInt(this.state.changerTailleCase);
        if (!isNaN(nouvelleLargeur) && !isNaN(nouvelleHauteur) && !isNaN(nouvelleTailleCase)) {
            this.setState({
                casesLargeur: nouvelleLargeur,
                casesHauteur: nouvelleHauteur,
                tailleCase: nouvelleTailleCase
            })
            this.setState({
                tailleChangee: true
            })
        } else {
            alert('Il faut entrer des nombres entiers !');
            }
        //this.saveStateToLocalStorage();
        event.preventDefault();
    }

    handlerChampLargeur = (event) => {
        this.setState({
            changerCasesLargeur: event.target.value
        })
    }

    handlerChampHauteur = (event) => {
        this.setState({
            changerCasesHauteur: event.target.value
        })
    }

    handlerChampTailleCase = (event) => {
        this.setState({
            changerTailleCase: event.target.value
        })
    }


    /* Cette fonction est celle qui va être appelée par le composant appelant  */
    render(){
        return(
            <div>
                <div style={{display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between"}}>
                    <h1 style={{marginRight: "5%", fontSize: "5vw"}}>Jeu de la Vie</h1>
                    <div style={{border: "1px solid black", marginLeft: "5%", display: "flex", flexDirection: "column", width: "400px", padding: "20px"}}>
                        <h3>Choix des différents paramètres</h3>
                        <button style={{width: "200px", marginBottom: "20px"}} onClick={() => this.handlerChangerRegles()}>Changer les règles</button>
                        <Form onSubmit={(event) => {this.handlerChangerTailleEcran(event); return false}}>
                            <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center"}}controlId={"formChangerLargeur"}>
                                <Form.Label style={{paddingRight: "10px"}}>Nombre de cases en largeur :</Form.Label>
                                <input style={{width:"50px"}} type="text" value={this.state.changerCasesLargeur} onChange={this.handlerChampLargeur} />
                            </Form.Group>
                            <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center", paddingTop: "20px"}} controlId={"formChangerHauteur"}>
                                <Form.Label style={{paddingRight: "10px"}}>Nombre de cases en hauteur :</Form.Label>
                                <input style={{width:"50px"}} type="text" value={this.state.changerCasesHauteur} onChange={this.handlerChampHauteur} />
                            </Form.Group>
                            <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center", paddingTop: "20px"}} controlId={"formChangerTailleCase"}>
                                <Form.Label style={{paddingRight: "10px"}}>Taille d'une case :</Form.Label>
                                <input style={{width:"50px"}} type="text" value={this.state.changerTailleCase} onChange={this.handlerChampTailleCase} />
                            </Form.Group>
                            <Button style={{marginTop: "20px"}} type="submit" variant="primary">Mettre à jour</Button>
                        </Form>
                    </div>
                </div>

                <h3>Actions sur la grille</h3>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <button onClick={() => this.handlerBoutonStart()}><Image id={"imagePlayButton"} src={require("./images/play_button.svg")} width={"32px"} height={"32px"}/></button>
                    <button style={{marginLeft: "30px"}} onClick={() => this.handlerBoutonOneStep()}>One Step</button>
                    <button style={{marginLeft: "30px"}} onClick={() => this.handlerBoutonStepBack()}>Step Back</button>
                    <button style={{marginLeft: "30px"}} onClick={() => this.handlerBoutonRestart()}>Restart</button>
                    <button id={"boutonAddSquares"} style={{marginLeft: "30px"}} onClick={() => this.handlerBoutonAddSquares()}>Add Squares (off)</button>
                </div>

                <canvas style={{display:" inline", marginTop: '30px', border: "1px solid black"}} ref={this.canvasRef} width={this.state.casesLargeur * this.state.tailleCase} height={this.state.casesHauteur * this.state.tailleCase} />

                <Modal animation={true} className={"modal"} show={this.state.showModal} onHide={() => this.handlerFermerModal()} backdrop={"static"}>
                    <Modal.Header style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Modal.Title><h2>Changer les règles du jeu</h2></Modal.Title>
                        <button style={{height: "30px"}} className={"close"} onClick={() => this.handlerFermerModal()}>&times;</button>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center"}}controlId={"formChangerLargeur"}>
                                <Form.Label style={{paddingRight: "10px"}}>Nombre de voisins pour rester en vie :</Form.Label>
                                <input style={{width:"50px"}} type="text" value={this.state.changerCasesLargeur} onChange={this.handlerChampLargeur} />
                            </Form.Group>
                            <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center", paddingTop: "20px"}} controlId={"formChangerHauteur"}>
                                <Form.Label style={{paddingRight: "10px"}}>Nombre de voisins pour naître :</Form.Label>
                                <input style={{width:"50px"}} type="text" value={this.state.changerCasesHauteur} onChange={this.handlerChampHauteur} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <div style={{marginTop: "20px"}}>
                    <Modal.Footer>
                        <Button variant="primary">Save Changes</Button>
                    </Modal.Footer>
                    </div>
                </Modal>

            </div>
        )
    }
}

export default Quadrillage