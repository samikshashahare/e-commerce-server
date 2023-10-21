import express from 'express';
import mongoose ,{model, Schema}from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());

const PORT = 8080;

const  MONGODB_URI = '';

const connectMongoDB = async()=>{
   const conn = await mongoose.connect(process.env.MONGODB_URI);
   if(conn){
    console.log('MongoDB connected successfully');
   }
}
connectMongoDB();

const productSchema = new Schema({
    name : String,
    description : String,
    price: Number,
    brand:String,
    productimage: String,
});

const Product = model('Product', productSchema);

app.get('/products', async(req, res) => {
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
    name:name,
    description:description,
    price:price,
    productimage:productimage,
    brand:brand
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

app.get('/product', async(req, res)=>{
const {name} = req.query;

const findProduct = await Product.findOne({
    name:name
})

res.json({
    success:true,
    data:findProduct,

    message : 'successfully fetched product'
})

});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})