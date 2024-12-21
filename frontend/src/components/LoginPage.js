import React from "react";
import { Navigation } from "./navigation/Navigation";
import { Footer } from "./footer/Footer";
import { LoginForm } from "./form/LoginForm";

export function LoginPage() {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <div className="login">
          <h1>Login</h1>
          <LoginForm />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
