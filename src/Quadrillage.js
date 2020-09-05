import React, {Component} from 'react';
import {Image} from "react-bootstrap";


/* Ordre d'appel des fonctions :
Appel du composant par le parent --> état initial par le constructor --> appel de render() --> le composant est mis en place --> appel de componentDidMount() --> mise à jour du composant --> appel de render()
 */

class Quadrillage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            casesLargeur : 30,    // nombre de cases en largeur
            casesHauteur : 30,   // nombre de cases en hauteur
            changerCasesLargeur : '',   // nouveau nombre de cases en largeur
            changerCasesHauteur : '',   // nouveau nombre de cases en hauteur
            tailleCase : 20,   // taille d'une case
            start : false,   // la partie n'est pas lancée au départ
            tailleChangee: false // indique si la taille de la grille vient d'être changée
        }

        this.canvasRef = new React.createRef();

        /* La méthode fill remplie l'array avec des 0 */
        /* La méthode map applique à chaque élément la méthode en argument */

        this.matrice = '';
        this.backupMatrice ='';

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

        //localStorage.clear();
        const state = localStorage.getItem('state');
        if (state) {
            this.setState(JSON.parse(state));
        }
        //console.log(this.state);

        this.matrice = Array(this.state.casesLargeur).fill(0).map(() => new Array(this.state.casesHauteur).fill(0));
        this.backupMatrice = Array(this.state.casesLargeur).fill(0).map(() => new Array(this.state.casesHauteur).fill(0));

        /* On récupère la référence puis le contexte effectif du canvas */
        this.canvas = this.canvasRef.current;
        this.pinceau = this.canvas.getContext("2d");

        /* On initialise la matrice et on trace la grille */
        this.initPattern();
        this.initDessin(this.pinceau, this.canvas);

        /* On ajoute le listener à la grille pour cliquer sur les cases */
        this.canvas.addEventListener('click', (event) => {
            event.stopPropagation();
            let input = event;
            let canvasPosition = this.canvas.getBoundingClientRect();
            let inputX = input.pageX - (canvasPosition.left + window.scrollX);
            let inputY = input.pageY - (canvasPosition.top + window.scrollY);
            let [i,j] = [Math.floor(inputX/this.state.tailleCase), Math.floor(inputY/this.state.tailleCase)];
            if (this.matrice[i][j] === 0) {
                this.pinceau.fillStyle = '#000000';
                this.pinceau.fillRect(i * this.state.tailleCase + 1, j * this.state.tailleCase + 1, this.pinceau.canvas.width / this.state.casesLargeur - 2, this.pinceau.canvas.height / this.state.casesHauteur - 2);
                this.matrice[i][j] = 1;
            } else if (this.matrice[i][j] === 1) {
                this.pinceau.fillStyle = '#FFFFFF';
                this.pinceau.fillRect(i * this.state.tailleCase + 1, j * this.state.tailleCase + 1, this.pinceau.canvas.width / this.state.casesLargeur - 2, this.pinceau.canvas.height / this.state.casesHauteur - 2);
                this.matrice[i][j] = 0;
            }
        }, false);

        /* Variables pour la fonction render() */
        let animationFrameId;
        const FPS = 10;
        const delay = 1000/FPS;
        let previous = 0;
        let compt = 0;

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
                compt++;

                this.dessinerRectangles(this.pinceau);
                this.evoluer();
            } else {
                animationFrameId = window.requestAnimationFrame(render);
                const now = Date.now();
                if (now - previous < delay) {
                    return;
                }
                previous = now;
                compt++;
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
        this.saveStateToLocalStorage();
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

    handlerChangerTailleEcran = (event) => {
        const nouvelleLargeur = parseInt(this.state.changerCasesLargeur);
        const nouvelleHauteur = parseInt(this.state.changerCasesHauteur);
        if (!isNaN(nouvelleLargeur) && !isNaN(nouvelleHauteur)) {
            this.setState({
                casesLargeur: parseInt(this.state.changerCasesLargeur),
                casesHauteur: parseInt(this.state.changerCasesHauteur),
                changerCasesLargeur: '',
                changerCasesHauteur: ''
            })
            this.setState({
                tailleChangee: true
            })
        } else {
            alert('Il faut entrer des nombres entiers !');
            }
        this.saveStateToLocalStorage();
        console.log(this.state);
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

    /* Cette fonction est celle qui va être appelée par le composant appelant  */
    render(){
        return(
            <div style={{marginTop: '5rem'}}>
                <button style={{display: "block"}} onClick={() => this.handlerBoutonStart()}><Image id={"imagePlayButton"} src={require("./images/play_button.svg")} width={"32px"} height={"32px"}/></button>
                <button style={{display: "block"}} onClick={() => this.handlerBoutonOneStep()}>One Step</button>
                <button style={{display: "block"}} onClick={() => this.handlerBoutonStepBack()}>Step Back</button>
                <form onSubmit={(event) => {this.handlerChangerTailleEcran(event); return false}}>
                    <label>
                        Nombre de cases en largeur :
                        <input type="text" value={this.state.changerCasesLargeur} onChange={this.handlerChampLargeur} />
                    </label>
                    <label>
                        Nombre de cases en hauteur :
                        <input type="text" value={this.state.changerCasesHauteur} onChange={this.handlerChampHauteur} />
                    </label>
                    <input type="submit" value="Envoyer" />
                </form>
                <canvas ref={this.canvasRef} width={this.state.casesLargeur * this.state.tailleCase} height={this.state.casesHauteur * this.state.tailleCase} style={{border: '1px solid black'}}/>
            </div>
        )
    }
}

export default Quadrillage