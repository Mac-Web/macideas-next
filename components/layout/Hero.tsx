interface HeroProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

function Hero({ title, description, children }: HeroProps) {
  return (
    <div className="flex flex-col gap-y-10 py-10 items-center">
      <h1 className="text-white text-4xl font-bold text-center">{title}</h1>
      <p className="text-gray-300 text-center w-[65%]">{description}</p>
      {children}
    </div>
  );
}

export default Hero;
