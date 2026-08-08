async function main() {
  try {
    const res = await fetch('http://localhost:5000/api/cars');
    const json = await res.json();
    const car = json.data[0];
    if (!car) {
      console.log('No cars found in DB.');
      return;
    }
    console.log('Car ID:', car.id);
    console.log('Images type:', typeof car.images);
    console.log('Images value:', car.images);
    console.log('Images[0]:', car.images[0]);
  } catch (err) {
    console.error('API call failed. Make sure the server is running on 5000.', err);
  }
}

main();
