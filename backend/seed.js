const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const MenuItem = require("./models/MenuItem");

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding...");

        // Clear existing data
        await User.deleteMany({});
        await MenuItem.deleteMany({});

        // Create admin user
        const admin = await User.create({
            name: "Admin",
            email: "admin@almaaz.com",
            password: "admin123",
            role: "admin",
        });
        console.log("Admin user created:", admin.email);

        // Create sample customer
        await User.create({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            role: "customer",
        });
        console.log("Sample customer created");

        // Seed menu items
        const menuItems = [
            // Starters
            {
                name: "Hummus Royale",
                description:
                    "Creamy chickpea dip with tahini, olive oil, and smoked paprika, served with warm pita.",
                price: 8.99,
                category: "Starters",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Hummus+Royale",
            },
            {
                name: "Lamb Samosa",
                description:
                    "Crispy pastry parcels filled with spiced minced lamb, peas, and herbs.",
                price: 10.99,
                category: "Starters",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Lamb+Samosa",
            },
            {
                name: "Falafel Platter",
                description:
                    "Golden fried chickpea patties served with tahini sauce and pickled veggies.",
                price: 9.49,
                category: "Starters",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Falafel+Platter",
            },
            // Mains
            {
                name: "Grilled Lamb Chops",
                description:
                    "Tender lamb chops marinated in Middle Eastern spices, grilled to perfection.",
                price: 24.99,
                category: "Mains",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Lamb+Chops",
            },
            {
                name: "Chicken Shawarma",
                description:
                    "Slow-roasted chicken wrapped in flatbread with garlic sauce and pickles.",
                price: 16.99,
                category: "Mains",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Shawarma",
            },
            {
                name: "Mixed Grill Platter",
                description:
                    "A royal assortment of kebabs, tikka, and grilled meats served with saffron rice.",
                price: 28.99,
                category: "Mains",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Mixed+Grill",
            },
            // Desserts
            {
                name: "Baklava",
                description:
                    "Layers of flaky phyllo pastry filled with pistachios and drizzled with honey syrup.",
                price: 7.99,
                category: "Desserts",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Baklava",
            },
            {
                name: "Kunafa",
                description:
                    "Warm cheese pastry soaked in sweet syrup, topped with crushed pistachios.",
                price: 9.99,
                category: "Desserts",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Kunafa",
            },
            // Beverages
            {
                name: "Turkish Coffee",
                description:
                    "Rich, aromatic coffee brewed in a traditional cezve, served with a side of lokum.",
                price: 4.99,
                category: "Beverages",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Turkish+Coffee",
            },
            {
                name: "Fresh Mint Lemonade",
                description:
                    "Refreshing blend of fresh lemon, mint leaves, and a hint of honey.",
                price: 5.49,
                category: "Beverages",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Mint+Lemonade",
            },
            // Specials
            {
                name: "Al-Maaz Royal Feast",
                description:
                    "Chef's signature platter with lamb mansaf, mixed mezze, grilled halloumi, and saffron rice.",
                price: 45.99,
                category: "Specials",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Royal+Feast",
            },
            {
                name: "Seafood Tagine",
                description:
                    "Slow-cooked seafood medley in a fragrant tomato and saffron tagine sauce.",
                price: 32.99,
                category: "Specials",
                image: "https://placehold.co/400x300/1a1a2e/e0a96d?text=Seafood+Tagine",
            },
        ];

        await MenuItem.insertMany(menuItems);
        console.log(`${menuItems.length} menu items seeded`);

        console.log("\nSeeding complete!");
        console.log("Admin login: admin@almaaz.com / admin123");
        console.log("Customer login: john@example.com / password123");

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error.message);
        process.exit(1);
    }
};

seedData();
