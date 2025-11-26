'use client';

import { useEffect } from 'react';

export default function StructuredData() {
  useEffect(() => {
    // Create the JSON-LD script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'structured-data';
    
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://convoytravels.pk/#website",
          "url": "https://convoytravels.pk/",
          "name": "Convoy Travels | Rent a Car in Lahore",
          "description": "Rent a Car in Lahore With Driver & Without Driver with Convoy Travels, offering transparent pricing & rates. Best rent a car service for all your travel needs in Lahore.",
          "inLanguage": "en",
          "publisher": {
            "@id": "https://convoytravels.pk/#business"
          }
        },
        {
          "@type": "WebPage",
          "@id": "https://convoytravels.pk/#webpage",
          "url": "https://convoytravels.pk/",
          "name": "Convoy Travels - Rent a Car in Lahore with or without Driver",
          "isPartOf": {
            "@id": "https://convoytravels.pk/#website"
          },
          "about": {
            "@id": "https://convoytravels.pk/#business"
          },
          "description": "Book top-quality rental cars in Lahore with Convoy Travels. Self-drive and chauffeur-driven car rental, online booking, affordable rates and trusted service for business, family and travel needs.",
          "inLanguage": "en"
        },
        {
          "@type": "AutoRental",
          "@id": "https://convoytravels.pk/#business",
          "name": "Convoy Travels",
          "url": "https://convoytravels.pk/",
          "description": "Convoy Travels is a car rental company based in Johar Town, Lahore, providing self-drive and chauffeur-driven vehicles with transparent pricing and flexible rental plans.",
          "telephone": "+92-328-1456456",
          "email": "convoytravels786@gmail.com",
          "priceRange": "PKR 4,000 - PKR 12,000 per day",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "872 Block R1, Johar Town",
            "addressLocality": "Lahore",
            "addressRegion": "Punjab",
            "addressCountry": "PK"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 31.4396234,
            "longitude": 74.2654729
          },
          "areaServed": [
            {
              "@type": "City",
              "name": "Lahore",
              "sameAs": "https://en.wikipedia.org/wiki/Lahore"
            },
            {
              "@type": "AdministrativeArea",
              "name": "Punjab, Pakistan",
              "sameAs": "https://en.wikipedia.org/wiki/Punjab,_Pakistan"
            },
            {
              "@type": "Place",
              "name": "Johar Town",
              "sameAs": "https://en.wikipedia.org/wiki/Johar_Town"
            },
            {
              "@type": "Country",
              "name": "Pakistan",
              "sameAs": "https://en.wikipedia.org/wiki/Pakistan"
            }
          ],
          "knowsAbout": [
            {
              "@type": "Thing",
              "name": "Car rental",
              "sameAs": "https://en.wikipedia.org/wiki/Car_rental"
            },
            {
              "@type": "Thing",
              "name": "Self-drive car rental",
              "sameAs": "https://en.wikipedia.org/wiki/Car_rental"
            },
            {
              "@type": "Thing",
              "name": "Chauffeur service",
              "sameAs": "https://en.wikipedia.org/wiki/Chauffeur"
            }
          ],
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "10:00",
              "closes": "21:00"
            }
          ],
          "hasMap": "https://www.google.com/maps?ll=31.455258,74.275766&z=16&t=m&hl=en&gl=US&mapclient=embed&cid=3922948680983683380",
          "sameAs": [
            "https://www.facebook.com/ConvoyTravelsAndRentACar/"
          ],
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "telephone": "+92-328-1456456",
              "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              }
            }
          ]
        }
      ]
    };

    script.text = JSON.stringify(structuredData);
    
    // Remove existing script if it exists (to avoid duplicates)
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Append to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
}

