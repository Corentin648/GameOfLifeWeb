import React, {useRef, useEffect, Component} from 'react'


class Quadrillage extends Component{

    /* Cette fonction est appelée dès que le DOM est mis à jour */
    componentDidMount() {
        /* On récupère la référence puis le contexte effectif du canvas */
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")

        /* C'est sur le contexte que l'on va effectivement dessiner */
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    render(){
        return(
            <canvas ref="canvas" width={640} height={425} />
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