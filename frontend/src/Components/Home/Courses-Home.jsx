import { Link } from "react-router-dom";
import SectionHeader from "../Immersive/SectionHeader";

function CoursesHome() {
  const courses = [
    {
      id: 1,
      title: "Web Development",
      level: "Beginner to Advanced",
      badge: "Most Popular",
      description:
        "Master modern web foundations from Figma designs to fully responsive frontends and production-ready backends.",
      topics: [
        "Figma UI Design",
        "HTML & CSS",
        "Tailwind CSS",
        "JavaScript & React",
        "Node.js, Express & Mongoose",
        "Intro to AI for web",
      ],
      icon: "WEB",
    },
    {
      id: 2,
      title: "IoT Development",
      level: "Beginner to Advanced",
      badge: "Most Innovative",
      description:
        "Learn how to build smart systems by connecting hardware devices with software and the internet.",
      topics: [
        "Arduino & Microcontroller Basics",
        "Sensors & Actuators Integration",
        "IoT Communication (WiFi, Bluetooth, MQTT)",
        "Embedded Programming (C/C++)",
        "Cloud IoT Platforms",
        "Smart Device Project Development",
      ],
      projects: [
        "Smart Home Automation System",
        "Smart Temperature & Humidity Monitor",
        "IoT-Based Security Alarm System",
        "Smart Irrigation System",
        "Remote Device Control with Mobile/Web",
      ],
      icon: "IoT",
    },
    {
      id: 3,
      title: "Mobile App Development",
      level: "Beginner to Advanced",
      badge: "New",
      description:
        "Build beautiful, high-performance mobile apps using Flutter for Android, iOS, and beyond.",
      topics: [
        "Flutter & Dart fundamentals",
        "Modern UI layouts",
        "State management basics",
        "REST APIs & JSON",
        "Publishing & deployment overview",
      ],
      icon: "APP",
    },
  ];

  return (
    <section className="plus-home-section" data-section-word="Programs">
      <div className="immersive-container">
        <SectionHeader eyebrow="Our Programs" title="Career-Ready Tech Courses">
          Choose a learning path that matches your ambition from modern web
          development to mobile apps.
        </SectionHeader>

        <div className="plus-card-grid plus-card-grid--three plus-card-grid--depth">
          {courses.map((course, index) => (
            <article
              key={course.id}
              className="plus-floating-card plus-floating-card--course"
              style={{ "--card-delay": `${index * 0.1}s`, "--card-index": index }}
              data-home-depth-card
              data-depth={index + 2}
            >
              <div className="plus-floating-card__shine" aria-hidden="true" />
              <div className="plus-floating-card__top">
                <span className="plus-floating-card__icon">{course.icon}</span>
                <span className="plus-floating-card__badge">{course.badge}</span>
              </div>

              <h3>{course.title}</h3>
              <p className="plus-floating-card__level">{course.level}</p>
              <p>{course.description}</p>

              <ul>
                {course.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>

              {course.projects && (
                <div className="plus-floating-card__projects">
                  <span>Projects Students Will Build:</span>
                  {course.projects.slice(0, 3).map((project) => (
                    <small key={project}>{project}</small>
                  ))}
                </div>
              )}

              <div className="plus-floating-card__actions">
                <Link to="/curriculum">View Curriculum</Link>
                <Link to="/contact">Talk to advisor</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CoursesHome;
