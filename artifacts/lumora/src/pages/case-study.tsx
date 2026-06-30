import React, { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { projects } from "@/data/projects";
import { usePageMeta } from "@/hooks/use-page-meta";

function CaseStudyNotFound({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");
    meta.setAttribute("data-dynamic", "true");
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1714] flex items-center justify-center font-sans">
      <div className="text-center px-6">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-[#1a1714] mb-2">Project not found</h1>
        <p className="text-[#9c9590] mb-8">This case study doesn't exist or may have been removed.</p>
        <button
          onClick={onBack}
          className="inline-block bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          View all projects
        </button>
      </div>
    </div>
  );
}

export default function CaseStudy() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const project = projects.find((p) => p.slug === params.slug);

  usePageMeta({
    title: project ? `${project.title} — Lumora Portfolio` : "Case Study — Lumora",
    description: project
      ? project.shortDescription
      : "Explore this Lumora case study — premium web design and development for ambitious brands.",
    ogTitle: project ? `${project.title} — Case Study | Lumora` : "Case Study — Lumora",
    ogDescription: project ? project.shortDescription : undefined,
    canonical: project ? `/portfolio/${project.slug}` : undefined,
  });

  if (!project) {
    return <CaseStudyNotFound onBack={() => setLocation("/portfolio")} />;
  }

  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1714] font-sans">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#faf9f6]/95 backdrop-blur-md border-b border-[#e8e3db]">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setLocation("/portfolio")}
            className="flex items-center gap-2 text-[#9c9590] hover:text-[#1a1714] transition-colors text-sm"
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
          <div className="absolute inset-0 bg-black/25" />
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
              <span className="inline-block text-xs font-medium tracking-widest uppercase text-white/70 bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1 rounded-full mb-4">
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
            className="bg-white border border-[#e8e3db] rounded-2xl p-8 md:p-10 shadow-lg shadow-black/5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-[#9c9590] text-xs uppercase tracking-widest font-medium mb-3">Project Overview</p>
                <p className="text-[#1a1714] text-lg leading-relaxed">{project.shortDescription}</p>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[#9c9590] text-xs uppercase tracking-widest mb-1">Industry</p>
                  <p className="text-[#1a1714] font-medium">{project.industry}</p>
                </div>
                <div>
                  <p className="text-[#9c9590] text-xs uppercase tracking-widest mb-2">Key Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.badges.map((b) => (
                      <span key={b} className="text-xs text-[#6b6560] bg-[#f0ede8] border border-[#e8e3db] px-2.5 py-1 rounded-md">
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
                className="bg-white border border-[#e8e3db] rounded-2xl p-6 text-center shadow-sm"
                data-testid={`stat-result-${i}`}
              >
                <p className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">{r.value}</p>
                <p className="text-[#9c9590] text-xs leading-snug">{r.label}</p>
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
              className="bg-white border border-[#e8e3db] rounded-2xl p-8 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
                <TrendingUp size={18} className="text-red-400 rotate-180" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1a1714] mb-4">The Challenge</h2>
              <p className="text-[#6b6560] leading-relaxed">{project.challenge}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-[#e8e3db] rounded-2xl p-8 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-5">
                <TrendingUp size={18} className="text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1a1714] mb-4">The Solution</h2>
              <p className="text-[#6b6560] leading-relaxed">{project.solution}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 border-t border-[#e8e3db]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-primary text-xs uppercase tracking-widest font-medium mb-2">What We Built</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a1714]">Key Features</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.keyFeatures.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 bg-white border border-[#e8e3db] rounded-xl p-5 shadow-sm"
                data-testid={`feature-${i}`}
              >
                <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-[#6b6560] text-sm leading-relaxed">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 border-t border-[#e8e3db]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-primary text-xs uppercase tracking-widest font-medium mb-2">Visual Preview</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a1714]">Gallery</h2>
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
                className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${grad} relative overflow-hidden group border border-[#e8e3db]`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2">
                    <div className="h-1.5 bg-white/40 rounded w-3/4 mb-1.5" />
                    <div className="h-1.5 bg-white/25 rounded w-1/2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 border-t border-[#e8e3db]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-primary text-xs uppercase tracking-widest font-medium mb-2">Under the Hood</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1a1714]">Technologies Used</h2>
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
                className="text-sm font-medium text-[#6b6560] bg-white border border-[#e8e3db] px-4 py-2 rounded-full hover:border-primary/40 hover:text-primary transition-colors cursor-default shadow-sm"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#e8e3db]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-purple-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <p className="text-white/60 text-xs uppercase tracking-widest font-medium mb-4">Start Your Project</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Want results like these?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
              Let's talk about your project. We'll put together a tailored proposal within 48 hours — no obligation.
            </p>
            <button
              onClick={() => setLocation("/")}
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-primary font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 text-base shadow-lg"
              data-testid="btn-cta-quote"
            >
              Request a Free Quote <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Prev / Next */}
      {(prevProject || nextProject) && (
        <section className="py-12 border-t border-[#e8e3db]">
          <div className="container mx-auto px-4 md:px-8 flex justify-between gap-4">
            {prevProject ? (
              <button
                onClick={() => setLocation(`/portfolio/${prevProject.slug}`)}
                className="flex items-center gap-3 text-left group"
                data-testid="btn-prev-project"
              >
                <ArrowLeft size={18} className="text-[#9c9590] group-hover:text-primary transition-colors" />
                <div>
                  <p className="text-[#9c9590] text-xs uppercase tracking-widest mb-0.5">Previous</p>
                  <p className="text-[#1a1714] font-medium group-hover:text-primary transition-colors">
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
                  <p className="text-[#9c9590] text-xs uppercase tracking-widest mb-0.5">Next</p>
                  <p className="text-[#1a1714] font-medium group-hover:text-primary transition-colors">
                    {nextProject.title}
                  </p>
                </div>
                <ArrowRight size={18} className="text-[#9c9590] group-hover:text-primary transition-colors" />
              </button>
            ) : <div />}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#e8e3db] py-8 bg-[#f5f2ed]">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[#9c9590] text-sm">
          <span className="font-serif font-bold text-[#6b6560]">Lumora</span>
          <span>© {new Date().getFullYear()} Lumora. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
