"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Building2, Users, Lightbulb, ArrowRight, CheckCircle2, TrendingUp, Award, Target, Cloud, Code, Shield, Zap, BarChart, MonitorCheck, Code2, Star, Server, CloudCog } from "lucide-react"
import Link from "next/link"
import { companyInfo } from "@/lib/company-data"
import { motion } from "framer-motion"
import { FadeInWhenVisible } from "@/components/animations"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section - Clean & Modern */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" style={{ animationDelay: '3s' }} />

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative py-24 md:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-20 items-center">
            {/* Left content */}
            <motion.div
              className="space-y-8 max-w-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Award className="w-4 h-4" />
                Excellence in Innovation
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-secondary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Digital
                <span className="block text-primary mt-2">Transformation</span>
                <span className="block text-secondary mt-2">Experts</span>
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                PT. Arkana Tunas Persada is your trusted IT consulting partner, delivering
                innovative technology solutions and digital transformation strategies.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button size="lg" className="group">
                  Explore Our Work
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-8 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div>
                  <div className="text-3xl font-bold text-secondary">100+</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">50+</div>
                  <div className="text-sm text-gray-600">Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">15+</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right visual element */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-full aspect-square">
                {/* Geometric shapes */}
                <div className="absolute inset-0 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl shadow-2xl shadow-primary/20 hover:scale-105 transition-transform duration-500" />
                  <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl shadow-2xl shadow-secondary/20 hover:scale-105 transition-transform duration-500" style={{ marginTop: '3rem' }} />
                </div>

                {/* Floating elements */}
                {/* <div className="absolute top-10 -right-10 w-32 h-32 bg-white rounded-2xl shadow-xl p-4 animate-float">
                  <div className="w-full h-full flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-primary" />
                  </div>
                </div>
                
                <div className="absolute bottom-10 -left-10 w-32 h-32 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Target className="w-16 h-16 text-secondary" />
                  </div>
                </div> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-muted/30">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <FadeInWhenVisible>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary">
                Why Choose Arkana?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We combine expertise, innovation, and dedication to deliver exceptional results.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <FadeInWhenVisible delay={0.1}>
              <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-white h-full">
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-secondary">Technology Expertise</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Deep technical knowledge across cloud platforms, enterprise systems,
                    and modern development frameworks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Certified cloud & enterprise architects</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Agile development methodologies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-white h-full">
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Lightbulb className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-secondary">Digital Innovation</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Transforming businesses through AI, cloud computing, and
                    cutting-edge digital solutions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>AI & Machine Learning integration</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Cloud-native architecture design</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-white h-full">
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-secondary">Strategic Partnership</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Working alongside your team to understand business goals and
                    deliver measurable technology outcomes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Business-aligned IT strategy</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Ongoing technical advisory</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <FadeInWhenVisible>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary">
                Our Services
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                End-to-end IT solutions, from consulting to implementation, tailored to your business needs.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyInfo.services.map((service, index) => {
              const icons: Record<string, any> = {
                Cloud, Code, Shield, Zap, Lightbulb, BarChart, MonitorCheck, Code2, Server, CloudCog
              };
              const IconComponent = icons[service.icon] || Code;

              return (
                <Card
                  key={index}
                  className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white"
                >
                  <CardHeader className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-secondary text-secondary">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've partnered with leading organizations across various industries
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

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Client Testimonials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear what our clients say about working with us
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

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl shadow-primary/10 bg-white">
            <CardHeader className="text-center pb-8 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mx-auto mb-4 shadow-lg shadow-primary/20">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl text-secondary text-secondary">
                Ready to Work Together?
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Let's discuss how we can help bring your vision to life.
                Our team is ready to collaborate on your next project.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Button size="lg" className="text-base">
                Start a Conversation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/projects">View Our Work</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}




