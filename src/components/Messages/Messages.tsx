import { useEffect, useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import moment from 'moment';

import { useSocket } from '../../context/socket.context';
import EVENTS from '../../utils/events';
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

const date = moment().calendar();

function Messages() {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>();
  const [openEmoji, setIsOpenEmoji] = useState<boolean>(false);

  const { socket, messages, userName, setMessages, roomId } = useSocket();

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

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, userName });

    setMessages([
      ...messages,
      {
        message,
        userName: userName,
        time: date,
      },
    ]);

    if (messageRef.current) messageRef.current.value = '';

    setSelectedEmoji(undefined);
  };

  return (
    <Wraper>
      <Container>
        <MessageWraper ref={messageWraperRef}>
          {messages?.map(({ message, userName, time }, i) => (
            <List key={i}>
              <Name>{userName}:</Name>
              <Item>{message}</Item>
              <Item>{time}</Item>
            </List>
          ))}
        </MessageWraper>
        <>
          <Form onSubmit={handleSendMessage}>
            <InputWraper>
              <Input autoComplete='off' ref={messageRef} placeholder='Message' />
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
