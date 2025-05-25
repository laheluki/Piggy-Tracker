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

                <div className="absolute  -bottom-[35%] -right-[38%] z-10 flex w-full justify-end">
                    <img src={MockupMobile} alt="Mobile Mockup" />
                </div>
            </AnimatedMockup>
        </section>
    );
}
