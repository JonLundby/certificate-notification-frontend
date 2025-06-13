import NavHeader from "./NavHeader"
import "./layout.css"
import { Outlet } from "react-router-dom"

// type LayoutProps = {
//     children?: React.ReactNode;
// }

// This component serves as a layout wrapper for the application.
// const Layout = ({ children }: LayoutProps) => { //children are of type ReactNode which will allow any valid React element to be passed as children
export default function Layout() { //children are of type ReactNode which will allow any valid React element to be passed as children
    return (
        <div className="layout-container">
            <header className="nav-header">
                <NavHeader />
            </header>
            <main className="page-content">
                <Outlet /> {/* This is where nested routes render */}
            </main>
        </div>
    );
}

// export default Layout;