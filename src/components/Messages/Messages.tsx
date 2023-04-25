import { useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import { useSocket } from '../../context/socket.context';
import EVENTS from '../../utils/events';
import icon from '../../images/emodji.svg';
import { List, Item } from './Message.styled';

interface Emoji {
  name: string;
  code: string;
  native: string;
}

function Messages() {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>();
  const [openEmoji, setIsOpenEmoji] = useState<boolean>(false);

  const { socket, messages, userName, setMessages, roomId } = useSocket();

  const messageRef = useRef<HTMLInputElement>(null);

  const handleEmojiSelect = (emoji: any) => {
    setSelectedEmoji(emoji);
  };

  const handleSendMessage = () => {
    const message = messageRef.current?.value;
    if (!String(message).trim()) return;

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, userName, selectedEmoji });

    const date = new Date();

    setMessages([
      ...messages,
      {
        message: `${message} ${selectedEmoji ? selectedEmoji.native : ''}`,
        userName: 'You',
        time: date.toLocaleString(),
      },
    ]);

    if (messageRef.current) messageRef.current.value = '';
  };
  console.log(messages);
  return (
    <div>
      {messages?.map(({ message, userName, time }, i) => (
        <List key={i}>
          <Item>{userName}:</Item>
          <Item>{message}</Item>
          <Item>{time}</Item>
        </List>
      ))}
      <div>
        <form>
          <input autoComplete='off' ref={messageRef} />
          <img src={icon} alt='icon' onClick={() => setIsOpenEmoji(!openEmoji)} />
          {openEmoji && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
          <button type='button' onClick={handleSendMessage}>
            send a message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
