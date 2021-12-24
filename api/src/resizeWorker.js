const gm = require("gm");

const { workerData, parentPort } = require("worker_threads");



/* Resize the photo to be 100px by 100px 
Write the resized image to disk 
handle errors with anonymous function*/
gm(workerData.source)
  .resize(100, 100)
  .write(workerData.destination, (error) => {
      if(error) throw error;

      /* Send a message to the parent thread
        Also inside the function body, let's make a call to parentPort.postMessage(). 
        Pass in an object literal with a key of resized and the boolean value true. */
      parentPort.postMessage({resized: true});
  });
