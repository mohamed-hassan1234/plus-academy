import SectionHeader from "../Immersive/SectionHeader";

function Choose() {
  const reasons = [
    {
      id: 1,
      title: "Modern Tech Stack",
      description:
        "Learn the same tools used by high-growth startups and global tech companies.",
      icon: "DEV",
      highlight: "Hands-on projects & real code reviews.",
    },
    {
      id: 2,
      title: "Continuous Learning",
      description:
        "Always-updated curriculum so you stay aligned with industry trends and best practices.",
      icon: "UP",
      highlight: "Weekly workshops & community support.",
    },
    {
      id: 3,
      title: "Career Launch",
      description:
        "From CV to portfolio to interviews, we guide you until you land real opportunities.",
      icon: "GO",
      highlight: "Career coaching, mock interviews & referrals.",
    },
  ];

  return (
    <section className="plus-home-section" data-section-word="Future">
      <div className="immersive-container">
        <SectionHeader eyebrow="Why Choose Our Academy" title="Experience Future-Ready Tech Education">
          We blend practical skills, mentorship, and career support to help you
          move from beginner to job-ready with confidence.
        </SectionHeader>

        <div className="plus-card-grid plus-card-grid--three plus-card-grid--depth">
          {reasons.map((reason, index) => (
            <article
              key={reason.id}
              className="plus-floating-card"
              style={{ "--card-delay": `${index * 0.1}s`, "--card-index": index }}
              data-home-depth-card
              data-depth={index + 1}
            >
              <div className="plus-floating-card__shine" aria-hidden="true" />
              <div className="plus-floating-card__top">
                <span className="plus-floating-card__icon">{reason.icon}</span>
              </div>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
              <span className="plus-floating-card__highlight">{reason.highlight}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Choose;
