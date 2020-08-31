import React, {useRef, useEffect, Component} from 'react'


class Quadrillage extends Component{

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    /* Cette fonction est appelée dès que le DOM est mis à jour */
    componentDidMount() {
        /* On récupère la référence puis le contexte effectif du canvas */
        const canvas = this.canvasRef.current;
        const pinceau = canvas.getContext("2d");

        /* C'est sur le contexte que l'on va effectivement dessiner */
        pinceau.fillStyle = '#000000';
        //pinceau.fillRect(0, 0, pinceau.canvas.width, pinceau.canvas.height);

        let ecart = 20;

        for (let h = ecart; h < canvas.height; h += ecart){
            pinceau.moveTo(0, h);
            pinceau.lineTo(canvas.width, h);
            pinceau.stroke();
        }

        for (let l = ecart; l < canvas.width; l += ecart){
            pinceau.moveTo(l, 0);
            pinceau.lineTo(l, canvas.height);
            pinceau.stroke();
        }
    }

    render(){
        return(
            <canvas ref={this.canvasRef} width={400} height={400} style={{border: '1px solid black'}}/>
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