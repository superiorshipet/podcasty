import React from "react";
import { Container } from "./Container";
import { ContainerWrapper } from "./ContainerWrapper";
import { DivWrapper } from "./DivWrapper";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const LandingPage = (): JSX.Element => {
  return (
    <div
      className="bg-white w-full min-w-[1144px] min-h-[1483px] flex"
      data-model-id="1:3"
    >
      <div className="w-[1144px] h-[1483.54px] relative bg-white">
        <Container />
        <ContainerWrapper />
        <DivWrapper />
        <Footer />
        <Navbar />
      </div>
    </div>
  );
};
