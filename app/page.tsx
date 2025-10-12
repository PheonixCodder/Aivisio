import HeroSection from "@/components/home/HeroSection";
import Navigation from "@/components/home/nav/Navigation";
import Pricing, { ProductWithPrices } from "@/components/home/Pricing/Pricing";
import { getProducts, getUser } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const [user, products] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
  ])

  if (user) redirect('/dashboard');

  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <Navigation />
      <HeroSection />
      <Pricing products={products as ProductWithPrices[]} />
    </main>
  );
}
