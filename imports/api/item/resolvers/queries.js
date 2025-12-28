import { Categories, Items } from "../collections";
import { ALL } from 'imports/utils/constants';

const pageSize = 15;

const queries = {
    async categories(_, args, context, info) {
        try {
            return await Categories.find();
        } catch (e) {
            throw `category errors: ${e}`;
        }
    },

    async item(_, args, context, info) {
        const _id = args._id;
        try {
            return await Items.findOne(_id);
        } catch (e) {
            throw `item errors: ${e}`;
        }
    },

    async items(_, args, context, info) {
        const limit = pageSize;
        let skip = 0;
        let pageNumber = 0;
        let setFilters = {};
        let setOptions = {};

        if (args.pageNumber) {
            pageNumber = Number(args.pageNumber);
        }

        if (pageNumber <= 1) {
            skip = 0;
        } else {
            skip = (pageNumber - 1) * limit;
        }

        let search = '';
        if (args.search) {
            search = args.search;
        }

        if (search) {
            setFilters.itemName = RegExp(search); // *search*
        }

        let itemCategoryId = '';
        if (args.itemCategoryId) {
            itemCategoryId = args.itemCategoryId;
        }

        if (itemCategoryId === ALL) {
            itemCategoryId = '';
        }

        if (itemCategoryId) {
            setFilters.itemCategoryId = itemCategoryId;
        }

        setOptions.limit = limit;
        setOptions.skip = skip;
        setOptions.sort = { 'createdAt': -1 }; // descending (1 == ascending)

        try {
            return await Items.find(setFilters, setOptions);
        } catch (e) {
            throw `itemPageCount errors: ${e}`;
        }
    },

    async itemPageCount(_, args, context, info) {
        let search = '';
        let setFilters = {};

        if (args.search) {
            search = args.search;
        }

        if (search) {
            setFilters.itemName = RegExp(search);
        }

        let itemCategoryId = '';
        if (args.itemCategoryId) {
            itemCategoryId = args.itemCategoryId;
        }

        if (itemCategoryId === ALL) {
            itemCategoryId = '';
        }

        if (itemCategoryId) {
            setFilters.itemCategoryId = itemCategoryId;
        }

        try {
            const cnt = Items.find(setFilters).count();
            return Math.ceil(cnt / pageSize);
        } catch (e) {
            throw `itemPageCount errors: ${e}`;
        }
    }
}

export default queries;