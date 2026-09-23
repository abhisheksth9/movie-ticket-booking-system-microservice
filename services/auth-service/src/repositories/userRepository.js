const { User } = require("../../models");

class UserRepository {
    async findByEmail(email) {
        return User.findOne({ where: { email } });
    }

    async findByEmailAndRole(email, role) {
        return User.findOne({ where: { email, role } });
    }

    async findById(id, options = {}) {
        return User.findByPk(id, options);
    }

    async findAll(options = {}) {
        return User.findAll(options);
    }

    async create(data) {
        return User.create(data);
    }

    async delete(user) {
        return user.destroy();
    }
}

module.exports = new UserRepository();