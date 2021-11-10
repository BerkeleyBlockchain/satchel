import React from "react";

const LoanCard = (props) => {
  const { date, name, amount, onClick } = props;

  return (
    <div
      className=""
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "80vw",
        margin: "1vw 10% 1vw 10%",
        backgroundColor: "#ecf3ff",
        borderRadius: "10px",
        padding: "3%",
      }}
      onClick={onClick}
    >
      <div>{date}</div>
      <div>{name}</div>
      <div>{amount}</div>
    </div>
  );
};

export default LoanCard;
