const User = require("../model/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");

// Register
router.post("/register", async (req, res) => {
    console.log('req: ' + req?.body?.userName, req?.body?.password);
    const newUser = new User({
        userName: req.body.userName,
        email: req.body.email,
        // password: req.body.password
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString()
    });
    console.log("After Crypto: " + newUser);
    // save the user in the DB
    try {
        const savedUser = await newUser.save()
        console.log(savedUser);
        res.status(201).json(savedUser);
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
})

// Login
// var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
// ​var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");

router.post("/login", async(req, res) => {
    try {
        const user = await User.findOne({userName: req.body.userName});
        console.log(user);
        !user && res.status(401).json("User not found.");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        originalPassword !== req.body.password && 
            res.status(401).json("Wrong Credentials");
        
        const { password, ...others } = user._doc;

        res.status(200).json(others);
    } catch(err) {
        console.log(err);
    }
})
module.exports = router;