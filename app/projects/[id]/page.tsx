import { prisma } from "@/lib/prisma";
import Hero from "@/components/layout/Hero";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <Hero title={id} description="This is a project I suppose." />;
}

export default Page;
