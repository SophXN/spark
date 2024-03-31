import React from "react";
import Image from "next/image";
import { EventCard } from "~/components/EventCard";

interface Props {
  logo: string;
}

const HomePage: React.FC<Props> = () => {
  return (
    <div>
      <header>
        <Image
          src={"/spark-logo.png"}
          alt="Logo"
          width={100}
          height={100}
          className="m-5"
        />
      </header>
      <main>
        <div className="flex justify-center">
          <EventCard
            image={
              "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
        </div>
      </main>
      <footer>{/* Your footer content goes here */}</footer>
    </div>
  );
};

export default HomePage;
