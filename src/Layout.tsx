import NavHeader from "./NavHeader"
import "./layout.css"
import { Outlet } from "react-router-dom"

// Layout component that wraps around the main content of the application
// It includes the navHeader and the main content area where nested routes will render
export default function Layout() {
    return (
        <div className="layout-container">
            <header className="nav-header">
                <NavHeader />
            </header>
            <main className="page-content">
                {/* Outlet is a special component from react-router that renders the child route components */}
                <Outlet /> {/* This is where nested routes render*/}
            </main>
        </div>
    );
}
