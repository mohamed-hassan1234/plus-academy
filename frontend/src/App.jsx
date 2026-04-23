import Home from "./pages/Home"
import About from "./pages/About"
import Curriculum from "./pages/Curriculum"
import Alumni from "./pages/Alumni"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import Getstarted from "./pages/Getstarted"
import Contact from "./pages/Contact"
import Dashboard from "./Dashboard/Dashboard"
import StudentsList from "./Dashboard/StudentsList"
import ReadStudent from "./Dashboard/ReadStudent"
import StudentCreate from "./Dashboard/StudentCreate"
import ClassManagement from "./Dashboard/ClassManagement"
import ClassStudents from "./Dashboard/ClassStudents"
import ContactMessages from "./Dashboard/ContactMessages"
import Attendance from "./Dashboard/Attendance"
import AlumniManagement from "./Dashboard/AlumniManagement"
import Hackthon from "./pages/Hackthon"
import HackthonPost from "./Components/Hackthon/HackthonPost"
import HackthonDetails from "./Components/Hackthon/HackthonDetails"
import HackathonManagement from "./Dashboard/HackathonManagement"
import HackathonRegistrations from "./Dashboard/HackathonRegistrations"
import ReadHackathonRegistration from "./Dashboard/ReadHackathonRegistration"
import RegisterHackthon from "./pages/RegisterHAckthon"
import DashboardShell from "./Dashboard/DashboardShell"
import DashboardLogin from "./pages/DashboardLogin"
import DashboardRegister from "./pages/DashboardRegister"
import ManageUsers from "./Dashboard/ManageUsers"
import { DashboardProtectedRoute } from "./context/DashboardAuthContext"
import { Routes, Route } from "react-router-dom"
import LoadingIntro from "./Components/Immersive/LoadingIntro"
function App () {
  return <>
  <Routes>
      <Route path="/waji/register" element={<DashboardRegister />} />
      <Route path="/waji/login" element={<DashboardLogin />} />

      <Route element={<DashboardProtectedRoute />}>
        <Route path="/waji" element={<DashboardShell />}>
          <Route index element={<Dashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="students/:id" element={<ReadStudent />} />
          <Route path="create" element={<StudentCreate />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="classes/:className/students" element={<ClassStudents />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="alumni" element={<AlumniManagement />} />
          <Route path="contacts" element={<ContactMessages />} />
          <Route path="hackathons" element={<HackathonManagement />} />
          <Route path="hackathon-registrations" element={<HackathonRegistrations />} />
          <Route path="hackathon-registrations/:id" element={<ReadHackathonRegistration />} />
        </Route>
      </Route>

      <Route path="/*" element={
        <>
          <LoadingIntro />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/alumni" element={<Alumni />} /> 
            <Route path="/contact" element={<Contact />} />
            <Route path="/getstarted" element={<Getstarted />} />
            <Route path="/hackathons" element={<Hackthon />} />
            <Route path="/hackathons/:id" element={<HackthonDetails />} />
            <Route path="/hackathons/:id/register" element={<RegisterHackthon />} />
          </Routes>
          <Footer />
        </>
      } />
</Routes>
    </>
  
}

export default App;
