export const getProjects = () => {
   let cards = [
      {
         image: "/cofe.png",
         url: "https://cofecofe.vercel.app/",
      },
      {
         image: "/shaders.png",
         url: "https://shaders.cozify.lol/",
      },
      {
         image: "/gestalt.png",
         url: "https://gestalt.cozify.lol/",
      },
   ];

   if (cards.length <= 3) {
      cards = [...cards, ...cards, ...cards];
   }
   if (cards.length < 6 && cards.length > 3) {
      cards = [...cards, ...cards];
   }

   return cards;
};
