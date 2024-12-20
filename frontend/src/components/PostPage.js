import React from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";
import { PostFlightForm } from "./form/PostFlightForm";

export function PostPage() {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <section className="section-flight">
          <PostFlightForm />
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
