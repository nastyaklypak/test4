const CATALOG = [
    {id: 1, name: "ring", img: 'img/1529988.png.avif', price: "800$", category: "rings", description: "SERPENTI VIPER RING", stock: 5},
    {id: 2, name: "ring", img: "img/1629173.png.avif", price: "660$", category: "rings", description: "SERPENTI VIPER RING", stock: 10},
    {id: 3, name: "necklace", img: "img/1448222.png.avif", price: "900$", category: "necklaces", description: "B.ZERO1", stock: 9},
    {id: 4, name: "necklace", img: "img/1219896.png.avif", price: "700$", category: "necklaces", description: "FIOREVER NECKLACE", stock: 7},
    {id: 5, name: "bracelets", img: "img/1603938.png.avif", price: "500$", category: "bracelets", description: "BVLGARI TUBOGAS BRACELET", stock: 8},
    {id: 6, name: "bracelets", img: "img/1606103.png.avif", price: "700$", category: "bracelets", description: "B.ZERO1 BRACELET", stock: 11},
    {id: 7, name: "earrings", img: "img/454288.png.avif", price: "700$", category: "earrings", description: "B.ZERO1 EARRINGS", stock: 12},
    {id: 8, name: "earrings", img: "img/1234734.png.avif", price: "800$", category: "earrings", description: "DIVAS’ DREAM EARRINGS", stock: 5}
];

const itemNames = CATALOG.map(item => item.name);
const itemInStock = Array(CATALOG.length).fill(true); 

