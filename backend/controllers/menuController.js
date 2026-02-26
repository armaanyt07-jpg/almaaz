const MenuItem = require("../models/MenuItem");

// GET /api/menu
const getMenuItems = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/menu/:id
const getMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/menu (Admin)
const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image, available } = req.body;

        if (!name || !description || price === undefined || !category) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const item = await MenuItem.create({
            name,
            description,
            price,
            category,
            image,
            available,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/menu/:id (Admin)
const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        const fields = ["name", "description", "price", "category", "image", "available"];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                item[field] = req.body[field];
            }
        });

        const updated = await item.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/menu/:id (Admin)
const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: "Menu item deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMenuItems,
    getMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
};
