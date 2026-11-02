export const siteConfig = {
  name: "Utsho",
  tagline: "Community service, close to home.",
  description:
    "Utsho connects volunteers in Dhaka with social service events — winter clothes drives, blanket distributions, cleanups, plantations and more.",
  url: "https://utsho.vercel.app",
  email: "hello@utsho.org",
  phone: "+880 1700 000000",
  address: "House 12, Road 7, Mirpur 10, Dhaka 1216",
  // Visible to everyone, signed in or not.
  nav: [
    { label: "Home", href: "/" },
    { label: "Upcoming Events", href: "/events" },
  ],
  // Only shown once the visitor is signed in. Contact lives in the footer.
  privateNav: [
    { label: "Gallery", href: "/#gallery" },
    { label: "Create Event", href: "/events/create" },
    { label: "Manage Events", href: "/events/manage" },
    { label: "Joined Events", href: "/events/joined" },
  ],
  socials: [
    { label: "X", href: "https://x.com", icon: "x" },
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  ],
};

export const eventTypes = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Health",
  "Food Drive",
  "Fundraiser",
];
