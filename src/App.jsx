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
import KycForm from "./pages/KycForm";
import BankForm from "./pages/BankForm";
import ProfileForm from "./pages/ProfileForm";
import ProfileEditForm from "./pages/ProfileEditForm";
import ProfileViewForm from "./pages/ProfileViewForm";

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
                        <Route path="kycform" element={
                            <ProtectedRoute>
                                <KycForm />
                            </ProtectedRoute>
                        } />
                        <Route path="bankform" element={
                            <ProtectedRoute>
                                <BankForm />
                            </ProtectedRoute>
                        } />
                        <Route path="profileform" element={
                            <ProtectedRoute>
                                <ProfileForm />
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
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
