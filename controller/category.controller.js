var Category = require("../models/category.model");

async function getAllCategory() {
  return await Category.findAll();
}

async function createCategory(category) {
  return await Category.create(category);
}

async function updateCategory(category) {
  return await Category.update(category, {
    where: { id: category.id },
  });
}

async function deleteCategory(id) {
  return await Category.destroy({
    where: { id },
  });
}

module.exports = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
