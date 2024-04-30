"use client";
import { Page } from "design-system-zeroz";
import LayoutPage from "../_components/layout";
import { useCurrentUser } from "@/hooks/user-current-user";
import { EnterForm } from "@/components/auth/enter-form/enter-form";
import React from 'react';

const HomePage = () => {
  const user = useCurrentUser();

  return (
    <>
      <EnterForm />
      <LayoutPage>
        <Page
          buttonContentPrimary="Button"
          buttonContentSecondary="Button"
          columnLayout="1"
          namePage={`Bem-vindo de volta, ${user?.name}!`}
          withActionPrimary
          withActionSecondary
        >
          <p></p>
        </Page>
      </LayoutPage>
    </>
  );
};

export default HomePage;
