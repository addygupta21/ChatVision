const User=require('./user')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { error, success } = require('./util');

const signupController=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!email || !password || !name){
           return res.send(error(400,'All Fields Are Required'));
        }

        const oldUser=await User.findOne({email});
        if(oldUser){
            return res.send(error(409,'User is already registered'));
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email, 
            password:hashedPassword
        });
        return res.send(success(201,'user created successfully'));
    }
    catch(e){
        return res.send(error(500, e.message || 'Internal Server Error'));
    }
}

const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log('Login attempt for email:', email);
        
        if(!email || !password){
            console.log('Missing credentials:', { email: !!email, password: !!password });
            return res.send(error(400,'All Fields Are Required'));
        }

        const oldUser=await User.findOne({email}).select('+password');
        console.log('User found:', !!oldUser);
        
        if(!oldUser){
            return res.send(error(404,'User is not registered'));
        }
        
        if(!oldUser.password) {
            console.log('Password field missing for user:', email);
            return res.send(error(500, 'Password field not found'));
        }

        const matched=await bcrypt.compare(password,oldUser.password);
        console.log('Password match result:', matched);
        
        if(!matched){
            return res.send(error(403,"Passwords doesn't match"));
        }
        
        try {
            if (!process.env.JWT_SECRET_KEY) {
                console.error('JWT_SECRET_KEY is not defined in environment variables');
                return res.send(error(500, 'Server configuration error'));
            }
            
            const accessToken=generateAccessToken({
                _id:oldUser._id,
            });
            console.log('Access token generated successfully');
            return res.send(success(201,{accessToken}));
        } catch (tokenError) {
            console.error('Token generation error:', {
                message: tokenError.message,
                stack: tokenError.stack,
                name: tokenError.name
            });
            return res.send(error(500, 'Failed to generate authentication token'));
        }
    }
    catch(e){
        console.error('Login error details:', {
            message: e.message,
            stack: e.stack,
            name: e.name
        });
        return res.send(error(500, e.message || 'Internal Server Error'));
    }
}

const logOutController=async(req,res)=>{
    try {
        res.clearCookie('jwt',{
            httpOnly:true,
            secure:true
        })
        return res.send(success(200,'user logged out'));
    } catch (e) {
        return res.send(error(500, e.message || 'Internal Server Error'));
    }
}

//internal function
const generateAccessToken=(data)=>{
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('JWT_SECRET_KEY is not configured');
    }
    try {
        const token=jwt.sign(data,process.env.JWT_SECRET_KEY,{
            expiresIn:'1hr'
        });
        return token;
    } catch (error) {
        console.error('JWT sign error:', error);
        throw error;
    }
}

module.exports={signupController,loginController,logOutController};