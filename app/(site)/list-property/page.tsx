"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { submitRentForm } from "@/app/actions/sell";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, User, Home, FileText, ArrowRight } from "lucide-react";
import { TermsModal } from "@/components/shared/terms-modal";

// The validation schema
const formSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters."),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number.")
    .regex(/^[0-9+\-\s()]*$/, "Only numbers and standard symbols allowed"),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  propertyType: z.enum(["house", "apartment", "commercial", "office", "upper_portion", "lower_portion", "shop"], {
    message: "Please select a property type.",
  }),
  sector: z.string().optional(),
  subSector: z.string().optional(),
  address: z.string().optional(),
  expectedRent: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  description: z.string().optional(),
  remarks: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

import { getLocations } from "@/app/actions/locations";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ListPropertyFormContent() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [locations, setLocations] = React.useState<any[]>([]);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: searchParams?.get("ownerName") || "",
      phone: searchParams?.get("phone") || "",
      email: "",
      propertyType: undefined,
      sector: searchParams?.get("sector") || "",
      subSector: "",
      address: "",
      expectedRent: "",
      bedrooms: "",
      bathrooms: "",
      description: "",
      remarks: "",
      acceptTerms: false,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const result = await submitRentForm(data);
      if (result.success) {
        toast.success("Request submitted successfully!");
        setIsSubmitted(true);
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-slate-50 p-4">
        <div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="size-10 text-green-500" />
          </div>
          <h1 className="font-heading text-3xl font-black text-slate-900">
            Request Received
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            Thank you for trusting Rent Your Property. One of our rental specialists
            will review your details and contact you within 24 hours to discuss
            listing your property for rent.
          </p>
          <Button
            variant="outline"
            className="mt-8 w-full rounded-xl h-12"
            onClick={() => {
              form.reset();
              setIsSubmitted(false);
            }}
          >
            Submit another property
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        
        {/* Header */}
        <div className="mb-10 text-center md:mb-16">
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-primary">
            List Your Property
          </span>
          <h1 className="font-heading text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Rent Out with Confidence
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 md:text-lg">
            Provide the basic details of your property. Our rental experts will connect with you to find the best tenants.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-200/40 md:p-12 relative overflow-hidden">
          {/* Decorative background flare */}
          <div className="absolute -top-40 -right-40 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10 space-y-12">
              
              {/* Section 1: Contact */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <User className="size-5" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-slate-900">
                    1. Personal Details
                  </h2>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-slate-700 font-semibold">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Ali Khan" {...field} className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="e.g. 0300 1234567" {...field} className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">Email Address <span className="text-slate-400 font-normal">(Optional)</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="ali@example.com" {...field} className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Property */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Home className="size-5" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-slate-900">
                    2. Property Details
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">Property Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary/20">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="upper_portion">Upper Portion</SelectItem>
                            <SelectItem value="lower_portion">Lower Portion</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                            <SelectItem value="shop">Shop</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">Expected Monthly Rent (PKR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 80000" {...field} className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">Bedrooms</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 3" {...field} className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">Bathrooms</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 2" {...field} className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem className={locations.find(l => l.name === field.value)?.subSectors?.length ? "md:col-span-1" : "md:col-span-2"}>
                        <FormLabel className="text-slate-700 font-semibold">Sector / Location</FormLabel>
                        <Select onValueChange={(val) => { field.onChange(val); form.setValue("subSector", ""); }} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary/20">
                              <SelectValue placeholder="Select sector" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60">
                            {locations.map((loc) => (
                              <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("sector") && (locations.find(l => l.name === form.watch("sector"))?.subSectors?.length ?? 0) > 0 && (
                    <FormField
                      control={form.control}
                      name="subSector"
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel className="text-slate-700 font-semibold">Sub-Sector</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary/20">
                                <SelectValue placeholder="Select sub-sector" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl max-h-60">
                              {locations.find(l => l.name === form.watch("sector"))?.subSectors.map((sub: any) => (
                                <SelectItem key={sub.name} value={sub.name}>{sub.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-slate-700 font-semibold">Detailed Address</FormLabel>
                        <FormControl>
                          <Input placeholder="House #, Street #" {...field} className="h-12 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 3: Notes */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-slate-900">
                    3. Additional Information
                  </h2>
                </div>

                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">Property Description <span className="text-slate-400 font-normal">(Optional)</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about the condition, furnishing, and key features..."
                            className="min-h-[120px] resize-y rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 p-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold">Private Remarks <span className="text-slate-400 font-normal">(Optional)</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific instructions for our agents? (e.g. Call after 5pm)"
                            className="min-h-[80px] resize-y rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary/20 p-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium text-slate-700 cursor-pointer">
                        I accept the Terms and Conditions
                      </FormLabel>
                      <p className="text-xs text-slate-500">
                        By submitting this property, you agree to our{" "}
                        <TermsModal>
                          <span className="text-brand-accent hover:underline font-bold cursor-pointer">
                            Terms & Agreement
                          </span>
                        </TermsModal>.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="group w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Submit Rental Property Details
                      <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default function ListPropertyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-32 flex items-center justify-center"><Loader2 className="animate-spin text-brand-accent size-10" /></div>}>
      <ListPropertyFormContent />
    </Suspense>
  );
}
