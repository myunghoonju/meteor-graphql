import { Categories, Items } from "../collections";
import { currentDate } from "/imports/utils/formatDate";

const mutations = {
    // args.categoryName
    async addCategory(_, { categoryName }) {
        const categoryValue = {
            categoryName: categoryName
        }

        try {
            return await Categories.insert(categoryValue);
        } catch (e) {
            throw `addCategory error: ${e}`;
        }
    },

    async updateCategory(_, { _id, categoryName }) {
        const categoryValue = { categoryName: categoryName };
        try {
            return await Categories.update({ _id: id },{ $set: categoryValue });
        } catch (e) {
            throw `updateCategory error: ${e}`;
        }
    },

    async deleteCategory(_, { _id }) {
        try {
            return await Categories.remove(_id);
        } catch (e) {
            throw `deleteCategory error: ${e}`;
        }
    },

    async addItem(_, { itemName, itemPrice, itemImage, itemCategoryId }) {
        const newDate = currentDate();

        const values = {
            itemName: itemName,
            itemPrice: itemPrice,
            itemImage: itemImage,
            createdAt: newDate,
            itemCategoryId: itemCategoryId
        }

        try {
            const result = await Items.insert(values);
            values._id = result._id;
            return values;
        } catch (e) {
            throw `addItemError: ${e}`;
        }
    },

    async updateItem(_, { _id, itemName, itemPrice, itemImage, itemCategoryId }) {
        const values = {
            itemName: itemName,
            itemPrice: itemPrice,
            itemImage: itemImage,
            itemCategoryId: itemCategoryId
        }

        try {
            const result = await Items.update({_id: _id}, {$set: values});
            values._id = result._id;
            return values;
        } catch (e) {
            throw `updateItem: ${e}`;
        }
    },

    async deleteItem(_, { _id }) {
        try {
            await Items.remove(_id);
            return _id;
        } catch (e) {
            throw `deleteItem error: ${e}`;
        }
    },

    async uploadFile(_, {  }) {

    },

    // async deleteFile(_, {  }) {
    //
    // }
}

export default mutations;