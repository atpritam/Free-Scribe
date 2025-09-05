import React, { useEffect, useState } from "react";

const Footer = () => {
  const [EsQ, setEsQ] = useState(false);

  useEffect(() => {
    const initCheck = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.country_name === "India") {
          setEsQ(true);
        }
      } catch (err) {
        console.error("Check failed", err);
      }
    };

    initCheck();
  }, []);

  return (
    <footer className="border-t border-gray-200 bg-opacity-50 backdrop-blur-sm py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="font-semibold text-3xl">
              Free<span className="text-blue-400 bold">Scribe</span>
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Empowering communication through Machine-Learning-powered
              transcription and translation.
            </p>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="font-medium text-lg mb-2">Connect With Us</h3>
            <div className="flex space-x-4">
              {!EsQ && (
                <a
                  href="https://github.com/atpritam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-400 duration-200"
                  aria-label="GitHub"
                >
                  {/* GitHub SVG */}
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 ..."></path>
                  </svg>
                </a>
              )}

              <a
                href="https://www.instagram.com/itssodope_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-400 duration-200"
                aria-label="Instagram"
              >
                {/* Instagram SVG */}
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 ..."></path>
                </svg>
              </a>

              {!EsQ && (
                <a
                  href="https://pl.linkedin.com/in/atpritam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-400 duration-200"
                  aria-label="LinkedIn"
                >
                  {/* LinkedIn SVG */}
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554 ..."></path>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} FreeScribe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
