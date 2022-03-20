# Propine-Crypto-Portfolio-Test-pvt

DESIGN:
  1. Convert the csv data into JSON. Not all data in the csv file was ccoverted as it was a large file.
  2. A single main function is used which comprises of conditions that will execute based on the parameters set when calling the function.
  3. The 1st condition will execute when there are no parameter. It will display the latest portfolio value per token in USD
  4. The 2nd condition will execute when there is a value in the token but date is set to null. It will display the latest portfolio value in USD of that respective token.
  5. The 3rd conditino will execute when there is a value in the date but token is set to null. It will dislplay the USD value of the tokens in that respective date.
  6. The 4th condition will execute when both token and date have values. It will display the USD value of the respective token on the respective date.
 
NOTE FOR CALLING THE FUNCTION:

  1. When passing parameters, token values must be string type such as "BTC", "ETH" & "XRP" and date values must be epoch, number type.
  2. The epoch range in the JSON file is (1571967208-1567007413). So, while entering the date value, enter values within that range.
