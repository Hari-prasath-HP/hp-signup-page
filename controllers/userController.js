const User = require('../models/user');
const bcrypt = require('bcryptjs');

//render sign-up page
exports.renderSignup = (req,res) =>{
  if(req.session.logstate){
    return res.redirect("/home")
  };
            const error = req.session.signerr || null;
            req.session.signerr = null;
            res.render("user/signup",{error});
}

//handle sign-up page
exports.handleSignup = async (req,res) =>{
    const { username,email,phone,password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            req.session.signerr="Email already Exist"
            return res.redirect("/signup")
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User ({
            username,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();

        return res.redirect('/');
    } catch (err) {
        console.error("Error during sign-up:", err);

        // Handle unexpected errors
        req.session.signerr = "An internal server error occurred. Please try again later.";
        return res.redirect('/signup');
    }
};

//render Login page
exports.renderLogin = (req,res) =>{
    if(req.session.logstate){
        return res.redirect("/home")
      };
    const error = req.session.loginerr || null;
    req.session.loginerr = null;
    res.render("user/login",{error});
}

//handle Login page
exports.handleLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        req.session.loginerr = 'Invalid email or password';
        return res.redirect('/'); // Redirect to login with error
      }
  
      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        req.session.loginerr = 'Invalid email or password';
        return res.redirect('/'); // Redirect to login with error
      }
  
      // Set session details
      req.session.user = {
        id: user._id, // Only store the ID in session
      };
  
      req.session.logstate = true;
      // Redirect to home page after successful login
      return res.redirect('/home');
    } catch (err) {
      console.error('Error during login:', err);
  
      // Handle unexpected errors
      req.session.loginerr = 'An internal server error occurred. Please try again later.';
      return res.redirect('/login');
    }
  };

  exports.Login = async(req,res)=>{
    res.redirect("/")
  }

  exports.renderHomepage = async (req,res) =>{
    if(!req.session.user){
        return res.redirect("/login");
    }

    try{
        const user = await User.findById(req.session.user.id);

        if(!user){
            return res.status(400).send('User not found');
        }
        res.render('user/home',{
            username: user.username, 
            phone: user.phone 
        })
    }catch(err){
        console.error('Error fetching user data:', err);
        return res.status(500).send('An internal server error occurred');
    }
  };

  exports.handleLogout = async (req,res) =>{
    req.session.signerr = null;
    req.session.loginerr = null;
    req.session.user = null;
    req.session.logstate = false;
    return res.redirect('/');

    };

