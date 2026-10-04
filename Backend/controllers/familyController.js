const FamilyMember = require("../models/FamilyMember");

// Add a new family member
const addFamilyMember = async (req, res) => {
  try {
    const { name, relation, age, gender, notes } = req.body;

    const member = await FamilyMember.create({
      owner: req.user.id,
      name,
      relation,
      age,
      gender,
      notes,
    });

    res.status(201).json({
      message: "Family member added successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all family members for the logged-in user
const getFamilyMembers = async (req, res) => {
  try {
    const members = await FamilyMember.find({ owner: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json({ members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a family member's details
const updateFamilyMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }

    if (member.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this record" });
    }

    const { name, relation, age, gender, notes, hasReminders } = req.body;
    member.name = name ?? member.name;
    member.relation = relation ?? member.relation;
    member.age = age ?? member.age;
    member.gender = gender ?? member.gender;
    member.notes = notes ?? member.notes;
    member.hasReminders = hasReminders ?? member.hasReminders;

    const updatedMember = await member.save();

    res.status(200).json({
      message: "Family member updated successfully",
      member: updatedMember,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a family member
const deleteFamilyMember = async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ message: "Family member not found" });
    }

    if (member.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this record" });
    }

    await member.deleteOne();

    res.status(200).json({ message: "Family member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFamilyMember,
  getFamilyMembers,
  updateFamilyMember,
  deleteFamilyMember,
};