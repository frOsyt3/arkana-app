import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { BookOpen, TrendingUp, Lightbulb, Users, ArrowRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"

export default function InsightPage() {
  const articles = [
    {
      category: "Cloud Computing",
      title: "Mastering Multi-Cloud Strategy in 2026",
      excerpt: "A comprehensive guide to managing workloads across AWS, Azure, and Google Cloud for optimal performance and cost efficiency.",
      date: "February 15, 2026",
      readTime: "8 min read",
      image: TrendingUp
    },
    {
      category: "Cybersecurity",
      title: "Zero Trust Architecture: Implementation Guide",
      excerpt: "How modern enterprises are adopting zero trust security models to protect against sophisticated cyber threats.",
      date: "February 10, 2026",
      readTime: "10 min read",
      image: Lightbulb
    },
    {
      category: "Digital Transformation",
      title: "Legacy System Modernization Success Story",
      excerpt: "A deep dive into our banking client's digital transformation journey from monolithic to microservices architecture.",
      date: "February 5, 2026",
      readTime: "12 min read",
      image: BookOpen
    },
    {
      category: "AI & Machine Learning",
      title: "Practical AI Implementation for Business",
      excerpt: "Real-world use cases and ROI analysis of implementing AI solutions in enterprise environments.",
      date: "January 28, 2026",
      readTime: "9 min read",
      image: Users
    },
    {
      category: "DevOps",
      title: "CI/CD Pipeline Best Practices",
      excerpt: "Building robust continuous integration and deployment pipelines for faster, more reliable software delivery.",
      date: "January 20, 2026",
      readTime: "7 min read",
      image: TrendingUp
    },
    {
      category: "Software Architecture",
      title: "Microservices vs Monolith: Making the Right Choice",
      excerpt: "An honest comparison of architectural patterns with decision frameworks for different business scenarios.",
      date: "January 15, 2026",
      readTime: "11 min read",
      image: Lightbulb
    }
  ]

  const categories = [
    { name: "All", count: 24 },
    { name: "Cloud Computing", count: 7 },
    { name: "Cybersecurity", count: 5 },
    { name: "Digital Transformation", count: 6 },
    { name: "AI & Machine Learning", count: 4 },
    { name: "DevOps", count: 2 }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-white">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              Knowledge Hub
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-secondary">
              Insights & Articles
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover insights on cloud computing, digital transformation, cybersecurity, 
              and emerging technologies from our expert IT consultants.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow bg-gradient-to-br from-white to-primary/5">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-primary to-primary/80 p-12 flex items-center justify-center">
                <div className="w-32 h-32 bg-white/20 rounded-3xl backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="w-20 h-20 text-white" />
                </div>
              </div>
              <CardHeader className="space-y-4 p-8 lg:p-12">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">Featured</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    February 15, 2026
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    5 min read
                  </div>
                </div>
                
                <CardTitle className="text-3xl md:text-4xl text-secondary leading-tight">
                  Mastering Multi-Cloud Strategy in 2026
                </CardTitle>
                
                <CardDescription className="text-lg leading-relaxed">
                  A comprehensive guide to managing workloads across AWS, Azure, and Google Cloud 
                  for optimal performance and cost efficiency. Learn how leading enterprises are 
                  leveraging multi-cloud architectures to avoid vendor lock-in and maximize flexibility.
                </CardDescription>
                
                <Button className="w-fit group">
                  Read Full Article
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardHeader>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className="rounded-full"
              >
                {category.name}
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-muted/30">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => {
              const Icon = article.image
              return (
                <Card 
                  key={index}
                  className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-white/80" />
                  </div>
                  
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium text-xs">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </CardTitle>
                    
                    <CardDescription className="leading-relaxed">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {article.date}
                    </div>
                    
                    <Button variant="ghost" className="w-full group/btn">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-white to-primary/5">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mx-auto mb-4 shadow-lg shadow-primary/20">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl text-secondary">
                Stay Informed
              </CardTitle>
              <CardDescription className="text-lg">
                Subscribe to our newsletter for the latest insights, industry trends, and expert perspectives.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors"
                />
                <Button size="lg">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">
                No spam. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

