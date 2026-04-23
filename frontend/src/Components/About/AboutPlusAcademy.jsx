import ecosystemImage from "../../assets/plus-academy-innovation-lab.svg";
import SectionHeader from "../Immersive/SectionHeader";
import TiltCard from "../Immersive/TiltCard";

function AboutPlusAcademy() {
  const values = [
    {
      title: "Innovation",
      description:
        "Pushing the boundaries of technology education with cutting-edge curriculum.",
      icon: "In",
    },
    {
      title: "Excellence",
      description:
        "Committed to delivering the highest quality tech education and mentorship.",
      icon: "Ex",
    },
    {
      title: "Global Impact",
      description:
        "Building a community of skilled developers ready to solve real problems.",
      icon: "Gi",
    },
  ];

  return (
    <section className="immersive-section">
      <div className="immersive-container space-y-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeader
              align="left"
              eyebrow="About PlusAcademy"
              title="Shaping the Future of Tech Education"
            >
              We&apos;re on a mission to transform passionate learners into
              exceptional tech professionals through innovative education and
              hands-on experience.
            </SectionHeader>
          </div>

          <div className="image-mask-reveal cinematic-panel h-72 p-2 md:h-96" data-cinematic data-parallax-depth="8">
            <img
              src={ecosystemImage}
              alt="PlusAcademy ecosystem visual"
              className="rounded-lg bg-[#07192F] object-contain"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2" data-stagger>
          <TiltCard className="p-7 md:p-9" data-stagger-item>
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl font-bold text-[#4FFFEA]">Our Mission</h2>
              <p className="text-sm leading-relaxed text-white/74 md:text-base">
                At PlusAcademy, our mission is to deliver high-quality
                technology and coding education to individuals who aspire to
                build successful careers in the rapidly growing digital world.
              </p>
              <p className="text-sm leading-relaxed text-white/62 md:text-base">
                We design our lessons and projects to provide a practical,
                industry-focused learning experience that prepares students to
                succeed in real technology environments.
              </p>
              <p className="text-sm leading-relaxed text-white/62 md:text-base">
                Our purpose is to create opportunities, encourage innovation,
                and equip learners with the skills required to solve real-world
                challenges through software and modern technology.
              </p>
            </div>
          </TiltCard>

          <TiltCard className="p-7 md:p-9" data-stagger-item>
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl font-bold text-[#4FFFEA]">Our Vision</h2>
              <p className="text-sm leading-relaxed text-white/74 md:text-base">
                Our vision is to inspire people across Somalia and beyond to
                explore opportunities in technology, programming, and digital
                innovation.
              </p>
              <p className="text-sm leading-relaxed text-white/62 md:text-base">
                We believe that learning technology can empower a new generation
                to develop creative solutions that benefit their communities and
                the wider world.
              </p>
              <p className="text-sm leading-relaxed text-white/62 md:text-base">
                Our goal is to make tech education accessible and understandable
                for everyone, giving every motivated learner the chance to
                become a confident creator in the digital era.
              </p>
            </div>
          </TiltCard>
        </div>

        <section>
          <SectionHeader title="Our Core Values">
            Principles that guide how we teach, support, and grow with our
            learners every day.
          </SectionHeader>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3" data-stagger>
            {values.map((value) => (
              <TiltCard key={value.title} className="p-7" data-stagger-item>
                <div className="relative z-10">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#4FFFEA]/20 bg-white/10 text-xl">
                    <span aria-hidden="true">{value.icon}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-white/62">{value.description}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default AboutPlusAcademy;
