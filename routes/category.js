"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  success,
  successList,
  failure,
} = require("../helper/responseHelper.js");
const { identityManager } = require("../middleware/auth.js");
const { CATEGORY_CONSTANTS } = require("../config/constant.js");
const { Category } = require("../models/category.js");

// Add Category (Create)
router.post("/add", identityManager(["admin", "superAdmin"]), async (req, res) => {
  try {
    const { name, isActive } = req.body;

    if (!name) {
      return failure(res, req.apiId, "Category name is required");
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return failure(res, req.apiId, CATEGORY_CONSTANTS.NAME_EXISTS);
    }

    const newCategory = new Category({
      name: name.trim(),
      isActive: isActive !== undefined ? isActive : true,
    });

    await newCategory.save();

    return success(res, req.apiId, CATEGORY_CONSTANTS.CREATE_SUCCESS, newCategory);
  } catch (error) {
    if (error.code === 11000) {
      return failure(res, req.apiId, CATEGORY_CONSTANTS.NAME_EXISTS);
    }
    return failure(res, req.apiId, error.message);
  }
});

// List Categories (Read)
router.get("/list", async (req, res) => {
  try {
    const { isActive } = req.query;

    const criteria = {};
    if (isActive !== undefined) {
      criteria.isActive = isActive === "true";
    }

    const list = await Category.find(criteria).sort({ name: 1 });

    return successList(
      res,
      req.apiId,
      CATEGORY_CONSTANTS.LIST_SUCCESS,
      list.length,
      list,
    );
  } catch (error) {
    return failure(res, req.apiId, error.message);
  }
});

// Get Category by ID
router.get("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return failure(res, req.apiId, CATEGORY_CONSTANTS.INVALID_CATEGORY_ID);
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return failure(res, req.apiId, CATEGORY_CONSTANTS.NOT_FOUND);
    }

    return success(res, req.apiId, CATEGORY_CONSTANTS.LIST_SUCCESS, category);
  } catch (error) {
    return failure(res, req.apiId, error.message);
  }
});

// Update Category
router.patch("/update/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return failure(res, req.apiId, CATEGORY_CONSTANTS.INVALID_CATEGORY_ID);
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return failure(res, req.apiId, CATEGORY_CONSTANTS.NOT_FOUND);
    }

    // Check if name is being changed and if it already exists
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({ name: name.trim() });
      if (existingCategory) {
        return failure(res, req.apiId, CATEGORY_CONSTANTS.NAME_EXISTS);
      }
      category.name = name.trim();
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    await category.save();

    return success(res, req.apiId, CATEGORY_CONSTANTS.UPDATE_SUCCESS, category);
  } catch (error) {
    if (error.code === 11000) {
      return failure(res, req.apiId, CATEGORY_CONSTANTS.NAME_EXISTS);
    }
    return failure(res, req.apiId, error.message);
  }
});

// Delete Category
router.delete("/delete/:id", identityManager(["admin", "superAdmin"]), async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return failure(res, req.apiId, CATEGORY_CONSTANTS.INVALID_CATEGORY_ID);
    }

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return failure(res, req.apiId, CATEGORY_CONSTANTS.NOT_FOUND);
    }

    return success(res, req.apiId, CATEGORY_CONSTANTS.DELETE_SUCCESS);
  } catch (error) {
    return failure(res, req.apiId, error.message);
  }
});

module.exports = router;
