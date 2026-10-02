import type { Review } from "@/types";

/**
 * Demo content only — these are fictional reviews created for the
 * client-approval prototype and are not real customer statements.
 */
export const reviews: Review[] = [
  {
    id: "r-1",
    name: "Nimal Perera",
    location: "Colombo",
    rating: 5,
    text: "Demo review — the neon tetras arrived healthy and colourful, and the packaging kept the water temperature stable all the way to Colombo.",
    avatar: "/images/reviews/avatar-NP.png",
  },
  {
    id: "r-2",
    name: "Kavindu Silva",
    location: "Kandy",
    rating: 5,
    text: "Demo review — ordered a pack of guppies and corydoras. Every fish was active, healthy and clearly fed before it shipped.",
    avatar: "/images/reviews/avatar-KS.png",
  },
  {
    id: "r-3",
    name: "Tharindu Fernando",
    location: "Negombo",
    rating: 4,
    text: "Demo review — the angelfish pair settled in within a day and the live plants rooted within two weeks. Delivery to Negombo was faster than expected.",
    avatar: "/images/reviews/avatar-TF.png",
  },
  {
    id: "r-4",
    name: "Rashmi Dias",
    location: "Galle",
    rating: 5,
    text: "Demo review — the LED light completely changed how the aquarium looks in the living room. Worth every rupee.",
    avatar: "/images/reviews/avatar-RD.png",
  },
  {
    id: "r-5",
    name: "Ahamed Shifan",
    location: "Jaffna",
    rating: 5,
    text: "Demo review — my betta settled in immediately. Clear photos on the product page matched the fish that arrived.",
    avatar: "/images/reviews/avatar-AS.png",
  },
  {
    id: "r-6",
    name: "Maduri Herath",
    location: "Kurunegala",
    rating: 4,
    text: "Demo review — substrate arrived well washed with zero dust. Small detail, but it saved me an hour of rinsing.",
    avatar: "/images/reviews/avatar-MH.png",
  },
  {
    id: "r-7",
    name: "Dinesha Perera",
    location: "Matara",
    rating: 5,
    text: "Demo review — the discus were exactly the size shown in the listing and still had plenty of colour after transit. Genuinely impressed.",
    avatar: "/images/reviews/avatar-DP.png",
  },
  {
    id: "r-8",
    name: "Ruwan Jayasinghe",
    location: "Kurunegala",
    rating: 5,
    text: "Demo review — ordered a school of 12 tiger barbs and every single one arrived alive and active. Quarantine advice in the packing note was spot on.",
    avatar: "/images/reviews/avatar-RJ.png",
  },
  {
    id: "r-9",
    name: "Nadeesha Silva",
    location: "Gampaha",
    rating: 5,
    text: "Demo review — my mollies and platies came properly bagged with oxygen. acclimatised them slowly and no losses at all.",
    avatar: "/images/reviews/avatar-NS.png",
  },
  {
    id: "r-10",
    name: "Prasanna Kumara",
    location: "Ratnapura",
    rating: 4,
    text: "Demo review — the koi pair are healthy and very active. Slightly smaller than I expected, but the team offered a sizing guide before I ordered, which helped.",
    avatar: "/images/reviews/avatar-PK.png",
  },
];

/**
 * Home carousel — live-fish feedback only, to match the
 * "Real fish, happy hobbyists" section heading.
 */
export const homeReviews: Review[] = [
  reviews[0],
  reviews[1],
  reviews[2],
  reviews[4],
  reviews[6],
  reviews[7],
  reviews[8],
];
