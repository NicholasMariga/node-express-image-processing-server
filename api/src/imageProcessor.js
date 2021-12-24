const path = require("path");

const { Worker, isMainThread } = require("worker_threads");

/* Resolve the path to the resize worker

Define a constant called pathToResizeWorker. 
Assign a call to path.resolve() to it. Pass in __dirname as the first argument, and 'resizeWorker.js' as 
the second. */
const pathToResizeWorker = path.resolve(__dirname, "resizeWorker.js");

/* Resolve the path to the monochrome worker

Define a constant  called pathToMonochromeWorker. 
Assign a call to path.resolve() to it. Pass in __dirname as the first parameter, and 'monochromeWorker.js' as 
the second. */
const pathToMonochromeWorker = path.resolve(__dirname, "monochromeWorker.js");

const imageProcessor = (filename) => {
  /* Define the source path*/
  const sourcePath = uploadPathResolver(filename);
  /* Define the resized photo's destination */
  const resizedDestination = uploadPathResolver("resized-" + filename);
  /* Define the resized photo's destination */
  const monochromeDestination = uploadPathResolver("monochrome-" + filename);
  /* Instantiate a new promise

Next, return a new Promise() from imageProcessor(). 
Let's pass an anonymous function to our promise. 
It should take resolve and reject as parameters. 
Inside of our function body, let's check if we are on the main thread using isMainThread. 
If we aren't on the main thread, make a call to reject() within an else block. 
Pass in new Error() with the message 'not on main thread' to the call to reject()  */

  let resizeWorkerFinished = false;
  let monochromeWorkerFinished = false;
  return new Promise((resolve, reject) => {
    if (isMainThread) {
      try {
        /* Instantiate the resizeWorker */
        const resizeWorker = new Worker(pathToMonochromeWorker, {
          workerData: { source: sourcePath, destination: resizedDestination },
        });
        /* Instantiate the monochromeWorker */
        const monochromeWorker = new Worker(pathToResizeWorker, {
          workerData: { source: sourcePath, destination: resizedDestination },
        });

        /* Register the on message event listener for the resize worker */
        resizeWorker.on("message", () => {
          resizeWorkerFinished = true;
          if(monochromeWorkerFinished){
            resolve("resizeWorker finished processing");
          }
          
        });

        /* Register the on error event listener for the resize worker */
        resizeWorker.on("error", (error) => {
          reject(new Error(error.message));
        });

        /* Register the on exit event listener for the resize worker */
        resizeWorker.on('exit', (code) =>{
            if(code !== 0){
                reject(new Error('Exited with status code ' + code));
            }
        });

        /* Register the on message event listener for the monochrome worker */
        monochromeWorker.on('message', (message) => {
            monochromeWorkerFinished = true;
            if(resizeWorkerFinished){
                resolve('monochromeWorker finished processing');
            }
        });

        /* Register the on error event listener for the monochrome worker */
        monochromeWorker.on('error',(error) => {
            reject(new Error(error.message))
        });

        /* Register the on exit event listener for the monochrome worker */
        monochromeWorker.on('exit', (code) => {
            if(code !== 0){
                reject(new Error('Exited with status code ' + code));
            }
        })

      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error("not on main thread"));
    }
  });
};

/* Create the upload path resolver function

Define a function called uploadPathResolver(). 
Pass in the parameter filename. It should return a call to path.resolve() passing in __dirname, 
'../uploads', and filename. */
const uploadPathResolver = (filename) => {
  return path.resolve(__dirname, "../uploads", filename);
};

module.exports = imageProcessor;
