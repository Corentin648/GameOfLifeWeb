import React, {useRef, useEffect, Component} from 'react'


/* Ordre d'appel des fonctions :
Appel du composant par le parent --> état initial par le constructor --> appel de render() --> le composant est mis en place --> appel de componentDidMount() --> mise à jour du composant --> appel de render()
 */

class Quadrillage extends Component{

    constructor(props) {
        super(props);
        this.canvasRef = new React.createRef();
        this.width = 400;
        this.height = 400;

        /* La méthode fill remplie l'array avec des 0 */
        /* La méthode map applique à chaque élément la méthode en argument */
        this.matrice = Array(20).fill(0).map(() => new Array(20).fill(0));
    }

    compterVoisines = (i, j) => {
        let voisines = 0;
        if (this.matrice[i-1][j-1] === 1){
            voisines++;
        }
        if (this.matrice[i-1][j] === 1){
            voisines++;
        }
        if (this.matrice[i-1][j+1] === 1){
            voisines++;
        }
        if (this.matrice[i][j+1] === 1){
            voisines++;
        }
        if (this.matrice[i+1][j+1] === 1){
            voisines++;
        }
        if (this.matrice[i+1][j] === 1){
            voisines++;
        }
        if (this.matrice[i+1][j-1] === 1){
            voisines++;
        }
        if (this.matrice[i][j-1] === 1){
            voisines++;
        }
        //console.log(voisines, i, j);
        return voisines;
    }

    evoluer = () => {
        let voisines;
        let  mat = Array(20).fill(0).map(() => new Array(20).fill(0));
        for (let i = 1;i<19;i++) {
            for (let j = 1; j < 19; j++) {
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




    initPattern = () => {
        this.matrice[10][10] = 1;
        this.matrice[11][10] = 1;
        this.matrice[12][10] = 1;
        this.matrice[13][10] = 1;
        this.matrice[14][10] = 1;
    }

    /* Fonction qui trace le quadrillage */
    initDessin = (pinceau, canvas) => {
        pinceau.clearRect(0, 0, canvas.width, canvas.height);
        pinceau.fillStyle = '#000000';

        /* On dessine ici la grille */
        let ecart = 20;
        for (let h = ecart; h < canvas.height; h += ecart) {
            pinceau.moveTo(0, h);
            pinceau.lineTo(canvas.width, h);
            pinceau.stroke();
        }
        for (let l = ecart; l < canvas.width; l += ecart) {
            pinceau.moveTo(l, 0);
            pinceau.lineTo(l, canvas.height);
            pinceau.stroke();
        }

        /* On dessine ici le patern proposé dans initPattern */
        /*
        for (let i = 0;i<20;i++){
            for (let j = 0;j<20;j++){
                if (this.matrice[i][j] === 1){
                    pinceau.fillRect(i*20, j*20, pinceau.canvas.width / 20, pinceau.canvas.height / 20);
                }
            }
        }
        */
    }

    /* Fonction qui dessine en noir les cases "vivantes" */
    dessinerRectangles = (pinceau) => {
        for (let i = 0;i<20;i++){
            for (let j = 0;j<20;j++){
                if (this.matrice[i][j] === 1){
                    pinceau.fillRect(i*20, j*20, pinceau.canvas.width / 20, pinceau.canvas.height / 20);
                }
            }
        }
    }


    /* Cette fonction est appelée une fois que tous les éléments du DOM ont été mis en place */
    componentDidMount() {

        /* On récupère la référence puis le contexte effectif du canvas */
        const canvas = this.canvasRef.current;
        const pinceau = canvas.getContext("2d");
        this.initPattern();
        this.initDessin(pinceau, canvas);

        let animationFrameId;

        const FPS = 2;
        const delay = 1000/FPS;
        let previous = 0;

        const render = () => {
            animationFrameId = window.requestAnimationFrame(render);

            const now = Date.now();
            if (now - previous < delay ){
                return;
            }
            previous = now;

            this.initDessin(pinceau, canvas);
            this.dessinerRectangles(pinceau);
            this.evoluer();
            this.initDessin(pinceau, canvas);
            this.dessinerRectangles(pinceau);

        }

        render();
    }

    /* Cette fonction est celle qui va être appelée par le composant appelant  */
    render(){
        return(
            <div style={{marginTop: '10rem'}}>
                <canvas ref={this.canvasRef} width={this.width} height={this.height} style={{border: '1px solid black'}}/>
            </div>
        )
    }
}
/*const Quadrillage = props => {

    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        //Our first draw
        context.fillStyle = '#000000'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    }, [])

    return <canvas ref={canvasRef} {...props}/>
} */

export default Quadrillage