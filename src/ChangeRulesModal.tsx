import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import {useState} from "react";

export const ChangeRulesModal = ({showModal, setShowModal, setRules}) => {

    const [updateRules, setUpdateRules] = useState({
        neighborsRangeStayAlive: '',
        neighborsRangeBorn: ''
    });

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleUpdateStayAlive = (event) => {
        setUpdateRules({
            ...updateRules,
            neighborsRangeStayAlive: event.target.value
        });
    }

    const handleUpdateBorn = (event) => {
        setUpdateRules({
            ...updateRules,
            neighborsRangeBorn: event.target.value
        });
    }

    const checkRuleUpdate = (input) => {
        return input.split(';').reduce((acc, element) => {
            const convertedElement = parseInt(element);
            if (!isNaN(convertedElement) && element === convertedElement.toString() && !acc.includes(convertedElement)){
                acc.push(convertedElement);
            }
            return acc;
        }, []);
    }

    const handleSubmitRulesUpdate = (event) => {
        const intArrayStayAlive =  checkRuleUpdate(updateRules.neighborsRangeStayAlive);
        const intArrayBorn = checkRuleUpdate(updateRules.neighborsRangeBorn);

        if (intArrayBorn.length !== 0 && intArrayStayAlive.length !== 0){
            setShowModal(false);
            setRules({
                neighborsRangeStayAlive: intArrayStayAlive,
                neighborsRangeBorn: intArrayBorn
            });
        } else {
            alert("La syntaxe  n'est pas correcte ! voir l'exemple");
        }
        event.preventDefault();
    }

    return(
        <Modal animation={false} className={"modal"} show={showModal} onHide={handleCloseModal} backdrop={"static"}>
            <Modal.Header style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Modal.Title><h2>Changer les règles du jeu</h2></Modal.Title>
                <button style={{height: "30px"}} className={"close"} onClick={handleCloseModal}>&times;</button>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(event) => {handleSubmitRulesUpdate(event); return false}}>
                    <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center"}} controlId={"formChangerLargeur"}>
                        <Form.Label style={{paddingRight: "10px"}}>Nombre de voisins pour rester en vie :</Form.Label>
                        <input style={{width:"50px"}} type="text" value={updateRules.neighborsRangeStayAlive} onChange={handleUpdateStayAlive} />
                        <Form.Label style={{paddingLeft: "10px", color: "rgb(120,120,120)"}}>Exemple: 3 ; 2</Form.Label>
                    </Form.Group>
                    <Form.Group style={{display: "flex", justifyContent: "left", alignItems: "center", paddingTop: "20px"}} controlId={"formChangerHauteur"}>
                        <Form.Label style={{paddingRight: "10px"}}>Nombre de voisins pour naître :</Form.Label>
                        <input style={{width:"50px"}} type="text" value={updateRules.neighborsRangeBorn} onChange={handleUpdateBorn} />
                        <Form.Label style={{paddingLeft: "10px", color: "rgb(120,120,120)"}}>Exemple: 3 </Form.Label>
                    </Form.Group>
                    <Button style={{marginTop: "20px"}} type="submit" variant="primary">Save Changes</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}