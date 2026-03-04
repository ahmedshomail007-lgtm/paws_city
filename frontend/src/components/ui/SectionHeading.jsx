const SectionHeading = ({ title, subtitle, centered = false }) => {
  return (
    <div
      className={`mb-12 ${centered ? "text-center" : "text-left"}`}
    >
      <h2
        className={`
          relative inline-block text-[2.5rem] md:text-2xl mb-4 
          after:content-[''] after:absolute after:-bottom-2 after:h-[3px] after:w-20 after:bg-primary 
          ${centered ? "after:left-1/2 after:-translate-x-1/2" : "after:left-0"}
        `}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`
            text-[1.125rem] text-textLight mt-6 
            ${centered ? "max-w-[600px] mx-auto" : ""}
          `}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
