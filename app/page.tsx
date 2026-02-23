import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Building2, Users, Lightbulb, ArrowRight, CheckCircle2, TrendingUp, Award, Target } from "lucide-react"
import Link from "next/link"

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
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Award className="w-4 h-4" />
                Excellence in Innovation
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Digital
                <span className="block text-primary mt-2">Transformation</span>
                <span className="block text-secondary mt-2">Experts</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                PT. Arkana Tunas Persada is your trusted IT consulting partner, delivering 
                innovative technology solutions and digital transformation strategies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group">
                  Explore Our Work
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-secondary">100+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">50+</div>
                  <div className="text-sm text-muted-foreground">Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">15+</div>
                  <div className="text-sm text-muted-foreground">Years</div>
                </div>
              </div>
            </div>

            {/* Right visual element */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square">
                {/* Geometric shapes */}
                <div className="absolute inset-0 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl shadow-2xl shadow-primary/20 hover:scale-105 transition-transform duration-500" />
                  <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl shadow-2xl shadow-secondary/20 hover:scale-105 transition-transform duration-500" style={{ marginTop: '3rem' }} />
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-10 -right-10 w-32 h-32 bg-white rounded-2xl shadow-xl p-4 animate-float">
                  <div className="w-full h-full flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-primary" />
                  </div>
                </div>
                
                <div className="absolute bottom-10 -left-10 w-32 h-32 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Target className="w-16 h-16 text-secondary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-muted/30">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Why Choose Arkana?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine expertise, innovation, and dedication to deliver exceptional results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-white">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl">Technology Expertise</CardTitle>
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

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-white">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Lightbulb className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl">Digital Innovation</CardTitle>
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

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-white">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl">Strategic Partnership</CardTitle>
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl shadow-primary/10 bg-white">
            <CardHeader className="text-center pb-8 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mx-auto mb-4 shadow-lg shadow-primary/20">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl text-secondary">
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

      {/* Footer */}
      <footer className="bg-secondary text-white py-16 md:py-20 mt-auto">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold">PT. Arkana Tunas Persada</h3>
              <p className="text-white/80 max-w-md leading-relaxed">
                Building excellence and delivering innovation for a sustainable future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-white/80">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/projects" className="hover:text-primary transition-colors">Our Projects</Link></li>
                <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Connect</h4>
              <ul className="space-y-3 text-white/80">
                <li><Link href="/insight" className="hover:text-primary transition-colors">Insights</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8">
            <p className="text-sm text-white/60 text-center">
              © 2026 PT. Arkana Tunas Persada. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

