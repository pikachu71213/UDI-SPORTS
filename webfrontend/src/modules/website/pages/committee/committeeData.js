import deepakgarg   from "@/assets/images/deepak-garg.webp"
import manishgupta  from "@/assets/images/manish-gupta.webp"
import shyamsunder  from "@/assets/images/shyam-sunder.webp"
import ankurjain     from "@/assets/images/ankur-jain.webp"
import sahiljindal   from "@/assets/images/sahil-jindal.webp"




export const committees = [
  {
    slug: "managing-community",
    label: "Managing Community",
    shortLabel: "Managing",
    icon: "🏛️",
    role: "Strategic Leadership & Governance",
    description:
      "The Managing Community serves as the apex governing body of UDIISA, responsible for strategic direction, policy-making, and overall administration. It coordinates all sub-committees and ensures the mission and vision are upheld at every level.",
    cardVariant: "orange",
    members: [
      { name: "Deepak Garg",         role: "Member", image: deepakgarg },
      { name: "Manish Gupta",        role: "Member", image: manishgupta },
      { name: "Shyam Sunder Kochar", role: "Member", image: shyamsunder },
    ],
  },
  {
    slug: "coronation-membership-development",
    label: "Coronation & Membership Development of UDIISA",
    shortLabel: "Coronation & Membership",
    icon: "👑",
    role: "Membership Growth & Recognition",
    description:
      "This committee drives the expansion and recognition of UDIISA's membership base. It oversees coronation ceremonies, membership drives, and the development of new membership tiers to broaden the organisation's reach.",
    cardVariant: "purple",
    members: [
      { name: "Ankur Jain",       role: "Member", image: ankurjain },
      { name: "Sahil Jindal",     role: "Member", image: sahiljindal },
      { name: "Er. Rajesh Kumar", role: "Member", image: null },
    ],
  },
  {
    slug: "international-affairs-membership",
    label: "International Affairs & Membership",
    shortLabel: "International Affairs",
    icon: "🌐",
    role: "Global Relations & Outreach",
    description:
      "Responsible for managing UDIISA's international relationships, this committee develops global partnerships, oversees international membership, and represents the organisation on the world stage.",
    cardVariant: "blue",
    members: [
      { name: "Viney Dewan",          role: "Member", image: null },
      { name: "Sanjay Garg",          role: "Member", image: null },
      { name: "Naresh Kumar (Gupta)", role: "Member", image: null },
    ],
  },
  {
    slug: "entrepreneurship",
    label: "Entrepreneurship Community",
    shortLabel: "Entrepreneurship",
    icon: "🚀",
    role: "Business Development & Innovation",
    description:
      "The Entrepreneurship Community fosters a culture of innovation and business excellence within UDIISA. It supports members in their entrepreneurial ventures, facilitates networking, and champions business development initiatives.",
    cardVariant: "green",
    members: [
      { name: "Anil Bansal",         role: "Member", image: null },
      { name: "Sanjay Garg Narwana", role: "Member", image: null },
      { name: "Mr. Prabhat",         role: "Member", image: null },
    ],
  },
  {
    slug: "general-membership-development",
    label: "General Membership Development Community",
    shortLabel: "General Membership",
    icon: "🤝",
    role: "Community Growth & Inclusion",
    description:
      "This committee focuses on broadening UDIISA's general membership by outreach programmes, awareness campaigns, and creating an inclusive environment that welcomes professionals from all walks of life.",
    cardVariant: "amber",
    members: [
      { name: "Jattin Kumar", role: "Member", image: null },
      { name: "Deepak Kumar", role: "Member", image: null },
    ],
  },
  {
    slug: "events-sports-program",
    label: "Events & Sports Program Community",
    shortLabel: "Events & Sports",
    icon: "🏆",
    role: "Event Management & Sports Promotion",
    description:
      "Dedicated to organising world-class events and sports programmes, this committee plans tournaments, cultural events, and sporting festivals that embody the spirit and values of UDIISA.",
    cardVariant: "red",
    members: [
      { name: "Mr. Vivek Patik",  role: "Member", image: null },
      { name: "Mr. Dinesh Patik", role: "Member", image: null },
    ],
  },
  {
    slug: "council-legal-rules",
    label: "Council of Legal & Rules Community",
    shortLabel: "Legal & Rules",
    icon: "⚖️",
    role: "Legal Oversight & Compliance",
    description:
      "The Council of Legal & Rules Community ensures all UDIISA activities comply with applicable laws and regulations. It reviews legal documents, handles disputes, and advises the management on risk mitigation and governance.",
    cardVariant: "indigo",
    members: [
      { name: "Manish Kumar Gupta (CS)", role: "Member", image: null },
      { name: "Mr. Gourav Kumar",        role: "Member", image: null },
      { name: "Mr. Mohan Goyal",         role: "Member", image: null },
    ],
  },
  {
    slug: "board-of-medical",
    label: "Board of Medical Community of UDIISA",
    shortLabel: "Medical Board",
    icon: "🏥",
    role: "Health, Safety & Player Welfare",
    description:
      "The Board of Medical Community safeguards the physical and mental well-being of all UDIISA members and Players. It oversees medical support, implements wellness programmes, and advocates for health and safety standards.",
    cardVariant: "teal",
    members: [
      { name: "Dr. Surender Gupta", role: "Member", image: null },
      { name: "Dr. Anurag Arora",   role: "Member", image: null },
    ],
  },
  {
    slug: "sports-community",
    label: "Sports Community",
    shortLabel: "Sports",
    icon: "⚽",
    role: "Sports Development & Excellence",
    description:
      "The Sports Community drives the development, promotion and excellence of sport at all levels under UDIISA. It identifies talent, formulates training strategies, and ensures fair-play and high performance standards.",
    cardVariant: "lime",
    members: [
      { name: "Sanjay Bharatwas", role: "Member", image: null },
      { name: "Joginder Sharma",  role: "Member", image: null },
      { name: "Mohan Lal Jain",   role: "Member", image: null },
    ],
  },
];