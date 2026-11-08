/** "The Next Dive": what Samyak wants to work on next, in his own words (from his statement of objectives, letters and emails). */
export type NextLink = { label: string; to: string };

export const next = {
  lead:
    "Every vehicle I have built so far has been tested in pools and basins. Next, I want to build underwater robots that keep working where people cannot easily go: under sea ice and in the deep ocean, where a robot cannot come up for a GPS fix and nobody can step in if something goes wrong. It has to know where it is, notice when a sensor stops giving good data, and decide for itself where to go next.",
  directions: [
    {
      title: "Navigation a robot can trust",
      text:
        "Long-endurance navigation without GPS: fusing inertial, acoustic and visual measurements into a position estimate the vehicle can trust, and keeping it reliable when a sensor drifts or fails. A robot first has to know how much to trust its own sensors.",
      buildsOn: [
        { label: "Sensor integrity paper", to: "/research/sensor-integrity-lstm" },
        { label: "GNC platform", to: "/projects/gnc-platform" },
      ] as NextLink[],
    },
    {
      title: "Seeing with sound",
      text:
        "Sonar perception, mapping and 3D reconstruction in water too dark or murky for cameras, from seabed surveys to mapping the underside of sea ice, one of the hardest places for an AUV to navigate.",
      buildsOn: [
        { label: "Sonar 3D reconstruction paper", to: "/research/sonar-gaussian-splatting" },
        { label: "Side-scan simulator", to: "/projects/sidescan-simulator" },
      ] as NextLink[],
    },
    {
      title: "Deciding where to look next",
      text:
        "The hardest part of autonomy is often not controlling the vehicle but deciding where it should go to learn the most. I want to take information-driven planning and adaptive sampling from a dock search in a basin to long missions in the open ocean.",
      buildsOn: [{ label: "Active search & docking", to: "/projects/info-driven-docking" }] as NextLink[],
    },
    {
      title: "Robots that serve ocean science",
      text:
        "Satellites only see the surface, and many of the most important changes happen below it and under the ice, where we have very little data. I want robots that help scientists answer real questions there: autonomous ocean observation, and acoustic sensing for monitoring marine ecosystems.",
      buildsOn: [
        { label: "Marine heatwave internship", to: "/projects/marine-heatwaves" },
        { label: "DHWANI acoustic AUV", to: "/projects/dhwani" },
      ] as NextLink[],
    },
  ],
  path: [
    {
      when: "From 2027",
      title: "Graduate research",
      text:
        "An MS / PhD in marine autonomy and ocean observation, with strong foundations, time on real vehicles at sea, and mentors who have operated robots in the field.",
    },
    {
      when: "Long term",
      title: "Research scientist",
      text:
        "At an ocean research institution, where engineers and ocean scientists work on the same problems together, building robots for reliable, long-duration missions in the real ocean.",
    },
    {
      when: "Always",
      title: "Giving back",
      text:
        "Bring what I learn back to the community that got me started, through Aquavision and the student community, and help marine robotics grow in India.",
    },
  ],
  quote:
    "I now want to build robots that help scientists answer real questions about the ocean, not only robots that work well in a pool.",
};
