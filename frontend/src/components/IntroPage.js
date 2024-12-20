import React from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";

export function IntroPage() {
  return (
    <div className="home">
      <header>
        <Navigation />
      </header>
      <main>
        <h1>Discover Indonesia</h1>
        <article className="intro">
          <p>Where your journey begins with simplicity and support.</p>
          <a href="index.html">Get Started</a>
        </article>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
