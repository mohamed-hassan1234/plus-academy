import { useState } from "react";
import MagneticButton from "../Immersive/MagneticButton";
import SectionHeader from "../Immersive/SectionHeader";
import TiltCard from "../Immersive/TiltCard";

const programs = [
  {
    id: 1,
    name: "Full Stack Development",
    description:
      "Master modern web development with our comprehensive full stack program. Learn to build scalable applications from front to back.",
    duration: "16 Weeks",
    startDates: "Monthly Cohorts",
    level: "Beginner to Advanced",
    icon: "FS",
    modules: [
      {
        name: "Frontend Development",
        description:
          "Build modern, responsive user interfaces with React and Next.js",
        topics: [
          "UI/Ux Figma",
          "HTML5, CSS & Modern JavaScript",
          "React & Redux Architecture",
          "Next.js & Server Components",
          "TypeScript & Static Typing",
        ],
        tools: ["React", "Next.js", "JavaScript", "Tailwind CSS"],
      },
      {
        name: "Backend Development",
        description: "Create robust and scalable server-side applications",
        topics: [
          "Node.js & Express",
          "RESTful API Design",
          "GraphQL & Apollo",
          "Database Design & ORM",
        ],
        tools: ["Node.js", "Express", "PostgreSQL", "MongoDB"],
      },
      {
        name: "Git & Github",
        description:
          "Master Git & Github to manage your code and collaborate with others",
        topics: [
          "Git Basics",
          "GitHub Workflow",
          "Git Branching Strategies",
          "Collaboration & Conflict Resolution",
        ],
        tools: ["Git", "GitHub", "GitLab", "Bitbucket"],
      },
    ],
  },
  {
    id: 2,
    name: "Mobile Development (Flutter)",
    description:
      "Build beautiful, high-performance mobile applications using Flutter for Android, iOS, and beyond.",
    duration: "16 Weeks",
    startDates: "Monthly Cohorts",
    level: "Beginner to Advanced",
    icon: "MB",
    modules: [
      {
        name: "Flutter & Dart Fundamentals",
        description: "Master the basics of Flutter and Dart to start building mobile applications.",
        topics: [
          "Dart Programming Basics",
          "Flutter Architecture & Widgets",
          "Flutter Navigation",
          "State Management Fundamentals",
        ],
        tools: ["Flutter", "Dart", "Visual Studio Code", "Android Studio"],
      },
      {
        name: "Modern UI Layouts",
        description: "Learn to design visually appealing and responsive mobile interfaces.",
        topics: [
          "UI/UX Design Principles",
          "Responsive Design for Multiple Screens",
          "Animations & Transitions",
          "Material & Cupertino Design",
        ],
        tools: ["Figma", "Adobe XD", "Flutter Widgets"],
      },
      {
        name: "APIs & Data Integration",
        description: "Learn how to connect your apps to backend services and work with data.",
        topics: [
          "REST APIs & JSON",
          "HTTP Requests in Flutter",
          "State Management with Provider / Riverpod",
          "Local Storage & Shared Preferences",
        ],
        tools: ["Flutter", "Dart", "Postman"],
      },
      {
        name: "Publishing & Deployment",
        description: "Learn how to prepare and deploy apps to the App Store and Google Play.",
        topics: [
          "App Signing & Certificates",
          "Play Store & App Store Submission",
          "Debugging & Performance Optimization",
          "Continuous Deployment Basics",
        ],
        tools: ["Flutter", "Android Studio", "Xcode", "Git"],
      },
    ],
  },
  {
    id: 6,
    name: "IoT Development",
    description:
      "Learn to create smart, connected systems by integrating hardware devices with software and the internet. This course equips students to design, build, and deploy real-world IoT projects that solve practical problems.",
    duration: "16 Weeks",
    startDates: "Monthly Cohorts",
    level: "Beginner to Intermediate",
    icon: "IoT",
    modules: [
      {
        name: "Arduino & Microcontroller Fundamentals",
        description: "Master the essentials of microcontrollers and Arduino boards to control devices and sensors.",
        topics: [
          "Arduino Board Overview & Setup",
          "GPIO & Pin Configuration",
          "Serial Communication",
          "Basic Sketch Programming",
        ],
        tools: ["Arduino IDE", "Arduino Boards", "Breadboard", "Jumper Wires"],
      },
      {
        name: "Sensors & Actuators Integration",
        description: "Learn how to connect and program sensors and actuators for smart device functionality.",
        topics: [
          "Temperature & Humidity Sensors",
          "Motion & Proximity Sensors",
          "Relays & Motor Control",
          "LED & Display Integration",
        ],
        tools: ["DHT11/DHT22", "HC-SR04", "Relays", "Arduino"],
      },
      {
        name: "IoT Communication & Networking",
        description: "Understand how devices communicate using WiFi, Bluetooth, and MQTT protocols.",
        topics: [
          "WiFi Connectivity (ESP8266/ESP32)",
          "Bluetooth Low Energy (BLE)",
          "MQTT Protocol",
          "HTTP & REST for IoT",
        ],
        tools: ["ESP8266", "ESP32", "Node-RED", "MQTT Broker"],
      },
      {
        name: "Embedded Programming with C/C++",
        description: "Develop firmware for microcontrollers to control devices and handle sensor data.",
        topics: [
          "C/C++ Syntax for Embedded Systems",
          "Memory Management",
          "Interrupt Handling",
          "Data Structures & Algorithms",
        ],
        tools: ["Arduino IDE", "PlatformIO", "C/C++"],
      },
      {
        name: "Cloud & IoT Platforms",
        description: "Learn to integrate IoT devices with cloud services for remote monitoring and control.",
        topics: [
          "AWS IoT / Azure IoT Hub",
          "Device Management & Provisioning",
          "Data Visualization Dashboards",
          "Remote Configuration",
        ],
        tools: ["Arduino Cloud", "Blynk", "AWS IoT", "ThingsBoard"],
      },
      {
        name: "Smart Device Project Development",
        description: "Hands-on projects that combine hardware, software, and networking to build fully functional IoT systems.",
        topics: [
          "Smart Home Automation System - Control lights, fans, and appliances remotely",
          "Smart Temperature & Humidity Monitor - Track environmental data in real-time",
          "IoT-Based Security Alarm System - Detect intrusions and send alerts",
          "Smart Irrigation System - Automate watering for plants or farms",
          "Remote Device Control via Mobile/Web - Control devices from anywhere",
        ],
        tools: ["Arduino", "ESP32", "Sensors", "Mobile/Web Apps"],
      },
    ],
  },
  {
    id: 7,
    name: "Basic Computer Skills",
    description:
      "This course provides a solid foundation in computer usage, software, and hardware. Students will learn all the essential skills to confidently operate computers, perform office tasks, and understand core technology concepts.",
    duration: "16 Weeks",
    startDates: "Monthly Cohorts",
    level: "Beginner",
    icon: "PC",
    modules: [
      {
        name: "Windows & Operating Systems",
        description: "Learn to navigate and manage modern operating systems efficiently.",
        topics: [
          "Windows Basics & File Management",
          "Desktop Customization & Shortcuts",
          "System Settings & Security",
          "Troubleshooting Common Issues",
        ],
        tools: ["Windows 10/11", "File Explorer", "Control Panel"],
      },
      {
        name: "Microsoft Office Essentials",
        description: "Master essential productivity tools for school, work, and daily tasks.",
        topics: [
          "Microsoft Word - Document creation & formatting",
          "Microsoft Excel - Spreadsheets, formulas & charts",
          "Microsoft PowerPoint - Presentations & multimedia",
          "Microsoft Outlook - Email & calendar management",
        ],
        tools: ["Microsoft Office Suite", "Office Online"],
      },
      {
        name: "Computer Hardware Fundamentals",
        description: "Understand the components inside your computer and how they work together.",
        topics: [
          "CPU, RAM, Storage, Motherboard, Peripherals",
          "Basic Assembly & Maintenance",
          "Input/Output Devices",
          "Troubleshooting Hardware Issues",
        ],
        tools: ["PC Components", "Peripheral Devices"],
      },
      {
        name: "Internet & Digital Literacy",
        description: "Learn to use the internet safely and effectively for work, study, and communication.",
        topics: [
          "Browsers & Search Engines",
          "Email & Online Communication",
          "Cloud Storage & File Sharing",
          "Cybersecurity Basics & Safe Practices",
        ],
        tools: ["Google Chrome", "Firefox", "Gmail", "OneDrive", "Google Drive"],
      },
      {
        name: "Projects Students Will Complete",
        description: "Hands-on projects to apply your new skills in real-world scenarios.",
        topics: [
          "Create a formatted Word document portfolio",
          "Design an Excel budget and chart dashboard",
          "Build a simple PowerPoint presentation for a business idea",
          "Set up a basic home network and secure devices",
          "Practice safe browsing and file sharing online",
        ],
        tools: ["Microsoft Office", "Windows", "Browser", "Network Tools"],
      },
    ],
  },
];

