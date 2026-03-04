const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('Using URL:', process.env.MONGO_URL.replace(/:[^:@]+@/, ':****@')); // Hide password

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('✅ SUCCESS! MongoDB connected successfully!');
        console.log('✅ Database is ready to use!');
        process.exit(0);
    })
    .catch((error) => {
        console.log('❌ FAILED! MongoDB connection error:');
        console.log('Error:', error.message);
        console.log('\n🔧 Fix by whitelisting your IP in MongoDB Atlas:');
        console.log('   1. Go to https://cloud.mongodb.com/');
        console.log('   2. Click Network Access');
        console.log('   3. Add IP Address: 0.0.0.0/0 (or your current IP)');
        console.log('   4. Wait 30-60 seconds and try again');
        process.exit(1);
    });
