import { useContext, useEffect, useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {v4 as uuidV4} from 'uuid';

import { IMessage, RoomContext, } from '../../context/socket.context';
import icon from '../../images/emodji.svg';
import Container from '../Container/Container';
import {
  List,
  Item,
  Icon,
  Form,
  Wraper,
  Name,
  MessageWraper,
  Input,
  InputWraper,
  Emoji,
} from './Message.styled';

interface Emoji {
  name: string;
  native: string;
  unified: string;
}



function Messages() {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>();
  const [openEmoji, setIsOpenEmoji] = useState<boolean>(false);

  const { messages, sendMessage, chat } = useContext(RoomContext);

  const messageRef = useRef<HTMLInputElement>(null);
  const messageWraperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messageWraper = messageWraperRef.current;
    if (messageWraper) {
      messageWraper.scrollTop = messageWraper.scrollHeight;
    }
  }, [messages]);

  const handleEmojiSelect = (emoji: Emoji) => {
    setSelectedEmoji(emoji);

    if (messageRef.current) {
      const currentMessage = messageRef.current.value;
      messageRef.current.value = `${currentMessage} ${emoji.native}`;
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = messageRef.current?.value;
    if (!String(message).trim() && !selectedEmoji) return;
    sendMessage(message);
    // socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, userName });

    

    if (messageRef.current) messageRef.current.value = '';

    setSelectedEmoji(undefined);
  };

  return (
    <Wraper>
      <Container>
        <MessageWraper ref={messageWraperRef}>
          {chat?.messages.map(({ message, userName, time } : IMessage) => {
            console.log(chat)
            return ((
              <List key={uuidV4()}>
                <Name>{userName}:</Name>
                <Item>{message}</Item>
                <Item>{time}</Item>
              </List>
            ))
          })}
        </MessageWraper>
        <>
          <Form onSubmit={handleSendMessage}>
            <InputWraper>
              <Input autoComplete='off' ref={messageRef} placeholder='Message'/>
              <Icon src={icon} alt='icon' onClick={() => setIsOpenEmoji(!openEmoji)} />
              {openEmoji && (
                <Emoji>
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </Emoji>
              )}
            </InputWraper>
          </Form>
        </>
      </Container>
    </Wraper>
  );
}

export default Messages;
