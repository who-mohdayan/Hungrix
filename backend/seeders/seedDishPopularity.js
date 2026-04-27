import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DishPopularity from '../models/DishPopularity.model.js';
import dishPopularityData from './dishPopularityData.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-food-db';

const normalizeDishName = (name) => String(name)
  .toLowerCase()
  .replace(/\([^)]*\)/g, ' ')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const seedDishPopularity = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const docs = dishPopularityData.map((dish) => ({
      ...dish,
      normalizedName: normalizeDishName(dish.name),
    }));

    const bulkOps = docs.map((doc) => ({
      updateOne: {
        filter: { normalizedName: doc.normalizedName },
        update: {
          $set: {
            name: doc.name,
            popularityScore: doc.popularityScore,
            category: doc.category,
            normalizedName: doc.normalizedName,
          },
        },
        upsert: true,
      },
    }));

    const result = await DishPopularity.bulkWrite(bulkOps);

    console.log(`Dish popularity scores upserted: ${docs.length}`);
    console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding dish popularity scores:', error);
    process.exit(1);
  }
};

seedDishPopularity();