export default function Curriculum1() {
  const [selectedProgram, setSelectedProgram] = useState(programs[0]);

  return (
    <section className="immersive-section bg-white">
      <div className="immersive-container">
        <SectionHeader
          eyebrow="Curriculum"
          title="Tech-Focused Curriculum"
          className="[&_.section-eyebrow]:text-[#0c9f95] [&_.section-title]:text-[#102130] [&_.section-copy]:text-[#4f6572]"
        >
          Industry-aligned programs designed to transform you into a tech
          professional. Learn from experts and build real-world projects.
        </SectionHeader>

        <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-[19rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start" data-cinematic>
            <div className="rounded-2xl border border-[#d8e4ea] bg-white p-4 shadow-[0_18px_44px_rgba(16,33,48,0.08)]">
              <h2 className="mb-4 text-lg font-semibold text-[#122736]">Programs</h2>
              <div className="space-y-2.5">
                {programs.map((program) => (
                  <button
                    key={program.id}
                    onClick={() => setSelectedProgram(program)}
                    className={`group w-full rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                      selectedProgram.id === program.id
                        ? "border-[#1bb2ab]/30 bg-[#10a79f] text-white shadow-[0_14px_30px_rgba(16,167,159,0.26)]"
                        : "border-[#e0eaef] bg-white text-[#2d4654] hover:-translate-y-0.5 hover:border-[#b7d9d7] hover:bg-[#f8fbfc]"
                    }`}
                  >
                    <span className="flex items-center gap-3.5">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                          selectedProgram.id === program.id
                            ? "border-white/30 bg-white/18 text-white"
                            : "border-[#cfe1e7] bg-[#f7fbfc] text-[#1f5f6b] group-hover:border-[#8ec8c6]"
                        }`}
                      >
                        {program.icon}
                      </span>
                      <span className="text-sm font-medium leading-snug">{program.name}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div
            key={selectedProgram.id}
            className="rounded-2xl border border-[#d8e5eb] bg-white p-5 shadow-[0_20px_48px_rgba(16,33,48,0.08)] transition-all duration-300 md:p-8"
          >
            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#bfe1df] bg-[#f5fbfb] text-2xl font-semibold text-[#14867f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]">
                {selectedProgram.icon}
              </span>
              <div>
                <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#102130]">
                  {selectedProgram.name}
                </h2>
                <p className="max-w-3xl text-sm leading-relaxed text-[#56707d] md:text-base">
                  {selectedProgram.description}
                </p>
              </div>
            </div>

            <div className="mb-9 grid grid-cols-1 gap-3.5 md:grid-cols-3">
              {[
                ["Duration", selectedProgram.duration],
                ["Start Dates", selectedProgram.startDates],
                ["Level", selectedProgram.level],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#d9e8ee] bg-white p-4 shadow-[0_10px_24px_rgba(16,33,48,0.05)]"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6f8792]">{label}</p>
                  <p className="mt-1.5 text-lg font-semibold text-[#0e9e96]">{value}</p>
                </div>
              ))}
            </div>

            <h3 className="mb-6 text-xl font-bold text-[#102130]">Course Modules</h3>
            <div className="space-y-5" data-stagger>
              {selectedProgram.modules.map((module) => (
                <TiltCard
                  key={module.name}
                  className="rounded-2xl border border-[#dbe8ed] bg-white p-5 shadow-[0_14px_30px_rgba(16,33,48,0.06)] transition-colors duration-300 hover:border-[#b7d9d7]"
                  data-stagger-item
                >
                  <div className="relative z-10">
                    <h4 className="mb-3 text-lg font-semibold text-[#152b39]">{module.name}</h4>
                    <p className="mb-5 text-sm leading-relaxed text-[#5f7784]">
                      {module.description}
                    </p>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <h5 className="mb-3 text-sm font-semibold text-[#08938b]">
                          Topics Covered
                        </h5>
                        <ul className="space-y-2">
                          {module.topics.map((topic) => (
                            <li key={topic} className="flex items-start gap-2 text-sm text-[#415c69]">
                              <span className="mt-[0.2rem] text-[#0e9e96]">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="mb-3 text-sm font-semibold text-[#08938b]">
                          Tools & Technologies
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {module.tools.map((tool) => (
                            <span
                              key={tool}
                              className="rounded-full border border-[#9fd8d5] bg-[#eef8f7] px-2.5 py-1 text-xs font-medium text-[#11766f]"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>

            <div className="mt-8">
              <MagneticButton
                to="/getstarted"
                className="w-full rounded-xl bg-[#0ea39b] py-3.5 text-base font-semibold text-white shadow-[0_16px_34px_rgba(14,163,155,0.33)] transition hover:bg-[#09928b]"
              >
                Apply Now
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
