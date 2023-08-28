import React, {useState} from "react";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const ChangeRulesModal = ({showModal, setShowModal, setRules}) => {

    const [updateRules, setUpdateRules] = useState({
        neighborsRangeStayAlive: '',
        neighborsRangeBorn: ''
    });

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleSubmitRulesUpdate = (event : React.FormEvent<HTMLFormElement>) => {
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

    const handleUpdateStayAlive = (event : React.ChangeEvent<HTMLInputElement>) => {
        setUpdateRules({
            ...updateRules,
            neighborsRangeStayAlive: event.target.value
        });
    }

    const handleUpdateBorn = (event : React.ChangeEvent<HTMLInputElement>) => {
        setUpdateRules({
            ...updateRules,
            neighborsRangeBorn: event.target.value
        });
    }

    const checkRuleUpdate = (input : string) => {
        return input.split(';').reduce((acc : number[], element) => {
            const convertedElement = parseInt(element);
            if (!isNaN(convertedElement) && element === convertedElement.toString() && !acc.includes(convertedElement)){
                acc.push(convertedElement);
            }
            return acc;
        }, []);
    }

    const inputTextStyle = () => "border-2 border-gray-200 rounded-md px-2 py-[2px] w-24 focus:outline-none"

    return(
    <div style={{backgroundColor: "rgba(0, 0, 0, 0.7)"}} className={`absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center ${!showModal ?'hidden' : ''}`}>
        <div style={{backgroundColor: "rgba(255, 255, 255, 1)"}} className={"fixed top-0 bottom-0 right-0 left-0 m-auto w-max h-max px-4 py-2 rounded-md space-y-4"}>
            <div className={"flex justify-between items-center"}>
                <h2 className={"text-2xl"}>Changer les règles du jeu</h2>
                <button className={"bg-gray-200 rounded-full w-6 h-6 flex justify-center items-center"} onClick={handleCloseModal}>
                    <FontAwesomeIcon className={"w-3 h-3"} id={"iconPlayButton"} icon={faXmark}/>
                </button>
            </div>
            <hr/>
            <div>
                <form className={"flex flex-col justify-start space-y-4"} onSubmit={(event) => {handleSubmitRulesUpdate(event); return false}}>
                    <div className={"w-full text-left flex items-center space-x-3"}>
                        <label>Nombre de voisins pour rester en vie :</label>
                        <input className={inputTextStyle()} type="text" value={updateRules.neighborsRangeStayAlive} onChange={handleUpdateStayAlive} />
                        <label className={"text-gray-500"}>Exemple: 3 ; 2</label>
                    </div>
                    <div className={"w-full text-left flex items-center space-x-3"}>
                        <label>Nombre de voisins pour naître :</label>
                        <input className={inputTextStyle()} type="text" value={updateRules.neighborsRangeBorn} onChange={handleUpdateBorn} />
                        <label className={"text-gray-500"}>Exemple: 3</label>
                    </div>
                    <button className={"self-end p-1 border-2 border-black rounded-md hover:bg-gray-200 hover:delay-150"} type="submit">Mettre à jour</button>
                </form>
            </div>
        </div>
    </div>
    )
}