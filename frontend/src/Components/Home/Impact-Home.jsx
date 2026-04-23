import SectionHeader from "../Immersive/SectionHeader";

function ImpactHome() {
  const stats = [
    {
      id: 1,
      label: "Graduates",
      value: "500+",
      description: "Tech professionals trained",
      icon: "GR",
    },
    {
      id: 2,
      label: "Coding Bootcamps",
      value: "9",
      description: "Specialized tech programs",
      icon: "</>",
    },
    {
      id: 3,
      label: "Campuses",
      value: "1",
      description: "State-of-the-art facilities",
      icon: "PA",
    },
    {
      id: 4,
      label: "Tech Events",
      value: "15",
      description: "Industry networking",
      icon: "EV",
    },
  ];

  return (
    <section className="plus-home-section" data-section-word="Impact">
      <div className="immersive-container">
        <SectionHeader eyebrow="Our Impact" title="Our Impact">
          Transforming lives through technology education and innovation.
        </SectionHeader>

        <div className="plus-card-grid plus-card-grid--four plus-card-grid--depth">
          {stats.map((item, index) => (
            <article
              key={item.id}
              className="plus-floating-card"
              style={{ "--card-delay": `${index * 0.08}s`, "--card-index": index }}
              data-home-depth-card
              data-depth={index + 1}
            >
              <div className="plus-floating-card__shine" aria-hidden="true" />
              <div className="plus-floating-card__top">
                <span className="plus-floating-card__icon">{item.icon}</span>
                <strong>{item.value}</strong>
              </div>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactHome;
