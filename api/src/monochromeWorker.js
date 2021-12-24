const gm = require("gm");

const { workerData, parentPort } = require("worker_threads");

/* Convert the image to monochrome

Chain a call to monochrome() off of the call to gm() we made previously. 

Write the monochrome image to disk

Chain a call to write() off of the previous call to monochrome(). 
Pass in workerData.destination as the first argument. 
The second argument should be an anonymous function.*/
gm(workerData.source)
  .monochrome()
  .write(workerData.destination, (error) => {
    if (error) throw error;

    /* Send a message to the parent thread

        Also inside the function body, let's make a call to parentPort.postMessage(). 
        Pass in an object literal with a key of monochrome and the boolean value true. */
    parentPort.postMessage({ monochrome: true });
  });
