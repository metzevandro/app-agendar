import React, { useState } from "react";
import {
  AppShell,
  Breadcrumb,
  BreadcrumbRoot,
  Header,
  HeaderProfile,
  SideBar,
  SidebarItem,
  SidebarList,
} from "design-system-zeroz";
import DropDownMenu, {
  DropDownMenuItem,
  DropDownMenuTitle,
} from "design-system-zeroz/src/app/components/DropdownMenu/DropdownMenu";
import { Sair } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/user-current-user";
import { usePathname, useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutPage = (props: LayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const toggleSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  const user = useCurrentUser();

  const navigateTo = (route: string) => {
    router.push(route);
  };

  const breadcrumbs = () => {
    const routes: { [key: string]: string } = {
      "/home": "Home",
      "/home/horarios": "Home",
      "/conta": "Conta",
    };

    const currentRoute = routes[pathname] || pathname.substr(1);

    if (pathname === "/home/horarios") {
      return (
        <BreadcrumbRoot href="/home" pageName={currentRoute}>
          <Breadcrumb href={pathname} pageName="Horários" />
        </BreadcrumbRoot>
      );
    } else {
      return <BreadcrumbRoot href={pathname} pageName={currentRoute} />;
    }
  };

  return (
    <AppShell>
      <SideBar
        brand="/next.svg"
        setToggleSidebar={toggleSidebar}
        toggle={isOpenSidebar}
      >
        <SidebarList title="Páginas">
          <SidebarItem
            onClick={() => navigateTo("/home")}
            active={pathname === "/home"}
            fillIcon
            icon="home"
            title="Home"
          />
          <SidebarItem
            onClick={() => navigateTo("/home/horarios")}
            active={pathname === "/home/horarios"}
            fillIcon={false}
            icon="schedule"
            title="Horários"
          />
        </SidebarList>
        <SidebarList title="Configurações">
          <SidebarItem
            active={pathname === "/conta"}
            fillIcon={false}
            icon="account_circle"
            title="Conta"
            onClick={() => navigateTo("/conta")}
          />
        </SidebarList>
      </SideBar>
      <Header breadcrumb={breadcrumbs()} onClick={toggleSidebar}>
        <HeaderProfile name={user?.name || ""} avatar_src={user?.image || ""}>
          <DropDownMenu dropDownMenu>
            <DropDownMenuTitle content="Conta" />
            <DropDownMenuItem
              content="Conta"
              typeIcon="account_circle"
              onClick={() => navigateTo("/conta")}
            />
            <DropDownMenuTitle content="Sair" />
            <DropDownMenuItem
              content="Sair"
              typeIcon="logout"
              onClick={() => Sair()}
            />
          </DropDownMenu>
        </HeaderProfile>
      </Header>
      {props.children}
    </AppShell>
  );
};

export default LayoutPage;
