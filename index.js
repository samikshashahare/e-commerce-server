import express from 'express';
import mongoose, { model, Schema } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());

const PORT = 8080;

const MONGODB_URI = '';

const connectMongoDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn) {
        console.log('MongoDB connected successfully');
    }
}
connectMongoDB();

const productSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    brand: String,
    productimage: String,
});

const Product = model('Product', productSchema);

app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json({
        success: true,
        data: products,
        message: 'student data fetched successfully'
    })
});

app.post('/products', async (req, res) => {

    const { name, description, price, brand, productimage } = req.body;

    const newProduct = new Product({
        name: name,
        description: description,
        price: price,
        productimage: productimage,
        brand: brand
    })

    const savedProducts = await newProduct.save();

    res.json(
        {
            success: true,
            data: savedProducts,
            message: 'new product added successfuly'
        }
    )

})

app.get('/product', async (req, res) => {
    const { name } = req.query;

    const findProduct = await Product.findOne({
        name: name
    })

    res.json({
        success: true,
        data: findProduct,

        message: 'successfully fetched product'
    })

});

app.delete('/product/:_id', async (req, res) => {
    const { _id } = req.params;

    await Product.deleteOne({ _id: _id });

    res.json({
        success: true,
        data: {},
        message: `product deleted successfully with id ${_id}`
    })
})

app.put('/product/:_id', async (req, res) => {
    const { _id } = req.params;
    const { name, description, price, productimage, brand } = req.body;


    await Product.updateOne(
        { _id: _id },
        {
            $set: {
                name: name,
                description: description,
                price: price,
                productimage: productimage,
                brand: brand
            }
        })

    const updatedproduct = await Product.findOne({_id: _id})

    res.json({
        success:true,
        data:updatedproduct,
        message:'product updated successfully '
    })
})

app.patch('/product/:_id', async(req, res)=>{
    const {_id} = req.params;
    const { name, description, price, productimage, brand} = req.body;

    //findOne({_id: _id}) =  findById(_id) it is mongoose library feature which is little bit faster than first querry method
    const findProduct = await Product.findById(_id);

    if(name){
        Product.name = name;
    }
    if(description){
        Product.description =description;
    }
    if(price){
        Product.price = price;
    }
    if(productimage){
        Product.productimage= productimage;
    }
    if(brand){
        Product.brand = brand;
    }

    const updatedProduct = await findProduct.save();

    res.json({
        success:true,
        data: updatedProduct,
        message:'successfully updated'
    })
});



app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})