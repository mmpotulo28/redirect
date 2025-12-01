import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon, ChartIcon, LinkIcon, ShieldIcon, ZapIcon } from "@/components/icons";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-20 text-center">
        <div className="inline-block max-w-3xl justify-center">
          <h1 className={title({ size: "lg" })}>Master Your&nbsp;</h1>
          <h1 className={title({ color: "violet", size: "lg" })}>Links&nbsp;</h1>
          <h1 className={title({ size: "lg" })}>
            with Precision & Insight.
          </h1>
          <div className={subtitle({ class: "mt-4 text-default-500 max-w-xl mx-auto" })}>
            Create custom short links, track detailed analytics, and manage your traffic with our advanced URL redirection platform.
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
            href="/dashboard"
          >
            Start for Free
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        <Card className="bg-content1/50 backdrop-blur-lg border-none shadow-md">
          <CardHeader className="flex gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ChartIcon size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-md font-bold">Deep Analytics</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-small text-default-500">
              Track clicks, geographic location, device types, and operating systems in real-time.
            </p>
          </CardBody>
        </Card>

        <Card className="bg-content1/50 backdrop-blur-lg border-none shadow-md">
          <CardHeader className="flex gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <LinkIcon size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-md font-bold">Custom Short Codes</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-small text-default-500">
              Create memorable, branded links that build trust and increase click-through rates.
            </p>
          </CardBody>
        </Card>

        <Card className="bg-content1/50 backdrop-blur-lg border-none shadow-md">
          <CardHeader className="flex gap-3">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <ZapIcon size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-md font-bold">Smart Redirection</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-small text-default-500">
              Seamless interstitial pages that inform users before redirecting, enhancing UX.
            </p>
          </CardBody>
        </Card>

        <Card className="bg-content1/50 backdrop-blur-lg border-none shadow-md">
          <CardHeader className="flex gap-3">
            <div className="p-2 rounded-lg bg-danger/10 text-danger">
              <ShieldIcon size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-md font-bold">Secure & Reliable</p>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-small text-default-500">
              Built with modern tech stack ensuring 99.9% uptime and secure link management.
            </p>
          </CardBody>
        </Card>
      </section>

      {/* How it works */}
      <section className="flex flex-col items-center gap-8 py-12 bg-content1/30 rounded-3xl mx-4">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-4xl px-4">
          <div className="flex flex-col items-center text-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-2">1</div>
            <h3 className="text-xl font-semibold">Paste URL</h3>
            <p className="text-default-500">Enter your long destination URL.</p>
          </div>
          <div className="hidden md:block w-24 h-0.5 bg-default-200" />
          <div className="flex flex-col items-center text-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-2">2</div>
            <h3 className="text-xl font-semibold">Customize</h3>
            <p className="text-default-500">Add a custom alias and description.</p>
          </div>
          <div className="hidden md:block w-24 h-0.5 bg-default-200" />
          <div className="flex flex-col items-center text-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-2">3</div>
            <h3 className="text-xl font-semibold">Track</h3>
            <p className="text-default-500">Share your link and monitor performance.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold max-w-2xl">
          Ready to optimize your traffic?
        </h2>
        <p className="text-default-500 max-w-lg">
          Join thousands of users who trust LinkFlow for their link management needs.
        </p>
        <Button
          as={Link}
          href="/dashboard"
          color="primary"
          size="lg"
          variant="shadow"
          className="font-semibold px-8"
        >
          Get Started Now
        </Button>
      </section>
    </div>
  );
}

