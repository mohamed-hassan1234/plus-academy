import { useEffect, useState } from "react";
import { apiUrl } from "../../utils/api";
import { fetchAlumniCollection } from "../../utils/alumniApi";
import SectionHeader from "../Immersive/SectionHeader";
import TiltCard from "../Immersive/TiltCard";

function Alumni1() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setErrorMessage("");
        const result = await fetchAlumniCollection();
        setAlumni(result.data || []);
        setUsingFallback(result.source === "local");
      } catch (error) {
        console.error("Error fetching alumni:", error);
        setErrorMessage(error.message || "Could not load alumni right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  useEffect(() => {
    if (alumni.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % alumni.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [alumni.length]);

  const resolveImageSrc = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    if (/^(https?:\/\/|data:|blob:)/i.test(imagePath)) {
      return imagePath;
    }

    const normalizedPath = String(imagePath).replace(/\\/g, "/").trim();

    if (normalizedPath.startsWith("/uploads/")) {
      return apiUrl(normalizedPath);
    }

    if (normalizedPath.startsWith("uploads/")) {
      return apiUrl(`/${normalizedPath}`);
    }

    return apiUrl(`/uploads/alumni/${normalizedPath.split("/").pop()}`);
  };

  return (
    <section className="immersive-section">
      <div className="immersive-container">
        <SectionHeader eyebrow="Alumni Success" title="Meet Our Graduates">
          From bootcamp to the global tech industry, our alumni are building
          products, leading teams, and inspiring the next generation of Somali
          technologists.
        </SectionHeader>

        {loading ? (
          <div className="cinematic-panel mx-auto max-w-3xl p-8 text-center text-sm text-white/62">
            Loading alumni...
          </div>
        ) : errorMessage ? (
          <div className="cinematic-panel mx-auto max-w-3xl border-amber-300/40 p-8 text-center text-sm text-amber-200">
            {errorMessage}
          </div>
        ) : alumni.length === 0 ? (
          <div className="cinematic-panel mx-auto max-w-3xl p-8 text-center text-sm text-white/62">
            No alumni added yet. Use the dashboard alumni tab to add your first alumni profile.
          </div>
        ) : (
          <>
            {usingFallback && (
              <div className="cinematic-panel mx-auto mb-6 max-w-5xl border-amber-300/40 px-6 py-4 text-center text-sm text-amber-200">
                Live alumni API is not available yet. Showing alumni saved in this browser.
              </div>
            )}

            <div className="relative mx-auto mb-8 max-w-5xl overflow-hidden" data-cinematic>
              <div className="cinematic-panel p-5 md:p-7">
                <div className="grid items-center gap-7 md:grid-cols-[18rem_1fr]">
                  <div className="image-mask-reveal aspect-square bg-white/6">
                    <img
                      src={resolveImageSrc(alumni[activeIndex]?.image)}
                      alt={alumni[activeIndex]?.name}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-semibold text-[#4FFFEA]">
                      PlusAcademy Alumni
                    </p>
                    <h2 className="text-3xl font-bold text-white">
                      {alumni[activeIndex]?.name}
                    </h2>
                    <p className="mt-3 text-lg text-white/72">
                      {alumni[activeIndex]?.role}
                    </p>
                    <span className="mt-5 inline-flex rounded-lg border border-[#4FFFEA]/22 bg-[#4FFFEA]/10 px-4 py-2 text-sm font-semibold text-[#4FFFEA]">
                      {alumni[activeIndex]?.course}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" data-stagger>
              {alumni.map((person, index) => (
                <TiltCard
                  key={person._id || person.name}
                  className={`cursor-pointer p-5 ${index === activeIndex ? "border-[#4FFFEA]/60" : ""}`}
                  data-stagger-item
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                    <div className="image-mask-reveal h-24 w-24 rounded-lg bg-white/8">
                      <img
                        src={resolveImageSrc(person.image)}
                        alt={person.name}
                        className="rounded-lg"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="mb-1 text-base font-semibold text-white md:text-lg">
                        {person.name}
                      </h3>
                      <p className="mb-2 text-xs text-white/62 md:text-sm">
                        {person.role}
                      </p>
                      <span className="inline-block rounded-lg border border-[#00A99D]/22 bg-[#00A99D]/12 px-2.5 py-1 text-[11px] font-medium text-[#4FFFEA]">
                        {person.course}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Alumni1;
