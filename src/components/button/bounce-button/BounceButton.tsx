import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import './BounceButton.css';

type BounceButtonProps = {
    label?: string;
    icon?: IconProp;
    onClick: () => void;
}

export const BounceButton = (props: BounceButtonProps) => {
    const onClick = props.onClick;
    const icon = props.icon as IconProp ?? null;
    const label = props.label ?? "";

    return(
        <div className={"button-wrapper"}>
            <button className={"bounce-button ${buttonStyle()}"} onClick={onClick}>
                {icon && <FontAwesomeIcon id={'iconPlayButton'} icon={icon} width={'32px'} height={'32px'} />}
                {label}
            </button>
        </div>
    )
}