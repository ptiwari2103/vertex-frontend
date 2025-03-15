import Header from "./Header";
import Footer from "./Footer";
import HeaderMenu from "./HeaderMenu";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <HeaderMenu />
            <main className="flex-grow p-5">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
