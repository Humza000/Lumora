import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useStructuredData } from "@/hooks/use-structured-data";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, Layout, Monitor, PenTool, Search, Zap, Code, Linkedin, Instagram, Dribbble } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import lumoraLogo from "@assets/lumora_profile_pic_1782764569677.png";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().min(1, "Please enter your company or business name"),
  projectType: z.string().min(1, "Please select a project type"),
  timeline: z.string().min(1, "Please select a project timeline"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  companySize: z.string().optional(),
  existingWebsite: z.string().optional(),
  projectDriver: z.string().optional(),
  industry: z.string().optional(),
});

export default function Home() {
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  usePageMeta({
    title: "Lumora — Premium Web Design & Development Agency",
    description:
      "Lumora is a boutique digital agency crafting premium, high-performance web experiences for ambitious brands. Expert web design, development, and SEO.",
    ogTitle: "Lumora — Premium Web Design & Development Agency",
    ogDescription:
      "A boutique digital agency crafting premium, high-performance web experiences for ambitious brands who refuse to settle for ordinary.",
    canonical: "/",
  });

  useStructuredData([
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Lumora",
      "description": "A boutique digital agency crafting premium, high-performance web experiences for ambitious brands.",
      "email": "hello.lumoradesign@gmail.com",
      "telephone": "+44 7366 130603",
      "url": typeof window !== "undefined" ? window.location.origin : "",
      "sameAs": ["https://www.instagram.com/lumora_ig/"],
      "serviceType": ["Web Design", "Web Development", "UI/UX Design", "Brand Identity", "SEO Optimization", "Conversion Optimization"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Lumora",
      "url": typeof window !== "undefined" ? window.location.origin : "",
    },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      timeline: "",
      message: "",
      companySize: "",
      existingWebsite: "",
      projectDriver: "",
      industry: "",
    },
  });

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      toast({
        title: "Message Sent Successfully",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navbar */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <span className="font-serif font-bold text-2xl tracking-tight text-primary">Lumora</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {["Services", "Process", "About", "Reviews"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => { e.preventDefault(); scrollTo(item.toLowerCase()); }}
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
            <Link
              href="/portfolio"
              className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Portfolio
            </Link>
            <Button
              onClick={() => scrollTo("quote")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-7 py-2.5 text-base"
            >
              Get a Quote
            </Button>
          </nav>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-white shadow-lg border-t py-4 px-4 flex flex-col gap-4 md:hidden"
            >
              {["Services", "Process", "About", "Reviews"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.toLowerCase()); }}
                  className="text-left text-lg font-medium py-2 border-b border-border/50"
                >
                  {item}
                </a>
              ))}
              <Link
                href="/portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left text-lg font-medium py-2 border-b border-border/50 block"
              >
                Portfolio
              </Link>
              <Button onClick={() => scrollTo("quote")} className="w-full mt-2 rounded-full">
                Get a Quote
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/50 via-background to-background -z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTIwIDBoLTIwdjIwaDIwdi0yMHptLTE5IDE5di0xOGgxOHYxOGgtMTh6IiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDMpIi8+PC9zdmc+')] opacity-50 -z-10" />
        
        <div className="container mx-auto px-4 md:px-6 z-10 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground max-w-5xl leading-tight"
          >
            We Build Websites That <span className="text-primary italic">Convert.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            A boutique digital agency crafting premium, high-performance web experiences for ambitious brands who refuse to settle for ordinary.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" onClick={() => scrollTo("portfolio")} className="rounded-full px-8 text-base h-14 bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105">
              View Our Work
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo("quote")} className="rounded-full px-8 text-base h-14 border-border hover:bg-secondary/50 transition-transform hover:scale-105">
              Get a Quote
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">Comprehensive digital solutions designed to elevate your brand and drive measurable results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Web Design", icon: Layout, desc: "Bespoke, user-centric interfaces that captivate and engage your audience." },
              { title: "Web Development", icon: Code, desc: "Robust, scalable, and lightning-fast code architectures built for the future." },
              { title: "UI/UX Design", icon: Monitor, desc: "Intuitive user journeys rooted in deep research and psychological principles." },
              { title: "Brand Identity", icon: PenTool, desc: "Cohesive visual systems that communicate your unique market position." },
              { title: "SEO Optimization", icon: Search, desc: "Strategic technical implementation to ensure your brand is discovered." },
              { title: "Conversion Optimization", icon: Zap, desc: "Data-driven refinements that turn casual visitors into loyal customers." },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl border border-border/50 bg-background hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <service.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Selected Work</h2>
              <p className="mt-4 text-lg text-muted-foreground">A glimpse into our recent digital transformations.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/30 hover:bg-primary/5 px-5 py-2.5 rounded-full transition-colors"
              >
                View All Projects →
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.filter((p) => p.featured).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-testid={`card-featured-${project.id}`}
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer block"
                >
                  <div className={`aspect-[4/3] w-full bg-gradient-to-br ${project.heroGradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
                      <span className="font-serif text-3xl font-bold text-white/15 tracking-widest uppercase">
                        {project.title.split(" ")[0]}
                      </span>
                    </div>
                    <img
                      src={`https://api.microlink.io?url=${encodeURIComponent(project.previewUrl)}&screenshot=true&meta=false&embed=screenshot.url`}
                      alt={`${project.title} preview`}
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <p className="text-white/70 text-xs font-medium mb-2 tracking-widest uppercase">{project.category}</p>
                    <h3 className="text-white text-2xl font-serif font-bold">{project.title}</h3>
                    <p className="text-white/60 text-sm mt-2 line-clamp-2">{project.shortDescription}</p>
                    <div className="mt-4 flex items-center text-white text-sm font-medium gap-1">
                      View Case Study <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              See all 6 projects →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Our Process</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">A systematic, transparent approach to delivering exceptional digital products.</p>
          </motion.div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border hidden md:block -translate-y-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              {[
                { step: "01", title: "Discovery", desc: "We dive deep into your brand, audience, and objectives to define a clear strategy." },
                { step: "02", title: "Design", desc: "Crafting visually stunning, user-centric interfaces that align with your vision." },
                { step: "03", title: "Development", desc: "Translating designs into clean, scalable, and high-performance code." },
                { step: "04", title: "Launch", desc: "Rigorous testing and a seamless deployment to introduce your new digital presence." },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative flex flex-col items-center text-center md:text-left md:items-start"
                >
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center text-xl font-bold font-serif mb-6 relative z-10 mx-auto md:mx-0 shadow-lg shadow-primary/10">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Crafting Digital Excellence.</h2>
              <div className="space-y-4 text-background/80 text-lg leading-relaxed">
                <p>
                  At Lumora, we believe that a website should be more than just a digital brochure — it should be a powerful engine for growth.
                </p>
                <p>
                  Founded by industry veterans, our agency bridges the gap between stunning aesthetics and robust engineering. We don't use templates. We don't cut corners. Every project is a bespoke creation tailored to the unique DNA of our clients.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-background/10">
                <div>
                  <div className="text-4xl font-serif font-bold text-primary mb-2">10+</div>
                  <div className="text-sm text-background/60 uppercase tracking-wider font-medium">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-4xl font-serif font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-background/60 uppercase tracking-wider font-medium">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-4xl font-serif font-bold text-primary mb-2">2</div>
                  <div className="text-sm text-background/60 uppercase tracking-wider font-medium">Years of Excellence</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-purple-900 mix-blend-multiply" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTIwIDBoLTIwdjIwaDIwdi0yMHptLTE5IDE5di0xOGgxOHYxOGgtMTh6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Client Stories</h2>
            <p className="mt-4 text-lg text-muted-foreground">Don't just take our word for it.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "Lumora completely transformed our online presence. Our conversion rate doubled within the first month of launch.", author: "Sarah Jenkins", role: "CEO, Aura Skincare", color: "bg-blue-100 text-blue-800" },
              { quote: "The level of polish and attention to detail is unmatched. They understood our vision perfectly and elevated it.", author: "Michael Chen", role: "Founder, Nexus", color: "bg-green-100 text-green-800" },
              { quote: "Professional, responsive, and incredibly talented. Working with Lumora was the best investment we made this year.", author: "Elena Rostova", role: "Director, Kova Arch", color: "bg-purple-100 text-purple-800" },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-6 text-primary">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg italic text-foreground mb-8">"{review.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${review.color} flex items-center justify-center font-bold text-lg`}>
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold font-serif">{review.author}</div>
                    <div className="text-sm text-muted-foreground">{review.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="py-24 bg-gradient-to-br from-primary to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTIwIDBoLTIwdjIwaDIwdi0yMHptLTE5IDE5di0xOGgxOHYxOGgtMTh6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-30" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-foreground">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Ready to Build Something Great?</h2>
              <p className="text-muted-foreground text-lg">Tell us about your project and we'll get back to you with a proposal.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-secondary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john@example.com" {...field} className="bg-secondary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company / Business</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} className="bg-secondary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-secondary/20">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new-website">New website (brochure/marketing site)</SelectItem>
                            <SelectItem value="redesign">Website redesign (replacing existing site)</SelectItem>
                            <SelectItem value="ecommerce">E-commerce store</SelectItem>
                            <SelectItem value="web-app">Web application / custom functionality</SelectItem>
                            <SelectItem value="landing-page">Landing page (single page, campaign-focused)</SelectItem>
                            <SelectItem value="maintenance">Ongoing maintenance / support</SelectItem>
                            <SelectItem value="not-sure">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-secondary/20">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="just-me">Just me</SelectItem>
                            <SelectItem value="startup-2-10">Startup (2–10)</SelectItem>
                            <SelectItem value="small-11-50">Small business (11–50)</SelectItem>
                            <SelectItem value="established-50+">Established business (50+)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry / Sector</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-secondary/20">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="finance">Finance & Fintech</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                            <SelectItem value="hospitality">Hospitality & Food</SelectItem>
                            <SelectItem value="trades">Trades & Construction</SelectItem>
                            <SelectItem value="fitness">Health & Fitness</SelectItem>
                            <SelectItem value="real-estate">Real Estate</SelectItem>
                            <SelectItem value="tech">Technology & SaaS</SelectItem>
                            <SelectItem value="creative">Creative & Media</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="nonprofit">Non-profit</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="existingWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Existing Website <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} className="bg-secondary/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectDriver"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's driving this project right now?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/20">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new-business">Launching a new business</SelectItem>
                          <SelectItem value="rebranding">Rebranding</SelectItem>
                          <SelectItem value="not-converting">Current site isn't converting</SelectItem>
                          <SelectItem value="outdated">Current site is outdated</SelectItem>
                          <SelectItem value="new-market">Expanding into a new market</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/20">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="asap">ASAP / Urgent</SelectItem>
                          <SelectItem value="2-3-weeks">2–3 Weeks</SelectItem>
                          <SelectItem value="1-month">1 Month</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your goals, inspirations, and any specific requirements..." 
                          className="min-h-[120px] bg-secondary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90">
                  Submit Request
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "What is your typical project timeline?", a: "Most custom web design and development projects take between 8 to 12 weeks from discovery to launch, depending on complexity and scope." },
              { q: "Do you use templates?", a: "No. Every project we undertake is custom-designed and built from scratch to perfectly align with your brand's unique needs and goals." },
              { q: "What tech stack do you use?", a: "We specialize in modern React ecosystems (Next.js, Vite), robust headless CMS solutions (Sanity, Contentful), and modern CSS frameworks like Tailwind." },
              { q: "Do you provide ongoing maintenance?", a: "Yes, we offer retainer packages for ongoing technical support, updates, and continuous conversion rate optimization." },
              { q: "How does pricing work?", a: "Projects are priced based on scope, features, and timeline. Our custom engagements typically start at $10,000." },
              { q: "Do you handle copywriting and SEO?", a: "Yes. Our team includes expert copywriters and SEO specialists who ensure your site not only looks beautiful but performs exceptionally in search engines." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/50 py-2">
                <AccordionTrigger className="text-lg font-medium text-left hover:text-primary hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background/80 py-16 border-t border-border/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="mb-6">
                <span className="font-serif font-bold text-xl text-white tracking-tight">Lumora</span>
              </div>
              <p className="text-sm leading-relaxed text-background/70">
                Crafting digital experiences that command attention and drive growth for ambitious brands worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-serif font-bold text-xl text-white tracking-tight mb-6">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }} className="hover:text-white transition-colors">Web Design</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }} className="hover:text-white transition-colors">Web Development</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }} className="hover:text-white transition-colors">UI/UX Design</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }} className="hover:text-white transition-colors">Brand Identity</a></li>
                <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }} className="hover:text-white transition-colors">SEO Optimisation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-xl text-white tracking-tight mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#portfolio" onClick={(e) => { e.preventDefault(); scrollTo("portfolio"); }} className="hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#process" onClick={(e) => { e.preventDefault(); scrollTo("process"); }} className="hover:text-white transition-colors">Our Process</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }} className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#reviews" onClick={(e) => { e.preventDefault(); scrollTo("reviews"); }} className="hover:text-white transition-colors">Client Reviews</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-xl text-white tracking-tight mb-6">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="mailto:hello.lumoradesign@gmail.com" className="hover:text-white transition-colors">
                    hello.lumoradesign@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+447366130603" className="hover:text-white transition-colors">
                    +44 7366 130603
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© {new Date().getFullYear()} Lumora. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="X" className="text-background/50 hover:text-white transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.633 5.903-5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-background/50 hover:text-white transition-colors"><Linkedin size={22} /></a>
              <a href="https://www.instagram.com/lumora_ig/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-background/50 hover:text-white transition-colors"><Instagram size={22} /></a>
              <a href="#" aria-label="Dribbble" className="text-background/50 hover:text-white transition-colors"><Dribbble size={22} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}