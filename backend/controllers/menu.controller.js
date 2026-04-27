import Menu from '../models/Menu.model.js';

// @desc    Get all menus
// @route   GET /api/menus
// @access  Public
export const getAllMenus = async (req, res) => {
  try {
    const { startDate, endDate, mealType } = req.query;
    
    let query = {};
    
    if (mealType) {
      query.mealType = mealType;
    }
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.date = { $gte: startDate };
    } else if (endDate) {
      query.date = { $lte: endDate };
    }

    const menus = await Menu.find(query).sort({ date: 1, mealType: 1 });
    res.json(menus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get menu by date
// @route   GET /api/menus/date/:date
// @access  Public
export const getMenuByDate = async (req, res) => {
  try {
    const menus = await Menu.find({ date: req.params.date }).sort({ mealType: 1 });
    res.json(menus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get menu by ID
// @route   GET /api/menus/:id
// @access  Public
export const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create new menu
// @route   POST /api/menus
// @access  Private/Admin
export const createMenu = async (req, res) => {
  try {
    const { date, mealType, items, timing } = req.body;

    const menu = await Menu.create({
      date,
      mealType,
      items,
      timing
    });

    res.status(201).json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update menu
// @route   PUT /api/menus/:id
// @access  Private/Admin
export const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const allowedUpdates = ['date', 'mealType', 'items', 'timing', 'isActive'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        menu[field] = req.body[field];
      }
    });

    const updatedMenu = await menu.save();
    res.json(updatedMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete menu
// @route   DELETE /api/menus/:id
// @access  Private/Admin
export const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    await menu.deleteOne();
    res.json({ message: 'Menu removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
