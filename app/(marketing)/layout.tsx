import { NavMarketing } from "@/components/shared/nav-marketing";
import { LandingFooter } from "@/components/landing/footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavMarketing />
      <main className="pt-0">{children}</main>
      <LandingFooter />
    </>
  );
}
