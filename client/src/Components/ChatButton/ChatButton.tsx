import s from './ChatButton.module.css';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';

interface IChatButton {
    onClick: () => void;
}

export const ChatButton: React.FC<IChatButton> = ({onClick}: IChatButton) => {
    return(<button className={s.shareButton} onClick={onClick}>
                <ChatBubbleBottomCenterIcon/>
        </button>);
}