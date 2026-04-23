const ecosystemPanels = [
  {
    id: "foundation",
    title: "Foundational Human Inputs",
    position:
      "lg:absolute lg:left-4 lg:top-40 lg:w-[31%] xl:left-6 xl:w-[30%]",
    cardTone:
      "border-[#8be0ec]/70 bg-slate-900/78 shadow-[0_0_30px_rgba(126,216,230,0.12)]",
    accent: "from-[#1d6273] to-[#4eaebe]",
    items: [
      "Basic Computer Skills",
      "Windows, Office and digital literacy",
      "Beginner-friendly learning path",
    ],
  },
  {
    id: "fullstack",
    title: "Advanced Full-Stack Architecture",
    position:
      "lg:absolute lg:left-1/2 lg:top-40 lg:w-[27%] lg:-translate-x-1/2",
    cardTone:
      "border-[#8be0ec]/70 bg-slate-900/80 shadow-[0_0_32px_rgba(78,174,190,0.16)]",
    accent: "from-[#4eaebe] to-[#7ed8e6]",
    items: [
      "Full-Stack Development",
      "React, Node.js, APIs and MongoDB",
      "Projects, reviews and deployment flow",
    ],
  },
  {
    id: "mobile",
    title: "Multi-Platform Mobile Ecosystem",
    position:
      "lg:absolute lg:right-4 lg:top-40 lg:w-[31%] xl:right-6 xl:w-[30%]",
    cardTone:
      "border-[#8be0ec]/70 bg-slate-900/78 shadow-[0_0_30px_rgba(126,216,230,0.12)]",
    accent: "from-[#7ed8e6] to-[#4eaebe]",
    items: [
      "Mobile App Development",
      "Flutter, Dart and API integration",
      "Android and iOS launch-ready skills",
    ],
  },
  {
    id: "iot",
    title: "Internet Of Smart Devices",
    position:
      "lg:absolute lg:right-4 lg:bottom-28 lg:w-[31%] xl:right-6 xl:w-[30%]",
    cardTone:
      "border-[#8be0ec]/70 bg-slate-900/78 shadow-[0_0_30px_rgba(126,216,230,0.12)]",
    accent: "from-[#1d6273] to-[#7ed8e6]",
    items: [
      "IoT Development",
      "Arduino, ESP32, sensors and automation",
      "Smart systems for homes and communities",
    ],
  },
  {
    id: "career",
    title: "Career Readiness Engine",
    position:
      "lg:absolute lg:left-4 lg:bottom-28 lg:w-[31%] xl:left-6 xl:w-[30%]",
    cardTone:
      "border-[#8be0ec]/70 bg-slate-900/78 shadow-[0_0_30px_rgba(126,216,230,0.12)]",
    accent: "from-[#4eaebe] to-[#1d6273]",
    items: [
      "Digital Marketing",
      "CV support, portfolios and communication",
      "Launch confidence for real opportunities",
    ],
  },
];

const stats = [
  { value: "500+", label: "Graduates" },
  { value: "9", label: "Bootcamps" },
  { value: "15", label: "Tech Events" },
  { value: "1", label: "Campus Hub" },
];

function HeroEcosystemGraphic() {
  return (
    <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-[#9ce5ef]/45 bg-[radial-gradient(circle_at_top,rgba(126,216,230,0.18),transparent_36%),linear-gradient(180deg,#1c2a3d_0%,#111c2a_50%,#0b1420_100%)] p-4 text-white shadow-[0_28px_80px_rgba(13,25,39,0.42)] lg:min-h-[690px] lg:p-5">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-[#7ed8e6]/18 blur-2xl" />
        <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-[#4eaebe]/20 blur-3xl" />
        <div className="absolute inset-x-12 bottom-20 h-px bg-gradient-to-r from-transparent via-[#7ed8e6]/40 to-transparent" />
      </div>

      <div className="relative rounded-[1.7rem] border border-white/10 bg-black/18 px-4 py-4 backdrop-blur-sm lg:px-5">
        <div className="rounded-[1.25rem] border border-white/15 bg-white/10 px-4 py-4 text-center shadow-[0_0_24px_rgba(126,216,230,0.1)] lg:px-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[#baf1f7]">
            The Advanced PlusAcademy Ecosystem
          </p>
          <h3 className="mt-2 text-lg font-extrabold leading-tight text-white lg:text-[1.7rem]">
            Your Data, Connected And Understandable
          </h3>
        </div>

        <div className="relative mt-5 flex flex-col gap-4 lg:min-h-[520px]">
          {ecosystemPanels.map((panel) => (
            <div key={panel.id} className={`relative ${panel.position}`}>
              <div className="rounded-[1.35rem] border px-4 py-4 backdrop-blur-md lg:px-5 lg:py-5 ${panel.cardTone}">
                <div
                  className={`inline-flex rounded-full bg-gradient-to-r ${panel.accent} px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white`}
                >
                  {panel.title}
                </div>

                <div className="mt-4 space-y-3">
                  {panel.items.map((item, index) => (
                    <div
                      key={item}
                      className={`rounded-2xl border px-3 py-3 ${
                        index === 0
                          ? "border-[#7ed8e6]/40 bg-white/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          index === 0
                            ? "font-semibold text-white"
                            : "text-[#d0eef3]"
                        }`}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="relative z-10 mx-auto mt-2 flex w-full max-w-[18rem] flex-col items-center justify-center self-center rounded-full border border-[#8ce0eb]/45 bg-[radial-gradient(circle_at_top,#4eaebe_0%,#1d6273_55%,#122131_100%)] px-5 py-8 text-center shadow-[0_0_38px_rgba(126,216,230,0.22)] lg:absolute lg:left-1/2 lg:top-1/2 lgmt-0 lg:w-[17.5rem] lg:-translate-x-1/2 lg:-translate-y-1/2">
            <span className="text-[0.72rem] font-bold uppercase tracking-[0.32em] text-[#dff9fc]">
              Central Data Core
            </span>
            <span className="mt-3 text-2xl font-extrabold text-white lg:text-[2rem]">
              Plus Data
            </span>
            <span className="mt-1 text-sm text-[#d7f7fb]">
              Programs, skills, outcomes and growth paths connected
            </span>
          </div>

          <div className="relative z-10 mt-2 grid grid-cols-2 gap-3 lg:absolute lg:bottom-4 lg:left-1/2 lg:w-[28rem] lg:-translate-x-1/2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#8be0ec]/35 bg-white/10 px-3 py-3 text-center backdrop-blur-sm"
              >
                <p className="text-xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#cfeff4]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroEcosystemGraphic;
