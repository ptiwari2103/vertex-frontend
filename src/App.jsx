import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound.jsx";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileEditForm from "./pages/ProfileEditForm";
import ProfileViewForm from "./pages/ProfileViewForm";
import PinManagement from "./pages/PinManagement";
import CardManagement from "./pages/CardManagement";
import Agent from "./pages/Agent";
import Franchise from "./pages/Franchise";
import Notification from "./pages/Notification";
import SessionTimeout from "./components/SessionTimeout";
import LoginDistributor from "./pages/LoginDistributor";
import Referral from "./pages/Referral";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="register" element={<Register />} />
                        <Route path="login" element={<Login />} />
                        <Route path="logindistributor" element={<LoginDistributor />} />
                        <Route path="profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="profileeditform" element={
                            <ProtectedRoute>
                                <ProfileEditForm />
                            </ProtectedRoute>
                        } />
                        <Route path="profileviewform" element={
                            <ProtectedRoute>
                                <ProfileViewForm />
                            </ProtectedRoute>
                        } />
                        <Route path="pinmanagement" element={
                            <ProtectedRoute>
                                <PinManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="cardmanagement" element={
                            <ProtectedRoute>
                                <CardManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="notification" element={
                            <ProtectedRoute>
                                <Notification />
                            </ProtectedRoute>
                        } />
                        <Route path="agent" element={
                            <ProtectedRoute>
                                <Agent />
                            </ProtectedRoute>
                        } />
                        <Route path="franchise" element={
                            <ProtectedRoute>
                                <Franchise />
                            </ProtectedRoute>
                        } />
                        <Route path="referral" element={
                            <ProtectedRoute>
                                <Referral />
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
                {/* Session timeout component */}
                <SessionTimeout timeoutMinutes={import.meta.env.VITE_SESSION_TIMEOUT} />
            </Router>
        </AuthProvider>
    );
}

export default App;
