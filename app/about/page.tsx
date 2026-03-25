import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Target, Users, Award, TrendingUp, Globe, Heart, Shield, Zap, Linkedin, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { companyInfo } from "@/lib/company-data"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-white">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Award className="w-4 h-4" />
              Our Story
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-secondary">
              About Arkana
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              PT. Arkana Tunas Persada is a leading IT consulting firm specializing in
              digital transformation, cloud solutions, and enterprise technology strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <Card className="border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-3xl text-secondary">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To empower businesses through cutting-edge technology solutions and strategic
                  IT consulting. We transform complex technical challenges into competitive advantages,
                  enabling our clients to innovate, scale, and succeed in the digital era.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-secondary/5">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/20">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-3xl text-secondary">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To be Indonesia's most trusted IT consulting partner, renowned for delivering
                  transformative technology solutions that drive business growth. We envision a future
                  where every organization harnesses the full potential of digital innovation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Arkana
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary">Technical Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Mastering the latest technologies to deliver superior solutions
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary">Digital Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pioneering next-generation technology solutions and strategies
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary">Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upholding transparency and ethical practices always
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary">Client Partnership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Co-creating solutions that align with business objectives
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Our Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Numbers that reflect our commitment and growth
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <TrendingUp className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">100+</div>
              <div className="text-lg text-gray-600">Projects Delivered</div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <Users className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">50+</div>
              <div className="text-lg text-gray-600">Happy Clients</div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <Award className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">15+</div>
              <div className="text-lg text-gray-600">Years Experience</div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <Globe className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">20+</div>
              <div className="text-lg text-gray-600">Technology Partners</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A timeline of milestones and achievements that shaped Arkana
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20 hidden lg:block" />

            <div className="space-y-12">
              {companyInfo.companyHistory.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <Card className="border-2 border-primary/20 hover:shadow-xl transition-all bg-white">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-primary">{milestone.year}</span>
                        </div>
                        <CardTitle className="text-2xl text-secondary">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative flex-shrink-0 hidden lg:block">
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-lg" />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20 space-y-3">
            <p className="text-sm font-semibold tracking-widest text-primary uppercase">The People</p>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Our Team
            </h2>
            <div className="w-12 h-px bg-primary mx-auto mt-2" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {companyInfo.team.map((member, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center space-y-5 transition-all duration-300"
              >
                {/* Circular Avatar */}
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center ring-1 ring-primary/10 group-hover:ring-primary/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
                  <Users className="w-12 h-12 text-primary/40" />
                  {/* LinkedIn on hover */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 rounded-full bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-secondary tracking-tight">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                </div>

                {/* Divider */}
                <div className="w-8 h-px bg-primary/20 group-hover:w-16 group-hover:bg-primary/50 transition-all duration-300" />

                {/* Bio */}
                <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Awards */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Certifications & Partnerships
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Industry recognition and strategic technology partnerships
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyInfo.certifications.map((cert, index) => (
              <Card
                key={index}
                className="border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl bg-white text-center p-8"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">{cert.name}</h3>
                <p className="text-primary font-medium">{cert.level}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl bg-white">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-3xl md:text-4xl text-secondary">
                Join Us on Our Journey
              </CardTitle>
              <CardDescription className="text-lg">
                Discover how Arkana can help bring your vision to life
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">View Our Projects</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}




