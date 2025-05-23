const mongoose=require('mongoose');

module.exports=async()=>{
    const mongoUri='mongodb+srv://addygupta:AddyAddy%402121@cluster0.nmj0pb5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    try{
        const connect=await mongoose.connect(mongoUri,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        });
        console.log('MongoDB Connected: '+connect.connection.host);
    }
    catch(e){
        console.log(e);
        process.exit(1);
    }
}