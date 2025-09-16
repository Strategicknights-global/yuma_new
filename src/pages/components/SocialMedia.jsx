import React from "react";

const instagramReels = [
  { id: 1, url: "https://www.instagram.com/p/DMNetXrzVmO/embed" },
  { id: 2, url: "https://www.instagram.com/p/C7txaVJz9Zl/embed" },
  { id: 3, url: "https://www.instagram.com/p/C6mnA4kKxL_/embed" },
];

const SocialMedia = () => (
  <section className="py-12 bg-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-8 text-[#b85a00]">Follow us on Social Media</h2>
      <div className="flex overflow-x-auto gap-6 p-4 -mx-4 scrollbar-hide justify-center">
        {instagramReels.map(reel => (
          <div key={reel.id} className="flex-shrink-0 w-[350px] h-[600px] rounded-lg overflow-hidden shadow-lg">
            <iframe src={reel.url} width="100%" height="600" frameBorder="0" scrolling="no" allow="encrypted-media" title={`Instagram Reel ${reel.id}`}></iframe>
          </div>
        ))}
      </div>
      <button
        onClick={() => window.open("https://www.instagram.com/strategic_knights?igsh=dzR6dGRlcjc3N3Q%3D", "_blank")}
        className="mt-8 bg-[#b85a00] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#a14f00] transition-colors"
      >
        Follow us on Instagram
      </button>
    </div>
  </section>
);

export default SocialMedia;
