import React, { Component } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { v4 as uuid } from "uuid";

import Message from "./Message";
import Card from "./Card";
import QuickReplies from "./QuickReplies";

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;
  talkInput;
  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.state = {
      messages: [],
      showBot: true,
      shopWelcomeSent: false,
    };

    if (cookies.get("userID") === undefined) {
      cookies.set("userID", uuid(), { path: "/" });
    }

    console.log(cookies.get("userID"));
  }

  async df_text_query(queryText) {
    let says = {
      speaks: "user",
      msg: {
        text: {
          text: queryText,
        },
      },
    };
    this.setState({ messages: [...this.state.messages, says] });

    try {
      const res = await axios.post("/api/df_text_query", {
        text: queryText,
        userID: cookies.get("userID"),
      });
      for (let msg of res.data.fulfillmentMessages) {
        let says = {
          speaks: "bot",
          msg: msg,
        };
        this.setState({ messages: [...this.state.messages, says] });
      }
    } catch (error) {
      console.log(error);
    }

    if (this.chatInput) {
      this.chatInput.focus();
    }
  }

  async df_event_query(eventName) {
    try {
      const res = await axios.post("/api/df_event_query", {
        event: eventName,
        userID: cookies.get("userID"),
      });
      for (let msg of res.data.fulfillmentMessages) {
        let says = {
          speaks: "bot",
          msg: msg,
        };
        this.setState({ messages: [...this.state.messages, says] });
      }
    } catch (error) {
      console.log(error);
    }
    if (this.chatInput) {
      this.chatInput.focus();
    }
  }

  resolveAfterXSeconds(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    });
  }

  async componentDidMount() {
    this.df_event_query("Welcome");
    await this.resolveAfterXSeconds(1);
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    if (this.talkInput) {
      this.talkInput.focus();
    }
  }

  show(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showBot: true });
  }

  hide(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showBot: false });
  }

  _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    switch (payload) {
      case "retrieve_yes":
        this.df_event_query("SHOW_RECOMMENDATIONS");
        break;
      case "purchase_orderdet":
        this.df_event_query("PURCHASEORDER");
        break;
      default:
        this.df_text_query(text);
        break;
    }
  }

  renderCards(cards) {
    return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return (
        <Message key={i} speaks={message.speaks} text={message.msg.text.text} />
      );
    } else if (message.msg && message.msg.payload.fields.cards) {
      //message.msg.payload.fields.cards.listValue.values
      return (
        <div key={i}>
          <div className="card-panel grey lighten-5 z-depth-1">
            <div style={{ overflow: "hidden" }}>
              <div className="col s2">
                <a
                  href="/"
                  className="btn-floating btn-large waves-effect waves-light"
                  style={{ backgroundColor: "#063970" }}
                >
                  {message.speaks}
                </a>
              </div>
              <div style={{ overflow: "auto", overflowY: "scroll" }}>
                <div
                  style={{
                    height: 300,
                    width:
                      message.msg.payload.fields.cards.listValue.values.length *
                      270,
                  }}
                >
                  {this.renderCards(
                    message.msg.payload.fields.cards.listValue.values
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.quick_replies
    ) {
      return (
        <QuickReplies
          text={
            message.msg.payload.fields.text
              ? message.msg.payload.fields.text
              : null
          }
          key={i}
          replyClick={this._handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.fields.quick_replies.listValue.values}
        />
      );
    }
  }

  renderMessages(returnedMessages) {
    if (returnedMessages) {
      return returnedMessages.map((message, i) => {
        return this.renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  }

  _handleInputKeyPress(e) {
    if (e.key === "Enter") {
      const queryText = e.target.value.trim();
      if (queryText) {
        this.df_text_query(queryText);
      }
      e.target.value = "";
    }
  }

  render() {
    if (this.state.showBot) {
      return (
        <div
          style={{
            minHeight: 500,
            maxHeight: 500,
            width: 400,
            position: "absolute",
            bottom: 0,
            right: 0,
            border: "1px solid lightgray",
          }}
        >
          <nav style={{ backgroundColor: "#063970" }}>
            <div className="nav-wrapper">
              <a
                href="/"
                className="brand-logo"
                style={{ marginLeft: "10px", fontSize: "1.5rem" }}
              >
                &nbsp;&nbsp;ChatBot
              </a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  <a href="/" onClick={this.hide}>
                    Close
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <div
            id="chatbot"
            style={{
              minHeight: 388,
              maxHeight: 388,
              width: "100%",
              overflow: "auto",
            }}
          >
            {this.renderMessages(this.state.messages)}
            <div
              ref={(el) => {
                this.messagesEnd = el;
              }}
              style={{ float: "left", clear: "both" }}
            ></div>
          </div>
          <div className=" col s12">
            <input
              style={{
                margin: 0,
                paddingLeft: "1%",
                paddingRight: "1%",
                width: "98%",
              }}
              ref={(input) => {
                this.talkInput = input;
              }}
              placeholder="type a message:"
              onKeyPress={this._handleInputKeyPress}
              id="user_says"
              type="text"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            minHeight: 40,
            maxHeight: 500,
            width: 400,
            position: "absolute",
            bottom: 0,
            right: 0,
            border: "1px solid lightgray",
          }}
        >
          <nav style={{ backgroundColor: "#063970" }}>
            <div className="nav-wrapper">
              <a
                href="/"
                className="brand-logo"
                style={{ marginLeft: "10px", fontSize: "1.5rem" }}
              >
                &nbsp;&nbsp;ChatBot
              </a>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  <a href="/" onClick={this.show}>
                    Show
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <div
            ref={(el) => {
              this.messagesEnd = el;
            }}
            style={{ float: "left", clear: "both" }}
          ></div>
        </div>
      );
    }
  }
}

export default Chatbot;
