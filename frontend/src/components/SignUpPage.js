import React from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";
import { SignUpForm } from "./form/SignUpForm";

export function SignUpPage() {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <div className="signup">
          <h1>Sign Up</h1>
          <SignUpForm />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
