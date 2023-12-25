import { Outlet } from "react-router-dom";
import Navmenu from "../components/Navmenu/Navmenu";
import Footer from "../components/Footer/Footer";

const MainLayout = () => {
  return (
    <div className="lg:w-3/4 xl:w-3/5 mx-auto">
      <Navmenu></Navmenu>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
