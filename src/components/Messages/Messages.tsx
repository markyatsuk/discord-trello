import { useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import moment from 'moment';

import { useSocket } from '../../context/socket.context';
import EVENTS from '../../utils/events';
import icon from '../../images/emodji.svg';
import { List, Item } from './Message.styled';
import Container from '../Container/Container';

interface Emoji {
  name: string;
  native: string;
  unified: string;
}

const date = moment().format('DD/MM/YYYY hh:mm a');

function Messages() {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>();
  const [openEmoji, setIsOpenEmoji] = useState<boolean>(false);

  const { socket, messages, userName, setMessages, roomId } = useSocket();

  const messageRef = useRef<HTMLInputElement>(null);

  const handleEmojiSelect = (emoji: Emoji) => {
    setSelectedEmoji(emoji);

    if (messageRef.current) {
      const currentMessage = messageRef.current.value;
      messageRef.current.value = `${currentMessage} ${emoji.native}`;
    }
  };

  const handleSendMessage = () => {
    const message = messageRef.current?.value;
    if (!String(message).trim() && !selectedEmoji) return;

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, userName });

    setMessages([
      ...messages,
      {
        message,
        userName: 'You',
        time: date,
      },
    ]);

    if (messageRef.current) messageRef.current.value = '';

    setSelectedEmoji(undefined);
  };

  return (
    <div>
      <Container>
        {messages?.map(({ message, userName, time }, i) => (
          <List key={i}>
            <Item>{userName}:</Item>
            <Item>{message}</Item>
            <Item>{time}</Item>
          </List>
        ))}
        <div>
          <form onSubmit={handleSendMessage}>
            <input autoComplete='off' ref={messageRef} />
            <img src={icon} alt='icon' onClick={() => setIsOpenEmoji(!openEmoji)} />
            {openEmoji && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
            <button type='button' onClick={handleSendMessage}>
              send a message
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Messages;
