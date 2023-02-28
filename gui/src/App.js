import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlaneTop } from "@fortawesome/pro-light-svg-icons";
import ConvoTurn from "./ConvoTurn";
import ValdiLogo from "./assets/valdi-square-small.png";

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #F5F5F5;
`;

const ChatContainer = styled.div`
  max-width: 600px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background-color: #FFFFFF;
  border: 1px solid #D1D1D1;
  border-radius: 5px;
  position: relative;
  @media screen and (max-width: 620px) {
    max-width: 100%;
    width: 100%;
    height: 100vh;
    border: none;
  }
`;

const ChatTitle = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 10px 20px;
  font-family: 'Roboto', 'Ubuntu', sans-serif;
  border-bottom: 1px solid #D1D1D1;
`;

const TitleText = styled.div`
  margin-left: 8px;
`;

const ChatContent = styled.div`
  min-width: 600px;
  height: 100%;
  position: relative;
  overflow-y: auto;
  @media screen and (max-width: 620px) {
    min-width: 100%;
    width: 100%;
  }
`;

const ChatControls = styled.div`
  position: relative;
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 5px;
`;

const TextInputForm = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
  z-index: 3;
`;

const TextField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  outline: 1px solid #D1D1D1;
  padding: 10px 15px;
  border-radius: 20px;
  position: relative;
  width: 100%;
  background-color: #ffffff;
`;

const TextInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  font-family: inherit;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const SubmitLabel = styled.label`
  background-color: #1982FC;
  width: 30px;
  height: 30px;
  margin: -10px -10px;
  border-radius: 15px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  cursor: pointer;
  &:active {
    background-color: #1475E3;
  }
`;

const TextSubmit = styled.input`
    display: none;
`;

const TypingIndicator = styled.div`
  position: absolute;
  font-size: 0.6rem;
  background-color: #F0F0F0;
  padding: 3px 15px;
  border-radius: 5px 5px 0 0;
  top: ${props => props.hidden ? "1px" : "-10px"};
  transform: translateX(-50%);
  left: 50%;
  & span {
    font-weight: 600;
  }
  transition: top 1s;
`;

const ScrollAnchor = styled.div`
  overflow-anchor: auto;
  width: 100%;
  height: 5px;
`;

const Image = styled.div`
  width: 27px;
  height: 27px;
  border-radius: 15px;
  overflow: hidden;
  & img {
    width: 100%;
  }
`;

const LandingContent = styled.div` 
  & span {
    font-size: 2rem;
    font-weight: 700;
  }
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const LandingBody = styled.div`
  width: 70%;
  font-size: 0.9rem;
  & p {
    margin-top: 10px;
  }
  & a {
    font-weight: 600;
  }
  & a:hover {
    opacity: 0.75;
  }
`;

const LandingBodyList = styled.ul`
  list-style-position: inside;
  text-align: center;
  margin: 20px 0;
  padding: 0;
`;

const LandingDisclaimer = styled.div`
  width: 70%;
  font-size: 0.6rem;
  opacity: 0.6;
  & a {
    text-decoration: underline;
  }
`;

function App() {
    const [ textInput, setTextInput ] = useState('');
    const [ turns, setTurns ] = useState([]);
    const [ sessionId, setSessionId ] = useState();
    const [ aiIsThinking, setAiIsThinking ] = useState(false);

    const handleFormSubmit = e => {
        e.preventDefault();

        if (textInput) {
            if (!/^\s*$/.test(textInput)) {
                setTurns(prev => {
                    return [
                        ...prev,
                        {
                            'source': 'user',
                            'text': textInput
                        }
                    ];
                });

                setAiIsThinking(true);

                let requestHeaders = new Headers();
                requestHeaders.append('Content-Type', 'application/json');

                if (sessionId) {
                    fetch('http://127.0.0.1:8000/chat/response', {
                        method: 'POST',
                        headers: requestHeaders,
                        body: JSON.stringify({
                            'session_id': sessionId,
                            'text': textInput
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            setTurns(prev => {
                                return [
                                    ...prev,
                                    {
                                        'source': 'ai',
                                        'text': data['text']
                                    }
                                ];
                            });
                        })
                        .catch(error => console.log(error))
                        .finally(() => setAiIsThinking(false));
                } else {
                    fetch('http://127.0.0.1:8000/chat', {
                        method: 'POST',
                        headers: requestHeaders,
                        body: JSON.stringify({
                            'text': textInput
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            setSessionId(data['session_id']);
                            setTurns(prev => {
                                return [
                                    ...prev,
                                    {
                                        'source': 'ai',
                                        'text': data['text']
                                    }
                                ];
                            });
                        })
                        .catch(error => console.log(error))
                        .finally(() => setAiIsThinking(false));
                }
                setTextInput('');
            }
        }
    }

    return (
        <AppContainer>
            <ChatContainer>
                <ChatTitle>
                    <Image>
                        <img src={ValdiLogo} alt="" />
                    </Image>
                    <TitleText>
                        ValdiGPT
                    </TitleText>
                </ChatTitle>
                <ChatContent>
                    {(sessionId || aiIsThinking) ?
                        (
                            <>
                                {turns.map((turn, idx) => {
                                    return (
                                        <ConvoTurn response={turn['source'] === 'ai'} key={idx}>
                                            {turn['text']}
                                        </ConvoTurn>
                                    )
                                })}
                            </>
                        ) : (
                            <LandingContent>
                                <span>
                                    ValdiGPT
                                    <br/>
                                    👋
                                </span>
                                <LandingBody>
                                    <p>
                                        Welcome to ValdiGPT.
                                    </p>
                                    <p>
                                        This page demonstrates running a full-stack application on <a href="https://valdi.ai" target="_blank" rel="noreferrer">VALDI</a>:
                                    </p>
                                    <LandingBodyList>
                                        <li><a href="https://beta.reactjs.org/" target="_blank" rel="noreferrer">ReactJS</a> frontend ⚛️</li>
                                        <li><a href="https://fastapi.tiangolo.com/" target="_blank" rel="noreferrer">FastAPI</a> backend 🐍</li>
                                        <li><a href="https://huggingface.co/" target="_blank" rel="noreferrer">Hugging Face</a> Conversational AI model 🤗</li>
                                    </LandingBodyList>
                                </LandingBody>
                                <LandingDisclaimer>
                                    Heads up! Don't expect <a href="https://chat.openai.com">ChatGPT</a>-like responses,
                                    I'm just for demo purposes.
                                </LandingDisclaimer>
                            </LandingContent>
                        )
                    }
                    <ScrollAnchor />
                </ChatContent>
                <ChatControls>
                    <TypingIndicator hidden={!aiIsThinking}>
                        <span>ValdiGPT</span> is typing...
                    </TypingIndicator>
                    <TextInputForm onSubmit={handleFormSubmit}>
                        <TextField>
                            <TextInput placeholder="Ask me anything..."
                                       value={textInput}
                                       onChange={e => setTextInput(e.target.value)}
                            />
                            <SubmitLabel htmlFor="form-submit">
                                <FontAwesomeIcon icon={faPaperPlaneTop} style={{marginLeft: "2px"}} />
                            </SubmitLabel>
                            <TextSubmit type="submit"
                                        id="form-submit"
                                        disabled={aiIsThinking}
                            />
                        </TextField>
                    </TextInputForm>
                </ChatControls>
            </ChatContainer>
        </AppContainer>
    );
}

export default App;
