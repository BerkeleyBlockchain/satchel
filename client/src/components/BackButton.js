import React from "react";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";

const BackButton = (props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
        top: "2vw",
        left: "2vw",
      }}
      onClick={props.onClick}
    >
      <ArrowBackOutlinedIcon color="inherit" />
      <div style={{ color: "#146EFF" }}>{props.text}</div>
    </div>
  );
};

export default BackButton;
