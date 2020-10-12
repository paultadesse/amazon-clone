const router = require('express').Router();
const Product = require('../models/product');
const cloudinay = require('../middlewares/upload-photo');


// POST request - create a new product
router.post('/products', async(req, res) => {    
    

    try {
        let product = new Product();
        const file  = req.files.photo;
        let photoURL = "";

        await cloudinay.uploader.upload(file.tempFilePath, (err, result)=> {
            console.log(err);
            // console.log("THIS IS UPLOADED IN THE CLOUDINARY",res['url']);

            photoURL = result['url'];
            
            // console.log(photoURL); 
        });
        
        console.log("UPLOADED TO MONGO ?---------------", photoURL);

        //Later Do the Logic if the image is empty...but make it reqiure in the frontend will also do the job !!

        product.title = req.body.title;
        product.description = req.body.description;
        product.photo = photoURL;
        product.price = req.body.price;
        product.stockQuantity = req.body.stockQuantity;

        await product.save()

        res.json({
            status: true,
            message: "Successfully saved"
        });
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }

});

    // GET request - get all products

router.get('/products', async(req, res) => {
    try {
        const products = await Product.find();

        res.json({
            success:true,
            products: products
        });

    } catch (er) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

    // GET request - get a single product

router.get('/products/:id', async(req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });

        res.json({
            success:true,
            product: product
        });

    } catch (er) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

    // PUT request - Update a single product

router.put('/products/:id', async(req, res) => {
    try {
        const file  = req.files.photo;
        let photoURL = "";

        await cloudinay.uploader.upload(file.tempFilePath, (err, result)=> {
            console.log(err);
            // console.log("THIS IS UPLOADED IN THE CLOUDINARY",res['url']);

            photoURL = result['url'];
            
            // console.log(photoURL); 
        });
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id }, 
            {
            $set: {
                title: req.body.title,
                price: req.body.price,
                category: req.body.categoryID,
                photo: photoURL,
                description: req.body.description,
                owner: req.body.ownerID
            }
        }, {upsert: true});

        res.json({
            success:true,
            updatedProduct: product
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

    // DELETE request - delete a single product

router.get('/products/:id', async(req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });

        if (deletedProduct) {
            res.json({
                success:true,
                message: "Successfully deleted"
            });
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});



    module.exports = router;