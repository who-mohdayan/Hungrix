import User from '../models/User.model.js';

// @desc    Get all students
// @route   GET /api/users/students
// @access  Private/Admin
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/users/students/:id
// @access  Private/Admin
export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/users/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const allowedUpdates = ['name', 'email', 'hostel', 'room', 'isActive', 'accountabilityScore', 'attendanceRate'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    const updatedStudent = await student.save();
    res.json(updatedStudent.getPublicProfile());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/users/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.deleteOne();
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get student statistics
// @route   GET /api/users/students/:id/stats
// @access  Private
export const getStudentStats = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // You can add more statistics here
    const stats = {
      accountabilityScore: student.accountabilityScore,
      attendanceRate: student.attendanceRate,
      totalBookings: student.totalBookings
    };

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
