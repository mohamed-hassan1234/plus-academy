import { Suspense, lazy } from "react"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import LoadingIntro from "./Components/Immersive/LoadingIntro"
import { DashboardProtectedRoute } from "./context/DashboardAuthContext"
import { Routes, Route } from "react-router-dom"

const Home = lazy(() => import("./pages/Home"))
const About = lazy(() => import("./pages/About"))
const Curriculum = lazy(() => import("./pages/Curriculum"))
const Alumni = lazy(() => import("./pages/Alumni"))
const Getstarted = lazy(() => import("./pages/Getstarted"))
const Contact = lazy(() => import("./pages/Contact"))
const Hackthon = lazy(() => import("./pages/Hackthon"))
const HackthonDetails = lazy(() => import("./Components/Hackthon/HackthonDetails"))
const RegisterHackthon = lazy(() => import("./pages/RegisterHAckthon"))
const Dashboard = lazy(() => import("./Dashboard/Dashboard"))
const StudentsList = lazy(() => import("./Dashboard/StudentsList"))
const ReadStudent = lazy(() => import("./Dashboard/ReadStudent"))
const StudentCreate = lazy(() => import("./Dashboard/StudentCreate"))
const ClassManagement = lazy(() => import("./Dashboard/ClassManagement"))
const ClassStudents = lazy(() => import("./Dashboard/ClassStudents"))
const ContactMessages = lazy(() => import("./Dashboard/ContactMessages"))
const Attendance = lazy(() => import("./Dashboard/Attendance"))
const AlumniManagement = lazy(() => import("./Dashboard/AlumniManagement"))
const HackathonManagement = lazy(() => import("./Dashboard/HackathonManagement"))
const HackathonRegistrations = lazy(() => import("./Dashboard/HackathonRegistrations"))
const ReadHackathonRegistration = lazy(() => import("./Dashboard/ReadHackathonRegistration"))
const DashboardShell = lazy(() => import("./Dashboard/DashboardShell"))
const DashboardLogin = lazy(() => import("./pages/DashboardLogin"))
// const DashboardRegister = lazy(() => import("./pages/DashboardRegister"))
const ManageUsers = lazy(() => import("./Dashboard/ManageUsers"))

function RouteFallback({ withHeaderOffset = false }) {
  return <main className={`min-h-screen bg-white ${withHeaderOffset ? "pt-28" : ""}`} aria-hidden="true" />
}

function App () {
  return <>
  <Routes>
      {/* <Route path="/waji/register" element={<Suspense fallback={<RouteFallback />}><DashboardRegister /></Suspense>} /> */}
      <Route path="/waji/login" element={<Suspense fallback={<RouteFallback />}><DashboardLogin /></Suspense>} />

      <Route element={<DashboardProtectedRoute />}>
        <Route path="/waji" element={<Suspense fallback={<RouteFallback />}><DashboardShell /></Suspense>}>
          <Route index element={<Suspense fallback={<RouteFallback />}><Dashboard /></Suspense>} />
          <Route path="manage-users" element={<Suspense fallback={<RouteFallback />}><ManageUsers /></Suspense>} />
          <Route path="students" element={<Suspense fallback={<RouteFallback />}><StudentsList /></Suspense>} />
          <Route path="students/:id" element={<Suspense fallback={<RouteFallback />}><ReadStudent /></Suspense>} />
          <Route path="create" element={<Suspense fallback={<RouteFallback />}><StudentCreate /></Suspense>} />
          <Route path="classes" element={<Suspense fallback={<RouteFallback />}><ClassManagement /></Suspense>} />
          <Route path="classes/:className/students" element={<Suspense fallback={<RouteFallback />}><ClassStudents /></Suspense>} />
          <Route path="attendance" element={<Suspense fallback={<RouteFallback />}><Attendance /></Suspense>} />
          <Route path="alumni" element={<Suspense fallback={<RouteFallback />}><AlumniManagement /></Suspense>} />
          <Route path="contacts" element={<Suspense fallback={<RouteFallback />}><ContactMessages /></Suspense>} />
          <Route path="hackathons" element={<Suspense fallback={<RouteFallback />}><HackathonManagement /></Suspense>} />
          <Route path="hackathon-registrations" element={<Suspense fallback={<RouteFallback />}><HackathonRegistrations /></Suspense>} />
          <Route path="hackathon-registrations/:id" element={<Suspense fallback={<RouteFallback />}><ReadHackathonRegistration /></Suspense>} />
        </Route>
      </Route>

      <Route path="/*" element={
        <>
          <LoadingIntro />
          <Header />
          <Suspense fallback={<RouteFallback withHeaderOffset />}>
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
          </Suspense>
          <Footer />
        </>
      } />
</Routes>
    </>
  
}

export default App;
