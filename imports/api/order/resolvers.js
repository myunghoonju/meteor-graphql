import Orders from './collections'
import {currentDate} from '/imports/utils/formatDate';

const queries = {
    // _(parent): 부모로 부터 전달받은 값
    // args: 클라이언트에서 query, mutation을 사용할 때 서버로 전달하는 값
    // context: 모든 resolver에 공통으로 전달되는 값(header, authorization key etc..,)
    // info: 현재 필드의 특정 정보, 잘안씀
    async orders(_, args, context, info) {
        try {
            return await Orders.find({
                orderDate: {"$gte": new Date()}
            });
        } catch (e) {
            throw `orders query error: ${e}`;
        }
    }
}

const mutations = {
    async addOrder(_, { orderPriceSum, orderCount, orderItems }, { user }, info) {
        const newDate = currentDate();

        let orderValues = {
            orderDate: newDate,
            orderPriceSum: orderPriceSum,
            orderCount: orderCount,
            orderItems: orderItems,
            orderState: false
        }

        try {
            return await Orders.insert(orderValues);
        } catch (e) {
            throw `orders add error: ${e}`;
        }
    },

    async checkOrder(_, {_id, orderState}, { user }, info) {
        const changeOrderState = {
            orderState: !orderState,
        }

        try {
            await Orders.update({_id: _id}, {$set: changeOrderState});
            return _id;
        } catch (e) {
            throw `checkOrder update error: ${e}`;
        }
    }
}

const resolvers = {
    Query: queries,
    Mutation: mutations
}

export default resolvers;