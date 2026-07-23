import React from 'react';
import { motion } from 'motion/react';
import { TEAM_MEMBERS } from '../data';

export const TeamSection: React.FC = () => {
  return (
    <section id="team" className="py-20 lg:py-32 bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 lg:px-12">
      <div className="max-w-[1200px] mx-auto text-center">
        
        {/* Header */}
        <div>
          <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#5C6B60] block mb-3">
            THE PEOPLE BEHIND THE WORK
          </span>
          <h2 className="heading-h1 text-[#1A3C2F] font-extrabold tracking-tight">
            MEET THE TEAM
          </h2>
        </div>

        {/* 4 Member Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mt-16 max-w-[1000px] mx-auto">
          {TEAM_MEMBERS.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: 'easeOut' }}
              className="group flex flex-col items-center text-center p-6 rounded-3xl bg-[#F5F0EA] border border-[#E8E2D9] hover:border-[#1A3C2F] transition-all duration-300 hover:-translate-y-1.5 shadow-xs hover:shadow-xl"
            >
              {/* Avatar Circle 120px */}
              <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-[#1A3C2F] text-[#FAF8F5] flex items-center justify-center text-2xl lg:text-3xl font-extrabold tracking-wider shadow-md group-hover:scale-105 group-hover:bg-[#234B3C] transition-all duration-300 border-2 border-[#FAF8F5]">
                {member.initials}
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-[#1A3C2F] mt-6 group-hover:text-[#234B3C] transition-colors">
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-xs font-semibold text-[#5C6B60] mt-2 leading-snug">
                {member.role}
              </p>

              {/* Bio */}
              <p className="text-xs text-[#5C6B60]/80 mt-3 leading-relaxed line-clamp-3">
                {member.bio}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                {member.tags.slice(0, 3).map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 rounded-full border border-[#E8E2D9] bg-[#FAF8F5] text-[10px] font-semibold text-[#5C6B60]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
