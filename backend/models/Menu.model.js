import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner'],
    required: true
  },
  items: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'Menu must have at least one item'
    }
  },
  timing: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Prevent duplicate menus for same date and meal type
menuSchema.index({ date: 1, mealType: 1 }, { unique: true });

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
