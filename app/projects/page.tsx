import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Building2, Code, Factory, Zap, CheckCircle2, ArrowRight, Award, Package, Star, Users } from "lucide-react"
import Link from "next/link"
import { companyInfo } from "@/lib/company-data"

export default function ProjectsPage() {
  const projects = [
    {
      title: "Enterprise Cloud Migration",
      category: "Cloud Solutions",
      description: "Complete migration of legacy systems to AWS cloud infrastructure with zero downtime, improving scalability and reducing operational costs by 40%.",
      icon: Code,
      stats: { duration: "8 months", scale: "Large", status: "Completed" },
      tags: ["AWS", "Cloud Migration", "DevOps"]
    },
    {
      title: "Custom ERP Development",
      category: "Enterprise Software",
      description: "Built comprehensive ERP system integrating finance, HR, and supply chain modules with real-time analytics and reporting capabilities.",
      icon: Building2,
      stats: { duration: "12 months", scale: "Large", status: "Completed" },
      tags: ["ERP", "Custom Development", "Integration"]
    },
    {
      title: "AI-Powered Analytics Platform",
      category: "Data & AI",
      description: "Developed machine learning platform for predictive analytics, enabling data-driven decision making and business intelligence.",
      icon: Zap,
      stats: { duration: "10 months", scale: "Medium", status: "Completed" },
      tags: ["AI/ML", "Data Analytics", "Python"]
    },
    {
      title: "Digital Banking Transformation",
      category: "Digital Transformation",
      description: "End-to-end digital transformation of banking services including mobile apps, web portal, and core banking system modernization.",
      icon: Package,
      stats: { duration: "18 months", scale: "Large", status: "Completed" },
      tags: ["FinTech", "Mobile Development", "API Gateway"]
    },
    {
      title: "E-Commerce Platform Development",
      category: "Web Development",
      description: "Built scalable e-commerce platform with advanced features including AI recommendations, payment gateway integration, and inventory management.",
      icon: Factory,
      stats: { duration: "6 months", scale: "Medium", status: "Completed" },
      tags: ["React", "Node.js", "Microservices"]
    },
    {
      title: "IT Infrastructure Modernization",
      category: "Infrastructure",
      description: "Complete overhaul of IT infrastructure including network redesign, server virtualization, and implementation of disaster recovery systems.",
      icon: Building2,
      stats: { duration: "14 months", scale: "Large", status: "Ongoing" },
      tags: ["VMware", "Network Security", "DR/BC"]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-white">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" style={{ animationDelay: '3s' }} />
        
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Award className="w-4 h-4" />
              Our Portfolio
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-secondary">
              Our Projects
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Explore our portfolio of successful IT consulting projects, from enterprise 
              software development to cloud transformation and digital innovation initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-gray-600 font-medium">Projects Delivered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600 font-medium">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-gray-600 font-medium">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-muted/30">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A selection of our most impactful and innovative projects
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon
              return (
                <Card 
                  key={index} 
                  className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white overflow-hidden"
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.stats.status === 'Completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {project.stats.status}
                      </span>
                    </div>
                    
                    <div>
                      <div className="text-sm text-primary font-medium mb-2">{project.category}</div>
                      <CardTitle className="text-2xl text-secondary group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                    </div>
                    
                    <CardDescription className="text-base leading-relaxed text-gray-600">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-secondary">Duration:</span> {project.stats.duration}
                      </div>
                      <div>
                        <span className="font-medium text-secondary">Scale:</span> {project.stats.scale}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full group/btn">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Our Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A proven methodology for delivering successful projects
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", description: "Understanding your needs and objectives" },
              { step: "02", title: "Planning", description: "Strategic roadmap and resource allocation" },
              { step: "03", title: "Execution", description: "Implementation with quality assurance" },
              { step: "04", title: "Delivery", description: "Handover and ongoing support" }
            ].map((phase, index) => (
              <Card key={index} className="relative border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl bg-white">
                <CardHeader className="space-y-4">
                  <div className="text-6xl font-bold text-primary/20">{phase.step}</div>
                  <CardTitle className="text-xl text-secondary">{phase.title}</CardTitle>
                  <CardDescription className="text-gray-600">{phase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success Stories / Testimonials */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Client Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real results and feedback from our satisfied clients
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {companyInfo.testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group flex flex-col relative p-6 transition-all duration-300 hover:-translate-y-2 bg-transparent"
              >
                {/* Decorative Quote Mark */}
                <span className="absolute top-0 left-2 text-7xl text-primary/10 font-serif leading-none select-none">"</span>
                
                <div className="relative z-10 space-y-6 flex-1">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-lg leading-relaxed text-gray-600 italic">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4 relative z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">{testimonial.name}</p>
                    <p className="text-sm font-medium text-primary">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Our Clients
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by leading organizations across multiple industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {companyInfo.clients.map((client, index) => (
              <Card 
                key={index}
                className="border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg bg-white flex items-center justify-center p-6 aspect-square"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-secondary">{client.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{client.industry}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl bg-white">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-3xl md:text-4xl text-secondary">
                Let's Build Your Next Project
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Ready to turn your vision into reality? Get in touch with our team today.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Button size="lg" asChild>
                <Link href="/contact">Start a Project</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
