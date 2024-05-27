import styled from 'styled-components';

export const Wraper = styled.div`
  background-color: black;
`;

export const List = styled.ul`
  margin-top: auto;
  display: flex;
  list-style: none;
`;

export const Item = styled.li`
  :not(:last-child) {
    margin-right: 8px;
  }

  color: #a1a1a1;
`;

export const Name = styled.li`
  color: white;
  margin-right: 8px;
`;

export const Icon = styled.img`
  position: absolute;
  top: 0;
  right: 25px;
  width: 16px;
  height: 16px;
`;

export const Form = styled.form``;

export const MessageWraper = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 10px;
  margin-top: auto;
  height: 600px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
    background-color: rgb(43 43 43);
  }
`;

export const Input = styled.input`
  position: absolute;
  bottom: 15px;
  width: 380px;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  outline: none;
  border: none;
  background-color: rgb(43 43 43);

  font-size: 14px;
  color: white;

  ::placeholder {
    color: white;
  }

  @media screen and (min-width: 768px) {
    width: 665px;
  }

  @media screen and (min-width: 1200px) {
    width: 1095px;
  }
`;

export const InputWraper = styled.div`
  position: relative;
  height: 40px;
  margin-top: 15px;
`;

export const Emoji = styled.div`
  position: absolute;
  top: -460px;
  right: 18px;
`;
