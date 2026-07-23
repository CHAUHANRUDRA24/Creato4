import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { WORK_PROJECTS } from '../data';
import { WorkProject } from '../types';

interface SelectedWorkProps {
  onSelectProject: (project: WorkProject) => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ onSelectProject }) => {
  const featuredProject = WORK_PROJECTS.find((p) => p.featured) || WORK_PROJECTS[0];
  const otherProjects = WORK_PROJECTS.filter((p) => p.id !== featuredProject.id);

  return (
    <section id="work" className="py-20 lg:py-32 bg-[#FAF8F5] border-b border-[#E8E2D9] px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-[0.75rem] uppercase font-bold tracking-[0.2em] text-[#5C6B60] block mb-3">
            SELECTED ENGINEERING WORK
          </span>
          <h2 className="heading-h1 text-[#1A3C2F] font-extrabold tracking-tight">
            THINGS WE’VE ACTUALLY BUILT
          </h2>
        </div>

        {/* Featured Card (Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onSelectProject(featuredProject)}
          className="group relative w-full h-[480px] lg:h-[560px] bg-[#F5F0EA] rounded-[24px] overflow-hidden mb-8 border border-[#E8E2D9] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
        >
          {/* Background Image */}
          <img
            src={featuredProject.image}
            alt={featuredProject.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C2F]/90 via-[#1A3C2F]/40 to-transparent transition-opacity duration-300 group-hover:from-[#1A3C2F]/95" />

          {/* Badge */}
          {featuredProject.badge && (
            <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-[#C4A35A] text-[#1A3C2F] text-[0.75rem] font-bold uppercase tracking-wider shadow-md">
              {featuredProject.badge}
            </div>
          )}

          {/* Content overlay bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-[#FAF8F5] transform transition-transform duration-300 group-hover:-translate-y-1">
            <div className="flex flex-wrap items-center gap-2 mb-3 text-[0.75rem] font-medium opacity-90">
              {featuredProject.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span>{tag}</span>
                  {idx < featuredProject.tags.length - 1 && <span className="text-[#C4A35A]">·</span>}
                </React.Fragment>
              ))}
            </div>

            <h3 className="text-3xl lg:text-5xl font-extrabold mb-3 text-[#FAF8F5] tracking-tight">
              {featuredProject.title}
            </h3>

            <p className="text-sm lg:text-base text-[#FAF8F5]/80 max-w-2xl mb-6 line-clamp-2">
              {featuredProject.description}
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FAF8F5] group-hover:text-[#C4A35A] transition-colors">
              <span>View Case Study</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </div>
        </motion.div>

        {/* 3-Column Grid for Cards 2-4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelectProject(project)}
              className="group relative bg-[#F5F0EA] rounded-[20px] overflow-hidden border border-[#E8E2D9] shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between h-[420px]"
            >
              {/* Image */}
              <div className="relative w-full h-[220px] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {project.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#C4A35A] text-[#1A3C2F] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    {project.badge}
                  </div>
                )}
              </div>

              {/* Content Overlay */}
              <div className="p-6 bg-[#FAF8F5] flex-1 flex flex-col justify-between border-t border-[#E8E2D9]">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#5C6B60] mb-2 line-clamp-1">
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold text-[#1A3C2F] mb-2 group-hover:text-[#234B3C] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#5C6B60] line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A3C2F] group-hover:text-[#C4A35A]">
                  <span>Explore Project</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
