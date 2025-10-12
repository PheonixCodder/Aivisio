import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROUTES } from "./routes";
import {
  CreditCard,
  Frame,
  Image,
  Images,
  Layers,
  Settings2,
  SquareTerminal,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NAV_ITEMS = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: SquareTerminal,
  },
  {
    title: "Generate Image",
    url: ROUTES.IMAGE_GENERATION,
    icon: Image,
  },
  {
    title: "My Models",
    url: ROUTES.MODELS,
    icon: Frame,
  },
  {
    title: "Train Model",
    url: ROUTES.MODEL_TRAINING,
    icon: Layers,
  },
  {
    title: "My Images",
    url: ROUTES.GALLERY,
    icon: Images,
  },
  {
    title: "Billing",
    url: ROUTES.BILLING,
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: ROUTES.SETTINGS,
    icon: Settings2,
  },
];

export const models: { value: string; name: string }[] = [
  {
    value: "black-forest-labs/flux-dev",
    name: "Flux Dev",
  },
  {
    value: "black-forest-labs/flux-schnell",
    name: "Flux Schnell",
  },
];