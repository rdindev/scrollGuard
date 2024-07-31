let quote = "Take a break, you're doing great!";

const fetchQuote = async () => {
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    quote =  data[0].q + " - " + data[0].a; // Constructing the quote with the author
  } catch (error) {
    console.log(error);
  }
};
(async () =>{
  try {
    await fetchQuote();
  }
  catch(error){
    console.log(error);
  }
})();
console.log(quote);



  