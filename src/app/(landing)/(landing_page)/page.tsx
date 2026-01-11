import Topbar from "../_components/section/Topbar";
import Hero from "../_components/section/Hero";
import Features from "../_components/section/Features";
import Stats from "../_components/section/Stats";
import HowItWorks from "../_components/section/HowItWorks";
import UseCases from "../_components/section/UseCases";
import Security from "../_components/section/Security";
import Testimonials from "../_components/section/Testimonials";
import Pricing from "../_components/section/Pricing";
import FAQ from "../_components/section/FAQ";
import Developers from "../_components/section/Developers";
import CTA from "../_components/section/CTA";
import Footer from "../_components/section/Footer";

export const metadata = {
	title: "PixaBot — AI Chat & Image",
	description: "PixaBot: integrated chat and image generation for your app.",
};

export default function LandingPage() {
	return (
		<main>
			<Topbar />
			<Hero />
			<Stats />
			<HowItWorks />
			<UseCases />
			<Security />
			<Testimonials />
			<Features />
			<Pricing />
			<Developers />
			<FAQ />
			<CTA />
			<Footer />
		</main>
	);
}

