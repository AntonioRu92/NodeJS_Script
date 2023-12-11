const fs = require('fs');
const csv = require('csv-parser');

// Funzione per calcolare il totale di un record
function calculateTotal(record) {
  const discountedPrice = record["Unit price"] * (1 - record["Percentage discount"] / 100);
  const total = discountedPrice * record["Quantity"];
  return roundToTwoDecimalPlaces(total);
}

// Funzione per calcolare la differenza tra il totale senza sconto e il totale con sconto
function calculateDiscountDifference(record) {
  const totalWithoutDiscount = record["Unit price"] * record["Quantity"];
  const totalWithDiscount = calculateTotal(record);
  return roundToTwoDecimalPlaces(totalWithoutDiscount - totalWithDiscount);
}

// Funzione per arrotondare un numero a due cifre decimali
function roundToTwoDecimalPlaces(number) {
  return Math.round(number * 100) / 100;
}

// Funzione principale per elaborare i record
function processRecords(records) {
  let highestTotalRecord = findRecordWithMaxValue(records, 'Total', calculateTotal);
  let highestQuantityRecord = findRecordWithMaxValue(records, 'Quantity', (record) => record['Quantity']);
  let highestDifferenceRecord = findRecordWithMaxValue(records, 'Difference', calculateDiscountDifference);

  // Stampa i record richiesti
  console.log("Record con importo totale più alto:");
  console.log(highestTotalRecord);
  console.log("Record con quantità più alta:");
  console.log(highestQuantityRecord);
  console.log("Record con maggior differenza tra totale senza sconto e totale con sconto:");
  console.log(highestDifferenceRecord);
}

// Funzione per trovare il record con il valore massimo in base a una chiave e una funzione di calcolo
function findRecordWithMaxValue(records, key, calculateValue) {
  let maxValue = 0;
  let maxRecord = null;

  for (const record of records) {
    const value = calculateValue(record);
    if (value > maxValue) {
      maxValue = value;
      maxRecord = record;
    }
  }

  return maxRecord;
}

// Array per memorizzare i record del file CSV
const records = [];

// Legge il file CSV usando il modulo csv
fs.createReadStream('ordine.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Aggiunge ogni record all'array records
    records.push(data);
  })
  .on('end', () => {
    // Elabora i record
    processRecords(records);
  })
  .on('error', (error) => {
    console.error('Errore durante la lettura del file CSV:', error);
  });

  

  
