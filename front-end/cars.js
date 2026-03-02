const cars = [
{
  id: 1,
  name: "Tesla Model 3 Performance",
  category: "Electric",
  type: "Sedan",
  price: 80,
  seats: 4,
  transmission: "Automatic",
  fuel: "Electric",
  image: "images/tesla.jpg"
},

{
  id: 2,
  name: "Porsche 911 Carrera",
  category: "Luxury",
  type: "Sports",
  price: 120,
  seats: 2,
  transmission: "Manual",
  fuel: "Petrol",
  image: "images/porsche.jpg"
}
];

const categories = ["Luxury","SUV","Sedan","Popular"];
const fuels = ["Electric","Petrol","Hybrid"];

for(let i=3;i<=50;i++){
  cars.push({
    id:i,
    name:`Velocita Car ${i}`,
    category:categories[i%4],
    type:categories[i%4],
    price:70+i,
    seats:(i%2===0)?4:5,
    transmission:"Automatic",
    fuel:fuels[i%3],
    image:`https://picsum.photos/500/300?random=${i}`
  });
}