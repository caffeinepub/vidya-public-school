import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: `Vidya Public School collects personal information necessary to provide educational and administrative services. This includes:

- Student information: name, date of birth, gender, address, academic records, attendance, fee payment history, and parent/guardian contact details.
- Employee information: name, designation, department, contact details, salary information, and employment history.
- Contact form submissions: name, email address, and message content when you reach out to us through the website.

We collect information only for legitimate educational and operational purposes.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `Information collected is used exclusively for:

- Managing student enrollment, academic records, attendance, and performance.
- Processing fee payments and generating receipts.
- Communicating important notices, examination schedules, and school events.
- Payroll management and salary processing for employees.
- Responding to inquiries submitted through the contact form.
- Generating reports for internal administrative use.

We do not use your information for marketing or unrelated commercial purposes.`,
  },
  {
    title: "3. Data Sharing",
    content: `Vidya Public School does not sell, rent, or share your personal information with third parties, except:

- When required by law or government authority.
- With service providers who assist in operating our systems, under strict confidentiality obligations.
- With parents/guardians regarding the academic progress and attendance of their enrolled children.

All data sharing is conducted with due care and only to the extent necessary.`,
  },
  {
    title: "4. Data Security",
    content:
      "We take reasonable administrative, technical, and physical measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Access to student and employee data is restricted to authorized staff members based on their roles and responsibilities within the ERP system.",
  },
  {
    title: "5. Retention of Data",
    content:
      "Student and employee records are retained for the duration required by applicable Indian educational regulations and laws. Academic records may be retained indefinitely for transcript and verification purposes. Fee payment records are retained for at least seven years for audit compliance.",
  },
  {
    title: "6. Your Rights",
    content: `You have the right to:

- Request access to your personal information held by us.
- Request correction of inaccurate information.
- Request deletion of data where no legal obligation to retain it exists.

To exercise these rights, contact us at the email or address provided below.`,
  },
  {
    title: "7. Cookies and Website Usage",
    content:
      "Our website may use session cookies to maintain login state for authenticated users. We do not use cookies for tracking, advertising, or analytics purposes. No third-party tracking scripts are embedded in our portal.",
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Changes will be reflected on this page with a revised "Last Updated" date. Continued use of the portal after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "9. Contact for Privacy Concerns",
    content: `If you have any questions, concerns, or requests related to this Privacy Policy, please contact us:

Email: info@vidyaschool.edu.in
Address: 473X+PGM, Govindpur, Uttarakhand 263160
Phone: +91 522 4567890

We aim to respond to all privacy-related inquiries within 7 working days.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            Legal
          </Badge>
          <h1 className="text-3xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-white/70">Last Updated: April 2026</p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <Shield className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Vidya Public School is committed to protecting the privacy and
              security of all personal information entrusted to us. This policy
              applies to all users of our website and ERP management portal.
            </p>
          </div>

          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <Card key={section.title}>
                <CardContent className="p-6">
                  <h2 className="font-semibold text-foreground mb-3">
                    {section.title}
                  </h2>
                  <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Vidya Public School. All rights
              reserved.
            </p>
            <p className="mt-1">
              Design &amp; Technology by{" "}
              <a
                href="https://www.summasion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ∑ Summasion
              </a>
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
