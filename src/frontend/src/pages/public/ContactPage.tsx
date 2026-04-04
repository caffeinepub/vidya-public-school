import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <PublicLayout>
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            Contact
          </Badge>
          <h1 className="text-3xl font-bold mb-3">Get in Touch</h1>
          <p className="text-primary-foreground/70">
            Have questions? Our team is here to help you.
          </p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info */}
            <div className="space-y-4">
              {[
                {
                  icon: MapPin,
                  title: "Address",
                  lines: ["473X+PGM, Govindpur,", "Uttarakhand 263160"],
                },
                {
                  icon: Phone,
                  title: "Phone",
                  lines: ["+91 522 4567890", "+91 522 4567891"],
                },
                {
                  icon: Mail,
                  title: "Email",
                  lines: [
                    "info@vidyaschool.edu.in",
                    "admissions@vidyaschool.edu.in",
                  ],
                },
                {
                  icon: Clock,
                  title: "Office Hours",
                  lines: ["Mon – Sat: 8:00 AM – 4:00 PM", "Sun: Closed"],
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title}>
                    <CardContent className="p-5 flex gap-4">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground mb-1">
                          {item.title}
                        </div>
                        {item.lines.map((l) => (
                          <div
                            key={l}
                            className="text-sm text-muted-foreground"
                          >
                            {l}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Google Map embed */}
              <div className="rounded-xl overflow-hidden border border-border h-56">
                <iframe
                  title="School Location"
                  src="https://www.google.com/maps?q=473X%2BPGM,+Govindpur,+Uttarakhand+263160&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {sent ? (
                    <div className="text-center py-8">
                      <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground text-lg mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Thank you for reaching out. We will get back to you
                        within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cname">Name *</Label>
                          <Input
                            id="cname"
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            placeholder="Your name"
                            data-ocid="contact.name.input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cemail">Email *</Label>
                          <Input
                            type="email"
                            id="cemail"
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            placeholder="your@email.com"
                            data-ocid="contact.email.input"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="csubject">Subject</Label>
                        <Input
                          id="csubject"
                          value={form.subject}
                          onChange={(e) =>
                            setForm({ ...form, subject: e.target.value })
                          }
                          placeholder="Subject"
                          data-ocid="contact.subject.input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cmessage">Message *</Label>
                        <Textarea
                          id="cmessage"
                          rows={5}
                          value={form.message}
                          onChange={(e) =>
                            setForm({ ...form, message: e.target.value })
                          }
                          placeholder="Write your message here..."
                          data-ocid="contact.message.textarea"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        data-ocid="contact.submit.button"
                      >
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
