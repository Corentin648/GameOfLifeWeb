import './SubmitButton.css';

export type SubmitButtonProps = {
    label : string;
    styleProperties : string;
}

export const SubmitButton = (props : SubmitButtonProps) => {
    const label : string = props.label;
    const styleProperties : string = props.styleProperties;
    return(
        <button className={`submit-button ${styleProperties}`} type={'submit'} {...props}>
            {label}
        </button>
    )
}