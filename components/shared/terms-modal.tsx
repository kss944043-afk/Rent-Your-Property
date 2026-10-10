"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck } from "lucide-react";

export function TermsModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white rounded-2xl sm:rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent shadow-inner">
              <FileText className="size-6" />
            </div>
            <div className="text-left space-y-1">
              <DialogTitle className="text-xl sm:text-2xl font-heading font-black tracking-tight text-slate-900">
                Terms & Agreement
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-500">
                Property Submission Terms for RentYourProperty.pk
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 px-6 py-6 sm:px-8 sm:py-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-8 text-[15px] text-slate-600 leading-relaxed pb-6">
            <p className="text-slate-800 font-medium">
              By submitting a property through RentYourProperty.pk, the property owner agrees to the following terms and conditions:
            </p>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                1. Property Ownership & Verification
              </h3>
              <p>
                The person submitting the property must be its lawful owner or a duly authorized representative with valid permission to offer the property for rent. Submitting false ownership claims, forged documents, or misleading information is strictly prohibited. RentYourProperty.pk and its associated business, Next Avenue SMC Private Limited, reserve the right to verify the submitted information, reject suspicious listings, suspend services, and pursue appropriate legal action where justified under applicable law.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                2. Accuracy of Information
              </h3>
              <p>
                The owner is responsible for providing accurate and complete information, including property location, rental price, features, ownership details, availability, and any other relevant information. The owner must promptly notify us of any changes to the submitted information or the property's availability.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                3. Confidentiality & Privacy
              </h3>
              <p>
                The owner's personal information, contact details, and ownership documents will be treated as confidential and handled with reasonable care. Such information will not be publicly disclosed except where necessary to provide our services, with the owner's authorization, or as required by applicable law. Property information and approved marketing materials may be shared publicly for advertising purposes.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                4. Property Marketing & Promotion
              </h3>
              <p>
                The owner authorizes RentYourProperty.pk and Next Avenue SMC Private Limited to market and promote the submitted property through our website, social media accounts, property portals, digital advertising, photographs, videos, and other relevant marketing channels to attract prospective tenants.
              </p>
              <p>
                Where required, we may contact the owner to arrange a property visit, photography, videography, verification, and other activities necessary for marketing the property. The owner agrees to cooperate reasonably with these activities.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                5. Rental Commission / Service Fee
              </h3>
              <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-2xl p-5 text-slate-800 space-y-3 mt-3 shadow-sm">
                <p className="font-bold text-brand-accent text-base">
                  If the property is successfully rented through our services, the owner agrees to pay a service fee equivalent to 15 days' rent, calculated as 50% of the agreed monthly rent.
                </p>
                <p className="text-sm font-medium">
                  The applicable commission becomes payable upon successful completion of the rental transaction, in accordance with the agreed payment arrangements. The owner is responsible for paying this fee.
                </p>
              </div>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                6. Prospective Tenants & Direct Transactions
              </h3>
              <p>
                RentYourProperty.pk may receive inquiries, arrange property viewings, communicate with prospective tenants, and facilitate rental negotiations. If a tenant introduced or sourced through our services subsequently rents the property directly from the owner, the applicable service fee will remain payable under these terms.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                7. No Guarantee of Rental
              </h3>
              <p>
                Submitting a property does not guarantee that it will be rented within a specific period. Rental results depend on market conditions, pricing, property condition, availability, and tenant demand.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                8. Right to Reject or Remove Listings
              </h3>
              <p>
                RentYourProperty.pk reserves the right to reject, suspend, or remove any listing that contains false, misleading, incomplete, unauthorized, or potentially unlawful information, or that otherwise violates these terms.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                9. Legal Compliance
              </h3>
              <p>
                The owner agrees to comply with applicable laws and confirms that they have the legal authority to offer the property for rent. Where false information, fraud, forged documents, or unauthorized submissions are identified, RentYourProperty.pk and Next Avenue SMC Private Limited may take appropriate legal action and cooperate with the relevant authorities, subject to applicable law.
              </p>
            </section>

            <section className="space-y-2.5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                10. Acceptance of Terms
              </h3>
              <p>
                By ticking the acceptance checkbox and submitting the property form, the owner confirms that they have read, understood, and agreed to these Terms & Agreement, including the ownership requirements, marketing authorization, confidentiality provisions, and rental service fee.
              </p>
            </section>

            <div className="pt-8 mt-8 border-t border-slate-200 flex items-start gap-4">
              <ShieldCheck className="size-6 text-slate-400 mt-0.5" />
              <p className="text-sm font-medium text-slate-500">
                <strong className="text-slate-800">RentYourProperty.pk</strong><br />
                Operated by/associated with Next Avenue SMC Private Limited.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-5 sm:px-8 border-t border-slate-100 bg-slate-50/80">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto h-12 px-8 font-bold text-base rounded-xl bg-brand-accent text-white hover:bg-brand-accent/90 shadow-md shadow-brand-accent/20 transition-all hover:-translate-y-0.5">
              I Understand & Agree
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
