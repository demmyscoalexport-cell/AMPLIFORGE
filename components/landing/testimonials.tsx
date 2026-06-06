import { getTestimonials } from "@/lib/data/testimonials";
import { TestimonialsClient } from "./testimonials-client";

export async function Testimonials() {
  let items: Awaited<ReturnType<typeof getTestimonials>> = [];
  try {
    items = await getTestimonials();
  } catch (err) {
    console.error("Failed to load testimonials:", err);
  }

  if (items.length === 0) return null;
  return <TestimonialsClient items={items} />;
}
