import React, { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowRight, ArrowLeft } from "lucide-react";
import { projects, categories, type Category } from "@/data/projects";

export default function Portfolio() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Nav back */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
            data-testid="btn-back-home"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <span className="font-serif font-bold text-xl text-primary">Lumora</span>
          <button
            onClick={() => setLocation("/#quote")}
            className="text-sm font-medium bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full transition-colors"
            data-testid="btn-get-quote-nav"
          >
            Get a Quote
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">Our Work</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Websites That{" "}
              <span className="italic text-primary">Actually</span>{" "}
              Perform.
            </h1>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl">
              Every project here started with a real business problem and ended with a measurable result. Browse our work and see what we can do for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="pb-10 sticky top-16 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search projects…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/60 transition-colors"
              data-testid="input-search"
            />
          </div>
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat.toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-white/40"
            >
              <p className="text-xl">No projects match your search.</p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-4 text-primary text-sm hover:underline">
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  data-testid={`card-project-${project.id}`}
                  className="group relative bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
                  onClick={() => setLocation(`/portfolio/${project.slug}`)}
                >
                  {/* Image placeholder */}
                  <div className={`h-52 w-full bg-gradient-to-br ${project.heroGradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-2xl font-bold text-white/20 tracking-widest uppercase">
                        {project.title.split(" ")[0]}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    {/* Glassmorphism overlay on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-xs font-medium text-white/70 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-1">
                      {project.industry}
                    </p>
                    <h2 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-5 line-clamp-2">
                      {project.shortDescription}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.badges.slice(0, 3).map((badge) => (
                        <span
                          key={badge}
                          className="text-xs font-medium text-white/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md"
                        >
                          {badge}
                        </span>
                      ))}
                      {project.badges.length > 3 && (
                        <span className="text-xs font-medium text-white/30 px-2 py-1">
                          +{project.badges.length - 3}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-200">
                      View Case Study
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to be our next case study?
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
              Tell us about your project and we'll come back with a plan.
            </p>
            <button
              onClick={() => setLocation("/")}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 text-base"
              data-testid="btn-get-quote-bottom"
            >
              Get a Free Quote <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

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
