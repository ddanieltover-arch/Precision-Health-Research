import React from 'react';

export const ResearchStandardSection: React.FC = () => {
  const standards = [
    {
      id: 'verified-purity',
      title: 'VERIFIED PURITY',
      desc: '99%+ purity guaranteed through rigorous third-party analysis and batch-level testing.',
    },
    {
      id: 'batch-testing',
      title: 'ANALYTICAL TESTING',
      desc: 'High-performance liquid chromatography and mass spectrometry validation across all synthesis lots.',
    },
    {
      id: 'secure-operations',
      title: 'SECURE OPERATIONS',
      desc: 'Protected payment systems and data encryption to safeguard institutional procurement.',
    },
    {
      id: 'expert-support',
      title: 'EXPERT SUPPORT',
      desc: 'Direct access to research specialists for technical inquiries and logistics coordination.',
    },
    {
      id: 'fast-logistics',
      title: 'FAST LOGISTICS',
      desc: 'Same-day or next-day dispatch on most orders to keep your laboratory on schedule.',
    },
    {
      id: 'research-only',
      title: 'RESEARCH ONLY',
      desc: 'A dedicated platform built exclusively for the scientific and educational community.',
    },
  ];

  return (
    <section className="bg-[#080d1a] py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display uppercase">
            THE RESEARCH STANDARD
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Consistent quality, transparent documentation, and global logistics expertise.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standards.map((item) => (
            <div
              key={item.id}
              className="bg-[#101828]/90 rounded-2xl p-7 sm:p-8 border border-slate-800/80 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-start space-y-3"
            >
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight uppercase">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
