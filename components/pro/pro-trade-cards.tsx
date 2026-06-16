import Link from "next/link";
import type { AccountType } from "@/types";
import { PRO_PERKS_BY_TYPE } from "@/lib/pro";

const tradeCards: Array<{
  type: Exclude<AccountType, "RETAIL">;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
}> = [
  {
    type: "CONTRACTOR",
    icon: "???",
    eyebrow: "Contractor",
    title: "Contractors",
    description:
      "Built for flooring pros who install at scale. Volume pricing, priority fulfillment and dedicated project support.",
  },
  {
    type: "DESIGNER",
    icon: "??",
    eyebrow: "Interior Design",
    title: "Designers",
    description:
      "Specify, curate and present flooring options to clients with our exclusive designer portal and sample library.",
  },
  {
    type: "BUILDER",
    icon: "??",
    eyebrow: "Builder",
    title: "Builders & Developers",
    description:
      "Equip entire developments with premium flooring. Spec packages, volume contracts and on-site delivery coordination.",
  },
];

export function ProTradeCards() {
  return (
    <div className="grid gap-0.5 md:grid-cols-3">
      {tradeCards.map((card) => (
        <article
          key={card.type}
          className="border border-bone/10 bg-bone/5 p-8 transition-colors hover:bg-bone/10 md:p-10"
        >
          <div className="mb-6 text-4xl" aria-hidden>
            {card.icon}
          </div>
          <p className="mb-3 text-[11px] font-medium tracking-[0.18em] text-gold uppercase">
            {card.eyebrow}
          </p>
          <h3 className="mb-3 font-serif text-2xl font-light text-bone">
            {card.title}
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-bone/50">
            {card.description}
          </p>
          <ul className="mb-8 space-y-2">
            {PRO_PERKS_BY_TYPE[card.type].map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-2 text-[13px] text-bone/65"
              >
                <span className="text-gold">?</span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/pro/apply?type=${card.type}`}
            className="btn-gold no-underline"
          >
            Apply Now
          </Link>
        </article>
      ))}
    </div>
  );
}
