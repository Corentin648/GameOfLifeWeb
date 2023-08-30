import React, { useState } from 'react';
import { faCopy, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubmitButton } from './components/button/submit_button/SubmitButton.tsx';

export const ChangeGridParamsForm = ({ setShowChangeRulesModal, setGridParams, setGameIsRunning }) => {
    const [updateGridParams, setUpdateGridParams] = useState({
        widthTilesCount: '',
        heightTilesCount: '',
        tileSize: '',
    });

    const handleClickShowModal = () => {
        setShowChangeRulesModal(true);
    };

    const handleSubmitGridParamsUpdate = (event: React.FormEvent<HTMLFormElement>) => {
        const newWidthTilesCount = parseInt(updateGridParams.widthTilesCount);
        const newHeightTilesCount = parseInt(updateGridParams.heightTilesCount);
        const newTileSize = parseInt(updateGridParams.tileSize);

        const newWidthTilesCountChecked = !isNaN(newWidthTilesCount) && newWidthTilesCount.toString() === updateGridParams.widthTilesCount;
        const newHeightTilesCountChecked = !isNaN(newHeightTilesCount) && newHeightTilesCount.toString() === updateGridParams.heightTilesCount;
        const newTileSizeChecked = !isNaN(newTileSize) && newTileSize.toString() === updateGridParams.tileSize;

        if (newWidthTilesCountChecked && newHeightTilesCountChecked && newTileSizeChecked) {
            setGridParams({
                widthTilesCount: newWidthTilesCount,
                heightTilesCount: newHeightTilesCount,
                tileSize: newTileSize,
            });
            setGameIsRunning(false);
        } else {
            console.log('yoyoyo');
            alert('Il faut entrer des nombres entiers !');
        }
        //this.saveStateToLocalStorage();
        event.preventDefault();
    };

    const handleUpdateGridWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateGridParams({
            ...updateGridParams,
            widthTilesCount: event.target.value,
        });
    };

    const handleUpdateGridHeight = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateGridParams({
            ...updateGridParams,
            heightTilesCount: event.target.value,
        });
    };

    const handleUpdateGridTileSize = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateGridParams({
            ...updateGridParams,
            tileSize: event.target.value,
        });
    };

    const handleRestoreDefaultParams = () => {
        //localStorage.clear();
        window.location.reload();
    };

    const inputTextStyle = () => 'border-2 border-gray-200 rounded-md px-2 py-[2px] w-24 focus:outline-none';

    return (
        <section className={'w-full flex flex-row-reverse items-center justify-between'}>
            <h1 className={'mr-[5%] text-[5vw]'}>Jeu de la Vie</h1>

            <div className={'border border-black rounded-md mt-8 ml-[5%] flex flex-col w-[400px] p-[20px] items-center space-y-4'}>
                <h3 className={'text-2xl'}>Choix des différents paramètres</h3>

                <button
                    className={'w-[200px] mb-[20px] p-1 border-2 border-black rounded-md hover:bg-gray-200 hover:delay-150'}
                    onClick={handleClickShowModal}
                >
                    Changer les règles
                    <FontAwesomeIcon id={'iconPlayButton'} icon={faCopy} width={'32px'} height={'32px'} />
                </button>

                <hr className={'w-full'} />

                <form
                    className={'flex flex-col justify-start space-y-4'}
                    onSubmit={event => {
                        handleSubmitGridParamsUpdate(event);
                        return false;
                    }}
                >
                    <div className={'w-full text-left'}>
                        <label className={'pr-4'}>Nombre de cases en largeur :</label>
                        <input className={inputTextStyle()} type="text" value={updateGridParams.widthTilesCount} onChange={handleUpdateGridWidth} />
                    </div>
                    <div className={'w-full text-left'}>
                        <label className={'pr-4'}>Nombre de cases en hauteur :</label>
                        <input className={inputTextStyle()} type="text" value={updateGridParams.heightTilesCount} onChange={handleUpdateGridHeight} />
                    </div>
                    <div className={'w-full text-left'}>
                        <label className={'pr-4'}>Taille d'une case :</label>
                        <input className={inputTextStyle()} type="text" value={updateGridParams.tileSize} onChange={handleUpdateGridTileSize} />
                    </div>
                    <SubmitButton label={'Mettre à jour'} styleProperties={'self-end'}/>
                </form>

                <hr className={'w-full'} />

                <button className={'mt-6 p-2 bg-gray-200 rounded-md hover:bg-gray-300 hover:delay-150'} onClick={handleRestoreDefaultParams}>
                    <FontAwesomeIcon id={'iconPlayButton'} icon={faRotateRight} width={'32px'} height={'32px'} />
                    Restaurer les valeurs par défaut
                </button>
            </div>
        </section>
    );
};
