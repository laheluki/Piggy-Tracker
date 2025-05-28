import AnimatedTitle from "@/components/motion/animated-title";
import AnimatedMockup from "@/components/motion/animated-mockup";

import MockupDesktop from "@/assets/mockup/desktop.png";
import MockupMobile from "@/assets/mockup/mobile.png";

export default function Mockup() {
    return (
        <section className="w-full overflow-hidden bg-background py-12 md:py-20">
            <AnimatedTitle>
                <h2 className="text-center font-capriola text-3xl font-bold leading-normal tracking-tighter sm:text-4xl md:text-5xl pb-20">
                    Intip sedikit <span className="text-primary">yuk...</span>
                </h2>
            </AnimatedTitle>

            <AnimatedMockup className="relative w-full" move={40}>
                {/* Desktop Mockup Full Width */}
                <img
                    src={MockupDesktop}
                    alt="Desktop Mockup"
                    className="w-full object-cover border border-secondary rounded-lg shadow-lg"
                />

                {/* Mobile Mockup floating on top */}

                <div className="absolute  -bottom-[20%] md:-bottom-[10%] z-10 flex w-full justify-end">
                    <img
                        src={MockupMobile}
                        alt="Mobile Mockup"
                        className="w-[150px] md:w-[350px] lg:w-[400px] object-cover rounded-lg md:-bottom-[30%] md:-right-[30%] lg:-bottom-[25%] lg:-right-[25%] max-w-full max-h-full md:max-w-none md:max-h-none"
                    />
                </div>
            </AnimatedMockup>
        </section>
    );
}
