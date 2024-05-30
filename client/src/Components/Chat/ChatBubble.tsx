import { useContext } from 'react';
import { IMessage, RoomContext } from '../../context/socket.context';


export const ChatBubble: React.FC<{ message: IMessage}> = ({message} : { message: IMessage}) => {
    const {me} = useContext(RoomContext);
    return (
        <div>
            
        </div>
    );

}