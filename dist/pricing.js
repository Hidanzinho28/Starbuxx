(() => {
  const discount=price=>Math.round(Math.round(price*100)*70/100)/100;
  const minimumRobuxPrice=15;
  const robux=quantity=>discount(Math.round(quantity*3.65)/100);
  let minimumRobuxQuantity=1;
  while(robux(minimumRobuxQuantity)<minimumRobuxPrice)minimumRobuxQuantity++;
  window.shopPricing={discount,robux,minimumRobuxPrice,minimumRobuxQuantity};
})();
