import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import './Demo.css';

import NavigationBar from './NavigationBar.js';

const apiServer = "http://api.bwai.io";

export default function Demo(props) {
  const style_Navigation_Shadow = {
    height: "96px"
  }

  const style_Demo_Wrapper = {
    padding: "50px 400px 50px 400px"
  }

  return <React.Fragment>
    <NavigationBar/>
    <div style={style_Navigation_Shadow}></div>
    <div style={style_Demo_Wrapper}>
      <div style={{ width: "100%" }}>
        <embed style={{ width: "100%", paddingBottom: "50px" }} src={require("../assets/DemoTitle.svg")} type="image/svg+xml"></embed>
      </div>
      <ChatRoom />
    </div>
    <div>
      <embed style={{ width: "100%" }} src={require("../assets/Footer.svg")} type="image/svg+xml"></embed>
    </div>
  </React.Fragment>
}

const defaultText = "텍스트를 입력하세요."

function ChatRoom() {
  const [inputText, setInputText] = useState(defaultText);
  const [changed, setChanged] = useState(false);
  const [prevTexts, setPrevTexts] = useState([]);
  const ref_chatWrapper = useRef(null);

  const scrollToBottom = () => {
    var tar = ref_chatWrapper.current;
    var height_tar = tar.scrollHeight;

    console.group("SCROLLTOBOTTOM");
    console.log(tar, height_tar);
    console.groupEnd("SCROLLTOBOTTOMEND");

    tar.scrollTo(0, height_tar);
  }

  return <div style={style_border}>
    <div style={style_chat_wrapper} ref={ref_chatWrapper}>
      {
        prevTexts.map((data, index) => {
          if (data.direction === "left") {
            return <React.Fragment key={index}>
              <SystemChat text={data.text} scrollToBottom={scrollToBottom} />
              <ClearDiv />
            </React.Fragment>
          }
          else {
            return <React.Fragment key={index}>
              <UserChat text={data.text} />
              <ClearDiv />
            </React.Fragment>
          }
        })
      }
    </div>
    <div style={style_chat_input_wrapper}>
      <form style={{ width: "calc(100% - 64px)", display: "inline-block" }} onSubmit={submit}>
        <input style={style_chat_input} type="text" value={inputText} onClick={inputClicked} onChange={inputChanged}></input>
        <input style={style_chat_input_submit} type="submit"></input>
      </form>
      <div style={style_chat_input_label_submit} onClick={submit}>
        전송
      </div>
    </div>
  </div>

  function inputChanged(e) {
    const nextValue = e.target.value;

    if (changed) {
      // do nothing
    } else {
      setInputText("")
    }
    setInputText(nextValue);
  }

  function inputClicked(e) {
    if (changed) {
      // do nothing
    } else {
      setInputText("");
      setChanged(true);
    }
  }

  function submit(e) {
    e.preventDefault();

    setPrevTexts([
      ...prevTexts,
      getUserChat(inputText),
      getSystemChat(inputText)
    ]);;

    setInputText("");
  }

  function getUserChat(text) {
    return { direction: "right", text: text };
  }

  function getSystemChat(text) {
    return { direction: "left", text: text };
  }
}

const thread_hold = 0.8;
// var word_thread_hold = 0.2;

function SystemChat({ text, scrollToBottom }) {
  const default_Loading = "Loading...";
  const [transForm, setTransForm] = useState({ __html: default_Loading });

  useEffect(() => {
    if (transForm.__html !== default_Loading)
      scrollToBottom();
      // eslint-disable-next-line 
  }, [transForm]);

  useEffect(() => {
    if (transForm.__html !== default_Loading)
      return

    var url = `${apiServer}/api/bwai/v1/probability/demo`;
    var data = {
      'text': text
    }

    Axios.post(url, data)
      .then((res) => {
        console.log(res);
        var result = res.data.result;
        var is_good = result.probability.bad <= thread_hold;

        if (is_good) {
          setTransForm({
              __html: `<p class="SystemChatTitle">BWAI API의 결과 <문장에는 욕이 없습니다></p>`})
          return;
        }

        var prob_per_token = result.prob_per_token;
        var tokens = result.tokens;

        tokens = tokens.map((data) => data.replace("##", ""));

        console.log(prob_per_token);
        console.log(tokens);
        
        var string = "";
        var last_index = 0;
        var word_thread_hold = 1 / tokens.length;

        for (var i = 0; i < tokens.length; i++) {
          var index = text.indexOf(tokens[i]);

          string += text.slice(last_index, index);
          if (prob_per_token[i] >= word_thread_hold) {
            string += `<span class="highlight">${tokens[i]}</span>`
          } else {
            string += tokens[i];
          }
          
          last_index = index + tokens[i].length;
        }

        setTransForm({
          __html: `
            <p class="SystemChatTitle">BWAI API의 결과 <문장에는 욕이 있습니다></p>
            <p class="SystemChatContents">
            ${string}
            </p>
          `
        })

        // scrollToBottom();
      })
  })


  return <React.Fragment>
    <div style={{ marginLeft: "24px", height: "32px", marginBottom: "4px" }}>
      <img style={{ height: "100%", verticalAlign: "middle", marginRight: "4px" }} src={require("../assets/Chat_BWAI_icon.svg")} alt="" />
      <p style={{ display: "inline-block", margin: 0, fontFamily: "NanumBarunGothicBold" }}>BWAI</p>
    </div>
    <div style={style_SystemChatWrapper} dangerouslySetInnerHTML={transForm}/>
  </React.Fragment>
}

function UserChat({ text }) {
  return <div style={style_UserChatWrapper}>
    <p style={style_chat_text}>{text}</p>
  </div>
}

function ClearDiv() {
  const clearStyle = {
    display: "block",
    clear: "both"
  }

  return <div style={clearStyle}></div>
}

const style_border = {
  paddingBottom: "16px",
  // border: "1px solid #707070",
  boxShadow: "0px 0px 20px 5px rgba(0, 0, 0, 0.2)"
}

const style_chat_wrapper = {
  scrollBehavior: "smooth",
  borderBottom: "0px",
  paddingTop: "16px",
  height: "calc(100vh - 300px)",
  position: "relative",
  overflow: "scroll",
  overflowX: "hidden"
}

const style_chat_input_wrapper = {
  width: "calc(100% - 48px)",
  margin: "0 24px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.5)",
}

const style_chat_input = {
  fontSize: "18px",
  width: "calc(100% - 8px)",
  fontFamily: "NanumBarunGothicBold",
  padding: "0 0 8px 8px",
  outline: "none",
  margin: 0,
  border: 0
}

const style_chat_text_Wrapper = {
  display: "inlineBlock",
  maxWidth: "65%",
  fontFamily: "NanumBarunGothic",
  borderRadius: "8px",
  fontSize: "18px",
  lineHeight: "30px",
  marginBottom: "8px"
}

const style_UserChatWrapper = {
  ...style_chat_text_Wrapper,
  float: "right",
  marginRight: "24px",
  backgroundColor: "#B2CCFA",
}

const style_chat_text = {
  padding: "8px",
  margin: 0
}

const style_SystemChatWrapper = {
  ...style_chat_text_Wrapper,
  float: "left",
  marginLeft: "24px",
  border: "1px solid #A300CB",
  padding: "8px",
  wordBreak: "break-all"
}

const style_chat_input_submit = {
  display: "none"
}

const style_chat_input_label_submit = {
  display: "inline-block",
  fontFamily: "NanumBarunGothicBold",
  fontSize: "18px",
  color: "#A300CB",
  width: "56px",
  marginRight: "8px",
  textAlign: "right"
}