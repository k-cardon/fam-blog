import { urbanist } from '@/lib/fonts';

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className={`${urbanist.className} text-5xl md:text-8xl tracking-tighter leading-tight md:pr-8`}>
        Nodrac's
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        Cardon family recipe blog
      </h4>
    </section>
  );
}
