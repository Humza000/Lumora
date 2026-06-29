import React from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { projects } from "@/data/projects";

export default function CaseStudy() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="text-white/40 text-lg mb-4">Project not found.</p>
          <button
            onClick={() => setLocation("/portfolio")}
            className="text-primary hover:underline"
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setLocation("/portfolio")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            data-testid="btn-back-portfolio"
          >
            <ArrowLeft size={16} />
            All Projects
          </button>
          <span className="font-serif font-bold text-xl text-primary">Lumora</span>
          <button
            onClick={() => setLocation("/")}
            className="text-sm font-medium bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full transition-colors"
            data-testid="btn-get-quote-nav"
          >
            Get a Quote
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 relative overflow-hidden">
        <div className={`w-full h-[55vh] min-h-[400px] bg-gradient-to-br ${project.heroGradient} relative flex items-end`}>
          <div className="absolute inset-0 bg-black/30" />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="container mx-auto px-4 md:px-8 pb-12 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-xs font-medium tracking-widest uppercase text-white/60 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full mb-4">
                {project.category} · {project.industry}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-tight">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Overview card */}
        <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-3">Project Overview</p>
                <p className="text-white/80 text-lg leading-relaxed">{project.shortDescription}</p>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Industry</p>
                  <p className="text-white font-medium">{project.industry}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Key Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.badges.map((b) => (
                      <span key={b} className="text-xs text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results bar */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {project.results.map((r, i) => (
              <div
                key={r.label}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 text-center"
                data-testid={`stat-result-${i}`}
              >
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">{r.value}</p>
                <p className="text-white/40 text-xs leading-snug">{r.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Challenge + Solution */}
      <section className="py-8 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-8"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                <TrendingUp size={18} className="text-red-400 rotate-180" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mb-4">The Challenge</h2>
              <p className="text-white/60 leading-relaxed">{project.challenge}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-8"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <TrendingUp size={18} className="text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mb-4">The Solution</h2>
              <p className="text-white/60 leading-relaxed">{project.solution}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-primary text-xs uppercase tracking-widest font-medium mb-2">What We Built</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Key Features</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.keyFeatures.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 bg-white/[0.03] border border-white/8 rounded-xl p-5"
                data-testid={`feature-${i}`}
              >
                <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm leading-relaxed">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-primary text-xs uppercase tracking-widest font-medium mb-2">Visual Preview</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Gallery</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.galleryGradients.map((grad, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-testid={`gallery-image-${i}`}
                className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${grad} relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2">
                    <div className="h-1.5 bg-white/30 rounded w-3/4 mb-1.5" />
                    <div className="h-1.5 bg-white/20 rounded w-1/2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-primary text-xs uppercase tracking-widest font-medium mb-2">Under the Hood</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Technologies Used</h2>
          </motion.div>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                data-testid={`tech-badge-${i}`}
                className="text-sm font-medium text-white/70 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:border-primary/40 hover:text-white transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <p className="text-primary text-xs uppercase tracking-widest font-medium mb-4">Start Your Project</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Want results like these?
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-lg mx-auto">
              Let's talk about your project. We'll put together a tailored proposal within 48 hours — no obligation.
            </p>
            <button
              onClick={() => setLocation("/")}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 text-base"
              data-testid="btn-cta-quote"
            >
              Request a Free Quote <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Prev / Next */}
      {(prevProject || nextProject) && (
        <section className="py-12 border-t border-white/5">
          <div className="container mx-auto px-4 md:px-8 flex justify-between gap-4">
            {prevProject ? (
              <button
                onClick={() => setLocation(`/portfolio/${prevProject.slug}`)}
                className="flex items-center gap-3 text-left group"
                data-testid="btn-prev-project"
              >
                <ArrowLeft size={18} className="text-white/30 group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-0.5">Previous</p>
                  <p className="text-white font-medium group-hover:text-primary transition-colors">
                    {prevProject.title}
                  </p>
                </div>
              </button>
            ) : <div />}
            {nextProject ? (
              <button
                onClick={() => setLocation(`/portfolio/${nextProject.slug}`)}
                className="flex items-center gap-3 text-right group"
                data-testid="btn-next-project"
              >
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-0.5">Next</p>
                  <p className="text-white font-medium group-hover:text-primary transition-colors">
                    {nextProject.title}
                  </p>
                </div>
                <ArrowRight size={18} className="text-white/30 group-hover:text-primary transition-colors" />
              </button>
            ) : <div />}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <span className="font-serif font-bold text-white/60">Lumora</span>
          <span>© {new Date().getFullYear()} Lumora. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
