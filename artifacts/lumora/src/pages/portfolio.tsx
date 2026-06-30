import React, { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, ArrowRight, ArrowLeft } from "lucide-react";
import { projects, categories, type Category } from "@/data/projects";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useStructuredData } from "@/hooks/use-structured-data";

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  usePageMeta({
    title: "Portfolio — Lumora Agency",
    description:
      "Browse Lumora's portfolio of premium web design and development projects across business, e-commerce, healthcare, trades, and restaurants.",
    ogTitle: "Portfolio — Lumora Agency",
    ogDescription:
      "Explore our portfolio of premium web experiences — from gym membership portals to luxury e-commerce storefronts and local trade websites.",
    canonical: "/portfolio",
  });

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  useStructuredData([
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": origin + "/" },
        { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": origin + "/portfolio" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Portfolio — Lumora Agency",
      "description": "Browse Lumora's portfolio of premium web design and development projects across business, e-commerce, healthcare, trades, and restaurants.",
      "url": origin + "/portfolio",
    },
  ]);

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
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1714] font-sans">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#faf9f6]/95 backdrop-blur-md border-b border-[#e8e3db]">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#9c9590] hover:text-[#1a1714] transition-colors text-sm"
            data-testid="btn-back-home"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <Link href="/" className="font-serif font-bold text-xl text-primary">Lumora</Link>
          <a
            href="/#quote"
            className="text-sm font-medium bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full transition-colors"
            data-testid="btn-get-quote-nav"
          >
            Get a Quote
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">Our Work</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#1a1714] leading-tight mb-6">
              Websites That{" "}
              <span className="italic text-primary">Actually</span>{" "}
              Perform.
            </h1>
            <p className="text-[#6b6560] text-lg md:text-xl leading-relaxed max-w-2xl">
              Every project here started with a real business problem and ended with a measurable result. Browse our work and see what we can do for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="sticky top-16 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-[#e8e3db]">
        <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9c9590]" />
            <input
              type="text"
              placeholder="Search projects…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#e8e3db] rounded-full pl-9 pr-4 py-2.5 text-sm text-[#1a1714] placeholder-[#9c9590] focus:outline-none focus:border-primary/50 transition-colors"
              data-testid="input-search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat.toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white text-[#6b6560] hover:bg-[#f0ede8] hover:text-[#1a1714] border border-[#e8e3db]"
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
              className="text-center py-24 text-[#9c9590]"
            >
              <p className="text-xl">No projects match your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="mt-4 text-primary text-sm hover:underline"
              >
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
                >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="group relative bg-white border border-[#e8e3db] rounded-2xl overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 block"
                >
                  {/* Image */}
                  <div className={`h-52 w-full bg-gradient-to-br ${project.heroGradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-2xl font-bold text-white/20 tracking-widest uppercase">
                        {project.title.split(" ")[0]}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-xs font-medium text-white/90 bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-[#9c9590] text-xs uppercase tracking-widest font-medium mb-1">
                      {project.industry}
                    </p>
                    <h2 className="font-serif text-xl font-bold text-[#1a1714] mb-3 group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h2>
                    <p className="text-[#6b6560] text-sm leading-relaxed mb-5 line-clamp-2">
                      {project.shortDescription}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.badges.slice(0, 3).map((badge) => (
                        <span
                          key={badge}
                          className="text-xs font-medium text-[#6b6560] bg-[#f0ede8] border border-[#e8e3db] px-2.5 py-1 rounded-md"
                        >
                          {badge}
                        </span>
                      ))}
                      {project.badges.length > 3 && (
                        <span className="text-xs font-medium text-[#9c9590] px-2 py-1">
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
                </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 border-t border-[#e8e3db]">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1714] mb-4">
              Ready to be our next case study?
            </h2>
            <p className="text-[#6b6560] text-lg mb-8 max-w-xl mx-auto">
              Tell us about your project and we'll come back with a plan.
            </p>
            <a
              href="/#quote"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 text-base"
              data-testid="btn-get-quote-bottom"
            >
              Get a Free Quote <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

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
