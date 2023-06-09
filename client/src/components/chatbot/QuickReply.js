import React from "react";

const QuickReply = (props) => {
  if (props.reply.structValue.fields.payload) {
    return (
      <a
        style={{ margin: 3 }}
        href="/"
        className="btn-floating btn-large waves-effect waves-light"
        style={{ backgroundColor: "#063970" }}
        onClick={(event) =>
          props.click(
            event,
            props.reply.structValue.fields.payload.stringValue,
            props.reply.structValue.fields.text.stringValue
          )
        }
      >
        {props.reply.structValue.fields.text.stringValue}
      </a>
    );
  } else {
    return (
      <a
        style={{ margin: 3 }}
        className="btn-floating btn-large waves-effect waves-light"
        style={{ backgroundColor: "#063970" }}
      >
        {props.reply.structValue.fields.text.stringValue}
      </a>
    );
  }
};

export default QuickReply;
