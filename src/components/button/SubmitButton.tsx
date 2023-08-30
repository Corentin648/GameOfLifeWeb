import './SubmitButton.css';
import type { SubmitButtonProps } from './SubmitButtonProps.ts';
export const SubmitButton = (props : SubmitButtonProps) => {
    const label : string = props.label;
    const styleProperties : string = props.styleProperties;
    return(
        <button className={`submit-button ${styleProperties}`} type={'submit'} {...props}>
            {label}
        </button>
    )
}