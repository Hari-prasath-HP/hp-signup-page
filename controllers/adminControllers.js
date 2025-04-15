const User = require('../models/user')
const bcrypt = require('bcryptjs');

// Admin details stored in environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

exports.routerAdminlogin = (req, res) => {
    if (req.session.logged) {
        return res.redirect("/adminDashboard");
    }
    const error = req.session.adminlogerr || null;
    req.session.adminlogerr = null; // Clear error after rendering
    res.render("admin/adminLogin", { error });
};

exports.handleAdminlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email or password is incorrect
        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            req.session.adminlogerr = "Invalid email or password";
            return res.redirect("/admin"); // Redirect back to login
        }

        // Successful login
        req.session.logged = true; // Set session status
        return res.redirect('/adminDashboard'); // Redirect to dashboard
    } catch (err) {
        console.error("Error during login:", err);

        // Handle unexpected errors
        req.session.adminlogerr = "An internal server error occurred. Please try again later.";
        return res.redirect('/adminLogin'); // Redirect to login on error
    }
};

exports.renderDashboard = (req, res) => {
    if (!req.session.logged) {
        return res.redirect("/adminLogin");
    }
    res.render("admin/adminDashboard");
};

exports.handleadminDashboard = async (req, res) => {
    try {
        if (!req.session.logged) {
            return res.redirect('/adminLogin'); // Redirect if not logged in
        }

        // Fetch all user details from the database
        const users = await User.find({});
        req.session.logged = true;
        // Ensure `users` is passed to the EJS view
        res.render('admin/adminDashboard', { users });
    } catch (err) {
        console.error("Error fetching user details:", err);
        res.status(500).send("Internal server error.");
    }
};

exports.handleadminLogout = async (req,res) =>{
    req.session.adminlogerr = null;
    req.session.logged = false;
    return res.redirect('/admin');
    };

exports.addUser = async (req,res)=>{
    try {
        const { username, email, phone, password } = req.body;
    
        // Validate input fields
        if (!username || !email || !phone || !password) {
            return res.status(400).json({ error: 'Name, email, phone and password are required.' });
        }
    
        // Check if the user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }
        //hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        // Create a new user if the email does not exist
        const newUser = new User({
            username,
            email,
            phone,
            password: hashedPassword, // You should hash the password in a real-world scenario using bcrypt
        });
    
        // Save the new user to the database
        await newUser.save();
    
        // Return success response
        res.status(201).json({ message: 'User added successfully.' });
    } catch (error) {
        console.error('Error in addUser:', error);
        res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }
};

exports.routeedit = async (req, res) => {
    const userId = req.params.id;
    // Fetch user data using `userId` from the database
    const user = await User.findById(userId);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    
    res.render('admin/edit', { userId: user });
};

//handle edit
exports.handleEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone } = req.body;

        // Validate the inputs
        if (!username || !email) {
            return res.status(400).json({ message: 'Username and email are required.' });
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            username,
            email,
            phone,
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.redirect('/adminDashboard'); // Redirect to the dashboard after successful update
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'An error occurred while updating the user.' });
    }
};

// Handle delete user
exports.handleDelete = async (req, res) => {
    try {
        const { id } = req.params;
        // Find and delete the user by id
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Redirect to the admin dashboard after deletion
        res.redirect('/adminDashboard');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'An error occurred while deleting the user.' });
    }
};

// Block user
exports.handleBlock = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the user by id and update the isBlocked field to true
        const blockedUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });

        if (!blockedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Redirect to the admin dashboard after blocking
        res.redirect('/adminDashboard');
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).json({ message: 'An error occurred while blocking the user.' });
    }
};

// Unblock user
exports.handleUnblock = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the user by id and update the isBlocked field to false
        const unblockedUser = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });

        if (!unblockedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Redirect to the admin dashboard after unblocking
        res.redirect('/adminDashboard');
    } catch (error) {
        console.error('Error unblocking user:', error);
        res.status(500).json({ message: 'An error occurred while unblocking the user.' });
    }
};

