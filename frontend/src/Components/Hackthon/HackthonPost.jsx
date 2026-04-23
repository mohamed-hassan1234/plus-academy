import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../utils/api";
import SectionHeader from "../Immersive/SectionHeader";
import TiltCard from "../Immersive/TiltCard";

function HackthonPost() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch(apiUrl("/api/hackathons"));
        const data = await response.json();

        if (
          response.ok &&
          data.success &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setHackathons(data.data);
        }
      } catch (error) {
        console.error("Error fetching hackathons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  return (
    <section className="immersive-section">
      <div className="immersive-container">
        <div className="mb-10 grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <SectionHeader align="left" eyebrow="PlusAcademy Hackathons" title="Hackathons aan qabannay">
            Boggan waxaa ka muuqda qaar ka mid ah hackathon-nada aan ku
            qabannay PlusAcademy si aan ardayda ugu dhiirrigelino innovation, teamwork
            iyo xalinta dhibaatooyinka dhabta ah.
          </SectionHeader>

          <div className="cinematic-panel p-4 text-sm text-white/64" data-cinematic>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#00A99D] text-sm font-semibold text-white">
                3+
              </span>
              <div>
                <p className="font-medium text-white">Hackathons la qabtay</p>
                <p className="text-xs text-white/52">
                  Isku-darka coding, design & business.
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="cinematic-panel p-8 text-sm text-white/62">Loading hackathons...</div>
        ) : hackathons.length === 0 ? (
          <div className="cinematic-panel p-8 text-sm text-white/62">
            Weli hackathon lama darin. Fadlan isticmaal dashboard-ka si aad u
            abuurto hackathon cusub.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-stagger>
            {hackathons.map((hack) => {
              const id = hack._id;
              const firstImage =
                hack.images && hack.images.length > 0 ? hack.images[0] : null;
              const formattedDate = hack.date
                ? new Date(hack.date).toLocaleDateString()
                : "";
              const registrationOpen = hack.registrationOpen !== false;

              return (
                <TiltCard key={id} className="flex min-h-full flex-col" data-stagger-item>
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="image-mask-reveal h-44 bg-white/6">
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt={hack.title}
                        />
                      ) : (
                        <div className="grid h-full place-items-center bg-[#0B3D73]/30 text-[#4FFFEA]">
                          Innovation Lab
                        </div>
                      )}
                    </div>

                    <div className="flex h-full flex-col p-5">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="flex items-center gap-1.5 text-xs text-white/50">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4FFFEA]" />
                          {formattedDate}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg border border-[#4FFFEA]/22 bg-[#4FFFEA]/10 px-3 py-1 text-[11px] text-[#4FFFEA]">
                            {hack.location}
                          </span>
                          <span
                            className={`rounded-lg px-3 py-1 text-[11px] ${
                              registrationOpen
                                ? "border border-emerald-300/35 bg-emerald-400/10 text-emerald-200"
                                : "border border-amber-300/35 bg-amber-400/10 text-amber-200"
                            }`}
                          >
                            {registrationOpen ? "Open" : "Closed"}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-[#4FFFEA] md:text-xl">
                        {hack.title}
                      </h2>
                      <p className="mt-3 text-xs leading-relaxed text-white/62 md:text-sm">
                        {hack.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-[11px] text-white/48">
                        <span>Demo Day & Pitch Session</span>
                        <Link
                          to={`/hackathons/${id}`}
                          className="text-xs font-medium text-[#4FFFEA] underline-offset-2 hover:underline"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default HackthonPost;
