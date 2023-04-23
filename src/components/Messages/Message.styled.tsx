import styled from 'styled-components';

export const List = styled.ul`
  display: flex;
  list-style: none;
`;

export const Item = styled.li`
  :not(:last-child) {
    margin-right: 8px;
  }
`;
