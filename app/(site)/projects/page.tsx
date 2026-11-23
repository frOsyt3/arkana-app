import { pageMetadata } from "@/lib/seo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { CheckCircle2, Star, Users, Building2 } from "lucide-react"
import { companyInfo } from "@/lib/company-data"
import { ProjectsShowcase } from "@/components/projects-showcase"

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Selected websites and web applications delivered by Arkana, from corporate sites to trade in platforms with admin dashboards.",
  path: "/projects",
})

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <ProjectsShowcase />

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
                <span className="absolute top-0 left-2 text-7xl text-primary/10 font-serif leading-none select-none">&ldquo;</span>
                
                <div className="relative z-10 space-y-6 flex-1">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-lg leading-relaxed text-gray-600 italic">
                    &ldquo;{testimonial.content}&rdquo;
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

    </div>
  )
}
