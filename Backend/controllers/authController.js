const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check karo user pehle se exist toh nahi karta
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Password ko hash karo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Naya user create karo
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "patient",
    });

    // JWT token generate karo
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User ko database mein dhundo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Password match karo (hashed wale se compare)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // JWT token banao
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update logged-in user's profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, gender, specialty, qualification, experience, clinicAddress, availability } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (specialty !== undefined) user.specialty = specialty;
    if (qualification !== undefined) user.qualification = qualification;
    if (experience !== undefined) user.experience = experience;
    if (clinicAddress !== undefined) user.clinicAddress = clinicAddress;
    if (availability !== undefined) user.availability = availability;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        specialty: updatedUser.specialty,
        qualification: updatedUser.qualification,
        experience: updatedUser.experience,
        clinicAddress: updatedUser.clinicAddress,
        availability: updatedUser.availability,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
