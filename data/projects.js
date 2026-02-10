export const getProjects = (menu = false) => {
   let cards = [
      {
         name: "Coffee Cup",
         image: "/coffee.png",
         url: "https://cofecofe.vercel.app/",
      },
      {
         name: "Shader Lab",
         image: "/shaders_new.png",
         url: "https://shaders.square43.com/",
      },
      {
         name: "Perception Playhouse",
         image: "/perception.png",
         url: "https://perception.cozify.lol/",
      },
      {
         name: "Code Art",
         image: "/canvas.png",
         url: "https://canvas.square43.com/",
      },
      {
         name: "Solana",
         image: "/solana.png",
         url: "https://lab.square43.com/solana",
      },
      {
         name: "Solana World",
         image: "/solana-world.png",
         url: "https://lab.square43.com/solana-world",
      },
      {
         name: "Solana Logo",
         image: "/solana-logo.png",
         url: "https://lab.square43.com/solana-logo",
      },
   ];
   if (menu) {
      cards = cards;
   }
   else {
      if (cards.length <= 3) {
         cards = [...cards, ...cards, ...cards];
      }
      if (cards.length < 6 && cards.length > 3) {
         cards = [...cards, ...cards];
      }
   }


   return cards;
};
