import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using the Vidya Public School website and ERP portal, you agree to be bound by these Terms of Use. If you do not agree to these terms, you may not use this portal or any of its features. These terms apply to all visitors, students, parents, teachers, and administrative staff who access the system.",
  },
  {
    title: "2. Permitted Use",
    content: `This portal is provided exclusively for educational and administrative purposes of Vidya Public School. Permitted uses include:

- Students and parents viewing academic records, attendance, and fee information.
- Teachers managing attendance, marks, and academic records.
- Administrative staff managing school operations through the ERP system.
- General visitors accessing public information about the school.

Unauthorized or commercial use of this portal is strictly prohibited.`,
  },
  {
    title: "3. User Responsibilities",
    content: `All users of this portal are responsible for:

- Keeping login credentials (username and password) confidential.
- Reporting any unauthorized access or suspicious activity to the school administration immediately.
- Not sharing login credentials with any third party.
- Using the portal only for its intended, legitimate educational purposes.
- Not attempting to gain unauthorized access to other user accounts or restricted sections.

Violation of these responsibilities may result in immediate account suspension.`,
  },
  {
    title: "4. Intellectual Property",
    content: `All content on this website and portal, including but not limited to text, graphics, logos, software, and design, is the property of Vidya Public School and is protected under applicable Indian intellectual property laws.

The technology platform powering this portal is developed and maintained by ∑ Summasion (www.summasion.com). Unauthorized reproduction, distribution, or modification of any content is strictly prohibited without prior written permission.`,
  },
  {
    title: "5. Accuracy of Information",
    content: `Vidya Public School endeavours to maintain accurate and up-to-date information on this portal. However, we do not warrant that all information is complete, current, or error-free. Academic records, fee details, and other data are generated from the school's administrative system and should be verified with the school office in case of discrepancies.`,
  },
  {
    title: "6. Limitation of Liability",
    content: `Vidya Public School shall not be liable for:

- Any loss or damage arising from unauthorized access to your account due to failure to maintain the confidentiality of your credentials.
- Temporary unavailability of the portal due to maintenance, technical issues, or factors beyond our control.
- Any indirect, incidental, or consequential damages arising from the use of this portal.

Our liability, in any case, shall be limited to the extent permitted by applicable law.`,
  },
  {
    title: "7. Privacy",
    content:
      "Use of this portal is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using this portal, you consent to the data practices described in our Privacy Policy.",
  },
  {
    title: "8. Modifications to Terms",
    content:
      "Vidya Public School reserves the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting. Continued use of the portal after any such changes constitutes your acceptance of the updated terms. We encourage you to review these terms periodically.",
  },
  {
    title: "9. Governing Law",
    content:
      "These Terms of Use are governed by and construed in accordance with the laws of India. Any disputes arising from the use of this portal shall be subject to the exclusive jurisdiction of courts located in Uttarakhand, India.",
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about these Terms of Use, please contact us:

Email: info@vidyaschool.edu.in
Address: 473X+PGM, Govindpur, Uttarakhand 263160
Phone: +91 522 4567890`,
  },
];

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            Legal
          </Badge>
          <h1 className="text-3xl font-bold mb-3">Terms of Use</h1>
          <p className="text-white/70">Last Updated: April 2026</p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <ScrollText className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Please read these Terms of Use carefully before using the Vidya
              Public School website and ERP portal. These terms constitute a
              legal agreement between you and Vidya Public School.
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
