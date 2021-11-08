import React, { Component } from "react";

const LoanCard = (props) => {
  const { date, name, amount } = props;

  return (
    <div
      className=""
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "70vw",
        margin: "1vw 10% 1vw 10%",
        backgroundColor: "#ecf3ff",
        borderRadius: "10px",
        padding: "3%",
      }}
    >
      <div>{date}</div>
      <div>{name}</div>
      <div>{amount}</div>
    </div>
  );
};

export default LoanCard;
