import styled from "styled-components";

const Turn = styled.div`
  display: flex;
  justify-content: ${props => props.left ? "flex-start" : "flex-end"};
  padding: 5px 20px;
  width: 100%;
  overflow-anchor: none;
  &:first-child {
    padding: 15px 20px 5px 20px;
  }
  &:last-child {
    padding: 5px 20px 15px 20px;
  }
`;

const ChatBubble = styled.div`
  padding: 10px 15px;
  background-color: ${props => props.gray ? "#F0F0F0" : "#1982FC"};
  color: ${props => props.gray ? "#000000" : "#FFFFFF"};
  border-radius: 20px;
  font-size: 0.9rem;
  overflow-anchor: none;
`;

const ConvoTurn = ({ response, children }) => {
    return (
        <Turn left={response}>
            <ChatBubble gray={response}>
                {children}
            </ChatBubble>
        </Turn>
    )
}

export default ConvoTurn;