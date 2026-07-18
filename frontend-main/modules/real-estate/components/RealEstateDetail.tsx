"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Mock Data for the property
const PROPERTY_IMAGES = [
  "/images/real-estate-1.png",
  "/images/real-estate-2.png",
  "/images/real-estate-3.png",
  "/images/real-estate-4.png",
  "/images/real-estate-5.png",
];

const PROPERTY_DETAILS = {
  title: "The House Is Very Beautiful, A House That",
  description:
    "Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Phasellus eros purus eu urna. Nunc aliquam est",
  client: "Awesome",
  location: "USA",
  surfaceArea: "600m2",
  yearsCompleted: "2023",
  houseType: "Apartment",
  beds: 5,
  baths: 4,
  kitchens: 1,
  address: {
    country: "United States",
    street: "3497 Holland Rd",
    city: "Virginia Beach",
    zip: "23452",
    state: "Vermont",
  },
};

export default function RealEstateDetail() {
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? PROPERTY_IMAGES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === PROPERTY_IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#f7f8fa] min-h-screen py-10 font-sans relative">
      {/* Close button top right */}
      <div className="absolute top-6 right-6">
        <button className="w-10 h-10 border-2 border-gray-900 rounded-lg flex items-center justify-center hover:bg-muted/60 transition-colors">
          <X className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-[#0091ff] mb-8">{PROPERTY_DETAILS.title}</h1>

        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left Column: Carousel */}
          <div className="flex-1">
            {/* Main Image */}
            <div className="relative aspect-[4/3] bg-muted rounded-xl overflow-hidden mb-4 group shadow-md">
              <div className="absolute inset-0 bg-[#3d2c1f] flex items-center justify-center">
                <span className="text-white/20 text-4xl font-bold tracking-widest rotate-12">
                  HOUSE
                </span>
              </div>

              {/* Carousel Controls */}
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 flex items-center justify-center hover:bg-black/20 transition-colors text-white ml-2"
                >
                  <ChevronLeft className="w-10 h-10 drop-shadow-md" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  onClick={handleNext}
                  className="w-12 h-12 flex items-center justify-center hover:bg-black/20 transition-colors text-white mr-2"
                >
                  <ChevronRight className="w-10 h-10 drop-shadow-md" />
                </button>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-5 gap-3">
              {PROPERTY_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImage
                      ? "border-[#0091ff] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="absolute inset-0 bg-gray-300"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Overview Box */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#fafafa] rounded-lg p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Overview</h2>

              <div className="space-y-4 text-foreground text-lg">
                <p>
                  <span className="font-bold">Client:</span> {PROPERTY_DETAILS.client}
                </p>
                <p>
                  <span className="font-bold">Location:</span> {PROPERTY_DETAILS.location}
                </p>
                <p>
                  <span className="font-bold">Surface Area:</span> {PROPERTY_DETAILS.surfaceArea}
                </p>
                <p>
                  <span className="font-bold">Years Completed:</span>{" "}
                  {PROPERTY_DETAILS.yearsCompleted}
                </p>
                <p>
                  <span className="font-bold">House:</span> {PROPERTY_DETAILS.houseType}
                </p>
                <p>
                  <span className="font-bold">Bed:</span> {PROPERTY_DETAILS.beds}
                </p>
                <p>
                  <span className="font-bold">Bath:</span> {PROPERTY_DETAILS.baths}
                </p>
                <p>
                  <span className="font-bold">Kitchen:</span> {PROPERTY_DETAILS.kitchens}
                </p>

                {/* Duplicate fields to match design exactly */}
                <p>
                  <span className="font-bold">House:</span> {PROPERTY_DETAILS.houseType}
                </p>
                <p>
                  <span className="font-bold">Bed:</span> {PROPERTY_DETAILS.beds}
                </p>
                <p>
                  <span className="font-bold">Bath:</span> {PROPERTY_DETAILS.baths}
                </p>
                <p>
                  <span className="font-bold">Kitchen:</span> {PROPERTY_DETAILS.kitchens}
                </p>

                <div className="pt-2">
                  <p>
                    <span className="font-bold">Address:</span> Country:{" "}
                    {PROPERTY_DETAILS.address.country}
                  </p>
                  <p>Street: {PROPERTY_DETAILS.address.street}</p>
                  <p>City/Town: {PROPERTY_DETAILS.address.city}</p>
                  <p>Zip/Postal Code: {PROPERTY_DETAILS.address.zip}</p>
                  <p>State/Province/Region: {PROPERTY_DETAILS.address.state}</p>
                </div>
              </div>

              <div className="mt-8 bg-muted p-4 rounded-lg flex justify-center">
                <button className="bg-[#5c6e8e] hover:bg-[#4a5872] text-white px-10 py-3 rounded text-sm font-bold transition-colors">
                  Book now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-card rounded-lg p-8 border border-border shadow-sm mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Description:</h2>
          <p className="text-muted-foreground/70 text-base leading-relaxed">
            {PROPERTY_DETAILS.description}
          </p>
        </div>
      </div>
    </div>
  );
}
