import {
  Baby,
  BookOpen,
  Car,
  Dumbbell,
  Factory,
  Gamepad2,
  Gem,
  Hammer,
  Luggage,
  PawPrint,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface CategoryLike {
  name: string;
  slug: string;
}

// Real categories don't carry an icon field from the backend, so this
// guesses a fitting Lucide icon from the name/slug — shared by every place
// that lists real categories (homepage grid, product listing sidebar, ...).
export function getCategoryIcon(category: CategoryLike): LucideIcon {
  const text = `${category.name} ${category.slug}`.toLowerCase();

  if (
    text.includes("electronic") ||
    text.includes("phone") ||
    text.includes("computer")
  )
    return Smartphone;
  if (
    text.includes("fashion") ||
    text.includes("clothing") ||
    text.includes("shirt") ||
    text.includes("dress")
  )
    return Shirt;
  if (
    text.includes("home") ||
    text.includes("furniture") ||
    text.includes("living")
  )
    return Sofa;
  if (
    text.includes("beauty") ||
    text.includes("health") ||
    text.includes("skincare") ||
    text.includes("care")
  )
    return Sparkles;
  if (
    text.includes("sport") ||
    text.includes("fitness") ||
    text.includes("outdoor")
  )
    return Dumbbell;
  if (text.includes("toy") || text.includes("baby") || text.includes("kids"))
    return Baby;
  if (
    text.includes("book") ||
    text.includes("stationery") ||
    text.includes("hobby")
  )
    return BookOpen;
  if (text.includes("pet") || text.includes("aquarium")) return PawPrint;
  if (
    text.includes("food") ||
    text.includes("grocery") ||
    text.includes("beverage")
  )
    return ShoppingBasket;
  if (
    text.includes("motor") ||
    text.includes("car") ||
    text.includes("vehicle")
  )
    return Car;
  if (
    text.includes("industrial") ||
    text.includes("business") ||
    text.includes("tool") ||
    text.includes("machinery")
  )
    return Factory;
  if (
    text.includes("jewel") ||
    text.includes("watch") ||
    text.includes("accessory") ||
    text.includes("bag")
  )
    return Gem;
  if (text.includes("game") || text.includes("gaming")) return Gamepad2;
  if (text.includes("travel") || text.includes("luggage")) return Luggage;
  if (
    text.includes("tool") ||
    text.includes("hammer") ||
    text.includes("repair")
  )
    return Hammer;

  return ShoppingBag;
}
