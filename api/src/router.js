const { Router } = require("express");
const multer = require("multer");

const router = Router();

/* Write the filename handler function

Let's write a function called filename. It should take request, file, and callback as its parameters. 
Inside the function body make a call to callback() passing in null as the first argument and 
file.originalname as the second argument. */

/* function filename (request, file, callback){
    callback(null, file.originalname);
} */
const filename = (request, file, callback) => {
  callback(null, file.originalname);
};
/* 
Configure Multer diskStorage

Next after the express require, let's require multer. Declare a constant called storage. 
Assign to it a call to the diskStorage() method of multer. Pass an object literal as the only argument. 
The object literal should have two properties: the first with a key of destination and a value of 'api/uploads/';
 the second with a key of filename and a value of filename. 
 Note: the 2nd property is referring to the filename function */
const storage = multer.diskStorage({
  destination: "api/uploads/",
  filename: filename,
});
/* Create the MIME type file filter

Declare a function called fileFilter. It should take request, file, and callback as parameters. 
Inside the function body declare an if statement that runs its code block if file.mimetype does 
not strictly equal 'image/png'. Inside the if block, let's assign to request.fileValidationError 
the string 'Wrong file type'. Then, make a call to the callback() parameter, passing in null, 
false, and a new Error object with the message 'Wrong file type'. 
Next, in an else block, let's call callback(), passing in null as the first argument, and true as the second. */
const fileFilter = (request, file, callback) => {
  if (file.mimetype !== "image/png") {
    request.fileValidatorError = "Wrong file type";
    callback(null, false, new Error("Wrong file type"));
  } else {
    callback(null, true);
  }
};

/* Define the upload callback

Declare a constant named upload. Assign to upload a call to multer(), passing in an object literal. 
This object literal will have two properties. It's first property will be the key fileFilter which 
refers to our fileFilter() function. Its second property has a key called storage, and whose value
 is our storage constant. */
const upload = multer({
  fileFilter,
  storage,
});

/* Create the upload route

Back in router.js, call the post() method of our router object. 
Let's pass the route '/upload' as its first argument. 
The second argument should be a call to the upload object's method single(), 
passing in the string 'photo'. The third argument is an anonymous function 
that takes request and response as parameters. Inside the function body, */
router.post(
  "/upload",
  upload.single("photo", (request, response) => {
    /* check if the request object has a fileValidationError property. 
    If it does return a call to response.status(), passing in 400 as the lone argument. 
    Chain a call to json(), passing in an object literal with a key of error and
     a value of request.fileValidationError. */
    if (request.fileValidatorError) return response.status(400).json({ error: request.fileValidatorError });
    
    /* Respond with a 201

            If there is no fileValidationError on request, let's return a call to response.status(), passing in 201. 
            Let's chain a call to json(), passing in an object literal with a key of success and 
            the boolean value true. */
    return response.status(201).json({ success: true });
  })
);

module.exports = router;
