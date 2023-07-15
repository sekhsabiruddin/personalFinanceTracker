import React from "react";
import Header from "../componets/Header";
import SingupSingin from "../componets/SingupSingin";
const Singup = () => {
  return (
    <div>
      <Header />
      <div className="wrapper">
        <SingupSingin />
      </div>
    </div>
  );
};

export default Singup;
