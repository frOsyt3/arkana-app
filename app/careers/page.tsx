import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Briefcase, MapPin, Clock, DollarSign, Users, Heart, TrendingUp, Zap, GraduationCap, Coffee, Trophy, Rocket } from "lucide-react"
import Link from "next/link"

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Cloud Architect",
      department: "Cloud Solutions",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      experience: "7+ years",
      posted: "2 days ago"
    },
    {
      title: "Full Stack Developer",
      department: "Software Development",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      experience: "3+ years",
      posted: "5 days ago"
    },
    {
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      experience: "4+ years",
      posted: "1 week ago"
    },
    {
      title: "IT Consultant",
      department: "Consulting",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      experience: "5+ years",
      posted: "1 week ago"
    },
    {
      title: "Data Engineer",
      department: "Data & Analytics",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      experience: "3+ years",
      posted: "2 weeks ago"
    },
    {
      title: "Cybersecurity Specialist",
      department: "Security",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      experience: "4+ years",
      posted: "2 weeks ago"
    }
  ]

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance for you and your family"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Clear career paths with regular training and development"
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Flexible working hours and remote work options"
    },
    {
      icon: DollarSign,
      title: "Competitive Salary",
      description: "Market-leading compensation and performance bonuses"
    },
    {
      icon: GraduationCap,
      title: "Learning & Certifications",
      description: "Annual budget for AWS, Azure, Google Cloud certifications and courses"
    },
    {
      icon: Trophy,
      title: "Recognition",
      description: "Employee appreciation programs and awards"
    }
  ]

  const values = [
    {
      icon: Users,
      title: "Tech-Forward Culture",
      description: "Work with cutting-edge technologies and modern development practices"
    },
    {
      icon: Zap,
      title: "Innovation Driven",
      description: "Encouraged to experiment with new technologies and methodologies"
    },
    {
      icon: Rocket,
      title: "Continuous Learning",
      description: "Access to conferences, certifications, and training programs"
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
              <Briefcase className="w-4 h-4" />
              Join Our Team
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-secondary">
              Build Your Career
              <span className="block text-primary mt-2">With Arkana</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join our team of technology experts, innovators, and problem solvers who are 
              shaping the future of IT consulting in Indonesia.
            </p>

            <Button size="lg" className="mt-4">
              View Open Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Why Work at Arkana?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in creating an environment where talent thrives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card 
                  key={index}
                  className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center"
                >
                  <CardHeader className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{value.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Benefits & Perks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We take care of our team with comprehensive benefits
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg bg-white">
                  <CardHeader className="space-y-4">
                    <Icon className="w-10 h-10 text-primary" />
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Open Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your next opportunity with us
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {jobs.map((job, index) => (
              <Card 
                key={index}
                className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white group"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {job.experience}
                        </span>
                        <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                          Posted {job.posted}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full md:w-auto">
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Don't see a position that fits? We're always looking for talented people.
            </p>
            <Button size="lg" variant="outline">
              Send Us Your CV
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl bg-white">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-3xl md:text-4xl text-secondary">
                Ready to Join Our Team?
              </CardTitle>
              <CardDescription className="text-lg">
                Take the first step towards an exciting career with Arkana
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Button size="lg">
                View All Positions
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn About Our Culture</Link>
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
