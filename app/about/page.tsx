import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Target, Users, Award, TrendingUp, Globe, Heart, Shield, Zap } from "lucide-react"
import Link from "next/link"

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
            
            <p className="text-xl text-muted-foreground leading-relaxed">
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
                <p className="text-lg text-muted-foreground leading-relaxed">
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
                <p className="text-lg text-muted-foreground leading-relaxed">
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Arkana
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Technical Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mastering the latest technologies to deliver superior solutions
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Digital Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pioneering next-generation technology solutions and strategies
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upholding transparency and ethical practices always
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Client Partnership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
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
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Numbers that reflect our commitment and growth
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <TrendingUp className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">100+</div>
              <div className="text-lg text-muted-foreground">Projects Delivered</div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <Users className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">50+</div>
              <div className="text-lg text-muted-foreground">Happy Clients</div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <Award className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">15+</div>
              <div className="text-lg text-muted-foreground">Years Experience</div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <Globe className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">20+</div>
              <div className="text-lg text-muted-foreground">Technology Partners</div>
            </Card>
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
