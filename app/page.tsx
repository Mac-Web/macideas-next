import { getSession } from "@/lib/auth";
import Hero from "@/components/layout/Hero";
import Footer from "@/components/layout/Footer";
import Btn from "@/components/ui/Btn";
import Image from "next/image";

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <div className="px-5 md:px-20 lg:px-[calc(50%-550px)] flex flex-col items-center">
        <Hero
          title="Welcome to MacIdeas!"
          description="A simple productivity app for managing and keeping track of your work!"
        >
          <div className="mb-10 flex gap-x-5">
            <Btn
              text={session ? "Tasks" : "Sign in"}
              link={
                session
                  ? "/tasks"
                  : process.env.NEXT_PUBLIC_ROOT_DOMAIN + "?redirect=macideas"
              }
              primary
            />
            {session && <Btn text="Notes" link="/notes" primary />}
            {session && <Btn text="Projects" link="/projects" primary />}
            <Btn text="Learn more" link="https://macweb.app/apps/macideas" />
          </div>
        </Hero>
        <div className="flex flex-col gap-y-10 pb-10">
          <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
            <Image
              src="/logo.png"
              alt="Placeholder image"
              width={200}
              height={200}
            />
            <div className="flex flex-col gap-y-5">
              <h2 className="text-white font-bold text-2xl">
                Cool section title 1
              </h2>
              <p className="text-gray-300">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
                distinctio error aspernatur quisquam ex natus nobis ducimus
                quis! A quasi at omnis velit consectetur sit perspiciatis labore
                commodi explicabo exercitationem?
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-10 md:flex-row gap-x-20 items-center">
            <div className="flex flex-col gap-y-5">
              <h2 className="text-white font-bold text-2xl">
                Cool section title 2
              </h2>
              <p className="text-gray-300">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
                distinctio error aspernatur quisquam ex natus nobis ducimus
                quis! A quasi at omnis velit consectetur sit perspiciatis labore
                commodi explicabo exercitationem?
              </p>
            </div>
            <Image
              src="/logo.png"
              alt="Placeholder image"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
