import { pageMetadata } from "@/lib/seo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Mail, Phone, MapPin, Clock, Globe, MessageSquare } from "lucide-react"
import Link from "next/link"
import { companyInfo } from "@/lib/company-data"
import { ContactForm } from "@/components/contact-form"

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Talk to Arkana about IT procurement, infrastructure, or software projects. Office in Sarijadi, Bandung. We reply within one working day.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-white">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <MessageSquare className="w-4 h-4" />
              Get in Touch
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-secondary">
              Contact Us
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Ready to transform your business with technology? Get in touch with our IT consulting 
              team to discuss your project, challenges, or opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-4">
                  Let&apos;s Connect
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you need cloud migration, software development, or IT strategy consulting, 
                  our experts are ready to help.
                </p>
              </div>

              <div className="space-y-6">
                <a 
                  href={`mailto:${companyInfo.contact.email.general}`}
                  className="block group"
                >
                  <Card className="border-2 border-border group-hover:border-primary/50 group-hover:shadow-md transition-all bg-white cursor-pointer h-full">
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-secondary group-hover:text-primary transition-colors">Email</CardTitle>
                        <CardDescription className="text-base group-hover:text-gray-900 transition-colors">
                          {companyInfo.contact.email.general}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </a>

                {companyInfo.contact.showPhone && (
                  <a 
                    href={`https://wa.me/${companyInfo.contact.phone.main.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <Card className="border-2 border-border group-hover:border-primary/50 group-hover:shadow-md transition-all bg-white cursor-pointer h-full">
                      <CardHeader className="flex-row items-start gap-4 space-y-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-lg text-secondary group-hover:text-primary transition-colors">Phone (WhatsApp)</CardTitle>
                          <CardDescription className="text-base group-hover:text-gray-900 transition-colors">
                            {companyInfo.contact.phone.main}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </a>
                )}

                <a 
                  href={companyInfo.contact.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="border-2 border-border group-hover:border-primary/50 group-hover:shadow-md transition-all bg-white cursor-pointer h-full">
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-secondary group-hover:text-primary transition-colors">Office</CardTitle>
                        <CardDescription className="text-base group-hover:text-gray-900 transition-colors">
                          {companyInfo.contact.address.fullAddress}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </a>

                <Card className="border-2 border-border bg-white h-full">
                  <CardHeader className="flex-row items-start gap-4 space-y-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-secondary">Business Hours</CardTitle>
                      <CardDescription className="text-base text-gray-600">
                        {companyInfo.contact.businessHours.weekdays}<br />
                        {companyInfo.contact.businessHours.saturday}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </div>

              <div className="pt-4">
                <h3 className="text-xl font-semibold text-secondary mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {['LinkedIn', 'Twitter', 'Instagram', 'Facebook'].map((social) => (
                    <button
                      key={social}
                      className="w-12 h-12 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center group"
                    >
                      <Globe className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="border-2 border-primary/20 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary text-secondary">Send us a Message</CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and our team will get back to you within one working day.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Come meet us in person at our Jakarta office
            </p>
          </div>

          <Card className="border-2 border-border shadow-xl overflow-hidden bg-white">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-primary mx-auto" />
                <p className="text-lg text-gray-600">
                  Interactive map will be displayed here
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "What IT consulting services does Arkana provide?",
                answer: "We specialize in cloud solutions, digital transformation, custom software development, IT infrastructure, cybersecurity, and enterprise application development."
              },
              {
                question: "How can I request a consultation?",
                answer: "Fill out our contact form above or email us directly at info@arkanatunas.co.id with your requirements and we'll schedule a free consultation."
              },
              {
                question: "What is your typical project engagement model?",
                answer: "We offer flexible engagement models including fixed-price projects, time & materials, dedicated teams, and retainer-based consulting."
              },
              {
                question: "Do you provide ongoing support after project completion?",
                answer: "Yes, we offer comprehensive maintenance, support packages, and managed services to ensure your systems run smoothly."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-2 border-border hover:border-primary/50 transition-all bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-secondary">{faq.question}</CardTitle>
                  <CardDescription className="text-base pt-2">
                    {faq.answer}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Have more questions?
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/insight">Visit Our Insights</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}




