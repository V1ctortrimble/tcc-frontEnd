/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*import Dashboard from "views/Dashboard.jsx";
import TableList from "views/TableList.jsx";
import Typography from "views/Typography.jsx";
import Maps from "views/Maps.jsx";
import Notifications from "views/Notifications.jsx";
import UserRegistration from "pages/UserRegistration/UserRegistration";
import UserLister from "views/UserLister.jsx";
import Upgrade from "views/Upgrade.jsx";
import UserProfile from "views/UserProfile.jsx";*/
import Icons from "views/Icons.jsx";
import UserList from "pages/User/UserList";
import UserInsert from "pages/User/UserInsert";
import SystemCompanyList from "pages/SystemCompany/SystemCompanyList.jsx"
import SystemCompanyInsert from "pages/SystemCompany/SystemCompanyInsert.jsx"
import PassengerList from "pages/Passenger/PassengerList.jsx"
import PassengerInsert from "pages/Passenger/PassengerInsert.jsx"
import Company from "pages/Company/CompanyList.jsx"
import CompanyInsert from "pages/Company/CompanyInsert.jsx"


const dashboardRoutes = [
  {
    path: "/Passenger/PassengerList.jsx",
    name: "Passageiros",
    icon: "pe-7s-add-user",
    component: PassengerList,
    layout: "/admin",
    visibleOnMenu: true,
  },
  {
    path: "/Passenger/PassengerInsert.jsx",
    name: "Cadastro de Passageiro",
    icon: "pe-7s-culture",
    component: PassengerInsert,
    layout: "/admin",
    visibleOnMenu: false,
  },
  {
    path: "/Passenger/PassengerInsert/:cpf",
    name: "Alterar Passageiro",
    icon: "pe-7s-culture",
    component: PassengerInsert,
    layout: "/admin",
    visibleOnMenu: false,
  },
  {
    path: "/Company/CompanyList.jsx",
    name: "Empresas",
    icon: "pe-7s-airplay",
    component: Company,
    layout: "/admin",
    visibleOnMenu: true,
  },
  {
    path: "/Company/CompanyInsert.jsx",
    name: "Cadastro de Empresa",
    icon: "pe-7s-airplay",
    component: CompanyInsert,
    layout: "/admin",
    visibleOnMenu: false,
  },
  {
    path: "/Company/CompanyInsert/:document",
    name: "Alterar Empresa",
    icon: "pe-7s-airplay",
    component: CompanyInsert,
    layout: "/admin",
    visibleOnMenu: false,
  },
  {
    path: "/systemCompany/SystemCompanyList.jsx",
    name: "Empresa do Sistema",
    icon: "pe-7s-culture",
    component: SystemCompanyList,
    layout: "/admin",
    visibleOnMenu: true,
  },
  {
    path: "/systemCompany/SystemCompanyInsert.jsx",
    name: "Cadastro Empresa do Sistema",
    icon: "pe-7s-culture",
    component: SystemCompanyInsert,
    layout: "/admin",
    visibleOnMenu: false,
  },
  {
    path: "/systemCompany/SystemCompanyInsert/:cnpj",
    name: "Alterar Empresa do Sistema",
    icon: "pe-7s-culture",
    component: SystemCompanyInsert,
    layout: "/admin",
    visibleOnMenu: false,
  },
  {
    path: "/User/UserList.jsx",
    name: "Usuários do Sistema",
    icon: "pe-7s-user",
    component: UserList,
    layout: "/admin",
    visibleOnMenu: true
  },
  {
    path: "/User/UserInsert.jsx",
    name: "Cadastro de Usuário",
    icon: "pe-7s-user",
    component: UserInsert,
    layout: "/admin",
    visibleOnMenu: false,
  },
  {
    path: "/User/UserInsert/:username",
    name: "Alterar Usuário",
    icon: "pe-7s-user",
    component: UserInsert,
    layout: "/admin",
    visibleOnMenu: false,
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "pe-7s-science",
    component: Icons,
    layout: "/admin",
    visibleOnMenu: true,
  },
 /* 
 {
    path: "/user",
    name: "Cadastro de Usuário",
    icon: "pe-7s-user",
    component: UserProfile,
    layout: "/admin",
    visibleOnMenu: true,
  },
 {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin",
    visibleOnMenu: true,
  },
  {
    path: "/table",
    name: "Table List",
    icon: "pe-7s-note2",
    component: TableList,
    layout: "/admin",
    visibleOnMenu: true,
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "pe-7s-news-paper",
    component: Typography,
    layout: "/admin",
    visibleOnMenu: true,
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "pe-7s-science",
    component: Icons,
    layout: "/admin",
    visibleOnMenu: true,
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "pe-7s-map-marker",
    component: Maps,
    layout: "/admin",
    visibleOnMenu: true,
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications,
    layout: "/admin",
    visibleOnMenu: true,
  },
  {
    path: "/UserRegistration",
    component: UserRegistration,
    layout: "/admin"
  },
  {
    upgrade: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "pe-7s-rocket",
    component: Upgrade,
    layout: "/admin",
    visibleOnMenu: false,
  },*/
];

export default dashboardRoutes;
