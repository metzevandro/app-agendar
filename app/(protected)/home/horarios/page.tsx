"use client";
import { Input, Page } from "design-system-zeroz";
import LayoutPage from "@/app/(protected)/_components/layout";
import { useCurrentUser } from "@/hooks/user-current-user";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const user = useCurrentUser();
  const router = useRouter();

  const backButton = () => {
    router.push("/home");
  };
  return (
    <LayoutPage>
      <Page
        buttonContentPrimary="Button"
        buttonContentSecondary="Button"
        columnLayout="1"
        namePage={`Seus horários`}
        withBackButton
        onClickBackButton={backButton}
      >
        <Input value={user?.name ?? ''} />
        
      </Page>
    </LayoutPage>
  );
};

export default HomePage;
