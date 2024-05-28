import s from './ShareScreenButton.module.css';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';

interface IShareScreenButton {
    onClick: () => void;
}

export const ShareScreenButton: React.FC<IShareScreenButton> = ({onClick}: IShareScreenButton) => {
    return(<button className={s.shareButton} onClick={onClick}>
                <ComputerDesktopIcon/>
        </button>);
}