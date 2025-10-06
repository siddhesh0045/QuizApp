
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import PropTypes from "prop-types";

const Layout = ({toggleForm,isLogin}) => {
  return (
    <>
      <Navbar toggleForm={toggleForm} isLogin={isLogin}/>
      <main className="main-content">
       
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
Layout.propTypes = {
 toggleForm: PropTypes.func.isRequired, 
 isLogin: PropTypes.bool.isRequired, 
};

export default Layout;
