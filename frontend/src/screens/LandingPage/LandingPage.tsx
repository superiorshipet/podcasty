import React from "react";

import { Container } from "./Container/Container";
import { ContainerWrapper } from "./ContainerWrapper/ContainerWrapper";
import { DivWrapper } from "./DivWrapper/DivWrapper";

export const LandingPage = (): JSX.Element => {
  return (
    <>
      <Container />
      <ContainerWrapper />
      <DivWrapper />
    </>
  );
};