import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl } from "../../utils/api";
import MagneticButton from "../Immersive/MagneticButton";
import PublicPage from "../Immersive/PublicPage";

function HackthonDetails() {
  const { id } = useParams();
  const [hack, setHack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await fetch(
          apiUrl(`/api/hackathons/${id}`)
        );
        const data = await response.json();

        if (response.ok && data.success) {
          setHack(data.data);
        }
      } catch (error) {
        console.error("Error fetching hackathon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  if (loading) {
    return (
      <PublicPage className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-white/60 md:text-base">
          Loading hackathon details...
        </p>
      </PublicPage>
    );
  }

  if (!hack) {
    return (
      <PublicPage className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-xl space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-white md:text-3xl">
            Hackathon lama helin
          </h1>
          <p className="text-sm text-white/64 md:text-base">
            Ma helin hackathon leh ID-ga aad isku dayday in aad furto. Fadlan
            kusoo noqo liiska hackathon-nada.
          </p>
          <MagneticButton to="/hackathons">Back to Hackathons</MagneticButton>
        </div>
      </PublicPage>
    );
  }

  const formattedDate = hack.date
    ? new Date(hack.date).toLocaleDateString()
    : "";
  const registrationOpen = hack.registrationOpen !== false;

  return (
    <PublicPage className="min-h-screen py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6 md:px-10 lg:px-0">
        <div className="mb-6 flex items-center gap-2 text-xs text-white/46 md:text-sm" data-cinematic>
          <Link to="/hackathons" className="transition-colors hover:text-[#4FFFEA]">
            Hackathons
          </Link>
          <span>/</span>
          <span className="line-clamp-1 text-white/66">{hack.title}</span>
        </div>

        <section className="cinematic-panel relative mb-10 overflow-hidden" data-cinematic>
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="text-xs uppercase text-[#4FFFEA]">
                  PlusAcademy Hackathon
                </p>
                <h1 className="text-2xl font-semibold leading-tight text-white md:text-3xl">
                  {hack.title}
                </h1>
                <p className="text-sm leading-relaxed text-white/64 md:text-base">
                  {hack.description}
                </p>
              </div>

              <div className="min-w-[220px] shrink-0 space-y-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs md:text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/50">Date</span>
                  <span className="font-medium text-white">{formattedDate}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/50">Location</span>
                  <span className="font-medium text-white">
                    {hack.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {hack.images && hack.images.length > 0 && (
          <section className="mb-10" data-cinematic>
            <h2 className="mb-4 text-lg font-semibold text-white md:text-xl">
              Muuqaallo ka socda hackathon-ka
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {hack.images.slice(0, 4).map((src, index) => (
                <div
                  key={src}
                  className="image-mask-reveal cinematic-panel h-44"
                >
                  <img
                    src={src}
                    alt={`${hack.title} team photo ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="grid items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <div className="space-y-5" data-cinematic>
            <h2 className="text-lg font-semibold text-white md:text-xl">
              Faahfaahinta hackathon-kan
            </h2>
            <p className="text-sm leading-relaxed text-white/64 md:text-base">
              {hack.details}
            </p>
          </div>

          <aside className="space-y-4">
            <div className="cinematic-panel px-5 py-4" data-cinematic>
              <p className="mb-2 text-sm font-semibold text-white">
                Ma xiisaynaysaa hackathon-ka xiga?
              </p>
              <p className="mb-4 text-xs text-white/62 md:text-sm">
                Buuxi form-ka si aad ugu biirto hackathon-kan. Waxaan kaa
                weydiin doonaa magacaaga, meesha aad dagan tahay, email-ka,
                waxbarashadaada, iyo haddii aad haysato computer.
              </p>
              {registrationOpen ? (
                <MagneticButton to={`/hackathons/${hack._id}/register`} className="w-full">
                  Join this hackathon
                </MagneticButton>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-xs text-amber-200 md:text-sm">
                    Registration for this hackathon has ended.
                  </div>
                  <button
                    type="button"
                    disabled
                    className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-white/12 px-4 py-2.5 text-xs font-medium text-white/42 md:text-sm"
                  >
                    Registration closed
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 rounded-lg border border-dashed border-[#4FFFEA]/22 bg-white/5 px-5 py-4 text-xs text-white/62 md:text-sm" data-cinematic>
              <p className="font-semibold text-white">
                Macallin / Partner mise Sponsor?
              </p>
              <p>
                Haddii aad rabto in aad nala shaqayso hackathon-nada xiga sida
                mentor, judge ama sponsor, fadlan nala soo xiriir.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 text-xs text-[#4FFFEA] hover:text-white md:text-sm"
              >
                Contact PlusAcademy
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </PublicPage>
  );
}

export default HackthonDetails;
