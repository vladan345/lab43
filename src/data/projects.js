export const getProjects = () => {
   let cards = [
      {
         name: "Coffee Cup",
         image: "/coffee.png",
         url: "https://cofecofe.vercel.app/",
      },
      {
         name: "Shader Lab",
         image: "/shaders_new.png",
         url: "https://shaders.cozify.lol/",
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
   ];

   if (cards.length <= 3) {
      cards = [...cards, ...cards, ...cards];
   }
   if (cards.length < 6 && cards.length > 3) {
      cards = [...cards, ...cards];
   }

   return cards;
};
