import { marqueeItems } from "@/lib/home-data";



export function MarqueeBar() {

  const track = [...marqueeItems, ...marqueeItems];



  return (

    <div className="overflow-hidden bg-primary py-3.5" aria-hidden="true">

      <div className="animate-marquee flex w-max whitespace-nowrap motion-reduce:transform-none">

        {track.map((item, index) => (

          <span

            key={`${item}-${index}`}

            className="shrink-0 px-6 text-xs tracking-[0.14em] text-white/55 uppercase sm:px-10"

          >

            {item}

            <b className="mx-4 font-normal text-gold">|</b>

          </span>

        ))}

      </div>

    </div>

  );

}


