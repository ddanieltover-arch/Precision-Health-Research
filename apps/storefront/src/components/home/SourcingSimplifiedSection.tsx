import React from 'react';

export const SourcingSimplifiedSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'BROWSE CATALOG',
      desc: 'Explore high-purity peptides and compounds organized by scientific category.',
    },
    {
      num: '02',
      title: 'SECURE CHECKOUT',
      desc: 'Complete your procurement with encrypted payments and real-time stock verification.',
    },
    {
      num: '03',
      title: 'QUALITY REVIEW',
      desc: 'Every order undergoes a final quality check and documentation review before dispatch.',
    },
    {
      num: '04',
      title: 'RAPID DISPATCH',
      desc: 'Tracked, insured, and discrete shipping ensures your research continues without delay.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-[#0f1d2f] tracking-tight font-display uppercase">
          SOURCING SIMPLIFIED
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          A streamlined procurement process designed for the modern research environment.
        </p>
      </div>

      {/* 4 Process Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className="relative bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#335e90]/40 transition-all flex flex-col justify-between"
          >
            {/* Step Number Top Right */}
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-black text-slate-900 tracking-tight leading-snug uppercase max-w-[140px]">
                {step.title}
              </h3>
              <span className="text-3xl sm:text-4xl font-black text-slate-200/80 font-display select-none -mt-1">
                {step.num}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed mt-6">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
